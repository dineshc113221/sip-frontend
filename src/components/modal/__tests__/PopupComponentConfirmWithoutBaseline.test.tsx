
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationWithoutBaselinePopupBox from "../PopupComponentConfirmWithoutBaseline";

jest.mock("../../../assets/images/close_icon.svg", () => "close-icon.svg");
jest.mock("../../../assets/images/warningIcon.svg", () => "warning-icon.svg");

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onAddBaseline: jest.fn(),
  dialogTitle: "Confirmation Required",
  dialogContent: "Please add a baseline before proceeding.",
  userCRUDAccess_assessment: 1 as 0 | 1,
};

describe("ConfirmationWithoutBaselinePopupBox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dialog title and content", () => {
    render(<ConfirmationWithoutBaselinePopupBox {...defaultProps} />);

    expect(
      screen.getByText("Confirmation Required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please add a baseline before proceeding.")
    ).toBeInTheDocument();
  });

  test("renders warning icon", () => {
    render(<ConfirmationWithoutBaselinePopupBox {...defaultProps} />);

    const warningIcon = screen.getByAltText("warning");

    expect(warningIcon).toBeInTheDocument();
  });



  test("calls onClose when Cancel button is clicked", () => {
    render(<ConfirmationWithoutBaselinePopupBox {...defaultProps} />);

    const cancelButton = screen.getByTestId("cancel-button");

    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onAddBaseline when Add Baseline button is clicked", () => {
    render(<ConfirmationWithoutBaselinePopupBox {...defaultProps} />);

    const addBaselineButton =
      screen.getByTestId("add-baseline-button");

    fireEvent.click(addBaselineButton);

    expect(defaultProps.onAddBaseline).toHaveBeenCalledTimes(1);
  });


  test("disables buttons when userCRUDAccess_assessment is 0", () => {
    render(
      <ConfirmationWithoutBaselinePopupBox
        {...defaultProps}
        userCRUDAccess_assessment={0}
      />
    );

    expect(
      screen.getByTestId("cancel-button")
    ).toBeDisabled();

    expect(
      screen.getByTestId("add-baseline-button")
    ).toBeDisabled();
  });

  test("enables buttons when userCRUDAccess_assessment is 1", () => {
    render(
      <ConfirmationWithoutBaselinePopupBox
        {...defaultProps}
        userCRUDAccess_assessment={1}
      />
    );

    expect(
      screen.getByTestId("cancel-button")
    ).toBeEnabled();

    expect(
      screen.getByTestId("add-baseline-button")
    ).toBeEnabled();
  });

  test("does not render dialog content when open is false", () => {
    render(
      <ConfirmationWithoutBaselinePopupBox
        {...defaultProps}
        open={false}
      />
    );

    expect(
      screen.queryByText("Confirmation Required")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        "Please add a baseline before proceeding."
      )
    ).not.toBeInTheDocument();
  });
});