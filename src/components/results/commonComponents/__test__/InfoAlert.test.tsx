import { render, screen, fireEvent } from "@testing-library/react";
import InfoAlert from "../InfoAlert";

describe("InfoAlert", () => {
  it("should render the message", () => {
    render(<InfoAlert message="Test alert message" />);

    expect(
      screen.getByText("Test alert message")
    ).toBeInTheDocument();
  });

  it("should render info icon", () => {
    render(<InfoAlert message="Test alert message" />);

    expect(screen.getByAltText("info")).toBeInTheDocument();
  });

  it("should not render close button when onClose is not provided", () => {
    render(<InfoAlert message="Test alert message" />);

    expect(
      screen.queryByRole("button", {
        name: /close alert/i,
      })
    ).not.toBeInTheDocument();
  });

  it("should render close button when onClose prop is provided", () => {
    render(
      <InfoAlert
        message="Test alert message"
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /close alert/i,
      })
    ).toBeInTheDocument();
  });

  it("should hide alert when close button is clicked", () => {
    render(
      <InfoAlert
        message="Test alert message"
        onClose={jest.fn()}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /close alert/i,
      })
    );

    expect(
      screen.queryByText("Test alert message")
    ).not.toBeInTheDocument();
  });

  it("should remove the alert container after close button click", () => {
    const { container } = render(
      <InfoAlert
        message="Test alert message"
        onClose={jest.fn()}
      />
    );

    expect(
      container.querySelector(".info-alert")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /close alert/i,
      })
    );

    expect(
      container.querySelector(".info-alert")
    ).not.toBeInTheDocument();
  });

  it("should render close icon", () => {
    render(
      <InfoAlert
        message="Test alert message"
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByAltText("CloseIcon")
    ).toBeInTheDocument();
  });
});