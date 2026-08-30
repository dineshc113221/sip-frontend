/* eslint-disable @typescript-eslint/no-var-requires */
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import '@testing-library/jest-dom';
import { PostContext, useGlobaldata } from '../../../contexts/masterData/DataContext';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import axios from 'axios';
import { ReactInfiniteProps } from "../../../mocks/CoreLogin.mock";
import PopupAssessmentAdd from "../PopupComponentAddAssessment";
import { ProductIdMock } from "../../../mocks/ProductIds.mock.json";

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

describe('PackagingEditDelete', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Il9OY3J6dTAwc0ZEeWJpYTVaRVd0OG1TSVdybjdnZEhpMUZ3RUw4MGVoVTgiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYvIiwiaWF0IjoxNzI5ODUxMzY3LCJuYmYiOjE3Mjk4NTEzNjcsImV4cCI6MTcyOTg1NTU4MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhZQUFBQXBlSDlqSEo2UkhIeHFJMzBRcE52L3BKeGFCd21scmhoRlJIK0FxTlBLVFAvN1JOSndoUmU1MGxOeHZJS1pFUmQ5b0ZXMWFNbWpoelBycC9kbkdoU1BZaHptTVNjRjhpRnc1dlZ4cEt5U2k4PSIsImFtciI6WyJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiU1VTVEFJTkFCTEUgSU5OT1ZBVElPTiBQUk9GSUxFUiAtIERFViIsImFwcGlkIjoiNThhYTAwYzYtZDQzNC00YTUwLTliY2EtZWVlMmRhODgwNDEzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJKYWRoYXYiLCJnaXZlbl9uYW1lIjoiUHJpeWFua2FZIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTY1LjIyNS4yMzAuMTgwIiwibmFtZSI6IkphZGhhdiwgUHJpeWFua2FZIFtOb24tS2VudnVlXSIsIm9pZCI6IjMxMDcwN2VjLWVkZTUtNDBkNi1iYjhkLTRkZDZlYjg4MWZmZSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMzUwMDk2MTE0LTQwMjQyMDkxMzctMTI3MjQwMzg2My0zMDM1MDIiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDNCMTUwRjkwNCIsInJoIjoiMC5BWFlBd2txbWV5dUtma0dial96NEk0OHFWZ01BQUFBQUFBQUF3QUFBQUFBQUFBQzBBRDQuIiwic2NwIjoiZW1haWwgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIiwic3ViIjoiUldfQnB3VVFXek9qa19pd2FGNi1ibGp6ZFY3Z0RUZlRza2wyTlV5bmt5VSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjdiYTY0YWMyLThhMmItNDE3ZS05YjhmLWZjZjgyMzhmMmE1NiIsInVuaXF1ZV9uYW1lIjoiUEphZGhhMDRAa2VudnVlLmNvbSIsInVwbiI6IlBKYWRoYTA0QGtlbnZ1ZS5jb20iLCJ1dGkiOiJWXzctY1cyR18wZTY3aXh1SlRKdkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiNiAxIiwieG1zX3N0Ijp7InN1YiI6Ink2dEczY19PNGdMbUdFbE5VVU41TnlVWHk3M2lrR0t4RmtXelJYZjMyWXcifSwieG1zX3RjZHQiOjE2NDk5NjYzNzV9.F8PzrbhRGhDKGVgVMlwo-8iLXpWOmF05XFsbi7FM3KYf9pCQTvMw-9lER7G2GeSQ1ilu242KZH_bUohSd219XJ_wOKXUQidkkKHwY0MFmBD6GJ0WXKqMPnw7-ADUWxxvfOkbYKA8XXjoGruuf4wCZwR2R1ZowCanDOf-IvAGDCDWdkEctF6_TQdl5JiwGByMloZKhkbtrbzuRF_bJ71gshXkKcJz9MzDv_YgfvI-2eSl12W9mAKW8xq8I5T0dA6vH8i-HTouzdZMkmiD_jMcbtau4t-jXjOzUQriDL-vn7q--sS67jdSfHwGyf9iyyPY_2cYRpWhXbjt5p3bM7MLgw'

  }
  const onCloseMock = jest.fn();
  mockedAxios.delete.mockResolvedValue({
    status: 204
  });
  mockedAxios.put.mockResolvedValue({
    status: 200
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
    global.fetch = jest.fn();
    
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('should render the component ', async () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title={"baseline"}
            productID={"SIP_AVN_0000107"}
            ProductSipID={"SIP_AVN_0000107"}
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
    await act(() => {
      const assessmentName = screen.getByRole("textbox");
      fireEvent.change(assessmentName, { target: { value: "test" } });
    });
    await act(() => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      fireEvent.click(nextButton);
    });
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    jest.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled()
    })
  }, 8000);

  it('should render the component for close button', async () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={jest.fn()}
            title={"baseline"}
            productID={"SIP_AVN_0000107"}
            ProductSipID={"SIP_AVN_0000107"}
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
    await act(() => {
      const assessmentName = screen.getByRole("textbox");
      fireEvent.change(assessmentName, { target: { value: "test" } });
    });
    await act(() => {
      const closeIcon = screen.getAllByTestId("CloseIcon");
      fireEvent.click(closeIcon[0])
    })

  }, 8000);

  it('should render the component for tooltip', async () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={jest.fn()}
            title={"baseline"}
            productID={"SIP_AVN_0000107"}
            ProductSipID={"SIP_AVN_0000107"}
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
    await act(() => {
      const assessmentName = screen.getByRole("textbox");
      fireEvent.change(assessmentName, { target: { value: "test" } });
    });
    await act(() => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      fireEvent.click(nextButton);
    });
    const tooltipIcon = screen.getByTestId("InfoIcon");
    fireEvent.click(tooltipIcon)
    fireEvent.click(tooltipIcon)
  }, 8000);

  it('should render the component for tooltip', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok : true,
      json: () => Promise.resolve(ProductIdMock)
    })) as jest.Mock;
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={jest.fn()}
            title={"baseline"}
            productID={"SIP_AVN_0000107"}
            ProductSipID={"SIP_AVN_0000107"}
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
    await act(() => {
      const assessmentName = screen.getByRole("textbox");
      fireEvent.change(assessmentName, { target: { value: "test" } });
    });
    await act(() => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      fireEvent.click(nextButton);
    });
    await act(() => {
      const textBox = screen.getAllByRole("combobox");
      fireEvent.change(textBox[0], {target : {value : "tv-"}})
      fireEvent.keyDown(textBox[0], { key: "ArrowDown" });
      fireEvent.keyDown(textBox[0], { key: "Enter" });
    })
  }, 8000);
  it('should handle API errors and loading states', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Skip'));

    await waitFor(() => {
      expect(screen.getByText('Skip')).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByText('Skip')).not.toBeDisabled();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      expect(require('react-toastify').toast.warning).toHaveBeenCalled();
    });
  }, 10000);


  it('should handle assessment name validation', async () => {
    render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const input = screen.getByRole('textbox');

    // Test max length validation
    fireEvent.change(input, {
      target: { value: 'a'.repeat(101) }
    });

    expect(screen.getByText(/Text length should not exceed/)).toBeInTheDocument();

    // Test valid input
    fireEvent.change(input, {
      target: { value: 'Valid Name' }
    });

    expect(screen.getByText(/Characters left: 90/)).toBeInTheDocument();
  });

  it('should reset state on close', async () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Interact with textbox
    const textbox = await screen.findByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'Test' } });

    fireEvent.click(screen.getByText('Next'));

    // Close the dialog
    fireEvent.click(screen.getAllByTestId('CloseIcon')[0]);

    // Re-render with open=false to simulate dialog close
    rerender(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={false}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Then re-open it
    rerender(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Check if textbox is reset
    const resetTextbox = await screen.findByRole('textbox');
    expect(resetTextbox).toHaveValue('');
  });
  it('should handle API success and navigation', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { assessmentId: '123', _id: '456', name: 'test' }
    });

    // Mock product code fetch
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['TV-123'])
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          FG_SPEC: 'FG-TEST',
          SKU_ERP_CODE: 'SKU-TEST',
          PC_NM: 'PC-TEST',
          NAME: 'Test Product',
          FRML_CODE: 'FRML-TEST',
          SALES_ZONE: 'NA',
          FRML_LAB_CODE: 'LAB-123',
          BRAND_CODE: 'Brand1',
          PRODUCT_SEGMENT: 'Segment1',
          PRODUCT_SUB_SEGMENT: 'Sub1'
        })
      }));

    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Fill assessment name
    const assessmentInput = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(assessmentInput, { target: { value: 'Test Assessment' } });
    });

    // Click Next to open product search dialog
    await act(async () => {
      fireEvent.click(screen.getByText('Next'));
    });

    // Wait for product search dialog to open
    await waitFor(() => {
      expect(screen.getByText('Search Product Code')).toBeInTheDocument();
    });

    // Search and select product
    const searchInput = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'TV' } });
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
      fireEvent.keyDown(searchInput, { key: 'Enter' });
    });

    // Wait for product details to load
    await waitFor(() => {
      expect(screen.getByText('Add Experimental Assessment')).toBeInTheDocument();
    });

    // Click Confirm
    const confirmButton = screen.getByText('Confirm');
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // Wait for navigation
    await waitFor(() => {
     
      expect(onCloseMock).toHaveBeenCalled();
    });
  }, 15000);
  // Test for API error handling in product code fetch
  it('should handle product code fetch error', async () => {
    global.fetch = jest.fn()
      .mockRejectedValue(new Error('API Error'));

    render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Next'));

    const searchInput = screen.getByRole('combobox');
    fireEvent.change(searchInput, { target: { value: 'TV' } });

    await waitFor(() => {
      expect(screen.queryByText('FG Spec :')).toBeInTheDocument();
    });
  });
  it('should enforce 100 character limit on assessment name', async () => {
    render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const input = screen.getByRole('textbox');
    const longText = 'a'.repeat(101);

    fireEvent.change(input, { target: { value: longText } });

    await waitFor(() => {
      expect(input).toHaveValue(longText.slice(0, 101));
      expect(screen.getByText(/Text length should not exceed/)).toBeInTheDocument();
    });
  });
  it('should show error when assessment name is empty', async () => {
    render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveClass(' MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input');
    });
  });
  it('should handle confirm skip flow with various scenarios', async () => {
    const mockRefetch = jest.fn();
    const mockHandleClose = jest.fn();

    // Test successful confirmation
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { assessmentId: '123', _id: '456', name: 'test-assessment' }
    });

    // Test error case
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    // Test unsuccessful response
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {} // No assessmentId
    });

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={mockHandleClose}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={mockRefetch}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Test successful confirm flow
    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('Next'));
    });

    const confirmButton = screen.getByText('Confirm');

    // Test loading state prevention
    await act(async () => {
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton); // Second click should be ignored
    });

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(require('react-toastify').toast.success).toHaveBeenCalledWith(
        'Assessment details submitted successfully'
      );
      expect(mockHandleClose).toHaveBeenCalled();
     
    });

    // Test error case
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(require('react-toastify').toast.warning).toHaveBeenCalledWith(
        'Error occurred while submitting the Component details, please try again!'
      );
    });

    // Test unsuccessful response case
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(require('react-toastify').toast.warning).toHaveBeenCalledWith(
        'Error occurred while submitting the Component details, please try again!'
      );
    });

    // Test button disabled states
    rerender(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={mockHandleClose}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={mockRefetch}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    const disabledButton = screen.getByText('Confirm');
    expect(disabledButton).toBeEnabled();
  });
  it('should log error when product code fetch fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Mock failed fetch response
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Server error" })
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={onCloseMock}
            title="Experimental"
            productID="123"
            ProductSipID="456"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Open product search dialog
    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('Next'));
    });

    // Trigger product search with invalid input
    const searchInput = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'INVALID' } });
    });

    // Wait for fetch to complete
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch product code list");
    });

    // Cleanup spy
    consoleErrorSpy.mockRestore();
  });


  it('should render Autocomplete options with highlighting', async () => {
    // Mock product codes that match the search input
    const mockProductCodes = ['TEST-123', 'PROD-TEST-456'];

    // Mock API responses
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductCodes)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          FG_SPEC: 'FG-TEST',
          SKU_ERP_CODE: 'SKU-TEST',
          PC_NM: 'PC-TEST',
          NAME: 'Test Product',
          FRML_CODE: 'FRML-TEST',
          SALES_ZONE: 'NA',
          FRML_LAB_CODE: 'LAB-123',
          BRAND_CODE: 'Brand1',
          PRODUCT_SEGMENT: 'Segment1',
          PRODUCT_SUB_SEGMENT: 'Sub1'
        })
      }));

    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupAssessmentAdd
            open={true}
            onClose={jest.fn()}
            title="baseline"
            productID="SIP_AVN_0000107"
            ProductSipID="SIP_AVN_0000107"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Fill assessment name and proceed to product search
    const assessmentInput = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(assessmentInput, { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('Next'));
    });

    // Wait for product search dialog
    await waitFor(() => {
      expect(screen.getByText('Search Product Code')).toBeInTheDocument();
    });

    // Get Autocomplete input
    const autocompleteInput = screen.getByRole('combobox');

    // Type and open dropdown
    await act(async () => {
      fireEvent.change(autocompleteInput, { target: { value: 'test' } });
      fireEvent.click(autocompleteInput); // Additional click to open dropdown
      fireEvent.keyDown(autocompleteInput, { key: 'ArrowDown' });
    });

    

  
  });
  it('should call handleImportProductDetail and getProductCodeDetail when selecting a product', async () => {
    const mockProductCodes = ['TEST-123', 'PROD-TEST-456'];
    const mockProductDetails = {
      FG_SPEC: 'FG-TEST',
      SKU_ERP_CODE: 'SKU-TEST',
      PC_NM: 'PC-TEST',
      NAME: 'Test Product'
    };

    // Mock fetch responses
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductCodes)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductDetails)
      }));

    render(
      <QueryClientProvider client={queryClient} >
        <PostContext.Provider value={contextValue} >
          <PopupAssessmentAdd
            open={true}
            onClose={jest.fn()}
            title="baseline"
            productID="SIP_AVN_0000107"
            ProductSipID="SIP_AVN_0000107"
            refetch={jest.fn()}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );

    // Navigate to product search
    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('Next'));
    });

    // Select a product
    const autocompleteInput = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(autocompleteInput, { target: { value: 'test' } });
      fireEvent.keyDown(autocompleteInput, { key: 'ArrowDown' });
    });

    await waitFor(() => {
      expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
    });

 

    // Verify API calls
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('undefined/api/product-search/findProduct?initialLetters=test'),
      expect.any(Object)
    );
  });


});