import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import {
  useGetBaselineTableResults,
  useGetProductAssessmentResultByID,
} from "../../hooks/UseGetProductDetails";
import {
  ResultDataType,
  ResultContextProp,
  ResultProviderProps,
  FootprintStructure,
  ISustainableStructure,
  IPEFData,
  IFootprintData,
  IRawMaterial,
  IEolRawMaterial,
  IGreenChemistryStructure,
  GaiaScoreMaterialProps,
  RenewableRawMaterial,
} from "../../structures/result";
import {
  getRawMaterialDataFormulation,
  extractDialData,
  calculateFootprintTabs,
  getRawMaterialDataGCDetailedResult,
  formatComponents,
} from "../../helper/GenericFunctions";
import {
  ComponentDetail,
  Component,
  IPackagingLevelObject,
  IComponentLevelObject,
  IComponentMaterialObject,
  PackagingComponentData,
} from "../../structures/packaging";
import {
  ASSESSMENT_TYPE,
  CURRENT_TAB,
  GREEN_CHEMISTRY_SECTIONS,
  SUSTAINABLE_SECTIONS,
} from "../../constants/String.constants";
import { AxiosError } from "axios";
import { AutoSaveContext } from "../autoSaveContext/AutoSaveContext";

// helper object
const pefLifeCycleStateHelper: { [key: string]: string } = {
  "Raw Material \n Production": "raw_material_production_functional_unit",
  "Packaging \nProduction": "pack_production_functional_unit",
  "Finished Product \n Manufacturing": "manufacturing_functional_unit",
  "Storage & \nDistribution": "distribution_functional_unit",
  "Consumer Use": "use_phase_functional_unit",
  "Formula End-\n    -of-Life": "formula_eol_functional_unit",
  "Packaging \nEnd-of Life": "pack_eol_functional_unit",
};

// helper object for Product Carbon Footprint barchart
const CF_pefLifeCycleStateHelper: { [key: string]: string } = {
  "Raw Material \n Production": "raw_material_production",
  "Packaging \nProduction": "pack_production",
  "Finished Product \n Manufacturing": "manufacturing",
  "  Storage & \nDistribution": "distribution",
  "Consumer \n Use": "use_phase",
  "Formula \nEnd-of-Life": "formula_eol",
  "Packaging \nEnd-of Life": "pack_eol",
};

// Separate function to update a single footprint item
const updateFootprint = (
  item: IFootprintData,
  rawMatId: string,
  envFootprintValue: number,
  carbonFootprintValue: number,
  gaiaScore: string,
  leaf_icon_boolean: string,
  watchlist_icon_boolean: string
): IFootprintData => {
  if (item.rawMaterialId === rawMatId) {
    return {
      ...item,
      envFootprint: envFootprintValue,
      carbonFootprint: carbonFootprintValue,
      gaiaScore: gaiaScore,
      leaf_icon_boolean: leaf_icon_boolean,
      watchlist_icon_boolean: watchlist_icon_boolean
    };
  }
  return { ...item };
  
};


// Separate function to create the updated footprint array
const getUpdatedFootprints = (
  prevValues: IFootprintData[],
  rawMatId: string,
  envFootprintValue: number,
  carbonFootprintValue: number,
  gaiaScore: string,
  leaf_icon_boolean: string,
  watchlist_icon_boolean: string
): IFootprintData[] => {
  return prevValues.map((item) =>
    updateFootprint(item, rawMatId, envFootprintValue, carbonFootprintValue, gaiaScore,
      leaf_icon_boolean,
      watchlist_icon_boolean)
  );
};
const defaultDials = {
  PieChartJSONSeries1: [
    {
      actaulRangeIndicator: "",
      colors_series1: "",
      dialsIndicator: "",
      rangeIndicator: 0,
      data_series1: "",
    },
    {
      actaulRangeIndicator: "",
      colors_series1: "",
      dialsIndicator: "",
      rangeIndicator: 0,
      data_series1: "",
    },
  ],
  pie_chart_percentage: "0",
  pie_chart_sub_title: "",
  total_lifecycle_total_pef_excluding_use_phase_functional_unit: 0,
};

const defaultTabs = {
  totalProduct: { percentage: 0, myproduct: 0, baseline: 0 },
  formulation: { percentage: 0, myproduct: 0, baseline: 0 },
  packaging: { percentage: 0, myproduct: 0, baseline: 0 },
};

const defaultSustainableTabs = {
  totalScore: { heading: "Total Score", percentage: 30 },
  pcrContent: {
    heading: "PCR Content",
    percentage: "0",
    myproduct: "0",
    baseline: "0",
  },
  materialEfficiency: {
    heading: "Material Efficiency",
    percentage: "0",
    myproduct: "0",
    baseline: "0",
  },
  recycleReady: {
    heading: "Recycle Ready",
    percentage: "0",
    myproduct: "23",
    baseline: "32",
  },
  disruptors: {
    heading: "Recyclability Disruptors",
    percentage: "Pass",
    myproduct: "Pass",
    baseline: "Pass",
  },
};
const defaultGreenChemistryTabs = {
  totalScore: {
    heading: "Total Score",
    percentage: "0",
    myproduct: "0",
    baseline: "0",
  },
  gaiaScore: {
    heading: "GAIA Score",
    percentage: "0",
    myproduct: "0",
    baseline: "0",
  },
  watchListScore: {
    heading: "Watch List Score",
    percentage: "0",
    myproduct: "0",
    baseline: "0",
  },
  renewableOriginBonus: {
    heading: "Renewable Origin Bonus",
    percentage: "0",
    myproduct: "0",
    baseline: "0",
  },
};

// Initial state templates
const initialFootprintStructure = {
  totalProduct: { barData: [] },
  formulation: [],
  packaging: {},
  dials: defaultDials,
  tabs: defaultTabs,
};

const initialSustainablePackagingData = {
  pcrContent: {
    dialData: { baseline: "0", myproduct: "0", per_pcr_diff: "0" },
    pcrTableData: {},
  },
  materialEfficiency: {
    barData: { baseline: "0", myproduct: "0" },
    detailedData: [],
  },
  recycleReady: { barData: [], detailedData: [] },
  disruptors: { baselineProduct: {}, myproduct: {}, watchOut: "" },
  dials: defaultDials,
  tabs: defaultSustainableTabs,
};
const initialGreenChemistryData = {
  renewableOriginBonus: {
    dialData: { baseline: "0", myproduct: "0", per_pcr_diff: "0" },
    robTableData: [{
      rawMaterialTradeName: "",
      rawCode: "",
      baselineWeight: "0.00",
      baselineOrganic: "0.00",
      baselineRenewable: "0.00",
      myProductWeight: "0.00",
      myProductOrganic: "0.00",
      myProductRenewable: "0.00"
    }],
    totalPercent: { baselineOrganic: '0.00', baselineRenewable: '0.00', myproductOrganic: '0.00', myproductRenewable: '0.00' },
    regression: false
  },
  dials: defaultDials,
  tabs: defaultGreenChemistryTabs,
  watchList: { baselineData: {}, myProductData: {}, max_watchlist_score_baseline: '0', max_watchlist_score_myproduct: '0' },
  gaiaScore: { baselineData: {}, myProductData: {} }
};

export const ResultDataContext = createContext<ResultContextProp>({
  resultData: null,
  resultFormulationData: null,
  productEnvironmentalFootprintData: initialFootprintStructure,
  carbonFootprintData: initialFootprintStructure,
  sustainablePackagingData: initialSustainablePackagingData,
  greenChemistryData: initialGreenChemistryData,
  assessmentsType: null,
  setCurrentTab: () => { },
  setCurrentSustainableSection: () => { },
  currentGreenChemistrySection: "",
  setCurrentGreenChemistrySection: () => { },
  footPrintData: [],
  currentTab: "",
  currentSustainableSection: "",
  resultDataRefetch: () => { },
  refetchResultBaseline: () => { },
  packakingComponetList: null,
  dialsErrorMsg: "",
  dialsError: true,
  resultkey:""
});

export const ResultDataProvider: React.FC<ResultProviderProps> = ({
  children,
  assessmentType,
  productId,
  assessmentId,
}) => {
  const resultkey = `${assessmentType.toLowerCase()}` as const;
  const [resultData, setResultData] = useState<ResultDataType | null>(null);
  const { setIsDialsSidebarError } = useContext(AutoSaveContext);
  const [resultFormulationData, setResultFormulationData] = useState<ResultDataType | null>(null);
  const [packakingComponetList, setPackakingComponetList] = useState<IPackagingLevelObject | null>(null);
  const [currentTab, setCurrentTab] = useState<string>(
    "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
  );
  const [currentSustainableSection, setCurrentSustainableSection] =
    React.useState<string>(SUSTAINABLE_SECTIONS.TOTAL_SCORE);
  const [currentGreenChemistrySection, setCurrentGreenChemistrySection] =
    React.useState<string>(GREEN_CHEMISTRY_SECTIONS.TOTAL_SCORE);
  const [
    productEnvironmentalFootprintData,
    setProductEnvironmentalFootprintData,
  ] = useState<FootprintStructure>(initialFootprintStructure);

  const [carbonFootprintData, setCarbonFootprintData] =
    useState<FootprintStructure>(initialFootprintStructure);

  const [sustainablePackagingData, setSustainablePackagingData] =
    useState<ISustainableStructure>(initialSustainablePackagingData);
  const [greenChemistryData, setGreenChemistryData] =
    useState<IGreenChemistryStructure>(initialGreenChemistryData);
  const [footPrintData, setFootPrintData] = useState<IFootprintData[]>([]);
  const { data: resultAllresponse,  error,
    isError,refetch: resultDataRefetch } = useGetProductAssessmentResultByID(productId, assessmentId, assessmentType);
  const { data: resultBaseline, refetch: refetchResultBaseline } = useGetBaselineTableResults(productId, assessmentId, assessmentType);
 
const dialsError = useMemo(() => {
  if (isError) {
 
    return true; // Fallback to `true`
  }
  return resultAllresponse?.error;
}, [resultAllresponse, isError]);

  useEffect(() => {
    setIsDialsSidebarError(dialsError)
  },[dialsError, setIsDialsSidebarError])
const dialsErrorMsg = useMemo(() => {
  if (isError) {
    if (error && (error as AxiosError).response) {
      const axiosError = error as AxiosError<{ message: string }>;
      return (
        axiosError.response?.data?.message ||
        "Enter both your formulation and packaging data and hit 'calculate' to view results"
      );
    }
    return "Enter both your formulation and packaging data and hit 'calculate' to view results";
  }
  return resultAllresponse?.message;
}, [resultAllresponse, isError, error]);

const data = useMemo(() => {
  if (isError) {
    return {}; // Fallback to an empty object
  }
  return resultAllresponse?.data || {};
}, [resultAllresponse, isError]);
  useEffect(() => {
    setCurrentSustainableSection(SUSTAINABLE_SECTIONS.TOTAL_SCORE);
    setCurrentGreenChemistrySection(GREEN_CHEMISTRY_SECTIONS.TOTAL_SCORE);
  }, [currentTab]);
  useEffect(() => {
    if (resultDataRefetch) {
      resultDataRefetch();
    }
    if (refetchResultBaseline) {
      refetchResultBaseline();
    }
  }, [
    assessmentId,
    assessmentType,
    productId,
    resultDataRefetch,
    refetchResultBaseline,
  ]);

  useEffect(() => {
    setResultData(data);
    setResultFormulationData(resultBaseline);
    if (data) {
      assessmentType === "baseline" ? setPackakingComponetList(data.baselinePackaging?.packaging_level) :
        setPackakingComponetList(data.myProductPackaging?.packaging_level)
    }

  }, [data, assessmentType,resultBaseline]);

 useEffect(() => {
    if (data) {
      // Extract product environmental footprint data
      const productEnvironmentalFootprint = getRawMaterialDataFormulation(
        data[resultkey],
        data?.baseline,
        1000000,
        "productEnvironmental"
      );


      // Set product environmental footprint data
      setProductEnvironmentalFootprintData((prev) => ({
        ...prev,
        formulation: productEnvironmentalFootprint,
        dials: extractDialData(
          data[resultkey]?.totallca,
          data?.baseline?.totallca,
          "productEnvironmental"
        ),
      }));

      // Extract Product Carbon Footprint data similarly
      const carbonFootprint = getRawMaterialDataFormulation(
        data[resultkey],
        data?.baseline,
        1000,
        "carbonFootprint"
      );
      setProductEnvironmentalFootprintData((prev) => ({
        ...prev,
        formulation: carbonFootprint,
        dials: extractDialData(
          data[resultkey]?.totallca,
          data?.baseline?.totallca,
          "carbonFootprint"
        ),
      }));  


      const dialPEFPercentage = extractDialData(
        data?.[assessmentType]?.totallca ?? {},
        data?.baseline?.totallca ?? {},
        "productEnvironmental"
      );

      const productEnvironmentalFootprintTabsData = calculateFootprintTabs(
        data,
        assessmentType,
        {
          totalProduct:
            "total_lifecycle_total_pef_excluding_use_phase_functional_unit",
          formulation: "total_formulation_TOTAL_PEF_functional_unit",
          packaging: "total_packaging_TOTAL_PEF_functional_unit",
        },
        1000000 // Multiplier for PEF
      );

      // Update state for product environmental footprint
      setProductEnvironmentalFootprintData((prev) => ({
        ...prev,
        formulation: productEnvironmentalFootprint,
        dials: dialPEFPercentage,
        tabs: productEnvironmentalFootprintTabsData,
      }));

      const dialCFPercentage = extractDialData(
        data?.[assessmentType]?.totallca ?? {},
        data?.baseline?.totallca ?? {},
        "carbonFootprint"
      );

      const carbonFootprintData = calculateFootprintTabs(
        data,
        assessmentType,
        {
          totalProduct:
            "total_lifecycle_pre_normalization_excluding_use_phase.climate_change_functional_unit",
          formulation:
            "total_formulation_pre_normalization.climate_change_functional_unit",
          packaging:
            "total_packaging_pre_normalization.climate_change_functional_unit",
        },
        1000 // Multiplier for Product Carbon Footprint
      );

      // Update state for Product Carbon Footprint
      setCarbonFootprintData((prev) => ({
        ...prev,
        formulation: carbonFootprint,
        dials: dialCFPercentage,
        tabs: carbonFootprintData,
      }));

      const dialSPPercentage = extractDialData(
        data?.[assessmentType] ?? {},
        data?.baseline ?? {},
        "sustainablePackaging"
      );

      // Update state for Packaging Circularity
      setSustainablePackagingData((prev) => ({
        ...prev,
        dials: dialSPPercentage,
      }));
    }
  }, [data, assessmentId, resultkey, assessmentType, productId]);

  //BarChart Related States --> Naveen

  useEffect(() => {
    const configurePefData = (
      myProductData: IPEFData,
      baselineData: IPEFData,
      type: string
    ) => {
      const values = Object.keys(pefLifeCycleStateHelper) as Array<
        keyof IPEFData
      >;
      if (currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT) {
        const data = values.map((item) => {
          return {
            lifecyclestage: item,
            myproduct:
              myProductData[pefLifeCycleStateHelper[item] as keyof IPEFData] *
              1000000,
            baseline:
             baselineData ?  baselineData[pefLifeCycleStateHelper[item] as keyof IPEFData] *
              1000000 : null
          };
        });
        if (type === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
          setProductEnvironmentalFootprintData((prevState) => ({
            ...prevState,
            totalProduct: { barData: data },
          }));
        }
        if (type === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
          setProductEnvironmentalFootprintData((prevState) => ({
            ...prevState,
            totalProduct: { barData: data },
          }));
        }
      }
      if (currentTab === CURRENT_TAB.CARBON_FOOTPRINT) {
        const data = values.map((item) => {
          return {
            lifecyclestage: item,
            myproduct:
              myProductData[pefLifeCycleStateHelper[item] as keyof IPEFData],
            baseline:
              baselineData[pefLifeCycleStateHelper[item] as keyof IPEFData],
          };
        });
        if (type === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
          setCarbonFootprintData((prevState) => ({
            ...prevState,
            totalProduct: { barData: data },
          }));
        }
        if (type === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
          setCarbonFootprintData((prevState) => ({
            ...prevState,
            totalProduct: { barData: data },
          }));
        }
      }
    };
    const handlePefData = (
      myProductData: IPEFData,
      baselineData: IPEFData,
      assessmentType: string
    ) => {
      if (myProductData) {
        configurePefData(myProductData, baselineData, assessmentType);
      }
    };

    const getPefData = (assessmentType: string) => {
      const initialValues: IPEFData = {
        raw_material_production_functional_unit: 0,
        pack_production_functional_unit: 0,
        manufacturing_functional_unit: 0,
        distribution_functional_unit: 0,
        use_phase_functional_unit: 0,
        formula_eol_functional_unit: 0,
        pack_eol_functional_unit: 0,
      };

      const myProductData: IPEFData = { ...initialValues };
      const baselineData: IPEFData = { ...initialValues };

      const values = Object.values(CF_pefLifeCycleStateHelper) as Array<
        keyof IPEFData
      >;

      if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
        values.forEach((item) => {
          const value =
            data?.experimental?.totallca?.pre_normalization[item]
              ?.climate_change_functional_unit * 1000;
          myProductData[item + "_functional_unit"] = value;
        });
      } else if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
        values.forEach((item) => {
          const value =
            data?.final?.totallca?.pre_normalization[item]
              ?.climate_change_functional_unit * 1000;
          myProductData[item + "_functional_unit"] = value;
        });
      }
      if (data?.isBaselinePresent) {
        values.forEach((item) => {
          const value =
            data.baseline?.totallca?.pre_normalization[item]
              ?.climate_change_functional_unit * 1000;
          baselineData[item + "_functional_unit"] = value;
        });
      }
      return { myProductData, baselineData };
    };

   if (currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT) {
  let myProductData, baselineData;

  if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
    myProductData = data?.experimental?.totallca?.total_pef;
    baselineData = data?.isBaselinePresent
      ? data?.baseline?.totallca?.total_pef
      : undefined;
  } else if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
    myProductData = data?.final?.totallca?.total_pef;
    baselineData = data?.isBaselinePresent
      ? data?.baseline?.totallca?.total_pef
      : undefined;
  }

  handlePefData(myProductData, baselineData, assessmentType);
}
 

    if (currentTab === CURRENT_TAB.CARBON_FOOTPRINT) {
      const { myProductData, baselineData } = getPefData(assessmentType);
      handlePefData(myProductData, baselineData, assessmentType);
    }
  }, [resultData, assessmentType, currentTab, assessmentId, data]);

  const capitalizeFirstLetter = (value: string) => {
    return value
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : "N/A";
  };
  // Consumer Packing ----> Naveen
  // This useEffect need to be optimised ---> Commented by Naveen ; code written by Naveen
  useEffect(() => {
    // Initialize arrays to hold baseline and product component data
    const baselineComponentData: Component[] = [];
    const productComponentData: Component[] = [];

    // Global material counter for sequential map lookup
    let globalMaterialIndex = 0;
    // Global component counter for component-level map lookup
    let globalComponentIndex = 0;

    // Helper function to build component comparison object
    const buildComponentComparison = (
      component: IComponentLevelObject,
      isBaseline: boolean,
      current_Tab?: boolean,
      materialMap?: Map<number, number>,
      componentMap?: Map<number, number>
    ): Component => {
      const componentWeight = parseFloat(component?.weight || "0");
     const componentWeightDose = parseFloat(String(component?.material_efficiency ?? 0));
const componentPCRContent = parseFloat(String(component?.PCR_Percent_Per_Component ?? 0));

      // Determine the environmental footprint value based on the tab and material data
      const getEnvironmentalFootprint = (
        currentTab: string,
        material: IComponentMaterialObject,
        pefValue?: number
      ): number => {
        if (currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT && pefValue !== undefined) {
          return parseFloat(pefValue.toFixed(6));
        }
        if (currentTab === CURRENT_TAB.CARBON_FOOTPRINT && pefValue !== undefined) {
          return parseFloat(pefValue.toFixed(6));
        }
        const environmentalFootprint =
          currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT
            ? material?.productEnvironmentalFootPrint
            : material?.carbonFootPrint;

        return parseFloat(environmentalFootprint || "0");
      };

      // Track sub-component material indices for PEF map lookup
      // capture component-level index for component map lookup
      const currentComponentIdx = globalComponentIndex++;

      const details = component?.material?.map(
        (material: IComponentMaterialObject) => {
          // Resolve PEF value from material map if provided
          let resolvedPefValue: number | undefined;
          if (materialMap) {
            resolvedPefValue = materialMap.get(globalMaterialIndex++);
          }

          const baselineEnvironmentalFootprint = isBaseline
            ? getEnvironmentalFootprint(currentTab, material, resolvedPefValue)
            : 0;
          const myProductEnvironmentalFootprint = !isBaseline
            ? getEnvironmentalFootprint(currentTab, material, resolvedPefValue)
            : 0;
          return {
            sub_component_name:material?.sub_component_name,
            materialName: material?.material_name,
            convertingProcess: material?.converting_process,
            finishingProcess: component?.finishing_process,
            materialType: material?.material_type,
            layer: material?.layer,
            baselineWeight: isBaseline && current_Tab ? (material.material_pct).toString() : null,
            myProductWeight: isBaseline && current_Tab ? null : (material.material_pct).toString(),
            baselineMaterialWeight: isBaseline
              ? material?.material_weight
              : null,
            myProductMaterialWeight: isBaseline
              ? null
              : material?.material_weight,
            baselineMaterialWeightDose: isBaseline
              ? material?.material_efficiency
              : null,
            myProductMaterialWeightDose: isBaseline
              ? null
              : material?.material_efficiency,
            baselineMaterialPCRContent: isBaseline
              ? material?.PCR_Material_Percent_Component
              : null,
            myProductMaterialPCRContent: isBaseline
              ? null
              : material?.PCR_Material_Percent_Component,
            baselineEnvironmentalFootprint,
            myProductEnvironmentalFootprint,
          };
        }
      );

      // Compute component-level footprint total from component-level results map (if available)
      const baselineComponentFootprint = isBaseline
        ? parseFloat(((componentMap?.get(currentComponentIdx) ?? 0)).toFixed(6))
        : 0;
      const myProductComponentFootprint = !isBaseline
        ? parseFloat(((componentMap?.get(currentComponentIdx) ?? 0)).toFixed(6))
        : 0;

      return {
        componentName: component?.component_type,
        componentWeight: isBaseline ? componentWeight.toString() : null,
        myProductComponentWeight: !isBaseline ? componentWeight : null,
        baseLineComponentWeight: isBaseline ? componentWeight : null,
        myProductComponentWeightDose: !isBaseline ? componentWeightDose : null,
        baselineComponentWeightDose: isBaseline ? componentWeightDose : null,
        myProductComponentPCRContent: !isBaseline ? componentPCRContent : null,
        baselineComponentPCRContent: isBaseline ? componentPCRContent : null,
        baselineComponentFootprint: parseFloat(baselineComponentFootprint.toFixed(6)),
        myProductComponentFootprint: parseFloat(myProductComponentFootprint.toFixed(6)),
        details,
      };
    };

    if (
      currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT ||
      currentTab === CURRENT_TAB.CARBON_FOOTPRINT
    ) {
      // Helper to flatten packaging levels into material entries with a value extractor
      // Uses a global sequential index as key to avoid collisions across levels/components
      const collectMaterialValues = (
        packData,
        valueExtractor: (mat) => number
      ): Map<number, number> => {
        const valuesMap = new Map<number, number>();
        let idx = 0;
        for (const level of packData?.packaging_level ?? []) {
          for (const comp of level?.components ?? []) {
            for (const sub of comp?.sub_components ?? []) {
              for (const mat of sub?.material ?? []) {
                valuesMap.set(idx++, valueExtractor(mat));
              }
            }
          }
        }
        return valuesMap;
      };

      // Helper to flatten packaging levels into component entries with a value extractor
      // Uses a sequential index per component
      const collectComponentValues = (
        packData,
        valueExtractor: (comp) => number
      ): Map<number, number> => {
        const valuesMap = new Map<number, number>();
        let idx = 0;
        for (const level of packData?.packaging_level ?? []) {
          for (const comp of level?.components ?? []) {
            valuesMap.set(idx++, valueExtractor(comp));
          }
        }
        return valuesMap;
      };

      const combineMaps = (
        map1: Map<number, number>,
        map2: Map<number, number>,
        multiplier: number
      ): Map<number, number> => {
        const result = new Map<number, number>();
        const allKeys = new Set([...map1.keys(), ...map2.keys()]);
        allKeys.forEach(key => {
          result.set(key, ((map1.get(key) ?? 0) + (map2.get(key) ?? 0)) * multiplier);
        });
        return result;
      };

      // Build PEF lookup map from pack production (step_51) + EOL (step_64) per material
      const buildPackPefMap = (packProd, packEol): Map<number, number> => {
        const prodValues = collectMaterialValues(packProd, (mat) =>
          parseFloat(mat?.step_51_pack_prod_pef_score_functional_unit ?? 0)
        );
        const eolValues = collectMaterialValues(packEol, (mat) =>
          parseFloat(mat?.step_64_Pack_EOL_PEF_score_functional_unit ?? 0)
        );
        return combineMaps(prodValues, eolValues, 1000000);
      };

      // Build CF lookup map from pack production (step_48 climate_change_functional_unit) + EOL (step_60 climate_change) per material
      const buildPackCfMap = (packProd, packEol): Map<number, number> => {
        const prodValues = collectMaterialValues(packProd, (mat) =>
          parseFloat(mat?.step_48_pack_prod_pack_impact?.climate_change_functional_unit ?? 0)
        );
        const eolValues = collectMaterialValues(packEol, (mat) =>
          parseFloat(mat?.step_60_Pack_EOL_Pack_Impact?.climate_change_functional_unit ?? 0)
        );
        return combineMaps(prodValues, eolValues, 1000);
      };

      // Build PEF lookup map from pack production (step_58 component) + EOL (step_65 component) per component
      const buildPackPefComponentMap = (packProd, packEol): Map<number, number> => {
        const prodValues = collectComponentValues(packProd, (comp) =>
          parseFloat(comp?.step_58_pack_prod_pef_score_component_functional_unit ?? 0)
        );
        const eolValues = collectComponentValues(packEol, (comp) =>
          parseFloat(comp?.step_65_Pack_EOL_PEF_score_Component_functional_unit ?? 0)
        );
        return combineMaps(prodValues, eolValues, 1000000);
      };

      // Build CF lookup map from pack production (step_57 component climate_change) + EOL (step_61 component climate_change) per component
      const buildPackCfComponentMap = (packProd, packEol): Map<number, number> => {
        const prodValues = collectComponentValues(packProd, (comp) =>
          parseFloat(comp?.step_57_pack_prod_pack_impact_component?.climate_change_functional_unit ?? 0)
        );
        const eolValues = collectComponentValues(packEol, (comp) =>
          parseFloat(comp?.step_61_Pack_EOL_Pack_Impact_component?.climate_change_functional_unit ?? 0)
        );
        return combineMaps(prodValues, eolValues, 1000);
      };

      // Build the appropriate material and component maps based on current tab
      const buildMaterialMap = currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT
        ? buildPackPefMap
        : buildPackCfMap;

      const buildComponentMap = currentTab === CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT
        ? buildPackPefComponentMap
        : buildPackCfComponentMap;

      const baselineMaterialMap = buildMaterialMap(data?.baseline?.['packproduction'], data?.baseline?.['packagingeol']);
      const productMaterialMap = buildMaterialMap(data?.[resultkey]?.['packproduction'], data?.[resultkey]?.['packagingeol']);

      const baselineComponentMap = buildComponentMap(data?.baseline?.['packproduction'], data?.baseline?.['packagingeol']);
      const productComponentMap = buildComponentMap(data?.[resultkey]?.['packproduction'], data?.[resultkey]?.['packagingeol']);
      // Build baseline component data
      globalMaterialIndex = 0;
      data?.baselinePackaging?.packaging_level?.forEach(
        (baselineLevel: IPackagingLevelObject) => {
          formatComponents(baselineLevel?.components)?.forEach(
            (component: IComponentLevelObject) => {
              baselineComponentData.push(
                buildComponentComparison(component, true, true, baselineMaterialMap, baselineComponentMap)
              );
            }
          );
        }
      );
      // Build product component data
      globalMaterialIndex = 0;
      globalComponentIndex = 0;
      data?.myProductPackaging?.packaging_level?.forEach(
        (productPackingLevel: IPackagingLevelObject) => {
          formatComponents(productPackingLevel?.components)?.forEach(
            (component: IComponentLevelObject) => {
              productComponentData.push(
                buildComponentComparison(component, false, true, productMaterialMap, productComponentMap)
              );
            }
          );
        }
      );
    } else if (currentTab === CURRENT_TAB.SUSTAINABLE_PACKAGING) {
      if (
        currentSustainableSection === SUSTAINABLE_SECTIONS.MATERIAL_EFFICIENCY
      ) {
        formatComponents(data?.baseline?.["sustainablepackaging-material-efficiency"]?.components)?.forEach(
          (component: IComponentLevelObject) => {
            baselineComponentData.push(
              buildComponentComparison(component, true)
            );
          }
        );

        // Build product component data
         formatComponents(data?.[resultkey]?.["sustainablepackaging-material-efficiency"]?.components)?.forEach(
          (component: IComponentLevelObject) => {
            productComponentData.push(
              buildComponentComparison(component, false)
            );
          }
        );
      } else {
         formatComponents(data?.baseline?.["sustainablepackaging-pcr"]?.components)?.forEach(
          (component: IComponentLevelObject) => {
            baselineComponentData.push(
              buildComponentComparison(component, true)
            );
          }
        );

        // Build product component data
         formatComponents(data?.[resultkey]?.["sustainablepackaging-pcr"]?.components)?.forEach(
          (component: IComponentLevelObject) => {
            productComponentData.push(
              buildComponentComparison(component, false)
            );
          }
        );
      }
    }


    const finalConsumerDetails: Component[] = [];
    productComponentData.forEach((component: Component) => {
      const componentName = component.componentName;
      const componentWeight = component.componentWeight;
      const myProductComponentWeight = component?.myProductComponentWeight ?? null;

      const myProductComponentWeightDose =
        component?.myProductComponentWeightDose
        ?? null;
      const myProductComponentPCRContent =
        component?.myProductComponentPCRContent
        ?? null;
      const detailsData: ComponentDetail[] = [];
      component?.details?.forEach((matDetails: ComponentDetail) => {

        detailsData.push({
          ...matDetails
        });
      });
      finalConsumerDetails.push({
        componentName: componentName,
        componentWeight,
        myProductComponentWeight,
        myProductComponentWeightDose,
        myProductComponentPCRContent,
        myProductComponentFootprint: component?.myProductComponentFootprint ?? 0,
        details: detailsData,
      });
    });
    baselineComponentData.forEach((component: Component) => {
      const componentName = component.componentName;
      const componentWeight = component.componentWeight;
      const baseLineComponentWeight = component?.baseLineComponentWeight
        ?? null;
      const baselineComponentWeightDose = component?.baselineComponentWeightDose
        ?? null;
      const baselineComponentPCRContent = component?.baselineComponentPCRContent
        ?? null;
      const detailsData: ComponentDetail[] = [];
      component?.details?.forEach((matDetails: ComponentDetail) => {

        detailsData.push({
          ...matDetails
        });
      });
      finalConsumerDetails.push({
        componentName: componentName,
        componentWeight,
        baseLineComponentWeight,
        baselineComponentWeightDose,
        baselineComponentPCRContent,
        baselineComponentFootprint: component?.baselineComponentFootprint ?? 0,
        details: detailsData,
      });
    });
// ✅ Step 1: Separate baseline and product components
const baselineComponents = finalConsumerDetails.filter(
  (item) => item.baseLineComponentWeight != null
);
const productComponents = finalConsumerDetails.filter(
  (item) => item.myProductComponentWeight != null && item.baseLineComponentWeight == null
);

// ✅ Step 2: Group by componentName
const baselineGroups = baselineComponents.reduce((acc, comp) => {
  if (!acc[comp.componentName]) acc[comp.componentName] = [];
  acc[comp.componentName].push(comp);
  return acc;
}, {});

const productGroups = productComponents.reduce((acc, comp) => {
  if (!acc[comp.componentName]) acc[comp.componentName] = [];
  acc[comp.componentName].push(comp);
  return acc;
}, {});

// ✅ Step 3: Final paired output
const mergedFinalConsumer = [];

// Loop through all component names
const allComponentNames = new Set([
  ...Object.keys(baselineGroups),
  ...Object.keys(productGroups),
]);

for (const name of allComponentNames) {
  const baselineList = baselineGroups[name] || [];
  const productList = productGroups[name] || [];

  const maxLen = Math.max(baselineList.length, productList.length);

  for (let i = 0; i < maxLen; i++) {
    const baselineComp = baselineList[i] || {};
    const productComp = productList[i] || {};

    mergedFinalConsumer.push({
      componentName: name,

      // ✅ Include all baseline-level properties
      baseLineComponentWeight: baselineComp.baseLineComponentWeight ?? null,
      baselineComponentWeightDose: baselineComp.baselineComponentWeightDose ?? null,
      baselineComponentPCRContent: baselineComp.baselineComponentPCRContent ?? null,
      baselineComponentFootprint: baselineComp.baselineComponentFootprint ?? 0,

      // ✅ Include all myProduct-level properties
      myProductComponentWeight: productComp.myProductComponentWeight ?? null,
      myProductComponentWeightDose: productComp.myProductComponentWeightDose ?? null,
      myProductComponentPCRContent: productComp.myProductComponentPCRContent ?? null,
      myProductComponentFootprint: productComp.myProductComponentFootprint ?? 0,

      // ✅ Combine details arrays from both
      details: [
        ...(baselineComp.details || []),
        ...(productComp.details || []),
      ],
    });
  }
}

const disruptorsBaselineData =
  data?.baseline?.["sustainablepackaging-recyclability-disruptors"]?.components?.map(
    (component: PackagingComponentData) => {
      const mergedDisruptors =component?.recyclability_disruptors_list_formatted_4_5 ?? []        
      return {
        component_type: component.component_type,
        recyclability_disruptors_list_formatted_4_5: mergedDisruptors
      };
    }
  ).filter(item =>
      item.recyclability_disruptors_list_formatted_4_5 &&
      item.recyclability_disruptors_list_formatted_4_5.length !== 0
    );

const disruptorsMyProductData =
  data?.[resultkey]?.[
    "sustainablepackaging-recyclability-disruptors"
  ]?.components?.map((component: PackagingComponentData) => {
    const mergedDisruptors =component?.recyclability_disruptors_list_formatted_4_5 ?? []
    return {
      component_type: component.component_type,
      recyclability_disruptors_list_formatted_4_5: mergedDisruptors
    };
  }).filter(item =>
      item.recyclability_disruptors_list_formatted_4_5 &&
      item.recyclability_disruptors_list_formatted_4_5.length !== 0
    );

    // Set the final merged data
    setProductEnvironmentalFootprintData((prevValues) => ({
      ...prevValues,
      packaging: { consumerPackaging: mergedFinalConsumer },
    }));

    // Set data for GREEN CHEMISTRY

    const GCDetailedResultData = getRawMaterialDataGCDetailedResult(
      data?.[resultkey]?.renewable_feedback_stock,
      data?.baseline?.renewable_feedback_stock,
      "greenChemistry"
    );
    const formatPercentage = (value) => (value ? `${parseFloat(value).toFixed(1)}%` : "0%");
    const formatPoints = (value) => (value ? `${Math.round(value)} points` : "0");
    const safeNumber = (value) => parseFloat(value || 0);

    // Calculate myproduct and baseline scores for watchListScore
    const myProductScore = parseFloat(data?.[resultkey]?.watchlist?.watchlist_score) || 0;
    const baselineScore = parseFloat(data?.baseline?.watchlist?.watchlist_score) || 0;
    const myProductGaiaScore = data?.[resultkey]?.gaia_score?.step_8_fml_GAIA_score || 0;
    const baselineGaiaScore = data?.baseline?.gaia_score?.step_8_fml_GAIA_score || 0;
    const baselineGC = (data?.baseline?.renewable_feedback_stock?.renewable_feedstock_total) * 100;
    const myproductGC = (data?.[resultkey]?.renewable_feedback_stock?.renewable_feedstock_total) * 100;
    const per_rob_diff_GC = (myproductGC - baselineGC).toFixed(1);
    const per_gaia_score = ((myProductGaiaScore - baselineGaiaScore)).toFixed(2);
    const totalOrganicBaselinePercent = (data?.baseline?.renewable_feedback_stock?.sum_of_organic_chemical_percents ?? 0);
    const totalOrganicMyproductPercent = (data?.[resultkey]?.renewable_feedback_stock?.sum_of_organic_chemical_percents ?? 0);
    const myproducttotalscore = (data?.[resultkey]?.green_chemistry_rollup?.step_6_final_score_with_5_watchlist ?? 0).toFixed(2);

    const baselineTotalScore = (data?.[resultkey]?.baseline_green_chemistry_rollup?.step_5_final_score ?? 0).toFixed(2);
    const gaiaRegression = data?.[resultkey]?.["green_chemistry_rollup"]?.step_1_GAIA_regression ?? 0;
    const watchlistRegression = data?.[resultkey]?.["green_chemistry_rollup"]?.step_2_watchlist_regression ?? 0;
    const regression = gaiaRegression <= -5 || watchlistRegression > 0;
    const myProductWatchlistMaxScore = data?.[resultkey]?.watchlist?.max_watchlist_score || '0';
   
    const watchlistpercent = parseFloat(myProductWatchlistMaxScore) == 5 ? 'Fail' : (myProductScore - baselineScore).toFixed(1).toString() || '0';
    let GCtotalScore = parseFloat(((myproducttotalscore - baselineTotalScore)).toFixed(0));

    GCtotalScore = isNaN(GCtotalScore)
      ? 0
      : GCtotalScore;

    const dialGCPercentage = extractDialData(
      data?.[resultkey] ?? {},
      data?.baseline ?? {},
      "greenChemistry"
    );
    setGreenChemistryData((prevGCData) => ({
      ...prevGCData,
      renewableOriginBonus: {
        ...prevGCData.renewableOriginBonus,
        dialData: {
          baseline: formatPercentage(baselineGC),
          myproduct: formatPercentage(myproductGC),
          per_pcr_diff: per_rob_diff_GC.toString() + '%' || "0%",
        },
        robTableData: GCDetailedResultData,
        totalPercent: { baselineOrganic: totalOrganicBaselinePercent, baselineRenewable: formatPercentage(baselineGC), myproductOrganic: totalOrganicMyproductPercent, myproductRenewable: formatPercentage(myproductGC) },
        regression,
      },
      tabs: {
        ...prevGCData.tabs,
        renewableOriginBonus: {
          ...prevGCData.tabs.renewableOriginBonus,
          percentage: per_rob_diff_GC || "0",
          baseline: formatPercentage(baselineGC),
          myproduct: formatPercentage(myproductGC),
        },
        watchListScore: {
          heading: 'Watch List Score',
          percentage: watchlistpercent,
          myproduct: safeNumber(myProductScore).toFixed(1),
          baseline: safeNumber(baselineScore).toFixed(1),
        },
        gaiaScore: {
          heading: "GAIA Score",
          percentage: per_gaia_score,
          myproduct: formatPoints(myProductGaiaScore),
          baseline: formatPoints(baselineGaiaScore),
        },
        totalScore: {
          heading: "Total Score",
          percentage: String(GCtotalScore),
          myproduct: myproducttotalscore + ' points',
          baseline: baselineTotalScore + ' points',
        },

      },
      dials: dialGCPercentage,
      watchList: {
        baselineData: data?.baseline?.watchlist?.watchlist_table || [],
        myProductData: data?.[resultkey]?.watchlist?.watchlist_table || [],
        max_watchlist_score_baseline: data?.baseline?.watchlist?.max_watchlist_score || "0",
        max_watchlist_score_myproduct: myProductWatchlistMaxScore,
      },
      gaiaScore: {
        myProductData: data?.[resultkey]?.gaia_score || {},
        baselineData: data?.baseline?.gaia_score || {}
      }
    }));
    setSustainablePackagingData((prevData) => ({
      ...prevData,
      tabs: {
        ...prevData.tabs,
        totalScore: {
          ...prevData.tabs.totalScore,
          percentage:
            data?.[resultkey]?.["sustainablepackaging-rollup-compare"]
              ?.Final_Score_Disrupters ?? 0,
        },
        disruptors: {
          ...prevData.tabs.disruptors,
          percentage: capitalizeFirstLetter(
            data?.[resultkey]?.["sustainablepackaging-recyclability-disruptors"]
              ?.recyclability_disruptors_present_all_packaging_4_3 ?? "N/A"
          ),
          baseline: capitalizeFirstLetter(
            data?.baseline?.["sustainablepackaging-recyclability-disruptors"]
              ?.recyclability_disruptors_present_all_packaging_4_3 ?? "N/A"
          ),
          myproduct: capitalizeFirstLetter(
            data?.[resultkey]?.["sustainablepackaging-recyclability-disruptors"]
              ?.recyclability_disruptors_present_all_packaging_4_3 ?? "N/A"
          ),
        },
        materialEfficiency: {
          ...prevData.tabs.materialEfficiency,
          percentage: data?.[resultkey]?.["sustainablepackaging-rollup-compare"]
            ?.Difference_Material_Efficiency
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-rollup-compare"]
                ?.Difference_Material_Efficiency
            )
              .toFixed()
              .toString()
            : "0",
          baseline: data?.baseline?.["sustainablepackaging-material-efficiency"]
            ?.Material_Efficiency_All_Packaging
            ? parseFloat(
              data?.baseline?.["sustainablepackaging-material-efficiency"]
                .Material_Efficiency_All_Packaging
            )
              .toFixed(2)
              .toString()
            : "0.00",
          myproduct: data?.[resultkey]?.["sustainablepackaging-material-efficiency"]
            ?.Material_Efficiency_All_Packaging
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-material-efficiency"]
                .Material_Efficiency_All_Packaging
            )
              .toFixed(2)
              .toString()
            : "0.00",
        },
        pcrContent: {
          ...prevData.tabs.pcrContent,
          percentage: data?.[resultkey]?.["sustainablepackaging-rollup-compare"]
            ?.Difference_PCR_Content
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-rollup-compare"]
                ?.Difference_PCR_Content
            )
              .toFixed()
              .toString()
            : "0",
          baseline: data?.baseline?.["sustainablepackaging-pcr"]
            ?.pcr_content_all_packaging
            ? parseFloat(
              data?.baseline?.["sustainablepackaging-pcr"]
                ?.pcr_content_all_packaging
            )
              .toFixed()
              .toString() + "%"
            : "0%",
          myproduct: data?.[resultkey]?.["sustainablepackaging-pcr"]
            ?.pcr_content_all_packaging
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-pcr"]
                ?.pcr_content_all_packaging
            )
              .toFixed()
              .toString() + "%"
            : "0%",
        },
      },
      pcrContent: {
        ...prevData.pcrContent,
        dialData: {
          baseline: data?.baseline?.["sustainablepackaging-pcr"]
            ?.pcr_content_all_packaging
            ? parseFloat(
              data?.baseline?.["sustainablepackaging-pcr"].pcr_content_all_packaging
            ).toFixed(2)
            : "0.00",
          myproduct: data?.[resultkey]?.["sustainablepackaging-pcr"]
            ?.pcr_content_all_packaging
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-pcr"]
                .pcr_content_all_packaging
            ).toFixed(2)
            : "0.00",
          per_pcr_diff: data?.[resultkey]?.["sustainablepackaging-rollup-compare"]
            ?.Difference_PCR_Content
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-rollup-compare"]?.Difference_PCR_Content
            ).toFixed(2)
            : "0.00",
        },
        detailedData: mergedFinalConsumer,
      },
      materialEfficiency: {
        ...prevData.materialEfficiency,
        barData: {
          baseline: data?.baseline?.['sustainablepackaging-material-efficiency']
            ?.Material_Efficiency_All_Packaging
            ? parseFloat(
              data?.baseline?.['sustainablepackaging-material-efficiency']
                .Material_Efficiency_All_Packaging
            )?.toFixed(2)
            : "0.00",
          myproduct: data?.[resultkey]?.["sustainablepackaging-material-efficiency"]
            ?.Material_Efficiency_All_Packaging
            ? parseFloat(
              data[resultkey]?.["sustainablepackaging-material-efficiency"]
                .Material_Efficiency_All_Packaging
            )?.toFixed(2)
            : "0.00",
        },
        detailedData: mergedFinalConsumer,
      },

      disruptors: {
        baselineProduct: disruptorsBaselineData,
        myproduct: disruptorsMyProductData,
        watchOut:
          data?.[resultkey]?.["sustainablepackaging-recyclability-disruptors"]
            ?.watchout_message_4_6,
      },
    }));
  }, [
    productId,
    assessmentId,
    assessmentType,
    currentTab,
    resultData,
    data,
    resultkey,
    currentSustainableSection,
    currentGreenChemistrySection,
  ]);

  useEffect(() => {
    const getExpRawMaterial = () => {
      if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
        return resultFormulationData?.experimental?.rawmaterials?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.BASELINE_ASSESSMENT) {
        const baselineResults = resultBaseline as ResultDataType;
        return baselineResults?.baseline?.rawmaterials?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
        return resultFormulationData?.final?.rawmaterials?.raw_materials;
      }
    };
    const getExpEolRawMaterial = () => {
      if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
        return resultFormulationData?.experimental?.formula_end_of_life?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.BASELINE_ASSESSMENT) {
        const baselineResults = resultBaseline as ResultDataType;
        return baselineResults?.baseline?.formula_end_of_life?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
        return resultFormulationData?.final?.formula_end_of_life?.raw_materials;
      }
    };
    const getMyProductGaiaRawMaterial = () => {
      if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
        return resultFormulationData?.experimental?.gaia_score?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.BASELINE_ASSESSMENT) {
        const baselineResults = resultBaseline as ResultDataType;
        return baselineResults?.baseline?.gaia_score?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
        return resultFormulationData?.final?.gaia_score?.raw_materials;
      }
    };
    const getMyProductRenewableMaterial = () => {
      if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
        return resultFormulationData?.experimental?.renewable_feedback_stock?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.BASELINE_ASSESSMENT) {
        const baselineResults = resultBaseline as ResultDataType;
        return baselineResults?.baseline?.renewable_feedback_stock?.raw_materials;
      }
      if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
        return resultFormulationData?.final?.renewable_feedback_stock?.raw_materials;
      }
    };
    const getMyProductWatchListMaterial = () => {
      if (assessmentType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT) {
        return resultFormulationData?.experimental?.watchlist?.watchlist_icon_boolean
          ;
      }
      if (assessmentType === ASSESSMENT_TYPE.BASELINE_ASSESSMENT) {
        const baselineResults = resultBaseline as ResultDataType;
        return baselineResults?.baseline?.watchlist?.watchlist_icon_boolean
          ;
      }
      if (assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT) {
        return resultFormulationData?.final?.watchlist?.watchlist_icon_boolean
          ;
      }
    };
    if (resultFormulationData) {
      const experimentalRawMaterial = getExpRawMaterial();
      const experimentaleolRawMaterial = getExpEolRawMaterial();
      const myProductGaiaRawMaterial = getMyProductGaiaRawMaterial();
      const myProductRenewableRawMaterial = getMyProductRenewableMaterial();
      const myProductWatchListRawMaterial = getMyProductWatchListMaterial();
      const rawMaterialArray: string[] = [];
      const data: IFootprintData[] = [];
      experimentalRawMaterial?.forEach((item) => {
        rawMaterialArray.push(item.raw_material_id);
        data.push({
          rawMaterialId: item.raw_material_id,
          envFootprint: 0,
          carbonFootprint: 0,
          gaiaScore: "",
          leaf_icon_boolean: 'NO LEAF',
          watchlist_icon_boolean: '0',
        });
      });
      setFootPrintData(data);

      if (rawMaterialArray.length > 0) {
        rawMaterialArray.forEach((rawMatId) => {
          const rawMaterialProduction =
            experimentalRawMaterial?.filter(
              (item: IRawMaterial) => item.raw_material_id === rawMatId
            ) || [];
          const eolRawMaterial =
            experimentaleolRawMaterial?.filter(
              (item: IEolRawMaterial) => item.raw_material_id === rawMatId
            ) || [];
          const rawMaterialGaiaScore =
            myProductGaiaRawMaterial?.filter(
              (item: GaiaScoreMaterialProps) => item.rawMaterialID === rawMatId
            ) || [];
          const rawMaterialRenewable =
            myProductRenewableRawMaterial?.filter(
              (item: RenewableRawMaterial) => item.raw_material_id === rawMatId
            ) || [];
          // Convert the object into an array of key-value pairs
          const rawMaterialWatchList = Object?.entries(myProductWatchListRawMaterial || {})?.map(([rawMaterialId, value]) => ({ raw_material_id: rawMaterialId, status: value }));
          const filteredRawMaterialWatchList = rawMaterialWatchList?.filter(item => item.raw_material_id === rawMatId)
          if (rawMaterialProduction || eolRawMaterial) {
            const envFootprintValue =
              (rawMaterialProduction[0]
                ?.raw_material_production_PEF_score_per_functional_unit +
                eolRawMaterial[0]?.eol_raw_mat_PEF_score_functional_unit || 0) *
              1000000;
            const carbonFootprintValue =
              (rawMaterialProduction[0]?.raw_material_ef_total
                ?.climate_change_amount_functional_unit +
                eolRawMaterial[0]?.sum_eol_raw_ef
                  ?.climate_change_amount_functional_unit || 0) * 1000;
            const gaiaScore = rawMaterialGaiaScore[0]?.step_6_GAIA_RAW_score.toString() ?? '';
            const leaf_icon_boolean = rawMaterialRenewable[0]?.leaf_icon_booleans ?? 'NO LEAF';
const status = filteredRawMaterialWatchList[0]?.status as boolean | number | string | undefined;
const watchlist_icon_boolean = status?.toString() ?? '0';
            setFootPrintData((prevValues) =>
              getUpdatedFootprints(
                prevValues,
                rawMatId,
                envFootprintValue,
                carbonFootprintValue,
                gaiaScore,
                leaf_icon_boolean,
                watchlist_icon_boolean
              )
            );
          }
        });
      }
    }
  }, [assessmentType, resultData, assessmentId, productId, resultBaseline, resultFormulationData]);
  // Recycle ready
  useEffect(() => {
    interface BaselineItem {
      componentType: string;
      packagingLayer: string;
      baselineProduct: {
        weight: string;
        recycleReady: string;
      };
      myProduct: {
        weight: string;
        recycleReady: string;
      };
    }

    interface IRRComponentDetails {
      component_type: string;
      packaging_level: string;
      weight: string;
      recyclability_status: string;
    }



    function getRecycleReadyStatus(status: string): string {
      return status === "Recycle Ready" ? "Yes" : "No";
    }




    function mergeRelevantComponents(
  relevantComponents: IRRComponentDetails[]
): { weight: number; recyclabilityStatus: string; componentType: string; packagingLevel: string }[] {

  return relevantComponents.map((component) => ({
    weight: parseFloat(component.weight) || 0,
    recyclabilityStatus: component.recyclability_status,
    componentType: component.component_type,
    packagingLevel: component.packaging_level,
  }));
}



function findMatchingComponent(
  baselineItem: BaselineItem,
  relevantComponents: ReturnType<typeof mergeRelevantComponents>,
  usedIndexes: Set<number>
): number {
  return relevantComponents.findIndex((comp, idx) =>
    !usedIndexes.has(idx) &&
    comp.componentType === baselineItem.componentType &&
    comp.packagingLevel === baselineItem.packagingLayer
  );
}

function buildMatchedRow(baselineItem: BaselineItem, comp): BaselineItem {
  return {
    ...baselineItem,
    myProduct: {
      weight: comp.weight.toFixed(2),
      recycleReady: getRecycleReadyStatus(comp.recyclabilityStatus),
    },
  };
}

function buildUnmatchedBaselineRow(baselineItem: BaselineItem): BaselineItem {
  return {
    ...baselineItem,
    myProduct: { weight: "", recycleReady: "" },
  };
}

function buildRemainingRelevantRow(comp): BaselineItem {
  return {
    componentType: comp.componentType,
    packagingLayer: comp.packagingLevel,
    baselineProduct: { weight: "", recycleReady: "" },
    myProduct: {
      weight: comp.weight.toFixed(2),
      recycleReady: getRecycleReadyStatus(comp.recyclabilityStatus),
    },
  };
}
function getCompleteTableData(
  baselineTableData: BaselineItem[],
  getRelevantComponents: () => IRRComponentDetails[]
): BaselineItem[] {

  const relevantComponents = mergeRelevantComponents(getRelevantComponents() || []);
  const usedIndexes = new Set<number>();
  const mergedData: BaselineItem[] = [];

  // Handle baseline rows
  for (const baselineItem of baselineTableData) {
    const matchIndex = findMatchingComponent(baselineItem, relevantComponents, usedIndexes);

    if (matchIndex !== -1) {
      const comp = relevantComponents[matchIndex];
      usedIndexes.add(matchIndex);
      mergedData.push(buildMatchedRow(baselineItem, comp));
    } else {
      mergedData.push(buildUnmatchedBaselineRow(baselineItem));
    }
  }

  // Handle remaining unmatched relevant components
  relevantComponents.forEach((comp, idx) => {
    if (!usedIndexes.has(idx)) {
      mergedData.push(buildRemainingRelevantRow(comp));
    }
  });

  return mergedData;
}


    // RR barchart
    if (resultData) {
      const baselineRRPercentage =
        resultData?.baseline?.["sustainablepackaging-recyclable-content"]
          ?.percentage_recycle_ready_all_packaging || 0;
      const getRRMyProductPercentage = () => {
        return assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT
          ? resultData?.final?.["sustainablepackaging-recyclable-content"]
            ?.percentage_recycle_ready_all_packaging || 0
          : resultData?.experimental?.["sustainablepackaging-recyclable-content"]
            ?.percentage_recycle_ready_all_packaging || 0;
      };
      const myProductRRPercentage = getRRMyProductPercentage();
      const RRBarData = [
        { category: "baseline", value: baselineRRPercentage },
        { category: "myProduct", value: myProductRRPercentage },
      ];

      //totalroll_up RR_percentage
      const getRelavantTotalRollUpPercentage = () => {
        return assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT
          ? resultData?.final?.["sustainablepackaging-rollup-compare"]
            ?.Difference_Recycle_Ready
          : resultData?.experimental?.["sustainablepackaging-rollup-compare"]
            ?.Difference_Recycle_Ready;
      };

      const getRelevantComponents = () => {
        return assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT
          ? resultData?.final?.["sustainablepackaging-recyclable-content"]?.components
          : resultData?.experimental?.["sustainablepackaging-recyclable-content"]?.components;
      };

      const baselineTableData =

        resultData?.baseline?.["sustainablepackaging-recyclable-content"]?.components?.map(

          (item) => ({

            componentType: item.component_type,

            packagingLayer: item.packaging_level,

            baselineProduct: {

              weight: item.weight === "" ? "" : Number(item.weight)?.toFixed(2).toString(),

              recycleReady: item.recyclability_status === "Recycle Ready" ? "Yes" : "No",

            },

            myProduct: { weight: "", recycleReady: "" },

          })

        ) || [];

  // No grouping here — direct pairing (order preserved)
    const completeTableData = getCompleteTableData(
      baselineTableData,
      getRelevantComponents
    );

      setSustainablePackagingData((prevValues) => ({
        ...prevValues,
        recycleReady: {
          ...prevValues.recycleReady,
          barData: RRBarData,
          detailedData: completeTableData,
        },
        tabs: {
          ...prevValues.tabs,
          recycleReady: {
            ...prevValues.tabs.recycleReady,
            baseline: baselineRRPercentage?.toFixed().toString() + "%",
            myproduct: myProductRRPercentage?.toFixed().toString() + "%",
            percentage:
              getRelavantTotalRollUpPercentage()?.toFixed(2)?.toString() + "%",
          },
        },
      }));
    }
  }, [productId, assessmentId, assessmentType, currentTab, resultData, data]);

  const value = useMemo(
    () => ({
      resultData,
      resultkey,
      resultFormulationData,
      productEnvironmentalFootprintData,
      carbonFootprintData,
      sustainablePackagingData,
      greenChemistryData,
      assessmentsType: assessmentType,
      setCurrentTab,
      setCurrentSustainableSection,
      setCurrentGreenChemistrySection,
      currentGreenChemistrySection,
      footPrintData,
      currentTab,
      currentSustainableSection,
      resultDataRefetch,
      refetchResultBaseline,
      packakingComponetList,
      dialsErrorMsg,
      dialsError
    }),
    [
      resultData,
      resultkey,
      resultFormulationData,
      productEnvironmentalFootprintData,
      carbonFootprintData,
      sustainablePackagingData,
      greenChemistryData,
      assessmentType,
      setCurrentTab,
      setCurrentSustainableSection,
      setCurrentGreenChemistrySection,
      currentGreenChemistrySection,
      footPrintData,
      currentTab,
      currentSustainableSection,
      resultDataRefetch,
      refetchResultBaseline,
      packakingComponetList,
      dialsErrorMsg,
      dialsError
    ]
  );

  return (
    <ResultDataContext.Provider value={value}>
      {children}
    </ResultDataContext.Provider>
  );
};
