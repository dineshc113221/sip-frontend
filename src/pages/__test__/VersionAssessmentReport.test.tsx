/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import VersionAssessmentReport from '../../pages/VersionAssessmentReport'; 
import { useParams } from 'react-router-dom';
import * as hooksVersion from '../../hooks/useVersionAssessmentResult';
import * as hooksProduct from '../../hooks/UseGetProductDetails';
import * as genericFunctions from '../../helper/GenericFunctions';
import { toast } from 'react-toastify';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../assets/images/Sustainable-Innovation-Tool-Logo-With-Endorsement-Line.svg', () => 'logo.svg');
jest.mock('../../assets/images/lock-out-warning.svg', () => 'lock-out.svg');
jest.mock('../../assets/images/large_great_job.svg', () => 'great-job.svg');
jest.mock('../../assets/images/arrow_full_small_red.svg', () => 'arrow-red.svg');
jest.mock('../../assets/images/arrow_full_small_down_green.svg', () => 'arrow-green.svg');
jest.mock('../../assets/images/warning_dials.svg', () => 'warning.svg');
jest.mock('../../assets/images/dials_without_data.svg', () => 'no-data.svg');
jest.mock('../../assets/images/calculationFailed.svg', () => 'calc-failed.svg');

jest.mock('../../assets/css/version-history-report-dashboard.css', () => ({}));
jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));

jest.mock('@amcharts/amcharts5', () => ({
  Root: {
    new: jest.fn().mockReturnValue({
      setThemes: jest.fn(),
      container: {
        children: {
          push: jest.fn().mockReturnValue({
            children: { unshift: jest.fn() },
            series: {
              push: jest.fn().mockReturnValue({
                set: jest.fn(),
                ticks: { template: { set: jest.fn() } },
                labels: { template: { set: jest.fn() } },
                slices: { template: { set: jest.fn() } },
                data: { setAll: jest.fn() },
              })
            },
            seriesContainer: {
              children: { push: jest.fn() }
            }
          })
        }
      },
      dispose: jest.fn(),
      _logo: { dispose: jest.fn() }
    }),
  },
  color: jest.fn(),
  ColorSet: { new: jest.fn() },
  Label: { new: jest.fn() },
  Picture: { new: jest.fn() },
  percent: jest.fn(),
  p50: 50,
}));

jest.mock('@amcharts/amcharts5/percent', () => ({
  PieChart: { new: jest.fn() },
  PieSeries: { new: jest.fn() }
}));

jest.mock('@amcharts/amcharts5/themes/Animated', () => ({
  new: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

jest.mock('../../hooks/useVersionAssessmentResult');
jest.mock('../../hooks/UseGetProductDetails');

jest.mock('../../helper/GenericFunctions');
jest.mock('../../components/results/commonComponents/TabsDesign', () => ({
    TabValueRow: ({ heading, percentage }: any) => (
        <div data-testid="tab-value-row">
            <span>{heading}</span>
            <span>{percentage}</span>
        </div>
    ),
}));

describe('VersionAssessmentReport', () => {
  const mockParams = {
    productId: 'prod-123',
    assessmentType: 'productEnvironmental',
    assessmentId: 'assess-123',
    versionNumber: '1',
  };

  const mockProductData = [{
    assessments: { baseline: { name: 'Baseline Product v1' } },
    brandName: 'Test Brand',
  }];

  const mockAssessmentData = [{
    details: {
      name: 'Test Assessment',
      assessmentId: 'assess-123',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    productId: 'prod-123',
    productName: 'Test Product',
    user: [{ name: 'John Doe' }],
  }];

  const mockVersionResultData = {
    data: {
      productEnvironmental: {},
      baseline: {},
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue(mockParams);
    
    (hooksProduct.useGetProductDetailByID as jest.Mock).mockReturnValue({ data: mockProductData });
    (hooksProduct.useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({ data: mockAssessmentData });
    (hooksVersion.useFetchVersionBasedResult as jest.Mock).mockReturnValue({ 
      data: mockVersionResultData, 
      isFetching: false, 
      error: null 
    });

    (genericFunctions.getRawMaterialDataFormulation as jest.Mock).mockReturnValue([]);
    (genericFunctions.extractDialData as jest.Mock).mockReturnValue({
      pie_chart_percentage: "50",
      pie_chart_sub_title: "Good",
      PieChartJSONSeries1: []
    });
    (genericFunctions.calculateFootprintTabs as jest.Mock).mockReturnValue({
      formulation: { percentage: 10 },
      packaging: { percentage: -5 },
    });
    (genericFunctions.capitalizeFirstLetter as jest.Mock).mockImplementation((str) => str);
  });

  test('renders loading spinner when fetching data', () => {
    (hooksVersion.useFetchVersionBasedResult as jest.Mock).mockReturnValue({
      data: null,
      isFetching: true,
      error: null
    });

    render(<VersionAssessmentReport />);
    
    const loader = document.querySelector('.loaderCss');
    expect(loader).toBeInTheDocument();
  });

  test('renders header information correctly', async () => {
    render(<VersionAssessmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Assessment')).toBeInTheDocument();
      expect(screen.getByText(/Baseline Product: Baseline Product v1/)).toBeInTheDocument();
      expect(screen.getByText(/Brand: Test Brand/)).toBeInTheDocument();
    });
  });

  test('renders "Great Job" alert when all dial statuses are good', async () => {
    (genericFunctions.extractDialData as jest.Mock).mockReturnValue({
      pie_chart_percentage: "10",
      pie_chart_sub_title: "Good",
      PieChartJSONSeries1: []
    });

    render(<VersionAssessmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Great Job!')).toBeInTheDocument();
      expect(screen.getByText("This product meets Kenvue's sustainable product innovation commitment.")).toBeInTheDocument();
    });
  });

  test('renders "Look out!" alert when at least one dial status is Poor', async () => {
    (genericFunctions.extractDialData as jest.Mock).mockImplementation((_current, _baseline, type) => {
        if (type === 'greenChemistry') {
            return {
                pie_chart_percentage: "-10",
                pie_chart_sub_title: "Poor",
                PieChartJSONSeries1: []
            };
        }
        return {
            pie_chart_percentage: "10",
            pie_chart_sub_title: "Good",
            PieChartJSONSeries1: []
        };
    });

    render(<VersionAssessmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Look out!')).toBeInTheDocument();
      expect(screen.getByText("This product does not meet Kenvue's sustainable innovation commitment.")).toBeInTheDocument();
    });
  });

  test('renders Metric Rows correctly for Product Environmental Footprint', async () => {
    (genericFunctions.calculateFootprintTabs as jest.Mock).mockReturnValue({
        formulation: { percentage: 25 },
        packaging: { percentage: -10 },
      });

    render(<VersionAssessmentReport />);

    await waitFor(() => {
        // Formulation: +25%
        expect(screen.getAllByText('+25%')).toBeTruthy();
        // Packaging: -10%
        expect(screen.getAllByText('-10%')).toBeTruthy();
    });
  });

  test('handles Green Chemistry calculations and display', async () => {
    const gcMockResult = {
        data: {
            productEnvironmental: {
                watchlist: { watchlist_score: '2', max_watchlist_score: '2' },
                gaia_score: { step_8_fml_GAIA_score: 50 },
                renewable_feedback_stock: { renewable_feedstock_total: 0.5 },
                green_chemistry_rollup: { step_6_final_score_with_5_watchlist: 80 }
            },
            baseline: {
                watchlist: { watchlist_score: '1' },
                gaia_score: { step_8_fml_GAIA_score: 40 },
                renewable_feedback_stock: { renewable_feedstock_total: 0.4 },
                baseline_green_chemistry_rollup: { step_5_final_score: 70 }
            }
        }
    };

    (hooksVersion.useFetchVersionBasedResult as jest.Mock).mockReturnValue({
      data: gcMockResult.data,
      isFetching: false,
      error: null
    });

    render(<VersionAssessmentReport />);
  });

  test('displays error toast and error component on API failure', async () => {
    const errorMsg = "Simulated Server Error";
    (hooksVersion.useFetchVersionBasedResult as jest.Mock).mockReturnValue({
      data: null,
      isFetching: false,
      error: { response: { data: { message: errorMsg } } }
    });

    render(<VersionAssessmentReport />);

    await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(errorMsg);
    });

    expect(screen.getByTestId('error-message-label')).toHaveTextContent('Something went wrong');
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  test('displays special error when baseline calculation fails', async () => {
    const errorMsg = "Oops! Something went wrong in the baseline calculation. Check data.";
    (hooksVersion.useFetchVersionBasedResult as jest.Mock).mockReturnValue({
      data: null,
      isFetching: false,
      error: { response: { data: { message: errorMsg } } }
    });

    render(<VersionAssessmentReport />);

    await waitFor(() => {
        expect(screen.getByTestId('error-message-label')).toHaveTextContent('Oops! Something went wrong in the baseline calculation');
    });
  });

  test('Formulation/Packaging formatted value renders green arrow for negative percentage', async () => {
     (genericFunctions.calculateFootprintTabs as jest.Mock).mockReturnValue({
        formulation: { percentage: -15 }, 
        packaging: { percentage: 0 },
      });

      render(<VersionAssessmentReport />);
      
      await waitFor(() => {
        const arrowImages = screen.getAllByAltText('Arrow');
        expect(arrowImages[0]).toHaveAttribute('src', 'arrow-green.svg');
      });
  });
});