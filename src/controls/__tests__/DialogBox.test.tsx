
import { render, screen, fireEvent } from '@testing-library/react';
import DialogBox from '../DialogBox';

describe('DialogBox Component', () => {
    const defaultProps = {
        open: true,
        onClose: jest.fn(),
        onClick: jest.fn(),
        buttonOneText: 'Cancel',
        buttonTwoText: 'Delete',
        text: 'Are you sure you want to delete this item?',
        isDeleteButtonHide: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the dialog with correct text and buttons', () => {
        render(<DialogBox {...defaultProps} />);

        expect(screen.getByText('Warning')).toBeInTheDocument();
        expect(screen.getByText(defaultProps.text!)).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    it('should trigger onClose when Cancel button is clicked', () => {
        render(<DialogBox {...defaultProps} />);
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick when Delete button is clicked', () => {
        render(<DialogBox {...defaultProps} />);
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('should render with delete button disabled and opacity when isDeleteButtonHide is true', () => {
        render(<DialogBox {...defaultProps} isDeleteButtonHide={true} />);
        const deleteButton = screen.getByText('Delete');
        expect(deleteButton).toBeDisabled();
        expect(deleteButton).toHaveStyle('opacity: 0.5');
    });

    it('should not render when open is false', () => {
        const { queryByText } = render(<DialogBox {...defaultProps} open={false} />);
        expect(queryByText('Warning')).not.toBeInTheDocument();
    });

    it('should render custom button texts', () => {
        render(
            <DialogBox
                {...defaultProps}
                buttonOneText="No"
                buttonTwoText="Yes"
            />
        );
        expect(screen.getByText('No')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('should render empty text without crashing if no text is provided', () => {
        render(
            <DialogBox
                {...defaultProps}
                text={undefined}
            />
        );
        // There is no crash or throw, test passes by rendering default layout
    });
});