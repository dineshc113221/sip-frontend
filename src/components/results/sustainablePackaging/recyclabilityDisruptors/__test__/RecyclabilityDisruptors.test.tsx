import { render, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { GlobalDataMock } from "../../../../../mocks/GlobalData.mock.json";
import UserDetailsMock from "../../../../../mocks/UserDetails.mock.json";
import { ProductDetailsMock } from "../../../../../mocks/ProductDetails.mock";
import axios from "axios";
import { ReactInfiniteProps } from "../../../../../mocks/CoreLogin.mock";
import { ResultDataMock } from "../../../../../mocks/ResultData.mock";
import { useGlobaldata } from "../../../../../contexts/masterData/DataContext";
import { useGetProductDetailByID } from "../../../../../hooks/UseGetProductDetails";
import { ResultDataContext } from "../../../../../contexts/resultData/ResultDataContext";
import RecyclabilityDisruptors from "../RecyclabilityDisruptors";

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

jest.mock("../../../../../contexts/masterData/DataContext");
jest.mock("../../../../../hooks/UseGetProductDetails");

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

jest.mock("@amcharts/amcharts5/xy", () => ({
  XYChart: {
    new: () => { return (<div></div>) }
  },
  AxisRendererX: {
    new: () => { return (<div></div>) }
  },
  CategoryAxis: {
    new: () => { return (<div></div>) }
  },
  ValueAxis: {
    new: () => { return (<div></div>) }
  },
  AxisRendererY: {
    new: () => { return (<div></div>) }
  },
  ColumnSeries: {
    new: () => { return (<div></div>) }
  },
}));

describe("RecyclabilityDisruptors", () => {
  const resultDataValue = ResultDataMock;
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
          <ResultDataContext.Provider value={resultDataValue}>
            <RecyclabilityDisruptors/>
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

});
