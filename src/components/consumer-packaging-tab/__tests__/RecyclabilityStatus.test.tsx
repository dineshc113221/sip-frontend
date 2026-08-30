import { render, screen } from "@testing-library/react";
import RecyclabilityStatus from "./../RecyclabilityStatus";
import na from "../../../assets/images/Recyclable_Icon.svg";
import notready from "../../../assets/images/recycle_not_ready.svg";
import ready from "../../../assets/images/recycle_ready.svg";

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
 
describe("RecyclabilityStatus Component", () => {
  const renderComponent = (status: string, packagingType: "Primary" | "Secondary") => {
    render(<RecyclabilityStatus status={status} packagingType={packagingType} />);
  };
 
  it("renders the correct image and labels for status 'ready' and Primary packaging", () => {
    renderComponent("Recycle Ready", "Primary");
 
    expect(screen.getByAltText("Recyclability Status Recycle Ready")).toHaveAttribute("src", ready);
    expect(screen.getByText("Primary Packaging")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("packaging-recyclable-ready-not");
  });
 
  it("renders the correct image and labels for status 'notready' and Secondary packaging", () => {
    renderComponent("Non Recycle Ready", "Secondary");
 
    expect(screen.getByAltText("Recyclability Status Non Recycle Ready")).toHaveAttribute("src", notready);
    expect(screen.getByText("Secondary Packaging")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("packaging-recyclable-ready-not");
  });
 
  it("renders the correct image and labels for status 'na' and Primary packaging", () => {
    renderComponent("N/A", "Primary");
 
    expect(screen.getByAltText("Recyclability Status N/A")).toHaveAttribute("src", na);
    expect(screen.getByText("Primary Packaging")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("packaging-RecyclableIcon");
  });
 
  it("applies the correct margin style for Primary packaging type", () => {
    const { container } = render(<RecyclabilityStatus status="ready" packagingType="Primary" />);
    expect(container.firstChild).toHaveStyle("margin-right: 24px");
 
    render(<RecyclabilityStatus status="ready" packagingType="Secondary" />);
    expect(screen.getByText("Secondary Packaging").closest("div")).not.toHaveStyle("margin-right: 24px");
  });
});

