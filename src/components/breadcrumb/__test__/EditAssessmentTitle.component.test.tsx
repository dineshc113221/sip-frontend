import { render, act, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import {
  useGlobaldata,
  PostContext,
} from "../../../contexts/masterData/DataContext";
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import UserDetailsMock from "../../../mocks/UserDetails.mock.json";
import { ProductDetailsMock } from "../../../mocks/ProductDetails.mock";
import axios from "axios";
import { useGetProductDetailByID } from "../../../hooks/UseGetProductDetails";
import { ReactInfiniteProps } from "../../../mocks/CoreLogin.mock";
import { ProductDataContext } from "../../../contexts/productData/ProductDataContext";
import EditAssessmentTitle from "../EditAssessmentTitle.component";

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

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({});

jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseGetProductDetailsByID = useGetProductDetailByID as jest.Mock;

jest.mock("../../../helper/GenericFunctions", () => ({
  ...jest.requireActual("../../../helper/GenericFunctions"),
  CheckCRUDAccess: jest.fn(() => 1),
}));
jest.mock("../../../contexts/masterData/DataContext");
jest.mock("../../../hooks/UseGetProductDetails");

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
const mockedUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
  params: () => mockedUseParams,
  useParams: () => mockedUseParams,
  Link: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("react-toastify/dist/ReactToastify.css", () => ({}));

jest.mock("react-infinite-scroll-component", () => {
  return ({
    children,
    next,
    hasMore,
    loader,
    endMessage,
  }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? <button onClick={next}>Load More</button> : endMessage}
        {loader}
      </div>
    );
  };
});

describe("EditAssessmentTitle", () => {
  
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
    refetch: jest.fn(),
    assessmentsData: {
      assessmentId: 'test-assessment-id',
      name: 'Initial Name',
      _id: 'test-assessment-id',
    },
    setAssessmentsData: () => {},
    formulation: null,
    primaryPackaging: null,
    secondaryPackaging: null,
    assessmentsType: "experimental",
    packagingData: null,
    fetchingDataInProgress: false,
    isBaselinePresent: false,
    isBaselineSkipped:false,
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
    
    setValidateCheckFinal:()=>{},
    validateCheckFinal: false,
    setValidateCheckFormulation: ()=>{},
    validateCheckFormulation: false,
    setValidateCheckPackaging: ()=>{},
    validateCheckPackaging:false,
  };
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: "token",
  };
  const refetchMock = jest.fn();
  mockedAxios.delete.mockResolvedValue({
    status: 204,
  });
  mockedAxios.put.mockResolvedValue({
    status: 204,
  });

  mockedAxios.delete.mockResolvedValue({
    status: 200,
  });

  mockedAxios.post.mockResolvedValue(UserDetailsMock);

  const mockPathname = jest.fn();
  Object.defineProperty(window, "location", {
    value: {
      get pathname() {
        return mockPathname();
      },
      replace: jest.fn(),
    },
  });
  let originalFetch: jest.Mock;
  mockPathname.mockReturnValue("/my-product-detail/669109b168c2e4986c95d550");

  beforeEach(() => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: false,
      data: ProductDetailsMock,
      refetch: jest.fn(),
    }));

    mockedAxios.put.mockResolvedValue({ status: 204 });
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(ProductDetailsMock),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
  it("should render the component", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: ProductDetailsMock,
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDataContext.Provider value={value}>
              <EditAssessmentTitle />
            </ProductDataContext.Provider>
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("toggles edit mode when edit button is clicked", async () => {
    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getByLabelText("Edit product assessment"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Save")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("updates input value on change", async () => {
    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getByLabelText("Edit product assessment"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });
    expect(input).toHaveValue("New Name");
  });

  it("shows validation error for empty name", async () => {
    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getByLabelText("Edit product assessment"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    fireEvent.click(screen.getByLabelText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Product assessment name is required")).toBeInTheDocument();
    });
  });

  it("cancels edit mode and resets value", async () => {
    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getByLabelText("Edit product assessment"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Modified Name" } });
    fireEvent.click(screen.getByLabelText("Cancel"));

    await waitFor(() => {
      expect(screen.getByText("Initial Name")).toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });


  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ProductDataContext.Provider value={value}>
            <EditAssessmentTitle />
          </ProductDataContext.Provider>
        </PostContext.Provider>
      </QueryClientProvider>
    );
  };

});
