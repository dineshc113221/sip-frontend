
import { act, renderHook, waitFor } from "@testing-library/react";
import { useProductService } from '../../adapters/Api';
import { QueryClient, QueryClientProvider } from "react-query";
import {
  useGetProductDetailsAllList,
  useGetProductDetailByID,
  useGetProductAssessmentDetailByID,
  useGetUseDoseValue,
  useGetRawMaterialDataByKeyword,
  useGetProductAssessmentResultByID,
  useGetProductDetailAuditReport,
  useGetBaselineTableResults,
  useGetProductDetailLogReport,
  useGetLogsInputsDetails,
  useGetProductDetailsMyProduct ,
  useGetAssessmentDetailBySipID
} from '../../hooks/UseGetProductDetails';

const mockService = {
  getProductDetailsAllList: jest.fn(),
  getProductDetailByID: jest.fn(),
  getProductAssessmentDetailByID: jest.fn(),
  getUseDoseValue: jest.fn(),
  getRawMaterialDataByKeyword: jest.fn(),
  getProductAssessmentResultByID: jest.fn(),
  getProductDetailAuditReport: jest.fn(),
  getBaselineTableResults: jest.fn(),
  getProductDetailLogReport: jest.fn(),
  getLogsInputsDetails: jest.fn(),
  getProductBaselineAssessmentResultByID: jest.fn(),
  getProductDetailsMyProduct : jest.fn(),
  getAssessmentDetailBySipID : jest.fn()
};
// Mock the API module
jest.mock('../../adapters/Api', () => ({
  useProductService: jest.fn(() => mockService),
}));

const mockUseProductService = useProductService as jest.MockedFunction<typeof useProductService>;

describe('Product Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  // Define a test wrapper for the hooks
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useGetProductDetailsAllList', () => {
    it('should fetch product list with correct parameters', async () => {
      const mockData = [{ _id: '1', name: 'Product 1' }];
      // Setup mock resolved value
      mockService.getProductDetailsAllList.mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetProductDetailsAllList('test', 'all'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the mock was called correctly
      expect(mockService.getProductDetailsAllList).toHaveBeenCalledWith('test', 'all');
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useGetProductDetailByID', () => {
    it('should fetch product detail by ID', async () => {
      const mockData = { _id: '1', name: 'Product Detail' };
      const service = mockUseProductService();
      (service.getProductDetailByID as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetProductDetailByID('123'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(service.getProductDetailByID).toHaveBeenCalledWith('123');
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useGetProductAssessmentDetailByID', () => {
    it('should fetch assessment detail when enabled', async () => {
      const mockData = { assessment: 'details' };
      const service = mockUseProductService();
      (service.getProductAssessmentDetailByID as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetProductAssessmentDetailByID('123', 'type'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(service.getProductAssessmentDetailByID).toHaveBeenCalledWith('123', 'type');
      expect(result.current.data).toEqual(mockData);
    });

    it('should not fetch when ID or type is missing', async () => {
      const service = mockUseProductService();
      renderHook(() => useGetProductAssessmentDetailByID('', ''), { wrapper });

      expect(service.getProductAssessmentDetailByID).not.toHaveBeenCalled();
    });
  });

  describe('useGetUseDoseValue', () => {
    it('should trigger mutation with correct parameters', async () => {
      const mockResponse = { _id: '1', 'Use Dose / g': '100' };
      const service = mockUseProductService();
      (service.getUseDoseValue as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useGetUseDoseValue('segment', 'sub-segment'), { wrapper });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(service.getUseDoseValue).toHaveBeenCalledWith('segment', 'sub-segment');
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useGetRawMaterialDataByKeyword', () => {
    it('should search raw materials with keyword and page', async () => {
      const mockData = [{ rawMaterialId: '1', tradeName: 'Material 1' }];
      const service = mockUseProductService();
      (service.getRawMaterialDataByKeyword as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetRawMaterialDataByKeyword('test', 1), { wrapper });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(service.getRawMaterialDataByKeyword).toHaveBeenCalledWith('test', 1);
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useGetProductAssessmentResultByID', () => {
    it('should fetch assessment results', async () => {
      const mockData = { results: [] };
      const service = mockUseProductService();
      (service.getProductAssessmentResultByID as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetProductAssessmentResultByID('p1', 'a1', 'type'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(service.getProductAssessmentResultByID).toHaveBeenCalledWith('p1', 'a1', 'type');
      expect(result.current.data).toEqual(mockData);
    });
  });
  it('should fetch audit report details', async () => {
    const mockData = { auditReport: '' };
    const service = mockUseProductService();
    (service.getProductDetailAuditReport as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetProductDetailAuditReport('SIP_ANU_0000777_001_EXP', true), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getProductDetailAuditReport).toHaveBeenCalledWith('SIP_ANU_0000777_001_EXP', true);
    expect(result.current.data).toEqual(mockData);
  });
  it('should fetch baseline table results', async () => {
    const mockData = { baselineResults: [] };
    const service = mockUseProductService();
    (service.getProductBaselineAssessmentResultByID as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGetBaselineTableResults('p1', 'a1', 'type'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getProductBaselineAssessmentResultByID).toHaveBeenCalledWith(
      'p1',
      'a1',
      'type'
    );
    expect(result.current.data).toEqual(mockData);
  });
  it('should fetch product detail log report', async () => {
    const mockData = { logReport: 'details' };
    const service = mockUseProductService();
    (service.getProductDetailLogReport as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGetProductDetailLogReport('p1', 'a1'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getProductDetailLogReport).toHaveBeenCalledWith('p1', 'a1');
    expect(result.current.data).toEqual(mockData);
  });
  it('should fetch log input details', async () => {
    const mockData = { logInputs: 'details' };
    const service = mockUseProductService();
    (service.getLogsInputsDetails as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetLogsInputsDetails('log123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getLogsInputsDetails).toHaveBeenCalledWith('log123');
    expect(result.current.data).toEqual(mockData);
  });
  it('should fetch product details for "myproduct"', async () => {
    const mockData = [{ _id: '1', name: 'My Product 1' }];
    const service = mockUseProductService();
    (service.getProductDetailsMyProduct as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetProductDetailsMyProduct('test', 'myproduct'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getProductDetailsMyProduct).toHaveBeenCalledWith('test', 'myproduct');
    expect(result.current.data).toEqual(mockData);
  });

  it('should fetch product details for "all"', async () => {
    const mockData = [{ _id: '2', name: 'All Product 2' }];
    const service = mockUseProductService();
    (service.getProductDetailsMyProduct as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetProductDetailsMyProduct('query', 'all'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getProductDetailsMyProduct).toHaveBeenCalledWith('query', 'all');
    expect(result.current.data).toEqual(mockData);
  });

 
  it('should fetch assessment details by SIP ID', async () => {
    const mockData = { assessmentId: 'sip123', detail: 'Assessment Details' };
    const service = mockUseProductService();
    (service.getAssessmentDetailBySipID as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetAssessmentDetailBySipID('sip123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(service.getAssessmentDetailBySipID).toHaveBeenCalledWith('sip123');
    expect(result.current.data).toEqual(mockData);
  });

 
});