import { render, act, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { Context } from '../../utills/useContext';
import { PostContext, useGlobaldata } from '../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../mocks/GlobalData.mock.json";
import { ReactInfiniteProps } from '../../mocks/CoreLogin.mock';
import AllProductDashboard from '../AllDashboard.component';
import { LoadingProvider } from '../../contexts/loadingPage/LoadingContext';

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


const mockeduseGlobaldata = useGlobaldata as jest.Mock;

jest.mock("../../contexts/masterData/DataContext");

const mockedUsedNavigate = jest.fn();
const mockedUseTheme = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useTheme: () => mockedUseTheme,
  useLocation: () => mockedUseLocation,
}));

jest.mock("react-toastify", () => ({
  toast: jest
    .fn()
    .mockImplementation(() => [jest.fn(), jest.fn(), jest.fn()]),
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

describe('AllProductDashboard', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: "test"
  }
  beforeEach(() => {
    jest.clearAllMocks();
  
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock
    }));
  });
  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <LoadingProvider>
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <Context.Provider value={null}>
              <AllProductDashboard />
            </Context.Provider>

          </PostContext.Provider>
          </QueryClientProvider>
          </LoadingProvider>
          
      );
      expect(baseElement).not.toBeNull();
    });
    const textArea = screen.getByPlaceholderText("Search");
    fireEvent.change(textArea, { target: { value: "test" } });
    fireEvent.change(textArea, { target: { value: "" } });
  }, 8000);

});
