import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import SipBreadcrumb from "../Sipbreadcrumb.component";

const queryClient = new QueryClient({});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: jest.fn(),
}));

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

describe("SipBreadcrumb", () => {
  const mockPathname = jest.fn();
  Object.defineProperty(window, "location", {
    value: {
      get pathname() {
        return mockPathname();
      },
      replace: jest.fn(),
    },
  });
  let originalFetch: jest.Mock;
  mockPathname.mockReturnValue("/my-product-detail/669109b168c2e4986c95d550");

  afterEach(() => {
    global.fetch = originalFetch;
  });
  
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <SipBreadcrumb/>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

});
