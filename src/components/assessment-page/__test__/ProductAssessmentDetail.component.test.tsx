/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { PostContextType, useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import GlobalDataFile from "../../../mocks/GlobalData.mock.json";
import ProductDetailsFile from "../../../mocks/ProductDetails.mock.json";
import axios from 'axios';
import ProductAssessmentDetail from '../ProductAssessmentDetail.component';
import { ProductContextProp, ProductDataContext } from '../../../contexts/productData/ProductDataContext';
import { SidebarContext } from '../../../contexts/sidebarData/SidebarStateContext';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import useFormulaAndConsumer from '../../formulation/formulation-tab/useFormulaAndConsumer';
import { ConsumerPackagingContext, ConsumerPackagingContextType } from '../../consumer-packaging-tab/ConsumerPackagingContext';
import * as GenericFunctions from '../../../helper/GenericFunctions';
import { MemoryRouter } from 'react-router-dom';
import { AutoSaveContext } from '../../../contexts/autoSaveContext/AutoSaveContext';
import { ResultDataContext } from '../../../contexts/resultData/ResultDataContext';
import { ResultDataMock } from '../../../mocks/ResultData.mock';

const GlobalDataMock = (GlobalDataFile as any).GlobalDataMock || GlobalDataFile;
const ProductDetailsMock = (ProductDetailsFile as any).ProductDetailsMock || ProductDetailsFile;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({});

jest.mock('../../../controls/WarningPopup', () => ({
  __esModule: true,
  default: ({ handleExit, handleReview }: any) => (
    <div data-testid="warning-popup">
      <button onClick={handleExit}>Exit</button>
      <button onClick={handleReview}>Review</button>
    </div>
  )
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Directly use the mock
  useLocation: () => ({
    pathname: '/product-assessment/id',
    state: {
      productID: '66a389ad3c58c51ce1d00a2f',
      productName: "Catherine's Test 1",
      experimentalID: '66a389c33c58c51ce1d00a33'
    }
  }),
}));

jest.mock('@consumer/core-login-ui-mf', () => ({
  getLoggedInUserDetails: () => jest.fn(() => ({ givenName: 'blaw', mail: 'badckak' })),
}));

jest.mock('react-ga4', () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseFormulaAndConsumer = useFormulaAndConsumer as jest.Mock;
const mockContextValues = {
  tabSwitched: false,
  setTabSwitched: jest.fn(),
  setFormulationFormData: jest.fn(),
  formulationFormData: {
    productId: 'mock-product-id',
    type: 'mock-type',
    assessmentId: 'mock-assessment-id',
    isCalculating: false,
    formulation: {
      fmlCode: 'FML123',
      description: 'Mock formulation',
      netContent: '100',
      netContentUnit: 'ml',
      productionZone: 'Zone A',
      salesZone: 'Zone B',
      productSegment: 'Segment X',
      productSubSegment: 'SubSegment Y',
      useDose: '10',
      useDoseUnit: 'ml',
      consumablesUsed: 'None',
      rawMaterials: [
        {
          tradeName: 'Mock RM',
          rawMaterialId: 'RM123',
          percentage: '50',
          status: 'Active',
          rmcStatus: 'Approved',
          EUINCIName: 'Aqua',
          USINCIName: 'Water',
          specNumber: 'SPEC001',
          cas: '123-45-6',
          envFootprint: 10,
          carbonFootprint: 5,
          greenChemistry: 2,
          gaiaScore: 'A',
          leaf_icon_boolean: 'true',
          watchlist_icon_boolean: 'false',
        }
      ],
      isEdited: false,
      isDataValid: true,
      isCalculated: true,
      useScenario: 'Leave-on',
      fieldsExist: {
        description: false,
        netContent: false,
        netContentUnit: false,
        productionZone: false,
        salesZone: false,
        productSegment: false,
        productSubSegment: false,
        useDose: false,
        useDoseUnit: false,
        rawMaterials: false,
        consumablesUsed: false,
        useScenario: false,
      },
      rawMaterialsPercentage: 100,
    }
  },
  setChangedFields: jest.fn(),
  autoSaveSuccess: false,
  setAutoSaveSuccess: jest.fn(),
  taboutAutoSaveInProgress: false,
  changedFields: [],
  refetchDetails: false,
  setRefetchDetails: jest.fn(),
  calculateClick: false,
  setCalculateClick: jest.fn(),
  calculateClickPackaging: false,
  setCalculateClickPackaging: jest.fn(),
  pathNavigation: null,
  setPathNavigation: jest.fn(),
  hasUncalculatedChanges: false,
  setHasUncalculatedChanges: jest.fn(),
  showNavigationWarning: false,
  setShowNavigationWarning: jest.fn(),
  isOwnerUser: false,
  setIsOwnerUser: jest.fn(),
  isDataCompleted: false,
  setIsDataCompleted: jest.fn(),
  isAllFlagsCalc: false,
  setIsAllFlagsCalc: jest.fn()
};

jest.mock('../../../contexts/masterData/DataContext');
jest.mock('../../formulation/formulation-tab/useFormulaAndConsumer');

jest.mock('@amcharts/amcharts5', () => ({
  Root: {
    new: () => ({
      setThemes: jest.fn(),
      container: {
        children: {
          push: () => ({
            children: { unshift: () => <div></div> },
            series: {
              push: () => ({
                set: () => <div></div>,
                ticks: { template: { set: () => <div></div> } },
                labels: { template: { set: () => <div></div> } },
                slices: { template: { set: () => <div></div> } },
                data: { setAll: () => <div></div> },
                columns: { template: { setAll: () => { } } },
              }),
            },
            seriesContainer: { children: { push: () => <div></div> } },
          }),
        },
      },
      dispose: () => <div></div>,
    }),
  },
  Label: { new: () => <div></div> },
  Picture: { new: () => <div></div> },
  Tooltip: { new: () => <div></div> },
  ColorSet: { new: () => <div></div> },
  percent: jest.fn(),
  color: jest.fn(),
}));

jest.mock('@amcharts/amcharts5/percent', () => ({
  PieChart: { new: () => <div></div> },
  PieSeries: { new: () => <div></div> },
}));

jest.mock('@amcharts/amcharts5/xy', () => ({
  XYChart: { new: () => <div></div> },
  ColumnSeries: { new: () => <div></div> },
  CategoryAxis: { new: () => <div></div> },
  ValueAxis: { new: () => <div></div> },
}));

jest.mock('@amcharts/amcharts5/radar', () => ({
  RadarChart: { new: () => <div></div> },
  RadarColumnSeries: { new: () => <div></div> },
}));

jest.mock('@amcharts/amcharts5/themes/Animated', () => ({
  new: () => <div></div>,
}));

const mockedUseNavigate = jest.fn();
const mockedUseLocation = {
  pathname: '/product-assessment/id',
  search: '',
  hash: '',
  state: {
    productID: '66a389ad3c58c51ce1d00a2f',
    productName: "Catherine's Test 1",
    productSipId: 'SIP_AVN_0000010',
    experimentalName: 'assessment 1',
    experimentalID: '66a389c33c58c51ce1d00a33',
  },
  key: '9k0s4rhj',
};
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
  useParams: () => mockedUseNavigate,
  Link: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));

jest.mock('react-infinite-scroll-component', () => {
  return ({ children, next, hasMore, loader, endMessage }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? <button onClick={next}>Load More</button> : endMessage}
        {loader}
      </div>
    );
  };
});

describe('ProductAssessmentDetail', () => {
  const contextValue: PostContextType = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: 'test',
  };
  mockedAxios.put.mockResolvedValue({
    status: 204,
  });
  const ResultDataValue = ResultDataMock;

  const productDataValue = {
    productData: {
      productId: ProductDetailsMock[0]._id,
      productName: ProductDetailsMock[0].productName,
      brandName: ProductDetailsMock[0].brandName,
    },
    usersData: ProductDetailsMock[0].users,
    refetch: jest.fn(),
    assessmentsData: {
      assessmentId: ProductDetailsMock[0].assessments?.experimental[0]?.assessmentId,
      name: ProductDetailsMock[0].assessments?.experimental[0]?.name,
      _id: ProductDetailsMock[0].assessments?.experimental[0]?._id,
      isFormulationDataCompleted: 'yes',
      isPackagingDataCompleted: 'yes',
      isFormulationCalculated: 'yes',
      isPackagingCalculated: 'yes',
    },
    formulation: ProductDetailsMock[0].assessments.experimental[0].formulation,
    primaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.primary,
    secondaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.secondary,
    assessmentsType: '',
    isBaselineDataComplete: 'yes',
    isBaselinePresent: 'yes',
    isBaslineSkipped:'yes',
    setFormulationDataComplete: () => { },
    formulationDataComplete: false,
    setPackagingDataComplete: () => { },
    packagingDataComplete: false,
    bothDataComplete: false,
    singleClickHit: false,
    setSingleClickHit: () => { },
    bothPackFormulaStatus: false,
    setBothPackFormulaStatus: () => { },
    isPackagingDirty: false,
    setIsPackagingDirty: () => { },
    setValidateCheck: () => { },
    validateCheck: false,
    setValidateCheckEvacuation: () => { },
    validateCheckEvacuation: false,

    setValidateCheckFinal: jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    validateCheckPackaging: false,
  } as unknown as ProductContextProp;

  const productDataValue1 = {
    productData: {
      productId: ProductDetailsMock[0].projectId,
      productName: ProductDetailsMock[0].productName,
      brandName: ProductDetailsMock[0].brandName,
    },
    usersData: ProductDetailsMock[0].users,
    refetch: jest.fn(),
    assessmentsData: false,
    formulation: ProductDetailsMock[0].assessments.experimental[0].formulation,
    primaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.primary,
    secondaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.secondary,
    assessmentsType: '',
    isBaselineDataComplete: 'yes',
    isBaselinePresent: 'yes',
    setFormulationDataComplete: () => { },
    formulationDataComplete: false,
    setPackagingDataComplete: () => { },
    packagingDataComplete: false,
    bothDataComplete: false,
    singleClickHit: false,
    setSingleClickHit: () => { },
    bothPackFormulaStatus: false,
    setBothPackFormulaStatus: () => { },
    isPackagingDirty: false,
    setIsPackagingDirty: () => { },
    setValidateCheck: () => { },
    validateCheck: false,
    setValidateCheckEvacuation: () => { },
    validateCheckEvacuation: false,

    setValidateCheckFinal: jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    validateCheckPackaging: false,
  } as unknown as ProductContextProp;

  const productDataValue2 = {
    productData: {
      productId: ProductDetailsMock[0].projectId,
      productName: ProductDetailsMock[0].productName,
      brandName: ProductDetailsMock[0].brandName,
    },
    usersData: ProductDetailsMock[0].users,
    refetch: jest.fn(),
    assessmentsData: {
      assessmentId: '',
      name: '',
      _id: '',
      isFormulationDataCompleted: 'no',
      isPackagingDataCompleted: 'no',
      isFormulationCalculated: 'no',
      isPackagingCalculated: 'no',
    },
    formulation: ProductDetailsMock[0].assessments.experimental[0].formulation,
    primaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.primary,
    secondaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.secondary,
    assessmentsType: '',
    isBaselineDataComplete: 'no',
    isBaselinePresent: 'no',
    setFormulationDataComplete: () => { },
    formulationDataComplete: false,
    setPackagingDataComplete: () => { },
    packagingDataComplete: false,
    bothDataComplete: false,
    singleClickHit: false,
    setSingleClickHit: () => { },
    bothPackFormulaStatus: false,
    setBothPackFormulaStatus: () => { },
    isPackagingDirty: false,
    setIsPackagingDirty: () => { },
    setValidateCheck: () => { },
    validateCheck: false,
    setValidateCheckEvacuation: () => { },
    validateCheckEvacuation: false,

    setValidateCheckFinal: jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    validateCheckPackaging: false,
  } as unknown as ProductContextProp;

  const consumerPackagingValue = {
    packagingAllData: {
      packaging_level: [],
    },
    primaryData: [],
    secondaryData: [],
    isSaveEnabled: false,
    productEvacuationValue: '',
    isPrimaryAddEnabled: true,
    isSecondaryAddEnabled: true,
    buttonText: 'Save',
    primaryRecycleStatus: 'na',
    secondaryRecycleStatus: 'na',
    counterPrimary: 0,
    counterSecondary: 0,
    resetData: false,
    packagingSavedData: {
      packaging_level: [],
    },
    isComponentDataChangePrimary: [],
    handelChangeTableData: jest.fn(),
    handleChange: jest.fn(),
    handleChangeSelect: jest.fn(),
    handelImportPackingData: jest.fn(),
    handleSavePacking: jest.fn(),
    handelChangeRecycleStatus: jest.fn(),
    setProductEvacuationValue: jest.fn(),
    handleAddPrimary: jest.fn(),
    handleAddSecondary: jest.fn(),
    handleDeleteComponent: jest.fn(),
    handleClickCancelContinue: jest.fn(),
    setIsComponentDataChangePrimary: jest.fn(),
    handleClickEditCancle: jest.fn(),
    setPcNmToEmpty: jest.fn(),
    isComponentDataChangeSecondary: [],
    setIsComponentDataChangeSecondary: jest.fn(),
    setIsSaveEnabled: jest.fn(),
  } as unknown as ConsumerPackagingContextType;

  const SidebarContextValue = {
    currentSection: 'home',
    setCurrentSection: jest.fn(),
  };

  const mockPathname = jest.fn();
  Object.defineProperty(window, 'location', {
    value: {
      get pathname() {
        return mockPathname();
      },
    },
  });
  let originalFetch: jest.Mock;
  mockPathname.mockReturnValue('/product-assessment/669109b168c2e4986c95d550');
  const mockSetShowNavigationWarning = jest.fn();
  let originalWindowOpen: any;
  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging,
    }));
    mockedUseFormulaAndConsumer.mockImplementation(() => ({
      formulationData: {
        fmlCode: '',
        description: '',
        netContent: '',
        netContentUnit: 'gm',
        productionZone: '',
        salesZone: '',
        productSegment: '',
        productSubSegment: '',
        useDose: '',
        useDoseUnit: 'gm',
        consumablesUsed: '',
        rawMaterials: GlobalDataMock[0].formulation.rawMaterials,
      },
      errors: {
        description: false,
        netContent: false,
        netContentUnit: false,
        productionZone: false,
        salesZone: false,
        productSegment: false,
        productSubSegment: false,
        useDose: false,
        useDoseUnit: false,
        rawMaterials: false,
      },
      isFormValid: jest.fn(),
      handleChange: jest.fn(),
      handleClickSaveButton: jest.fn(),
      handleContinueDialogButton: jest.fn(),
      handleCloseDialog: jest.fn(),
      handleOpenImportFormulaPopup: jest.fn(),
      handleClick1: jest.fn(),
      handleClick2: jest.fn(),
      handleCloseImportFormulaDialog: jest.fn(),
      handleCloseEditWarningDialog: jest.fn(),
      handleContinueEditWarningDialogButton: jest.fn(),
      cancelChanges: jest.fn(),
      handelSaveChanges: jest.fn(),
      callChildData: jest.fn(),
      handelEditClick: jest.fn(),
      handelFormulationTableChanges: jest.fn(),
      handelBlurUnit: jest.fn(),
      counter: 0,
      subSegments: [''],
      dialogKey: 0,
      importFormulaDialogOpen: false,
      mode: '',
      showWariningMsg: false,
      isClear: false,
      isCancelEnable: false,
      isWarningEditDialog: false,
      dataEdited: false,
      isSaveEnable: false,
      isImportFormula: false,
      initialFormValidation: false,
      disabled: {
        description: false,
        netContent: false,
        netContentUnit: false,
        productionZone: false,
        salesZone: false,
        productSegment: false,
        productSubSegment: false,
        useDose: false,
        useDoseUnit: false,
        rawMaterials: false,
        consumablesUsed: false,
      },
      toggleSaveButton: false,
      debounceFunction: jest.fn(),
      isExperimental: true,
      showImportFormula: true,
      useDose: '',
      handleUseDoseChange: jest.fn(),
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(ProductDetailsMock),
      })
    ) as jest.Mock;
    mockedUseNavigate.mockImplementation(() => mockNavigate);

  });
  beforeAll(() => {
    originalWindowOpen = window.open;
    window.open = jest.fn();
  });
  afterAll(() => {
    window.open = originalWindowOpen;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
  const setupComponent = (autoSaveContextOverrides) => {
    const autoSaveContext = {
      ...mockContextValues,
      setShowNavigationWarning: mockSetShowNavigationWarning,
      showNavigationWarning: true,  // Ensure popup is visible
      isDataCompleted: true,        // Ensure popup is visible
      pathNavigation: '/default',
      ...autoSaveContextOverrides,
    };

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <SidebarContext.Provider value={SidebarContextValue}>
              <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
                <PostContext.Provider value={contextValue}>
                  <AutoSaveContext.Provider value={autoSaveContext}>
                    <ProductAssessmentDetail />
                  </AutoSaveContext.Provider>
                </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
            </SidebarContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  it('should render the component', async () => {

    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();

  }, 8000);

  it('should render the component', () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue1}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);

  it('should render the component', () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue2}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);

  it('should render the component', async () => {
    jest
      .spyOn(GenericFunctions, 'errorMsgDialsWithoutPartialData')
      .mockReturnValueOnce('Add your baseline product to view results');
    jest
      .spyOn(GenericFunctions, 'checkAllCondiationForDials')
      .mockReturnValueOnce(false);
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue2}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);

  it('should render the component', async () => {
    jest
      .spyOn(GenericFunctions, 'errorMsgDialsWithoutPartialData')
      .mockReturnValueOnce('no');
    jest
      .spyOn(GenericFunctions, 'checkAllCondiationForDials')
      .mockReturnValueOnce(false);
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue1}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);

  it('should render the component', async () => {
    jest
      .spyOn(GenericFunctions, 'checkAllCondiationForDials')
      .mockReturnValueOnce(false);
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue1}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);

  it('should be able to change product name', async () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();

    const imageEditIcon = screen.getAllByRole('img');
    fireEvent.click(imageEditIcon[1]);


    const productName = screen.getAllByRole('textbox');
    fireEvent.change(productName[0], {
      target: { value: 'TEST PRODUCT BHA TEST' },
    });
    const checkBox = screen.getAllByTestId('CheckBoxIcon');
    fireEvent.click(checkBox[0]);

    jest.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(screen.getAllByText(/TEST PRODUCT BHA/i)[0]).toBeInTheDocument();
    });
  }, 8000);

  it('should be able to edit product name', async () => {

    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={productDataValue}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <ProductAssessmentDetail />
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();


    const imageEditIcon = screen.getAllByRole('img');
    fireEvent.click(imageEditIcon[1]);


    const checkBox = screen.getAllByTestId('CheckBoxIcon');
    fireEvent.click(checkBox[0]);

  }, 8000);

  it('should open help link when pathNavigation is "help-support"', () => {
    setupComponent({ pathNavigation: 'help-support' });

    fireEvent.click(screen.getByText('Exit'));


    expect(mockSetShowNavigationWarning).toHaveBeenCalledWith(false);
  });

  it('should navigate to pathNavigation when not help-support', () => {
    setupComponent({ pathNavigation: '/test-route' });

    fireEvent.click(screen.getByText('Exit'));

    expect(mockSetShowNavigationWarning).toHaveBeenCalledWith(false);
  });

  it('should dismiss warning and navigate to root when clicking Exit', () => {
    const mockSetShowNavigationWarning = jest.fn();
    const autoSaveContext = {
      ...mockContextValues,
      setShowNavigationWarning: mockSetShowNavigationWarning,
      isDataCompleted: true,
      showNavigationWarning: true,
      pathNavigation: null,
      isDialsSidebarError: false,
      setIsDialsSidebarError: null
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={productDataValue}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <AutoSaveContext.Provider value={autoSaveContext}>
                  <ProductAssessmentDetail />
                </AutoSaveContext.Provider>
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText('Exit'));

    expect(mockSetShowNavigationWarning).toHaveBeenCalledWith(false);
  });

  it('should dismiss warning when clicking Review', () => {
    const mockSetShowNavigationWarning = jest.fn();
    const autoSaveContext = {
      ...mockContextValues,
      setShowNavigationWarning: mockSetShowNavigationWarning,
      isDataCompleted: true,
      showNavigationWarning: true,
      pathNavigation: null,
      isDialsSidebarError: false,
      setIsDialsSidebarError: null
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={productDataValue}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <AutoSaveContext.Provider value={autoSaveContext}>
                  <ProductAssessmentDetail />
                </AutoSaveContext.Provider>
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Review'));

    expect(mockSetShowNavigationWarning).toHaveBeenCalledWith(false);
  });

  it('should set isDialsWithoutDataShow to "no" and clear dialsWithoutDataShowMsg when condition is false', () => {
    const mockSetIsDialsWithoutDataShow = jest.fn();
    const mockSetDialsWithoutDataShowMsg = jest.fn();

    const autoSaveContext = {
      ...mockContextValues,
      setIsDialsWithoutDataShow: mockSetIsDialsWithoutDataShow,
      setDialsWithoutDataShowMsg: mockSetDialsWithoutDataShowMsg,
      isDialsSidebarError: false,
      setIsDialsSidebarError: null
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={productDataValue}>
          <ResultDataContext.Provider value={ResultDataValue}>
            <SidebarContext.Provider value={SidebarContextValue}>
              <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
                <PostContext.Provider value={contextValue}>
                  <AutoSaveContext.Provider value={autoSaveContext}>
                    <ProductAssessmentDetail />
                  </AutoSaveContext.Provider>
                </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
            </SidebarContext.Provider>
          </ResultDataContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
  });

  it('should switch tabs from Formulation to Packaging and trigger handleChange', () => {
    const mockSetTabSwitched = jest.fn();
    const mockRefetch = jest.fn();
    const autoSaveContext = {
      ...mockContextValues,
      setTabSwitched: mockSetTabSwitched,
      isDialsSidebarError: false,
      setIsDialsSidebarError: null
    };

    const productDataContext = {
      ...productDataValue,
      refetch: mockRefetch,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={productDataContext}>
          <SidebarContext.Provider value={SidebarContextValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
              <PostContext.Provider value={contextValue}>
                <AutoSaveContext.Provider value={autoSaveContext}>
                  <ProductAssessmentDetail />
                </AutoSaveContext.Provider>
              </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </SidebarContext.Provider>
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );

    // Simulate tab change from Formulation to Packaging
    const packagingTab = screen.getByRole('tab', { name: /Consumer Packaging/i });
    fireEvent.click(packagingTab);

  });

});