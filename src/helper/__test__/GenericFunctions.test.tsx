import '@testing-library/jest-dom';
import axios from 'axios';
import {  act, waitFor, screen } from '@testing-library/react';
import { ProductDetailsMock } from '../../mocks/ProductDetails.mock';
import { GlobalDataMock } from '../../mocks/GlobalData.mock.json';
import {
  calculateFootprintTabs,
  calculatePercentageChange,
  callDeleteAssessmentDetails,
  capitalizeFirstLetter,
  CheckCRUDAccess,
  checkDeleteAccess,
  checkEditAccess,
  errorMsgDialsWithoutPartialData,
  extractDialData,
  formatDate,
  getAvatarLetters,
  getCappedValue,
  getExperimentalCardTheme,
  getRawMaterialDataFormulation,
  getRawMaterialDataGCDetailedResult,
  GetToastContainer,
  getToastContainer,
  setPieChartJSONSeries1,
  setUnsetAssessmentAsLPP,
  sortData,
  truncate,
} from '../GenericFunctions';
import useTruncateValue from '../GenericFunctions';
import {
  BaselineRawMaterial,
  ProductAssessmentResultMock,
  ProductRawMaterial,
} from '../../mocks/ProductAssessmentResult.mock';
import { render } from '@testing-library/react';
import { useGlobaldata } from '../../contexts/masterData/DataContext';
import { ResultHTMLContents3 } from '../../constants/Results.constant';
import { ApiEndPoints, ApiEndPointsURL } from '../../constants/ApiEndPoints.constant';


jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.useFakeTimers();

const mockeduseGlobaldata = useGlobaldata as jest.Mock;

jest.mock('../../contexts/masterData/DataContext');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('@consumer/core-login-ui-mf', () => ({
  getLoggedInUserDetails: () => jest.fn(() => ({ givenName: 'blaw', mail: 'badckak' })),
}));

describe('genericFunction', () => {
  const TestComponent = () => {
    const truncateValue = useTruncateValue();
    return <div>{ truncateValue } </div>;
  };


  mockedAxios.delete.mockResolvedValue({
    status: 204,
  });
  mockedAxios.put.mockResolvedValue({
    status: 200,
  });

  beforeEach(() => {
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging,
    }));
  });
  afterEach(() => {
    // Reset window width after each test
    window.innerWidth = 1024;
    jest.restoreAllMocks();
  });

  it('should render the component', async () => {
    const baseElement = callDeleteAssessmentDetails(
      {
        productSipId: 'test',
        assessmentId: '1213',
        productID: '21638',
        type: 'type',
      },
      '721639'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should throw error', async () => {
    axios.delete = jest.fn().mockRejectedValueOnce('Failed api call');
    try {
      await callDeleteAssessmentDetails(
        {
          productSipId: 'test',
          assessmentId: '1213',
          productID: '21638',
          type: 'type',
        },
        '721639'
      );
    } catch (err) {
      expect(true);
    }
  });

  it('should render the component ', async () => {
    const baseElement = formatDate('21873621983');
    expect(baseElement).not.toBeNull();
  });

  it('should render the getToastContainer ', async () => {
    const baseElement = getToastContainer();
    expect(baseElement).not.toBeNull();
  });

  it('should render the GetToastContainer ', async () => {
    const { baseElement } = render(<GetToastContainer />);
    expect(baseElement).not.toBeNull();
  });

  it('should render the component ', async () => {
    const baseElement = truncate('2178639818', 3);
    expect(baseElement).not.toBeNull();
  });

  it('sorts numeric, percentage, string, and empty values in both directions', () => {
    expect(sortData([{ value: 10 }, { value: 0 }, { value: 5 }], 'value', 'asc'))
      .toEqual([{ value: 0 }, { value: 5 }, { value: 10 }]);
    expect(sortData([{ value: 'z' }, { value: 'a' }, { value: 'm' }], 'value', 'asc'))
      .toEqual([{ value: 'a' }, { value: 'm' }, { value: 'z' }]);
    expect(sortData([{ value: null }, { value: 'b' }, { value: '' }], 'value', 'asc'))
      .toEqual([{ value: null }, { value: '' }, { value: 'b' }]);
  });

  it('handles date and truncation boundaries', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('2024-01-15T00:00:00.000Z')).toMatch(/Jan 1[45], 2024/);
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('123456789', 5)).toBe('1234…');
    expect(truncate('', 5)).toBe('');
  });

  it('should render the component', async () => {
    const baseElement = checkEditAccess(ProductDetailsMock[0]?.users, 'KChand02@kenvue.com');

    expect(baseElement).not.toBeNull();
  });

  it('should render the component ', async () => {
    const baseElement = checkDeleteAccess(ProductDetailsMock[0]?.users, 'KChand02@kenvue.com');

    expect(baseElement).not.toBeNull();
  });

  it('should render the component ', async () => {
    const baseElement = CheckCRUDAccess(ProductDetailsMock[0]?.users, 'team_member');

    expect(baseElement).not.toBeNull();
  });

  it('should render the component ', async () => {
    const baseElement = CheckCRUDAccess(ProductDetailsMock[0]?.users, 'formulation');

    expect(baseElement).not.toBeNull();
  });

  it('should render the getAvatarLetters ', async () => {
    const baseElement = getAvatarLetters('Kavya');

    expect(baseElement).not.toBeNull();
  });

  it('should render the getExperimentalCardTheme ', async () => {
    const baseElement = getExperimentalCardTheme({
      spacing: { unit: 2 },
    });

    expect(baseElement).not.toBeNull();
  });

  it('should render the errorMsgDialsWithoutPartialData ', async () => {
    const baseElement = errorMsgDialsWithoutPartialData('no', 'yes', 'no', 'no', 'no', 'no');

    expect(baseElement).not.toBeNull();
  });

  it('should render the errorMsgDialsWithoutPartialData ', async () => {
    const baseElement = errorMsgDialsWithoutPartialData('yes', 'no', 'yes', 'yes', 'no', 'no');

    expect(baseElement).not.toBeNull();
  });

  it('should render the errorMsgDialsWithoutPartialData ', async () => {
    const baseElement = errorMsgDialsWithoutPartialData('yes', 'no', 'yes', 'no', 'no', 'no');

    expect(baseElement).not.toBeNull();
  });

  it('should render the capitalizeFirstLetter ', async () => {
    const baseElement = capitalizeFirstLetter('testing');

    expect(baseElement).not.toBeNull();
  });

  it('should render the extractDialData ', async () => {
    const baseElement = extractDialData(
      {
        ...ProductAssessmentResultMock.experimental.totallca,
        error: true,
        'sustainablepackaging-rollup-compare': {
          Difference_Recycle_Ready: 100,
          Difference_PCR_Content: 0,
          Difference_Material_Efficiency: -93.33944954128441,
          Score_Recycle_Ready: 50,
          Score_PCR_Content: 1.2820512820512775,
          Score_Material_Efficiency: 50,
          Weighting_Recycle_Ready: 10,
          Weighting_PCR_Content: 0.6410256410256387,
          Weighting_Material_Efficiency: 15,
          Final_Score: 25.64102564102564,
          Final_Score_Disrupters: -50,
        },
      },
      {
        ...ProductAssessmentResultMock.baseline.totallca,
        error: true,
        'sustainablepackaging-rollup-compare': {
          Difference_Recycle_Ready: 100,
          Difference_PCR_Content: 0,
          Difference_Material_Efficiency: -93.33944954128441,
          Score_Recycle_Ready: 50,
          Score_PCR_Content: 1.2820512820512775,
          Score_Material_Efficiency: 50,
          Weighting_Recycle_Ready: 10,
          Weighting_PCR_Content: 0.6410256410256387,
          Weighting_Material_Efficiency: 15,
          Final_Score: 25.64102564102564,
          Final_Score_Disrupters: -50,
        },
      },
      'productEnvironmental'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the extractDialData ', async () => {
    const baseElement = extractDialData(
      {
        ...ProductAssessmentResultMock.experimental.totallca,
        error: true,
        'sustainablepackaging-rollup-compare': {
          Difference_Recycle_Ready: 100,
          Difference_PCR_Content: 0,
          Difference_Material_Efficiency: -93.33944954128441,
          Score_Recycle_Ready: 50,
          Score_PCR_Content: 1.2820512820512775,
          Score_Material_Efficiency: 50,
          Weighting_Recycle_Ready: 10,
          Weighting_PCR_Content: 0.6410256410256387,
          Weighting_Material_Efficiency: 15,
          Final_Score: 25.64102564102564,
          Final_Score_Disrupters: -50,
        },
      },
      {
        ...ProductAssessmentResultMock.baseline.totallca,
        error: true,
        'sustainablepackaging-rollup-compare': {
          Difference_Recycle_Ready: 100,
          Difference_PCR_Content: 0,
          Difference_Material_Efficiency: -93.33944954128441,
          Score_Recycle_Ready: 50,
          Score_PCR_Content: 1.2820512820512775,
          Score_Material_Efficiency: 50,
          Weighting_Recycle_Ready: 10,
          Weighting_PCR_Content: 0.6410256410256387,
          Weighting_Material_Efficiency: 15,
          Final_Score: 25.64102564102564,
          Final_Score_Disrupters: -50,
        },
      },
      'carbonFootprint'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the extractDialData ', async () => {
    const baseElement = extractDialData(
      {
        ...ProductAssessmentResultMock.experimental.totallca,
        error: true,
        'sustainablepackaging-rollup-compare': {
          Difference_Recycle_Ready: 100,
          Difference_PCR_Content: 0,
          Difference_Material_Efficiency: -93.33944954128441,
          Score_Recycle_Ready: 50,
          Score_PCR_Content: 1.2820512820512775,
          Score_Material_Efficiency: 50,
          Weighting_Recycle_Ready: 10,
          Weighting_PCR_Content: 0.6410256410256387,
          Weighting_Material_Efficiency: 15,
          Final_Score: 25.64102564102564,
          Final_Score_Disrupters: -50,
        },
      },
      {
        ...ProductAssessmentResultMock.baseline.totallca,
        error: true,
        'sustainablepackaging-rollup-compare': {
          Difference_Recycle_Ready: 100,
          Difference_PCR_Content: 0,
          Difference_Material_Efficiency: -93.33944954128441,
          Score_Recycle_Ready: 50,
          Score_PCR_Content: 1.2820512820512775,
          Score_Material_Efficiency: 50,
          Weighting_Recycle_Ready: 10,
          Weighting_PCR_Content: 0.6410256410256387,
          Weighting_Material_Efficiency: 15,
          Final_Score: 25.64102564102564,
          Final_Score_Disrupters: -50,
        },
      },
      'sustainablePackaging'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the calculatePercentageChange ', async () => {
    const baseElement = calculatePercentageChange(20, 10);

    expect(baseElement).not.toBeNull();
  });

  it('should render the setPieChartJSONSeries1 for productEnvironmental ', async () => {
    const baseElement1 = setPieChartJSONSeries1(-21, 'productEnvironmental');
    const baseElement2 = setPieChartJSONSeries1(-19, 'productEnvironmental');
    const baseElement3 = setPieChartJSONSeries1(9, 'productEnvironmental');
    const baseElement4 = setPieChartJSONSeries1(20, 'productEnvironmental');
    const baseElement5 = setPieChartJSONSeries1(20, 'productEnvironmental');
    const baseElement6 = setPieChartJSONSeries1(22, 'productEnvironmental');

    expect(baseElement1).not.toBeNull();
    expect(baseElement2).not.toBeNull();
    expect(baseElement3).not.toBeNull();
    expect(baseElement4).not.toBeNull();
    expect(baseElement5).not.toBeNull();
    expect(baseElement6).not.toBeNull();
  });

  it('should render the setPieChartJSONSeries1 for sustainablePackaging ', async () => {
    const baseElement1 = setPieChartJSONSeries1(-21, 'sustainablePackaging');
    const baseElement2 = setPieChartJSONSeries1(-19, 'sustainablePackaging');
    const baseElement3 = setPieChartJSONSeries1(9, 'sustainablePackaging');
    const baseElement5 = setPieChartJSONSeries1(20, 'sustainablePackaging');
    const baseElement6 = setPieChartJSONSeries1(22, 'sustainablePackaging');

    expect(baseElement1).not.toBeNull();
    expect(baseElement2).not.toBeNull();
    expect(baseElement3).not.toBeNull();
    expect(baseElement5).not.toBeNull();
    expect(baseElement6).not.toBeNull();
  });

  it('should render the setPieChartJSONSeries1 for greenChemistry ', async () => {
    const baseElement1 = setPieChartJSONSeries1(-11, 'greenChemistry');
    const baseElement2 = setPieChartJSONSeries1(-9, 'greenChemistry');
    const baseElement3 = setPieChartJSONSeries1(4, 'greenChemistry');
    const baseElement5 = setPieChartJSONSeries1(9, 'greenChemistry');
    const baseElement6 = setPieChartJSONSeries1(22, 'greenChemistry');

    expect(baseElement1).not.toBeNull();
    expect(baseElement2).not.toBeNull();
    expect(baseElement3).not.toBeNull();
    expect(baseElement5).not.toBeNull();
    expect(baseElement6).not.toBeNull();
  });

  it('should render the getRawMaterialDataFormulation for productEnvironmental', async () => {
    const baseElement = getRawMaterialDataFormulation(
      {
        ...ProductAssessmentResultMock.experimental,
        createdAt: '',
        updatedAt: '',
      },
      {
        ...ProductAssessmentResultMock.baseline,
        _id: '',
      },
      12,
      'productEnvironmental'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the getRawMaterialDataFormulation for carbonFootprint', async () => {
    const baseElement = getRawMaterialDataFormulation(
      {
        ...ProductAssessmentResultMock.experimental,
        createdAt: '',
        updatedAt: '',
      },
      {
        ...ProductAssessmentResultMock.baseline,
        _id: '',
      },
      12,
      'carbonFootprint'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the calculateFootprintTabs', async () => {
    const baseElement = calculateFootprintTabs(
      {
        ...ProductAssessmentResultMock,
      },
      'experimental',
      { totalProduct: 'test', formulation: 'test', packaging: 'test' }
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the sortData', async () => {
    const baseElement = sortData(
      [
        {
          componentName: '12',
        },
        {
          componentName: 14,
        },
      ],
      'componentName',
      'desc'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the sortData', async () => {
    const baseElement = sortData(
      [
        {
          componentName: 12,
        },
        {
          componentName: 11,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement).not.toBeNull();

    const baseElement1 = sortData(
      [
        {
          componentName: '',
        },
        {
          componentName: 11,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement1).not.toBeNull();

    const baseElement2 = sortData(
      [
        {
          componentName: 11,
        },
        {
          componentName: '',
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement2).not.toBeNull();
  });

  it('should render the sortData', async () => {
    const baseElement = sortData(
      [
        {
          componentName: 12,
        },
        {
          componentName: null,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement).not.toBeNull();

    const baseElement1 = sortData(
      [
        {
          componentName: null,
        },
        {
          componentName: 1,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement1).not.toBeNull();

    const baseElement2 = sortData(
      [
        {
          componentName: '',
        },
        {
          componentName: 1,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement2).not.toBeNull();

    const baseElement3 = sortData(
      [
        {
          componentName: 1,
        },
        {
          componentName: '',
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement3).not.toBeNull();

    const baseElement4 = sortData(
      [
        {
          componentName: null,
        },
        {
          componentName: '',
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement4).not.toBeNull();

    const baseElement5 = sortData(
      [
        {
          componentName: '14%',
        },
        {
          componentName: 12,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement5).not.toBeNull();

    const baseElement6 = sortData(
      [
        {
          componentName: 0,
        },
        {
          componentName: 12,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement6).not.toBeNull();

    const baseElement7 = sortData(
      [
        {
          componentName: 1,
        },
        {
          componentName: 0,
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement7).not.toBeNull();

    const baseElement8 = sortData(
      [
        {
          componentName: 'test',
        },
        {
          componentName: 'test1',
        },
      ],
      'componentName',
      'desc'
    );

    expect(baseElement8).not.toBeNull();

    const baseElement9 = sortData(
      [
        {
          componentName: 'test',
        },
        {
          componentName: 'test1',
        },
      ],
      'componentName',
      'asc'
    );

    expect(baseElement9).not.toBeNull();
  });

  it('should render the getRawMaterialDataGCDetailedResult', async () => {
    const baseElement = getRawMaterialDataGCDetailedResult(
      ProductRawMaterial,
      BaselineRawMaterial,
      'greenChemistry'
    );

    expect(baseElement).not.toBeNull();
  });

  it('should render the ResultHTMLContents3 PRODUCT_ENVIRONMENTAL_FOOTPRINT', async () => {
    const baseElement = ResultHTMLContents3(
      "PRODUCT_ENVIRONMENTAL_FOOTPRINT",
      "TOTAL_PRODUCT"
    );

    expect(baseElement).not.toBeNull();

    const baseElement1 = ResultHTMLContents3(
      "PRODUCT_ENVIRONMENTAL_FOOTPRINT",
      "FORMULATION"
    );

    expect(baseElement1).not.toBeNull();

    const baseElement2 = ResultHTMLContents3(
      "PRODUCT_ENVIRONMENTAL_FOOTPRINT",
      "CONSUMER_PACKAGING"
    );

    expect(baseElement2).not.toBeNull();

    const baseElement3 = ResultHTMLContents3(
      "PRODUCT_ENVIRONMENTAL_FOOTPRINT",
      ""
    );

    expect(baseElement3).not.toBeNull();

  });

  it('should render the ResultHTMLContents3 CARBON_FOOTPRINT', async () => {
    const baseElement = ResultHTMLContents3(
      "CARBON_FOOTPRINT",
      "TOTAL_PRODUCT"
    );

    expect(baseElement).not.toBeNull();

    const baseElement1 = ResultHTMLContents3(
      "CARBON_FOOTPRINT",
      "FORMULATION"
    );

    expect(baseElement1).not.toBeNull();

    const baseElement2 = ResultHTMLContents3(
      "CARBON_FOOTPRINT",
      "CONSUMER_PACKAGING"
    );

    expect(baseElement2).not.toBeNull();

    const baseElement3 = ResultHTMLContents3(
      "CARBON_FOOTPRINT",
      ""
    );

    expect(baseElement3).not.toBeNull();
  });
    it('should return 50 for window width >= 1440', () => {
      window.innerWidth = 1440;
      render(<TestComponent />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  
    it('should return 40 for window width between 1151-1439', () => {
      window.innerWidth = 1200;
      render(<TestComponent />);
      expect(screen.getByText('40')).toBeInTheDocument();
    });
  
    it('should return 20 for window width between 880-1150', () => {
      window.innerWidth = 1000;
      render(<TestComponent />);
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  
    it('should return 50 for window width < 880', () => {
      window.innerWidth = 800;
      render(<TestComponent />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  
    it('should update value on window resize', async () => {
      window.innerWidth = 1440;
      render(<TestComponent />);
  
      act(() => {
        window.innerWidth = 1000;
        window.dispatchEvent(new Event('resize'));
      });
  
      await waitFor(() => expect(screen.getByText('20')).toBeInTheDocument());
  
      act(() => {
        window.innerWidth = 1200;
        window.dispatchEvent(new Event('resize'));
      });
  
      await waitFor(() => expect(screen.getByText('40')).toBeInTheDocument());
    });
  
    it('should clean up event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = render(<TestComponent />);
  
      unmount();
  
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
    it('should cap values correctly', () => {
      expect(getCappedValue(50, 0, 100)).toBe(50);
      expect(getCappedValue(-10, 0, 100)).toBe(0);
      expect(getCappedValue(150, 0, 100)).toBe(100);
      expect(getCappedValue(undefined, 0, 100)).toBe(0);
    });
  it('returns message when baseline is missing', () => {
    expect(errorMsgDialsWithoutPartialData(undefined, 'no'))
      .toBe('Add your baseline product to view results');
  });

  it('returns incomplete baseline message', () => {
    expect(errorMsgDialsWithoutPartialData('no', 'yes'))
      .toBe('Baseline assessment is incomplete. Please enter missing data to see results.');
  });

  it('requires both formulation and packaging data', () => {
    // Test formulation missing
    expect(errorMsgDialsWithoutPartialData('yes', 'yes', 'no'))
      .toBe('Enter both your formulation and packaging data to view results');

    // Test packaging missing
    expect(errorMsgDialsWithoutPartialData('yes', 'yes', 'yes', 'no'))
      .toBe('Enter both your formulation and packaging data to view results');
  });

  it('shows calculation error when results not calculated', () => {
    // Formulation not calculated
    expect(errorMsgDialsWithoutPartialData('yes', 'yes', 'yes', 'yes', 'no'))
      .toBe('Something went wrong! Please retrigger the calculation to view results');

    // Packaging not calculated
    expect(errorMsgDialsWithoutPartialData('yes', 'yes', 'yes', 'yes', 'yes', 'no'))
      .toBe('Something went wrong! Please retrigger the calculation to view results');
  });

  it('returns no error when all conditions are met', () => {
    expect(errorMsgDialsWithoutPartialData('yes', 'yes', 'yes', 'yes', 'yes', 'yes'))
      .toBe('no');
  });

  it('handles undefined parameters gracefully', () => {
    // Undefined baselineDataComplete
    expect(errorMsgDialsWithoutPartialData(undefined, 'yes'))
      .toBe('no');

    // All parameters undefined
    expect(errorMsgDialsWithoutPartialData())
      .toBe('no');
  });
});

describe('setUnsetAssessmentAsLPP', () => {
    const mockEditData = {
      productSipId: "SIP-001",
      assessmentId: "ASSESS-001",
      name: "Test Assessment",
      isLPP: true
    };
    const mockProductID = "12345";
    const mockToken = "mock-token-xyz";
 
    it('should successfully call the API with correct URL, body, and headers', async () => {
      const mockResponse = { status: 204, data: "Success" };
      mockedAxios.put.mockResolvedValue(mockResponse);
 
      const result = await setUnsetAssessmentAsLPP(
        mockEditData,
        mockProductID,
        mockToken
      );
 
      // Verify the Axios call
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${ApiEndPointsURL}${ApiEndPoints.assessment_edit}/${mockProductID}`,
        mockEditData,
        {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        }
      );
 
      // Verify the return value
      expect(result).toEqual(mockResponse);
    });
 
    it('should return error object when API call fails', async () => {
      const mockError = new Error("Network Error");
      mockedAxios.put.mockRejectedValue(mockError);
 
      const result = await setUnsetAssessmentAsLPP(
        mockEditData,
        mockProductID,
        mockToken
      );
 
      // Verify the return value captures the error
      expect(result).toEqual(mockError);
    });
  });
