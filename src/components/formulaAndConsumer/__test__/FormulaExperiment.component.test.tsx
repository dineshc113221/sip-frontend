import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import FormulaExperiment from "../FormulaExperiment.component";
import {FormulaDetailsMock } from "../../../mocks/FormulaDetails.mock.json"
import { IformulaCodeDetailData } from "../../../structures/formulation";

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

describe("FormulaExperiment", () => {
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <FormulaExperiment
            isParentData={FormulaDetailsMock as unknown as IformulaCodeDetailData}
            handelFormulationChanges={jest.fn()}
            handelSaveChanges={jest.fn()}
            isClear={true}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

});
