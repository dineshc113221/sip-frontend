import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useFetchVersionBasedResult } from '../useVersionAssessmentResult'; 
import { useProductResultData } from '../../adapters/Api';

jest.mock('../../adapters/Api', () => ({
    useProductResultData: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useFetchVersionBasedResult Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call getVersionBasedResult with correct data and return successful response', async () => {
        
        const mockInputData = { productId: '123', version: '1.0' };
        const mockApiResponse = { score: 95, status: 'Completed' };
        
        const getVersionBasedResultMock = jest.fn().mockResolvedValue(mockApiResponse);
        
        
        (useProductResultData as jest.Mock).mockReturnValue({
            getVersionBasedResult: getVersionBasedResultMock,
        });

        
        const { result } = renderHook(() => useFetchVersionBasedResult(mockInputData), {
            wrapper: createWrapper(),
        });

        
        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockApiResponse);
        expect(getVersionBasedResultMock).toHaveBeenCalledWith(mockInputData);
    });

    test('should handle API errors', async () => {
        
        const getVersionBasedResultMock = jest.fn().mockRejectedValue(new Error('Network Error'));
        
        
        (useProductResultData as jest.Mock).mockReturnValue({
            getVersionBasedResult: getVersionBasedResultMock,
        });

        
        const { result } = renderHook(() => useFetchVersionBasedResult({}), {
            wrapper: createWrapper(),
        });

        
        await waitFor(() => expect(result.current.isError).toBe(true));
    });
});