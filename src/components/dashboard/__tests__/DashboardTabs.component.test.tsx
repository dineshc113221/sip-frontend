import { render, act, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import DashboardTabsComponent from '../DashboardTabs.component';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';

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

jest.mock("../../../contexts/masterData/DataContext");

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

describe('DashboardTabsComponent', () => {
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
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <DashboardTabsComponent sendToParent={jest.fn()} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it('should render the component for search', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <DashboardTabsComponent sendToParent={jest.fn()} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const textBox = screen.getAllByPlaceholderText("Search");
      fireEvent.change(textBox[0], { target: { value: "FML1" } });
      fireEvent.keyDown(textBox[0], { key: "Enter" });
    });
  }, 8000);

  it('should render the component for add product', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <DashboardTabsComponent sendToParent={jest.fn()} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const textBox = screen.getByRole("button", { name: "Add Product" });
      fireEvent.click(textBox);
    });
    await waitFor(() => {
      const searchIcon = screen.getAllByTestId("CloseIcon");
      fireEvent.click(searchIcon[0]);
      fireEvent.click(searchIcon[1]);
    })
  }, 8000);

  it('should render the component for search using search icon', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <DashboardTabsComponent sendToParent={jest.fn()} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const textBox = screen.getAllByPlaceholderText("Search");
      fireEvent.change(textBox[0], { target: { value: "FML1" } });
      const searchIcon = screen.getByTestId("SearchIcon");
      fireEvent.click(searchIcon);
    });
  }, 8000);

});
