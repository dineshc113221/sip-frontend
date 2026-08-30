import { render, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { GlobalDataMock } from "../../../../../mocks/GlobalData.mock.json";
import UserDetailsMock from "../../../../../mocks/UserDetails.mock.json";
import { ProductDetailsMock } from "../../../../../mocks/ProductDetails.mock";
import axios from "axios";
import { ReactInfiniteProps } from "../../../../../mocks/CoreLogin.mock";
import { ResultDataMock } from "../../../../../mocks/ResultData.mock";
import { useGlobaldata } from "../../../../../contexts/masterData/DataContext";
import { useGetProductDetailByID } from "../../../../../hooks/UseGetProductDetails";
import { ResultDataContext } from "../../../../../contexts/resultData/ResultDataContext";
import DetailedTableDisruptors from "../DetailedTableDisruptors";

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
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

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({});

jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseGetProductDetailsByID = useGetProductDetailByID as jest.Mock;

jest.mock("../../../../../contexts/masterData/DataContext");
jest.mock("../../../../../hooks/UseGetProductDetails");

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
const mockedUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
  params: () => mockedUseParams,
  useParams: () => mockedUseParams,
  Link: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("react-toastify/dist/ReactToastify.css", () => ({}));

jest.mock("react-infinite-scroll-component", () => {
  return ({
    children,
    next,
    hasMore,
    loader,
    endMessage,
  }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? <button onClick={next}>Load More</button> : endMessage}
        {loader}
      </div>
    );
  };
});

jest.mock("@amcharts/amcharts5", () => ({
  Root: {
    new:
      () => {
        return ({
          setThemes: jest.fn(),
          container: {
            children: {
              push: () => {
                return ({
                  children: {
                    unshift: () => { return (<div></div>) }
                  },
                  series: {
                    push: () => {
                      return ({
                        set: () => { return (<div></div>) },
                        ticks: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        labels: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        slices: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        data: {
                          setAll: () => { return (<div></div>) }
                        },
                      })
                    },

                  },
                  seriesContainer: {
                    children: {
                      push: () => { return (<div></div>) }
                    }
                  },
                })
              }
            }
          },
          dispose: () => { return (<div></div>) }
        })
      }
  },
  Label: {
    new: () => { return (<div></div>) }
  },
  Picture: {
    new: () => { return (<div></div>) }
  },
  Tooltip: {
    new: () => { return (<div></div>) }
  },
  ColorSet: {
    new: () => { return (<div></div>) }
  },
  percent: jest.fn(),
  color: jest.fn()
}));
jest.mock("@amcharts/amcharts5/percent", () => ({
  PieChart: {
    new: () => { return (<div></div>) }
  },
  PieSeries: {
    new: () => { return (<div></div>) }
  },
}));
jest.mock("@amcharts/amcharts5/themes/Animated", () => ({
  new: () => { return (<div></div>) }
}));

jest.mock("@amcharts/amcharts5/xy", () => ({
  XYChart: {
    new: () => { return (<div></div>) }
  },
  AxisRendererX: {
    new: () => { return (<div></div>) }
  },
  CategoryAxis: {
    new: () => { return (<div></div>) }
  },
  ValueAxis: {
    new: () => { return (<div></div>) }
  },
  AxisRendererY: {
    new: () => { return (<div></div>) }
  },
  ColumnSeries: {
    new: () => { return (<div></div>) }
  },
}));

describe("DetailedTableDisruptors", () => {
  // const value = {
  //   productData: {
  //     productId: "",
  //     productName: "",
  //     brandName: "",
  //     productSipId: "",
  //   },
  //   usersData: [
  //     {
  //       "name": "Chandra Raju, Kavyashree [Non-Kenvue]",
  //       "role": "Owner",
//       "mail": "KChand02@kenvue.com"
  //     }
  //   ],
  //   refetch: () => { },
  //   assessmentsData: {
  //     assessmentId: '',
  //     name: '',
  //     _id: '',
  //   },
  //   formulation: null,
  //   primaryPackaging: null,
  //   secondaryPackaging: null,
  //   assessmentsType: "experimental",
  //   packagingData: null,
  //   fetchingDataInProgress: false,
  //   isBaselinePresent: false,
  //isBaselineDataComplete: false,

  // };
  const resultDataValue = ResultDataMock;
  const refetchMock = jest.fn();
  mockedAxios.delete.mockResolvedValue({
    status: 204,
  });
  mockedAxios.put.mockResolvedValue({
    status: 204,
  });

  mockedAxios.delete.mockResolvedValue({
    status: 200,
  });

  mockedAxios.post.mockResolvedValue(UserDetailsMock);

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

  beforeEach(() => {
    jest.clearAllMocks();
  
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(ProductDetailsMock),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
  it("should render the component", async () => {
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: ProductDetailsMock,
      refetch: refetchMock,
    }));
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ResultDataContext.Provider value={resultDataValue}>
            <DetailedTableDisruptors baseline={true} />
          </ResultDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);
 it('renders rows only when recyclability_disruptors_list_formatted_4_5 is not present', () => {
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
    render(
      <ResultDataContext.Provider value={modifiedResultDataValue}>
        <DetailedTableDisruptors baseline={true} />
      </ResultDataContext.Provider>
    );


 });
  it('renders rows only when recyclability_disruptors_list_formatted_4_5 is present', () => {
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
             "recyclability_disruptors_list_formatted_4_5": "test"
           }
         ],
         "myproduct": [
           {
             "component_type": "Pump",
             "recyclability_disruptors_list_formatted_4_5": "test"
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
    render(
      <ResultDataContext.Provider value={modifiedResultDataValue}>
        <DetailedTableDisruptors baseline={true} />
      </ResultDataContext.Provider>
    );


  });
});
