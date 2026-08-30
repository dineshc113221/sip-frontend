import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoodJobAlert from "../GoodJobAlert";
jest.mock("../../../../assets/images/green-tick.svg", () => "mock-green-tick.svg");

describe("GoodJobAlert", () => {
  it("should render the component with the given message", () => {
    const testMessage = "You successfully completed the task!";
    
    render(<GoodJobAlert message={testMessage} />);
    
    // Check if the container renders
    const alertContainer = screen.getByRole("alert");
    expect(alertContainer).toBeInTheDocument();
    
    // Check for the headline text
    const headline = screen.getByText("Good job!");
    expect(headline).toBeInTheDocument();
    
    // Check for the body message
    const bodyMessage = screen.getByText(testMessage);
    expect(bodyMessage).toBeInTheDocument();
    
    // Check if the green tick image is rendered
    const greenTickImage = screen.getByAltText("Green Tick");
    expect(greenTickImage).toBeInTheDocument();
    expect(greenTickImage).toHaveAttribute("src", "mock-green-tick.svg");
  }, 8000);

  it("should render correctly without crashing when no message is provided", () => {
    render(<GoodJobAlert message="" />);
    
    // Check for the default structure
    const alertContainer = screen.getByRole("alert");
    expect(alertContainer).toBeInTheDocument();

    // Check for the headline
    const headline = screen.getByText("Good job!");
    expect(headline).toBeInTheDocument();

    // Ensure no text in the body if message is empty
    expect(screen.queryByText(" ")).not.toBeInTheDocument();
  }, 8000);
});
