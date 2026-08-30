import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import '@testing-library/jest-dom';
import { PostContext, useGlobaldata } from '../../../contexts/masterData/DataContext';
import { fireEvent, render, screen, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import axios from 'axios';
import { ReactInfiniteProps } from "../../../mocks/CoreLogin.mock";
import PopupComponentAddMember from "../PopupComponentAddMember";
import { ProductDetailsMock } from "../../../mocks/ProductDetails.mock";

const queryClient = new QueryClient({});

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.useFakeTimers();

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

describe('PopupComponentAddMember', () => {
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
  mockedAxios.put.mockResolvedValue({
    status: 204
  });

  mockedAxios.post.mockResolvedValue({
    status: 200
  });
  const originalFetch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();

    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock
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

  it('should render the component ', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupComponentAddMember
              open={true}
              onClose={jest.fn()}
              initialValues={{
                "userCRUDAccess": 1
              }}
              productId={"SIP_AVN_0000107"}
              productSipId={"SIP_AVN_0000107"}
              refetch={jest.fn()}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    const brandName = screen.getAllByRole('combobox')[0];
    fireEvent.click(brandName);
    fireEvent.change(brandName, { target: { value: 'A' } })
    fireEvent.keyDown(brandName, { key: 'ArrowDown' })
    fireEvent.keyDown(brandName, { key: 'Enter' });
    fireEvent.click(
      screen.getByRole('button', {
        name: /add/i,
      })
    );
  }, 8000);

  it('should render the component to change member group selections', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupComponentAddMember
              open={true}
              onClose={jest.fn()}
              initialValues={{ userCRUDAccess: 1 }}
              productId={"SIP_AVN_0000107"}
              productSipId={"SIP_AVN_0000107"}
              refetch={jest.fn()}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    await act(() => {
      const expandIcon = screen.getAllByRole("combobox")[3];
      fireEvent.click(expandIcon);
      fireEvent.keyDown(expandIcon, { key: "ArrowDown" });
    });
    await waitFor(() => {
      const options = screen.getAllByRole("option");
      fireEvent.click(options[0]);
    });
  }, 8000);

  it('should render the component to delete member', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupComponentAddMember
              open={true}
              onClose={jest.fn()}
              initialValues={{ userCRUDAccess: 1 }}
              productId={"SIP_AVN_0000107"}
              productSipId={"SIP_AVN_0000107"}
              refetch={jest.fn()}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const deleteLabel = screen.getAllByLabelText("Delete user")[1];
      fireEvent.click(deleteLabel)
      
    });
  }, 8000);

  it('should render the component to close the popup', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupComponentAddMember
              open={true}
              onClose={jest.fn()}
              initialValues={{ userCRUDAccess: 1 }}
              productId={"SIP_AVN_0000107"}
              productSipId={"SIP_AVN_0000107"}
              refetch={jest.fn()}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    act(() => {
      const deleteLabel = screen.getAllByLabelText("close")[0];
      fireEvent.click(deleteLabel)
      
    });
  }, 8000 );

});
