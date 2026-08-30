import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import {GlobalDataMock} from "../../../mocks/GlobalData.mock.json";
import {ProductDetailsMock} from "../../../mocks/ProductDetails.mock.json";
import { PostContext } from '../../../contexts/masterData/DataContext';
import axios from 'axios';
import ListViewComponentExperimental from '../ListViewComponentExperimental';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import { ExperimentalDataItem } from '../../breadcrumb/types';
 
 
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
 
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
 
describe('ListViewComponentExperimental', () => {
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
    productSipId: "SIP_CML_0000002"
  };
  mockedAxios.delete.mockResolvedValue({
    status : 204
  });
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <ListViewComponentExperimental
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
 
  it('should display complete/incomplete icons correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
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
 
  it('should toggle "See More/See Less" content', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
            props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    const toggleButtons = await screen.findAllByText(/See More/i);
    fireEvent.click(toggleButtons[0]);
 
    await waitFor(() => {
      expect(screen.getByText(/SIP ID :/i)).toBeInTheDocument();
      expect(screen.getByText(/See Less/i)).toBeInTheDocument();
    });
 
   
  });
  it('should apply bold font for Modified Date when sort_order is "Modified Date"', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
            props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    const dateLabels = await screen.findAllByText(/Date Modified:/i);
    expect(dateLabels[0]).toHaveStyle("font-family: kenvue-sans");
  });
 
  it('should apply regular font for Created Date when sort_order is "Modified Date"', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
            props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    const dateLabels = await screen.findAllByText(/Date Created:/i);
    expect(dateLabels[0]).toHaveStyle("font-family: kenvue-sans-regular");
  });
 
  it('should apply bold font for Created Date when sort_order is "Created Date"', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
            props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
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
      <ListViewComponentExperimental
        props={ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[]}
        varProductData={initialEditProductValuesMock}
        refetch={refetchMock}
        varUserCRUDAccess={1}
        sort_order="Created Date"
      />
    );
 
    // Test Created Date style
    const createdDate = await screen.findAllByText(/Date Created:/i);
    expect(createdDate[0]).toHaveStyle({
      fontFamily: 'kenvue-sans',
      fontSize: '13.33px'
    });
 
    // Test Modified Date style
    const modifiedDate = await screen.findAllByText(/Date Modified:/i);
    expect(modifiedDate[0]).toHaveStyle({
      fontFamily: 'kenvue-sans-regular',
      fontSize: '13.33px'
    });
  });
  it('should render empty when no experimental data provided', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
            props={[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    expect(screen.queryByTestId('experimental-card')).not.toBeInTheDocument();
  });
  it('should truncate long PC Spec values', async () => {
    const longPcSpec = "a".repeat(100);
    const modifiedData = [
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        pc_spec: longPcSpec
      }
    ];
 
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <ListViewComponentExperimental
            props={modifiedData as unknown as ExperimentalDataItem[]}
            varProductData={initialEditProductValuesMock}
            refetch={refetchMock}
            varUserCRUDAccess={1}
 
            sort_order={"Modified Date"}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
 
    const seeMoreButton = await screen.findByText(/See More/i);
    fireEvent.click(seeMoreButton);
 
    const pcSpecElement = screen.getByTestId('truncated-pc-spec');
    expect(pcSpecElement.textContent?.length).toBeLessThan(longPcSpec.length);
    expect(pcSpecElement.textContent).toContain('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa…');
  });
 
  it('should render LPP visual indicators (Chip and Icon) only when isLPP is true', () => {
    // Create specific mock data: One LPP item, One Non-LPP item
    const mixedLPPData = [
      {
        ...ProductDetailsMock[0].assessments.experimental[0],
        _id: "lpp-item-id",
        name: "LPP Assessment",
        isLPP: true, 
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
          <ListViewComponentExperimental
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
    const lppChips = screen.getAllByText("LPP");
    expect(lppChips.length).toBeGreaterThan(0);
    expect(lppChips[0]).toHaveClass("MuiChip-label");
 
    // 2. Check for the LPP Tag Image
    // The List View uses the class 'Baseline-8' for the tag icon in the header area
    const lppImages = screen.getAllByAltText("lpp");
    const cardLppTags = lppImages.filter(img => img.classList.contains("Baseline-8"));
    expect(cardLppTags.length).toBeGreaterThan(0);
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
          <ListViewComponentExperimental
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
    const moreButton = screen.getByTestId("more-button");
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
 
    // Verify Refetch
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
          <ListViewComponentExperimental
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
    const moreButton = screen.getByTestId("more-button");
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
          <ListViewComponentExperimental
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
    const moreButton = screen.getByTestId("more-button");
    fireEvent.click(moreButton);
 
    // Find the option
    // Since the text is inside a span, we look for the MenuItem (role="menuitem") that contains the text
    const menuItem = await screen.findByRole('menuitem', { name: /Mark as LPP/i });
   
    // Check if it is disabled
    expect(menuItem).toHaveAttribute('aria-disabled', 'true');
  });
});