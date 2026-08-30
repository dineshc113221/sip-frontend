import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ImportComponent, { ImportComponentProps } from "./../ImportComponent";
import { useConsumerPackagingContext } from "./../ConsumerPackagingContext";
import { ProductDataContext } from "../../../contexts/productData/ProductDataContext";

// Mock the context hooks
jest.mock("./../ConsumerPackagingContext", () => ({
  useConsumerPackagingContext: jest.fn(),
}));

jest.mock("../../../contexts/productData/ProductDataContext", () => ({
  ProductDataContext: React.createContext({}),
}));

// Mock dependencies
const mockHandleChange = jest.fn();
const mockHandleOpenImportComponentPopup = jest.fn();
const mockCheckCRUDAccess = jest.fn(() => 1);

jest.mock("../../../helper/GenericFunctions", () => ({
  CheckCRUDAccess: jest.fn(() => mockCheckCRUDAccess()),
}));
describe("ImportComponent", () => {
  const defaultProps: ImportComponentProps = {
    handleOpenImportComponentPopup: mockHandleOpenImportComponentPopup,
    isSaved: false,
    type: "Primary",
    index: 0,
    componentData: {
      pc_nm: "Test PC", // Updated to match expected display value
      description: "Test Description", // Updated to match expected display value
      component_type: "test",
      weight: "test",
      opacifier: "test",
      stage: "test",
      state: "test",
      template: "test",
      isEdited: false,
      isCalculated: true,
      sub_components: [
        {
          _id: 1,
          name: "Bottle",
          opacity: "Clear",
          color: "Green",
          finishing_process: "",
          material: [
            {
              material_name: "test",
              material_type: "test",
              material_pct: "test",
              converting_process: "test",
            },
          ],
        },
      ],
    },
    isImportData: false,
  };

  const value = {
    productData: {
      productId: "",
      productName: "",
      brandName: "",
      productSipId: "",
    },
    usersData: [
      {
        name: "Chandra Raju, Kavyashree [Non-Kenvue]",
        role: "Owner",
        mail: "KChand02@kenvue.com",
      },
    ],
    refetch: () => {},
    assessmentsData: {
      assessmentId: "",
      name: "",
      _id: "",
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
    setFormulationDataComplete: () => {},
    formulationDataComplete: false,
    setPackagingDataComplete: () => {},
    packagingDataComplete: false,
    bothDataComplete: false,
    singleClickHit: false,
    setSingleClickHit: () => {},
    bothPackFormulaStatus: false,
    setBothPackFormulaStatus: () => {},
    isPackagingDirty: false,
    setIsPackagingDirty: () => {},
    setValidateCheck: () => {},
    validateCheck: false,
    setValidateCheckEvacuation: () => {},
    validateCheckEvacuation: false,

    setValidateCheckFinal: () => {},
    validateCheckFinal: false,
    setValidateCheckFormulation: () => {},
    validateCheckFormulation: false,
    setValidateCheckPackaging: () => {},
    validateCheckPackaging: false,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    (useConsumerPackagingContext as jest.Mock).mockReturnValue({
      handleChange: mockHandleChange,
    });
    (mockCheckCRUDAccess as jest.Mock).mockReturnValue(1);
  });

  it("renders correctly with default props", () => {
    const { getByText, getByDisplayValue } = render(
      <ProductDataContext.Provider value={value}>
        <ImportComponent {...defaultProps} />
      </ProductDataContext.Provider>
    );

    expect(getByText("PC Spec")).toBeInTheDocument();
    expect(getByDisplayValue("Test PC")).toBeInTheDocument();
    expect(getByText("Component Description")).toBeInTheDocument();
    expect(getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(getByText("Import Component")).toBeInTheDocument();
  });

  it("disables the import button when isSaved is true", () => {
    const { getByText } = render(
      <ProductDataContext.Provider value={value}>
        <ImportComponent {...defaultProps} isSaved={true} />
      </ProductDataContext.Provider>
    );

    const button = getByText("Import Component");
    expect(button).toBeDisabled();
  });

  it("calls handleOpenImportComponentPopup when the button is clicked", () => {
    const { getByText } = render(
      <ProductDataContext.Provider value={value}>
        <ImportComponent {...defaultProps} />
      </ProductDataContext.Provider>
    );

    const button = getByText("Import Component");
    fireEvent.click(button);
    expect(mockHandleOpenImportComponentPopup).toHaveBeenCalled();
  });

  it("disables fields based on context values and CheckCRUDAccess", () => {
    (mockCheckCRUDAccess as jest.Mock).mockReturnValue(0);

    const { getByDisplayValue } = render(
      <ProductDataContext.Provider value={value}>
        <ImportComponent {...defaultProps} />
      </ProductDataContext.Provider>
    );

    const pcSpecField = getByDisplayValue("Test PC");
    expect(pcSpecField).toBeDisabled();

    const descriptionField = getByDisplayValue("Test Description");
    expect(descriptionField).toBeDisabled();
  });

  it("renders correct cursor style for import button based on isSaved", () => {
    const { getByText, rerender } = render(
      <ProductDataContext.Provider value={value}>
        <ImportComponent {...defaultProps} isSaved={false} />
      </ProductDataContext.Provider>
    );

    let button = getByText("Import Component");
    expect(button).not.toHaveStyle("cursor: not-allowed");

    rerender(
      <ProductDataContext.Provider value={value}>
        <ImportComponent {...defaultProps} isSaved={true} />
      </ProductDataContext.Provider>
    );

    button = getByText("Import Component");
    expect(button).toHaveStyle("cursor: not-allowed");
  });
});
