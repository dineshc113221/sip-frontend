import "@testing-library/jest-dom";
import { productSortFunction } from "../helper";
import { ExperimentalDataItem } from "../../breadcrumb/types";
import { ProductDetailsMock } from "../../../mocks/ProductDetails.mock";

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

describe("productSortFunction", () => {
  it("should render the component for modified date", async () => {
    const baseElement =productSortFunction(ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[],"Modified Date");

    expect(baseElement).not.toBeNull();
  });

  it("should render the component for A-Z", async () => {
    const baseElement =productSortFunction(ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[],"A-Z");

    expect(baseElement).not.toBeNull();
  });

  it("should render the component for Created Date", async () => {
    const baseElement =productSortFunction(ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[],"Created Date");

    expect(baseElement).not.toBeNull();
  });

  it("should render the component for default", async () => {
    const baseElement =productSortFunction(ProductDetailsMock[0]?.assessments?.experimental as unknown as ExperimentalDataItem[],"test");

    expect(baseElement).not.toBeNull();
  });

});
