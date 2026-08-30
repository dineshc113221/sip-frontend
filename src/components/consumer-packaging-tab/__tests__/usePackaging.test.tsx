import { act, render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { FormulaionTableMock } from "../../../mocks/FormulationTable.mock.json";
import useFormulationTable from '../../formulation/formulationComposition/useFormulationTable';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import usePackaging from '../usePackaging';
import { useConsumerPackagingContext } from '../ConsumerPackagingContext';
import { ProductDetailsMock } from '../../../mocks/ProductDetails.mock';
import { ProductContextProp, ProductDataContext } from '../../../contexts/productData/ProductDataContext';
import { PackagingComponentData } from '../../../structures/packaging';

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
const mockedUseConsumerPackagingContext = useConsumerPackagingContext as jest.Mock;

jest.mock("../../formulation/formulationComposition/useFormulationTable");
jest.mock("../../../contexts/masterData/DataContext");
jest.mock("../../../hooks/UseGetProductDetails");
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

const value = {
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
  primaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging_level[0],
  secondaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging_level[1],
  assessmentsType: "",
  packagingData: {
    packaging_level: [{
      packaging_level: "test",
      isrecyclable: false,
      recyclability_status: "test",
      components: [{
        pc_nm: "test",
        description: "test",
        color: "test",
        opacity: "test",
        component_type: "test",
        weight: "test",
        opacifier: "test",
        stage: "test",
        state: "test",
        template: "test",
        isEdited: false,
        material: [{
          material_name: "test",
          material_type: "test",
          material_pct: "test",
          converting_process: "test",
        }]
      }]
    }]
  },
  fetchingDataInProgress: false,
  isBaselinePresent: false,
  isBaselineDataComplete: false,
} as unknown as ProductContextProp;

const Test = () => {
  const { handleCloseChangeDailog, handleContinueChangevlaue, handleCloseDialog, handleChangeAccordion,
    handleCancelContinueSave, handleCloseDeletePopup, handleDelete, callChildComponentData,
    handleCloseImportComponentDialog,handleOpenImportComponentPopup,handleCloseRecyclabilityStatusDialog ,
    handleOpenRecyclabilityStatusPopup,handleClickCancelButton,handleMenuClose ,handleOpenDeletePopup ,
    handleMoreHorizClick,handleEditPackagingComponent,updateSaveButtonState,callChildRecycleComponentData 
  } = usePackaging(true, "Secondary", 0,{_id:"test",weight:'10',recyclability_status:"test"} as PackagingComponentData)
    return (
    <div>
      <button onClick={handleCloseChangeDailog}>{"test"}</button>
      <button onClick={handleContinueChangevlaue}>{"test"}</button>
      <button onClick={handleCloseDialog}>{"test"}</button>
      <button onClick={handleCancelContinueSave}>{"test"}</button>
      <button onClick={handleCloseDeletePopup}>{"test"}</button>
      <button onClick={handleChangeAccordion}>{"test"}</button>
      <button onClick={handleDelete}>{"test"}</button>
      <button onClick={ ()=>callChildComponentData({} as PackagingComponentData)}>{"test"}</button>
      <button onClick={ handleCloseImportComponentDialog}>{"test"}</button>
      <button onClick={ handleOpenImportComponentPopup}>{"test"}</button>
      <button onClick={ handleCloseRecyclabilityStatusDialog }>{"test"}</button>
      <button onClick={()=> handleOpenRecyclabilityStatusPopup("test","test") }>{"test"}</button>
      <button onClick={ handleClickCancelButton  }>{"test"}</button>
      <button onClick={ handleMenuClose}>{"test"}</button>
      <button onClick={ handleOpenDeletePopup}>{"test"}</button>
      <button onClick={ handleMoreHorizClick }>{"test"}</button>
      <button onClick={ handleEditPackagingComponent }>{"test"}</button>
      <button onClick={ ()=>updateSaveButtonState(true)  }>{"test"}</button>
      <button onClick={ ()=>{callChildRecycleComponentData('true')}  }>{"test"}</button>
    </div>


  )
}

describe('usePackaging', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: "test"
  }
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
    setProductEvacuationValue: jest.fn(),
    productEvacuationValue: '50',
    isSaveEnabled: true,
    handleSavePacking: jest.fn(),
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
    setWarningPopUp:jest.fn(),
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
    mockedUseConsumerPackagingContext.mockImplementation(() => (mockContextValues));
  });

  it('should render the component', async () => {

    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDataContext.Provider value={value}>
              <Test />
            </ProductDataContext.Provider>
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const button = screen.getAllByRole("button");
      fireEvent.click(button[7]);
      fireEvent.click(button[0]);
      fireEvent.click(button[1]);
      fireEvent.click(button[2]);
      fireEvent.click(button[3]);
      fireEvent.click(button[4]);
      fireEvent.click(button[5]);
      fireEvent.click(button[6]);
      fireEvent.click(button[8]);
      fireEvent.click(button[9]);
      fireEvent.click(button[10]);
      fireEvent.click(button[11]);
      fireEvent.click(button[12]);
      fireEvent.click(button[13]);
      fireEvent.click(button[14]);
      fireEvent.click(button[15]);
      fireEvent.click(button[16]);
      fireEvent.click(button[17]);
      fireEvent.click(button[18]);
    })
  }, 8000);


});