/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import {
  ApiEndPointsURL,
  ApiEndPoints,
} from "../constants/ApiEndPoints.constant";
import { ToastContainer } from "react-toastify";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useGlobaldata } from "../contexts/masterData/DataContext";
import { UserDataType } from "../components/breadcrumb/types";
import React from "react";
import {
  IGCMyBaselineProduct,
  IPieChartSeries,
  IRenewableFeedbackStock,
  MyProductDials,
  RawMaterialsEntity1,
  ResultData,
  Totallca,
  VarBaseLineInterface,
  VarProductInterface,
} from "../structures/result";
import { purple } from "@mui/material/colors";
import { IGreenChemFormulationData } from "../components/results/sustainablePackaging/structure";
import { Components, IComponentLevelObject, IComponentMaterialObject } from "../structures/packaging";
import { EditProductAssessment } from "../components/common/GridViewComponentExperimental";
interface DeleteAssessment {
  productSipId: string;
  assessmentId: string;
  type: string;
  productID?: string;
}
export async function callDeleteAssessmentDetails(
  deleteData: DeleteAssessment,
  token: string
) {
  try {
    const requestData: DeleteAssessment = {
      productSipId: deleteData.productSipId,
      assessmentId: deleteData.assessmentId,
      type: deleteData.type,
    };
    const responseData = await axios.delete(
      `${ApiEndPointsURL}${ApiEndPoints.assessment_delete}${deleteData.productID}`,
      {
        data: requestData,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return responseData.status;
  } catch (error) {
    return error;
  }
}

export async function setUnsetAssessmentAsLPP (
  editProductAssessmentPostData: EditProductAssessment,
  productID: string,
  token: string
) {
  try {    
    const responseData = await axios.put(
          `${ApiEndPointsURL}${ApiEndPoints.assessment_edit}/${productID}`,
          editProductAssessmentPostData, { headers: { 'Authorization': `Bearer ${token}` } }
        );
    return responseData;
  } catch (error) {
    return error;
  }
}

export const getTheme = (muiBaseTheme: { spacing: { unit: number } }) => {
  return getExperimentalCardTheme(muiBaseTheme);
};
export const sortData = <T,>(

  array: T[],
 
  orderBy: keyof T,
 
  order: "asc" | "desc"
 
 ) => {
 
  const isNumber = (value: T[keyof T]) => {
 
   return typeof value === "number" || (!isNaN(Number(value)) && value !== null);
 
  };
 
 
 
  const isEmptyValue = (value: T[keyof T]) => {
 
   return value == null || value === "" || value === undefined;
 
  };
 
 
 
  const isNullValue = (aValue: T[keyof T], bValue: T[keyof T]) => {
 
   return isEmptyValue(aValue) && isEmptyValue(bValue);
 
  };
 
 
 
  const checkForZeroAndNonZero = (a: number, b: number) => {
 
   return a === 0 && b !== 0;
 
  };
 
 
 
  const isAsc = (aValue: T[keyof T], bValue: T[keyof T]) => {
 
   return aValue > bValue ? 1 : -1;
 
  };
 
 
 
  const isDesc = (aValue: T[keyof T], bValue: T[keyof T]) => {
 
   return aValue < bValue ? 1 : -1;
 
  };
 
  const cleanValue = (value: T[keyof T]) => {

    // If the value is a string and contains '%', remove the '%' symbol and convert to a number
   
    if (typeof value === "string" && value.includes("%")) {
   
     return parseFloat(value.replace("%", "")); // Convert '100%' to 100
   
    }
   
   
   
    // If it's already a number, return it as is
   
    if (typeof value === "number") {
   
     return value;
   
    }
   
   
   
    // Default case, return as number if it's a valid number in other formats (like string '100')
   
    return Number(value);
   
   };
   
   
 
 
  const compareFunction = (aIsNumber: boolean, bIsNumber: boolean, aValue: T[keyof T], bValue: T[keyof T]) => {
 
   if (aIsNumber && bIsNumber) {
 
    const numA = cleanValue(aValue);
 
    const numB = cleanValue(bValue);
 
 
 
    if (checkForZeroAndNonZero(numA, numB)) return order === "asc" ? -1 : 1;
 
    if (checkForZeroAndNonZero(numB, numA)) return order === "asc" ? 1 : -1;
 
 
 
    return order === "asc" ? numA - numB : numB - numA;
 
   }
 
  };
 
 
 
  const sortFunction = (a: T, b: T) => {
 
   let aValue = a[orderBy];
 
   let bValue = b[orderBy];
 
    if (isEmptyValue(aValue)) aValue = null as T[keyof T];
 
   if (isEmptyValue(bValue)) bValue = null as T[keyof T];
 
 
 
   if (isEmptyValue(aValue) && !isEmptyValue(bValue)) return order === "asc" ? -1 : 1;
 
   if (!isEmptyValue(aValue) && isEmptyValue(bValue)) return order === "asc" ? 1 : -1;
 
   if (isNullValue(aValue, bValue)) return 0;
 
 
 
   const aIsNumber = isNumber(aValue);
 
   const bIsNumber = isNumber(bValue);
 
 
 
   const result = compareFunction(aIsNumber, bIsNumber, aValue, bValue);
 
   if (result !== undefined) return result;
 
 
 
   return order === "asc" ? isAsc(aValue, bValue) : isDesc(aValue, bValue);
 
  };
 
 
 
  return array.sort((a, b) => sortFunction(a, b));
 
 };
 
 
 

export const getExperimentalCardTheme = (muiBaseTheme: {
  spacing: { unit: number };
}) => {
  const offset = 40;
  const cardShadow = "0px 14px 80px rgba(34, 35, 58, 0.2)";
  const headerShadow = "4px 4px 20px 1px rgba(0, 0, 0, 0.2)";

  const baseCardStyles = (muiBaseTheme: { spacing: { unit: number } }) => ({
    marginTop: 50,
    borderRadius: muiBaseTheme.spacing.unit / 2,
    transition: "0.3s",
    boxShadow: cardShadow,
    position: "relative",
    width: "100%",
    overflow: "initial",
    background: "#ffffff",
    color: "#ffffff",
  });

  const headerStyles = (muiBaseTheme: { spacing: { unit: number } }) => ({
    flexShrink: 0,
    position: "absolute",
    top: -offset,
    right: 20,
    left: 20,
    borderRadius: muiBaseTheme.spacing.unit / 2,
    backgroundColor: purple[600],
    overflow: "hidden",
    boxShadow: headerShadow,
    textAlign: "center",
    color: "#ffffff",
  });

  return {
    MuiCard: {
      root: {
        "&.MuiElevatedCard--01": {
          ...baseCardStyles,
          padding: `${muiBaseTheme.spacing.unit * 6}px 0`,
          "& .MuiCardHeader-root": {
            ...headerStyles,
            "& .MuiCardHeader-title": {
              fontWeight: 900,
              letterSpacing: 1,
            },
            "& .MuiCardHeader-subheader": {
              opacity: 0.87,
              fontWeight: 200,
              letterSpacing: 0.4,
            },
          },
          "& .MuiDivider-root": {
            marginLeft: muiBaseTheme.spacing.unit * 5,
            marginRight: muiBaseTheme.spacing.unit * 5,
            paddingTop: "5px",
            marginTop: 5,
            marginBottom: 5,
          },
          "& .MuiLabel-root": {
            paddingTop: "5px",
          },
          "& .MuiCardContent-root": {
            textAlign: "left",
            "& .MuiCardContent-inner": {
              paddingTop: "38px",
              overflowX: "auto",
            },
          },
        },
      },
    },
  };
};

export function formatDate(datestring: string) {
  if (datestring) {
    const dt = new Date(datestring);
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return month[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear();
  }
  return "";
}

export function truncate(source: string, size: number) {
  return source?.length > size ? source?.slice(0, size - 1) + "…" : source;
}
export function getToastContainer(){
  return <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        toastStyle={{ color: '#00b097' }}
        progressClassName = 'toastProgress'
        icon={({ type }) => {
          if (type === "success") return <CheckCircleOutlineIcon />;
          else return "ℹ️";
      }}
      />;
}
export const getColGroup = (tab: string) => {
  switch (tab) {
    case "PCR_CONTENT":
      return (
        <>
          <col style={{ width: "212px" }} />
          <col style={{ width: "154px" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "145px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "158px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "158px" }} />
        </>
      );

    case "MATERIAL_EFFICIENCY":
      return (
        <>
          <col style={{ width: "212px" }} />
          <col style={{ width: "154px" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "110.5px" }} />
          <col style={{ width: "230px" }} />
          <col style={{ width: "110.5px" }} />
          <col style={{ width: "230px" }} />
        </>
      );

    default:
      return (
        <>
          <col style={{ width: "295px" }} /> 
          <col style={{ width: "161px" }} /> 
          {/* Baseline group */}
          <col style={{ width: "110.09px" }} />
          <col style={{ width: "160.09px" }} />
          <col style={{ width: "224.83px" }} />
          {/* My Product group */}
          <col style={{ width: "110.09px" }} />
          <col style={{ width: "160.09px" }} />
          <col style={{ width: "224.83px" }} />
        </>
      );
  }
};

export const GetToastContainer: React.FC = () => {
  const rendericon=(type)=>{
    if (type === "success") return <CheckCircleOutlineIcon />;
    else return "ℹ️";
  }
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastStyle={{ color: "#00b097" }}
      progressClassName="toastProgress"
      icon={({ type }) => rendericon(type)}
    />
  );
};

export function checkEditAccess(
  userList: UserDataType[],
  loginEmailID: string
) {
  if (
    userList?.length > 0 &&
    (loginEmailID != undefined || loginEmailID != null)
  ) {
    const arrUserRole: UserDataType[] = userList?.filter(
      (user: UserDataType) =>
        user.mail &&
        user.mail.toLowerCase().indexOf(loginEmailID.toLowerCase()) != -1
    );

    let flagEdit = 0;

    if (arrUserRole?.length > 0) {
      if (arrUserRole[0].role === "Owner" || arrUserRole[0].role === "Member") {
        flagEdit = 1;
      }
    }
    return flagEdit;
  } else {
    return 0;
  }
}

export function checkDeleteAccess(
  userList: UserDataType[],
  loginEmailID: string
) {
  if (
    userList?.length > 0 &&
    (loginEmailID != undefined || loginEmailID != null)
  ) {
    const arrUserRole: UserDataType[] = userList?.filter(
      (user: UserDataType) =>
        user.mail &&
        user.mail.toLowerCase().indexOf(loginEmailID.toLowerCase()) != -1
    );
    let flagDelete = 0;

    if (arrUserRole?.length > 0) {
      if (arrUserRole[0].role === "Owner") {
        flagDelete = 1;
      }
    }
    return flagDelete;
  } else {
    return 0;
  }
}


const getIsUser = (userList,loginEmailID) => {
  return userList?.length > 0 && (loginEmailID != undefined || loginEmailID != null);
};
export const isSIPAdmin = (roles: string[] | null | undefined): boolean => {
  const adminRole = process.env.ADMIN_ROLE;
  return !!roles?.includes(adminRole || "");
};
export function CheckCRUDAccess(userList: UserDataType[], type: string) {
  const {  loggedInUser } = useGlobaldata();
  const userRoles = loggedInUser?.roles || [];
  const loginEmailID = loggedInUser?.mail;

  // 1. Check if SIP admin
  if (isSIPAdmin(userRoles)) return 1;

  // 2. Check if user exists in the list
  if (getIsUser(userList, loginEmailID)) {
    const arrUserRole: UserDataType[] = userList.filter(
      (user) => user?.mail?.toLowerCase() === loginEmailID?.toLowerCase()
    );

    if (arrUserRole?.length > 0) {
      switch (type) {
        case "product":
        case "team_member":
          if (arrUserRole[0].role === "Owner") {
            return 1;
          }
          break;
        case "assessment":
        case "formulation":
        case "consumer_packaging":
          if (
            arrUserRole[0].role === "Owner" ||
            arrUserRole[0].role === "Member"
          ) {
            return 1;
          }
          break;
        default:
          return 0;
      }
    }
  }

  return 0;
}
export function formatComponents(rawComponents: Components[]): IComponentLevelObject[] {
   return rawComponents?.map((component) => {
     const formattedMaterials: IComponentMaterialObject[] = [];
    component.sub_components?.forEach((sub) => {
      sub.material?.forEach((mat) => {
        formattedMaterials.push({
          sub_component_name: sub.name,
          material_name: mat.material_name,
          material_type: mat.material_type,
          layer:mat.layer,
          converting_process: mat.converting_process,
          material_pct: String(mat.material_pct ?? ""),
          pcr_content: String(mat.pcr_content ?? ""),
          material_weight: String(mat.material_weight ?? ""),
          material_efficiency: String(mat.material_efficiency ?? ""),
          productEnvironmentalFootPrint: String(mat.productEnvironmentalFootPrint ?? ""),
          carbonFootPrint: String(mat.carbonFootPrint ?? ""),
          PCR_Material_Percent_Component: String(mat.PCR_Material_Percent_Component ?? "")
        });
      });
    });

    return {
      isEdited: String(component.isEdited ?? ""),
      recyclability_status: String(component.recyclability_status ?? ""),
      pc_nm: String(component.pc_nm ?? ""),
      description: String(component.description ?? ""),
      color: String(component.color ?? ""),
      opacity: String(component.opacity ?? ""),
      component_type: String(component.component_type ?? ""),
      weight: String(component.weight ?? ""),
      opacifier: String(component.opacifier ?? ""),
      stage: String(component.stage ?? ""),
      state: String(component.state ?? ""),
      template: String(component.template ?? ""),
      finishing_process: String(component.finishing_process ?? ""),
      material_efficiency: String(component?.material_efficiency ?? ""),
      PCR_Percent_Per_Component: String(component?.PCR_Percent_Per_Component ?? ""),
      material: formattedMaterials
    };
  });
}
// Utility function to get a nested property using a string path
const getNestedProperty = (obj: Totallca, path: string) => {
  return path.split(".").reduce((o, p) => (o ? o[p] : undefined), obj);
};

export const withsignCalculatedPercentage = (numericValue:number) => {
  const roundedValue = Math.round(numericValue).toFixed(0);
  const signRoundedValue = Number(roundedValue) > 0 ? `+${roundedValue}` : roundedValue;
  return(signRoundedValue); 
}

export const calculateFootprintTabs = (
  data: ResultData,
  assessmentType: string,
  keys: { totalProduct: string; formulation: string; packaging: string },
  multiplier: number = 1
) => {
  const calculateTabValues = (field: string) => ({
    percentage: calculatePercentageChange(
      getNestedProperty(data?.[assessmentType]?.totallca, field) ?? 0,
      getNestedProperty(data?.baseline?.totallca, field) ?? 0
    ),
    myproduct:
      (getNestedProperty(data?.[assessmentType]?.totallca, field) ?? 0) *
      multiplier,
    baseline:
      (getNestedProperty(data?.baseline?.totallca, field) ?? 0) * multiplier,
  });
  return {
    totalProduct: calculateTabValues(keys.totalProduct),
    formulation: calculateTabValues(keys.formulation),
    packaging: calculateTabValues(keys.packaging),
  };
};

const getArrRowDataObject = (
  var_raw_material_ef_total: number,
  var_sum_eol_raw_ef: number,
  convert_multiply: number,
  item: RawMaterialsEntity1
) => {
  const var_carbonFootprint = (
    (var_raw_material_ef_total + var_sum_eol_raw_ef) *
    convert_multiply
  ).toFixed(6);

  const result = {
    tradeName: item.raw_material_name,
    rawCode: item.raw_material_id,
    baseline: { massComposition: null, carbonFootprint: null },
    myProduct: {
      massComposition: `${item.raw_material_value}%`,
      carbonFootprint: Number(var_carbonFootprint),
    },
  };

  return result;
};

const getArrBaselineDataObject = (
  var_baseline_raw_material_ef_total: number,
  var_baseline_sum_eol_raw_ef: number,
  convert_multiply: number,
  baseline_raw_material: RawMaterialsEntity1[],
  index_baseline: number,
  arrRowData: {
    tradeName: string;
    rawCode: string;
    baseline: { massComposition: string; carbonFootprint: number };
    myProduct: { massComposition: string; carbonFootprint: number };
  }[]
) => {
  const arrBaselineRowData = arrRowData;

  const var_baseline_carbonFootprint = (
    (var_baseline_raw_material_ef_total + var_baseline_sum_eol_raw_ef) *
    convert_multiply
  ).toFixed(6);

  const existingIndex = arrBaselineRowData.findIndex(
    (el) =>
      el.rawCode === baseline_raw_material[index_baseline]?.raw_material_id
  );
  if (existingIndex < 0) {
    arrBaselineRowData.push({
      tradeName: baseline_raw_material[index_baseline]?.raw_material_name,
      rawCode: baseline_raw_material[index_baseline]?.raw_material_id,
      baseline: {
        massComposition: `${baseline_raw_material[index_baseline]?.raw_material_value}%`,
        carbonFootprint: Number(var_baseline_carbonFootprint),
      },
      myProduct: { massComposition: null, carbonFootprint: null },
    });
  } else {
    arrBaselineRowData[existingIndex].baseline = {
      massComposition: `${baseline_raw_material[index_baseline]?.raw_material_value}%`,
      carbonFootprint: Number(var_baseline_carbonFootprint),
    };
  }

  return arrBaselineRowData;
};

export function getRawMaterialDataFormulation(
  VAR_MYPRODUCT: VarProductInterface,
  VAR_BASELINE: VarBaseLineInterface,
  convert_multiply: number,
  type: "productEnvironmental" | "carbonFootprint"
) {
  let arrRowData: {
    tradeName: string;
    rawCode: string;
    baseline: { massComposition: string; carbonFootprint: number };
    myProduct: { massComposition: string; carbonFootprint: number };
  }[] = [];


  if (type === "carbonFootprint") {
    const myproduct_raw_material = VAR_MYPRODUCT?.rawmaterials?.raw_materials;
    const myproduct_eol_raw_material =
      VAR_MYPRODUCT?.formula_end_of_life?.raw_materials;
    const baseline_raw_material = VAR_BASELINE?.rawmaterials?.raw_materials;
    const baseline_eol_raw_material =
      VAR_BASELINE?.formula_end_of_life?.raw_materials;

    myproduct_raw_material?.forEach(
      (item: RawMaterialsEntity1, index: number) => {
        let var_raw_material_ef_total = 0;
        if (myproduct_raw_material !== undefined) {
          
          const climateChangeAmount = parseFloat(
            String(
              myproduct_raw_material[index]?.raw_material_ef_total
                ?.climate_change_amount_functional_unit
            )
          );
          var_raw_material_ef_total = isNaN(climateChangeAmount)
            ? 0
            : climateChangeAmount;
        }

        let var_sum_eol_raw_ef = 0;
        if (
          myproduct_eol_raw_material !== null &&
          myproduct_eol_raw_material !== undefined
        ) {
          const eolClimateChangeAmount = parseFloat(
            String(
              myproduct_eol_raw_material[index]?.sum_eol_raw_ef
                ?.climate_change_amount_functional_unit
            )
          );
          var_sum_eol_raw_ef = isNaN(eolClimateChangeAmount)
            ? 0
            : eolClimateChangeAmount;
        }

        const arrDataObject = getArrRowDataObject(
          var_raw_material_ef_total,
          var_sum_eol_raw_ef,
          convert_multiply,
          item
        );
        arrRowData.push(arrDataObject);
      }
    );

    baseline_raw_material?.forEach(
      (_baseline_item: RawMaterialsEntity1, index_baseline: number) => {
        let var_baseline_raw_material_ef_total = 0;
        if (baseline_raw_material !== undefined) {
          const baselineClimateChangeAmount = parseFloat(
            String(
              baseline_raw_material[index_baseline]?.raw_material_ef_total
                ?.climate_change_amount_functional_unit
            )
          );
          var_baseline_raw_material_ef_total = isNaN(
            baselineClimateChangeAmount
          )
            ? 0
            : baselineClimateChangeAmount;
        }

        let var_baseline_sum_eol_raw_ef = 0;
        if (
          baseline_eol_raw_material !== null &&
          baseline_eol_raw_material !== undefined
        ) {
          const baselineEolClimateChangeAmount = parseFloat(
            String(
              baseline_eol_raw_material[index_baseline]?.sum_eol_raw_ef
                ?.climate_change_amount_functional_unit
            )
          );
          var_baseline_sum_eol_raw_ef = isNaN(baselineEolClimateChangeAmount)
            ? 0
            : baselineEolClimateChangeAmount;
        }
        const arrObjectData = getArrBaselineDataObject(
          var_baseline_raw_material_ef_total,
          var_baseline_sum_eol_raw_ef,
          convert_multiply,
          baseline_raw_material,
          index_baseline,
          arrRowData
        );
        arrRowData = arrObjectData;
      }
    );
  } else if (type === "productEnvironmental") {
    const myproduct_raw_material = VAR_MYPRODUCT?.rawmaterials?.raw_materials;
    const myproduct_eol_raw_material =
      VAR_MYPRODUCT?.formula_end_of_life?.raw_materials;
    const baseline_raw_material = VAR_BASELINE?.rawmaterials?.raw_materials;
    const baseline_eol_raw_material =
      VAR_BASELINE?.formula_end_of_life?.raw_materials;

    myproduct_raw_material?.forEach(
      (item: RawMaterialsEntity1, index: number) => {
        let var_raw_material_ef_total = 0;
        if (myproduct_raw_material !== undefined) {
          const pefScore = parseFloat(
            String(
              myproduct_raw_material[index]?.raw_material_production_PEF_score_per_functional_unit
            )
          );
          var_raw_material_ef_total = isNaN(pefScore) ? 0 : pefScore;
        }

        let var_sum_eol_raw_ef = 0;
        if (
          myproduct_eol_raw_material !== null &&
          myproduct_eol_raw_material !== undefined
        ) {
          const eolPefScore = parseFloat(
            String(myproduct_eol_raw_material[index]?.eol_raw_mat_PEF_score_functional_unit)
          );
          var_sum_eol_raw_ef = isNaN(eolPefScore) ? 0 : eolPefScore;
        }

        const arrDataObject1 = getArrRowDataObject(
          var_raw_material_ef_total,
          var_sum_eol_raw_ef,
          convert_multiply,
          item
        );
        arrRowData.push(arrDataObject1);
      }
    );

    baseline_raw_material?.forEach(
      (_baseline_item: RawMaterialsEntity1, index_baseline: number) => {
        let var_baseline_raw_material_ef_total = 0;
        if (baseline_raw_material !== undefined) {
          const baselinePefScore = parseFloat(
            String(
              baseline_raw_material[index_baseline]
                ?.raw_material_production_PEF_score_per_functional_unit
            )
          );
          var_baseline_raw_material_ef_total = isNaN(baselinePefScore)
            ? 0
            : baselinePefScore;
        }

        let var_baseline_sum_eol_raw_ef = 0;
        if (
          baseline_eol_raw_material !== null &&
          baseline_eol_raw_material !== undefined
        ) {
          const baselineEolPefScore = parseFloat(
            String(
              baseline_eol_raw_material[index_baseline]?.eol_raw_mat_PEF_score_functional_unit
            )
          );
          var_baseline_sum_eol_raw_ef = isNaN(baselineEolPefScore)
            ? 0
            : baselineEolPefScore;
        }
        const arrObjectData1 = getArrBaselineDataObject(
          var_baseline_raw_material_ef_total,
          var_baseline_sum_eol_raw_ef,
          convert_multiply,
          baseline_raw_material,
          index_baseline,
          arrRowData
        );
        arrRowData = arrObjectData1;
      }
    );
  }

  return arrRowData;
}

const calculateProductEnvValues=(calculatedPercentage:number)=>{
  let newdialsIndicator: string = "";
  let newRangeIndicator: number = 0;
  let newcolors_series1: string = "";
  let newactaulRangeIndicator: string = "";
  if (calculatedPercentage < -20) {
      newRangeIndicator = 100;
      newcolors_series1 = "#00B097";
      newdialsIndicator = "Excellent";
      newactaulRangeIndicator = "% < -20";
    } else if (calculatedPercentage >= -20 && calculatedPercentage < -10) {
      newRangeIndicator = calculateRangeIndicator(
        calculatedPercentage,
        55,
        77.5,
        -11,
        -20
      );
      newcolors_series1 = "#BCD530";
      newdialsIndicator = "Good";
      newactaulRangeIndicator = "-10 > %  ≥ -20";
    } else if (calculatedPercentage >= -10 && calculatedPercentage <= 10) {
      newRangeIndicator = calculateRangeIndicator(
        calculatedPercentage,
        45,
        55,
        -10,
        10
      );
      newcolors_series1 = "#d0d0d0";
      newdialsIndicator = "No Improvement";
      newactaulRangeIndicator = "\n -10 ≤ % ≤ +10";
    } else if (calculatedPercentage > 10 && calculatedPercentage <= 20) {
      newRangeIndicator = calculateRangeIndicator(
        calculatedPercentage,
        22.5,
        45,
        11,
        20
      );
      newcolors_series1 = "#FFB000";
      newdialsIndicator = "Poor";
      newactaulRangeIndicator = "+10 < % ≤ +20";
    } else if (calculatedPercentage > 20) {
      newRangeIndicator = 22.5;
      newcolors_series1 = "#FF6B6B";
      newdialsIndicator = "Very poor";
      newactaulRangeIndicator = "% > +20%";
    }

    return {  
      newdialsIndicator,
      newRangeIndicator,
      newcolors_series1,
      newactaulRangeIndicator
  }
}

const calculateSustainablePackingValues= (calculatedPercentage:number)=>{
  let newdialsIndicator: string = "";
  let newRangeIndicator: number = 0;
  let newcolors_series1: string = "";
  let newactaulRangeIndicator: string = "";
  if( calculatedPercentage > 20 ){
      newRangeIndicator = 100;
      newcolors_series1= "#00B097";
      newdialsIndicator = "Excellent";
      newactaulRangeIndicator = "% > +20";
    }
    else if( calculatedPercentage > 10  && calculatedPercentage <= 20  ){
      newRangeIndicator = calculateRangeIndicator(calculatedPercentage,55,77.5,20,11);
      newcolors_series1= "#BCD530";
      newdialsIndicator = "Good";
      newactaulRangeIndicator = "+10 < Points ≤ +20";
    }
    else if( calculatedPercentage > 0  && calculatedPercentage <= 10  ){
      newRangeIndicator = calculateRangeIndicator(calculatedPercentage,45,55,10,1);
      newcolors_series1= "#d0d0d0";
      newdialsIndicator = "No Improvement";
      newactaulRangeIndicator = "\n 0 < % ≤ +10";
    }
    else if( calculatedPercentage >= -20  && calculatedPercentage <= 0  ){
      newRangeIndicator = calculateRangeIndicator(calculatedPercentage,22.5,45,0,-20);
      newcolors_series1= "#FFB000";
      newdialsIndicator = "Poor";
      newactaulRangeIndicator = "-20 ≤ % ≤ 0";
    }
    else if( calculatedPercentage < -20 ){
      newRangeIndicator = 22.5;
      newcolors_series1= "#FF6B6B";
      newdialsIndicator = "Very poor";
      newactaulRangeIndicator = "% < -20%";
    }
  return {  
      newdialsIndicator,
      newRangeIndicator,
      newcolors_series1,
      newactaulRangeIndicator
  }
}

const calculateGreenChemistryValues=(calculatedPercentage:number)=>{
  let newdialsIndicator: string = "";
  let newRangeIndicator: number = 0;
  let newcolors_series1: string = "";
  let newactaulRangeIndicator: string = "";
  if( calculatedPercentage > 10 ){
      newRangeIndicator = 100;
      newcolors_series1= "#00B097";
      newdialsIndicator = "Excellent";
      newactaulRangeIndicator = "Points > +10";
    }
    else if( calculatedPercentage > 5  && calculatedPercentage <= 10  ){
      newRangeIndicator = calculateRangeIndicator(calculatedPercentage,55,77.5,10,6);
      newcolors_series1= "#BCD530";
      newdialsIndicator = "Good";
      newactaulRangeIndicator = "+5 < Points ≤ +10";
    }
    else if( calculatedPercentage > -5  && calculatedPercentage <= 5  ){
      newRangeIndicator = calculateRangeIndicator(calculatedPercentage,45,55,5,-4);
      newcolors_series1= "#d0d0d0";
      newdialsIndicator = "No Improvement";
      newactaulRangeIndicator = "\n -5 < Points ≤ +5";
    }
    else if( calculatedPercentage >= -10  && calculatedPercentage <= -5  ){
      newRangeIndicator = calculateRangeIndicator(calculatedPercentage,22.5,45,-5,-10);
      newcolors_series1= "#FFB000";
      newdialsIndicator = "Poor";
      newactaulRangeIndicator = "-10 ≤ Points ≤ -5";
    }
    else if( calculatedPercentage < -10 ){
      newRangeIndicator = 22.5;
      newcolors_series1= "#FF6B6B";
      newdialsIndicator = "Very poor";
      newactaulRangeIndicator = "Points < -10";
    }
    return {  
      newdialsIndicator,
      newRangeIndicator,
      newcolors_series1,
      newactaulRangeIndicator
  }
}

export function setPieChartJSONSeries1(
calculatedPercentage: number ,
type: string | undefined
) {
let newdialsIndicator: string = "";
let newRangeIndicator: number = 0;
let newcolors_series1: string = "";
let newactaulRangeIndicator: string = "";

const assignValues=(calculatedValues:{
  newdialsIndicator: string;
  newRangeIndicator: number;
  newcolors_series1: string;
  newactaulRangeIndicator: string;
})=>{
  newdialsIndicator=calculatedValues.newdialsIndicator;
  newRangeIndicator=calculatedValues.newRangeIndicator;
  newcolors_series1=calculatedValues.newcolors_series1;
  newactaulRangeIndicator=calculatedValues.newactaulRangeIndicator;
}

if (type === "productEnvironmental" || type === "carbonFootprint") {
  assignValues(calculateProductEnvValues(calculatedPercentage))
}
else if( type === "sustainablePackaging" ){
  assignValues(calculateSustainablePackingValues(calculatedPercentage))
}
else if( type === "greenChemistry" ){
  assignValues(calculateGreenChemistryValues(calculatedPercentage))
}
const PieChartJSONSeries1Data = [
  {
    dialsIndicator: newdialsIndicator,
    rangeIndicator: newRangeIndicator,
    colors_series1: newcolors_series1,
    actaulRangeIndicator: newactaulRangeIndicator,
  },
  {
    dialsIndicator: "",
    rangeIndicator: 100 - newRangeIndicator,
    colors_series1: "#dbdbdb",
    actaulRangeIndicator: "",
  },
];

return PieChartJSONSeries1Data;
}
function calculateRangeIndicator(
  inputValue: number,
  minDialRange: number,
  maxDialRange: number,
  minFormulaRange: number,
  maxFormulaRange: number
) {
  const varRangeIndicator =
    minDialRange +
    ((inputValue - maxFormulaRange) / (minFormulaRange - maxFormulaRange)) *
      (maxDialRange - minDialRange);
  return varRangeIndicator;
}

export const calculatePercentageChange = (
  myproductValue: number | undefined,
  baselineValue: number | undefined
) => {
  if (baselineValue && myproductValue) {
    return ((myproductValue - baselineValue) / baselineValue) * 100;
  }
  return 0;
};

interface IPieChartJSONSeries11 {
  dialsIndicator: string;
  rangeIndicator: number;
  colors_series1: string;
  actaulRangeIndicator: string;
}

export const extractDialData = (
  myproductDials: MyProductDials,
  baselineDials: MyProductDials,
  type: "productEnvironmental" | "carbonFootprint" | "sustainablePackaging" | "greenChemistry"
) => {
  if (type === "productEnvironmental") {
    const myproductPEF =
      myproductDials?.total_lifecycle_total_pef_excluding_use_phase_functional_unit;
    const baselinePEF =
      baselineDials?.total_lifecycle_total_pef_excluding_use_phase_functional_unit;
    const calculatedPercentage = calculatePercentageChange(
      myproductPEF,
      baselinePEF
    );
    const productEnvironmentalPieChartJSONSeries1: IPieChartJSONSeries11[] =
      setPieChartJSONSeries1(calculatedPercentage, "productEnvironmental");
      
    const withsign_calculatedPercentage = withsignCalculatedPercentage(calculatedPercentage);

    return {
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: calculatedPercentage,
      PieChartJSONSeries1: productEnvironmentalPieChartJSONSeries1,
      pie_chart_sub_title:
        productEnvironmentalPieChartJSONSeries1[0].dialsIndicator,
      pie_chart_percentage: withsign_calculatedPercentage,
    };
  } else if (type === "carbonFootprint") {
    const myproduct =
      myproductDials?.total_lifecycle_pre_normalization_excluding_use_phase
        ?.climate_change_functional_unit;
    const baseline =
      baselineDials?.total_lifecycle_pre_normalization_excluding_use_phase
        ?.climate_change_functional_unit;
    const calculatedPercentage = calculatePercentageChange(myproduct, baseline);
    
    const carbonFootprintPieChartJSONSeries1: IPieChartSeries[] =
      setPieChartJSONSeries1(calculatedPercentage, "carbonFootprint");
      
    const withsign_calculatedPercentage = withsignCalculatedPercentage(calculatedPercentage);

    return {
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: calculatedPercentage,
      PieChartJSONSeries1: carbonFootprintPieChartJSONSeries1,
      pie_chart_sub_title: carbonFootprintPieChartJSONSeries1[0].dialsIndicator,
      pie_chart_percentage: withsign_calculatedPercentage,
    };
  } else if (type === "sustainablePackaging") {
    const calculatedPercentage = myproductDials?.["sustainablepackaging-rollup-compare"]
      ?.Final_Score_Disrupters ?? 0;
    const carbonFootprintPieChartJSONSeries1: IPieChartSeries[] =
      setPieChartJSONSeries1(calculatedPercentage, "sustainablePackaging");
 
    const withsign_calculatedPercentage = withsignCalculatedPercentage(calculatedPercentage);
 
    return {
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: calculatedPercentage ?? 0,
      PieChartJSONSeries1: carbonFootprintPieChartJSONSeries1 ?? [],
      pie_chart_sub_title: carbonFootprintPieChartJSONSeries1[0].dialsIndicator ?? "",
      pie_chart_percentage: withsign_calculatedPercentage ?? "",
    };
  }
  else if (type === "greenChemistry") {
    const myproduct =
    myproductDials?.["green_chemistry_rollup"]
    ?.step_6_final_score_with_5_watchlist ?? 0;
    const baseline =
    myproductDials?.["baseline_green_chemistry_rollup"]?.step_5_final_score ?? 0;
    let calculatedPercentage = parseFloat(((myproduct-baseline)).toFixed(0));
    
    calculatedPercentage = isNaN(calculatedPercentage)
    ? 0
    : calculatedPercentage;

    const greenChemistryPieChartJSONSeries1: IPieChartSeries[] =
      setPieChartJSONSeries1(calculatedPercentage, "greenChemistry");
      
    const withsign_calculatedPercentage = withsignCalculatedPercentage(calculatedPercentage);
    
    return {
      total_lifecycle_total_pef_excluding_use_phase_functional_unit: calculatedPercentage,
      PieChartJSONSeries1: greenChemistryPieChartJSONSeries1,
      pie_chart_sub_title: greenChemistryPieChartJSONSeries1[0].dialsIndicator,
      pie_chart_percentage: withsign_calculatedPercentage,
    };
  }
  return null;
};

// eslint-disable-next-line react-refresh/only-export-components
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// eslint-disable-next-line react-refresh/only-export-components
export const checkAllCondiationForDials =(isbaselineDataComplete: boolean,
  isbaseline: boolean,
  // isFormulation: boolean,
  // isConsumerPackaging: boolean,
  isFormulationCalculated: boolean,
  isPackagingCalculated: boolean
) => {
  return !!((isbaseline  && isFormulationCalculated  && isPackagingCalculated && isbaselineDataComplete));
};

export const errorMsgDialsWithoutPartialData = (
 isBaselineDataComplete?: string,
 isBaseline?: string,
 isFormulation?: string,
 isConsumerPackaging?: string,
 isFormulationCalculated?: string,
 isPackagingCalculated?: string
): string => {
 if (isBaseline === "no") return "Add your baseline product to view results";
 if (isBaseline === "yes" && isBaselineDataComplete === "no")
   return "Baseline assessment is incomplete. Please enter missing data to see results.";
 if (isBaseline === "yes" && isBaselineDataComplete === "yes") {
   if (isFormulation === "no" || isConsumerPackaging === "no")
     return "Enter both your formulation and packaging data to view results";
   if (
     isFormulation === "yes" && isConsumerPackaging === "yes" &&
     (isFormulationCalculated === "no" || isPackagingCalculated === "no")
   )
     return "Something went wrong! Please retrigger the calculation to view results";
 }
 if (isBaseline === "no" && (isFormulation === "no" || isConsumerPackaging === "no"))
   return "Add your baseline product and both your formulation and packaging data to view results";
 return "no";
};


export function getAvatarLetters(fullname: string): string {
  if(fullname){
    const [firstname, lastname] = fullname.split(/\s+(.*)/);
    const firstnamechar = firstname ? firstname?.charAt(0) : "";
    const lastnamechar = lastname ? lastname?.charAt(0) : "";
    return (firstnamechar+lastnamechar)
  }else{
    return "";
  }

}

export function getRawMaterialDataGCDetailedResult(
  VAR_MYPRODUCT: IRenewableFeedbackStock,
  VAR_BASELINE: IRenewableFeedbackStock,
  type: "greenChemistry"
) {

  let arrRowData: IGreenChemFormulationData[] = [];

  if (type === "greenChemistry") {
    const myproduct_raw_material = VAR_MYPRODUCT?.raw_materials;
    const baseline_raw_material = VAR_BASELINE?.raw_materials;
    
    
    myproduct_raw_material?.forEach(
      (item: IGCMyBaselineProduct) => { 
        const arrDataObject = getGCArrRowDataObject(item);
        arrRowData.push(arrDataObject);
      }
    );

    baseline_raw_material?.forEach(
      (_baseline_item: IGCMyBaselineProduct, index_baseline: number) => {
        const arrObjectData = getGCArrBaselineDataObject(
          baseline_raw_material,
          index_baseline,
          arrRowData
        );
        arrRowData = arrObjectData;
      }
    );

  }   
  return arrRowData;
}

const getGCArrRowDataObject = (
  item: IGCMyBaselineProduct
) => {
  const result = {
    rawMaterialTradeName: item.raw_material_name,
    rawCode: item.raw_material_id,
    baselineWeight: "",
    baselineOrganic: "",
    baselineRenewable: "",
    myProductWeight: `${item.raw_material_value}`,
    myProductOrganic: `${item.sum_of_organic_chemical_percents_per_raw}`,
    myProductRenewable: `${item.bio_based_orgin_raw_percents}`
  };

  return result;
};

const getGCArrBaselineDataObject = (
  baseline_raw_material: IGCMyBaselineProduct[],
  index_baseline: number,
  arrRowData: IGreenChemFormulationData[]
) => {
  const arrBaselineRowData = arrRowData;

  const existingIndex = arrBaselineRowData.findIndex(
    (el) =>
      el.rawCode === baseline_raw_material[index_baseline]?.raw_material_id
  );

  if (existingIndex < 0) {
    arrBaselineRowData.push({
      rawMaterialTradeName: baseline_raw_material[index_baseline]?.raw_material_name,
      rawCode: baseline_raw_material[index_baseline]?.raw_material_id,
      baselineWeight: `${baseline_raw_material[index_baseline]?.raw_material_value}`,
      baselineOrganic: `${baseline_raw_material[index_baseline]?.sum_of_organic_chemical_percents_per_raw}`,
      baselineRenewable: `${baseline_raw_material[index_baseline]?.bio_based_orgin_raw_percents}`,
      myProductWeight: "",
      myProductOrganic: "",
      myProductRenewable: ""
    });
  } else {
    arrBaselineRowData[existingIndex].baselineWeight = `${baseline_raw_material[index_baseline]?.raw_material_value}`;
    arrBaselineRowData[existingIndex].baselineOrganic = `${baseline_raw_material[index_baseline]?.sum_of_organic_chemical_percents_per_raw}`;
    arrBaselineRowData[existingIndex].baselineRenewable = `${baseline_raw_material[index_baseline]?.bio_based_orgin_raw_percents}`
  }
  return arrBaselineRowData;
};


const useTruncateValue = () => {
  const [truncateValue, setTruncateValue] = React.useState(50); // Default truncate value

  const updateTruncateValue = () => {
    const width = window.innerWidth;
    if (width >= 880 && width <= 1150) {
      setTruncateValue(20);
    } else if (width >= 1151 && width <= 1439) {
      setTruncateValue(40);
    } else if (width >= 1440) {
      setTruncateValue(50);
    } else {
      setTruncateValue(50); // Set a default for less than 880
    }
  };

  React.useEffect(() => {
    updateTruncateValue();
    window.addEventListener('resize', updateTruncateValue);

    return () => {
      window.removeEventListener('resize', updateTruncateValue);
    };
  }, []);

  return truncateValue;
};

export default useTruncateValue;

export const getCappedValue = (value: number, min: number, max: number) => {

  if (value == undefined) return 0; // If value is less than or equal to min, bar is empty
  if (value <= min) return 0; // If value is less than or equal to min, bar is empty
  if (value >= max) return 100; // If value is greater than or equal to max, bar is full

  // Calculate percentage based on the range [min, max]
  return ((value - min) / (max - min)) * 100;
};