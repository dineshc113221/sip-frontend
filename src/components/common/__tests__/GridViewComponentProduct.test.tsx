import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import GridviewCard from "../../common/GridViewComponentProduct";
import { QueryClient, QueryClientProvider } from "react-query";
import {ProductDetailsMock} from "../../../mocks/ProductDetails.mock.json";
import {GlobalDataMock} from "../../../mocks/GlobalData.mock.json";
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

jest.mock("../../../helper/GenericFunctions", () => ({
  ...jest.requireActual("../../../helper/GenericFunctions"),
  CheckCRUDAccess: jest.fn(() => 1),
}));
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
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

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
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

describe('GridviewCard', () => {
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
    token: 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Il9OY3J6dTAwc0ZEeWJpYTVaRVd0OG1TSVdybjdnZEhpMUZ3RUw4MGVoVTgiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYvIiwiaWF0IjoxNzI5ODUxMzY3LCJuYmYiOjE3Mjk4NTEzNjcsImV4cCI6MTcyOTg1NTU4MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhZQUFBQXBlSDlqSEo2UkhIeHFJMzBRcE52L3BKeGFCd21scmhoRlJIK0FxTlBLVFAvN1JOSndoUmU1MGxOeHZJS1pFUmQ5b0ZXMWFNbWpoelBycC9kbkdoU1BZaHptTVNjRjhpRnc1dlZ4cEt5U2k4PSIsImFtciI6WyJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiU1VTVEFJTkFCTEUgSU5OT1ZBVElPTiBQUk9GSUxFUiAtIERFViIsImFwcGlkIjoiNThhYTAwYzYtZDQzNC00YTUwLTliY2EtZWVlMmRhODgwNDEzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJKYWRoYXYiLCJnaXZlbl9uYW1lIjoiUHJpeWFua2FZIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTY1LjIyNS4yMzAuMTgwIiwibmFtZSI6IkphZGhhdiwgUHJpeWFua2FZIFtOb24tS2VudnVlXSIsIm9pZCI6IjMxMDcwN2VjLWVkZTUtNDBkNi1iYjhkLTRkZDZlYjg4MWZmZSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMzUwMDk2MTE0LTQwMjQyMDkxMzctMTI3MjQwMzg2My0zMDM1MDIiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDNCMTUwRjkwNCIsInJoIjoiMC5BWFlBd2txbWV5dUtma0dial96NEk0OHFWZ01BQUFBQUFBQUF3QUFBQUFBQUFBQzBBRDQuIiwic2NwIjoiZW1haWwgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIiwic3ViIjoiUldfQnB3VVFXek9qa19pd2FGNi1ibGp6ZFY3Z0RUZlRza2wyTlV5bmt5VSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjdiYTY0YWMyLThhMmItNDE3ZS05YjhmLWZjZjgyMzhmMmE1NiIsInVuaXF1ZV9uYW1lIjoiUEphZGhhMDRAa2VudnVlLmNvbSIsInVwbiI6IlBKYWRoYTA0QGtlbnZ1ZS5jb20iLCJ1dGkiOiJWXzctY1cyR18wZTY3aXh1SlRKdkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiNiAxIiwieG1zX3N0Ijp7InN1YiI6Ink2dEczY19PNGdMbUdFbE5VVU41TnlVWHk3M2lrR0t4RmtXelJYZjMyWXcifSwieG1zX3RjZHQiOjE2NDk5NjYzNzV9.F8PzrbhRGhDKGVgVMlwo-8iLXpWOmF05XFsbi7FM3KYf9pCQTvMw-9lER7G2GeSQ1ilu242KZH_bUohSd219XJ_wOKXUQidkkKHwY0MFmBD6GJ0WXKqMPnw7-ADUWxxvfOkbYKA8XXjoGruuf4wCZwR2R1ZowCanDOf-IvAGDCDWdkEctF6_TQdl5JiwGByMloZKhkbtrbzuRF_bJ71gshXkKcJz9MzDv_YgfvI-2eSl12W9mAKW8xq8I5T0dA6vH8i-HTouzdZMkmiD_jMcbtau4t-jXjOzUQriDL-vn7q--sS67jdSfHwGyf9iyyPY_2cYRpWhXbjt5p3bM7MLgw'
  
  }
  mockedAxios.delete.mockResolvedValue({
    status: 204
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock
    }));
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it('should render grid view products', () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(screen.getByText('ACV - Acuvue')).toBeInTheDocument();
    expect(screen.getByText('JNJ - Johnsons')).toBeInTheDocument();
  }, 8000);

  it('should render the edit button', async () => {
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
        <GridviewCard loggedInUserEmail={''} {...mockProps} />
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
        <GridviewCard loggedInUserEmail={''} {...mockProps} />
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
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const avatars = screen.getAllByTestId('user-avatar');
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  it('should truncate long text fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const truncatedElements = screen.getAllByTestId('truncated-text');
      expect(truncatedElements.length).toBeGreaterThan(0);
    });
  });

  it('should open delete confirmation dialog when clicking delete', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
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

  it('should truncate long text fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const truncatedElements = screen.getAllByTestId('truncated-text');
      expect(truncatedElements.length).toBeGreaterThan(0);
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
          <GridviewCard loggedInUserEmail={''} {...emptyUserProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const avatarGroup = screen.getByTestId('avatar-group');
      expect(avatarGroup.children.length).toBe(0);
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
          <GridviewCard loggedInUserEmail={''} {...emptyUserProps} />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const avatarGroup = screen.getByTestId('avatar-group');
      expect(avatarGroup).toBeEmptyDOMElement();
    });
  });

  it('should handle non-204 response from API', async () => {
    mockedAxios.delete.mockResolvedValue({ status: 500 });

    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
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
          <GridviewCard loggedInUserEmail={''} {...mockProps} />
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
});
