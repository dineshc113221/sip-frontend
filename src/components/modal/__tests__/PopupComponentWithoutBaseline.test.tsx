import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WithoutBaselinePopupBox from "../PopupComponentWithoutBaseline";

jest.mock("../../../assets/images/close_icon.svg", () => "close-icon.svg");

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSkipAssessment: jest.fn(),
  dialogTitle: "Without Baseline",
  dialogContent: "Test Dialog Content",
  loading: false,
  onJustificationEvent: jest.fn(),
  userCRUDAccess_assessment: 1 as 0 | 1,
  isChangeJustficationFlag: false,
  onChangeJustification: jest.fn(),
};

describe("WithoutBaselinePopupBox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dialog title and content", () => {
    render(<WithoutBaselinePopupBox {...defaultProps} />);

    expect(screen.getByText("Without Baseline")).toBeInTheDocument();
    expect(screen.getByText("Test Dialog Content")).toBeInTheDocument();
  });

  test("save button is disabled initially", () => {
    render(<WithoutBaselinePopupBox {...defaultProps} />);

    const saveButton = screen.getByRole("button", {
      name: /save/i,
    });

    expect(saveButton).toBeDisabled();
  });

  test("calls onJustificationEvent when option selected", async () => {
    render(<WithoutBaselinePopupBox {...defaultProps} />);

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);

    const option = await screen.findByText(
      "Early-stage innovation: Baseline assessment not applicable at this stage"
    );

    fireEvent.click(option);

    expect(defaultProps.onJustificationEvent).toHaveBeenCalledWith(
      "Early-stage innovation: Baseline assessment not applicable at this stage"
    );
  });

  test("enables save button after selecting justification", async () => {
    render(<WithoutBaselinePopupBox {...defaultProps} />);

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);

    const option = await screen.findByText(
      "Early-stage innovation: Baseline assessment not applicable at this stage"
    );

    fireEvent.click(option);

    const saveButton = screen.getByRole("button", {
      name: /save/i,
    });

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });
  });

  test("shows informational message after justification selection", async () => {
    render(<WithoutBaselinePopupBox {...defaultProps} />);

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);

    const option = await screen.findByText(
      "Early-stage innovation: Baseline assessment not applicable at this stage"
    );

    fireEvent.click(option);

    expect(
      screen.getByText(
        "This project has been designated as a non-comparative assessment."
      )
    ).toBeInTheDocument();
  });



  test("calls onSkipAssessment when save clicked and change flag is false", async () => {
    render(<WithoutBaselinePopupBox {...defaultProps} />);

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);

    const option = await screen.findByText(
      "New consumer benefit: No existing product reflects this consumer benefit"
    );

    fireEvent.click(option);

    const saveButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.click(saveButton);

    expect(defaultProps.onSkipAssessment).toHaveBeenCalledTimes(1);
  });

  test("calls onChangeJustification when change flag is true", async () => {
    render(
      <WithoutBaselinePopupBox
        {...defaultProps}
        isChangeJustficationFlag={true}
      />
    );

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);

    const option = await screen.findByText(
      "Data limitation: Baseline identified, but product data is unavailable in Kenvue systems"
    );

    fireEvent.click(option);

    const saveButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.click(saveButton);

    expect(defaultProps.onChangeJustification).toHaveBeenCalledTimes(1);
  });

  test("save button is disabled when user has no CRUD access", async () => {
    render(
      <WithoutBaselinePopupBox
        {...defaultProps}
        userCRUDAccess_assessment={0}
      />
    );

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);

    const option = await screen.findByText(
      "Early-stage innovation: Baseline assessment not applicable at this stage"
    );

    fireEvent.click(option);

    const saveButton = screen.getByRole("button", {
      name: /save/i,
    });

    expect(saveButton).toBeDisabled();
  });

  test("does not render dialog when open is false", () => {
    render(
      <WithoutBaselinePopupBox
        {...defaultProps}
        open={false}
      />
    );

    expect(screen.queryByText("Without Baseline")).not.toBeInTheDocument();
  });
});
