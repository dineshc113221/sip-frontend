import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // For additional matchers

import { TotalScoreGreen } from "../TotalScore";
import { RENEWABLE_ORIGIN_BONOUS_CONTENT, TOTAL_GAIA_CONTENT, TOTAL_SCORE_DESCRIPTION1, WATCH_LIST_CONTENT } from "../../constant";

jest.mock("../../../../../assets/images/result_hint_icon.svg", () => "mock-icon");

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

describe("TotalScoreGreen Component", () => {
  it("renders the hint section correctly", () => {
    render(<TotalScoreGreen />);
    const hintText = screen.getByText("What is the Green Chemistry Score?");
    const hintIcon = screen.getByAltText("Hint Icon");

    expect(hintText).toBeInTheDocument();
    expect(hintIcon).toBeInTheDocument();
  }, 8000);

  it("renders the description section correctly", () => {
    render(<TotalScoreGreen />);
    const descriptionText = screen.getByText(TOTAL_SCORE_DESCRIPTION1);

    expect(descriptionText).toBeInTheDocument();
  }, 8000);

  it("renders the GAIA pillar correctly", () => {
    render(<TotalScoreGreen />);
    const gaiaHeader = screen.getByText("GAIA");
    const gaiaContent = screen.getByText(TOTAL_GAIA_CONTENT);

    expect(gaiaHeader).toBeInTheDocument();
    expect(gaiaContent).toBeInTheDocument();
  }, 8000);

  it("renders the Watch List pillar correctly", () => {
    render(<TotalScoreGreen />);
    const watchListHeader = screen.getByText("Watch List");
    const watchListContent = screen.getByText(WATCH_LIST_CONTENT);

    expect(watchListHeader).toBeInTheDocument();
    expect(watchListContent).toBeInTheDocument();
  }, 8000);

  it("renders the Renewable Origin Bonus pillar correctly", () => {
    render(<TotalScoreGreen />);
    const renewableOriginHeader = screen.getByText("Renewable Origin Bonus");
    const renewableOriginContent = screen.getByText(
      RENEWABLE_ORIGIN_BONOUS_CONTENT
    );

    expect(renewableOriginHeader).toBeInTheDocument();
    expect(renewableOriginContent).toBeInTheDocument();
  }, 8000);
});
