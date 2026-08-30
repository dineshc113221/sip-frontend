import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
import ProductDetail from "../ProductDetail.component";
import { ReactInfiniteProps } from "../../../mocks/CoreLogin.mock";
import { act } from "react";
import { useGetUseDoseValue } from "../../../hooks/UseGetProductDetails";

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
const mockedUseGetUseDoseValue = useGetUseDoseValue as jest.Mock;
jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseGetProductDetailsByID = useGetProductDetailByID as jest.Mock;
const refetchMock = jest.fn();   
mockedUseGetUseDoseValue.mockImplementation(() => ({
      isLoading: true,
      useDoseData: ProductDetailsMock,
      refetchUseDose: refetchMock,
}));
 mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationMasterData: GlobalDataMock[0].formulation,
      formulationData: GlobalDataMock[0].formulation,
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

describe("ProductDetail", () => {

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
    jest.clearAllMocks();
    const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjFRYTJJLWJyWlpPNGZ0cFhRMHp1ZnpWOXgtdENaZjNWOVN6NVZBTnBVZGMiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYvIiwiaWF0IjoxNzQ1MzI0MDc3LCJuYmYiOjE3NDUzMjQwNzcsImV4cCI6MTc0NTMyODA0MywiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsicDEiXSwiYWlvIjoiQVhRQWkvOFpBQUFBQ1hpMktJMW9EaHVBSnJTL2ovOWE5VmVjelhRUk91dkp2L1FhQXlDOWovczZoKzYwOEx1TDV1WUNibWlKVENWQmtWMDQwTURmOUxnb1VyMkVNNTRyQmhuWVYxc0hmRWVxU2FyOEZKc2gwclNIU0p0TWR5MmhYcHNBRHoreUptK0MrdTFoak9KcVU5ekp0SjdRRThOOHBRPT0iLCJhbXIiOlsibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IlNVU1RBSU5BQkxFIElOTk9WQVRJT04gUFJPRklMRVIgLSBERVYiLCJhcHBpZCI6IjU4YWEwMGM2LWQ0MzQtNGE1MC05YmNhLWVlZTJkYTg4MDQxMyIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiYjFlZGVjNmYtNDg0ZS00NzQxLWEyYjAtY2M0NmUxYTc5YzhmIiwiZmFtaWx5X25hbWUiOiJKYWRoYXYiLCJnaXZlbl9uYW1lIjoiUHJpeWFua2FZIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTY3LjEwMy42Mi4yMDciLCJuYW1lIjoiSmFkaGF2LCBQcml5YW5rYVkgW05vbi1LZW52dWVdIiwib2lkIjoiMzEwNzA3ZWMtZWRlNS00MGQ2LWJiOGQtNGRkNmViODgxZmZlIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEzNTAwOTYxMTQtNDAyNDIwOTEzNy0xMjcyNDAzODYzLTMwMzUwMiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwM0IxNTBGOTA0IiwicmgiOiIxLkFYWUF3a3FtZXl1S2ZrR2JqX3o0STQ4cVZnTUFBQUFBQUFBQXdBQUFBQUFBQUFDMEFENTJBQS4iLCJzY3AiOiJlbWFpbCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQiLCJzaWQiOiIwMDNlMjI1OS1mNWZmLThlYjktNmNiYy1kZGM5NzNhNmU3ZDciLCJzaWduaW5fc3RhdGUiOlsiZHZjX21uZ2QiLCJkdmNfY21wIl0sInN1YiI6IlJXX0Jwd1VRV3pPamtfaXdhRjYtYmxqemRWN2dEVGZUc2tsMk5VeW5reVUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI3YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYiLCJ1bmlxdWVfbmFtZSI6IlBKYWRoYTA0QGtlbnZ1ZS5jb20iLCJ1cG4iOiJQSmFkaGEwNEBrZW52dWUuY29tIiwidXRpIjoiZ0NYQ1ljVVlna3U5aVhfanNzRWNBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19mdGQiOiJIVTdGZUM3U3NiaDZHZFFtcmVoWkJ3TlZEQ0tBdmpmbDVhRUFFQVhwUTVnQmRYTnViM0owYUMxa2MyMXoiLCJ4bXNfaWRyZWwiOiIxIDI4IiwieG1zX3N0Ijp7InN1YiI6Ink2dEczY19PNGdMbUdFbE5VVU41TnlVWHk3M2lrR0t4RmtXelJYZjMyWXcifSwieG1zX3RjZHQiOjE2NDk5NjYzNzV9.hoVUPwyzgXO8GRmiYJFGdNJfXm_fptLqAlXKX5QArVys3zSTP08mFYw3iSvIcQIcgV-GrIlKnpSyi-_8LVxCmVQvW_DCOCtuNH4n32fN0nSUfCRowNKaKVjlSofb2CklN6uszPawAMd2tPRiWJzB1q8n8ju0wMci-Zf3f7iuOmANlwwe4iAMUP4l2pcsXluxOjvH1F3B4UIRWpxjFT7yL1Hnr6uq5QSOOGCMLJu42ITVZpaDkXc8fYAEfak5d-z1A1dzEoErkkHA4kxf9OxkScCrQSW1WLhhvAS58DBTAvSQo_2rFRczV5HcKQNTQYbvVxlQ6EdFBQNkuwwG8YXtoQ";

    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      token: 'some_token_value'
    }));
    const mockFormulationMasterData = {
      segment: [{
        productSegment: "Test Segment",
        productSubSegment: ["Sub 1", "Sub 2"]
      }],
      netContent: ["100g"],
      productionZone: ["Zone 1"],
      salesZone: ["Sales Zone 1"],
      useDose: ["10g"],
      rawMaterials: []
    };
  mockeduseGlobaldata.mockImplementation(() => ({
      token: token,
      formulationData: mockFormulationMasterData,
      // Add other required global data properties
      globaldata: GlobalDataMock,
      isLoading: false,
      loaded: true
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
            <ProductDetail />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should be able to click on add baseline assessment", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: [
        {
          ...ProductDetailsMock[0],
          assessments: {
            ...ProductDetailsMock[0].assessments,
            baseline: {},
          },
        },
      ],
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDetail />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const baselineText = screen.getByRole("button", {
        name: /Add Baseline Assessment/i,
      });
      fireEvent.click(baselineText);
    });
  }, 8000);

  it("should be able to click on add final assessment", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: [
        {
          ...ProductDetailsMock[0],
          assessments: {
            ...ProductDetailsMock[0].assessments,
            final: {},
          },
        },
      ],
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDetail />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

   await waitFor(() => {
  expect(
    screen.getByRole("button", {
      name: /Add Final Assessment/i,
    })
  ).toBeInTheDocument();
});

fireEvent.click(
  screen.getByRole("button", {
    name: /Add Final Assessment/i,
  })
);

  }, 8000);


  it("should be able to click info icon for baseline assessment", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: ProductDetailsMock,
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDetail />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    act(() => {
      const infoButton = screen.getAllByTestId("InfoIcon");
      fireEvent.click(infoButton[0]);
      fireEvent.click(infoButton[0]);
      fireEvent.click(infoButton[1]);
      fireEvent.click(infoButton[1]);
      fireEvent.click(infoButton[2]);
      fireEvent.click(infoButton[2]);
    });
  }, 8000);


  it("should be able to click modified date sort icon", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: ProductDetailsMock,
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDetail />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const expandIcon = screen.getByRole("combobox");
      fireEvent.click(expandIcon);
      fireEvent.keyDown(expandIcon, { key: "ArrowDown" });
    });
   await waitFor(() => {
  expect(screen.getAllByRole("option").length).toBeGreaterThan(1);
});

const options = screen.getAllByRole("option");
fireEvent.click(options[1]);


    act(() => {
      const expandIcon = screen.getByRole("combobox");
      fireEvent.click(expandIcon);
      fireEvent.keyDown(expandIcon, { key: "ArrowDown" });
    });
   const options1 = await screen.findAllByRole("option");
fireEvent.click(options1[0]);

    act(() => {
      const expandIcon = screen.getByRole("combobox");
      fireEvent.click(expandIcon);
      fireEvent.keyDown(expandIcon, { key: "ArrowDown" });
    });
   const options2 = await screen.findAllByRole("option");
fireEvent.click(options2[2]);

  }, 8000);

  it("should be able to change to list mode", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: ProductDetailsMock,
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ProductDetail />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const expandIcon = screen.getByTestId("FormatListBulletedIcon");
      fireEvent.click(expandIcon);
    });

    act(() => {
      const expandIcon = screen.getByTestId("AppsIcon");
      fireEvent.click(expandIcon);
    });
  }, 8000);





});
