import "@testing-library/jest-dom";
import { getData } from "../data";

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


describe("data", () => {
  it("should render the component", async () => {
    const baseElement = getData();

    expect(baseElement).not.toBeNull();
  });

});
