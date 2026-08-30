import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ListviewCard from "../../common/ListViewComponentProduct";
import { QueryClient, QueryClientProvider } from "react-query";
import {GlobalDataMock} from "../../../mocks/GlobalData.mock.json";
import {ProductDetailsMock} from "../../../mocks/ProductDetails.mock.json";
import '@testing-library/jest-dom';
import { PostContext, useGlobaldata } from '../../../contexts/masterData/DataContext';
import axios from 'axios';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import { ExperimentalDataItem } from '../../breadcrumb/types';
import { WARNING_MSG_DELETE_PRODUCT } from '../../../constants/ExperimentalTooltip.constant';
import { toast } from 'react-toastify';
const queryClient = new QueryClient({});
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.useFakeTimers();

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
}));
jest.mock("../../../helper/GenericFunctions", () => ({
  ...jest.requireActual("../../../helper/GenericFunctions"),
  CheckCRUDAccess: jest.fn(() => 1),
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

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const mockeduseGlobaldata = useGlobaldata as jest.Mock;

jest.mock("../../../contexts/masterData/DataContext");

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

describe('ListviewCard', () => {
  const refetchMock = jest.fn();
  const mockProps = {
    props: ProductDetailsMock[0]?.assessments?.experimental as unknown as  ExperimentalDataItem[],
    sort_order: "Modified Date",
    refetch: refetchMock,
    pageRouter: 'allproduct',
  };
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: 'test'
  
  }
  mockedAxios.delete.mockResolvedValue({
    status: 204
  });
  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock
    }));
  });

  it('should render list view products', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListviewCard {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(screen.getByText('ACV - Acuvue')).toBeInTheDocument();
    expect(screen.getByText('JNJ - Johnsons')).toBeInTheDocument();
  }, 8000);

  it('should render the see more button', async () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListviewCard {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      const allButton = screen.getAllByTestId("KeyboardArrowDownIcon");
      fireEvent.click(allButton[0]);
    })
  }, 8000);

  it('should render the edit button', async () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListviewCard {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      const allButton = screen.getAllByRole("button");
      fireEvent.click(allButton[0]);
    })
    await act(() => {
      const menuItem = screen.getAllByRole("menuitem")[0];
      fireEvent.click(menuItem);
    });

    await act(() => {
      const deleteButton = screen.getByText("Product Name");
      expect(deleteButton).toBeInTheDocument();
      const closeIcon = screen.getAllByTestId("CloseIcon");
      fireEvent.click(closeIcon[0])
    })

  }, 8000);
  it('should be able to navigate to product detail page', async () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListviewCard loggedInUserEmail={''} {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      const allButton = screen.getAllByText("experimental");
      fireEvent.click(allButton[0]);
    })
  }, 8000);
  it('should display user avatars with initials', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard loggedInUserEmail={''} {...mockProps} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      await waitFor(() => {
        const avatars = screen.getAllByTestId('user-avatar');
        expect(avatars.length).toBeGreaterThan(0);
      });
  });

    it('should open delete confirmation dialog when clicking delete', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard loggedInUserEmail={''} {...mockProps} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      // Open menu
      const menuButton = screen.getAllByRole('button')[0];
      fireEvent.click(menuButton);
  
      // Click delete
      const deleteMenuItem = screen.getByText(/delete/i);
      fireEvent.click(deleteMenuItem);
  
      await waitFor(() => {
        expect(screen.getByText(WARNING_MSG_DELETE_PRODUCT)).toBeInTheDocument();
      });
    });
    it('should handle empty user list gracefully', async () => {
      const emptyUserProps = {
        ...mockProps,
        props: [{ ...mockProps.props[0], users: [] }]
      };
  
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard loggedInUserEmail={''} {...emptyUserProps} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      await waitFor(() => {
        const avatarGroup = screen.getByTestId('avatar-group');
        expect(avatarGroup.children.length).toBe(0);
      });
    });
    it('should handle non-204 response from API', async () => {
      mockedAxios.delete.mockResolvedValue({ status: 500 });
  
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard loggedInUserEmail={''} {...mockProps} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      // Trigger delete
      fireEvent.click(screen.getAllByTestId('more-horiz-icon')[0]);
      fireEvent.click(screen.getByText(/delete/i));
      fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
  
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          "Error occured while deleting the product details, please try again!"
        );
        expect(screen.queryByText(/warning/i)).not.toBeInTheDocument();
      });
    }, 15000);
    it('should handle API errors during deletion', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('API Error'));
  
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard loggedInUserEmail={''} {...mockProps} />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      // Trigger delete
      fireEvent.click(screen.getAllByTestId('more-horiz-icon')[0]);
      fireEvent.click(screen.getByText(/delete/i));
      fireEvent.click(await screen.findByRole('button', { name: /confirm/i }));
  
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          "Error occured while deleting the product details, please try again!"
        );
      });
    });
    it('should apply bold font for Modified Date when sort_order is "Modified Date"', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard
              loggedInUserEmail={''} {...mockProps}
              sort_order={"Modified Date"}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      const dateLabels = await screen.findAllByText(/Date Modified:/i);
      expect(dateLabels[0]).toHaveStyle("font-family: kenvue-sans");
    });
    it('should apply bold font for Modified Date when sort_order is "Created Date"', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListviewCard
              loggedInUserEmail={''} {...mockProps}
              sort_order={"Created Date"}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
  
      const dateLabels = await screen.findAllByText(/Date Created:/i);
      expect(dateLabels[0]).toHaveStyle("font-family: kenvue-sans");
    });
    it('applies correct styles based on sort_order', async () => {
      render(
        <ListviewCard
          loggedInUserEmail={''} {...mockProps}
          sort_order={"Created Date"}
        />
      );
  
      // Test Created Date style
      const createdDate = await screen.findAllByText(/Date Created:/i);
      expect(createdDate[0]).toHaveStyle("font-family: kenvue-sans");
  
      // Test Modified Date style
      const modifiedDate = await screen.findAllByText(/Date Modified:/i);
      expect(modifiedDate[0]).toHaveStyle("font-family: kenvue-sans-regular");
    });
});
