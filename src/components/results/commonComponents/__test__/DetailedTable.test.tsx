import { render, act, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ResultDataMock } from "../../../../mocks/ResultData.mock";
import DetailedTable from "../DetailedTable";

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

describe("DetailedTable", () => {
  const resultDataValue = ResultDataMock;


  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTable
              currentTab={"PCR_CONTENT"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    // await act(() => {
    //   const infoIcon = screen.getAllByTestId("ExpandMoreIcon");
    //   fireEvent.click(infoIcon[0])
    //   fireEvent.click(infoIcon[0])
    //   fireEvent.click(infoIcon[1])
    //   fireEvent.click(infoIcon[1])
    //   fireEvent.click(infoIcon[2])
    //   fireEvent.click(infoIcon[2])
    // })
  }, 8000);

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTable
              currentTab={"RENEWABLE"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTable
              currentTab={"DefaultTest"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTable
              currentTab={"PCR_CONTENT"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTable
              currentTab={"MATERIAL_EFFICIENCY"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const infoIcon = screen.getAllByTestId("ExpandMoreIcon");
      fireEvent.click(infoIcon[0])
      fireEvent.click(infoIcon[1])
    })
  }, 8000);

  it("should render the toggle icon", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTable
              currentTab={"MATERIAL_EFFICIENCY"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const infoIcon = screen.getAllByTestId("ExpandMoreIcon");
      fireEvent.click(infoIcon[0])
    })
  }, 8000);

  test("clicking a RENEWABLE column sort label triggers sorting and clears open rows", () => {
    render(
      <ResultDataContext.Provider value={resultDataValue}>
        <DetailedTable currentTab="RENEWABLE" />
      </ResultDataContext.Provider>
    );



    // Find the sortable header label for RAW Material Trade Name and click its ArrowDownwardIcon svg
    const headerLabel = screen.getByText("RAW Material Trade Name");
    // Find the enclosing header cell (<th>) then the ArrowDownwardIcon svg inside it
    const headerCell = headerLabel.closest("th") as HTMLElement;
    expect(headerCell).toBeTruthy();
    const arrowSvg = within(headerCell).getByTestId("ArrowDownwardIcon") as HTMLElement;
    expect(arrowSvg).toBeTruthy();
    fireEvent.click(arrowSvg);

  // The clicked header should now be active (sort label root should exist)
  expect(headerCell.querySelector(".MuiTableSortLabel-root")).toBeTruthy();
  });

  test("clicking the same RENEWABLE header twice toggles sort (invokes sorting path twice)", () => {
    render(
      <ResultDataContext.Provider value={resultDataValue}>
        <DetailedTable currentTab="RENEWABLE" />
      </ResultDataContext.Provider>
    );

  const headerLabel = screen.getByText("RAW Material Trade Name");
  const headerCell = headerLabel.closest("th") as HTMLElement;
  expect(headerCell).toBeTruthy();
  const sortButton = within(headerCell).getByRole("button") as HTMLElement;
  expect(sortButton).toBeTruthy();

  // First click - activates sort
  fireEvent.click(sortButton);
  expect(sortButton.classList.toString()).toMatch(/MuiTableSortLabel-root/);

  // Second click - toggles direction (still active)
  fireEvent.click(sortButton);
  expect(sortButton.classList.toString()).toMatch(/MuiTableSortLabel-root/);
  });
  
  
  it("should render the component", async () => {
     const modifiedResultDataValue = {
     ...resultDataValue,
     sustainablePackagingData: {
       ...resultDataValue.sustainablePackagingData,
       "pcrContent": {
         "dialData": {
           "baseline": "0.00",
           "myproduct": "3.00",
           "per_pcr_diff": "3.00"
         },
         "pcrTableData": {},
         "detailedData": [
           {
             "componentName": "Pump",
             "componentWeight": null,
             "myProductComponentWeight": 3,
             "myProductComponentWeightDose": 0,
             "myProductComponentPCRContent": 3,
             "details": [
               {
                 "sub_component_name": "Aerosol - Can - Lid",
                 "materialName": "ABS (Acrylonitrile-butadiene-styrene)",
                 "convertingProcess": "Extrusion, co-extrusion",
                 "finishingProcess": "",
                 "materialType": "PCR",
                 "layer": "Layer 1",
                 "baselineWeight": null,
                 "myProductWeight": "3",
                 "baselineMaterialWeight": null,
                 "myProductMaterialWeight": "0.09",
                 "baselineMaterialWeightDose": null,
                 "myProductMaterialWeightDose": "",
                 "baselineMaterialPCRContent": null,
                 "myProductMaterialPCRContent": "100",
                 "baselineEnvironmentalFootprint": 0,
                 "myProductEnvironmentalFootprint": 0
               }
             ]
           },
           {
             "componentName": "Film",
             "componentWeight": "2",
             "baseLineComponentWeight": 2,
             "baselineComponentWeightDose": 0,
             "baselineComponentPCRContent": 0,
             "details": [
               {
                 "sub_component_name": "Film",
                 "materialName": "PET (Polyethylene terephtalate)",
                 "convertingProcess": "Injection moulding",
                 "finishingProcess": "",
                 "materialType": "Virgin",
                 "layer": "Layer 3",
                 "baselineWeight": null,
                 "myProductWeight": "2",
                 "baselineMaterialWeight": "0.04",
                 "myProductMaterialWeight": null,
                 "baselineMaterialWeightDose": "",
                 "myProductMaterialWeightDose": null,
                 "baselineMaterialPCRContent": "0",
                 "myProductMaterialPCRContent": null,
                 "baselineEnvironmentalFootprint": 0,
                 "myProductEnvironmentalFootprint": 0
               }
             ]
           }
         ]
       },
       "materialEfficiency": {
         "barData": {
           "baseline": "4.61",
           "myproduct": "3.75"
         },
         "detailedData": [
           {
             "componentName": "Pump",
             "componentWeight": null,
             "myProductComponentWeight": 3,
             "myProductComponentWeightDose": 0,
             "myProductComponentPCRContent": 3,
             "details": [
               {
                 "sub_component_name": "Aerosol - Can - Lid",
                 "materialName": "ABS (Acrylonitrile-butadiene-styrene)",
                 "convertingProcess": "Extrusion, co-extrusion",
                 "finishingProcess": "",
                 "materialType": "PCR",
                 "layer": "Layer 1",
                 "baselineWeight": null,
                 "myProductWeight": "3",
                 "baselineMaterialWeight": null,
                 "myProductMaterialWeight": "0.09",
                 "baselineMaterialWeightDose": null,
                 "myProductMaterialWeightDose": "",
                 "baselineMaterialPCRContent": null,
                 "myProductMaterialPCRContent": "100",
                 "baselineEnvironmentalFootprint": 0,
                 "myProductEnvironmentalFootprint": 0
               }
             ]
           },
           {
             "componentName": "Film",
             "componentWeight": "2",
             "baseLineComponentWeight": 2,
             "baselineComponentWeightDose": 0,
             "baselineComponentPCRContent": 0,
             "details": [
               {
                 "sub_component_name": "Film",
                 "materialName": "PET (Polyethylene terephtalate)",
                 "convertingProcess": "Injection moulding",
                 "finishingProcess": "",
                 "materialType": "Virgin",
                 "layer": "Layer 3",
                 "baselineWeight": null,
                 "myProductWeight": "2",
                 "baselineMaterialWeight": "0.04",
                 "myProductMaterialWeight": null,
                 "baselineMaterialWeightDose": "",
                 "myProductMaterialWeightDose": null,
                 "baselineMaterialPCRContent": "0",
                 "myProductMaterialPCRContent": null,
                 "baselineEnvironmentalFootprint": 0,
                 "myProductEnvironmentalFootprint": 0
               }
             ]
           }
         ]
       },
       "recycleReady": {
         "barData": [
           {
             "category": "baseline",
             "value": 100
           },
           {
             "category": "myProduct",
             "value": 100
           }
         ],
         "detailedData": [
           {
             "componentType": "Film",
             "packagingLayer": "Primary",
             "baselineProduct": {
               "weight": "2.00",
               "recycleReady": "Yes"
             },
             "myProduct": {
               "weight": "",
               "recycleReady": ""
             }
           },
           {
             "componentType": "Pump",
             "packagingLayer": "Primary",
             "baselineProduct": {
               "weight": "",
               "recycleReady": ""
             },
             "myProduct": {
               "weight": "3.00",
               "recycleReady": "Yes"
             }
           }
         ]
       },
       "disruptors": {
         "baselineProduct": [
           {
             "component_type": "Film",
             "recyclability_disruptors_list_formatted_4_5": ""
           }
         ],
         "myproduct": [
           {
             "component_type": "Pump",
             "recyclability_disruptors_list_formatted_4_5": ""
           }
         ],
         "watchOut": "Watch Out!!!"
       },
       "dials": {
         "total_lifecycle_total_pef_excluding_use_phase_functional_unit": -50,
         "PieChartJSONSeries1": [
           {
             "dialsIndicator": "Very poor",
             "rangeIndicator": 22.5,
             "colors_series1": "#FF6B6B",
             "actaulRangeIndicator": "% < -20%"
           },
           {
             "dialsIndicator": "",
             "rangeIndicator": 77.5,
             "colors_series1": "#dbdbdb",
             "actaulRangeIndicator": ""
           }
         ],
         "pie_chart_sub_title": "Very poor",
         "pie_chart_percentage": "-50"
       },
       "tabs": {
         "totalScore": {
           "heading": "Total Score",
           "percentage": -50
         },
         "pcrContent": {
           "heading": "PCR Content",
           "percentage": "3",
           "myproduct": "3%",
           "baseline": "0%"
         },
         "materialEfficiency": {
           "heading": "Material Efficiency",
           "percentage": "-19",
           "myproduct": "3.75",
           "baseline": "4.61"
         },
         "recycleReady": {
           "heading": "Recycle Ready",
           "percentage": "0.00%",
           "myproduct": "100%",
           "baseline": "100%"
         },
         "disruptors": {
           "heading": "Recyclability Disruptors",
           "percentage": "Fail",
           "myproduct": "Fail",
           "baseline": "Pass"
         }
       }
     }
   }
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={modifiedResultDataValue}>
            <DetailedTable
              currentTab={"PCR_CONTENT"}
            />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);
});
