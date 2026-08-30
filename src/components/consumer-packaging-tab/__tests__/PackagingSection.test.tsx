import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { FormulaionTableMock } from "../../../mocks/FormulationTable.mock.json";
import { PackagingMock } from "../../../mocks/Packaging.mock.json";
import useFormulationTable from '../../formulation/formulationComposition/useFormulationTable';
import { TablePackagingMock } from "../../../mocks/TablePackaging.mock.json";
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import usePackaging from '../usePackaging';
import { useConsumerPackagingContext } from '../ConsumerPackagingContext';
import { PrimaryPackagingMock, SecondaryPackagingMock } from '../../../mocks/ProductDetails.mock';
import PackagingSection from '../PackagingSection';
import { ProductDataContext } from '../../../contexts/productData/ProductDataContext';


const queryClient = new QueryClient({});

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

jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseFormulationTable = useFormulationTable as jest.Mock;
const mockedUsePackaging = usePackaging as jest.Mock;
const mockedUseConsumerPackagingContext = useConsumerPackagingContext as jest.Mock;

jest.mock("../../formulation/formulationComposition/useFormulationTable");
jest.mock("../../../contexts/masterData/DataContext");
jest.mock("../../../hooks/UseGetProductDetails");
jest.mock("../usePackaging");
jest.mock("../ConsumerPackagingContext");

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

describe('PackagingSection', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: "test"
  }
  const value = {
    productData: {
      productId: "",
      productName: "",
      brandName: "",
      productSipId: "",
    },
    usersData: [
      {
        "name": "Chandra Raju, Kavyashree [Non-Kenvue]",
        "role": "Owner",
        "mail": "KChand02@kenvue.com"
      }
    ],
    refetch: () => { },
    assessmentsData: {
      assessmentId: '',
      name: '',
      _id: '',
    },
    setAssessmentsData: () => {},
    formulation: null,
    primaryPackaging: null,
    secondaryPackaging: null,
    assessmentsType: "experimental",
    packagingData: null,
    fetchingDataInProgress: false,
    isBaselinePresent: false,
    isBaselineDataComplete: false,
    isBaselineSkipped:false,
    newChangesInFormulation: null,
    setNewChangesInFormulation: jest.fn(),
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
    setValidateCheck:()=>{},
    validateCheck:false,
    setValidateCheckEvacuation:()=>{},
    validateCheckEvacuation:false,
    
    setValidateCheckFinal:()=>{},
    validateCheckFinal: false,
    setValidateCheckFormulation: ()=>{},
    validateCheckFormulation: false,
    setValidateCheckPackaging: ()=>{},
    validateCheckPackaging:false,
  };
  jest.mock("../../../helper/GenericFunctions", () => ({
    ...jest.requireActual("../../../helper/GenericFunctions"),
    CheckCRUDAccess: jest.fn(() => 1),
  }));
  const onAddComponent = jest.fn();
  const componentDataMock = {
    pc_nm: "string",
    description: "string",
    component_type: "string",
    recyclability_status: "string",
    weight: "string",
    opacifier: "string",
    stage: "string",
    state: "string",
    template: "string",
    sub_components: [{
      _id: 1,
      name: "Bottle",
      opacity: "Clear",
      color: "Green",
      finishing_process: "",
      material: [{
        _id: 1,
        material_name: "test",
        material_type: '',
        converting_process: '',
        pcr_content: '',
        material_pct: '',
        productEnvironmentalFootPrint: '',
        carbonFootPrint: '',
        virginPlasticValue: '',
      }]
    }],
    _id: "string",
    isEdited: false,
    isCalculated: true
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging
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
    mockedUseConsumerPackagingContext.mockImplementation(() => ({
      primaryData: PrimaryPackagingMock.components,
      secondaryData: SecondaryPackagingMock.components,
      handelChangeTableData: jest.fn(),
      resetData: true
    }));
  });

  it('should render the component', () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Primary"
            counter={1}
            components={[{ ...componentDataMock }]}
            onAddComponent={onAddComponent}

          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
    const expandIcon = screen.getAllByTestId('expand-more-icon')[0];
    fireEvent.click(expandIcon);
    const expandLessIcon = screen.getAllByTestId("expand-less-icon")[0];
    fireEvent.click(expandLessIcon);
  }, 8000);
  it('should display tooltip with correct content', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Primary"
            counter={1}
            components={[{ ...componentDataMock }]}
            onAddComponent={onAddComponent}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Use more specific selector
    const tooltipIcons = screen.getAllByTestId('InfoIcon');
    expect(tooltipIcons.length).toBeGreaterThan(0);
    // If you have multiple, target the first one
    expect(tooltipIcons[0]).toBeInTheDocument();
  });
  it('should not render add button when counter >= 10', () => {
    const { queryByText } = render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Primary"
            counter={10}
            components={[{ ...componentDataMock }]}
            onAddComponent={onAddComponent}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    expect(queryByText(/add primary packaging component/i)).toBeNull();
  });
  it('should disable add button when user lacks permissions', () => {
    // Mock permission check to return 0
    jest.mock("../../../helper/GenericFunctions", () => ({
      CheckCRUDAccess: jest.fn(() => 0),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ProductDataContext.Provider value={value}>
            <PackagingSection
              title="Primary"
              counter={1}
              components={[{ ...componentDataMock }]}
              onAddComponent={onAddComponent}
            />
          </ProductDataContext.Provider>
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const addButton = screen.getByRole('button', {
      name: /add primary packaging component/i
    });
    expect(addButton).toBeDisabled();
    expect(addButton).toHaveStyle('cursor: not-allowed');
  });
  
  it('should render secondary packaging components', () => {
    mockedUseConsumerPackagingContext.mockImplementation(() => ({
      secondaryData: SecondaryPackagingMock.components,
      // ... other context values
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Secondary"
            counter={1}
            components={[{ ...componentDataMock }]}
            onAddComponent={onAddComponent}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Secondary Packaging Components/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add secondary packaging component/i })).toBeInTheDocument();
  });

  it('should toggle component expansion on click', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Primary"
            counter={1}
            components={[{ ...componentDataMock }]}
            onAddComponent={onAddComponent}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const expandIcon = screen.getAllByTestId('expand-more-icon')[0];

    // First click to expand
    fireEvent.click(expandIcon);
    expect(await screen.findByTestId('expand-less-icon')).toBeInTheDocument();

    // Second click to collapse
    const collapseIcon = screen.getByTestId('expand-less-icon');
    fireEvent.click(collapseIcon);

    await waitFor(() => {
      expect(screen.queryByTestId('expand-less-icon')).toBeNull();
    });
  });
  it('should render components with correct props', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Primary"
            counter={1}
            components={[{ ...componentDataMock }]}
            onAddComponent={onAddComponent}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const componentTitles = screen.getAllByText(/Component #/i);
    expect(componentTitles.length).toBeGreaterThan(0);
  });

  it('should handle empty components array', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PackagingSection
            title="Primary"
            counter={1}
            components={[]}
            onAddComponent={onAddComponent}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    expect(screen.queryByText(/Component #/i)).toBeNull();
  });

});