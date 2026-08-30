import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TotalScore } from "../TotalScore";

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

describe("TotalScore", () => {
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
            <TotalScore />
      );
      expect(baseElement).not.toBeNull();
    });

  });

});
