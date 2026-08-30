/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VersionAckowdlege from '../VersionAckowledge';
import { useGlobaldata } from '../../contexts/masterData/DataContext';
import { useFetchUserAckVersion, useFetchVersionHistory } from '../../hooks/UseVersionHistory';
import { useAdminVersionHistory } from '../../adapters/Api';
import { useLocation } from 'react-router-dom';

jest.mock('../../contexts/masterData/DataContext', () => ({
    useGlobaldata: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
}));

jest.mock('../../hooks/UseVersionHistory', () => ({
    useFetchUserAckVersion: jest.fn(),
    useFetchVersionHistory: jest.fn(),
}));

jest.mock('../../adapters/Api', () => ({
    useAdminVersionHistory: jest.fn(),
}));

jest.mock('../../components/modal/PopupComponentVersionAcknowledge', () => {
    return ({ modalState, setAcknowledgeVersion }: any) => (
        modalState ? (
            <div data-testid="mock-popup">
                <span>Modal is Open</span>
                <button 
                    data-testid="ack-btn"
                    onClick={() => setAcknowledgeVersion(jest.fn())}
                >
                    Acknowledge
                </button>
            </div>
        ) : <div data-testid="mock-popup-closed">Modal is Closed</div>
    );
});

describe('VersionAckowdlege Component', () => {
    const mockPostUserAcknowledgedVersion = jest.fn();
    const mockRefetchUserAck = jest.fn();
    const mockRefetchVersHistory = jest.fn();
    const mockMail = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();

        (useGlobaldata as jest.Mock).mockReturnValue({
            loggedInUser: { mail: mockMail },
        });

        (useLocation as jest.Mock).mockReturnValue({ pathname: '/some-path' });

        (useAdminVersionHistory as jest.Mock).mockReturnValue({
            postUserAcknowledgedVersion: mockPostUserAcknowledgedVersion,
        });

        (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [],
            refetch: mockRefetchUserAck,
        });

        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [] },
            refetch: mockRefetchVersHistory,
        });
    });

    it('should fetch data on mount/route change', () => {
        render(<VersionAckowdlege />);

        expect(mockRefetchUserAck).toHaveBeenCalled();
        expect(mockRefetchVersHistory).toHaveBeenCalled();
    });

    it('should NOT show modal if data is missing or loading', () => {
        render(<VersionAckowdlege />);
        expect(screen.getByTestId('mock-popup-closed')).toBeInTheDocument();
    });

    it('should NOT show modal if user is on the latest version (Equal versions)', () => {
        (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [{ sipVersionAcknowledged: 2 }],
            refetch: mockRefetchUserAck,
        });
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: 2 }] },
            refetch: mockRefetchVersHistory,
        });

        render(<VersionAckowdlege />);

        expect(screen.getByTestId('mock-popup-closed')).toBeInTheDocument();
    });

    it('should SHOW modal if user is on an older version (Latest >= User + 1)', () => {
        (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [{ sipVersionAcknowledged: 1 }],
            refetch: mockRefetchUserAck,
        });
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: 2 }] },
            refetch: mockRefetchVersHistory,
        });

        render(<VersionAckowdlege />);

        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
    });

    it('should handle string parsing logic for versions correctly (Version String handling)', () => {
        (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [{ sipVersionAcknowledged: "Version 1.0" }],
            refetch: mockRefetchUserAck,
        });
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: "v2.0" }] },
            refetch: mockRefetchVersHistory,
        });

        render(<VersionAckowdlege />);

        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
    });

    it('should handle API call when Acknowledge button is clicked', async () => {
        (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [{ sipVersionAcknowledged: 1 }],
            refetch: mockRefetchUserAck,
        });
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: 2 }] },
            refetch: mockRefetchVersHistory,
        });

        render(<VersionAckowdlege />);

        const btn = screen.getByTestId('ack-btn');
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockPostUserAcknowledgedVersion).toHaveBeenCalledWith(
                mockMail,
                {
                    "mail": mockMail,
                    "userPrincipalName": mockMail,
                    "sipVersionAcknowledged": 2 // Should send the latest version found
                }
            );
        });
    });

    it('should handle catch block in convertVersionStringToNumber', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});  
        (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [{ sipVersionAcknowledged: 1 }], // Number, hits 'else return value'
            refetch: mockRefetchUserAck,
        });
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: 2 }] }, // Number
            refetch: mockRefetchVersHistory,
        });

        render(<VersionAckowdlege />);
        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
        
        consoleSpy.mockRestore();
    });

    it('should handle undefined/null data gracefully', () => {
         (useFetchUserAckVersion as jest.Mock).mockReturnValue({
            data: [], 
            refetch: mockRefetchUserAck,
        });
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [] }, 
            refetch: mockRefetchVersHistory,
        });

        render(<VersionAckowdlege />);
        expect(screen.getByTestId('mock-popup-closed')).toBeInTheDocument();
    });
});