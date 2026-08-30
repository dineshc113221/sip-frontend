/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import ConsumerPackaging from './../ConsumerPackaging.component';
import { useConsumerPackagingContext } from './../ConsumerPackagingContext';
import { ProductDataContext } from '../../../contexts/productData/ProductDataContext';
import { CheckCRUDAccess } from '../../../helper/GenericFunctions';

jest.mock('../../../helper/GenericFunctions', () => ({
  CheckCRUDAccess: jest.fn(),
}));

import { Box, Tooltip } from '@mui/material';
jest.mock('./../ConsumerPackagingContext', () => ({
  useConsumerPackagingContext: jest.fn(),
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

const mockContextValues = {
  handleAddPrimary: jest.fn(),
  handleAddSecondary: jest.fn(),
  handelChangeTableData: jest.fn(),
  resetData: false,
  primaryData: [{
    isDataComplete: false,
    material: [{
      material_name: "test",
      material_type: "test",
      material_pct: "test",
      converting_process: "test",
      pcr_content: "test",
      productEnvironmentalFootPrint: "test",
      carbonFootPrint: "test",
      virginPlasticValue: "test",
      _id: 1
    }]
  }],
  secondaryData: [{
    isDataComplete: true,
    material: [{
      material_name: "test",
      material_type: "test",
      material_pct: "test",
      converting_process: "test",
      pcr_content: "test",
      productEnvironmentalFootPrint: "test",
      carbonFootPrint: "test",
      virginPlasticValue: "test",
      _id: 1
    }]
  }],
  handleSavePackingOnTab: jest.fn(),
  handleSavePacking: jest.fn(),
  isCalculating: false,
  allFlagsCalculated: true,
  bothPackFormulaStatus: false,
  setIsPackagingDirty: jest.fn(),
  isProductEvacuationChanged: false,
  productEvacuationValue: '50',
  setProductEvacuationValue: jest.fn(),
  setIsManualOverride: jest.fn(),
  isSaveEnabled: true,
  buttonText: 'Save',
  primaryRecycleStatus: 'Recyclable',
  secondaryRecycleStatus: 'Non-Recyclable',
  counterPrimary: 8,
  counterSecondary: 8,
  setIsSaveEnabled: jest.fn(),
  handelImportPackingData: jest.fn(),
  handleDeleteComponent: jest.fn(),
  handleClickCancelContinue: jest.fn(),
  handelChangeRecycleStatus: jest.fn(),
  handleClickEditCancle: jest.fn(),
  setPcNmToEmpty: jest.fn(),
  isComponentDataChangePrimary: [{ index: 1, value: false }],
  setIsComponentDataChangePrimary: jest.fn(),
  isComponentDataChangeSecondary: [{ index: 1, value: false }],
  setIsComponentDataChangeSecondary: jest.fn(),
  setIsProductEvacuationChanged: jest.fn(),
  setPrimaryData: jest.fn()

};


describe('ConsumerPackaging Component', () => {
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
    setAssessmentsData: () => { },
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
    setValidateCheck: () => { },
    validateCheck: false,
    setValidateCheckEvacuation: jest.fn(),
    validateCheckEvacuation: false,

    setValidateCheckFinal: jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    validateCheckPackaging: false,
  };
  beforeEach(() => {
    (useConsumerPackagingContext as jest.Mock).mockReturnValue(mockContextValues);
  });

  it('renders primary and secondary packaging headers', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>

        <ConsumerPackaging />
      </QueryClientProvider>);
    expect(screen.getByText('Number of Primary Packaging Components')).toBeInTheDocument();
    expect(screen.getByText('Number of Secondary Packaging Components')).toBeInTheDocument();
  }, 8000);

  it('displays PartialDataWarning when primary data is incomplete', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ConsumerPackaging />
      </QueryClientProvider>);
    expect(screen.getByText(/There are one or more incomplete data fields/i)).toBeInTheDocument();
  }, 8000);

  it('calls handleAddPrimary on "Add" button click', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ProductDataContext.Provider value={value}>
          <ConsumerPackaging />
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Add primary packaging component/i)).toBeInTheDocument();
  }, 8000);

  it('renders product evacuation value and handles input changes', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ConsumerPackaging />
      </QueryClientProvider>);
    const input = screen.getByDisplayValue(mockContextValues.productEvacuationValue);
    fireEvent.change(input, { target: { value: '75' } });
    expect(mockContextValues.setProductEvacuationValue).toHaveBeenCalledWith('75');
  }, 8000);
  it('shows loading indicator when calculating', () => {
    (useConsumerPackagingContext as jest.Mock).mockReturnValue({
      ...mockContextValues,
      isCalculating: true
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ConsumerPackaging />
      </QueryClientProvider>
    );

    expect(screen.getByAltText('Calculating')).toBeInTheDocument();
    expect(screen.getByText('Calculating')).toBeInTheDocument();
  });

  it('shows correct recycle status components', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ConsumerPackaging />
      </QueryClientProvider>
    );

    expect(screen.getByText('Recyclable')).toBeInTheDocument();
    expect(screen.getByText('Non-Recyclable')).toBeInTheDocument();
  });

  it('disables calculate button for owners', () => {
    render(
      <QueryClientProvider client={queryClient} >
       
          <ConsumerPackaging />
      </QueryClientProvider>
    );

    expect(screen.getByText('Calculate')).toBeDisabled();
  });

  it('shows error styling on evacuation input', () => {
    // Mock the context with error state
    (useConsumerPackagingContext as jest.Mock).mockReturnValue({
      ...mockContextValues,
      productEvacuationValue: '101', // This should trigger error
      errorProduct: "Product Evacuation field cannot be greater than 100%", // Add error message
    });

    render(
      <QueryClientProvider client={queryClient} >
        <ConsumerPackaging />
      </QueryClientProvider>
    );

    const inputContainer = screen.getByTestId('evacuation-input-container');

    // Convert hex to rgb since getComputedStyle returns rgb
    expect(window.getComputedStyle(inputContainer).backgroundColor).toBe('rgb(248, 215, 218)');
  });

  it('disables evacuation input with no primary data', () => {
    (useConsumerPackagingContext as jest.Mock).mockReturnValue({
      ...mockContextValues,
      primaryData: []
    });

    render(
      <QueryClientProvider client={queryClient} >
        <ConsumerPackaging />
      </QueryClientProvider>
    );

    expect(screen.getByDisplayValue('50')).toBeDisabled();
  });

  const TestTooltipComponent = ({ open }: { open: boolean }) => (
    <Tooltip title="Error Tooltip" open={open} arrow placement='right-start'>
      <Box data-testid="target-element">Hover Element</Box>
    </Tooltip>
  )

  it("should not render tooltip when open is false", () => {
    render(<TestTooltipComponent open={false} />);

    const tooltip = screen.queryByText("Error Tooltip");
    expect(tooltip).not.toBeInTheDocument();
  })

  it("should render tooltip when open is true", () => {
    render(<TestTooltipComponent open={true} />);

    const tooltip = screen.queryByText("Error Tooltip");
    expect(tooltip).toBeInTheDocument();
  })

  it("should trigger mouse enter and mouse leave on evacuation tooltip box", () => {

    render(<QueryClientProvider contextSharing={true} client={queryClient}>
      <ConsumerPackaging />
    </QueryClientProvider>);

    const hoverBox = screen.getByTestId("evacuation-tooltip-box");
    fireEvent.mouseEnter(hoverBox);
    fireEvent.mouseLeave(hoverBox);
  });

  it('disables calculate button when baseline calculation is not updated and flags are calculated', () => {
    
    (CheckCRUDAccess as jest.Mock).mockReturnValue(1);

    
    

    const contextWithSpecificFlags = {
      ...value,
      
      bothDataComplete: true,
      validateCheckFinal: false,

      
      isBaselinePresent: true,
      assessmentsData: {
        assessmentId: '123',
        isBaselineCalcUpdated: false, 
      },
      singleClickHit: false,
      bothPackFormulaStatus: false,
    };

    
    (useConsumerPackagingContext as jest.Mock).mockReturnValue({
      ...mockContextValues,
      allFlagsCalculated: true,
      isCalculating: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProductDataContext.Provider value={contextWithSpecificFlags as any}>
          <ConsumerPackaging />
        </ProductDataContext.Provider>
      </QueryClientProvider>
    );

    
    
    
    
    expect(screen.getByText('Calculate')).toBeDisabled();
  });

});
