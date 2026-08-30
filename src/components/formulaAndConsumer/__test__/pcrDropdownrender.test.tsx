import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import DropDown from "../pcrDropdownrender";

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

describe("pcrDropdownrender", () => {
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <DropDown/>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const textBox = screen.getAllByRole("combobox");
      fireEvent.keyDown(textBox[0], { key: "ArrowDown" });
    });
    await act(() => {
      const associateToChassisOptions = screen.getAllByRole("option");
      fireEvent.click(associateToChassisOptions[0]);
    });
  }, 8000);

});
