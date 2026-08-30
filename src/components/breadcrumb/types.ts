/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, ReactNode } from "react";
import {
  RawMaterialsData,
  FormulationDataType,
} from "../../structures/formulation";
import { SelectChangeEvent } from "@mui/material";
import {
  Assessment,
  Component,
  PackagingComponentData,
  PackagingDataType,
} from "../../structures/packaging";
import { CURRENT_TAB } from "../../constants/String.constants";
import {
  FootprintStructure,
  IBarGraphObject,
  IDials,
  IproductEnvironmentalFootprint,
} from "../../structures/result";
export interface IBreadcrumbData {
  productID: string;
  productName: string;
  experimentalID: string;
  experimentalName: string;
}

export interface IBreadcrumbProps extends IBreadcrumbData {
  path: string;
}
export interface EditProductAssessment {
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
}
export interface EditAssessmentTitleProps {
  assessmentType?: string;
}
export interface RowUsers {
  id: string;
  name: string;
  role: string;
  mail: string;
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
  isDeleted?: boolean;
  updatedAt?: string;
  createdAt?: string;
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
  isLPP?: boolean;

  type?: string;
  assessments?: {
    baseline?: Assessment;
    experimental?: Assessment[];
    final?: Assessment;
  };
}

export interface SideBarProps {
  mfProps?: MfProps;
  onSignOutClick: () => void;
  getRoutePathName?: React.Dispatch<React.SetStateAction<string>>
}

export interface RootProps {
  sipUiMfScreen?: MfProps;
}
export interface UserData {
  "@odata.context": string;
  accessToken: string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string | null;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  roles: string[];
  surname: string;
  userName: string;
  userPrincipalName: string;
  // This allows additional properties not explicitly listed
}

export interface MfProps {
  publish: (topic: string) => void;
  subscribe: (
    topic: string,
    callback: (topic: string, data: UserData) => void
  ) => void;
}
export interface PropsType {
  props: ExperimentalDataItem[];
  pageRouter: string;
  sort_order: string;
  loggedInUserEmail?: string;
  refetch: () => void;
}
export interface ExperimentalAsseTabsComponentProps {
  ExperimentalData: ExperimentalDataItem[]; // Adjust the type based on actual data structure
  varproductData: {
    productID: string;
    productName: string;
    productSipId: string;
  };
  refetch: () => void;
  varUserCRUDAccess?: number;
}
export interface FormulaCodeDetail {
  SKU_ERP_Code: string;
  description: string;
  fgSpec: string;
  fmlCode: string;
  labCode: string;
  netContent: string;
  netContentUnit: string;
  productSegment: string;
  productSubSegment: string;
  productionZone: string;
  rawMaterials: RawMaterialsData[];
  salesZone: string;
  useDose: string;
  useScenario?: string;
}
export interface FormulaCode {
  frml_cd_vers_concat: string;
}
export interface ComponentData {
  CHILD_NM: string;
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
  users: Array<[]>;
}

export interface AddTeamMember {
  productId?: string;
  userCRUDAccess?: number;
  users?: Array<Users>;
}

export interface Users {
  name?: string;
  role?: string;
  mail?: string;
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

export interface EditProduct {
  projectId: string;
  brandName: string;
  productName: string;
  description: string;
  projectName: string;
  shortBrandCode: string;
}
export interface AddProduct {
  projectId: string;
  brandName: string;
  productName: string;
  description: string;
  projectName: string;
  users: [
    {
      name: string;
      role: string;
      mail: string;
    }
  ];
  shortBrandCode: string;
}
export interface Brand {
  brandName: string;
  shortBrandCode: string;
  longBrandName: string;
}
export interface TabInfoDisplayProps {
  comingSoon: boolean;
  value: number;
  index: number;
}
export interface BootstrapTooltipComponentProps {
  title: string;
  subtitle: string;
}
export interface SelectFieldProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
  disabled?: boolean;
  truncateby?: number;
  breakBySpaceOrHyphen?: boolean;  
  showSearchBar?:boolean
}
export interface DialsResultProductAssessmentProps {
  readonly page: string;
  readonly dials_without_data_show: string;
  readonly dials_without_data_show_msg?: string;
  readonly selectedtab?: number;
}
export interface FormFieldProps {
  mode: string;
  validateDropdownvalues: boolean;
  label: string;
  required?: boolean;
  tooltipContent: string;
  direction: string;
  value: string;
  onChange: (
    e: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>
  ) => void;
  options?: string[] | null;
  disabled: boolean;
  name?: string;
  index?: number;
  isEdited: boolean;
  isComId?: boolean;
  isImportData: boolean;
}
export interface DeleteAssessment {
  productSipId: string;
  assessmentId: string;
  type?: string;
  productID?: string;
}
export interface LightTooltipProps {
  tooltipkey: string;
  title: string;
  subTitle: string;
  contents: string;
}
export interface CardExperimental {
  assessmentId: string;
}

export interface ExperimentalDelete {
  productID: string;
  productSipId: string;
  assessmentId: string;
  type: string;
}
export interface DataSeries0Item {
  dialsIndicator: string;
  rangeIndicator: number;
  colors: string;
  actaulRangeIndicator: string;
}

export interface DataSeries1Item {
  dialsIndicator: string;
  rangeIndicator: number;
  colors_series1: string;
  actaulRangeIndicator: string;
}
export interface PieChartDialsProps {
  pie_chart_percentage: number | string;
  chartDivIndex: string;
  title: string;
  sub_title: string;
  data_series0?: DataSeries0Item[];
  data_series1?: DataSeries1Item[];
  flipcard_description: React.FC;
  selectedpiechart?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  style?: object;
  versionResult?: boolean;
  tabs?: any;
}

// Initial values
export interface AssessmentDataType {
  assessmentId: string;
  name: string;
  _id: string;
  isFormulationDataCompleted?: boolean;
  isPackagingDataCompleted?: boolean;
  isFormulationCalculated?: boolean;
  isPackagingCalculated?: boolean;
  fg_spec?: string;
  formula_number?: string;
  lab_notebook_code?: string;
  pc_spec?: string;
  sku_erp_code?: string;
  zone?: string;
  net_content?: string;
  createdBy?: string;
  modifiedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  packaging_level?: PackagingDataType;
  formulation?: FormulationDataType | null;
}

export interface ProductDataProps {
  brandName: string;
  productId: string;
  productName: string;
  productSipId: string;
  user?: Array<UserDataType>;
  details?: AssessmentDataType;
}
export interface ProductDataType {
  productId: string;
  productName: string;
  brandName: string;
  productSipId: string;
}
export interface UserDataType {
  name: string;
  role?: string;
  mail?: string;
}

export interface PackagingTypeData {
  component: PackagingComponentData[];
  isRecyclable: string;
  productEvaluation: number;
}
export interface Packaging {
  primary?: PackagingTypeData;
  secondary?: PackagingTypeData;
  component: PackagingComponentData[];
  isRecyclable: string;
  productEvaluation: number;
}

export interface ProductProviderProps {
  children: ReactNode;
  productId: string;
  assessmentId: string;
  assessmentType: string;
}

export interface AccordionHeaderProps {
  expanded: boolean;
  isSaved: boolean;
  componentheader: string;
  isSaveEnabled: string;
  handleClickCancelButton: () => void;
  handleClickSaveButton: () => void;
  handleExpandClick: (index: number, isEditClick: boolean) => void;
  handleMoreHorizClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuClose: () => void;
  anchorEl: HTMLElement | null;
  handleEditPackagingComponent: (event: React.MouseEvent<HTMLElement>) => void;
  handleOpenDeletePopup: (event: React.MouseEvent<HTMLElement>) => void;
  isViewMode: boolean;
  componentId: number;
  isData: boolean;
}
export interface AccordionSummaryContentProps {
  expanded: boolean;
  imageSrc: string;
  imageClassName: string;
  componentType: string | null;
  description: string | null;
  isSaved: boolean;
}
export interface ImportComponentProps {
  handleOpenImportComponentPopup: () => void;
  type: "Primary" | "Secondary";
  isSaved: boolean;
  index: number;
  componentData: PackagingComponentData;
  mode: "add" | "edit" | "view";
  isImportData: boolean;
}
export interface ResultSection1Prop {
  sectionName: string;
  title: string;
  percent: ITabInfoFootPrint | null;
  indexSection1: string;
  handleSectionChange: (sectionName: string) => void;
  currentTab: string;
}

export interface ResultSection2Prop {
  currentSection: string;
  vcurrentSection?: string;
}

export interface ProductComponentProp {
  is_search: string;
  selectedValu?: string;
}
export interface RowDataInfo {
  assessmentId: string;
}
export interface InfoRowUser {
  name?: string;
}

export interface ProductData {
  productID: string;
  productName: string;
  productSipId: string;
}

export interface GridViewComponentExperimentalProps {
  props: ExperimentalDataItem[];
  varProductData: ProductData;
  varUserCRUDAccess: number;
  sort_order: string;
  refetch: () => void;
  containsLPP?: boolean;
}

export interface IPieChartJSONSeries1 {
  dialsIndicator: string;
  rangeIndicator: number;
  colors_series1: string;
  actaulRangeIndicator: string;
}

//TabInfoDisplay

type TabType =
  | CURRENT_TAB.CARBON_FOOTPRINT
  | CURRENT_TAB.GREEN_CHEMISTRY
  | CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT
  | CURRENT_TAB.SUSTAINABLE_PACKAGING
  | CURRENT_TAB.TOP_LINE_RESULTS;

export interface ITabInfo {
  title: string;
  id: TabType;
  comingSoon: boolean;
  tabsData: {
    totalProduct: { percentage: number; myproduct: number; baseline: number };
    formulation: { percentage: number; myproduct: number; baseline: number };
    packaging: { percentage: number; myproduct: number; baseline: number };
  };
}

export interface ITabInfoDisplayComponent {
  key: string;
  comingSoon: boolean;
  value: number;
  index: number;
  currentTab: string;
  data: FootprintStructure | ISustainableStructure | null;
  tabsData: IFootprintTabStructure | ISustainableTabStructure | null;
}
export interface ISustainableTabStructure {
  totalScore: { heading: string; percentage: number };
  pcrContent: ITabInfoSustainable;
  materialEfficiency: ITabInfoSustainable;
  recycleReady: ITabInfoSustainable;
  disruptors: ITabInfoSustainable;
  totalProduct?: ITabInfoFootPrint;
  formulation?: ITabInfoFootPrint;
  packaging?: ITabInfoFootPrint;
}
export interface ISustainableStructure {
  pcrContent: { dialData: object; pcrTableData: object };
  materialEfficiency: { barData: object; detailedData: object };
  recycleReady: { barData: object; detailedData: object };
  disruptors: { baselineProduct: object; myproduct: object };
  tabs: ISustainableTabStructure;
  totalProduct?: Record<string, IBarGraphObject[]>;
  formulation?: IproductEnvironmentalFootprint[] | [];
  packaging?: Record<string, Component[]>;
  dials?: IDials | null;
}

export interface ITabInfoSustainable {
  heading: string;
  percentage: string;
  myproduct?: string;
  baseline?: string;
}
export interface IFootprintTabStructure {
  totalProduct: ITabInfoFootPrint;
  formulation: ITabInfoFootPrint;
  packaging: ITabInfoFootPrint;
}

export interface ITabInfoFootPrint {
  heading?: string;
  percentage: number;
  myproduct: number;
  baseline: number;
}
export interface ToastProps {
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export interface ToastWarning {
 
  handleExit: () => void;
  handleReview: () => void;
}
