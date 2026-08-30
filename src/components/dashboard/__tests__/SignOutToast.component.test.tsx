import { render, screen, fireEvent } from "@testing-library/react";
import { ToastMessage } from "../SignOutToast.component";

jest.mock("@mui/icons-material/Close", () => {
  return jest.fn((props) => <div data-testid="close-icon" onClick={props.onClick} />);
});

describe("ToastMessage Component", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the ToastMessage component with content", () => {
    render(
      <ToastMessage
        content="Are you sure you want to sign out?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Confirm Sign out")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to sign out?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  it("should call onCancel when the CloseIcon is clicked", () => {
    render(
      <ToastMessage
        content="Are you sure you want to sign out?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const closeIcon = screen.getByTestId("close-icon");
    fireEvent.click(closeIcon);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when the Cancel button is clicked", () => {
    render(
      <ToastMessage
        content="Are you sure you want to sign out?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when the Continue button is clicked", () => {
    render(
      <ToastMessage
        content="Are you sure you want to sign out?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const continueButton = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(continueButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should apply proper styles and classes", () => {
    render(
      <ToastMessage
        content="Are you sure you want to sign out?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const toastOverlay = screen.getByText("Confirm Sign out").closest(".toast-overlay");
    expect(toastOverlay).toBeInTheDocument();

    // Use `getComputedStyle` to check inline styles
    const computedStyle = getComputedStyle(toastOverlay as Element);
    expect(computedStyle.zIndex).toBe("");

    const toastButtons = screen.getByRole("button", { name: "Cancel" }).closest(".toast-buttons");
    expect(toastButtons).toBeInTheDocument();
  });
});
