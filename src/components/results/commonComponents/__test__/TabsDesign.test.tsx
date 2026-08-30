import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabsDesign, { TabValueRow } from "../TabsDesign";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import warning_alert_icon from "../../../../assets/images/alert_warning_icon.svg";
import arrow_full_small_up_green from "../../../../assets/images/arrow_full_small_up_green.svg";
import arrow_full_small_down_red from "../../../../assets/images/arrow_full_small_down_red.svg";
import { ResultDataMock } from "../../../../mocks/ResultData.mock";
describe("TabsDesign Component", () => {
  const mockHandleTabClick = jest.fn();
  const mockSetCurrentSection = jest.fn();
  

  const defaultProps = {
    tab: {
      heading: "Renewable Origin Bonus",
      percentage: "15",
      baseline: "90",
      myproduct: "85",
    },
    index: 0,
    selectedTab: 0,
    total_score: "green",
    handleTabClick: mockHandleTabClick,
    setCurrentSection: mockSetCurrentSection,
    };
    
 
const resultDataValue = ResultDataMock;
  const renderComponent = (props = {}) =>
    render(
      <ResultDataContext.Provider value={resultDataValue}>
        <TabsDesign {...defaultProps} {...props} />
      </ResultDataContext.Provider>
    );

  // This will clean up the DOM after each test
  afterEach(() => {
    cleanup(); // Cleans up the rendered components from the DOM after each test
    jest.clearAllMocks(); // Clears any mock function calls
  });

  it("renders the component with the correct heading and details", () => {
    renderComponent();
    expect(screen.getByText("Renewable Origin Bonus")).toBeInTheDocument();
    expect(screen.getByText("+15%")).toBeInTheDocument();
    expect(screen.getByAltText("Arrow")).toHaveAttribute("src", arrow_full_small_up_green);
  });

  it("calls handleTabClick and setCurrentSection on card click", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /See Details/i }));
    expect(mockHandleTabClick).toHaveBeenCalledWith(0);
    expect(mockSetCurrentSection).toHaveBeenCalledWith("Renewable Origin Bonus");
  });

 

  it("handles percentage edge cases", () => {
    renderComponent({
      tab: { ...defaultProps.tab, percentage: "-5" },
    });
    expect(screen.getByText("-5%")).toBeInTheDocument();
    expect(screen.getByAltText("Arrow")).toHaveAttribute("src", arrow_full_small_down_red);
  });

  it("handles Total Score green case", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Total Score Green", percentage: "10" },
      total_score: "green",
    });
    expect(screen.getByText("Total Score Green")).toBeInTheDocument();
    expect(screen.getByText("+10")).toBeInTheDocument();
  });

  

  it("displays a warning icon only when regression is true and Renewable Origin Bonus is the heading", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Renewable Origin Bonus" },
    });
    const warningIcon = screen.queryByAltText("warning_icon");
    if (resultDataValue.greenChemistryData.renewableOriginBonus.regression) {
      expect(warningIcon).toBeInTheDocument();
      expect(warningIcon).toHaveAttribute("src", warning_alert_icon);
    } else {
      expect(warningIcon).not.toBeInTheDocument();
    }
  });
  
  
  it("displays formatted values and arrows correctly for GAIA Score with a positive percentage", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "GAIA Score", percentage: "7" },
    });
    expect(screen.getByText("+7")).toBeInTheDocument();
    expect(screen.getByAltText("Arrow")).toHaveAttribute("src", arrow_full_small_up_green);
  });
  
  it("renders the baseline and my product values correctly for non-green total score", () => {
    renderComponent();
    expect(screen.getByText("Baseline Product")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("My Product")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });
  
  
  
  it("does not render product info for Total Score heading when not green", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Total Score" },
      total_score: "red",
    });
    expect(screen.queryByText("Baseline Product")).not.toBeInTheDocument();
    expect(screen.queryByText("My Product")).not.toBeInTheDocument();
  });
  

  
  
  it("handles a negative percentage for Recycle Ready", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Recycle Ready", percentage: "-10" },
    });
    expect(screen.getByText("-10%")).toBeInTheDocument();
    expect(screen.getByAltText("Arrow")).toHaveAttribute("src", arrow_full_small_down_red);
  });
  
  
  it("applies the correct styles for selected tabs", () => {
    renderComponent({ selectedTab: 0 });
    const card = screen.getByText("Renewable Origin Bonus").closest(".tab-card");
    expect(card).toHaveClass("selected");
  });
  
  it("renders the correct heading for Total Score Green", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Total Score" },
      total_score: "green",
    });
    expect(screen.getByText("Total Score")).toBeInTheDocument();
  });

  it("renders +0% when percentage is 0", () => {
    renderComponent({
      tab: { ...defaultProps.tab, percentage: "0" },
    });
    expect(screen.getByText("+0%")).toBeInTheDocument();
  });

  it("renders +0 when percentage is 0 for GAIA Score", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "GAIA Score", percentage: "0" },
    });
    expect(screen.getByText("+0")).toBeInTheDocument();
  });

  it("renders +0% when percentage is 0 for Recycle Ready", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Recycle Ready", percentage: "0" },
    });
    expect(screen.getByText("+0%")).toBeInTheDocument();
  });

  it("renders +0% when percentage is 0 for Material Efficiency", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Material Efficiency", percentage: "0" },
    });
    expect(screen.getByText("+0%")).toBeInTheDocument();
  });

  it("renders +0 when percentage is 0 for Watch List Score", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Watch List Score", percentage: "0" },
    });
    expect(screen.getByText("+0")).toBeInTheDocument();
  });

  it("renders 'Fail' for Watch List Score when percentage is 'Fail'", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Watch List Score", percentage: "Fail" },
    });
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("renders the correct unit for Material Efficiency", () => {
    renderComponent({
      tab: { ...defaultProps.tab, heading: "Material Efficiency", baseline: "50", myproduct: "45" },
    });
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getAllByText("g per dose").length).toBe(2);
  });

   it("renders the assessment report layout with correct styles when assesmentReport prop is true", () => {
    const { rerender } = render(
      <TabValueRow
        percentage="15"
        heading="Renewable Origin Bonus"
        total_score="green"
        assesmentReport={true}
      />
    );

    const valueText = screen.getByText("+15%");
    expect(valueText).toBeInTheDocument();
    rerender(
      <TabValueRow
        percentage="0"
        heading="Renewable Origin Bonus"
        total_score="green"
        assesmentReport={true}
      />
    );

    const zeroValueText = screen.getByText("+0%");
    expect(zeroValueText).toBeInTheDocument();
  });
  
});
