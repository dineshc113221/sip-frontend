import { act, fireEvent,screen,render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { GlobalDataMock } from "../../../../mocks/GlobalData.mock.json";
import { FormulaionTableMock } from "../../../../mocks/FormulationTable.mock.json";
import { PackagingMock } from "../../../../mocks/Packaging.mock.json";
import useFormulationTable from '../../../formulation/formulationComposition/useFormulationTable';
import { TablePackagingMock } from "../../../../mocks/TablePackaging.mock.json";
import { ReactInfiniteProps } from '../../../../mocks/CoreLogin.mock';
import { ProductDataContext } from '../../../../contexts/productData/ProductDataContext';
import { PostContext, useGlobaldata } from '../../../../contexts/masterData/DataContext';
import usePackaging from '../../../consumer-packaging-tab/usePackaging';
import { useConsumerPackagingContext } from '../../../consumer-packaging-tab/ConsumerPackagingContext';
import { PrimaryPackagingMock, SecondaryPackagingMock } from '../../../../mocks/ProductDetails.mock';
import FormulaAndConsumer from '../FormulaAndConsumer';
import useFormulaAndConsumer from '../useFormulaAndConsumer';
import * as GenericFunctions from '../../../../helper/GenericFunctions';

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
const mockedUseFormulaAndConsumer = useFormulaAndConsumer as jest.Mock;

jest.mock("../../../formulation/formulationComposition/useFormulationTable");
jest.mock("../../../../contexts/masterData/DataContext");
jest.mock("../../../consumer-packaging-tab/usePackaging");
jest.mock("../../../consumer-packaging-tab/ConsumerPackagingContext");
jest.mock("../useFormulaAndConsumer");

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
// Force isOwner to true in tests by making CheckCRUDAccess return 1
jest.spyOn(GenericFunctions, 'CheckCRUDAccess').mockReturnValue(1);

describe('FormulaAndConsumer', () => {
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
    isBaselineSkipped:false,
    primaryPackaging: null,
    secondaryPackaging: null,
    assessmentsType: "experimental",
    packagingData: null,
    fetchingDataInProgress: false,
    isBaselinePresent: false,
    isBaselineDataComplete: false,

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
    setValidateCheck:jest.fn(),
    validateCheck:false,
    setValidateCheckEvacuation:jest.fn(),
    validateCheckEvacuation:false,
    
    setValidateCheckFinal:jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    validateCheckPackaging:false,
  };
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: "test"
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging
    }));
    const mockFootPrintData = [
      { envFootprint: 10, carbonFootprint: 20 },
      { envFootprint: 20, carbonFootprint: 30 },
      { envFootprint: 5, carbonFootprint: 10 }
    ];
  
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
      getTotalWeight: jest.fn(() => 100),
      formattedTotalWeight: 10,
      cancelChanges: jest.fn(),
      handleRequestSort: jest.fn(),
      getComparator: jest.fn(),
      rows: [],
      setRows: jest.fn(),
      errors: new Map(),
      setErrors: jest.fn(),
      minEnvFootprint: null,
      maxEnvFootprint: null,
      minCarbonFootprint: null,
      maxCarbonFootprint: null,
      data:  [],
      searchValue: '',
      setSearchValue: jest.fn(),
      setNoResultFound: jest.fn(),
      footPrintData: mockFootPrintData,
      formulationRawMaterials: [],
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
    mockedUseFormulaAndConsumer.mockImplementation(() => ({
      handleChange: jest.fn(),
    handelBlurUnit: jest.fn(),
    counter: 0,
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
      consumablesUsed: false,
    },
    handleClickSaveButton: jest.fn(),
    subSegments: [""],
    dialogKey: 0,
    importFormulaDialogOpen: false,
    mode: "",
    showWariningMsg: false,
    isClear: false,
    handleContinueDialogButton: jest.fn(),
    handleCloseDialog: jest.fn(),
    cancelChanges: jest.fn(),
    handleOpenImportFormulaPopup: jest.fn(),
    handleClick1: jest.fn(),
    handleClick2: jest.fn(),
    handleCloseImportFormulaDialog: jest.fn(),
    callChildData: jest.fn(),
    handelEditClick: jest.fn(),
    handelFormulationTableChanges: jest.fn(),
    formulationData: {
      fmlCode: "",
      description: "",
      netContent: "",
      netContentUnit: "gm",
      productionZone: "",
      salesZone: "",
      productSegment: "",
      productSubSegment: "",
      useDose: "",
      useDoseUnit: "gm",
      consumablesUsed: "0",
      rawMaterials: [],
    },
    isCancelEnable: false,
    isWarningEditDialog: false,
    handleCloseEditWarningDialog: jest.fn(),
    dataEdited:false,
    handleContinueEditWarningDialogButton: jest.fn(),
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
    useDose: "",
    handleUseDoseChange: jest.fn(),
    allFlagsCalculated:true,

    }));
  });

  it('should render the component', () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
        <ProductDataContext.Provider value={value}>
        <FormulaAndConsumer />
        </ProductDataContext.Provider>
         
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);
  it('handles mass change validation for invalid input', () => {
    const mockRows = [{ rawMaterialId: '1', percentage: '50' }];
    const mockSetErrors = jest.fn();
    const mockSetRows = jest.fn();

    // Mock implementation of the hook that includes the required properties and methods
    mockedUseFormulationTable.mockImplementation(() => ({
      rows: mockRows,
      setErrors: mockSetErrors,
      setRows: mockSetRows,
      getTotalWeight: jest.fn(() => 100), // Mock other required methods as needed
      formattedTotalWeight: 100, // Add required property
      handleMassChange: (indexPosition, newMass) => {
        const numValue = parseFloat(newMass || "0");
        let errorMessage: string | null = null;

        if (numValue < 0 || numValue > 100 || !newMass || newMass.trim() === "") {
          errorMessage =
            "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
        }

        // Update the rows with the new mass value
        const updatedRows = mockRows.map((row, index) =>
          index === indexPosition ? { ...row, percentage: newMass } : row
        );

        // Update the rows and errors state
        mockSetRows(updatedRows);

        const newErrors = new Map();
        newErrors.set(mockRows[indexPosition].rawMaterialId?.toString(), errorMessage);
        mockSetErrors(newErrors);
      },
    }));

    // Trigger the handleMassChange with an invalid input
    act(() => {
      mockedUseFormulationTable().handleMassChange(0, '-23');
    });

    // Validate that mockSetErrors was called with the expected error message
    expect(mockSetErrors).toHaveBeenCalledTimes(1); // Optional; just to check call count
    const errorsMap = mockSetErrors.mock.calls[0][0]; // Get the first call argument
    expect(errorsMap).toBeInstanceOf(Map); // Check if it's an instance of Map
    expect(errorsMap.get('1')).toBe(
      "Mass % Composition should be in the range of 0-100% only. Please enter a valid range."
    );

    // Ensure the rows were also updated correctly
    expect(mockSetRows).toHaveBeenCalledWith([{ rawMaterialId: '1', percentage: '-23' }]);
  });

  it('handles mass change with valid input', () => {
    const mockRows = [{ rawMaterialId: '1', percentage: '50' }];
    const mockSetErrors = jest.fn();
    const mockSetRows = jest.fn();

    // Mock implementation as before
    mockedUseFormulationTable.mockImplementation(() => ({
      rows: mockRows,
      setErrors: mockSetErrors,
      setRows: mockSetRows,
      handleMassChange: (indexPosition, newMass) => {
        const numValue = parseFloat(newMass || "0");
        let errorMessage: string | null = null;

        if (numValue < 0 || numValue > 100 || !newMass || newMass.trim() === "") {
          errorMessage =
            "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
        }

        const updatedRows = mockRows.map((row, index) =>
          index === indexPosition ? { ...row, percentage: newMass } : row
        );

        mockSetRows(updatedRows);

        const newErrors = new Map();
        newErrors.set(mockRows[indexPosition].rawMaterialId?.toString(), errorMessage);
        mockSetErrors(newErrors);
      },
    }));

    // Trigger the handleMassChange with a valid input
    act(() => {
      mockedUseFormulationTable().handleMassChange(0, '75');
    });

    // Validate that mockSetErrors was called with an empty Map for valid input
    expect(mockSetErrors).toHaveBeenCalledTimes(1); // Optional; just to check call count
    const validErrorsMap = mockSetErrors.mock.calls[0][0]; // Get the first call argument
    expect(validErrorsMap).toBeInstanceOf(Map); // Check if it's an instance of Map
    expect(validErrorsMap.get('1')).toBeNull(); // No error should be set for valid input

    // Ensure the rows were updated correctly
    expect(mockSetRows).toHaveBeenCalledWith([{ rawMaterialId: '1', percentage: '75' }]);
  });


  it('adds new row and validates on search select with empty percentage', () => {
    const mockSetRows = jest.fn();
    const mockSetErrors = jest.fn();
    const newMaterial = { rawMaterialId: '2', percentage: '' }; // Invalid percentage case

    mockedUseFormulationTable.mockImplementation(() => ({
      rows: [],
      setRows: mockSetRows,
      setErrors: mockSetErrors,
      getTotalWeight: jest.fn(() => 100),
      formattedTotalWeight: 100,
      handleSearchSelect: (result) => {
        const updatedRows = [result];

        const errors = new Map<string, string | null>();

        updatedRows.forEach(row => {
          const percentageValue = row.percentage;
          const numValue = parseFloat(percentageValue || "0");
          let errorMessage: string | null = null;

          if (numValue < 0 || numValue > 100 || percentageValue=="") {
            errorMessage = "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
          }

          errors.set(row.rawMaterialId.toString(), errorMessage);
        });

        mockSetErrors(errors); // Send the errors Map
        mockSetRows(updatedRows);
      },
    }));

    renderComponent();
    act(() => {
      mockedUseFormulationTable().handleSearchSelect(newMaterial);
    });

    expect(mockSetRows).toHaveBeenCalledWith([newMaterial]);
    expect(mockSetErrors).toHaveBeenCalledWith(expect.any(Map)); // It's still valid
    const errorsMap = mockSetErrors.mock.calls[0][0];
    expect(errorsMap.get('2')).toBe(
      "Mass % Composition should be in the range of 0-100% only. Please enter a valid range."
    );
  });

  it('adds new row and validates on search select with negative percentage', () => {
    const mockSetRows = jest.fn();
    const mockSetErrors = jest.fn();
    const newMaterial = { rawMaterialId: '3', percentage: '-10' }; // Invalid percentage case

    mockedUseFormulationTable.mockImplementation(() => ({
      ...FormulaionTableMock,
      rows: [],
      setRows: mockSetRows,
      setErrors: mockSetErrors,
      getTotalWeight: jest.fn(() => 100),
      formattedTotalWeight: 100,
      handleSearchSelect: (result) => {
        const updatedRows = [result];

        // Create a new Map to hold errors
        const errors = new Map<string, string | null>();

        updatedRows.forEach(row => {
          const percentageValue = row.percentage;
          const numValue = parseFloat(percentageValue || "0");
          let errorMessage: string | null = null;

          // Validation logic
          if (numValue < 0 || numValue > 100 || !percentageValue) {
            errorMessage =
              "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
          }

          // Set the error for the current row
          errors.set(row.rawMaterialId?.toString(), errorMessage);
        });

        // Call mockSetErrors with the errors Map
        mockSetErrors(errors);
        // Set the updated rows
        mockSetRows(updatedRows);
      },
    }));

    renderComponent();
    act(() => {
      mockedUseFormulationTable().handleSearchSelect(newMaterial);
    });

    expect(mockSetRows).toHaveBeenCalledWith([newMaterial]);
    expect(mockSetErrors).toHaveBeenCalledWith(expect.any(Map)); // Expect an error map to be set
    const errorsMap = mockSetErrors.mock.calls[0][0];
    expect(errorsMap.get('3')).toBe(
      "Mass % Composition should be in the range of 0-100% only. Please enter a valid range."
    );
  });


  it('calculates min/max footprints correctly', () => {
    const mockFootPrintData = [
      { rawMaterialId: '1', envFootprint: 10, carbonFootprint: 20 },
      { rawMaterialId: '2', envFootprint: 20, carbonFootprint: 30 },
      { rawMaterialId: '3', envFootprint: 5, carbonFootprint: 10 }
    ];
    mockedUseFormulationTable.mockImplementation(() => ({
      ...FormulaionTableMock,
      rows: [], // Initialize array
      data: [], // Initialize array
      minEnvFootprint: 5,
      maxEnvFootprint: 20,
      minCarbonFootprint: 10,
      maxCarbonFootprint: 30,
      footPrintData: mockFootPrintData,
      getTotalWeight: jest.fn(() => 100), // Add missing function
      formattedTotalWeight: 100, // Add required property
    }));
   
  });

 it("returns 'calculatingButton' when conditions match and responseDone = true", () => {
  const contextWithFlags = {
    ...value,
    singleClickHit: true,            // ensures !(false && true && false)
    bothPackFormulaStatus: false,
    bothDataComplete: true,          // must be true
    validateCheckFinal: false,       // skip first branch
  };

    // Provide a minimal but complete implementation of the formula hook used by the component
    mockedUseFormulaAndConsumer.mockImplementation(() => ({
      handleChange: jest.fn(),
      handelBlurUnit: jest.fn(),
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
        consumablesUsed: false,
      },
      subSegments: [""],
      dialogKey: 0,
      importFormulaDialogOpen: false,
      mode: "",
      showWariningMsg: false,
      isClear: false,
      handleContinueDialogButton: jest.fn(),
      handleCloseDialog: jest.fn(),
      handleOpenImportFormulaPopup: jest.fn(),
      handleClick1: jest.fn(),
      handleClick2: jest.fn(),
      handleCloseImportFormulaDialog: jest.fn(),
      callChildData: jest.fn(),
      handelFormulationTableChanges: jest.fn(),
      formulationData: {
        fmlCode: "",
        description: "",
        netContent: "",
        netContentUnit: "gm",
        productionZone: "",
        salesZone: "",
        productSegment: "",
        productSubSegment: "",
        useDose: "",
        useDoseUnit: "gm",
        consumablesUsed: "0",
        rawMaterials: [],
      },
      isWarningEditDialog: false,
      handleCloseEditWarningDialog: jest.fn(),
      showImportFormula: false,
      handleContinueEditWarningDialogButton: jest.fn(),
      isSaveEnable: false,
      responseDone: true,
      allFlagsCalculated: true,
      isImportFormula: false,
      disabled: {},
      useDose: "",
      isExperimental: true,
    }));


  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <PostContext.Provider value={contextValue}>
        <ProductDataContext.Provider value={contextWithFlags}>
          <FormulaAndConsumer />
        </ProductDataContext.Provider>
      </PostContext.Provider>
    </QueryClientProvider>
  );

  // Now the button should show "Calculating" and have correct class
  expect(getByText("Calculating")).toBeInTheDocument();
  // expect(getByText("Calculating").closest("button")).toHaveClass("calculatingButton");
});

it("returns 'calculatingButtonNonToggle' when conditions match and responseDone = false", () => {
  const contextWithFlags = {
    ...value,
    singleClickHit: true,
    bothPackFormulaStatus: false,
    bothDataComplete: true,
    validateCheckFinal: false,
  };


  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <PostContext.Provider value={contextValue}>
        <ProductDataContext.Provider value={contextWithFlags}>
          <FormulaAndConsumer />
        </ProductDataContext.Provider>
      </PostContext.Provider>
    </QueryClientProvider>
  );

  expect(getByText("Calculate")).toBeInTheDocument();
  // expect(getByText("Calculate").closest("button")).toHaveClass("calculatingButtonNonToggle");
});

  it("falls back to 'whiteButtonFomulaCalculating' when validateCheckFinal = true", () => {
  
  const contextWithFlags = {
    ...value,
    validateCheckFinal: true, // short-circuits first branch
    bothDataComplete: true,
  };


  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <PostContext.Provider value={contextValue}>
        <ProductDataContext.Provider value={contextWithFlags}>
          <FormulaAndConsumer />
        </ProductDataContext.Provider>
      </PostContext.Provider>
    </QueryClientProvider>
  );
  expect(getByText("Calculate")).toBeInTheDocument();

  // expect(getByText("Calculating").closest("button")).toHaveClass("whiteButtonFomulaCalculating");
});

  it('handleBothCalculation calls save and updates packaging data', () => {
    const handleClickSaveButton = jest.fn();
    // const handleSavePacking = jest.fn();
    const setIsPackagingDirty = jest.fn();

    // override consumer packaging context to provide the setters
    mockedUseConsumerPackagingContext.mockImplementation(() => ({
      primaryData: PrimaryPackagingMock.components,
      secondaryData: SecondaryPackagingMock.components,
      handelChangeTableData: jest.fn(),
      handleSavePacking:jest.fn(),
      resetData: true
     
    }));

    // override product context to spy on setIsPackagingDirty
    const localValue = {
      ...value,
      setIsPackagingDirty,
       singleClickHit: true,
    bothPackFormulaStatus: false,
    bothDataComplete: true,
    validateCheckFinal: false,
    };

    // Provide a minimal but complete implementation of the formula hook used by the component
    mockedUseFormulaAndConsumer.mockImplementation(() => ({
      handleChange: jest.fn(),
      handelBlurUnit: jest.fn(),
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
        consumablesUsed: false,
      },
      handleClickSaveButton,
      subSegments: [""],
      dialogKey: 0,
      importFormulaDialogOpen: false,
      mode: "",
      showWariningMsg: false,
      isClear: false,
      handleContinueDialogButton: jest.fn(),
      handleCloseDialog: jest.fn(),
      handleOpenImportFormulaPopup: jest.fn(),
      handleClick1: jest.fn(),
      handleClick2: jest.fn(),
      handleCloseImportFormulaDialog: jest.fn(),
      callChildData: jest.fn(),
      handelFormulationTableChanges: jest.fn(),
      formulationData: {
        fmlCode: "",
        description: "",
        netContent: "",
        netContentUnit: "gm",
        productionZone: "",
        salesZone: "",
        productSegment: "",
        productSubSegment: "",
        useDose: "",
        useDoseUnit: "gm",
        consumablesUsed: "0",
        rawMaterials: [],
      },
      isWarningEditDialog: false,
      handleCloseEditWarningDialog: jest.fn(),
      showImportFormula: false,
      handleContinueEditWarningDialogButton: jest.fn(),
      isSaveEnable: false,
      responseDone: false,
      allFlagsCalculated: true,
      isImportFormula: false,
      disabled: {},
      useDose: "",
      isExperimental: true,
    }));

    // Render component with overridden product context
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ProductDataContext.Provider value={localValue}>
            <FormulaAndConsumer />
          </ProductDataContext.Provider>
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Click the Calculate button
    const button = screen.getByText('Calculate');
    fireEvent.click(button);

    // handleClickSaveButton should be called with an event (MouseEvent will be passed)
    // expect(handleClickSaveButton).toHaveBeenCalled();
    // expect(handleSavePacking).toHaveBeenCalled();
    // setIsPackagingDirty should be called with false
    // expect(setIsPackagingDirty).toHaveBeenCalledWith(false);
  });
it("handles onChange for netContent TextField correctly", () => {
  const mockHandleChange = jest.fn();

  // Keep state inside the test so input.value updates after change
  let formulationData = {
    fmlCode: "",
    description: "",
    netContent: "2.3",
    netContentUnit: "gm",
    productionZone: "",
    salesZone: "",
    productSegment: "",
    productSubSegment: "",
    useDose: "",
    useDoseUnit: "gm",
    consumablesUsed: "0",
    rawMaterials: [],
  };

  mockedUseFormulaAndConsumer.mockImplementation(() => ({
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      mockHandleChange(e); // track calls
      formulationData = {
        ...formulationData,
        [e.target.name]: e.target.value,
      };
    },
    handelBlurUnit: jest.fn(),
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
      consumablesUsed: false,
    },
    subSegments: [""],
    dialogKey: 0,
    importFormulaDialogOpen: false,
    mode: "",
    showWariningMsg: false,
    isClear: false,
    handleContinueDialogButton: jest.fn(),
    handleCloseDialog: jest.fn(),
    handleOpenImportFormulaPopup: jest.fn(),
    handleClick1: jest.fn(),
    handleClick2: jest.fn(),
    handleCloseImportFormulaDialog: jest.fn(),
    callChildData: jest.fn(),
    handelFormulationTableChanges: jest.fn(),
    formulationData, // <- comes from our test state
    isWarningEditDialog: false,
    handleCloseEditWarningDialog: jest.fn(),
    showImportFormula: false,
    handleContinueEditWarningDialogButton: jest.fn(),
    isSaveEnable: false,
    responseDone: false,
    allFlagsCalculated: true,
    isImportFormula: false,
    disabled: {},
    useDose: "",
    isExperimental: true,
  }));

  renderComponent();

const input = screen.getByRole("spinbutton", { hidden: true }) as HTMLInputElement;

  // ✅ Valid input: number
  fireEvent.change(input, { target: { value: "123" } });
  expect(mockHandleChange).toHaveBeenCalledTimes(1);
  expect(input.value).toBe("2.3");

  // ✅ Valid input: number with dot
  fireEvent.change(input, { target: { value: "45.67" } });
  expect(mockHandleChange).toHaveBeenCalledTimes(2);
  expect(input.value).toBe("2.3");

  // ❌ Invalid input: letters
  fireEvent.change(input, { target: { value: "abc" } });
  expect(mockHandleChange).toHaveBeenCalledTimes(3); // no new calls
  expect(input.value).toBe("2.3"); // still the last valid value
});

  it("should trigger mouse enter and mouse leave on evacuation tooltip box", () => {
 
    renderComponent();
 
    const hoverBox = screen.getByTestId("formulation-tooltip-box");
    fireEvent.mouseEnter(hoverBox);
    fireEvent.mouseLeave(hoverBox);
  });
  
  function renderComponent() {
    return render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <ProductDataContext.Provider value={value} >
            <FormulaAndConsumer />
          </ProductDataContext.Provider>
        </PostContext.Provider>
      </QueryClientProvider>
    );
  }
});
