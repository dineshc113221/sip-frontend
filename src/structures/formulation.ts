export interface RawMaterialsData {
  tradeName: string;
  rawMaterialId: string;
  percentage: string;
  material_PCT?: string;
  status?: string;
  rmcStatus?: string;
  EUINCIName?: string;
  USINCIName?: string;
  specNumber?: string;
  cas?: string;
  envFootprint?: number;
  carbonFootprint?: number;
  greenChemistry?: number;
  gaiaScore?: string;
  leaf_icon_boolean?: string;
  watchlist_icon_boolean?: string;
}

export interface IformulaCodeDetailData {
  fgSpec: string;
  SKU_ERP_Code: string;
  fmlCode: string;
  description: string;
  labCode: string;
  netContent: string;
  netContentUnit: string;
  productionZone: string;
  salesZone: string;
  productSegment: string;
  productSubSegment: string;
  useDose: string;
  useDoseUnit?: string;
  consumablesUsed?: string;
  brandName?: string | null;
  rawMaterials: RawMaterialsData[];
  formula_status?: string;
  fieldsExist: ErrorsType;
  useScenario: string;
  isCalculated?: boolean;
}

export interface FormulationRowData {
  materialName?: string;
  pcrpirvirgin?: string;
  convetingprocess?: string;
  finishingprocess?: string;
  weight?: string;
  ProductEnviromentalFootprint?: Array<number>;
  carbonFootprint?: Array<number>;
  gofVirginPlastic?: Array<number>;
}

export interface FormulaData {
  vformula_code: string;
  vformula_description: string;
  vformula_grams: string;
  vformula_net: string;
  raw_materials: RawMaterialsData[];
}

export interface FormulationDataType {
  fmlCode: string;
  description: string;
  netContent: string;
  netContentUnit: string;
  productionZone: string;
  salesZone: string;
  productSegment: string;
  productSubSegment: string;
  useDose: string;
  useDoseUnit: string;
  consumablesUsed: string;
  rawMaterials: RawMaterialsData[];
  isEdited?: boolean;
  isDataValid?:boolean,
  isCalculated: boolean;
  fieldsExist: ErrorsType;
  useScenario:string;
}

export interface ErrorsType {
  description: boolean;
  netContent: boolean;
  netContentUnit: boolean;
  productionZone: boolean;
  salesZone: boolean;
  productSegment: boolean;
  productSubSegment: boolean;
  useDose: boolean;
  useDoseUnit: boolean;
  rawMaterials: boolean;
  consumablesUsed: boolean;
  useScenario:boolean;
}

export interface SortIconProps {
  direction: "asc" | "desc";
  active: boolean;
}

export type ComponentDetail = {
  materialName: string;
  materialType: string;
  convertingProcess: string;
  finishingProcess: string;
  baselineWeight: string;
  baselineEnvironmentalFootprint: number;
  myProductWeight: string;
  myProductEnvironmentalFootprint: number;
};

export type Component = {
  componentName: string;
  details: ComponentDetail[];
};
export interface Product {
  projectId: string;
  brandName: string;
  productName: string;
  description: string;
  projectName: string;
  _id: string;
}

export interface CardProduct {
  projectId?: string;
  brandName: string;
  productName: string;
  description: string;
  projectName?: string;
  _id: string;
  users?: UsersEntity[] | null;
}

export interface UsersEntity {
  name: string;
  role: string;
  mail: string;
}
export interface ProductData {
  massComposition: string;
  carbonFootprint: number;
}

export interface RowData {
  tradeName: string;
  rawCode: string;
  baseline: ProductData;
  myProduct: ProductData;
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
  useScenario:string;
}
export interface FormulaCode {
  frml_cd_vers_concat: string;
}
export interface CompositionEntity {
  id: number;
  materialName: string;
  materialType: string;
  convertingProcess: string;
  finishingProcess: string;
  material_pct: string;
  productEnvironmentalFootPrint?: string;
  carbonFootPrint?: string;
  virginPlasticValue?: string;
}

export interface ComponentCompositionProps {
  updateSaveButtonState?: (isEnabled: boolean) => void;
  isSaved: boolean; // Add this prop to receive the saved state
  Composition: CompositionEntity[];
  rows: CompositionEntity[];
  setRows: React.Dispatch<React.SetStateAction<CompositionEntity[]>>;
  setRowsChangedFlag?: (changed: boolean) => void; // Function to set the rows changed flag
  errors: Map<number, string | null>; // Add this line
  setErrors: React.Dispatch<React.SetStateAction<Map<number, string | null>>>;
}
export interface ProgressBarWithLabelProps {
  value: number;
  color: string;
  label: string;
  width?: string; // Optional prop for width of the progress bar
}
export interface FormulationAndCompositionTableProp {
  formulationRawMaterials: RawMaterialsData[];
  handelFormulationTableChanges: (
    formulationRawMaterials: RawMaterialsData[]
  ) => void;
  handelSaveChanges?: (hasData: boolean) => void;
  isClear: boolean;
  mode: string;
}
export interface IAssementFormulationTable {
  currentTab?: string;
  subHeaderText: string;
}
export interface SortIconProps {
  direction: "asc" | "desc";
  active: boolean;
}
