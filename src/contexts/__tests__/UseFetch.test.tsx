// useFetch.test.tsx

import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { getLoggedInUserDetails } from '@consumer/core-login-ui-mf';
import useFetch from '../masterData/useFetch';

// Mock axios and the getLoggedInUserDetails function
jest.mock('axios');
jest.mock('@consumer/core-login-ui-mf', () => ({
    getLoggedInUserDetails: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetUserDetails = getLoggedInUserDetails as jest.Mock;

describe('useFetch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state with loaded false and null data', () => {
        const { result } = renderHook(() => useFetch('/test-url', ''));

        expect(result.current[0]).toBe(false);
        expect(result.current[1]).toBeNull();
    });

    it('should fetch data successfully and update state', async () => {
        const mockData = [{ id: 1, name: 'Test Data' }];
        const mockUser = { username: 'user123' };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        mockedGetUserDetails.mockReturnValue(mockUser);

        const { result } = renderHook(() =>
            useFetch('/test-url', 'valid-token')
        );

        // Initial state
        expect(result.current[0]).toBe(false);
        expect(result.current[1]).toBeNull();

        

        // After successful fetch
        await waitFor(() => {
            expect(result.current[0]).toBe(true);
        });

        expect(result.current[1]).toEqual([
            { id: 1, name: 'Test Data', loggedInUserDetails: mockUser },
        ]);
        expect(mockedAxios.get).toHaveBeenCalledWith('/test-url', {
            headers: { Authorization: 'Bearer valid-token' }
        });
    });

    it('should keep the initial state and log when fetching fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        mockedAxios.get.mockRejectedValueOnce(new Error('Request failed'));

        const { result } = renderHook(() => useFetch('/test-url', 'valid-token'));

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith('Error: Error: Request failed');
        });

        expect(result.current).toEqual([false, null]);
        consoleError.mockRestore();
    });


    it('should not fetch data when token is missing', () => {
        renderHook(() => useFetch('/test-url', ''));

        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

});