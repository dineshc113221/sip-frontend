import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { ProductDetailsMock } from "../../../mocks/ProductDetails.mock.json";
import { PostContext } from '../../../contexts/masterData/DataContext';
import axios from 'axios';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import { ExperimentalDataItem } from '../../breadcrumb/types';
import { GridViewComponentExperimental } from '../GridViewComponentExperimental';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
 
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
 
jest.useFakeTimers();
 
const mockedUsedNavigate = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockedUseLocation,
}));
 
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
 
describe('GridViewComponentExperimental', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Il9OY3J6dTAwc0ZEeWJpYTVaRVd0OG1TSVdybjdnZEhpMUZ3RUw4MGVoVTgiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYvIiwiaWF0IjoxNzI5ODUxMzY3LCJuYmYiOjE3Mjk4NTEzNjcsImV4cCI6MTcyOTg1NTU4MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhZQUFBQXBlSDlqSEo2UkhIeHFJMzBRcE52L3BKeGFCd21scmhoRlJIK0FxTlBLVFAvN1JOSndoUmU1MGxOeHZJS1pFUmQ5b0ZXMWFNbWpoelBycC9kbkdoU1BZaHptTVNjRjhpRnc1dlZ4cEt5U2k4PSIsImFtciI6WyJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiU1VTVEFJTkFCTEUgSU5OT1ZBVElPTiBQUk9GSUxFUiAtIERFViIsImFwcGlkIjoiNThhYTAwYzYtZDQzNC00YTUwLTliY2EtZWVlMmRhODgwNDEzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJKYWRoYXYiLCJnaXZlbl9uYW1lIjoiUHJpeWFua2FZIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTY1LjIyNS4yMzAuMTgwIiwibmFtZSI6IkphZGhhdiwgUHJpeWFua2FZIFtOb24tS2VudnVlXSIsIm9pZCI6IjMxMDcwN2VjLWVkZTUtNDBkNi1iYjhkLTRkZDZlYjg4MWZmZSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMzUwMDk2MTE0LTQwMjQyMDkxMzctMTI3MjQwMzg2My0zMDM1MDIiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDNCMTUwRjkwNCIsInJoIjoiMC5BWFlBd2txbWV5dUtma0dial96NEk0OHFWZ01BQUFBQUFBQUF3QUFBQUFBQUFBQzBBRDQuIiwic2NwIjoiZW1haWwgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIiwic3ViIjoiUldfQnB3VVFXek9qa19pd2FGNi1ibGp6ZFY3Z0RUZlRza2wyTlV5bmt5VSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjdiYTY0YWMyLThhMmItNDE3ZS05YjhmLWZjZjgyMzhmMmE1NiIsInVuaXF1ZV9uYW1lIjoiUEphZGhhMDRAa2VudnVlLmNvbSIsInVwbiI6IlBKYWRoYTA0QGtlbnZ1ZS5jb20iLCJ1dGkiOiJWXzctY1cyR18wZTY3aXh1SlRKdkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiNiAxIiwieG1zX3N0Ijp7InN1YiI6Ink2dEczY19PNGdMbUdFbE5VVU41TnlVWHk3M2lrR0t4RmtXelJYZjMyWXcifSwieG1zX3RjZHQiOjE2NDk5NjYzNzV9.F8PzrbhRGhDKGVgVMlwo-8iLXpWOmF05XFsbi7FM3KYf9pCQTvMw-9lER7G2GeSQ1ilu242KZH_bUohSd219XJ_wOKXUQidkkKHwY0MFmBD6GJ0WXKqMPnw7-ADUWxxvfOkbYKA8XXjoGruuf4wCZwR2R1ZowCanDOf-IvAGDCDWdkEctF6_TQdl5JiwGByMloZKhkbtrbzuRF_bJ71gshXkKcJz9MzDv_YgfvI-2eSl12W9mAKW8xq8I5T0dA6vH8i-HTouzdZMkmiD_jMcbtau4t-jXjOzUQriDL-vn7q--sS67jdSfHwGyf9iyyPY_2cYRpWhXbjt5p3bM7MLgw'
  }
  const refetchMock = jest.fn();
  const initialEditProductValuesMock = {
    productID: "66857886f9d7d63c9cc51149",
    productName: "OIL",
    productSipId: "SIP_CML_0000002",
  };
  mockedAxios.delete.mockResolvedValue({
    status: 204
  });
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <GridViewComponentExperimental
              props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
              varProductData={initialEditProductValuesMock}
              refetch={refetchMock}
              varUserCRUDAccess={1}
              sort_order={"Modified Date"}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);
 
  it('should render the menuitem to close the expermiental assessment', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <GridViewComponentExperimental
              props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
              varProductData={initialEditProductValuesMock}
              refetch={refetchMock}
              varUserCRUDAccess={1}
              sort_order={"Modified Date"}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
 
    const allButton = screen.getAllByRole("button");
 
    // Simulate click on the first button to trigger the menu
    await act(() => {
      fireEvent.click(allButton[0]);
    });
 
    // Wait for the menuitem to be available and visible before clicking
    await waitFor(() => {
      // Ensure the menuitem for Delete is visible and accessible by its name
      const menuItem = screen.getByRole("menuitem", { name: /delete/i }); // Use a case-insensitive match
      fireEvent.click(menuItem);
    });
 
    // Wait for the "Cancel" button to appear after deletion (assuming it pops up)
    await act(() => {
      const deleteButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(deleteButton); // Click the cancel button
    });
  }, 8000);
 
  it('should display complete/incomplete icons correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridViewComponentExperimental
            props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    const formulaImages = await screen.findAllByAltText(/formula status/i);
    const packagingImages = await screen.findAllByAltText(/packaging status/i);
 
    expect(formulaImages[0]).toHaveAttribute('src', expect.stringContaining(''));
    expect(packagingImages[0]).toHaveAttribute('src', expect.stringContaining(''));
  });
 
  it('should show empty state when no data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridViewComponentExperimental
            props={[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByText(/Nothing to see here yet!/i)).toBeInTheDocument();
    });
  });
 
  // ... existing tests
 
  it('should render LPP visual indicators (Chip and Icon) only when isLPP is true', () => {
    // Create specific mock data: One LPP item, One Non-LPP item
    const mixedLPPData = [
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        _id: "lpp-item-id",
        name: "LPP Assessment",
        isLPP: true, // This is the key flag
      },
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        _id: "standard-item-id",
        name: "Standard Assessment",
        isLPP: false,
      },
    ] as unknown as ExperimentalDataItem[];
 
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridViewComponentExperimental
            props={mixedLPPData}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
            containsLPP={true}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    // 1. Check for the LPP Chip
    // It should appear once (for the LPP item)
    const lppChips = screen.getAllByText("LPP");
    expect(lppChips.length).toBeGreaterThan(0);
    // Verify it is a chip
    expect(lppChips[0]).toHaveClass("MuiChip-label");
 
    // 2. Check for the LPP Tag Image
    const lppImages = screen.getAllByAltText("lpp");
    // Depending on your menu icon, 'lpp' alt text might exist in the menu too,
    // so we filter by the specific class used in the card view: "Baseline-8"
    // OR we check that it is visible in the card.
    const cardLppTags = lppImages.filter(img => img.classList.contains("Baseline-8"));
    expect(cardLppTags.length).toBe(1);
  });
 
  it('should call API to Mark as LPP when clicked', async () => {
    const nonLPPData = [
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        _id: "target-id",
        name: "Target Assessment",
        isLPP: false,
      }
    ] as unknown as ExperimentalDataItem[];
 
    mockedAxios.put.mockResolvedValue({ status: 204 });
 
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridViewComponentExperimental
            props={nonLPPData}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
            containsLPP={false} // No existing LPP
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    // Open Menu
    const moreButton = screen.getByTestId("more-horiz-icon");
    fireEvent.click(moreButton);
 
    // Wait for Menu to open and find "Mark as LPP"
    const markOption = await screen.findByText("Mark as LPP");
    expect(markOption).toBeInTheDocument();
 
    // Click it
    await act(async () => {
      fireEvent.click(markOption);
    });
 
    // Verify API Call
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining(initialEditProductValuesMock.productID),
      expect.objectContaining({
        assessmentId: "target-id",
        isLPP: true // Verifying we are sending true
      }),
      expect.anything()
    );
 
    // Verify Success Toast and Refetch
    expect(refetchMock).toHaveBeenCalled();
  });
 
  it('should call API to Unmark as LPP when clicked', async () => {
    const lppData = [
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        _id: "lpp-id",
        name: "LPP Assessment",
        isLPP: true,
      }
    ] as unknown as ExperimentalDataItem[];
 
    mockedAxios.put.mockResolvedValue({ status: 204 });
 
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridViewComponentExperimental
            props={lppData}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
            containsLPP={true}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    // Open Menu
    const moreButton = screen.getByTestId("more-horiz-icon");
    fireEvent.click(moreButton);
 
    // Wait for Menu to open and find "Unmark as LPP"
    const unmarkOption = await screen.findByText("Unmark as LPP");
    expect(unmarkOption).toBeInTheDocument();
 
    // Click it
    await act(async () => {
      fireEvent.click(unmarkOption);
    });
 
    // Verify API Call
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining(initialEditProductValuesMock.productID),
      expect.objectContaining({
        assessmentId: "lpp-id",
        isLPP: false // Verifying we are sending false
      }),
      expect.anything()
    );
  });
 
  it('should disable "Mark as LPP" option if another item is already LPP (containsLPP=true)', async () => {
    const nonLPPData = [
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        _id: "normal-id",
        name: "Normal Assessment",
        isLPP: false,
      }
    ] as unknown as ExperimentalDataItem[];
 
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <GridViewComponentExperimental
            props={nonLPPData}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
            containsLPP={true} // Simulate that the parent component found an LPP elsewhere
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    // Open Menu
    const moreButton = screen.getByTestId("more-horiz-icon");
    fireEvent.click(moreButton);
 
    // Find the option
    // Since the text is inside a span, we look for the MenuItem (role="menuitem") that contains the text
    const menuItem = await screen.findByRole('menuitem', { name: /Mark as LPP/i });
 
    // Check if it is disabled
    expect(menuItem).toHaveAttribute('aria-disabled', 'true');
  });
 
});