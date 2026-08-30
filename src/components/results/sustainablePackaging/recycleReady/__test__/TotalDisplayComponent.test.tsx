import { render, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { ReactInfiniteProps } from "../../../../../mocks/CoreLogin.mock";
import { ResultDataMock } from "../../../../../mocks/ResultData.mock";
import { ResultDataContext } from "../../../../../contexts/resultData/ResultDataContext";
import { TotalDisplayComponent } from "../TotalDisplayComponent";

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

const queryClient = new QueryClient({});

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


describe("TotalDisplayComponent", () => {
  const resultDataValue = ResultDataMock;

  afterEach(() => {
  });
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
          <TotalDisplayComponent
            baselinePercentage={"20"}
            myProductPercentage={"21"}
          />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

  }, 8000);

 

});
