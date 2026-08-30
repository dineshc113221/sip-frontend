import { SelectChangeEvent } from "@mui/material/Select";
import { ExperimentalDataItem } from "../components/breadcrumb/types";

export interface GetProductCodeDetail {
  BRAND_CODE: string;
  FG_NM: string;
  FG_Revision: string;
  FG_SPEC: string;
  FRML_CODE: string;
  FRML_LAB_CODE: string;
  NAME: string;
  PC_NM: string;
  PRODUCT_SEGMENT: string;
  PRODUCT_SUB_SEGMENT: string;
  SALES_ZONE: string;
  SKU_ERP_CODE: string;
}
export interface FindProduct {
  fg_nm_vers_concat: string;
}
export interface Product {
  id: string;
  type: string;
  projectId: string;
  date: string;
  brandName: string;
  productName: string;
  description: string;
  finalAssessment: Record<string, unknown>;
  baselineAssessment: Record<string, unknown>;
  experimentalAssessment: Record<string, unknown>;
  users: Array<User>;
}
export interface User {
  name?: string;
  role?: string;
  mail?: string;
}
export interface RowUsers {
  name: string;
  role: string;
  mail: string
}
export interface AddTeamMember {
  productId?: string;
  userCRUDAccess?: number;
  users?: Array<User>;
}
export interface CardAssessment {
  assessmentId: string;
  type: string;
}
export interface AssessmentDelete {
  productID: string;
  productSipId: string;
  assessmentId: string;
  type: string;
}
export interface RoleValue {
  target: {
    value: string; // Assuming role value is a string (e.g., 'Admin', 'Member')
  };
}

export interface EmailValue {
  email: string; // Assuming the email value is a string
}

export interface UpdateMemberResponse {
  status: number;
  data: string; // Based on the data you're logging from `res`
  headers: object; // Adjust this according to the actual shape of headers if needed
}
export interface UserRoleDetails {
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}
export interface AllProductDetails {
  product: ExperimentalDataItem[];
  refetch: () => void;
  selectedValue?: string
}

export interface ProductAssessmentProps {
  productDetail: Array<ProductDetail>;
  refetch: () => void;
  userCRUDAccess?: number;
}
export interface ProductDetail {
  brandName: string;
  createdAt: string;
  description: string;
  isDeleted: boolean;
  productName: string;
  productSipId: string;
  assessments: {
    baseline: Assessment;
    experimental: Assessment[];
    final: Assessment;
  };
  users: User[];
  projectId: string;
  projectName: string;
  shortBrandCode: string;
  updatedAt: string;
  _id: string;
  __v?: number;
}
export interface ObjectValue {
  name: string;
  role: string;
  mail: string;
}
// Define the interface for the fetch response
export interface FetchFindResponse extends Response {
  json(): Promise<string[]>;
}
export interface FetchResponse extends Response {
  json(): Promise<GetProductCodeDetail>;
}
export interface IproductCodeDetailData {
  FG_SPEC: string;
  SKU_ERP_CODE: string;
  PC_NM: string;
  NAME: string;
  FRML_CODE: string;
  SALES_ZONE: string;
  FRML_LAB_CODE: string;
  BRAND_CODE: string;
  PRODUCT_SEGMENT: string;
  PRODUCT_SUB_SEGMENT: string;
}
export interface AddAssessment {
  productId: string;
  productSipId: string;
  fg_spec: string;
  formula_number: string;
  lab_notebook_code: string;
  pc_spec: string;
  sku_erp_code: string;
  zone: string;
  net_content: string;
  createdBy: string;
  modifiedBy: string;
  type: string;
  name: string;
}

export interface SkipAssessment extends AddAssessment {
isBaselineSkipped: boolean;
justification:string;
}

export interface MemberList {
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}

export interface EditSkipAssessment  {
  productSipId: string;
  assessmentId: string;
  fg_spec?: string;
  formula_number?: string;
  lab_notebook_code?: string;
  pc_spec?: string;
  sku_erp_code?: string;
  zone?: string;
  net_content?: string;
  type?: string;
  name?: string;
  isLPP?: boolean;
  isBaselineSkipped: boolean;
  justification: string;
}

export interface DeletePopupProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  dialogTitle?: string;
  dialogContent?: string;
}
export interface Recyclability {
  open: boolean;
  componentType: string;
  onClose: () => void;
  assessmentId: string;
  sendToParentComponent: (data: string) => void;
  popupPage: string;
  recordStatus: string;
  handleChange: (e: SelectChangeEvent<string>) => void;
  index: number;
  status?: string;
}
export interface ImportComponentData {
  pc_nm: string;
  description: string;
  component_type: string;
  recyclability_status?: string;
  weight: string;
  weight_unit?: string;
  opacifier: string;
  stage: string;
  state: string;
  template: string;
  isEdited: boolean;
  sub_components: SubComponent[];
  fieldsExist?: FieldsExistType;
  _id?: string;
  SalesCountry?: string;
  ProductionCountry?: string;
  SalesCountryCode?: string;
  ProductionCountryCode?: string;
  isCalculated: boolean;

}
export interface IRawMaterial {
  raw_material_id: string;
  raw_material_production_PEF_score_per_functional_unit: number;
  raw_material_ef_total?: {
    climate_change_amount?: number;
    climate_change_amount_functional_unit?: number;
  };
}
export interface IEolRawMaterial {
  raw_material_id: string;
  eol_raw_mat_PEF_score_functional_unit: number;
  sum_eol_raw_ef?: {
    climate_change_amount?: number;
    climate_change_amount_functional_unit?: number;
  };
}
export interface Formulation {
  isEdited: boolean;
  isCalculating: boolean;
  _id: string;
  rawMaterials: Array<unknown>;  // Adjust according to actual data type
}
export interface Assessment {
  assessmentId: string;
  createdAt: string;
  createdBy: string;
  fg_spec: string;
  formula_number: string;
  formulation: Formulation;
  isFormulaCompleted: boolean;
  isPackagingCompleted: boolean;
  isFormulationDataCompleted: boolean;
  isPackagingDataCompleted: boolean;
  lab_notebook_code: string;
  modifiedBy: string;
  name: string;
  net_content: string;
  packaging_level: Array<unknown>;  // Adjust according to actual data type
  pc_spec: string;
  sku_erp_code: string;
  updatedAt: string;
  zone: string;
  _id: string;
}
export interface CompositionEntity {
  id: number;
  materialName: string;
  materialNameCD?: string;
  materialType: string;
  convertingProcess: string;
  conversionProcessCD?: string;
  finishingProcess?: string;
  material_pct: string;
  productEnvironmentalFootPrint?: string;
  carbonFootPrint?: string;
  virginPlasticValue?: string;
}

export interface ParentComponentData {
  vpc_spec: string;
  vcomponent_description: string;
  composition: MaterialEntity[];
}
export interface ImportMaterialEntity {
  id?: number;
  materialName: string;
  materialNameCD?: string;
  materialType: string;
  convertingProcess: string;
  conversionProcessCD?: string;
  finishingProcess?: string;
  material_pct: string;
  productEnvironmentalFootPrint?: string;
  carbonFootPrint?: string;
  virginPlasticValue?: string;
}

export interface PackagingUpdateData {
  pc_nm: string;
  description: string;
  color: string;
  recyclabilityStatus: string;
  opacity: string;
  componentType: string;
  weight: string;
  opacifier: string;
  Materials: MaterialEntity[];
}

export interface PackagingSectionProps {
  title: 'Primary' | 'Secondary';
  counter: number;
  components?: PackagingComponentData[];
  onAddComponent: () => void;
}

export interface PackagingDataType {
  packaging_level: PackagingLevelData[];
}

export interface PackagingLevelData {
  packaging_level: string;
  isrecyclable: boolean;
  recyclability_status: string;
  productEvaluation?: number;
  isManualEdit?: boolean; 
  components: PackagingComponentData[];
  _id?: string;
}
export interface PartOption {
  text: string;
  highlight: boolean;
  id?: string;
  part?: string;
  value?: string;
}
export interface PackagingComponentData {
  pc_nm: string;
  description: string;
  component_type: string;
  weight: string;
  opacifier: string;
  stage: string;
  state: string;
  template: string;
  isEdited: boolean;
  sub_components: SubComponent[];
  recyclability_status?: string;
  isDataComplete?: boolean;   
  weight_unit?:string;  
  recyclability_disruptors_list_formatted_4_5?: string;    
  fieldsExist?: FieldsExistType;
  _id?: string;
  totalpef?: number;
  totalpcf?: number;
  isCalculated: boolean;
}
export interface MaterialEntity {
  material_name: string;
  material_type: string;
  material_pct: string;
  converting_process: string;
  pcr_content?: string;
  fieldsExist?: MaterialFieldsExistType;
  productEnvironmentalFootPrint?: string;
  carbonFootPrint?: string;
  virginPlasticValue?: string;
  _id?: number;
  layer?: string;
}
export interface SubComponent {
    _id: number|string;
    name: string;
    opacity: string;
    color: string;
    finishing_process: string;
  recyclability_disruptors_list_formatted_4_5?: string;
    material: MaterialEntity[];
}
export interface PackagingUpdateData {
  pc_nm: string;
  description: string;
  color: string;
  recyclabilityStatus: string;
  opacity: string;
  componentType: string;
  weight: string;
  opacifier: string;
  Materials: MaterialEntity[];

}
export interface ConsumerPackagingListViewProps {
  componentId: number;
  packagingtype: 'Primary' | 'Secondary';
  title: string;
  componentData: PackagingComponentData;
  onClose?: () => void;
  productEvaluation?: string;
  isNewComponent: boolean;
  expanded: boolean;
  onExpand: (index: number, isEditClick: boolean) => void;
  isOneTimeSaveDone?: boolean;
}
// Props interface for PackagingTable component
export interface PackagingTableProps {
  updateSaveButtonState?: (isEnabled: boolean) => void;
  isSaved: boolean;
  subComponent: SubComponent[];
  setRowsChangedFlag?: (changed: boolean) => void; // Function to set the rows changed flag
  errors: Map<number, string | null>; // Add this line
  setErrors: React.Dispatch<React.SetStateAction<Map<number, string | null>>>;
  componentId:number;
  packagingtype:  'Primary' | 'Secondary';
  isAdd:boolean;
  isEdited:boolean;
  isImportData:boolean;
  fieldsExistData?: FieldsExistType[];
  componentDataSend?: PackagingComponentData;
}

export type ComponentDetail = {
  sub_component_name: string;  
  materialName?: string;
  materialType: string;
  layer: string;
  convertingProcess: string;
  finishingProcess: string;
  baselineWeight: string | undefined;
  baselineMaterialWeight: string | undefined;
  baselineEnvironmentalFootprint: number;
  myProductWeight?: string;
  myProductMaterialWeight: string | undefined;
  myProductEnvironmentalFootprint: number;
  baselineMaterialWeightDose: string | undefined;
  myProductMaterialWeightDose: string | undefined;
  baselineMaterialPCRContent: string | undefined;
  myProductMaterialPCRContent: string | undefined;
};

export type GaiaComponentDetail = {
  rawMaterialTradeName?: string;
  rawCode?: string;
  constituent?: string;
  concode?: string;
  baseLineWeight?: number;
  baseLineGaia?: number;
  myProdWeight?: number;
  myProdGaia?: number;
};

export type Component = {
  componentName: string;
  componentWeight: string;
  baseLineComponentWeight?: number;
  myProductComponentWeight?: number;
  baselineComponentWeightDose?: number;
  myProductComponentWeightDose?: number;
  baselineComponentPCRContent?: number;
  myProductComponentPCRContent?: number;
  baselineComponentFootprint?: number;
  myProductComponentFootprint?: number;
  details: ComponentDetail[];
  rawMaterialTradeName?: string;
  rawCode?: string;
  constituent?: string;
  concode?: string;
  baseLineWeight?: number;
  baseLineGaia?: number;
  myProdWeight?: number;
  myProdGaia?: number;
};
export interface RawMaterial {
  material_name: string;
  layer: string;
  material_type: string;
  converting_process: string;
  material_pct: string | number;
  pcr_content: string | number;
  material_weight: string | number;
  material_efficiency?: string | number;
  productEnvironmentalFootPrint?: string | number;
  carbonFootPrint?: string | number;
  PCR_Material_Percent_Component?: string | number;
}

export interface RawSubComponent {
  name: string;
  material_efficiency?: string | number;
  PCR_Percent_Per_Component?: string | number;
  material: RawMaterial[];
}

export interface Components {
  isEdited?: string | boolean;
  recyclability_status?: string;
  pc_nm?: string;
  description?: string;
  color?: string;
  opacity?: string;
  component_type?: string;
  weight?: string | number;
  opacifier?: string;
  stage?: string;
  state?: string;
  template?: string;
  finishing_process?: string;
  material_efficiency?: string | number;
  PCR_Percent_Per_Component?: string | number;
  sub_components?: RawSubComponent[];
}

// Below are ResultDataContext Related Interfaces
export interface IComponentMaterialObject {
  "sub_component_name": string; 
  "layer": string;
  "material_name": string
  "material_type": string
  "converting_process": string
  "material_pct": string
  "pcr_content": string
  "material_weight": string
  "material_efficiency": string
  "productEnvironmentalFootPrint": string
  "carbonFootPrint": string
  "PCR_Material_Percent_Component": string

}
export interface IComponentLevelObject {
  "isEdited": string,
  "recyclability_status": string,
  "pc_nm": string,
  "description": string,
  "color": string,
  "opacity": string,
  "component_type": string,
  "weight": string,
  "opacifier": string
  "stage": string,
  "state": string,
  "template": string,
  "finishing_process": string,
  "material_efficiency": string,
  "material": IComponentMaterialObject[],
  "PCR_Percent_Per_Component": string,
}

export interface IPackagingLevelObject {
  "packaging_level": string,
  "recyclability_status": string,
  "isrecyclable": boolean,
  "components": IComponentLevelObject[]
}

// Above are ResultDataContext Related Interfaces
export interface FieldsExistType {
  pc_nm: boolean;
  description: boolean;
  weight: boolean;
  recyclability_status: boolean;
  component_type: boolean;
  opacifier: boolean;
  template: boolean;
  stage: boolean;
  state: boolean;
  sub_components: SubComponentFieldsExistType[];
}
export interface SubComponentFieldsExistType{
  name: boolean,
  opacity: boolean,
  color: boolean,
  finishing_process: boolean,
  material: MaterialFieldsExistType[];
}
export interface MaterialFieldsExistType {
    material_name: boolean;
    material_type: boolean;
  converting_process: boolean;
  layer: boolean;
    pcr_content: boolean;
    material_pct: boolean; 
}