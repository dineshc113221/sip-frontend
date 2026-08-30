import { render, act, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { CURRENT_TAB } from "../../../../constants/String.constants";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ResultDataMock } from "../../../../mocks/ResultData.mock";
import { ResultsPackagingTable } from "../ResultsPackagingTable";

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

describe("ResultsPackagingTable", () => {
  const resultDataValue = ResultDataMock;

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    // await act(() => {
    //   const infoIcon = screen.getAllByTestId("ExpandMoreIcon");
    //   fireEvent.click(infoIcon[0])
    //   fireEvent.click(infoIcon[1])
    // })
  }, 8000);

  it("should render the toggle icon", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const infoIcon = screen.getAllByTestId("ChevronRightIcon");
      fireEvent.click(infoIcon[0])
    })
  }, 8000);

  it("should open and close CustomTooltip for baseline component footprint", async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Expand the first component row so detail rows render
    await act(async () => {
      const toggles = screen.getAllByTestId("ChevronRightIcon");
      fireEvent.click(toggles[0]);
    });

    // Find the ProgressBarWithLabel for baselineComponentFootprint
    const progressBars = screen.getAllByText("12.00");
    expect(progressBars.length).toBeGreaterThan(0);

    // Find the tooltip trigger (span inside CustomTooltip)
    const tooltipTriggers = screen.getAllByText("12.00").map((el) => el.closest("span"));
    expect(tooltipTriggers[0]).toBeInTheDocument();

    // Simulate mouse over to open tooltip
    await act(async () => {
      fireEvent.mouseOver(tooltipTriggers[0]);
    });

    // Tooltip should be open (find tooltip by role)
    const openTooltip = await screen.findByRole("tooltip");
    expect(openTooltip).toBeInTheDocument();

    // Simulate mouse leave to close tooltip and wait for it to be removed
    await act(async () => {
      fireEvent.mouseLeave(tooltipTriggers[0]);
    });
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("should set and clear activeTooltip on open/close", async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Expand the first component row so detail rows render
    await act(async () => {
      const toggles = screen.getAllByTestId("ChevronRightIcon");
      fireEvent.click(toggles[0]);
    });

    // Find the ProgressBarWithLabel for myProductComponentFootprint
    const progressBars = screen.getAllByText("12.00");
    const tooltipTriggers = progressBars.map((el) => el.closest("span"));

    // Open tooltip and assert tooltip appears
    await act(async () => {
      fireEvent.mouseOver(tooltipTriggers[1]);
    });
    const openTooltip2 = await screen.findByRole("tooltip");
    expect(openTooltip2).toBeInTheDocument();

    // Close tooltip and wait for it to be removed
    await act(async () => {
      fireEvent.mouseLeave(tooltipTriggers[1]);
    });
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("should clear activeTooltip when table is scrolled or wheel event occurs", async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Expand first row so progress bars render
    await act(async () => {
      const toggles = screen.getAllByTestId("ChevronRightIcon");
      fireEvent.click(toggles[0]);
    });

    const progressBars = screen.getAllByText("12.00");
    const tooltipTriggers = progressBars.map((el) => el.closest("span"));

    // Open tooltip
    await act(async () => {
      fireEvent.mouseOver(tooltipTriggers[0]);
    });
    await screen.findByRole("tooltip");

    // Trigger scroll on the TableContainer and ensure tooltip is cleared
    const container = document.querySelector('.table-container-results');
    expect(container).toBeInTheDocument();
    await act(async () => {
      if (container) fireEvent.scroll(container);
    });
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    // Open tooltip again
    await act(async () => {
      fireEvent.mouseOver(tooltipTriggers[0]);
    });
    await screen.findByRole("tooltip");

    // Trigger wheel event and ensure tooltip is cleared
    await act(async () => {
      if (container) fireEvent.wheel(container);
    });
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("should render baseline and myProduct component weights and open/close their tooltips", async () => {
    // Create a modified result data where component-level weights and footprints are present
    const modified = JSON.parse(JSON.stringify(resultDataValue));
    modified.productEnvironmentalFootprintData.packaging.consumerPackaging = [
      {
        componentName: 'comp-1',
        baseLineComponentWeight: 5,
        baselineComponentFootprint: 1.23456,
        myProductComponentWeight: 6,
        myProductComponentFootprint: 2.34567,
        details: [],
      },
    ];

    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={modified}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Baseline and myProduct weights should be shown with 2 decimals
    expect(screen.getByText('5.00')).toBeInTheDocument();
    expect(screen.getByText('6.00')).toBeInTheDocument();

    // Progress bar labels show the footprints rounded to 2 decimals
    const baselineLabel = screen.getByText('1.23');
    const myProductLabel = screen.getByText('2.35');
    expect(baselineLabel).toBeInTheDocument();
    expect(myProductLabel).toBeInTheDocument();

    // Open baseline tooltip
    const baselineTrigger = baselineLabel.closest('span');
    await act(async () => {
      fireEvent.mouseOver(baselineTrigger);
    });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    // Close baseline tooltip
    await act(async () => {
      fireEvent.mouseLeave(baselineTrigger);
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());

    // Open myProduct tooltip
    const myProductTrigger = myProductLabel.closest('span');
    await act(async () => {
      fireEvent.mouseOver(myProductTrigger);
    });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    // Close myProduct tooltip
    await act(async () => {
      fireEvent.mouseLeave(myProductTrigger);
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });

  // --- Carbon footprint tab tests (parallel to the environmental footprint tests) ---
  it("(carbon) should clear activeTooltip when table is scrolled or wheel event occurs", async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.CARBON_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Expand first row so progress bars render
    await act(async () => {
      const toggles = screen.getAllByTestId("ChevronRightIcon");
      fireEvent.click(toggles[0]);
    });

    const progressBars = screen.getAllByText("12.00");
    const tooltipTriggers = progressBars.map((el) => el.closest("span"));

    // Open tooltip
    await act(async () => {
      fireEvent.mouseOver(tooltipTriggers[0]);
    });
    await screen.findByRole("tooltip");

    // Trigger scroll on the TableContainer and ensure tooltip is cleared
    const container = document.querySelector('.table-container-results');
    expect(container).toBeInTheDocument();
    await act(async () => {
      if (container) fireEvent.scroll(container);
    });
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    // Open tooltip again
    await act(async () => {
      fireEvent.mouseOver(tooltipTriggers[0]);
    });
    await screen.findByRole("tooltip");

    // Trigger wheel event and ensure tooltip is cleared
    await act(async () => {
      if (container) fireEvent.wheel(container);
    });
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("(carbon) should render baseline and myProduct component weights and open/close their tooltips", async () => {
    // Create a modified result data where component-level weights and footprints are present
    const modified = JSON.parse(JSON.stringify(resultDataValue));
    modified.productEnvironmentalFootprintData.packaging.consumerPackaging = [
      {
        componentName: 'comp-1',
        baseLineComponentWeight: 5,
        baselineComponentFootprint: 1.23456,
        myProductComponentWeight: 6,
        myProductComponentFootprint: 2.34567,
        details: [],
      },
    ];

    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={modified}>
            <ResultsPackagingTable
              currentTab={CURRENT_TAB.CARBON_FOOTPRINT}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Baseline and myProduct weights should be shown with 2 decimals
    expect(screen.getByText('5.00')).toBeInTheDocument();
    expect(screen.getByText('6.00')).toBeInTheDocument();

    // Progress bar labels show the footprints rounded to 2 decimals
    const baselineLabel = screen.getByText('1.23');
    const myProductLabel = screen.getByText('2.35');
    expect(baselineLabel).toBeInTheDocument();
    expect(myProductLabel).toBeInTheDocument();

    // Open baseline tooltip
    const baselineTrigger = baselineLabel.closest('span');
    await act(async () => {
      fireEvent.mouseOver(baselineTrigger);
    });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    // Close baseline tooltip
    await act(async () => {
      fireEvent.mouseLeave(baselineTrigger);
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());

    // Open myProduct tooltip
    const myProductTrigger = myProductLabel.closest('span');
    await act(async () => {
      fireEvent.mouseOver(myProductTrigger);
    });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    // Close myProduct tooltip
    await act(async () => {
      fireEvent.mouseLeave(myProductTrigger);
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });
});
