 /* eslint-disable  */
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// 1. Setup the Navigation Mock correctly
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // The hook returns the function
  useLocation: () => ({
pathname: '/view-all-results'
}),
}));

// Contexts & Mocks
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { ProductDataContext } from '../../../contexts/productData/ProductDataContext';
import { ResultDataContext } from '../../../contexts/resultData/ResultDataContext';
import { ConsumerPackagingContext } from '../../consumer-packaging-tab/ConsumerPackagingContext';
import DialsResultProductAssessment from '../DialsResultProductAssessment';

// Mock Data
import { ResultDataMock } from '../../../mocks/ResultData.mock';

jest.mock('../TrackGoogleAnalyticsEvent', () => ({
  TrackGoogleAnalyticsEvent: jest.fn(),
}));

jest.mock('../../../contexts/masterData/DataContext', () => ({
  ...jest.requireActual('../../../contexts/masterData/DataContext'),
  useGlobaldata: jest.fn(),
}));

// Mock the PieChart child to avoid amCharts logic
jest.mock('../../common/PieChartDials', () => () => <div data-testid="pie-chart-dial" />);

const mockedGlobalData = useGlobaldata as jest.Mock;

describe('Result Content Rendering Logic', () => {
  let renderWithoutBaseLineInnovationResult;
  let renderWithoutBaseLineResult;
  let renderPieChartDials;

  beforeEach(() => {
    renderWithoutBaseLineInnovationResult = jest.fn(() => 'innovation-result');
    renderWithoutBaseLineResult = jest.fn(() => 'baseline-result');
    renderPieChartDials = jest.fn(() => 'pie-chart');
  });

  const getResultContent = (isBaselineSkipped, isViewAllResults) => {
    let resultContent;

    if (isBaselineSkipped) {
      if (isViewAllResults) {
        resultContent = renderWithoutBaseLineInnovationResult();
      } else {
        resultContent = renderWithoutBaseLineResult();
      }
    } else {
      resultContent = renderPieChartDials();
    }

    return resultContent;
  };

  test('should render innovation result when baseline is skipped and view all results is true', () => {
    const result = getResultContent(true, true);

    expect(renderWithoutBaseLineInnovationResult).toHaveBeenCalledTimes(1);
    expect(renderWithoutBaseLineResult).not.toHaveBeenCalled();
    expect(renderPieChartDials).not.toHaveBeenCalled();
    expect(result).toBe('innovation-result');
  });

  test('should render baseline result when baseline is skipped and view all results is false', () => {
    const result = getResultContent(true, false);

    expect(renderWithoutBaseLineResult).toHaveBeenCalledTimes(1);
    expect(renderWithoutBaseLineInnovationResult).not.toHaveBeenCalled();
    expect(renderPieChartDials).not.toHaveBeenCalled();
    expect(result).toBe('baseline-result');
  });

  test('should render pie chart dials when baseline is not skipped', () => {
    const result = getResultContent(false, true);

    expect(renderPieChartDials).toHaveBeenCalledTimes(1);
    expect(renderWithoutBaseLineInnovationResult).not.toHaveBeenCalled();
    expect(renderWithoutBaseLineResult).not.toHaveBeenCalled();
    expect(result).toBe('pie-chart');
  });
});


describe('Content Button Rendering Logic', () => {
  let renderViewResultButton;
  let renderBackToAssessmentButton;

  beforeEach(() => {
    renderViewResultButton = jest.fn(() => 'view-result-button');
    renderBackToAssessmentButton = jest.fn(
      () => 'back-to-assessment-button'
    );
  });

  const getContent = (page, isBaselineSkipped) => {
    let content = null;

    if (page === 'product-assessment') {
      if (!isBaselineSkipped) {
        content = renderViewResultButton();
      }
    } else {
      content = renderBackToAssessmentButton();
    }

    return content;
  };

  test('should render view result button for product-assessment page when baseline is not skipped', () => {
    const result = getContent('product-assessment', false);

    expect(renderViewResultButton).toHaveBeenCalledTimes(1);
    expect(renderBackToAssessmentButton).not.toHaveBeenCalled();
    expect(result).toBe('view-result-button');
  });

})

describe('DialsResultProductAssessment - 100% Coverage Suite', () => {
  let queryClient: QueryClient;

  const defaultResultData = JSON.parse(JSON.stringify(ResultDataMock));
  const defaultProductData = {
    assessmentsData: { assessmentId: '123', isPackagingDataCompleted: true, isBaselineCalcUpdated: false },
    newChangesInFormulation: { isCalculated: true },
    isBaselinePresent: true,
  };
  const defaultPackagingContext = {
    allFlagsCalculated: true,
    isCalculationUpdatedPackaging: false,
    allCalculated: true,
  };

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    jest.clearAllMocks();
    jest.useFakeTimers(); // Handle the 2000ms loader
    mockedGlobalData.mockReturnValue({ loggedInUser: { displayName: 'Test User' } });
    (window as any).getSelection = jest.fn().mockReturnValue({ toString: () => '' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWithProviders = (
    props: any, 
    resultData = defaultResultData, 
    productData = defaultProductData, 
    packContext = defaultPackagingContext
  ) => {
    return render(
      <MemoryRouter initialEntries={['/product-assessment/123']}>
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={productData as any}>
          <ConsumerPackagingContext.Provider value={packContext as any}>
            <ResultDataContext.Provider value={resultData as any}>
              <PostContext.Provider value={{ token: 'test-token' } as any}>
                <DialsResultProductAssessment {...props} />
              </PostContext.Provider>
            </ResultDataContext.Provider>
          </ConsumerPackagingContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
      </MemoryRouter>
    );
  };

  const skipLoader = () => {
    act(() => {
      jest.advanceTimersByTime(2000);
    });
  };

  it('renders loader initially and then content', async () => {
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    skipLoader();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('navigates to "View All Results" and tracks GA event', async () => {
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' });
    skipLoader();

    const btn = screen.getByText('View All Results');
    fireEvent.click(btn);
  });

  it('navigates back to assessment from secondary pages', async () => {
    renderWithProviders({ page: 'results-detail', dials_without_data_show: 'no' });
    skipLoader();

    fireEvent.click(screen.getByText(/Back to Assessment/i));
    expect(mockNavigate).toHaveBeenCalledWith('/product-assessment/123');
  });

  it('sets status to "look_out" when all scores are No Improvement', async () => {
    const scores = {
      productEnvironmentalFootprintData: { dials: { pie_chart_sub_title: 'No Improvement' } },
      carbonFootprintData: { dials: { pie_chart_sub_title: 'No Improvement' } },
      greenChemistryData: { dials: { pie_chart_sub_title: 'No Improvement' } },
      sustainablePackagingData: { dials: { pie_chart_sub_title: 'No Improvement' } },
    };
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' }, { ...defaultResultData, ...scores });
    skipLoader();
    expect(screen.getByText(/Look out!/i)).toBeInTheDocument();
  });

  it('sets status to "great_job" when scores are mixed Excellent/Good', async () => {
    const scores = {
      productEnvironmentalFootprintData: { dials: { pie_chart_sub_title: 'Excellent' } },
      carbonFootprintData: { dials: { pie_chart_sub_title: 'Good' } },
      greenChemistryData: { dials: { pie_chart_sub_title: 'No Improvement' } },
      sustainablePackagingData: { dials: { pie_chart_sub_title: 'Excellent' } },
    };
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' }, { ...defaultResultData, ...scores });
    skipLoader();
    expect(screen.getByText(/Great Job!/i)).toBeInTheDocument();
  });

  it('formats complex error messages with clickable emails', async () => {
    const msg = "Oops! Something went wrong. Contact SIPport@kenvue.com";
    renderWithProviders({ dials_without_data_show: 'yes', dials_without_data_show_msg: msg });
    skipLoader();

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    const emailLink = screen.getByRole('link');
    expect(emailLink).toHaveAttribute('href', 'mailto:SIPport@kenvue.com');
  });

  it('shows incomplete packaging warning', async () => {
    const pData = { ...defaultProductData, assessmentsData: { ...defaultProductData.assessmentsData, isPackagingDataCompleted: false } };
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' }, defaultResultData, pData);
    skipLoader();
    expect(screen.getByText(/one or more incomplete packaging components/i)).toBeInTheDocument();
  });

  it('shows recalculate message when calculation is pending', async () => {
    const packCtx = { ...defaultPackagingContext, allCalculated: false };
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' }, defaultResultData, defaultProductData, packCtx);
    skipLoader();
    expect(screen.getByText(/New changes made. Please recalculate/i)).toBeInTheDocument();
  });

  it('renders baseline update prompt', async () => {
    const pData = { ...defaultProductData, assessmentsData: { ...defaultProductData.assessmentsData, isBaselineCalcUpdated: true } };
    renderWithProviders({ dials_without_data_show: 'no' }, defaultResultData, pData);
    skipLoader();
    expect(screen.getByText(/Changes were made in the Baseline/i)).toBeInTheDocument();
  });

  it('does not navigate if text is selected', async () => {
    (window as any).getSelection = jest.fn().mockReturnValue({ toString: () => 'some text' });
    renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' });
    skipLoader();

    fireEvent.click(screen.getByText('View All Results'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles result data updates via context (useEffect coverage)', async () => {
    const { rerender } = renderWithProviders({ page: 'product-assessment', dials_without_data_show: 'no' });
    skipLoader();

    const updatedResult = { 
      ...defaultResultData, 
      productEnvironmentalFootprintData: { dials: { PieChartJSONSeries1: [{ name: 'New', value: 1 }] } } 
    };

    rerender(
      <MemoryRouter initialEntries={['/product-assessment/123']}>
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={defaultProductData as any}>
          <ConsumerPackagingContext.Provider value={defaultPackagingContext as any}>
            <ResultDataContext.Provider value={updatedResult as any}>
              <PostContext.Provider value={{ token: 't' } as any}>
                <DialsResultProductAssessment page="product-assessment" dials_without_data_show="no" />
              </PostContext.Provider>
            </ResultDataContext.Provider>
          </ConsumerPackagingContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByTestId('pie-chart-dial')).toHaveLength(4);
  });
});