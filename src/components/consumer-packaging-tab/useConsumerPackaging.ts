/* eslint-disable */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  FieldsExistType,
  MaterialEntity,
  MaterialFieldsExistType,
  PackagingComponentData,
  PackagingDataType,
  PackagingLevelData,
  SubComponent,
  SubComponentFieldsExistType,
} from "../../structures/packaging";
import { SelectChangeEvent } from "@mui/material";
import {
  ApiEndPoints,
  ApiEndPointsURL,
} from "../../constants/ApiEndPoints.constant";
import { toast } from "react-toastify";
import axios from "axios";
import { AssessmentDataType, ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";
import { AutoSaveContext } from "../../contexts/autoSaveContext/AutoSaveContext";
import { isEqual } from "lodash";
import { useGetProductDetailByID } from "../../hooks/UseGetProductDetails";


type IndexValuePair = { index: string; value: boolean };
const useConsumerPackaging = () => {
  const [packagingAllData, setPackagingAllData] = useState<PackagingDataType>({
    packaging_level: [],
  });
  const [packagingSavedData, setPackagingSavedData] = useState<PackagingDataType>({
    packaging_level: [],
  });

  const [primaryData, setPrimaryData] = useState<PackagingComponentData[]>([]);
  const { setCalculateClickPackaging, setHasUncalculatedChanges } = useContext(AutoSaveContext);
  const [secondaryData, setSecondaryData] = useState<PackagingComponentData[]>([]);
  const [isPrimaryAddEnabled, setIsPrimaryAddEnabled] = useState(true);
  const [isSecondaryAddEnabled, setIsSecondaryAddEnabled] = useState(true);
  const [resetData, setResetData] = useState(false);
  const [productEvacuationValue, setProductEvacuationValue] = useState("90");
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isComponentDataChangePrimary, setIsComponentDataChangePrimary] =
    useState<IndexValuePair[]>([]);
  const [isComponentDataChangeSecondary, setIsComponentDataChangeSecondary] =
    useState<IndexValuePair[]>([]);
  const [counterPrimary, setCounterPrimary] = useState(0);
  const [counterSecondary, setCounterSecondary] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isOneTimeSaveDone, setIsOneTimeSaveDone] = useState(false);
  const { token } = useGlobaldata();
  const [warningPopUp, setWarningPopUp] = useState(false);
  const [isProductEvacuationChanged, setIsProductEvacuationChanged] = useState(false);
  const {
    productData,
    assessmentsData,
    setAssessmentsData,
    assessmentsType,
    refetch,
    formulation,
    packagingData,
    secondaryPackaging,
    primaryPackaging,
    newChangesInFormulation,setValidateCheckEvacuation,
    setPackagingDataComplete, singleClickHit, isPackagingDirty, setBothPackFormulaStatus,
  } = useContext(ProductDataContext);
  const{
    resultDataRefetch,
    refetchResultBaseline,packakingComponetList
  } = useContext(ResultDataContext);
  const [allCalculated, setAllCalculated] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(singleClickHit);
  const { data: pData } = useGetProductDetailByID(productData?.productId);
  const [isBaseLineNewlyAdded, setIsBaseLineNewlyAdded] = useState(false);

  useEffect(()=>{
     if(pData?.length && assessmentsType=='baseline'){
       const assessmentData = pData[0]?.assessments;
       const expAssessmentCalculated =  assessmentData?.experimental?.find((e: any)=> 'isCalculatedButtonClicked' in e) || {};
       const finalAssessmentCalculated = assessmentData?.final && 'isCalculatedButtonClicked' in assessmentData?.final || {};
       setIsBaseLineNewlyAdded(Object.keys(expAssessmentCalculated).length > 0 || Object.keys(finalAssessmentCalculated).length > 0)
      }
    }, [pData])

  useEffect(() => {
    setIsSaveEnabled(singleClickHit);
  }, [singleClickHit]);
  useEffect(() => {
    const hasPrimaryData = primaryData?.length > 0;
    const hasSecondaryData = secondaryData?.length > 0;
  
    const primaryDataCalculated = hasPrimaryData && primaryData.every(item => item.isCalculated);
    const secondaryDataCalculated = hasSecondaryData && secondaryData.every(item => item.isCalculated);
    const calculated = (hasPrimaryData && primaryDataCalculated && (!hasSecondaryData || secondaryDataCalculated)) 
    || (hasSecondaryData && secondaryDataCalculated && (!hasPrimaryData || primaryDataCalculated));

// Check if primary data is complete
const primaryDataComplete = hasPrimaryData && primaryData.every(item => item.isDataComplete);

// Check if secondary data is complete
const secondaryDataComplete = hasSecondaryData && secondaryData.every(item => item.isDataComplete);

const dataComplete = (hasPrimaryData && primaryDataComplete && (!hasSecondaryData || secondaryDataComplete)) 
      || (hasSecondaryData && secondaryDataComplete && (!hasPrimaryData || primaryDataComplete));

  setPackagingDataComplete(dataComplete)
    setAllCalculated(calculated);
  }, [primaryData, secondaryData]);
  
   const isCalculationUpdatedMsg = useCallback(() => {
     const evacuationValue = Number(productEvacuationValue);
     const isEvacuationInvalid = isNaN(evacuationValue) || evacuationValue <= 0 || evacuationValue > 100;

     setValidateCheckEvacuation(isEvacuationInvalid)
     const hasEvacuationChanged = packakingComponetList?.[0]?.productEvaluation !== Number(productEvacuationValue);
     // Return true if either packaging components changed OR evacuation value changed
    return hasEvacuationChanged || isPackagingDirty;
  }, [packakingComponetList, productEvacuationValue, isPackagingDirty]);
  
    const isCalculationUpdatedPackaging = React.useMemo(() => {
      if (!packakingComponetList) {
        return false;
      }
      return isCalculationUpdatedMsg();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packakingComponetList, primaryData, secondaryData, isCalculationUpdatedMsg])
    const determineBothPackFormulationStatus = (allCalculated, isCalculationUpdatedPackaging,newChangesCalculated) => {
       return !(allCalculated && !isCalculationUpdatedPackaging && (newChangesCalculated ?? true));
  };

  useEffect(() => {
    
      const bothStatus = determineBothPackFormulationStatus(allCalculated, isCalculationUpdatedPackaging,newChangesInFormulation?.isCalculated);
    setBothPackFormulaStatus(bothStatus);
    setHasUncalculatedChanges(bothStatus)
    
    }, [allCalculated, newChangesInFormulation?.isCalculated,isCalculationUpdatedPackaging, setBothPackFormulaStatus, assessmentsData]);
  const [primaryRecycleStatus, setPrimaryRecycleStatus] =
    useState<string>("N/A");
  const [secondaryRecycleStatus, setSecondaryRecycleStatus] =
    useState<string>("N/A");
  const handleChangeClickValue = (
    index: number,
    type: "Primary" | "Secondary"
  ) => {
    if (type === "Primary" && primaryData?.length) {
      if (primaryData[index].pc_nm !== "") {
        setIsComponentDataChangePrimary((prevState) => {
          const indVal = index + "p";
          const existingItem = prevState.find((item) => item.index  === indVal);
          // If the index exists with false value, don't update it
          if (existingItem && existingItem.value === false) {
            return prevState;
          }
          // If the index exists with true, no change is needed
          if (existingItem && existingItem.value === true) {
            return prevState;
          }
          // If the index doesn't exist, add it with value true
          return [...prevState, { index:indVal, value: true }];
        });
      }
    }
    if (type === "Secondary" && secondaryData?.length) {
      if (secondaryData[index].pc_nm !== "") {
        setIsComponentDataChangeSecondary((prevState) => {
          const indexVal = index + "s";
          const existingItem = prevState.find((item) => item.index === indexVal);
          // If the index exists with false value, don't update it
          if (existingItem && existingItem.value === false) {
            return prevState;
          }
          // If the index exists with true, no change is needed
          if (existingItem && existingItem.value === true) {
            return prevState;
          }
          // If the index doesn't exist, add it with value true
          return [...prevState, { index: indexVal, value: true }];
        });
      }
    }
  };
  const hasNonEmptyValue = (data: PackagingComponentData[]): boolean => {
    return data?.every((item) => {
      return Object.entries(item).some(([key, value]) => {
        // Exclude fields that should not be checked
        if (
          [
            "_id",
            "stage",
            "state",
            "template",
            "isEdited",
            "isDataComplete",
          ].includes(key)
        ) {
          return false;
        }

        // Check if 'material' is a non-empty array
        if (key === "material" && Array.isArray(value)) {
          return value.length > 0;
        }

        // For other fields, check if they are not empty
        return value !== null && value !== undefined && value !== "";
      });
    });
  };

  const handleDeleteComponent = useCallback(
    (index: number, type: "Primary" | "Secondary") => {
      setIsSaveEnabled(true);
      if (type === "Primary") {
        setPrimaryData((prevData) => prevData.filter((_, i) => i !== index));
      }
      if (type === "Secondary") {
        setSecondaryData((prevData) => prevData.filter((_, i) => i !== index));
      }
    },
    []
  );

  // Utility function to check if PackagingComponentData is empty
  const isPackagingComponentDataEmpty = (
    component: PackagingComponentData
  ): boolean => {
    const {
      pc_nm,
      description,
      component_type,
      weight,
      recyclability_status,
      sub_components
    } = component;
    const emptyOrUndefined = (value: undefined | string) => {
      return !value || value === "";
    };
    return (
      emptyOrUndefined(pc_nm) &&
      emptyOrUndefined(description) &&
      emptyOrUndefined(component_type) &&
      emptyOrUndefined(weight) &&
      emptyOrUndefined(recyclability_status) &&
      Array.isArray(sub_components) &&
      sub_components.length === 0 // Check if material is an empty array
    );
  };

  const handleSavePackingOnTab = useCallback(() => {
    const sanitizedSavedData = sanitizeData(packagingSavedData);
    const sanitizedAllData = sanitizeData(packagingAllData);
  
    if (JSON.stringify(sanitizedSavedData) !== JSON.stringify(sanitizedAllData))
    handleSaveCalculatePacking(true);
  }, [packagingAllData, primaryData, secondaryData]);


  const handleSavePacking = useCallback(() => {
    setCalculateClickPackaging(true);
    if (packagingAllData.packaging_level.length > 0) {
      handleSaveCalculatePacking(false)
    }
    
  }, [packagingAllData, primaryData, secondaryData]);

  const handleSaveCalculatePacking = useCallback(
    async (isAutoSave: boolean, customPackagingData?: PackagingDataType) => {
      const packagingDataToUse = customPackagingData || packagingAllData;
  
      const updatedPackagingLevel = getUpdatedPackagingLevel(packagingDataToUse);
      const fg_specSplitString = assessmentsData?.fg_spec?.split("-");
      const spec = getSpecOrVersionValue("spec", fg_specSplitString);
      const version = getSpecOrVersionValue("version", fg_specSplitString);
  
      if (!isAutoSave) {
        setIsCalculating(true);
        setIsSaveEnabled(false);
        setResetData(true);
      }
  
      setIsComponentDataChangePrimary([]);
      setIsComponentDataChangeSecondary([]);
  
      const cleanedPackagingLevel = getCleanedPackagingLevel(updatedPackagingLevel);
      const cleanedPackagingLevelForCalculation = getCleanedPackagingLevelForCalculation(updatedPackagingLevel);
  
      const productPostData = buildProductPostData(
        isAutoSave,
        cleanedPackagingLevel,
        cleanedPackagingLevelForCalculation,
        spec,
        version
      );
  
      try {
        const response = await axios.post(
          `${ApiEndPointsURL}${ApiEndPoints.add_update_packaging}`,
          productPostData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handleResponse(response, isAutoSave, productPostData);
      } catch (ex) {
        handleError(ex, isAutoSave);
      }
    },
    [packagingAllData, primaryData, secondaryData]
  );
  
  // Helper functions:
  const getUpdatedPackagingLevel = (packagingDataToUse: PackagingDataType) => {
  return packagingDataToUse.packaging_level.map((level) => {
    const updatedLevel: PackagingLevelData & { isManualEdit?: boolean } = {
      ...level,
      components: level.components.map((component) => {
        if (!component.isEdited && component._id && component.pc_nm !== "") {
          return { ...component, isEdited: component.isEdited };
        }
        return component;
      }),
    };
if (level.packaging_level === "Primary") {
      if (level.components.length === 0) {
        // No components → force defaults
        updatedLevel.isManualEdit = false;
        updatedLevel.productEvaluation = 90;
        setProductEvacuationValue("90");
        setIsManualOverride(false)
      } else {
        updatedLevel.isManualEdit = isManualOverride || level.isManualEdit || false;
      }
    }

    return updatedLevel;
  });
};
  
  const getSpecOrVersionValue = (type: "spec" | "version", value: string[]) => {
    if (type === "spec") {
      return value ? value.slice(0, -1).join("-") : "";
    }
    if (type === "version") {
      return value ? value[value.length - 1] : "";
    }
  };
  
 const clearMaterial = (material) => {
  return material?.map(({ _id, productEnvironmentalFootPrint, carbonFootPrint, ...rest }) => ({ ...rest }));
};

const clearSubComponents = (subComponents) => {
  return subComponents?.map(({ _id, material, ...rest }) => ({
    ...rest,
    material: clearMaterial(material), // Clean materials inside each subcomponent
  }));
};
  const getCleanedPackagingLevel = (updatedPackagingLevel:PackagingLevelData[]) => {
    return updatedPackagingLevel?.map((level) => ({
      ...level,
      components: level?.components
        ?.filter((component) => !isPackagingComponentDataEmpty(component)) // Remove empty components
        ?.map(({ totalpef, totalpcf, ...component }) => ({
          ...component,
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sub_components: clearSubComponents(component?.sub_components),
        })),
    }));
  };
  
  const getCleanedPackagingLevelForCalculation = (updatedPackagingLevel:PackagingLevelData[]) => {
    return updatedPackagingLevel.map((level) => ({
      ...level,
      components: level.components
        .filter((component) => !isPackagingComponentDataEmpty(component))
        .map(({ ...component }) => ({
          ...component,
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sub_components: clearSubComponents(component?.sub_components),
          isCalculated: true
        })),
    }));
  };
  
  const buildProductPostData = (
    isAutoSave: boolean,
    cleanedPackagingLevel,
    cleanedPackagingLevelForCalculation,
    spec: string,
    version: string
  ) => {
    const {
      salesZone = "",
      productionZone = "",
      netContent = "",
      netContentUnit = "",
      useDose = "",
      useDoseUnit = "",
      consumablesUsed = "",
      productSegment = "",
      productSubSegment = "",
      rawMaterials = [{}],
      useScenario = "",
    } = formulation || {};
  
    return {
      productId: productData.productId,
      assessmentId: assessmentsData._id,
      assessmentType: assessmentsType,
      fg_spec: spec,
      fg_revision: version,
      sales_country: salesZone,
      production_country: productionZone,
      net_content: netContent,
      net_content_unit: netContentUnit,
      packaging_level: isAutoSave ? cleanedPackagingLevel : cleanedPackagingLevelForCalculation,
      packagingType: "Primary",
      useDose,
      useScenario,
      useDoseUnit,
      consumablesUsed,
      productSegment,
      productSubSegment,
      rawMaterials,
      isCalculating: !isAutoSave,
      isBaselineCalcUpdated: isBaseLineNewlyAdded || (!allCalculated || isCalculationUpdatedPackaging) && allFlagsCalculated
    };
  };
  
  const handleResponse = (response, isAutoSave, productPostData) => {
    if (response.status === 200) {
      setCalculateClickPackaging(false)
      if (isAutoSave) {
        handleAutoSaveResponse(response, productPostData);
      } else {
        setIsProductEvacuationChanged(true)
        handleManualSaveResponse();
      }
    } else {
      setCalculateClickPackaging(false)
      handleErrorResponse();
    }
  };
  
  const handleAutoSaveResponse = (response, productPostData) => {
    const assessmentList = response?.data?.assessments?.[productPostData?.assessmentType];
    let normalizedAssessmentList: AssessmentDataType[] = [];

if (Array.isArray(assessmentList)) {
  normalizedAssessmentList = assessmentList;
} else if (assessmentList) {
  normalizedAssessmentList = [assessmentList];
}
  
    if (normalizedAssessmentList.length > 0) {
      const responsedata = normalizedAssessmentList.find(
        (assessment: AssessmentDataType) => assessment?._id === productPostData?.assessmentId
      );
      setAssessmentsData(responsedata);
      setPackagingSavedData({ packaging_level: responsedata?.packaging_level });
      setPackagingAllData({ packaging_level: responsedata?.packaging_level });
    }
  };
  
  const handleManualSaveResponse = () => {
    refetch();
    setIsCalculating(false);
    setResetData(false);
    resultDataRefetch();
    refetchResultBaseline();
  };
  
  const handleErrorResponse = () => {
    toast.error(
      "Error occurred while submitting the Component details, please try again!",
      {
        type: "error",
        progressStyle: { background: "#e1aeae" },
        progressClassName: "toastProgressError",
        theme: "light",
        style: { color: "#FFFFFF", background: "#e1aeae" },
      }
    );
    refetch();
    setIsCalculating(false);
    resultDataRefetch();
    refetchResultBaseline();
  };
  
  const handleError = (ex, isAutoSave) => {
    const errorMessage = ex?.response?.data?.message ?? "Error occurred while submitting the Component details, please try again!";
    toast.error(errorMessage, {
      type: "error",
      progressStyle: { background: "#e1aeae" },
      progressClassName: "toastProgressError",
      theme: "light",
      style: { color: "#FFFFFF", background: "#e1aeae" },
    });
    if (!isAutoSave) {
      setIsCalculating(false);
    }
  };
  

  const extractBaseAndIndex = (str: string) => {
    const lastUnderscoreIndex = str.lastIndexOf("_");
    const fname = str.substring(0, lastUnderscoreIndex);
    const index = Number(str.substring(lastUnderscoreIndex + 1));
    return { fname, index };
  };

  const handelChangeRecycleStatus = (
    status: string,
    index: number,
    type: "Primary" | "Secondary",
    isImportData: boolean
  ) => {
    setIsSaveEnabled(true);
    if (type === "Primary") {
      setPrimaryData((prevItems) =>
        prevItems.map((item, i) => {
          if (i === index) {
            const updatedItem = {
              ...item,
              recyclability_status: status.trim(),
              isEdited: item.isEdited ? item.isEdited : isImportData, 
              isCalculated: false
            };
            updatedItem.isDataComplete = validateComponent(updatedItem); // Set validity flag
            return updatedItem;
          }
          return item;
        })
      );
    }

    if (type === "Secondary") {
      setSecondaryData((prevItems) =>
        prevItems.map((item, i) => {
          if (i === index) {
            const updatedItem = {
              ...item,
              recyclability_status: status.trim(),
              isEdited: item.isEdited ? item.isEdited : isImportData, 
              isCalculated: false
            };
            updatedItem.isDataComplete = validateComponent(updatedItem); // Set validity flag
            return updatedItem;
          }
          return item;
        })
      );
    }
  };

const validateComponent = (component: PackagingComponentData): boolean => {
  if (!component || !Array.isArray(component.sub_components)) return false;

  let totalMaterialPctAcrossAllSubComponents = 0;

  const allSubComponentsValid = component.sub_components.every((subComponent) => {
    // Validate subComponent required fields
    const requiredSubComponentFields = [
      subComponent.name,
      subComponent.opacity,
      subComponent.color,
      subComponent.finishing_process,
    ];

    const hasAllSubComponentFields = requiredSubComponentFields.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );

    // Validate materials
    const materials = subComponent.material;
    const hasAtLeastOneMaterial = Array.isArray(materials) && materials.length > 0;

    const allMaterialsValid =
      hasAtLeastOneMaterial &&
      materials.every((material) => {
      if (material.material_pct === ""|| material.material_pct===null) { return false; }
        const materialPct = Number(material.material_pct);
        return (
          typeof material.material_name === "string" && material.material_name.trim() !== "" &&
          typeof material.material_type === "string" && material.material_type.trim() !== "" &&
          typeof material.converting_process === "string" && material.converting_process.trim() !== "" &&
          materialPct >= 0
        );
      });

    // Accumulate material percentage if all materials are valid
    if (allMaterialsValid) {
      const subTotal = materials.reduce(
        (sum, material) => sum + (Number(material.material_pct) || 0),
        0
      );
      totalMaterialPctAcrossAllSubComponents += subTotal;
    }

    return hasAllSubComponentFields && allMaterialsValid;
  });

  const totalWeight = Number(Number(totalMaterialPctAcrossAllSubComponents).toFixed(6));
const expectedWeight = Number(Number(component.weight).toFixed(6));

const weightMatches = Math.abs(totalWeight - expectedWeight) <= 1;

 const requiredFields = [
      component.component_type,
      component.weight,
      component.opacifier,
      component.recyclability_status,
    ];
    const hasAllRequiredFields = requiredFields.every(
      (field) => Array.isArray(field) ? field.length !== 0 : field?.trim() !== ""
    );
  const recyclabilityValid =
    component.recyclability_status?.trim() === "Recycle Ready" ||
    component.recyclability_status?.trim() === "Not Recycle Ready";

  return hasAllRequiredFields && Number(component.weight)!=0 && allSubComponentsValid && weightMatches && recyclabilityValid;
};



  const handelAllChanges = (
    name: string,
    value: string,
    type: "Primary" | "Secondary",
    isAdd: boolean,
    isImportData: boolean
  ) => {
    setIsSaveEnabled(true);
    const { fname, index } = extractBaseAndIndex(name);
   // Select the appropriate data set based on type
   const data = type === "Primary" ? primaryData : secondaryData;

   const pcNmCheck = data[index]?.pc_nm !== "";

   // Check if the value is empty or if the field exists is false
   let isValueEmptyCheck = Array.isArray(data[index]?.[fname]) ? data[index]?.[fname].length == 0 : !data[index]?.[fname]?.trim();
   if (fname === "weight") {
     isValueEmptyCheck = !data[index]?.fieldsExist?.weight;
   }
 // If the field exists, handle changes
const fieldExists = data[index]?.fieldsExist?.[fname] ?? false; // Defaults to false if undefined or missing
if (!isValueEmptyCheck && fieldExists) {
  if (!isAdd || pcNmCheck) {
    handleChangeClickValue(index, type);
  }
}
   

    if (type === "Primary") {
      setPrimaryData((prevItems) =>
        prevItems.map((item, i) => {
          if (i === index) {
            const updatedItem = {
              ...item,
              [fname]: fname !== "description"? Array.isArray(value) ? value :  value.trim(): value,
              isEdited: item.isEdited ? item.isEdited : isImportData,// Set isEdited to true if _id exists, false if it doesn't
              isCalculated: false
            };
            updatedItem.isDataComplete = validateComponent(updatedItem); // Set validity flag
            return updatedItem;
          }
          return item;
        })
      );
    }

    if (type === "Secondary") {
      setSecondaryData((prevItems) =>
        prevItems.map((item, i) => {
          if (i === index) {
            const updatedItem = {
              ...item,
              [fname]: Array.isArray(value) ? value : value.trim(),
              isEdited: item.isEdited ? item.isEdited : isImportData, // Set isEdited to true if _id exists, false if it doesn't
              isCalculated: false
            };
            updatedItem.isDataComplete = validateComponent(updatedItem); // Set validity flag
            return updatedItem;
          }
          return item;
        })
      );
    }
  };
  const handleChangeSelect = (
    e: SelectChangeEvent<string>,
    type: "Primary" | "Secondary",
    isAdd: boolean,
    isImportData: boolean
  ) => {
    const { name, value } = e.target;
    handelAllChanges(name, value, type, isAdd, isImportData);
    setIsSaveEnabled(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "Primary" | "Secondary",
    isAdd: boolean,
    isImportData: boolean
  ) => {
    setIsSaveEnabled(true);
    const { name, value } = e.target;
    handelAllChanges(name, value, type, isAdd, isImportData);
  };

  // When adding a new primary component, don't set isEdited to true
  const handleAddPrimary = () => {
    if (isPrimaryAddEnabled) {
      const primary: PackagingComponentData = {
        pc_nm: "",
        description: "",
        component_type: "",
        recyclability_status: "",
        weight: "",
        opacifier: "",
        stage: "",
        state: "",
        template: "",
        isEdited: false, // New components start with isEdited set to false
        isDataComplete: false,
        sub_components:[],
        isCalculated: false,
        totalpef: 0,
        totalpcf:0
      };
      setPrimaryData((prevData) => [...prevData, primary]);
      setIsPrimaryAddEnabled(false);
    }
  };

  // When adding a new secondary component, don't set isEdited to true
  const handleAddSecondary = () => {
    if (isSecondaryAddEnabled) {
      const secondary: PackagingComponentData = {
        pc_nm: "",
        description: "",
        component_type: "",
        recyclability_status: "",
        weight: "",
        opacifier: "",
        stage: "",
        state: "",
        template: "",
        sub_components:[],
        isEdited: false, // New components start with isEdited set to false
        isDataComplete: false,
        isCalculated: false,
        totalpef: 0,
        totalpcf:0
      
      };

      setSecondaryData((prevData) => [...prevData, secondary]);
      setIsSecondaryAddEnabled(false);
    }
  };
 const allowedFields = [
  "pc_nm",
  "description",
  "weight",
  "recyclability_status",
  "component_type",
  "opacifier",
  "template",
  "stage",
  "state",
  "sub_components",
];

// 🔹 helper: sanitize material array
const sanitizeMaterial = (materials?: MaterialFieldsExistType[]): MaterialFieldsExistType[] => {
  if (!Array.isArray(materials)) return [];

  return materials.map((mat) => ({
    material_name: mat.material_name ?? false,
    material_type: mat.material_type ?? false,
    converting_process: mat.converting_process ?? false,
    material_pct: mat.material_pct ?? false,
    pcr_content: mat.pcr_content ?? false,
    layer: mat.layer ?? false,
  }));
};

// 🔹 helper: sanitize sub_components array
const sanitizeSubComponents = (subs?: SubComponentFieldsExistType[]): SubComponentFieldsExistType[] => {
  if (!Array.isArray(subs)) return [];

  return subs.map((sub) => ({
    name: sub.name ?? false,
    opacity: sub.opacity ?? false,
    color: sub.color ?? false,
    finishing_process: sub.finishing_process ?? false,
    material: sanitizeMaterial(sub.material),
  }));
};

// 🔹 main function
const sanitizeFieldsExist = (fieldsExist: FieldsExistType): FieldsExistType => {
  // initialize defaults
  const sanitized: Partial<FieldsExistType> = Object.fromEntries(
    allowedFields.map((field) => [field, field === "sub_components" ? [] : false])
  );

  if (fieldsExist && typeof fieldsExist === "object") {
    Object.entries(fieldsExist).forEach(([key, value]) => {
      if (!allowedFields.includes(key)) return;

      if (key === "sub_components") {
        sanitized.sub_components = sanitizeSubComponents(value as SubComponentFieldsExistType[]);
      } else {
        (sanitized)[key] = value;
      }
    });
  } else {
    console.warn(
      "fieldsExist is undefined or not an object. Defaulting to sanitized with all fields set to false."
    );
  }

  return sanitized as FieldsExistType;
};

  const handelImportPackingData = useCallback(
    (
      data: PackagingComponentData,
      index: number,
      type: "Primary" | "Secondary"
    ) => {
      const updateData = (prevItems: PackagingComponentData[]) => {
        if (index < prevItems.length) {
          return prevItems.map((item, i) =>
            i === index ? updateItem(item) : item
          );
        }
        return [...prevItems, data];
      };
      
      const updateItem = (item: PackagingComponentData) => {
        return {
          ...item,
          pc_nm: data.pc_nm ?? "",
          description: data.description ?? "",
          component_type: data.component_type ?? "",
          recyclability_status: "",
          weight: data.weight ?? "",
          opacifier: data.opacifier ?? "",
          stage: data.stage ?? "",
          state: data.state ?? "",
          template: data?.template ?? "",
          sub_components: getCleanedSubComponent(data?.sub_components),
          fieldsExist: sanitizeFieldsExist(data.fieldsExist), // Sanitize fieldsExist
        };
      };
 

// ✅ Clean materials
const getCleanedMaterial = (materials: MaterialEntity[] = []): MaterialEntity[] => {
  return materials
    .map(({ fieldsExist, ...rest }) => rest);
};

// ✅ Clean subcomponents
const getCleanedSubComponent = (subcomponents: SubComponent[] = []): SubComponent[] => {
  return subcomponents
    .map(({ material, ...rest }) => ({
      ...rest,
      material: getCleanedMaterial(material),
    }));
};

      // Update primary or secondary data directly
      let updatedPrimaryData = [...primaryData];
      let updatedSecondaryData = [...secondaryData];
  
      setIsSaveEnabled(true);
      if (type === "Primary") {
        updatedPrimaryData = updateData(primaryData);
        setPrimaryData(updatedPrimaryData);
        setIsComponentDataChangePrimary((prevState) =>
          prevState.filter((item) => item.index !== index+'p')
        );
      }
  
      if (type === "Secondary") {
        updatedSecondaryData = updateData(secondaryData);
        setSecondaryData(updatedSecondaryData);
        setIsComponentDataChangeSecondary((prevState) =>
          prevState.filter((item) => item.index !== index+'s')
        );
      }
  
      // Update packagingAllData directly
      const updatedPackagingAllData = {
        packaging_level: [
          {
            packaging_level: "Primary",
            isrecyclable: packagingSavedData?.packaging_level?.[0]?.isrecyclable || false,
            recyclability_status: packagingSavedData?.packaging_level?.[0]?.recyclability_status || primaryRecycleStatus,
            productEvaluation: Number(productEvacuationValue),
            components: updatedPrimaryData,
          },
          {
            packaging_level: "Secondary",
            isrecyclable: packagingSavedData?.packaging_level?.[1]?.isrecyclable || false,
            recyclability_status: packagingSavedData?.packaging_level?.[1]?.recyclability_status || secondaryRecycleStatus,
            productEvaluation: 0,
            components: updatedSecondaryData,
          },
        ],
      };
      setPackagingAllData(updatedPackagingAllData);
      // Call save function with the updated data
      handleSaveCalculatePacking(true, updatedPackagingAllData);
    },
    [
      primaryData,
      secondaryData,
      primaryRecycleStatus,
      secondaryRecycleStatus,
      productEvacuationValue,
      handleSaveCalculatePacking,
    ]
  );
  
  

  const handelChangeTableData = (
  subComponents: SubComponent[],
  index: number,
  type: "Primary" | "Secondary",
  isAdd: boolean
) => {

  // Flatten all materials from subComponents
  const material: MaterialEntity[] = subComponents?.flatMap(
    (subComp) => subComp?.material || []
  );

  if (type === "Primary" && primaryData?.length) {
    handleDataChange("Primary", material, subComponents, index, isAdd);
  }

  if (type === "Secondary" && secondaryData?.length) {
    handleDataChange("Secondary", material, subComponents, index, isAdd);
  }
};

function hasMaterialFieldChanged(
  newMat: MaterialEntity,
  existingMat: MaterialEntity,
  matFieldsExist: Record<string, boolean>
): boolean {
  return Object.keys(newMat).some((key) => {
    const k = key as keyof MaterialEntity;

    const changed =
      JSON.stringify(newMat[k]) !== JSON.stringify(existingMat[k]);
    return changed && matFieldsExist[k];
  });
}

function hasMaterialChangedFunc(
  newMats: MaterialEntity[],
  existingMats: MaterialEntity[],
  matFieldsExistArray: Array<Record<string, boolean>>
): boolean {
  return newMats.some((newMat, matIndex) => {
    const existingMat = existingMats[matIndex] || ({} as MaterialEntity);
    const matFieldsExist = matFieldsExistArray[matIndex] ?? {};
    return hasMaterialFieldChanged(newMat, existingMat, matFieldsExist);
  });
}
const handleDataChange = (
  type: "Primary" | "Secondary",
  flatMaterials: MaterialEntity[],
  newSubComponents: SubComponent[],
  index: number,
  isAdd: boolean
) => {
  const data = type === "Primary" ? primaryData : secondaryData;
  const setData = type === "Primary" ? setPrimaryData : setSecondaryData;

  const currentItem = data[index];
  const currentSubComponents = currentItem?.sub_components || [];

  // Compare materials
  const currentMaterials = currentSubComponents?.flatMap(
    (subComp) => subComp?.material || []
  );
  const hasMaterialChanged = !isEqual(flatMaterials, currentMaterials);

  // Compare other subComponent fields
  const hasSubComponentChanged = !isEqual(newSubComponents, currentSubComponents);


  if (!hasMaterialChanged && !hasSubComponentChanged) {
    return; // No meaningful changes
  }

  setIsSaveEnabled(true);

  const pcNmCheck = currentItem?.pc_nm !== "";
  const fieldsExist = currentItem?.fieldsExist || {};
const shouldCallHandleClick = currentSubComponents.some((_sc, subIndex) => {
  // --- 1. Check sub-component fields
  const subFieldsExist = fieldsExist["sub_components"]?.[subIndex] ?? {};
  const newSub = newSubComponents[subIndex] || {};
  const existingSub = currentSubComponents[subIndex] || {};

  const subChanged = Object.keys(newSub).some((key) => {
      if (key === "material") return false; // skip material
    const changed = JSON.stringify(newSub[key]) !== JSON.stringify(existingSub[key]);
    return changed && subFieldsExist[key];
  });

  // --- 2. Check material fields inside this sub-component
  const newMats = newSub["material"] || [];
  const existingMats = existingSub["material"] || [];
  const matFieldsExistArray = subFieldsExist.material || [];

  const matChanged = hasMaterialChangedFunc(newMats, existingMats, matFieldsExistArray);

  return subChanged || matChanged;
});

  const isRowEmpty =
    flatMaterials?.length === currentMaterials?.length;
  if ((!isAdd || pcNmCheck) && (shouldCallHandleClick || !isRowEmpty)) {
    handleChangeClickValue(index, type);
  }
  // Update state
 const buildUpdatedSubComponents = (
  newSubComponents: SubComponent[],
  currentSubComponents: SubComponent[],
  flatMaterials: MaterialEntity[]
) => {
  let materialIndex = 0;

  return newSubComponents?.map((newSubComp, subIndex) => {
    const materialCount = newSubComp?.material?.length || 0;
    const updatedMaterials = flatMaterials.slice(
      materialIndex,
      materialIndex + materialCount
    );
    materialIndex += materialCount;

    return {
      ...currentSubComponents[subIndex],
      ...newSubComp,
      material: updatedMaterials,
    };
  });
};

setData((prevItems) =>
  prevItems.map((item, i) => {
    if (i !== index) return item;

    const updatedSubComponents = buildUpdatedSubComponents(
      newSubComponents,
      currentSubComponents,
      flatMaterials
    );

    const updatedItem = {
      ...item,
      sub_components: updatedSubComponents,
      isCalculated: false,
    };

    updatedItem.isDataComplete = validateComponent(updatedItem);
    return updatedItem;
  })
);

};

  
  const setPcNmToEmpty = (index: number, type: "Secondary" | "Primary") => {
    if (type === "Primary") {
      setPrimaryData((prevData) => {
        const newData = [...prevData];
        if (newData[index]) {
          newData[index].pc_nm = "";
        }
        return newData;
      });
    }
    if (type === "Secondary") {
      setSecondaryData((prevData) => {
        const newData = [...prevData];
        if (newData[index]) {
          newData[index].pc_nm = "";
        }
        return newData;
      });
    }
  };
  const handleClickEditCancle = (
    index: number,
    type: "Secondary" | "Primary",
  ) => {
    removeComponentDataChange(index, type);
    restoreComponentData(index, type);
  };

  // Function to remove component data change status for the given index and type
  const removeComponentDataChange = (
    index: number,
    type: "Primary" | "Secondary"
  ) => {
    const trueItem = getComponentDataChangeItem(index, type);
    if (trueItem) {
      if (type === "Primary") {
        setIsComponentDataChangePrimary((prevState) =>
          prevState.filter((item) => item.index !== index+'p')
        );
      } else {
        setIsComponentDataChangeSecondary((prevState) =>
          prevState.filter((item) => item.index !== index+'s')
        );
      }
    }
  };

  // Function to fetch the item representing the change status of component data
  const getComponentDataChangeItem = (
    index: number,
    type: "Primary" | "Secondary"
  ) => {
    return type === "Primary"
      ? isComponentDataChangePrimary.find(
          (item) => item.index === index+'p' && item.value === true
        )
      : isComponentDataChangeSecondary.find(
          (item) => item.index === index+'s' && item.value === true
        );
  };

  // Helper function to update data at a specified index
  const updateDataAtIndex = (
    data: PackagingComponentData[], // Array of PackagingComponentData
    index: number, // Index to update
    componentData: PackagingComponentData // New component data to insert at the specified index
  ): PackagingComponentData[] => {
    const updatedData = [...data];
    updatedData[index] = componentData; // Update the item at the given index
    return updatedData; // Return the updated array
  };

  // Function to restore component data from saved packaging data or remove it
  const restoreComponentData = (
    index: number,
    type: "Primary" | "Secondary"
  ) => {
    const savedPackagingLevel = getSavedPackagingLevel(type);
    if (savedPackagingLevel) {
      const componentToRestore = savedPackagingLevel.components[index];
      if (componentToRestore) {
        restoreComponent(index, type, componentToRestore);
      } else {
        removeComponent(index, type);
      }
    } else {
      removeComponent(index, type);
    }
  };

  // Function to get saved packaging level based on type
  const getSavedPackagingLevel = (type: "Primary" | "Secondary") => {
    return packagingSavedData.packaging_level.find(
      (level) => level.packaging_level === type
    );
  };

  // Function to restore a component
  const restoreComponent = (
    index: number,
    type: "Primary" | "Secondary",
    componentToRestore: PackagingComponentData
  ) => {
    if (type === "Primary") {
      setPrimaryData((prevItems) =>
        updateDataAtIndex(prevItems, index, {
          ...componentToRestore,
          sub_components: [...componentToRestore.sub_components],
        })
      );
    } else {
      setSecondaryData((prevItems) =>
        updateDataAtIndex(prevItems, index, {
          ...componentToRestore,
          sub_components: [...componentToRestore.sub_components],
        })
      );
    }
  };

  // Function to remove the component from the data
  const removeComponent = (index: number, type: "Primary" | "Secondary") => {
    if (type === "Primary") {
      setPrimaryData((prevItems) => removeDataAtIndex(prevItems, index));
    } else {
      setSecondaryData((prevItems) => removeDataAtIndex(prevItems, index));
    }
  };

  const removeDataAtIndex = (
    data: PackagingComponentData[],
    index: number
  ): PackagingComponentData[] => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    return updatedData;
  };

  // Main function
  const handleClickCancelContinue = (
    index: number,
    type: "Secondary" | "Primary"
  ) => {
    const savedPackagingLevel = packagingSavedData.packaging_level.find(
      (level) => level.packaging_level === type
    );

    if (!savedPackagingLevel) {
      return removeData(type, index); // If savedPackagingLevel is not found, remove data
    }

    const componentToRestore = savedPackagingLevel.components[index];
    if (componentToRestore) {
      return restoreComponent(index, type, componentToRestore); // Restore the component if it exists
    }

    return removeData(type, index); // If component doesn't exist, remove data
  };

  // Function to handle data removal based on type
  const removeData = (type: "Secondary" | "Primary", index: number) => {
    if (type === "Primary") {
      setPrimaryData((prevData) => removeDataAtIndex(prevData, index));
    } else if (type === "Secondary") {
      setSecondaryData((prevData) => removeDataAtIndex(prevData, index));
    }
  };

  //useEffect section
  useEffect(() => {
    const isValidPrimary = hasNonEmptyValue(primaryData);
    const isValidSecondary = hasNonEmptyValue(secondaryData);
    setIsPrimaryAddEnabled(isValidPrimary);
    setIsSecondaryAddEnabled(isValidSecondary);
  }, [primaryData, secondaryData]);

  // update all changes/updated data
  useEffect(() => {
    
    const packagingLevelData: PackagingLevelData[] = [
      {
        packaging_level: "Primary",
        isrecyclable: packagingSavedData?.packaging_level?.[0]?.isrecyclable || false,
        recyclability_status: packagingSavedData?.packaging_level?.[0]?.recyclability_status || primaryRecycleStatus,
        productEvaluation: Number(productEvacuationValue),
        isManualEdit: packagingSavedData?.packaging_level?.[0]?.isManualEdit,
        components: primaryData,
      },
      {
        packaging_level: "Secondary",
        isrecyclable: packagingSavedData?.packaging_level?.[1]?.isrecyclable || false,
        recyclability_status: packagingSavedData?.packaging_level?.[1]?.recyclability_status || secondaryRecycleStatus,
        productEvaluation: 0,
        isManualEdit:false,
        components: secondaryData,
      },
    ];

    setPackagingAllData((prevData) => ({
      ...prevData,
      packaging_level: packagingLevelData,
    }));
    setCounterSecondary(secondaryData?.length);
    setCounterPrimary(primaryData?.length);
  }, [primaryData, secondaryData, productEvacuationValue]);

useLayoutEffect(() => {
  if (packagingData?.packaging_level) {
    setPackagingAllData({ packaging_level: packagingData?.packaging_level });
    const savedLevels = packagingData.packaging_level.map((level) => {
      if (level.packaging_level === "Primary" && primaryPackaging) {
        return { ...level, components: primaryPackaging.components };
      }
      if (level.packaging_level === "Secondary" && secondaryPackaging) {
        return { ...level, components: secondaryPackaging.components };
      }
      return level;
    });
    setPackagingSavedData({ packaging_level: savedLevels });
  }

  if (secondaryPackaging) {
    setSecondaryData(secondaryPackaging.components);
    setSecondaryRecycleStatus(
      assessmentsData?.packaging_level?.[1]?.recyclability_status
    );
  }

  if (primaryPackaging) {
    setPrimaryData(primaryPackaging.components);
    setPrimaryRecycleStatus(
      assessmentsData?.packaging_level?.[0]?.recyclability_status
    );

    const evalValue = primaryPackaging.productEvaluation;
    if (evalValue !== undefined && evalValue !== null) {
      setProductEvacuationValue(evalValue === 0 ? "" : evalValue.toString());
    } else {
      setProductEvacuationValue("");
    }
  }
}, [packagingData, secondaryPackaging, primaryPackaging]);
// New useEffect to trigger recycle status update
useEffect(() => {
  if (packagingSavedData?.packaging_level) {
    setPrimaryRecycleStatus(assessmentsData?.packaging_level?.[0]?.recyclability_status);
      setSecondaryRecycleStatus(assessmentsData?.packaging_level?.[1]?.recyclability_status)
   
  }
}, [packagingSavedData]);

  const allFlagsCalculated = useMemo(() => {
    if (!assessmentsData) return false;
    const requiredFlags = [
      assessmentsData.isCalculatedButtonClicked,
      assessmentsData.isFormulationCalculated,
      assessmentsData.isFormulationEOLCalculated,
      assessmentsData.isGreenChemistryCalculated,
     assessmentsData.isGreenChemistryRollupCalculated,
      assessmentsData.isLCACalculated,
      assessmentsData.isPackagingCalculated,
      assessmentsData.isSpiceCalculated,
      assessmentsData.isSustainabilityPackagingCalculated,
      assessmentsData.isSustainabilityPackagingRollupCalculated,
    ];
    return requiredFlags.every(flag => flag === true);
  }, [assessmentsData]);


  const checkProductEvacuationValue = useCallback(() => {
  
  const hasPumpType = primaryData?.some(
    (component) => component.component_type === "Pump"
  );

 
    hasPumpType ? setProductEvacuationValue("80") : setProductEvacuationValue("90");

}, [primaryData]);
useEffect(() => {
  const evalValue = primaryPackaging?.productEvaluation;

  if (primaryPackaging?.isManualEdit && (evalValue === 0 || evalValue === null)) {
    setProductEvacuationValue("");
    return;
  }

  if (!primaryPackaging?.isManualEdit && evalValue !== undefined && evalValue !== null) {
    setProductEvacuationValue(evalValue === 0 ? "" : evalValue.toString());
  }
}, [primaryPackaging]);
useEffect(() => {
  if (isManualOverride || primaryPackaging?.isManualEdit) return;

  checkProductEvacuationValue();
}, [primaryData, primaryPackaging]);


  const removeIdsAndSort = (obj) => {
    if (Array.isArray(obj)) {
      // Recursively process each element in the array
      return obj.map(removeIdsAndSort);
    } else if (typeof obj === "object" && obj !== null) {
      const { _id, ...rest } = obj; // Remove _id if present
  
      // Recursively process and sort the keys of nested objects
      const sanitizedObj = {};
      Object?.keys(rest)
        ?.sort((a, b) => a.localeCompare(b)) // Sort keys alphabetically
        ?.forEach((key) => {
          sanitizedObj[key] = removeIdsAndSort(rest[key]); // Recursively sanitize and sort
        });
  
      return sanitizedObj;
    }
    return obj; // Return non-object/non-array values as is
  };
  
  // Main sanitize and sort function
  const sanitizeData  = (data: PackagingDataType): PackagingDataType => {
    return {
      packaging_level: removeIdsAndSort(data?.packaging_level),
    };
  };
useEffect(() => {

  const sanitizedSavedData = sanitizeData(packagingSavedData);
  const sanitizedAllData = sanitizeData(packagingAllData);

  const hasDiff =
    JSON.stringify(sanitizedSavedData) !== JSON.stringify(sanitizedAllData) && !warningPopUp && !isCalculating;
if (hasDiff) {
      const interval = setInterval(() => {
        handleSaveCalculatePacking(true)
        setIsOneTimeSaveDone(true)
          
      }, 5000);
      return () => clearInterval(interval);
  }
}, [packagingAllData, packagingSavedData]);

  useEffect(() => {
    if (isCalculating || isProductEvacuationChanged) {
      setPrimaryData(prevItems => prevItems.map(item => ({ ...item, isCalculated: true })));
      setSecondaryData(prevItems => prevItems.map(item => ({ ...item, isCalculated: true })));
    }
  }, [isCalculating, isProductEvacuationChanged])
  return {
    packagingAllData,
    primaryData,
    setPrimaryData,
    setSecondaryData,
    setIsProductEvacuationChanged,
    secondaryData,
    isSaveEnabled,
    productEvacuationValue,
    isPrimaryAddEnabled,
    isSecondaryAddEnabled,
    isCalculating,
    primaryRecycleStatus,
    secondaryRecycleStatus,
    counterPrimary,
    counterSecondary,
    resetData,
    packagingSavedData,
    isComponentDataChangePrimary,
    allFlagsCalculated,
    handelChangeTableData,
    handleChange,
    handleChangeSelect,
    handelImportPackingData,
    handleSavePacking,
    handleSavePackingOnTab,
    handelChangeRecycleStatus,
    setProductEvacuationValue,
    handleAddPrimary,
    handleAddSecondary,
    handleDeleteComponent,
    handleClickCancelContinue,
    setIsComponentDataChangePrimary,
    handleClickEditCancle,
    setPcNmToEmpty,
    isComponentDataChangeSecondary,
    setIsComponentDataChangeSecondary,
    setIsSaveEnabled,
    handleSaveCalculatePacking,
    isOneTimeSaveDone,
    setWarningPopUp,
    allCalculated,
    isCalculationUpdatedPackaging,
    setIsManualOverride,
    handleError,
    handleResponse,
    handleAutoSaveResponse,
    validateComponent,
    sanitizeFieldsExist
  };
};

export default useConsumerPackaging;
