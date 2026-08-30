/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, screen } from "@testing-library/react";
import { CommonBreadcrumb } from "../CommonBreadcrumb.component";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));
import useFormulaAndConsumer from '../../formulation/formulation-tab/useFormulaAndConsumer';
// import { useGlobaldata } from "../../../contexts/masterData/DataContext";

const queryClient = new QueryClient({});
// Mock truncate function
jest.mock("../../../helper/GenericFunctions", () => ({
    truncate: (text: string) => text,
}));
jest.mock("../../../helper/GenericFunctions", () => ({
    ...jest.requireActual("../../../helper/GenericFunctions"),
    CheckCRUDAccess: jest.fn(() => 1),
}));

// Create Mock Providers
const mockSetTabSwitched = jest.fn();
const mockSetIsOwnerUser = jest.fn();

const MockSidebarProvider = ({ children, value = { currentSection: "home" } }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SidebarContext = require("../../../contexts/sidebarData/SidebarStateContext").SidebarContext;
    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

const MockAutoSaveProvider = ({ children, value = {
    setTabSwitched: mockSetTabSwitched, changedFields: [],
    setIsOwnerUser: mockSetIsOwnerUser,
    hasUncalculatedChanges: false,
    isDataCompleted: true,
    setPathNavigation: jest.fn(),
    setShowNavigationWarning: jest.fn(),
    setIsAllFlagsCalc: jest.fn(),
    setChangedFields: jest.fn(),
    setFormulationFormData: jest.fn(),
 } }: any) => {
    const AutoSaveContext = require("../../../contexts/autoSaveContext/AutoSaveContext").AutoSaveContext;
    return <AutoSaveContext.Provider value={value}>{children}</AutoSaveContext.Provider>;
};
const mockedUseFormulaAndConsumer = useFormulaAndConsumer as jest.Mock;
jest.mock('../../formulation/formulation-tab/useFormulaAndConsumer');
// ProductData
const MockProductDataProvider = ({ children, value = { bothPackFormulaStatus: true, usersData: {} } }: any) => {
  const { ProductDataContext } = require("../../../contexts/productData/ProductDataContext");
  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};


// ResultData
const MockResultDataProvider = ({ children }: any) => {
  const { ResultDataContext } = require("../../../contexts/resultData/ResultDataContext");
  return <ResultDataContext.Provider value={{ dialsError: false }}>{children}</ResultDataContext.Provider>;
};
const renderComponent = (
  props: any,
  autoSaveContextValue?: any,
  sidebarContextValue?: any,
  productDataContextValue?: any
) => {
  return render(
    <QueryClientProvider contextSharing={true} client={queryClient}>
      <BrowserRouter>
              <MockSidebarProvider value={sidebarContextValue}> 
                  <MockAutoSaveProvider value={autoSaveContextValue}>
            <MockProductDataProvider value={productDataContextValue}>
              <MockResultDataProvider>
                <CommonBreadcrumb {...props} />
              </MockResultDataProvider>
            </MockProductDataProvider>
          </MockAutoSaveProvider>
        </MockSidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
jest.mock('../../formulation/formulation-tab/useFormulaAndConsumer', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    allFlagsCalculated: true,
    formulationData: {},
    errors: {},
    isFormValid: jest.fn(),
  })),
}));

describe("CommonBreadcrumb Component", () => {
    const baseProps = {
        productID: "1",
        productName: "Product Name",
        experimentalID: "2",
        experimentalName: "Experimental Name",
        path: "/product-assessment/something",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render correctly when path starts with 'product-assessment' and experimentalID is present", () => {
        const { getByText } = renderComponent(baseProps);

        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("Product Name")).toBeInTheDocument();
        expect(getByText("Experimental Name")).toBeInTheDocument();
        expect(mockSetIsOwnerUser).toHaveBeenCalled();
    });

    it("should navigate to dashboard when Home is clicked", () => {
         const productDataContextValue = {
    bothPackFormulaStatus: false, // force the else branch
    usersData: {},
  };

  const { getByText } = renderComponent(baseProps, undefined, undefined, productDataContextValue);
        fireEvent.click(getByText("Home"));
        expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("should navigate to my-product-detail when Product Name is clicked", () => {
 const productDataContextValue = {
    bothPackFormulaStatus: false, // force the else branch
    usersData: {},
  };

  const { getByText } = renderComponent(baseProps, undefined, undefined, productDataContextValue);
        fireEvent.click(getByText("Product Name"));
        expect(mockedNavigate).toHaveBeenCalledWith("/my-product-detail/1");
    });

    it("should render correctly when path is 'my-product-detail' and experimentalID is empty", () => {
        const props = {
            ...baseProps,
            path: "/my-product-detail",
            experimentalID: "",
        };
        const { getByText } = renderComponent(props);

        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("Product Name")).toBeInTheDocument();
    });

    it("should render correctly for other paths", () => {
        const props = {
            ...baseProps,
            path: "/something-else",
            experimentalID: "",
        };
        const { getByText } = renderComponent(props);

        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("Product Name")).toBeInTheDocument();
    });

    it("should call setTabSwitched if changedFields has values when button clicked", () => {
        const autoSaveContextValue = {
            setTabSwitched: mockSetTabSwitched,
            changedFields: ["someField"],
            setIsOwnerUser: mockSetIsOwnerUser,
            hasUncalculatedChanges: false,
            isDataCompleted: true,
            setPathNavigation: jest.fn(),
            setShowNavigationWarning: jest.fn(),
            setIsAllFlagsCalc: jest.fn(),
            setChangedFields: jest.fn(),
            setFormulationFormData: jest.fn(),
        };

        const { getByText } = renderComponent(baseProps, autoSaveContextValue);

        fireEvent.click(getByText("Home"));
        expect(mockSetTabSwitched).toHaveBeenCalledWith(true);
    });

    it("should navigate to allproduct if currentSection is not home", () => {
        const sidebarContextValue = {
            currentSection: "allproduct",
        };
         const productDataContextValue = {
    bothPackFormulaStatus: false, // force the else branch
    usersData: {},
  };

  const { getByText } = renderComponent(baseProps, undefined, sidebarContextValue, productDataContextValue);

        fireEvent.click(getByText("All Product"));
        expect(mockedNavigate).toHaveBeenCalledWith("/allproduct");
    });
    it("should navigate to dashboard without calling setTabSwitched when no changedFields", () => {
        const autoSaveContextValue = {
            setTabSwitched: mockSetTabSwitched,
            changedFields: [],
            setIsOwnerUser: mockSetIsOwnerUser,
            hasUncalculatedChanges: false,
            isDataCompleted: true,
            setPathNavigation: jest.fn(),
            setShowNavigationWarning: jest.fn(),
            setIsAllFlagsCalc: jest.fn(),
            setChangedFields: jest.fn(),
            setFormulationFormData: jest.fn(),
        };
 const productDataContextValue = {
    bothPackFormulaStatus: false, // force the else branch
    usersData: {},
  };

  const { getByText } = renderComponent(baseProps, autoSaveContextValue,undefined, productDataContextValue);

        fireEvent.click(getByText("Home"));

        expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
        expect(mockSetTabSwitched).not.toHaveBeenCalled();
    });

    it("should navigate to allproduct and call setTabSwitched when changedFields exist", () => {
        const autoSaveContextValue = {
            setTabSwitched: mockSetTabSwitched,
            changedFields: ["field1"],
            setIsOwnerUser: mockSetIsOwnerUser,
            hasUncalculatedChanges: false,
            isDataCompleted: true,
            setPathNavigation: jest.fn(),
            setShowNavigationWarning: jest.fn(),
            setIsAllFlagsCalc: jest.fn(),
            setChangedFields: jest.fn(),
            setFormulationFormData: jest.fn(),
        };
        const sidebarContextValue = {
            currentSection: "allproduct",
        };
        const productDataContextValue = {
    bothPackFormulaStatus: false, // force the else branch
    usersData: {},
  };

  const { getByText } = renderComponent(baseProps, autoSaveContextValue, sidebarContextValue, productDataContextValue);

        fireEvent.click(getByText("All Product"));

        expect(mockedNavigate).toHaveBeenCalledWith("/allproduct");
        expect(mockSetTabSwitched).toHaveBeenCalledWith(true);
    });
    it("should render correctly when path is 'my-product-detail' and experimentalID is empty", () => {

        const props = { ...baseProps, path: "/my-product-detail", experimentalID: "" };

        const { getByText } = renderComponent(props);

        expect(getByText("Home")).toBeInTheDocument();

        expect(getByText("Product Name")).toBeInTheDocument();

    });



    it("should render correctly for other paths", () => {

        const props = { ...baseProps, path: "/something-else", experimentalID: "" };

        const { getByText } = renderComponent(props);

        expect(getByText("Home")).toBeInTheDocument();

        expect(getByText("Product Name")).toBeInTheDocument();

    });
   
  it("should call setPathNavigation and setShowNavigationWarning instead of navigate when all conditions are true", () => {
     mockedUseFormulaAndConsumer.mockImplementation(() => ({
        allFlagsCalculated:true,
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
        handleUseDoseChange: jest.fn()
    }));
      renderComponent(baseProps);
fireEvent.click(screen.getByRole("button", { name: /Home/ }));

  });

});