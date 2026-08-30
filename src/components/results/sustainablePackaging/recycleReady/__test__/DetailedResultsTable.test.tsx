import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ResultDataMock } from "../../../../../mocks/ResultData.mock";
import { ResultDataContext } from "../../../../../contexts/resultData/ResultDataContext";
import { RRDetailedResultsTable } from "../DetailedResultsTable";

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

describe("DetailedResultsTable", () => {
  const resultDataValue = ResultDataMock;

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <RRDetailedResultsTable
              data={ResultDataMock.sustainablePackagingData.recycleReady.detailedData}
              baselinePercentage="100"
              myProductPercentage="100"
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const infoIcon = screen.getAllByTestId("ArrowDownwardIcon");
      fireEvent.click(infoIcon[0])
      fireEvent.click(infoIcon[1])
    })
  }, 8000);
});
