import { render, act, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";

import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { ProductDetailsMock } from "../../../mocks/ProductDetails.mock.json";
import { ProductContextProp, ProductDataContext } from '../../../contexts/productData/ProductDataContext';
import PackagingMock from "../../../mocks/Packaging.mock.json";
import useFormulationTable from '../../../components/formulation/formulationComposition/useFormulationTable';
import { FormulaionTableMock } from "../../../mocks/FormulationTable.mock.json";
import { TablePackagingMock } from "../../../mocks/TablePackaging.mock.json";
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import usePackaging from '../../../components/consumer-packaging-tab/usePackaging';
import ViewAllResults from '../ViewAllResults.component';
import { ResultDataContext } from '../../../contexts/resultData/ResultDataContext';
import { ResultDataMock } from '../../../mocks/ResultData.mock';
import { CURRENT_TAB } from '../../../constants/String.constants';
import { ConsumerPackagingContext, ConsumerPackagingContextType } from '../../consumer-packaging-tab/ConsumerPackagingContext';

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
}));

jest.mock("react-ga4", () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

const queryClient = new QueryClient({});

jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUsePackaging = usePackaging as jest.Mock;
const mockedUseFormulationTable = useFormulationTable as jest.Mock;

jest.mock("../../../contexts/masterData/DataContext");
jest.mock("../../../components/consumer-packaging-tab/usePackaging");
jest.mock("../../../components/formulation/formulationComposition/useFormulationTable");


const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => ({
pathname: "/view-all-results/test",
}),
  param: () =>
    jest.fn(() => ({
      productId: "66d1ac47863cd272a4c4152d",
      assessmentId: "66d6a3e08f5081c08d84bcbc",
      type: "experimental"
    })),
  Link: () => mockedUseNavigate,
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("react-toastify/dist/ReactToastify.css", () => ({}));

jest.mock('react-infinite-scroll-component', () => {
  return ({ children, next, hasMore, loader, endMessage }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? (
          <button onClick={next}>Load More</button>
        ) : (
          endMessage
        )}
        {loader}
      </div>
    );
  };
});

jest.mock("@amcharts/amcharts5", () => ({
  Root: {
    new:
      () => {
        return ({
          setThemes: jest.fn(),
          container: {
            children: {
              push: () => {
                return ({
                  children: {
                    unshift: () => { return (<div></div>) }
                  },
                  series: {
                    push: () => {
                      return ({
                        set: () => { return (<div></div>) },
                        ticks: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        labels: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        slices: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        data: {
                          setAll: () => { return (<div></div>) }
                        },
                      })
                    },

                  },
                  seriesContainer: {
                    children: {
                      push: () => { return (<div></div>) }
                    }
                  },
                })
              }
            }
          },
          dispose: () => { return (<div></div>) }
        })
      }
  },
  Label: {
    new: () => { return (<div></div>) }
  },
  Picture: {
    new: () => { return (<div></div>) }
  },
  Tooltip: {
    new: () => { return (<div></div>) }
  },
  ColorSet: {
    new: () => { return (<div></div>) }
  },
  percent: jest.fn(),
  color: jest.fn()
}));
jest.mock("@amcharts/amcharts5/percent", () => ({
  PieChart: {
    new: () => { return (<div></div>) }
  },
  PieSeries: {
    new: () => { return (<div></div>) }
  },
}));
jest.mock("@amcharts/amcharts5/themes/Animated", () => ({
  new: () => { return (<div></div>) }
}));

jest.mock("@amcharts/amcharts5/xy", () => ({
  XYChart: {
    new: () => { return (<div></div>) }
  },
  AxisRendererX: {
    new: () => { return (<div></div>) }
  },
  CategoryAxis: {
    new: () => { return (<div></div>) }
  },
  ValueAxis: {
    new: () => { return (<div></div>) }
  },
  AxisRendererY: {
    new: () => { return (<div></div>) }
  },
  ColumnSeries: {
    new: () => { return (<div></div>) }
  },
}));

describe('ViewAllResults', () => {
  const mockPathname = jest.fn();
  Object.defineProperty(window, "location", {
    value: {
      get pathname() {
        return mockPathname();
      },
      replace: jest.fn(),
    },
  });
  mockPathname.mockReturnValue("/view-all-results/experimental/6720e1d67103462f2c1eaa84/6720e6e57103462f2c1eb52c");
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: "test"
  }
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
  
  const resultDataValue = ResultDataMock;
  const productDataValue = {
    productData: {
      productId: ProductDetailsMock[0].projectId,
      productName: ProductDetailsMock[0].productName,
      brandName: ProductDetailsMock[0].brandName,
    },
    usersData: ProductDetailsMock[0].users,
    refetch: jest.fn(),
    assessmentsData: {
      assessmentId: "",
      name: "",
      _id: ""
    },
    formulation: ProductDetailsMock[0].assessments.experimental[0].formulation,
    primaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.primary,
    secondaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging?.secondary,
    assessmentsType: "",
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
    setValidateCheck:() => { },
    validateCheck:false,
    setValidateCheckEvacuation:() => { },
    validateCheckEvacuation:false,
    setValidateCheckFinal:jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    setNewChangesInFormulation: jest.fn(),
    validateCheckPackaging:false,
  } as unknown as ProductContextProp;


  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging
    }));
    mockedUsePackaging.mockImplementation(() => ({
      ...PackagingMock,
      rows: TablePackagingMock,
      errors: new Map([
        [9, "500"],
        [10, "300"],
        [12, "200"]
      ]),
      handleFieldChange: jest.fn(),
      handleCloseChangeDailog: jest.fn(),
      handleContinueChangevlaue: jest.fn(),
      handleChangeComponentType: jest.fn(),
      handleCloseImportComponentDialog: jest.fn(),
      handleOpenImportComponentPopup: jest.fn(),
      handleCloseRecyclabilityStatusDialog: jest.fn(),
      handleDescriptionChange: jest.fn(),
      handleVPCSpecChange: jest.fn(),
      handleOpenRecyclabilityStatusPopup: jest.fn(),
      handleClickCancelButton: jest.fn(),
      handleMenuClose: jest.fn(),
      handleOpenDeletePopup: jest.fn(),
      handleMoreHorizClick: jest.fn(),
      handleEditPackagingComponent: jest.fn(),
      handleSave: jest.fn(),
      handleChangeAccordion: jest.fn(),
      handleClickSaveButton: jest.fn(),
      handleCloseDialog: jest.fn(),
      handleExpandClick: jest.fn(),
      handleComponentWeightChange: jest.fn(),
      handleComponentUnitsChange: jest.fn(),
      handleOpacityChange: jest.fn(),
      handleOpacifiersChange: jest.fn(),
      handleColorChange: jest.fn(),
      updateSaveButtonState: jest.fn(),
      setRows: jest.fn(),
      setRowsChangedFlag: jest.fn(),
      callChildComponentData: jest.fn(),
      callChildRecycleComponentData: jest.fn(),
      handleDelete: jest.fn(),
      setErrors: jest.fn(),
      handleCloseDeletePopup: jest.fn(),

    }));
    mockedUseFormulationTable.mockImplementation(() => ({
      ...FormulaionTableMock,
      handleMassChange: jest.fn(),
      handleNameChange: jest.fn(),
      handleCodeChange: jest.fn(),
      handleDeleteRow: jest.fn(),
      handleSearchChange: jest.fn(),
      handleSearchSelect: jest.fn(),
      handleMouseEnterWeight: jest.fn(),
      handleMouseLeaveWeight: jest.fn(),
      getTotalWeight: jest.fn(),
      formattedTotalWeight: 10,
      cancelChanges: jest.fn(),
      handleRequestSort: jest.fn(),
      getComparator: jest.fn(),
      stableSort: () => {
        return ({
          map: () => { return (<div></div>) }
        })
      },
      getColorByValue: jest.fn(),
      descendingComparator: jest.fn(),
    }));
    mockedUseLocation.mockReturnValue({
pathname:
"/view-all-results/experimental/6720e1d67103462f2c1eaa84/6720e6e57103462f2c1eb52c",
});
  });
  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
            <PostContext.Provider value={contextValue}>
            <ResultDataContext.Provider value={{...resultDataValue, currentTab: CURRENT_TAB.CARBON_FOOTPRINT}}>
              <ViewAllResults />
            </ResultDataContext.Provider>
              </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();

    });
  }, 8000);

  it('should render the component for second tab', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
            <PostContext.Provider value={contextValue}>
            <ResultDataContext.Provider value={{...resultDataValue, currentTab: CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}}>
              <ViewAllResults />
            </ResultDataContext.Provider>
              </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();

    });
    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[1])
    fireEvent.click(tabs[2])
  }, 8000);

  it('should render the component for SUSTAINABLE_PACKAGING tab', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
            <PostContext.Provider value={contextValue}>
            <ResultDataContext.Provider value={{...resultDataValue, currentTab: CURRENT_TAB.SUSTAINABLE_PACKAGING}}>
              <ViewAllResults />
            </ResultDataContext.Provider>
            </PostContext.Provider>
            </ConsumerPackagingContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();

    });
  }, 8000);

  it('should render the component for GREEN_CHEMISTRY tab', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
            <PostContext.Provider value={contextValue}>
            <ResultDataContext.Provider value={{...resultDataValue, currentTab: CURRENT_TAB.GREEN_CHEMISTRY}}>
              <ViewAllResults />
            </ResultDataContext.Provider>
              </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();

    });
  }, 8000);

  it('should render the component for TOP_LINE_RESULTS tab', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
            <PostContext.Provider value={contextValue}> 
            <ResultDataContext.Provider value={{...resultDataValue, currentTab: CURRENT_TAB.TOP_LINE_RESULTS}}>
              <ViewAllResults />
            </ResultDataContext.Provider>
              </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();

    });
  }, 8000);

  it('should render the component for default tab', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ConsumerPackagingContext.Provider value={consumerPackagingValue}>
            <PostContext.Provider value={contextValue}>
            <ResultDataContext.Provider value={{...resultDataValue, currentTab: "test"}}>
              <ViewAllResults />
            </ResultDataContext.Provider>
              </PostContext.Provider>
              </ConsumerPackagingContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();

    });
  }, 8000);
});
