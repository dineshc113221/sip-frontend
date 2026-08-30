import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TimeoutPopupComponent from "../TimeoutPopup.component";

jest.mock("@mui/material", () => ({
  Dialog: ({ open, children }) => {
    return open ? (
      <div data-testid="dialog" role="dialog">
        {children}
      </div>
    ) : null;
  },
  DialogContent: ({  children }) => <div>{children}</div>,
}));

jest.mock("@mui/icons-material/Close", () => (props) => (
  <span data-testid="close-icon" {...props}>
    CloseIcon
  </span>
));

const mockPublish = jest.fn();



describe("TimeoutPopupComponent", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const renderComponent = (isPopupOpened = true, labels = {}) => {
    return render(
      <TimeoutPopupComponent
        isPopupOpened={isPopupOpened}
        handleCloseTimeout={jest.fn()}
        mfProps={{ publish: mockPublish }}
        labels={labels}
      />
    );
  };

  it("should render the popup when isPopupOpened is true", () => {
    renderComponent();
    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Session Expiry")).toBeInTheDocument();
  });

  it("should not render the popup when isPopupOpened is false", () => {
    renderComponent(false);
    const dialog = screen.queryByTestId("dialog");
    expect(dialog).not.toBeInTheDocument();
  });

  it("should display the countdown timer", () => {
    renderComponent();
    act(() => {
      jest.advanceTimersByTime(5000); // Advance by 5 seconds
    });
    expect(screen.getByText(/Time left:/)).toBeInTheDocument();
  });

 
  it("should call handleCloseTimeout when the Continue button is clicked", () => {
    const mockHandleClose = jest.fn();
    render(
      <TimeoutPopupComponent
        isPopupOpened={true}
        handleCloseTimeout={mockHandleClose}
        mfProps={{ publish: mockPublish }}
        labels={{ CONTINUE: "Continue" }}
      />
    );
    const continueButton = screen.getByText("Continue");
    fireEvent.click(continueButton);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("should call publish signout when Logout button is clicked", () => {
    renderComponent(true, { LOGOUT: "Logout" });
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(mockPublish).toHaveBeenCalledWith("core-header-ui-mf:signout");
  });
});
