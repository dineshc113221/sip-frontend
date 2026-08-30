import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { CURRENT_SECTION } from "../../../constants/String.constants";
import ResultSection2 from "../ResultSection2Component";

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

describe("ResultSection2", () => {

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultSection2
            currentSection={CURRENT_SECTION.FORMULATION}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should render the component for CONSUMER_PACKAGING", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultSection2
            currentSection={CURRENT_SECTION.CONSUMER_PACKAGING}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should render the component for TOTAL_PRODUCT", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultSection2
            currentSection={CURRENT_SECTION.TOTAL_PRODUCT}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

});
