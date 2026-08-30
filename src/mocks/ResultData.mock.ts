import {
  FootprintStructure,
  IFootprintData,
  IGreenChemistryStructure,
  ISustainableStructure,
  ISustainableTabStructure,
  ResultContextProp,
} from '../structures/result';
import { ProductAssessmentResultMock } from './ProductAssessmentResult.mock';

export const SustainablePackagingSectionDataMock: ISustainableTabStructure = {
  totalScore: { heading: 'Total Score', percentage: 20 },
  pcrContent: {
    heading: 'Material Efficiency',
    percentage: '20',
  },
  materialEfficiency: {
    heading: 'Total Score',
    percentage: '20',
  },
  recycleReady: {
    heading: 'PCR Content',
    percentage: '20',
  },
  disruptors: {
    heading: 'Recycle Ready',
    percentage: '20',
  },
};

export const SustainablePackagingSectionDataMock1: ISustainableTabStructure = {
  totalScore: { heading: 'Total Score', percentage: -20 },
  pcrContent: {
    heading: 'Material Efficiency',
    percentage: '-20',
  },
  materialEfficiency: {
    heading: 'Total Score',
    percentage: '20',
  },
  recycleReady: {
    heading: 'PCR Content',
    percentage: '-20',
  },
  disruptors: {
    heading: 'Recycle Ready',
    percentage: '20',
  },
};

export const SustainablePackagingSectionDataMock2: ISustainableTabStructure = {
  totalScore: { heading: 'Watch List Score', percentage: 20 },
  pcrContent: {
    heading: 'GAIA Score',
    percentage: '20',
  },
  materialEfficiency: {
    heading: 'Renewable Origin Bonus',
    percentage: '20',
  },
  recycleReady: {
    heading: 'PCR Content',
    percentage: '-20',
  },
  disruptors: {
    heading: 'Recycle Ready',
    percentage: '20',
  },
};

export const SustainablePackagingSectionDataMock3: ISustainableTabStructure = {
  totalScore: { heading: 'Watch List Score', percentage: -20 },
  pcrContent: {
    heading: 'GAIA Score',
    percentage: '-20',
  },
  materialEfficiency: {
    heading: 'Renewable Origin Bonus',
    percentage: '-20',
  },
  recycleReady: {
    heading: 'PCR Content',
    percentage: '-20',
  },
  disruptors: {
    heading: 'Recycle Ready',
    percentage: '20',
  },
};

export const ResultDataMock: ResultContextProp = {
  resultData: {
    experimental: ProductAssessmentResultMock.experimental,
    isBaselinePresent: false,
    isBaselineDataComplete: false,
    baseline: ProductAssessmentResultMock.baseline,
    final: {
      ...ProductAssessmentResultMock.baseline,
      'sustainablepackaging-rollup-compare': undefined,
    },
  },
  resultFormulationData: {
    experimental: ProductAssessmentResultMock.experimental,
    isBaselinePresent: false,
    isBaselineDataComplete: false,
    baseline: ProductAssessmentResultMock.baseline,
    final: {
      ...ProductAssessmentResultMock.baseline,
      'sustainablepackaging-rollup-compare': undefined,
    },
  },
  productEnvironmentalFootprintData: {
    formulation: [
      {
        tradeName: 'test',
        rawCode: 'test',
        baseline: {
          massComposition: '12.00',
          carbonFootprint: 12,
        },
        myProduct: {
          massComposition: '12.00',
          carbonFootprint: 12,
        },
      },
    ],
    packaging: {
      consumerPackaging: [
        {
          componentName: 'test',
          componentWeight: 'test',
          details: [
            {
              materialName: 'test',
              materialType: 'test',
              convertingProcess: 'test',
              finishingProcess: 'test',
              baselineWeight: 'test',
              baselineMaterialWeight: 'test',
              baselineEnvironmentalFootprint: 12,
              myProductWeight: 'test',
              myProductMaterialWeight: 'test',
              myProductEnvironmentalFootprint: 12,
              baselineMaterialWeightDose: 'test',
              myProductMaterialWeightDose: 'test',
              baselineMaterialPCRContent: 'test',
              myProductMaterialPCRContent: 'test',
            },
          ],
        },
      ],
    },
    dials: {
      PieChartJSONSeries1: [
        {
          actaulRangeIndicator: 'test',
          colors_series1: 'test',
          dialsIndicator: 'test',
          rangeIndicator: 10,
          data_series1: '1',
        },
      ],
      pie_chart_percentage: 'test',
      pie_chart_sub_title: 'test',
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: 10,
    },
  } as unknown as FootprintStructure,
  carbonFootprintData: {
    formulation: [
      {
        tradeName: 'test',
        rawCode: 'test',
        baseline: {
          massComposition: 'test',
          carbonFootprint: 12,
        },
        myProduct: {
          massComposition: 'test',
          carbonFootprint: 12,
        },
      },
    ],
    packaging: {
      consumerPackaging: [
        {
          componentName: 'test',
          componentWeight: 'test',
          details: [
            {
              materialName: 'test',
              materialType: 'test',
              convertingProcess: 'test',
              finishingProcess: 'test',
              baselineWeight: 'test',
              baselineMaterialWeight: 'test',
              baselineEnvironmentalFootprint: 12,
              myProductWeight: 'test',
              myProductMaterialWeight: 'test',
              myProductEnvironmentalFootprint: 12,
              baselineMaterialWeightDose: 'test',
              myProductMaterialWeightDose: 'test',
              baselineMaterialPCRContent: 'test',
              myProductMaterialPCRContent: 'test',
            },
          ],
        },
      ],
    },
    dials: {
      PieChartJSONSeries1: [
        {
          actaulRangeIndicator: 'test',
          colors_series1: 'test',
          dialsIndicator: 'test',
          rangeIndicator: 10,
          data_series1: '1',
        },
      ],
      pie_chart_percentage: 'test',
      pie_chart_sub_title: 'test',
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: 10,
    },
  } as unknown as FootprintStructure,
  sustainablePackagingData: {
    pcrContent: {
      dialData: { baseline: 'test', myproduct: 'test', per_pcr_diff: 'test' },
      pcrTableData: {},
    },
    materialEfficiency: {
      barData: { baseline: 'test', myproduct: 'test' },
      detailedData: [
        {
          componentName: 'test',
          componentWeight: 'test',
          details: [
            {
              materialName: 'test',
              materialType: 'test',
              convertingProcess: 'test',
              finishingProcess: 'test',
              baselineWeight: 'test',
              baselineMaterialWeight: 'test',
              baselineEnvironmentalFootprint: 12,
              myProductWeight: 'test',
              myProductMaterialWeight: 'test',
              myProductEnvironmentalFootprint: 12,
              baselineMaterialWeightDose: 'test',
              myProductMaterialWeightDose: 'test',
              baselineMaterialPCRContent: 'test',
              myProductMaterialPCRContent: 'test',
            },
          ],
        },
      ],
    },
    recycleReady: {
      barData: [
        {
          category: 'test',
          value: 12,
        },
      ],
      detailedData: [
        {
          componentType: 'test',
          packagingLayer: 'test',
          baselineProduct: {
            weight: 'test',
            recycleReady: 'test',
          },
          myProduct: {
            weight: 'test',
            recycleReady: 'test',
          },
        },
      ],
    },
    disruptors: { baselineProduct: {}, myproduct: {}, watchOut: 'string' },
    dials: {
        pie_chart_sub_title:"Good"
    },
    tabs: SustainablePackagingSectionDataMock,
  } as ISustainableStructure,
  greenChemistryData: {
    renewableOriginBonus: {
      dialData: { baseline: 'test', myproduct: 'test', per_pcr_diff: 'test' },
      robTableData: [
        {
          rawMaterialTradeName: 'test',
          rawCode: 'test',
          baselineWeight: 'test',
          baselineOrganic: 'test',
          baselineRenewable: 'test',
          myProductWeight: 'test',
          myProductOrganic: 'test',
          myProductRenewable: 'test',
        },
      ],
    },
    dials: {
      PieChartJSONSeries1: [
        {
          actaulRangeIndicator: 'test',
          colors_series1: 'test',
          dialsIndicator: 'test',
          rangeIndicator: 2,
        },
      ],
      pie_chart_percentage: 'test',
      pie_chart_sub_title: 'test',
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: 2,
    },
    tabs: {
      totalScore: {
        heading: 'test',
        percentage: 'test',
      },
      gaiaScore: {
        heading: 'test',
        percentage: 'test',
      },
      watchListScore: {
        heading: 'test',
        percentage: 'test',
      },
      renewableOriginBonus: {
        heading: 'test',
        percentage: 'test',
      },
    },
    watchList: {
      baselineData: [
        {
          'Constituent ID': 'CON002067',
          'Constituent Name': 'Caprylyl Glycol',
          Score: 3,
          Reason:
            'Medium likelihood of None in > 3 years. Consider alternatives. Additional context: None',
          rawMaterials: ['RAW92665561'],
          overall_scores: 3,
        },
        {
          'Constituent ID': 'CON002067',
          'Constituent Name': 'Caprylyl Glycol',
          Score: 5,
          Reason:
            'Medium likelihood of None in > 3 years. Consider alternatives. Additional context: None',
          rawMaterials: ['RAW92665561'],
          overall_scores: 3,
        },
        {
          'Constituent ID': 'CON002067',
          'Constituent Name': 'Caprylyl Glycol',
          Score: 2,
          Reason:
            'Medium likelihood of None in > 3 years. Consider alternatives. Additional context: None',
          rawMaterials: ['RAW92665561'],
          overall_scores: 3,
        },
      ],
      myProductData: {},
      max_watchlist_score_baseline: '12',
      max_watchlist_score_myproduct: '8',
    },
    gaiaScore: {
      baselineData: {
        raw_materials: [
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 12,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 85,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
        ],
        step_3_raw_sum_without_water: 12,
        step_8_fml_GAIA_score: 12,
        step_16_count_of_raws: 12,
        step_17_count_of_not_preferred: 12,
        step_18_count_of_less_preferred: 12,
        step_19_count_of_most_preferred: 12,
      },
      myProductData: {
        raw_materials: [
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 12,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 85,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
        ],
        step_3_raw_sum_without_water: 12,
        step_8_fml_GAIA_score: 12,
        step_16_count_of_raws: 12,
        step_17_count_of_not_preferred: 12,
        step_18_count_of_less_preferred: 12,
        step_19_count_of_most_preferred: 12,
      },
      max_watchlist_score_baseline: '12',
      max_watchlist_score_myproduct: '8',
    },
  } as unknown as IGreenChemistryStructure,
  setCurrentTab: jest.fn(),
  setCurrentSustainableSection: jest.fn(),
  setCurrentGreenChemistrySection: jest.fn(),
  footPrintData: [] as IFootprintData[],
  currentTab: '1',
  currentSustainableSection: 'currentSustainableSection',
  currentGreenChemistrySection: 'currentGreenChemistrySection',
  resultDataRefetch: jest.fn(),
  refetchResultBaseline: jest.fn(),
  packakingComponetList: null,
  dialsError: false,
  dialsErrorMsg: "",
};
export const ResultDataMockAssessment: ResultContextProp = {
  resultData: {
    experimental: ProductAssessmentResultMock.experimental,
    isBaselinePresent: false,
    isBaselineDataComplete: false,
    baseline: ProductAssessmentResultMock.baseline,
    final: {
      ...ProductAssessmentResultMock.baseline,
      'sustainablepackaging-rollup-compare': undefined,
    },
  },
  resultFormulationData: {
    experimental: ProductAssessmentResultMock.experimental,
    isBaselinePresent: false,
    isBaselineDataComplete: false,
    baseline: ProductAssessmentResultMock.baseline,
    final: {
      ...ProductAssessmentResultMock.baseline,
      'sustainablepackaging-rollup-compare': undefined,
    },
  },
  productEnvironmentalFootprintData: {
    formulation: [
     
    ],
    packaging: {
      consumerPackaging: [
        {
          componentName: 'test',
          componentWeight: 'test',
          details: [
            {
              materialName: 'test',
              materialType: 'test',
              convertingProcess: 'test',
              finishingProcess: 'test',
              baselineWeight: 'test',
              baselineMaterialWeight: 'test',
              baselineEnvironmentalFootprint: 12,
              myProductWeight: 'test',
              myProductMaterialWeight: 'test',
              myProductEnvironmentalFootprint: 12,
              baselineMaterialWeightDose: 'test',
              myProductMaterialWeightDose: 'test',
              baselineMaterialPCRContent: 'test',
              myProductMaterialPCRContent: 'test',
            },
          ],
        },
      ],
    },
    dials: {
      PieChartJSONSeries1: [
        {
          actaulRangeIndicator: 'test',
          colors_series1: 'test',
          dialsIndicator: 'test',
          rangeIndicator: 10,
          data_series1: '1',
        },
      ],
      pie_chart_percentage: 'test',
      pie_chart_sub_title: 'test',
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: 10,
    },
  } as unknown as FootprintStructure,
  carbonFootprintData: {
    formulation: [
      
    ],
    packaging: {
      consumerPackaging: [
        {
          componentName: 'test',
          componentWeight: 'test',
          details: [
            {
              materialName: 'test',
              materialType: 'test',
              convertingProcess: 'test',
              finishingProcess: 'test',
              baselineWeight: 'test',
              baselineMaterialWeight: 'test',
              baselineEnvironmentalFootprint: 12,
              myProductWeight: 'test',
              myProductMaterialWeight: 'test',
              myProductEnvironmentalFootprint: 12,
              baselineMaterialWeightDose: 'test',
              myProductMaterialWeightDose: 'test',
              baselineMaterialPCRContent: 'test',
              myProductMaterialPCRContent: 'test',
            },
          ],
        },
      ],
    },
    dials: {
      PieChartJSONSeries1: [
        {
          actaulRangeIndicator: 'test',
          colors_series1: 'test',
          dialsIndicator: 'test',
          rangeIndicator: 10,
          data_series1: '1',
        },
      ],
      pie_chart_percentage: 'test',
      pie_chart_sub_title: 'test',
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: 10,
    },
  } as unknown as FootprintStructure,
  sustainablePackagingData: {
    pcrContent: {
      dialData: { baseline: 'test', myproduct: 'test', per_pcr_diff: 'test' },
      pcrTableData: {},
    },
    materialEfficiency: {
      barData: { baseline: 'test', myproduct: 'test' },
      detailedData: [
        {
          componentName: 'test',
          componentWeight: 'test',
          details: [
            {
              materialName: 'test',
              materialType: 'test',
              convertingProcess: 'test',
              finishingProcess: 'test',
              baselineWeight: 'test',
              baselineMaterialWeight: 'test',
              baselineEnvironmentalFootprint: 12,
              myProductWeight: 'test',
              myProductMaterialWeight: 'test',
              myProductEnvironmentalFootprint: 12,
              baselineMaterialWeightDose: 'test',
              myProductMaterialWeightDose: 'test',
              baselineMaterialPCRContent: 'test',
              myProductMaterialPCRContent: 'test',
            },
          ],
        },
      ],
    },
    recycleReady: {
      barData: [
        {
          category: 'test',
          value: 12,
        },
      ],
      detailedData: [
        {
          componentType: 'test',
          packagingLayer: 'test',
          baselineProduct: {
            weight: 'test',
            recycleReady: 'test',
          },
          myProduct: {
            weight: 'test',
            recycleReady: 'test',
          },
        },
      ],
    },
    disruptors: { baselineProduct: {}, myproduct: {}, watchOut: 'string' },
    dials: {
      pie_chart_sub_title: "Good"
    },
    tabs: SustainablePackagingSectionDataMock,
  } as ISustainableStructure,
  greenChemistryData: {
    renewableOriginBonus: {
      dialData: { baseline: 'test', myproduct: 'test', per_pcr_diff: 'test' },
      robTableData: [
        {
          rawMaterialTradeName: 'test',
          rawCode: 'test',
          baselineWeight: 'test',
          baselineOrganic: 'test',
          baselineRenewable: 'test',
          myProductWeight: 'test',
          myProductOrganic: 'test',
          myProductRenewable: 'test',
        },
      ],
    },
    dials: {
      PieChartJSONSeries1: [
        {
          actaulRangeIndicator: 'test',
          colors_series1: 'test',
          dialsIndicator: 'test',
          rangeIndicator: 2,
        },
      ],
      pie_chart_percentage: 'test',
      pie_chart_sub_title: 'test',
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: 2,
    },
    tabs: {
      totalScore: {
        heading: 'test',
        percentage: 'test',
      },
      gaiaScore: {
        heading: 'test',
        percentage: 'test',
      },
      watchListScore: {
        heading: 'test',
        percentage: 'test',
      },
      renewableOriginBonus: {
        heading: 'test',
        percentage: 'test',
      },
    },
    watchList: {
      baselineData: [
        {
          'Constituent ID': 'CON002067',
          'Constituent Name': 'Caprylyl Glycol',
          Score: 3,
          Reason:
            'Medium likelihood of None in > 3 years. Consider alternatives. Additional context: None',
          rawMaterials: ['RAW92665561'],
          overall_scores: 3,
        },
        {
          'Constituent ID': 'CON002067',
          'Constituent Name': 'Caprylyl Glycol',
          Score: 5,
          Reason:
            'Medium likelihood of None in > 3 years. Consider alternatives. Additional context: None',
          rawMaterials: ['RAW92665561'],
          overall_scores: 3,
        },
        {
          'Constituent ID': 'CON002067',
          'Constituent Name': 'Caprylyl Glycol',
          Score: 2,
          Reason:
            'Medium likelihood of None in > 3 years. Consider alternatives. Additional context: None',
          rawMaterials: ['RAW92665561'],
          overall_scores: 3,
        },
      ],
      myProductData: {},
      max_watchlist_score_baseline: '12',
      max_watchlist_score_myproduct: '8',
    },
    gaiaScore: {
      baselineData: {
        raw_materials: [
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 12,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 85,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
        ],
        step_3_raw_sum_without_water: 12,
        step_8_fml_GAIA_score: 12,
        step_16_count_of_raws: 12,
        step_17_count_of_not_preferred: 12,
        step_18_count_of_less_preferred: 12,
        step_19_count_of_most_preferred: 12,
      },
      myProductData: {
        raw_materials: [
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 12,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
          {
            compositions: [
              {
                CONNumber: 'test',
                Gaia_Score: 'test',
                USINCIName: 'test',
                con_adjusted_composition_without_water: 12,
                percentage: 'test',
                step_2_con_adjusted_composition_without_water: 12,
                step_5_gaia_con_score_without_water: {
                  gaia_score: 12,
                  step_5_gaia_con_score_without_water: 12,
                },
                step_9_deficit_GAIA_CON_score: 12,
                step_10_assign_gaia_score_weight: 12,
                step_11_deficit_GAIA_CON_weighted_score: 12,
                step_12_deficit_GAIA_CON_score_without_water: 12,
              },
            ],
            rawMaterialID: 'test',
            raw_material_value: 12,
            step_1_chemical_sum_without_water: 12,
            step_4_raw_adjusted_composition_without_water: 12,
            step_6_GAIA_RAW_score: 85,
            step_7_GAIA_RAW_in_FML: 12,
            step_13_deficit_GAIA_RAW_score: 12,
            step_14_deficit_GAIA_RAW_in_FML: 12,
            tradeName: 'test',
          },
        ],
        step_3_raw_sum_without_water: 12,
        step_8_fml_GAIA_score: 12,
        step_16_count_of_raws: 12,
        step_17_count_of_not_preferred: 12,
        step_18_count_of_less_preferred: 12,
        step_19_count_of_most_preferred: 12,
      },
      max_watchlist_score_baseline: '12',
      max_watchlist_score_myproduct: '8',
    },
  } as unknown as IGreenChemistryStructure,
  setCurrentTab: jest.fn(),
  setCurrentSustainableSection: jest.fn(),
  setCurrentGreenChemistrySection: jest.fn(),
  footPrintData: [] as IFootprintData[],
  currentTab: '1',
  currentSustainableSection: 'currentSustainableSection',
  currentGreenChemistrySection: 'currentGreenChemistrySection',
  resultDataRefetch: jest.fn(),
  refetchResultBaseline: jest.fn(),
  packakingComponetList: null,
  dialsError: true,
  dialsErrorMsg:''
};

