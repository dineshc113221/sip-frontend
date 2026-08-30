import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LogsReport from '../LogsReport';
import { useParams } from 'react-router-dom';
import {
    useGetAssessmentDetailBySipID,
    useGetProductDetailLogReport,
    useGetLogsInputsDetails
} from '../../hooks/UseGetProductDetails';
import JsonViewModal from '../../models/JsonViewModal';

// Mock hooks and dependencies
jest.mock('react-router-dom', () => ({
    useParams: jest.fn()
}));

jest.mock('../../hooks/UseGetProductDetails', () => ({
    useGetAssessmentDetailBySipID: jest.fn(),
    useGetProductDetailLogReport: jest.fn(),
    useGetLogsInputsDetails: jest.fn()
}));

jest.mock('../../models/JsonViewModal', () => jest.fn(() => <div data-testid="json-modal" />));

describe('LogsReport', () => {
    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useParams as jest.Mock).mockReturnValue({ id: '12345' });

        (useGetAssessmentDetailBySipID as jest.Mock).mockReturnValue({
            data: [
                {
                    assessmentId: 'A1',
                    productId: 'P1',
                    assessmentType: 'experimental'
                }
            ],
            refetch: mockRefetch
        });

        (useGetProductDetailLogReport as jest.Mock).mockReturnValue({
            data: [
                {
                    _id: 'log123',
                    executionARN: 'arn:aws:states:xyz',
                    output: { type: 'Error', message: 'Something went wrong' },
                    createdAt: '2024-04-07T12:00:00Z'
                }
            ]
        });

        (useGetLogsInputsDetails as jest.Mock).mockReturnValue({
            data: {
                input: { key: 'value' }
            }
        });
    });

    it('renders LogsReport and shows logs', async () => {
        render(<LogsReport />);

        expect(await screen.findByText(/Logs Report/i)).toBeInTheDocument();
        expect(await screen.findByText(/Product ID/i)).toBeInTheDocument();
        expect(await screen.findByText('P1')).toBeInTheDocument();
        expect(await screen.findByText('A1')).toBeInTheDocument();
        expect(await screen.findByText('experimental')).toBeInTheDocument();
        expect(await screen.findByText(/Error Details/i)).toBeInTheDocument();
        expect(await screen.findByText('log123')).toBeInTheDocument();
        expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
        expect(await screen.findByText('View')).toBeInTheDocument();
    });

    it('opens modal and copies JSON input', async () => {
        const mockClipboardWrite = jest.fn();
        Object.assign(navigator, {
            clipboard: {
                writeText: mockClipboardWrite
            }
        });

        render(<LogsReport />);

        const viewButton = await screen.findByText('View');
        fireEvent.click(viewButton);

        await waitFor(() => {
            expect(screen.getByTestId('json-modal')).toBeInTheDocument();
        });

        // Simulate the copy callback
        const onCopy = (JsonViewModal as jest.Mock).mock.calls[0][0].onCopy;
        onCopy();

        expect(mockClipboardWrite).toHaveBeenCalledWith(
            JSON.stringify({ key: 'value' }, null, 2)
        );
    });

    it('renders no logs message when logsData is empty', () => {
        (useGetProductDetailLogReport as jest.Mock).mockReturnValue({ data: [] });

        render(<LogsReport />);
        expect(screen.getByText(/No logs found/i)).toBeInTheDocument();
    });

    it('handles null sipData response gracefully', () => {
        (useGetAssessmentDetailBySipID as jest.Mock).mockReturnValue({
            data: null,
            refetch: mockRefetch
        });

        render(<LogsReport />);
        expect(screen.getByText(/Logs Report/i)).toBeInTheDocument();
    });
});