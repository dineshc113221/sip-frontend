// WarningPopup.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import WarningPopup  from '../WarningPopup';

describe('WarningPopup', () => {
    const mockHandleExit = jest.fn();
    const mockHandleReview = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with all elements', () => {
        render(<WarningPopup handleExit={mockHandleExit} handleReview={mockHandleReview} />);

        // Check for warning icon
        const warningIcon = screen.getByAltText('Warning');
        expect(warningIcon).toBeInTheDocument();

        // Check title
        expect(screen.getByText('Warning')).toBeInTheDocument();
        expect(screen.getByText('Warning')).toHaveStyle('font-size: 34.84px');

        // Check message content
        expect(screen.getByText(/You’ve made changes, but haven’t recalculated your assessment./i)).toBeInTheDocument();
        expect(screen.getByText(/Return to your assessment to recalculate./i)).toBeInTheDocument();

        // Check buttons
        expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /review and recalculate/i })).toBeInTheDocument();
    });

    it('calls handleExit when Exit button is clicked', () => {
        render(<WarningPopup handleExit={mockHandleExit} handleReview={mockHandleReview} />);

        const exitButton = screen.getByRole('button', { name: /exit/i });
        fireEvent.click(exitButton);

        expect(mockHandleExit).toHaveBeenCalledTimes(1);
    });

    it('calls handleReview when Review button is clicked', () => {
        render(<WarningPopup handleExit={mockHandleExit} handleReview={mockHandleReview} />);

        const reviewButton = screen.getByRole('button', { name: /review and recalculate/i });
        fireEvent.click(reviewButton);

        expect(mockHandleReview).toHaveBeenCalledTimes(1);
    });

    it('has correct styling for elements', () => {
        render(<WarningPopup handleExit={mockHandleExit} handleReview={mockHandleReview} />);

        // Check image dimensions
        const warningIcon = screen.getByAltText('Warning');
        expect(warningIcon).toHaveStyle('width: 36px');
        expect(warningIcon).toHaveStyle('height: 36px');

        // Check button dimensions
        const exitButton = screen.getByRole('button', { name: /exit/i });
        expect(exitButton).toHaveStyle('width: 80px');
        expect(exitButton).toHaveStyle('height: 56px');

        const reviewButton = screen.getByRole('button', { name: /review and recalculate/i });
        expect(reviewButton).toHaveStyle('width: 237px');
        expect(reviewButton).toHaveStyle('height: 56px');
    });
});