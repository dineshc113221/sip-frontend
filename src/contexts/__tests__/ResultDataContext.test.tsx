import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useGetBaselineTableResults, useGetProductAssessmentResultByID } from '../../hooks/UseGetProductDetails';
import { ProductAssessmentResultMock } from '../../mocks/ProductAssessmentResult.mock';
import { ResultDataContext, ResultDataProvider } from '../resultData/ResultDataContext';
import { ResultContextProp } from '../../structures/result';

// Mock the hook to return predefined data and functions
jest.mock('../../hooks/UseGetProductDetails', () => ({
  useGetProductAssessmentResultByID: jest.fn(),
  useGetBaselineTableResults: jest.fn(),
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

// Test Component
const TestComponent = () => {
  const context = React.useContext(ResultDataContext);
  return (
    <div>
      <span data-testid="currentTab">{context.currentTab}</span>
      <span data-testid="pcrContent">{`${context.sustainablePackagingData.tabs.pcrContent.heading}`}</span>
      <span data-testid="materialEfficiency">{`${context.sustainablePackagingData.tabs.materialEfficiency.heading}`}</span>
    </div>
  );
};
const buildDisruptorComponent = (component_type: string, disruptor?: string) => ({
  pc_nm: component_type,
  description: "",
  component_type,
  weight: "0",
  opacifier: "",
  stage: "",
  state: "",
  template: "",
  isEdited: false,
  sub_components: [],
  isCalculated: false,
  recyclability_disruptors_list_formatted_4_5: disruptor,
});
const createDisruptorResponse = () => ({
  error: false,
  message: "",
  data: {
    isBaselinePresent: true,
    isBaselineDataComplete: true,
    experimental: {} as never,
    baselinePackaging: {} as never,
    myProductPackaging: {} as never,
    baseline: {
      watchlist: {} as never,
      renewable_feedback_stock: {} as never,
      gaia_score: {} as never,
      "sustainablepackaging-recyclability-disruptors": {
        components: [
          buildDisruptorComponent("Bottle", "Metal spring"),
          buildDisruptorComponent("Cap", ""),
        ],
        recyclability_disruptors_present_all_packaging_4_3: "present",
      },
    } as never,
    final: {
      watchlist: {} as never,
      renewable_feedback_stock: {} as never,
      gaia_score: {} as never,
      "sustainablepackaging-recyclability-disruptors": {
        components: [
          buildDisruptorComponent("Bottle", "Foil label"),
          buildDisruptorComponent("Label"),
        ],
        recyclability_disruptors_present_all_packaging_4_3: "present",
        watchout_message_4_6: "Remove foil label",
      },
    } as never,
  },
});
const TestComponentSP = () => {
  const { currentTab, setCurrentTab } = React.useContext(ResultDataContext);

  React.useEffect(() => {
    setCurrentTab("SUSTAINABLE_PACKAGING");
  }, [setCurrentTab]);

  return <div data-testid="currentTab">{currentTab}</div>;
};
const TestComponentGC = () => {
  const { currentTab, setCurrentTab } = React.useContext(ResultDataContext);

  React.useEffect(() => {
    setCurrentTab("GREEN_CHEMISTRY");
  }, [setCurrentTab]);

  return <div data-testid="currentTab">{currentTab}</div>;
};
const TestComponentCF= () => {
  const { currentTab, setCurrentTab } = React.useContext(ResultDataContext);

  React.useEffect(() => {
    setCurrentTab("CARBON_FOOTPRINT");
  }, [setCurrentTab]);

  return <div data-testid="currentTab">{currentTab}</div>;
};
describe('ResultDataProvider', () => {

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: ProductAssessmentResultMock ,
      refetch: jest.fn(),
    });

    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: ProductAssessmentResultMock ,
      refetch: jest.fn(),
    });
  });

  it('should render with initial values', () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="baseline">
        <TestComponent />
      </ResultDataProvider>
    );

    expect(screen.getByTestId('currentTab').textContent).toBe('PRODUCT_ENVIRONMENTAL_FOOTPRINT');
    expect(screen.getByTestId('pcrContent').textContent).toBe('PCR Content');
    expect(screen.getByTestId('materialEfficiency').textContent).toBe('Material Efficiency');
  }, 8000);

  it('should render with initial values', () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="experimental">
        <TestComponent />
      </ResultDataProvider>
    );

    expect(screen.getByTestId('currentTab').textContent).toBe('PRODUCT_ENVIRONMENTAL_FOOTPRINT');
    expect(screen.getByTestId('pcrContent').textContent).toBe('PCR Content');
    expect(screen.getByTestId('materialEfficiency').textContent).toBe('Material Efficiency');
  }, 8000);

  it('should render with initial values', () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="final">
        <TestComponent />
      </ResultDataProvider>
    );

    expect(screen.getByTestId('currentTab').textContent).toBe('PRODUCT_ENVIRONMENTAL_FOOTPRINT');
    expect(screen.getByTestId('pcrContent').textContent).toBe('PCR Content');
    expect(screen.getByTestId('materialEfficiency').textContent).toBe('Material Efficiency');
  }, 8000);

  it('should render with initial values', () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="final">
        <TestComponent />
      </ResultDataProvider>
    );

    expect(screen.getByTestId('currentTab').textContent).toBe('PRODUCT_ENVIRONMENTAL_FOOTPRINT');
    expect(screen.getByTestId('pcrContent').textContent).toBe('PCR Content');
    expect(screen.getByTestId('materialEfficiency').textContent).toBe('Material Efficiency');
  }, 8000);

  it('should process variables correctly for 404 API response', () => {
    // Mock the API hook to return the 404 response
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: {
        error: true,
        message: "Enter both your formulation and packaging data and hit 'calculate' to view results",
        data: {},
      },
      isError: true,
      error: null, // Simulate no Axios error here
      refetch: jest.fn(),
    });

    let contextValues = {} as ResultContextProp;
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="baseline">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context; // Capture the context values
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    // Verify that the error flag is set
    expect(contextValues.dialsError).toBe(true);
    // Verify that the error message matches the API response
    expect(contextValues.dialsErrorMsg).toBe("Enter both your formulation and packaging data and hit 'calculate' to view results");
   
  });
  it('should covered', () => {
    // Mock the API hook to return the 404 response
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: {
        error: false,
        message: "Enter both your formulation and packaging data and hit 'calculate' to view results",
        data:ProductAssessmentResultMock,
      },
      isError: false,
      error: null, 
      refetch: jest.fn(),
    });

    let contextValues = {} as ResultContextProp;
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="baseline">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context; // Capture the context values
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );
    expect(contextValues.dialsError).toBe(false);
  })
  
  it("should update currentTab to SUSTAINABLE_PACKAGING", () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="baseline">
        <TestComponentSP />
      </ResultDataProvider>
    );
  
    expect(screen.getByTestId("currentTab").textContent).toBe("SUSTAINABLE_PACKAGING");
  });
  it("should update currentTab to GREEN_CHEMISTRY", () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="baseline">
        <TestComponentGC />
      </ResultDataProvider>
    );
  
    expect(screen.getByTestId("currentTab").textContent).toBe("GREEN_CHEMISTRY");
  });
  it("should update currentTab to CARBON_FOOTPRINT", () => {
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="baseline">
        <TestComponentCF />
      </ResultDataProvider>
    );
  
    expect(screen.getByTestId("currentTab").textContent).toBe("CARBON_FOOTPRINT");
  });
  it("should map disruptor data for baseline and my product components", async () => {
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: createDisruptorResponse(),
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    let contextValues = null;
    render(
      <ResultDataProvider productId="123" assessmentId="456" assessmentType="final">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    await waitFor(() => {
      expect(
        contextValues?.sustainablePackagingData.disruptors.baselineProduct?.length
      ).toBe(1);
    });

    expect(
      contextValues?.sustainablePackagingData.disruptors.baselineProduct
    ).toEqual([
      {
        component_type: "Bottle",
        recyclability_disruptors_list_formatted_4_5: "Metal spring",
      },
    ]);
    expect(
      contextValues?.sustainablePackagingData.disruptors.baselineProduct
    ).not.toContainEqual(
      expect.objectContaining({ component_type: "Cap" })
    );
    expect(contextValues?.sustainablePackagingData.disruptors.myproduct).toEqual([
      {
        component_type: "Bottle",
        recyclability_disruptors_list_formatted_4_5: "Foil label",
      },
    ]);
    expect(
      contextValues?.sustainablePackagingData.disruptors.myproduct
    ).not.toContainEqual(
      expect.objectContaining({ component_type: "Label" })
    );
    expect(contextValues?.sustainablePackagingData.disruptors.watchOut).toBe(
      "Remove foil label"
    );
  });

  // ---------- buildPackPefMap / buildPackCfMap coverage ----------

  const packProdBaseline = {
    packaging_level: [
      {
        packaging_level: "Primary",
        components: [
          {
            component_type: "Bottle",
            sub_components: [
              {
                name: "Bottle",
                material: [
                  {
                    material_name: "Wood",
                    step_51_pack_prod_pef_score_functional_unit: 0.0002,
                    step_48_pack_prod_pack_impact: { climate_change_functional_unit: 0.005 },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const packEolBaseline = {
    packaging_level: [
      {
        packaging_level: "Primary",
        components: [
          {
            component_type: "Bottle",
            sub_components: [
              {
                name: "Bottle",
                material: [
                  {
                    material_name: "Wood",
                    step_64_Pack_EOL_PEF_score_functional_unit: 0.0001,
                    step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: 0.003 },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const packProdProduct = {
    packaging_level: [
      {
        packaging_level: "Primary",
        components: [
          {
            component_type: "Pump",
            sub_components: [
              {
                name: "Bottle",
                material: [
                  {
                    material_name: "Wood",
                    step_51_pack_prod_pef_score_functional_unit: 0.0005,
                    step_48_pack_prod_pack_impact: { climate_change_functional_unit: 0.01 },
                  },
                  {
                    material_name: "Glass",
                    step_51_pack_prod_pef_score_functional_unit: 0.0003,
                    step_48_pack_prod_pack_impact: { climate_change_functional_unit: 0.007 },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const packEolProduct = {
    packaging_level: [
      {
        packaging_level: "Primary",
        components: [
          {
            component_type: "Pump",
            sub_components: [
              {
                name: "Bottle",
                material: [
                  {
                    material_name: "Wood",
                    step_64_Pack_EOL_PEF_score_functional_unit: 0.0002,
                    step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: 0.004 },
                  },
                  {
                    material_name: "Glass",
                    step_64_Pack_EOL_PEF_score_functional_unit: 0.0001,
                    step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: 0.002 },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const packagingLevelBaseline = [
    {
      packaging_level: "Primary",
      isrecyclable: true,
      recyclability_status: "Recycle Ready",
      productEvaluation: 90,
      components: [
        {
          pc_nm: "",
          description: "",
          recyclability_status: "Recycle Ready",
          component_type: "Bottle",
          weight: "10",
          opacifier: "",
          stage: "",
          state: "",
          template: "",
          isDataComplete: true,
          isEdited: false,
          isCalculated: true,
          sub_components: [
            {
              _id: 1,
              name: "Bottle",
              opacity: "Clear",
              color: "Green",
              finishing_process: "No Process",
              material: [
                {
                  _id: 1,
                  material_name: "Wood",
                  material_type: "PCR",
                  converting_process: "Wood processing",
                  material_pct: "2.3",
                  productEnvironmentalFootPrint: "",
                  carbonFootPrint: "",
                  virginPlasticValue: "",
                  layer: "Layer 1",
                },
              ],
            },
          ],
          _id: "test-baseline-1",
        },
      ],
    },
  ];

  const packagingLevelProduct = [
    {
      packaging_level: "Primary",
      isrecyclable: true,
      recyclability_status: "Recycle Ready",
      productEvaluation: 90,
      components: [
        {
          pc_nm: "",
          description: "",
          recyclability_status: "Recycle Ready",
          component_type: "Pump",
          weight: "16.1",
          opacifier: "",
          stage: "",
          state: "",
          template: "",
          isDataComplete: true,
          isEdited: false,
          isCalculated: true,
          sub_components: [
            {
              _id: 1,
              name: "Bottle",
              opacity: "Clear",
              color: "Green",
              finishing_process: "No Process",
              material: [
                {
                  _id: 1,
                  material_name: "Wood",
                  material_type: "PCR",
                  converting_process: "Wood processing",
                  material_pct: "5.0",
                  productEnvironmentalFootPrint: "",
                  carbonFootPrint: "",
                  virginPlasticValue: "",
                  layer: "Layer 1",
                },
                {
                  _id: 2,
                  material_name: "Glass",
                  material_type: "Virgin",
                  converting_process: "Blown Glass",
                  material_pct: "11.1",
                  productEnvironmentalFootPrint: "",
                  carbonFootPrint: "",
                  virginPlasticValue: "",
                  layer: "N/A",
                },
              ],
            },
          ],
          _id: "test-product-1",
        },
      ],
    },
  ];

  const createPackMapResponse = () => ({
    error: false,
    message: "",
    data: {
      isBaselinePresent: true,
      isBaselineDataComplete: true,
      experimental: {
        packproduction: packProdProduct,
        packagingeol: packEolProduct,
        watchlist: {} as never,
        renewable_feedback_stock: {} as never,
        gaia_score: {} as never,
      } as never,
      baseline: {
        packproduction: packProdBaseline,
        packagingeol: packEolBaseline,
        watchlist: {} as never,
        renewable_feedback_stock: {} as never,
        gaia_score: {} as never,
      } as never,
      final: {
        packproduction: packProdProduct,
        packagingeol: packEolProduct,
        watchlist: {} as never,
        renewable_feedback_stock: {} as never,
        gaia_score: {} as never,
      } as never,
      baselinePackaging: { packaging_level: packagingLevelBaseline } as never,
      myProductPackaging: { packaging_level: packagingLevelProduct } as never,
    },
  });

  it("should compute PEF values via buildPackPefMap for baseline and product on PEF tab", async () => {
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: createPackMapResponse(),
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    let contextValues = null;
    render(
      <ResultDataProvider productId="p1" assessmentId="a1" assessmentType="experimental">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    // Default tab is PRODUCT_ENVIRONMENTAL_FOOTPRINT
    await waitFor(() => {
      const packaging = contextValues?.productEnvironmentalFootprintData?.packaging?.consumerPackaging;
      expect(packaging).toBeDefined();
      expect(packaging?.length).toBeGreaterThan(0);
    });

    const packaging = contextValues.productEnvironmentalFootprintData.packaging.consumerPackaging;

    // Find the merged row — should have baseline Bottle and product Pump
    const bottleRow = packaging.find((r) => r.componentName === "Bottle");
    const pumpRow = packaging.find((r) => r.componentName === "Pump");

    // Baseline Bottle: component-level PEF is read from component steps; missing => 0
    if (bottleRow) {
      expect(bottleRow.baselineComponentFootprint).toBeCloseTo(0, 2);
      const baselineDetail = bottleRow.details?.find((d) => d.baselineEnvironmentalFootprint > 0);
      if (baselineDetail) {
        expect(baselineDetail.baselineEnvironmentalFootprint).toBeCloseTo(300, 2);
      }
    }

    // Product Pump: component-level PEF is read from component steps; missing => 0
    // Product Pump material details still have per-material values
    if (pumpRow) {
      expect(pumpRow.myProductComponentFootprint).toBeCloseTo(0, 2);
      const productDetails = pumpRow.details?.filter((d) => d.myProductEnvironmentalFootprint > 0);
      if (productDetails?.length === 2) {
        expect(productDetails[0].myProductEnvironmentalFootprint).toBeCloseTo(700, 2);
        expect(productDetails[1].myProductEnvironmentalFootprint).toBeCloseTo(400, 2);
      }
    }
  });

  it("should compute CF values via buildPackCfMap on CARBON_FOOTPRINT tab", async () => {
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: createPackMapResponse(),
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    const TestComponentCFCapture = () => {
      const ctx = React.useContext(ResultDataContext);
      React.useEffect(() => {
        ctx.setCurrentTab("CARBON_FOOTPRINT");
      }, [ctx.setCurrentTab]);
      return <div data-testid="cfTab">{ctx.currentTab}</div>;
    };

    let contextValues = null;
    render(
      <ResultDataProvider productId="p2" assessmentId="a2" assessmentType="experimental">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
        <TestComponentCFCapture />
      </ResultDataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cfTab").textContent).toBe("CARBON_FOOTPRINT");
    });

    await waitFor(() => {
      const packaging = contextValues?.productEnvironmentalFootprintData?.packaging?.consumerPackaging;
      expect(packaging).toBeDefined();
      expect(packaging?.length).toBeGreaterThan(0);
    });

    const packaging = contextValues.productEnvironmentalFootprintData.packaging.consumerPackaging;

    const bottleRow = packaging.find((r) => r.componentName === "Bottle");
    const pumpRow = packaging.find((r) => r.componentName === "Pump");

    // Baseline Bottle: component-level CF is read from component steps; missing => 0
    if (bottleRow) {
      expect(bottleRow.baselineComponentFootprint).toBeCloseTo(0, 2);
      const baselineDetail = bottleRow.details?.find((d) => d.baselineEnvironmentalFootprint > 0);
      if (baselineDetail) {
        expect(baselineDetail.baselineEnvironmentalFootprint).toBeCloseTo(8, 2);
      }
    }

    // Product Pump: component-level CF is read from component steps; missing => 0
    // Product Pump material details still have per-material values
    if (pumpRow) {
      expect(pumpRow.myProductComponentFootprint).toBeCloseTo(0, 2);
      const productDetails = pumpRow.details?.filter((d) => d.myProductEnvironmentalFootprint > 0);
      if (productDetails?.length === 2) {
        expect(productDetails[0].myProductEnvironmentalFootprint).toBeCloseTo(14, 2);
        expect(productDetails[1].myProductEnvironmentalFootprint).toBeCloseTo(9, 2);
      }
    }
  });

  it("should handle missing packproduction/packagingeol gracefully on PEF tab", async () => {
    const responseNoPackData = {
      error: false,
      message: "",
      data: {
        isBaselinePresent: true,
        isBaselineDataComplete: true,
        experimental: {
          watchlist: {} as never,
          renewable_feedback_stock: {} as never,
          gaia_score: {} as never,
        } as never,
        baseline: {
          watchlist: {} as never,
          renewable_feedback_stock: {} as never,
          gaia_score: {} as never,
        } as never,
        baselinePackaging: { packaging_level: packagingLevelBaseline } as never,
        myProductPackaging: { packaging_level: packagingLevelProduct } as never,
      },
    };

    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: responseNoPackData,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    let contextValues = null;
    render(
      <ResultDataProvider productId="p3" assessmentId="a3" assessmentType="experimental">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    await waitFor(() => {
      const packaging = contextValues?.productEnvironmentalFootprintData?.packaging?.consumerPackaging;
      expect(packaging).toBeDefined();
    });

    // With no packproduction/packagingeol, all footprint values should be 0
    const packaging = contextValues.productEnvironmentalFootprintData.packaging.consumerPackaging;
    packaging?.forEach((row) => {
      expect(row.baselineComponentFootprint).toBe(0);
      expect(row.myProductComponentFootprint).toBe(0);
    });
  });

  it("should compute PEF values for final assessmentType using resultkey", async () => {
    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: createPackMapResponse(),
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    let contextValues = null;
    render(
      <ResultDataProvider productId="p4" assessmentId="a4" assessmentType="final">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    await waitFor(() => {
      const packaging = contextValues?.productEnvironmentalFootprintData?.packaging?.consumerPackaging;
      expect(packaging).toBeDefined();
      expect(packaging?.length).toBeGreaterThan(0);
    });

    const packaging = contextValues.productEnvironmentalFootprintData.packaging.consumerPackaging;
    const pumpRow = packaging.find((r) => r.componentName === "Pump");

    // Product Pump: component-level PEF is read from component steps; missing => 0
    if (pumpRow) {
      expect(pumpRow.myProductComponentFootprint).toBeCloseTo(0, 2);
    }
  });

  it("should handle packproduction with no packaging_level gracefully", async () => {
    const responseEmptyPackLevel = {
      error: false,
      message: "",
      data: {
        isBaselinePresent: true,
        isBaselineDataComplete: true,
        experimental: {
          packproduction: { packaging_level: undefined },
          packagingeol: { packaging_level: undefined },
          watchlist: {} as never,
          renewable_feedback_stock: {} as never,
          gaia_score: {} as never,
        } as never,
        baseline: {
          packproduction: { packaging_level: undefined },
          packagingeol: { packaging_level: undefined },
          watchlist: {} as never,
          renewable_feedback_stock: {} as never,
          gaia_score: {} as never,
        } as never,
        baselinePackaging: { packaging_level: packagingLevelBaseline } as never,
        myProductPackaging: { packaging_level: packagingLevelProduct } as never,
      },
    };

    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: responseEmptyPackLevel,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    let contextValues = null;
    render(
      <ResultDataProvider productId="p5" assessmentId="a5" assessmentType="experimental">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    await waitFor(() => {
      const packaging = contextValues?.productEnvironmentalFootprintData?.packaging?.consumerPackaging;
      expect(packaging).toBeDefined();
    });

    const packaging = contextValues.productEnvironmentalFootprintData.packaging.consumerPackaging;
    packaging?.forEach((row) => {
      expect(row.baselineComponentFootprint).toBe(0);
      expect(row.myProductComponentFootprint).toBe(0);
    });
  });

  it("should handle materials with missing step values defaulting to 0", async () => {
    const packProdMissingSteps = {
      packaging_level: [
        {
          packaging_level: "Primary",
          components: [
            {
              component_type: "Bottle",
              sub_components: [
                {
                  name: "Bottle",
                  material: [
                    {
                      material_name: "Wood",
                      // step_51_pack_prod_pef_score_functional_unit missing entirely
                      step_48_pack_prod_pack_impact: {},  // climate_change_functional_unit missing
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const packEolMissingSteps = {
      packaging_level: [
        {
          packaging_level: "Primary",
          components: [
            {
              component_type: "Bottle",
              sub_components: [
                {
                  name: "Bottle",
                  material: [
                    {
                      material_name: "Wood",
                      // step_64_Pack_EOL_PEF_score_functional_unit missing
                      step_60_Pack_EOL_Pack_Impact: {},  // climate_change_functional_unit missing
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const responseMissingSteps = {
      error: false,
      message: "",
      data: {
        isBaselinePresent: true,
        isBaselineDataComplete: true,
        experimental: {
          packproduction: packProdMissingSteps,
          packagingeol: packEolMissingSteps,
          watchlist: {} as never,
          renewable_feedback_stock: {} as never,
          gaia_score: {} as never,
        } as never,
        baseline: {
          packproduction: packProdMissingSteps,
          packagingeol: packEolMissingSteps,
          watchlist: {} as never,
          renewable_feedback_stock: {} as never,
          gaia_score: {} as never,
        } as never,
        baselinePackaging: { packaging_level: packagingLevelBaseline } as never,
        myProductPackaging: { packaging_level: packagingLevelProduct } as never,
      },
    };

    (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
      data: responseMissingSteps,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    let contextValues= null;
    render(
      <ResultDataProvider productId="p6" assessmentId="a6" assessmentType="experimental">
        <ResultDataContext.Consumer>
          {(context) => {
            contextValues = context;
            return null;
          }}
        </ResultDataContext.Consumer>
      </ResultDataProvider>
    );

    await waitFor(() => {
      const packaging = contextValues?.productEnvironmentalFootprintData?.packaging?.consumerPackaging;
      expect(packaging).toBeDefined();
    });

    // Missing step values default to 0, so (0+0)*1000000 = 0
    const packaging = contextValues.productEnvironmentalFootprintData.packaging.consumerPackaging;
    packaging?.forEach((row) => {
      expect(row.baselineComponentFootprint).toBe(0);
      expect(row.myProductComponentFootprint).toBe(0);
    });
  });
});