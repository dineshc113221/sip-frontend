import { render, act, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { Context } from '../../utills/useContext';
import { PostContext } from '../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../mocks/GlobalData.mock.json";
import { LoadingProvider } from '../../contexts/loadingPage/LoadingContext';
import AuditReportPage from '../AuditReport.page';
import { useGetProductDetailAuditReport } from '../../hooks/UseGetProductDetails';

const queryClient = new QueryClient({});

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
}));

jest.mock("../../hooks/UseGetProductDetails", () => {
  return {
    useGetProductDetailAuditReport: jest.fn(() => ({
      data: null,
      isLoading: false,
      error: null,
    })),
  };
});

jest.mock("../../contexts/masterData/DataContext");

const mockedUsedNavigate = jest.fn();
const mockedUseTheme = jest.fn();
const mockedUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useTheme: () => mockedUseTheme,
  useLocation: () => mockedUseLocation,
  useParams: () => ({ id: "testId" }),
}));

describe('AuditReport', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: "test"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetProductDetailAuditReport as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  global.URL.createObjectURL = jest.fn();
  global.URL.revokeObjectURL = jest.fn();

  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <LoadingProvider>
          <QueryClientProvider contextSharing={true} client={queryClient}>
            <PostContext.Provider value={contextValue}>
              <Context.Provider value={null}>
                <AuditReportPage isAssessment={false} />
              </Context.Provider>
            </PostContext.Provider>
          </QueryClientProvider>
        </LoadingProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  });

  it('should call viewReport and downloadReport when data is available', async () => {
    const mockData = { data: new Blob(["mock PDF data"], { type: "application/pdf" }) };
    (useGetProductDetailAuditReport as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    await act(async () => {
      render(
        <LoadingProvider>
          <QueryClientProvider contextSharing={true} client={queryClient}>
            <PostContext.Provider value={contextValue}>
              <Context.Provider value={null}>
                <AuditReportPage isAssessment={false} />
              </Context.Provider>
            </PostContext.Provider>
          </QueryClientProvider>
        </LoadingProvider>
      );
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should display no data message when data is unavailable', async () => {
    (useGetProductDetailAuditReport as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    await act(async () => {
      render(
        <LoadingProvider>
          <QueryClientProvider contextSharing={true} client={queryClient}>
            <PostContext.Provider value={contextValue}>
              <Context.Provider value={null}>
                <AuditReportPage isAssessment={false} />
              </Context.Provider>
            </PostContext.Provider>
          </QueryClientProvider>
        </LoadingProvider>
      );
    });

    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });
  it('should set isDataAvailable to false and display "No data available" when data is absent', async () => {
    (useGetProductDetailAuditReport as jest.Mock).mockReturnValue({
      data: null, // Simulating no data returned
      isLoading: false,
      error: null,
    });
  
    await act(async () => {
      render(
        <LoadingProvider>
          <QueryClientProvider contextSharing={true} client={queryClient}>
            <PostContext.Provider value={contextValue}>
              <Context.Provider value={null}>
                <AuditReportPage isAssessment={false} />
              </Context.Provider>
            </PostContext.Provider>
          </QueryClientProvider>
        </LoadingProvider>
      );
    });
  
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });
  
  it('should revoke object URL after downloading report', async () => {
    const mockData = { data: new Blob(["mock PDF data"], { type: "application/pdf" }) };
    (useGetProductDetailAuditReport as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    await act(async () => {
      render(
        <LoadingProvider>
          <QueryClientProvider contextSharing={true} client={queryClient}>
            <PostContext.Provider value={contextValue}>
              <Context.Provider value={null}>
                <AuditReportPage isAssessment={false} />
              </Context.Provider>
            </PostContext.Provider>
          </QueryClientProvider>
        </LoadingProvider>
      );
    });

    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});
