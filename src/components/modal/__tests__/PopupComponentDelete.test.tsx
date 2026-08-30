import { render, screen, fireEvent } from '@testing-library/react';
import DeletePopupBox from "../PopupComponentDelete";

jest.mock("react-ga4", () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

describe('DeletePopupBox', () => {
  const onCloseMock = jest.fn();
  const onDeleteMock = jest.fn();

  const defaultProps = {
    open: true,
    onClose: onCloseMock,
    onDelete: onDeleteMock,
    dialogTitle: 'Delete Item',
    dialogContent: 'Are you sure you want to delete this item?',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders DeletePopupBox with title and content', () => {
    render(<DeletePopupBox {...defaultProps} />);
    
    // Check if title and content are rendered
    expect(screen.getByText(defaultProps.dialogTitle)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.dialogContent)).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    render(<DeletePopupBox {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Check if onClose was called once
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete when Delete button is clicked', () => {
    render(<DeletePopupBox {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Check if onDelete was called once
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  test('does not render dialog when open is false', () => {
    render(<DeletePopupBox {...defaultProps} open={false} />);

    // Check if dialog content is not in the document
    expect(screen.queryByText(defaultProps.dialogTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultProps.dialogContent)).not.toBeInTheDocument();
  });
});
