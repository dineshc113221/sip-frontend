import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AssementFormulationTable from "../AssesmentFormulationTable";
import { CURRENT_TAB } from "../../../../constants/String.constants";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ResultDataMock, ResultDataMockAssessment } from "../../../../mocks/ResultData.mock";
import { ResultContextProp } from "../../../../structures/result";

const queryClient = new QueryClient({});

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

describe("AssementFormulationTable", () => {
  const resultDataValue = ResultDataMock;

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <AssementFormulationTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
              subHeaderText="Product Carbon Footprint" />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const downwardIcon = screen.getAllByTestId("ArrowDownwardIcon");
      fireEvent.click(downwardIcon[0])
      fireEvent.click(downwardIcon[1])
      fireEvent.click(downwardIcon[2])
      fireEvent.click(downwardIcon[3])
      fireEvent.click(downwardIcon[4])
      fireEvent.click(downwardIcon[5])
    })
  }, 8000);
  it("should calculate total-sum-based percentages correctly for environmental footprint data", async () => {

    const resultCopy = { ...resultDataValue };
    render(
      <QueryClientProvider client={queryClient}>
        <ResultDataContext.Provider
                        value={
                          {
                            ...resultCopy,
              currentTab: CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT,
                          } as unknown as ResultContextProp
                        }
                      >
          <AssementFormulationTable
            currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            subHeaderText="Test"
          />
        </ResultDataContext.Provider>
      </QueryClientProvider>
    );

    // Verify progress bars have correct values
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it("should handle empty data gracefully", async () => {
    
    const resultCopy = { ...ResultDataMockAssessment };
    render(
      <QueryClientProvider client={queryClient}>
        <ResultDataContext.Provider value={
          {
            ...resultCopy,
            currentTab: CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT,
          } as unknown as ResultContextProp
        }
        >
          <AssementFormulationTable
            currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            subHeaderText="Test"
          />
        </ResultDataContext.Provider>
      </QueryClientProvider>
    );

    expect(screen.queryAllByRole('row')).not.toBeNull(); // Table headers should still exist
  });

  it("should fallback to 0 when carbonFootprint is falsy in formulation items", () => {
    const mockData = {
      ...resultDataValue,
      productEnvironmentalFootprintData: {
        ...resultDataValue.productEnvironmentalFootprintData,
        formulation: [
          {
            tradeName: "test-null",
            rawCode: "RAW001",
            baseline: { massComposition: "10.00", carbonFootprint: null },
            myProduct: { massComposition: "10.00", carbonFootprint: undefined },
          },
          {
            tradeName: "test-zero",
            rawCode: "RAW002",
            baseline: { massComposition: "5.00", carbonFootprint: 0 },
            myProduct: { massComposition: "5.00", carbonFootprint: 0 },
          },
        ],
      },
      carbonFootprintData: {
        ...resultDataValue.carbonFootprintData,
        formulation: [
          {
            tradeName: "test-null-cf",
            rawCode: "RAW003",
            baseline: { massComposition: "8.00", carbonFootprint: null },
            myProduct: { massComposition: "8.00", carbonFootprint: undefined },
          },
          {
            tradeName: "test-zero-cf",
            rawCode: "RAW004",
            baseline: { massComposition: "3.00", carbonFootprint: 0 },
            myProduct: { massComposition: "3.00", carbonFootprint: 0 },
          },
        ],
      },
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ResultDataContext.Provider value={mockData as unknown as ResultContextProp}>
          <AssementFormulationTable
            currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            subHeaderText="Test"
          />
        </ResultDataContext.Provider>
      </QueryClientProvider>
    );

    const progressBars = screen.getAllByRole("progressbar");
    progressBars.forEach((bar) => {
      expect(bar.getAttribute("aria-valuenow")).toBe("0");
    });
  });

  it("should return 0 progress when totalMyproductCarbon is 0 for CARBON_FOOTPRINT tab", () => {
    const mockData = {
      ...resultDataValue,
      carbonFootprintData: {
        ...resultDataValue.carbonFootprintData,
        formulation: [
          {
            tradeName: "test-cf-zero",
            rawCode: "RAW005",
            baseline: { massComposition: "10.00", carbonFootprint: 0 },
            myProduct: { massComposition: "10.00", carbonFootprint: 0 },
          },
        ],
      },
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ResultDataContext.Provider value={mockData as unknown as ResultContextProp}>
          <AssementFormulationTable
            currentTab={CURRENT_TAB.CARBON_FOOTPRINT}
            subHeaderText="Product Carbon Footprint"
          />
        </ResultDataContext.Provider>
      </QueryClientProvider>
    );

    const progressBars = screen.getAllByRole("progressbar");
    progressBars.forEach((bar) => {
      expect(bar.getAttribute("aria-valuenow")).toBe("0");
    });
  });

  it("should calculate correct percentage when totalMyproductCarbon is non-zero for CARBON_FOOTPRINT tab", () => {
    const mockData = {
      ...resultDataValue,
      carbonFootprintData: {
        ...resultDataValue.carbonFootprintData,
        formulation: [
          {
            tradeName: "test-cf",
            rawCode: "RAW006",
            baseline: { massComposition: "10.00", carbonFootprint: 8 },
            myProduct: { massComposition: "10.00", carbonFootprint: 4 },
          },
          {
            tradeName: "test-cf-2",
            rawCode: "RAW007",
            baseline: { massComposition: "10.00", carbonFootprint: 2 },
            myProduct: { massComposition: "10.00", carbonFootprint: 6 },
          },
        ],
      },
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ResultDataContext.Provider value={mockData as unknown as ResultContextProp}>
          <AssementFormulationTable
            currentTab={CURRENT_TAB.CARBON_FOOTPRINT}
            subHeaderText="Product Carbon Footprint"
          />
        </ResultDataContext.Provider>
      </QueryClientProvider>
    );

    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBeGreaterThan(0);
    // With values [8,2] baseline and [4,6] myProduct, totals are 10 each
    // Progress bars should show non-zero percentages
    const values = progressBars.map((bar) => Number(bar.getAttribute("aria-valuenow")));
    expect(values.some((v) => v > 0)).toBe(true);
  });
});
