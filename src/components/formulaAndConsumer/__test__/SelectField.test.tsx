import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectField from "../SelectField";

// Mock truncate helper
jest.mock("../../../helper/GenericFunctions", () => ({
  truncate: jest.fn((value) => value),
}));

describe("SelectField Component", () => {
  const options = [
    "Option One",
    "Option Two",
    "Long-Option Testing",
  ];

  const defaultProps = {
    value: "Option One",
    onChange: jest.fn(),
    options,
    truncateby: 20,
    showSearchBar: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders selected value", () => {
    render(<SelectField {...defaultProps} />);

    expect(screen.getByText("Option One")).toBeInTheDocument();
  });

  it("shows empty value when selected value is invalid", () => {
    render(
      <SelectField
        {...defaultProps}
        value="Invalid Option"
      />
    );

    expect(
      screen.queryByText("Invalid Option")
    ).not.toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    render(<SelectField {...defaultProps} />);

    fireEvent.mouseDown(screen.getByRole("combobox"));

    expect(
      await screen.findByPlaceholderText("Search")
    ).toBeInTheDocument();
  });

 

  it("shows no matching results message", async () => {
    render(<SelectField {...defaultProps} />);

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const searchInput =
      await screen.findByPlaceholderText("Search");

    fireEvent.change(searchInput, {
      target: { value: "xyz123" },
    });

    
    expect(
      screen.getByText("No matching results found")
    ).toBeInTheDocument();
  });

  it("calls onChange when option is selected", async () => {
    const onChange = jest.fn();

    render(
      <SelectField
        {...defaultProps}
        onChange={onChange}
      />
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const option =
      await screen.findByText("Option Two");

    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("renders disabled state", () => {
    render(
      <SelectField
        {...defaultProps}
        disabled
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("renders breakBySpaceOrHyphen value correctly", () => {
    render(
      <SelectField
        {...defaultProps}
        value="Long-Option Testing"
        breakBySpaceOrHyphen
      />
    );

    expect(
      screen.getByText(/Long-/)
    ).toBeInTheDocument();
  });

  it("focuses search input when dropdown opens", async () => {
    render(<SelectField {...defaultProps} />);

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const input =
      await screen.findByPlaceholderText("Search");

    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it("does not render search box when showSearchBar is false", () => {
    render(
      <SelectField
        {...defaultProps}
        showSearchBar={false}
      />
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));

    expect(
      screen.queryByPlaceholderText("Search")
    ).not.toBeInTheDocument();
  });
});