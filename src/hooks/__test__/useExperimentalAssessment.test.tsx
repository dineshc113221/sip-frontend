/* eslint-disable @typescript-eslint/no-var-requires */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { GlobalDataMock } from "../../mocks/GlobalData.mock.json";
import { ReactInfiniteProps } from '../../mocks/CoreLogin.mock';
import { useExperimentalAssessment } from '../useExperimentalAssessment';
import { useGlobaldata } from '../../contexts/masterData/DataContext';
import axios from 'axios';

const queryClient = new QueryClient({});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
}));

jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;

jest.mock("../../contexts/masterData/DataContext");

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
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
 
const mockProductData = { productSipId: "SIP-123", productID: "PROD-456" };
const mockAssessmentData = {
  _id: "ASSESS-789",
  name: "Test Assessment",
  isLPP: false, // Currently false, so function should toggle to true
  fg_spec: "spec",
  formula_number: "123"
};
 
 
const Test = () => {
  const { handleMoreHorizClick, handleOpenDeletePopup, handleMenuClose, handleDelete, handleLPP, handleCloseDeletePopup } = useExperimentalAssessment({ refetch: jest.fn() })
  return (
    <div>
      <button onClick={(e) => handleMoreHorizClick(e, { assessmentId: "12739" })}>{"test"}</button>
      <button onClick={(e) => handleOpenDeletePopup(e, {
        productID: "test",
        productSipId: "test",
        assessmentId: "test",
        type: "test",
      })}>{"test"}</button>
      <button onClick={handleMenuClose}>{"test"}</button>
      <button onClick={handleDelete}>{"test"}</button>
      <button onClick={handleCloseDeletePopup}>{"test"}</button>
      <button onClick={() => handleLPP(mockProductData, mockAssessmentData)}>{"handleLPP"}</button>
    </div>
 
 
  )
}
 
describe('useExperimentalAssessment', () => {
 
  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging,
      token: "test"
    }));
  });
 
  it('should render the component', async () => {
    mockedAxios.delete.mockResolvedValue({
      status : 204
    });
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <Test />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    const button = screen.getAllByRole("button");
    await act(() => {
      fireEvent.click(button[0]);
      fireEvent.click(button[1]);
    })
      fireEvent.click(button[2]);
      fireEvent.click(button[3]);
      jest.advanceTimersByTime(5000);
      fireEvent.click(button[4]);
  }, 8000);
 
  it('should render the component for error delete response', async () => {
    mockedAxios.delete.mockResolvedValue({
      status : 400
    });
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <Test />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    const button = screen.getAllByRole("button");
    await act(() => {
      fireEvent.click(button[0]);
      fireEvent.click(button[1]);
    })
    await waitFor(()=>{
      fireEvent.click(button[2]);
      fireEvent.click(button[3]);
    })
  }, 8000);
 
  it('should successfully mark assessment as LPP (status 204)', async () => {
    // Mock the Axios call used inside setUnsetAssessmentAsLPP
    mockedAxios.put.mockResolvedValue({
      status: 204
    });
 
    // Mock toast to verify calls
    const toastSuccessSpy = jest.spyOn(require("react-toastify").toast, 'success');
 
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <Test />
        </QueryClientProvider>
      );
    });
 
    const buttons = screen.getAllByRole("button");
    // Click the handleLPP button (index 5 based on the updated Test component)
    await act(async () => {
      fireEvent.click(buttons[5]);
    });
 
    await waitFor(() => {
      // Check if API was called with the toggled LPP value
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining("PROD-456"), // Checks URL contains productID
        expect.objectContaining({
            isLPP: true, // Input was false, so it should send true
            type: "Experimental"
        }),
        expect.any(Object)
      );
 
      // Verify success toast
      expect(toastSuccessSpy).toHaveBeenCalledWith("Assessment Test Assessment is marked as LPP successfully");
    });
  });
 
  it('should show warning toast when marking LPP fails (status != 204)', async () => {
    // Mock failure status
    mockedAxios.put.mockResolvedValue({
      status: 400
    });
 
    const toastWarningSpy = jest.spyOn(require("react-toastify").toast, 'warning');
 
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <Test />
        </QueryClientProvider>
      );
    });
 
    const buttons = screen.getAllByRole("button");
    await act(async () => {
      fireEvent.click(buttons[5]);
    });
 
    await waitFor(() => {
      expect(toastWarningSpy).toHaveBeenCalledWith("Error occured while marking the assessment as LPP, please try again!");
    });
  });
 
});