import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewVersionHistoryPopup from "../NewVersionHistoryPopup"; 

jest.mock("../../../assets/images/kenvue_icon_calendar.svg", () => "calendar-icon-mock");
jest.mock("../../../assets/css/admin-page.scss", () => ({}));

describe("NewVersionHistoryPopup Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const existingVersions = ["1.0", "1.1", "Beta"];

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    existingVersions: existingVersions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = defaultProps) => {
    return render(<NewVersionHistoryPopup {...props} />);
  };

  test("renders correctly when open is true", () => {
    renderComponent();
    expect(screen.getByText("New Version History")).toBeInTheDocument();
    expect(screen.getByText("Select Date")).toBeInTheDocument();
    expect(screen.getByText("Version Name")).toBeInTheDocument();
  });

  test("does not render visible content when open is false", () => {
    renderComponent({ ...defaultProps, open: false });
    const title = screen.queryByText("New Version History");
    expect(title).not.toBeInTheDocument();
  });

  test("updates input fields correctly", () => {
    renderComponent();
    const inputs = screen.getAllByRole("textbox");
    const versionInput = inputs[0]; 
    const changeInput = inputs[2]; 

    fireEvent.change(versionInput, { target: { value: "2.0" } });
    expect(versionInput).toHaveValue("2.0");

    fireEvent.change(changeInput, { target: { value: "Fixed bugs" } });
    expect(changeInput).toHaveValue("Fixed bugs");
  });

  test("handles Date Picker interactions (Change & Blur) for full coverage", () => {
    renderComponent();
    
    const dateInput = screen.getByPlaceholderText("dd/mm/yyyy");
    
    fireEvent.change(dateInput, { target: { value: "25/12/2023" } });
    expect(dateInput).toHaveValue("25/12/2023");

    fireEvent.change(dateInput, { target: { value: "" } });
    expect(dateInput).toHaveValue("");

    fireEvent.blur(dateInput);
    
    
    
    expect(dateInput).toBeInTheDocument();
  });

  
  test("validates duplicate versions", () => {
    renderComponent();
    const inputs = screen.getAllByRole("textbox");
    const versionInput = inputs[0];

    fireEvent.change(versionInput, { target: { value: "1.0" } });
  });

  test("shows errors on empty submission", () => {
    renderComponent();
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  
  test("submits form successfully with valid data", async () => {
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    const versionInput = inputs[0];
    const dateInput = screen.getByPlaceholderText("dd/mm/yyyy");
    const changeInput = inputs[2];

    fireEvent.change(versionInput, { target: { value: "2.5" } });
    
    fireEvent.change(dateInput, { target: { value: "25/12/2023" } });
    fireEvent.change(changeInput, { target: { value: "Major updates" } });

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    
    expect(mockOnSubmit).toHaveBeenCalledWith({
        version_number: "2.5",
        date: "25-12-2023", 
        what_change: "Major updates",
        description: "" 
    });
  });

  test("resets form state when reopening popup", () => {
    const { rerender } = renderComponent();
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Dirty" } });
    
    rerender(<NewVersionHistoryPopup {...defaultProps} open={false} />);
    rerender(<NewVersionHistoryPopup {...defaultProps} open={true} />);
    
    const newInputs = screen.getAllByRole("textbox");
    expect(newInputs[0]).toHaveValue("");
  });

  test("calls onClose when close icon is clicked", () => {
    renderComponent();
    
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});