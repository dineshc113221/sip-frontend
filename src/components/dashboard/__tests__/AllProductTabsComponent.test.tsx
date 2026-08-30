import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import AllProductTabsComponent from '../AllProductTab.component';
import {ProductDetailsMock} from "../../../mocks/ProductDetails.mock.json";
import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import { ExperimentalDataItem } from '../../breadcrumb/types';

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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
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

describe('AllProductTabsComponent', () => {
  const mockData = {
    product: ProductDetailsMock[0]?.assessments?.experimental as unknown as  ExperimentalDataItem[],
    refetch: jest.fn(),
  };
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
            <AllProductTabsComponent
              product={mockData.product}
              selectedValue={"test"}
              refetch={mockData.refetch}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    await waitFor(() => {
      expect(screen.getAllByText(/Products/)[0]).toBeInTheDocument();
    });
  }, 8000);

  it('should switch to list view', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>

        <AllProductTabsComponent
          product={mockData.product}
          selectedValue={"test"}
          refetch={mockData.refetch}
        />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText('List View'));
    expect(screen.getByText('List View')).toHaveStyle('borderBottom: "2px solid #00B097"');
    fireEvent.click(screen.getByText('List View'));
    fireEvent.click(screen.getByText('Grid View'));
    fireEvent.click(screen.getByText('Grid View'));
  }, 8000);

  it('should sort by A-Z', async () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>

        <AllProductTabsComponent
          product={mockData.product}
          selectedValue={"test"}
          refetch={mockData.refetch}
        />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByRole('combobox'));
    // expect(screen.getByText('ACV - Acuvue')).toBeInTheDocument();
  }, 8000);

});
