import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ResultSection1 from "../ResultSection1Component";
import { CURRENT_SECTION } from "../../../constants/String.constants";

const queryClient = new QueryClient({});

jest.mock("react-ga4", () => ({
  ReactGA4: {
    initialize: jest.fn(),
    event: jest.fn(),
  },
}));

describe("ResultSection1", () => {
  const renderComponent = (percentage: number) =>
    render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <ResultSection1
          sectionName={CURRENT_SECTION.TOTAL_PRODUCT}
          handleSectionChange={jest.fn()}
          title={"Total Product"}
          percent={{
            heading: "test",
            percentage,
            myproduct: 20,
            baseline: 20,
          }}
          indexSection1="1"
          currentTab={"TOTAL_PRODUCT"}
        />
      </QueryClientProvider>
    );

  it("should render the component with positive percentage", async () => {
    await act(async () => {
      renderComponent(20);
    });

    // should have + sign
    expect(screen.getByText("+20%")).toBeInTheDocument();

  });

  it("should render the component with negative percentage", async () => {
    await act(async () => {
      renderComponent(-15);
    });

    // should NOT have + sign
    expect(screen.getByText("-15%")).toBeInTheDocument();

  });

  it("should render the component with zero percentage", async () => {
    await act(async () => {
      renderComponent(0);
    });

    // formatted as +0%
    expect(screen.getByText("+0%")).toBeInTheDocument();

    // arrow should not be rendered
    const arrow = screen.queryByAltText("arrow");
    expect(arrow).not.toBeInTheDocument();
  });

  it("should call handleSectionChange when card is clicked", async () => {
    const handleSectionChange = jest.fn();
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultSection1
            sectionName={CURRENT_SECTION.TOTAL_PRODUCT}
            handleSectionChange={handleSectionChange}
            title={"Total Product"}
            percent={{
              heading: "test",
              percentage: 10,
              myproduct: 10,
              baseline: 10,
            }}
            indexSection1="1"
            currentTab={"TOTAL_PRODUCT"}
          />
        </QueryClientProvider>
      );
    });

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(handleSectionChange).toHaveBeenCalledWith(CURRENT_SECTION.TOTAL_PRODUCT);
  });
});
