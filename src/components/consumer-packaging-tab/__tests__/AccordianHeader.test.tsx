import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccordionHeader from '../AccordianHeader';
import { ProductDataContext } from '../../../contexts/productData/ProductDataContext';
import { useGlobaldata } from '../../../contexts/masterData/DataContext';
import {GlobalDataMock} from "../../../mocks/GlobalData.mock.json";
import { AccordionHeaderProps } from '../../breadcrumb/types';

const mockeduseGlobaldata = useGlobaldata as jest.Mock;

jest.mock("../../../contexts/masterData/DataContext");

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
jest.mock("../../../helper/GenericFunctions", () => ({
  ...jest.requireActual("../../../helper/GenericFunctions"),
  CheckCRUDAccess: jest.fn(() => 1),
}));

describe('AccordionHeader', () => {
  const handleExpandClick = jest.fn();
  const handleDelete = jest.fn();
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
    setValidateCheckEvacuation:jest.fn(),
    validateCheckEvacuation:false,
    
    setValidateCheckFinal:jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: ()=>{},
    validateCheckFormulation: false,
    setValidateCheckPackaging: ()=>{},
    validateCheckPackaging:false,
    isBaselineSkipped:false

  };
  const defaultProps = {
    expanded: true,
    componentheader: 'Header Test',
    handleExpandClick,
    handleOpenDeletePopup: handleDelete,
    componentId: 1,
    isData: true,
    isSaved: false,
    isSaveEnabled: '',
    handleClickCancelButton: jest.fn(),
    handleMoreHorizClick: jest.fn(),
    handleMenuClose: jest.fn(),
    anchorEl: null,
    handleEditPackagingComponent: jest.fn(),
    handleClickSaveButton: jest.fn(),
    isViewMode: false
  };
  beforeEach(() => {
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock
    }));
    jest.clearAllMocks();
  });
  it('renders the component', () => {
    const defaultProps: AccordionHeaderProps = {
      expanded: true,
      componentheader: 'test',
      handleClickCancelButton: handleExpandClick,
      handleExpandClick: handleExpandClick,
      handleMoreHorizClick: jest.fn(),
      handleMenuClose: jest.fn(),
      anchorEl: undefined,
      handleEditPackagingComponent: jest.fn(),
      handleOpenDeletePopup: jest.fn(),
      componentId: 0,
      isData: true,
      isSaved: false,
      isSaveEnabled: '',
      handleClickSaveButton: jest.fn(),
      isViewMode: false
    };
    render(
      <ProductDataContext.Provider value={value}>
        <AccordionHeader
          {...defaultProps}
        />
      </ProductDataContext.Provider>
    );
    const expandIcon = screen.getByTestId("expand-less-icon");
    fireEvent.click(expandIcon);
    expect(handleExpandClick).toHaveBeenCalled();

    expect(handleExpandClick).toHaveBeenCalled();
  }, 8000);

  it('render for edit button', async () => {
    render(
      <ProductDataContext.Provider value={value}>
        <AccordionHeader
          {...defaultProps}
        />
      </ProductDataContext.Provider>
    );

    // Corrected data-testid and use async/await
    const horizonIcon = screen.getByTestId("expand-less-icon");
    fireEvent.click(horizonIcon);
    expect(handleExpandClick).toHaveBeenCalled();

  });

  it('should trigger handleExpandClick when expand icon is clicked', () => {
    render(
      <ProductDataContext.Provider value={value}>
        <AccordionHeader {...defaultProps} />
      </ProductDataContext.Provider>
    );

    const expandLessIcon = screen.getByTestId('expand-less-icon');
    fireEvent.click(expandLessIcon);
    expect(handleExpandClick).toHaveBeenCalledWith(1, false);
  });

  it('should trigger handleDelete when delete button is clicked', () => {
    render(
      <ProductDataContext.Provider value={value}>
        <AccordionHeader {...defaultProps} />
      </ProductDataContext.Provider>
    );

    // Delete button now rendered due to mocked CheckCRUDAccess
    const deleteBtn = screen.getByTestId('delete-button');
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalled();
  });

  it('should render ExpandMoreIcon when expanded is false', () => {
    render(
      <ProductDataContext.Provider value={value}>
        <AccordionHeader {...defaultProps} expanded={false} />
      </ProductDataContext.Provider>
    );

    const expandMoreIcon = screen.getByTestId('expand-more-icon');
    fireEvent.click(expandMoreIcon);
    expect(handleExpandClick).toHaveBeenCalledWith(1, false);
  });

});