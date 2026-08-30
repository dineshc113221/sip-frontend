export interface RowUsers {
    name: string;
    role: string;
    mail: string
  }

  export interface RowData {
    assessmentId: string;
    type: string;
  } 
export interface ExperimentalDataItem {
    _id: string;
    name: string;
    zone: string;
    net_content: string;
    assessmentId: string;
    fg_spec: string;
    formula_number: string;
    lab_notebook_code: string;
    pc_spec: string;
    isPackagingDataCompleted: boolean;  
    isFormulationDataCompleted: boolean;
    isDeleted?: boolean;
    updatedAt: string | undefined;
    createdAt: string | undefined;
    users?: Array<RowUsers>;
    description?: string;
    projectId?: string;
    projectName?: string;
    productSipId?: string;
    productName?: string;
    brandName?: string;
    sku_erp_code?: string;
    isCalculating?: boolean;
    isEdited?: boolean;
    createdBy?: string;
    type?:string;
    assessments?: {
      baseline?: Assessment;
      experimental?: Assessment[];
      final?: Assessment;
    };
  }
  
  
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
  export interface FetchResponse extends Response {
    json(): Promise<GetProductCodeDetail>;
  }
  // Define the interface for the product data
  export interface FindProduct {
    fg_nm_vers_concat: string;
  }
  
  // Define the interface for the fetch response
  export interface FetchFindResponse extends Response {
    json(): Promise<FindProduct[]>;
  }
  export interface PartOption {
    text: string;
    highlight: boolean;
    id?: string;
    part?: string;
    value?: string;
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
  export interface ObjectValue {
    name: string;
    role: string;
    mail: string;
  }
  // Interface for UserMemberDetails data in getAddMemberUserlist response
  export interface UserMemberDetails {
    _id: string;
    productSipId: string;
    productName: string;
    brandName: string;
    projectId: string;
  }
  

  
  // Interface for AddMemberUserlist response
  export interface AddMemberUserlistResponse {
    users: UserMemberDetails[];
  }
  export interface UserAssessmentDetails {
    _id: string;
    name: string;
    email: string;
    role: string;
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
    isBaselineSkipped:boolean;
    justification:string;
    isFormulationDataCompleted: boolean;
  isPackagingDataCompleted: boolean;
  isCalculatedButtonClicked: boolean;
  isFormulationCalculated: boolean;
  isFormulationEOLCalculated: boolean;
  isGreenChemistryCalculated: boolean;
  isGreenChemistryRollupCalculated: boolean;
  isLCACalculated: boolean;
  isPackagingCalculated: boolean;
  isSpiceCalculated: boolean;
  isSustainabilityPackagingCalculated: boolean;
  isSustainabilityPackagingRollupCalculated: boolean;
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
    users: RowUsers[];
    projectId: string;
    projectName: string;
    shortBrandCode: string;
    updatedAt: string;
    _id: string;
    __v? : number;
  }
  
  export interface AllProductDetails {
    product : ExperimentalDataItem[];
    refetch: () => void;
    selectedValue?: string
  }
  
  export interface ProductAssessmentProps {
    productDetail: Array<ProductDetail>;
    refetch: () => void;
    userCRUDAccess?: number;
  }
    