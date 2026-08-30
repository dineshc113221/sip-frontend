import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { IconComponent } from "../SortIcon";

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

describe("SortIcon", () => {
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <IconComponent
            orderBy={"myProduct.carbonFootprint"}
            orderDirection={"asc"}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

});
