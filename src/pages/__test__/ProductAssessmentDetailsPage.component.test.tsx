import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { useGlobaldata} from '../../contexts/masterData/DataContext';
import {GlobalDataMock} from "../../mocks/GlobalData.mock.json";
import {PackagingMock} from "../../mocks/Packaging.mock.json";
import useFormulationTable from '../../components/formulation/formulationComposition/useFormulationTable';
import {FormulaionTableMock} from "../../mocks/FormulationTable.mock.json";
import {TablePackagingMock} from "../../mocks/TablePackaging.mock.json";
import { ProductAssessmentDetailsPage } from '../ProductAssessmentDetailsPage.component';
import { ReactInfiniteProps } from '../../mocks/CoreLogin.mock';
import usePackaging from '../../components/consumer-packaging-tab/usePackaging';
import { useGetAssessmentDetailBySipID } from '../../hooks/UseGetProductDetails';

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

jest.mock("../../contexts/masterData/DataContext");
jest.mock("../../components/consumer-packaging-tab/usePackaging");
jest.mock("../../components/formulation/formulationComposition/useFormulationTable");

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
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
// 🔑 Mock the heavy providers so they don't run real hooks
jest.mock("../../contexts/productData/ProductDataContext", () => ({
  ProductDataProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-product-data-provider">{children}</div>
  ),
}));

jest.mock("../../contexts/resultData/ResultDataContext", () => ({
  ResultDataProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-result-data-provider">{children}</div>
  ),
}));

// 🔑 Mock the child component too, so we stop rendering deep into the tree
jest.mock("../../components/assessment-page", () => ({
  ProductAssessmentDetail: () => (
    <div data-testid="mock-product-assessment-detail" />
  ),
}));

// Mock the hook that fetches the assessment by sipId
jest.mock("../../hooks/UseGetProductDetails", () => ({
  useGetAssessmentDetailBySipID: jest.fn(),
}));
describe('ProductAssessmentDetailsPage', () => {

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
      errors : new Map([
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
    
  });
 const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProductAssessmentDetailsPage />
      </QueryClientProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
    // it('renders the component', async () => {
    //   await act(async () => {
    //     const { baseElement } = renderPage();
    //     expect(baseElement).not.toBeNull();
    //   });
    // });

  it("shows loading spinner when loading", () => {
    (useGetAssessmentDetailBySipID as jest.Mock).mockReturnValue({
      data: undefined,
      refetch: jest.fn(),
      isLoading: true,
    });

    renderPage();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it('shows "No data available" when no assessment is returned', () => {
    (useGetAssessmentDetailBySipID as jest.Mock).mockReturnValue({
      data: undefined,
      refetch: jest.fn(),
      isLoading: false,
    });

    renderPage();
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it("renders ProductAssessmentDetail when data exists", () => {
    (useGetAssessmentDetailBySipID as jest.Mock).mockReturnValue({
      data: [
        {
          assessmentId: "A1",
          productId: "P1",
          assessmentType: "experimental",
        },
      ],
      refetch: jest.fn(),
      isLoading: false,
    });

    renderPage();

    // ✅ Stop at the mocked child
    expect(
      screen.getByTestId("mock-product-assessment-detail")
    ).toBeInTheDocument();
    // ✅ And the providers were also mounted
    expect(screen.getByTestId("mock-product-data-provider")).toBeInTheDocument();
    expect(screen.getByTestId("mock-result-data-provider")).toBeInTheDocument();
  });
});