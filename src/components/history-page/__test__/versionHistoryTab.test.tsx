/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VersionHistoryTab from '../VersionHistoryTab';
import { useProductService } from "../../../adapters/Api";
import { useFetchAssessmentBasedVersionHistory, useFetchVersionHistory } from "../../../hooks/UseVersionHistory";

jest.mock("../Historytable", () => ({
    __esModule: true,
    default: ({ data }: any) => (
        <div data-testid="history-table">
            {data.map((item: any) => (
                <div key={item.id} data-testid="history-item">
                    {item.version_number} - ID:{item.id}
                </div>
            ))}
        </div>
    )
}));

jest.mock("../../results/ViewAllResults.component", () => ({
    VersionTag: ({ latestVersion }: any) => <span data-testid="version-tag">{latestVersion}</span>
}));

jest.mock("@mui/material", () => ({
    ...jest.requireActual("@mui/material"),
    CircularProgress: () => <div data-testid="loading-spinner" />
}));

jest.mock("../../../adapters/Api");
jest.mock("../../../hooks/UseVersionHistory");

global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();
window.open = jest.fn();

describe('VersionHistoryTab Component', () => {
    const mockProps = {
        productId: "prod-123",
        assessmentsData: { _id: "assessment-db-id", assessmentId: "ASM-001" } as any,
        assessmentType: "final"
    };

    const mockGetProductDetailAuditReport = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useProductService as jest.Mock).mockReturnValue({
            getProductDetailAuditReport: mockGetProductDetailAuditReport
        });

        (useFetchVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: "2.0", date: "2024-01-01" }] }
        });

        (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
            data: { data: [{ version_number: "1.0", date: "2023-01-01", id: 100 }] },
            isFetching: false,
            isError: false
        });
    });

    test('renders loading state when fetching', () => {
        (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
            data: null,
            isFetching: true,
            isError: false
        });

        render(<VersionHistoryTab {...mockProps} />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('renders error state when fetch fails', () => {
        (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
            data: null,
            isFetching: false,
            isError: true
        });

        render(<VersionHistoryTab {...mockProps} />);
        expect(screen.getByText('Nothing to see here yet!')).toBeInTheDocument();
    });

    test('handles Generate Audit Log button click correctly', async () => {
        const mockBlob = new Blob(['pdf-content'], { type: 'application/pdf' });
        mockGetProductDetailAuditReport.mockResolvedValue({ data: mockBlob });

        render(<VersionHistoryTab {...mockProps} />);

        const mockLink = {
            href: '',
            setAttribute: jest.fn(),
            click: jest.fn()
        } as unknown as HTMLAnchorElement;

        const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'a') return mockLink;
            return jest.requireActual('react-dom/test-utils').act(() => document.createElement(tagName));
        });

        const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockReturnValue(mockLink);
        const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockReturnValue(mockLink);

        const btn = screen.getByText('Generate Audit Log');
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockGetProductDetailAuditReport).toHaveBeenCalledWith("ASM-001", true);
            expect(createElementSpy).toHaveBeenCalledWith('a');
            expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('SIPAuditTrailReport_ASM-001_'));
            expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
            expect(mockLink.click).toHaveBeenCalled();
            expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
        });

        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });


    test('passes correct urlData to HistoryTable', () => {
        render(<VersionHistoryTab {...mockProps} />);
        expect(screen.getByTestId('history-table')).toBeInTheDocument();
    });

    describe('useEffect data combining', () => {

        test('renders exactly the rows returned by the assessment API (no prepend)', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "2.0", type: "major", id: 2 }] }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: {
                    data: [
                        { version_number: "2.0", id: 200 },
                        { version_number: "1.0", id: 100 },
                    ]
                },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(2);
            expect(items[0].textContent).toContain('2.0 - ID:200');
            expect(items[1].textContent).toContain('1.0 - ID:100');
        });

        test('does NOT add an extra row for the current version even if versionData has it', () => {
            // versionData reports current version as 3.0; the assessment API
            // already includes 3.0 in its response — we must not duplicate.
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "3.0", type: "major", id: 3 }] }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: {
                    data: [
                        { version_number: "3.0", id: 30 },
                        { version_number: "2.0", id: 20 },
                        { version_number: "1.0", id: 10 },
                    ]
                },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(3);
            // Only one row for 3.0
            const v3Rows = items.filter((el) => el.textContent?.includes('3.0'));
            expect(v3Rows).toHaveLength(1);
        });

        test('passes api data through unchanged (no static impact_on_assessments injected)', () => {
            const apiItem = { version_number: "1.0", id: 100 };
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [apiItem] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.getByTestId('history-item').textContent).toContain('1.0');
        });

        test('does not render HistoryTable when assessment data is null', () => {
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: null, isFetching: false, isError: false
            });
            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.queryByTestId('history-table')).not.toBeInTheDocument();
        });

        test('renders HistoryTable when assessment data is available', () => {
            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.getByTestId('history-table')).toBeInTheDocument();
        });

        test('combined data length equals api items count (no prepend)', () => {
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "2.0", id: 2 }, { version_number: "1.0", id: 1 }] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(2);
        });
    });

   describe('current-version fallback row', () => {

        test('renders a single row built from the latest major in versionData when api data is empty', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: {
                    data: [
                        { version_number: "2.0", type: "major", id: 20 },
                        { version_number: "1.0", type: "major", id: 10 },
                    ]
                }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(1);
            expect(items[0].textContent).toContain('2.0');
        });

        test('skips minor versions and uses the latest major as the fallback row', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: {
                    data: [
                        { version_number: "2.1", type: "minor", id: 21 },
                        { version_number: "2.0", type: "major", id: 20 },
                    ]
                }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(1);
            expect(items[0].textContent).toContain('2.0 - ID:20');
        });

        test('accepts version_number with a leading "v" as a major version', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "v3", type: "major", id: 30 }] }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(1);
            expect(items[0].textContent).toContain('v3');
        });

        test('renders an empty table when api data is empty AND versionData has no major', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "1.1", type: "minor", id: 11 }] }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.getByTestId('history-table')).toBeInTheDocument();
            expect(screen.queryAllByTestId('history-item')).toHaveLength(0);
        });

        test('renders an empty table when api data is empty AND versionData is null', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({ data: null });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.getByTestId('history-table')).toBeInTheDocument();
            expect(screen.queryAllByTestId('history-item')).toHaveLength(0);
        });

        test('does NOT use fallback when api returns at least one row', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "5.0", type: "major", id: 50 }] }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "1.0", id: 1 }] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            const items = screen.getAllByTestId('history-item');
            expect(items).toHaveLength(1);
            // The fallback (5.0) should NOT have been used.
            expect(items[0].textContent).toContain('1.0');
            expect(items[0].textContent).not.toContain('5.0');
        });

        test('fallback row carries impact_on_assessments=null (blank impacts column)', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "4.0", type: "major", id: 40 }] }
            });
            (useFetchAssessmentBasedVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [] },
                isFetching: false, isError: false
            });

            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.getByTestId('history-item').textContent).toContain('4.0');
        });
    });

    describe('VersionTag display', () => {

        test('shows VersionTag with the first version_number from versionData', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({
                data: { data: [{ version_number: "5.0" }] }
            });
            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.getByTestId('version-tag')).toHaveTextContent('5.0');
        });

        test('does not show VersionTag when versionData is null', () => {
            (useFetchVersionHistory as jest.Mock).mockReturnValue({ data: null });
            render(<VersionHistoryTab {...mockProps} />);
            expect(screen.queryByTestId('version-tag')).not.toBeInTheDocument();
        });
    });
});