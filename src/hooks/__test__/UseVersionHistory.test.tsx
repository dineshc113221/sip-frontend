import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useFetchVersionHistory, useFetchUserAckVersion } from '../UseVersionHistory';
import { useAdminVersionHistory } from '../../adapters/Api';

jest.mock('../../adapters/Api', () => ({
    useAdminVersionHistory: jest.fn(),
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

describe('UseVersionHistory Hooks', () => {
    
    const mockGetVersionHistory = jest.fn();
    const mockGetUserAcknowledgedVersion = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAdminVersionHistory as jest.Mock).mockReturnValue({
            getVersionHistory: mockGetVersionHistory,
            getUserAcknowledgedVersion: mockGetUserAcknowledgedVersion
        });
    });

    
    test('useFetchVersionHistory calls getVersionHistory and returns data', async () => {
        
        mockGetVersionHistory.mockResolvedValue(['ver-1', 'ver-2']);        
        const { result } = renderHook(() => useFetchVersionHistory(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(['ver-1', 'ver-2']);              
        expect(mockGetVersionHistory).toHaveBeenCalledTimes(1);
    });

    
    test('useFetchUserAckVersion calls getUserAcknowledgedVersion with ID', async () => {
        
        const mockResponse = { acknowledged: true, date: '2023' };
        mockGetUserAcknowledgedVersion.mockResolvedValue(mockResponse);
        const testId = 'user-123';
        
        const { result } = renderHook(() => useFetchUserAckVersion(testId), {
            wrapper: createWrapper(),
        });
        
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockResponse);
        expect(mockGetUserAcknowledgedVersion).toHaveBeenCalledWith(testId);
    });
});