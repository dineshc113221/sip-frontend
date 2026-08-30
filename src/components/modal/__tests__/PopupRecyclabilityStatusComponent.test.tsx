import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecyclabilityStatusPopup from "../PopupRecyclabilityStatusComponent";
import { Recyclability } from "../../../structures/packaging";
import recycle_not_ready from "../../../assets/images/recycle_not_ready.svg";
import recycle_ready from "../../../assets/images/recycle_ready.svg";

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

// Mock props to test RecyclabilityStatusPopup component
const mockProps: Recyclability = {
  open: true,
  componentType: "Bottle",
  popupPage: "Recyclability",
  onClose: jest.fn(),
  recordStatus: "Not Recycle Ready",
  sendToParentComponent: jest.fn(),
  assessmentId: "test-assessment-id",
  handleChange: jest.fn(),
  index: 0,
  status: "Recycle Ready",
};

describe("RecyclabilityStatusPopup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

//   test("renders dialog with correct title and content when open", () => {
//     render(<RecyclabilityStatusPopup {...mockProps} />);
    
//     expect(screen.getByText("Recyclability Status")).toBeInTheDocument();
//     expect(screen.getByText(/kenvue's Healthy Lives Mission/i)).toBeInTheDocument();
//   });

  test("displays correct recyclability status image based on editRecycleStatus", () => {
    render(<RecyclabilityStatusPopup {...mockProps} status="Recycle Ready" />);
    
    // Check the image for "Recycle Ready" status
    const recycleReadyImg = screen.getByRole("img");
    expect(recycleReadyImg).toHaveAttribute("src", recycle_ready);

    // Update props to test other statuses
    render(<RecyclabilityStatusPopup {...mockProps} status="Not Recycle Ready" />);
    const notRecycleReadyImg = screen.getByRole("img");
    expect(notRecycleReadyImg).toHaveAttribute("src", recycle_not_ready);
  });

  test("changes recyclability status on selecting a different option", () => {
    render(<RecyclabilityStatusPopup {...mockProps} status="Select" />);

    const select = screen.getByDisplayValue("Select");
    fireEvent.change(select, { target: { value: "Recycle Ready" } });

    expect(screen.getByDisplayValue("Recycle Ready")).toBeInTheDocument();
  });

  test("calls sendToParentComponent and onClose when Save button is clicked", () => {
    render(<RecyclabilityStatusPopup {...mockProps} />);

    // Simulate clicking the Save button
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(mockProps.sendToParentComponent).toHaveBeenCalledWith("Recycle Ready");
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test("closes dialog when Close button is clicked", () => {
    render(<RecyclabilityStatusPopup {...mockProps} />);

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

//   test("does not display Save button if status is set to Select", () => {
//     render(<RecyclabilityStatusPopup {...mockProps} status="Select" />);

//     const saveButton = screen.queryByText("Save");
//     expect(saveButton).toHaveStyle("background-color: grey");
//     expect(saveButton).not.toBeEnabled();
//   });
});
