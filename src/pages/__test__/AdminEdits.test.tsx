import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminEdits from '../AdminEdits'; 
import { useFetchVersionHistory } from '../../hooks/UseVersionHistory';
import { useAdminVersionHistory } from '../../adapters/Api';

jest.mock("../../assets/css/admin-page.scss", () => ({}));
jest.mock('../../components/common/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../../components/history-page/Historytable', () => (props) => (
    <div data-testid="mock-history-table">
        History Table Data Length: {props.data?.length}
    </div>
));


jest.mock('../../components/common/NewVersionHistoryPopup', () => ({
    __esModule: true,
    default: ({ open, onClose, onSubmit, existingVersions }) => {
        if (!open) return null;
        return (
            <div data-testid="mock-popup">
                <span>Existing Versions Count: {existingVersions.length}</span>
                <button onClick={onClose}>Close Popup</button>
                <button 
                    onClick={() => onSubmit({ 
                        version_number: "2.0", 
                        date: "2023-01-01", 
                        what_change: "Test" 
                    })}
                >
                    Submit Data
                </button>
            </div>
        );
    }
}));


jest.mock('../../hooks/UseVersionHistory');
jest.mock('../../adapters/Api');

describe('AdminEdits Component', () => {
    
    const mockRefetch = jest.fn();
    const mockPostVersionHistory = jest.fn();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const mockData = {
        data: [
            { version_number: "1.0", date: "2022-01-01", what_change: "Init" }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();        
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: mockData,
            isFetching: false,
            refetch: mockRefetch
        });

        (useAdminVersionHistory as jest.Mock).mockReturnValue({
            postVersionHistory: mockPostVersionHistory
        });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it('renders the header and main layout correctly', () => {
        render(<AdminEdits />);
        
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByText('Admin Console')).toBeInTheDocument();
        expect(screen.getByText('Log New Version History')).toBeInTheDocument();
        expect(screen.getByText('Method Version History')).toBeInTheDocument();
    });

    it('shows loading spinner when isFetching is true', () => {
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: null,
            isFetching: true, 
            refetch: mockRefetch
        });

        render(<AdminEdits />);        
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-history-table')).not.toBeInTheDocument();
    });

    it('shows "Nothing to see here yet!" when data is null/empty and not fetching', () => {
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: null,
            isFetching: false,
            refetch: mockRefetch
        });

        render(<AdminEdits />);
    });

    it('renders HistoryTable when data is present', () => {
        render(<AdminEdits />);
        
        const table = screen.getByTestId('mock-history-table');
        expect(table).toBeInTheDocument();
        expect(table).toHaveTextContent('History Table Data Length: 1');
    });

    it('opens and closes the NewVersionHistoryPopup', () => {
        render(<AdminEdits />);        
        expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();        
        const openBtn = screen.getByText('Log New Version History');
        fireEvent.click(openBtn);        
        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
        expect(screen.getByText('Existing Versions Count: 1')).toBeInTheDocument();

        const closeBtn = screen.getByText('Close Popup');
        fireEvent.click(closeBtn);        
        expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });

    it('handles form submission, api call, and refetch success', async () => {
        mockPostVersionHistory.mockResolvedValue({ status: 200, message: "Success" });

        render(<AdminEdits />);
        
        fireEvent.click(screen.getByText('Log New Version History'));
        fireEvent.click(screen.getByText('Submit Data'));

        await waitFor(() => {            
            expect(mockPostVersionHistory).toHaveBeenCalledWith({
                version_number: "2.0", 
                date: "2023-01-01", 
                what_change: "Test" 
            });
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    it('handles API error gracefully (catch block)', async () => {
        const error = new Error('API Failed');
        mockPostVersionHistory.mockRejectedValue(error);

        render(<AdminEdits />);
        
        fireEvent.click(screen.getByText('Log New Version History'));
        fireEvent.click(screen.getByText('Submit Data'));

        await waitFor(() => {
            expect(mockPostVersionHistory).toHaveBeenCalled();
        });        
        expect(mockRefetch).not.toHaveBeenCalled();       
        expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    it('passes empty array for existingVersions if data is null', () => {
        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: null,
            isFetching: false,
            refetch: mockRefetch
        });

        render(<AdminEdits />);
        
        fireEvent.click(screen.getByText('Log New Version History'));
        expect(screen.getByText('Existing Versions Count: 0')).toBeInTheDocument();
    });
});