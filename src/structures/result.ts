import { ReactNode } from "react";
import { PackagingLevelData, Component, IPackagingLevelObject} from "./packaging";
import { IGreenChemFormulationData } from "../components/results/sustainablePackaging/structure";
export interface ISustainablePackagingDisruptors {
    components: IComponent[];
    recyclability_disruptors_present_all_packaging_4_3: string;
    watchout_message_4_6: string;
}
export interface ISustainablePackagingMaterialEfficiency {
    Sum_Weight_of_All_Components: number;
    components: IComponentEfficiency[];
    N_dose: number;
    Material_Efficiency_All_Packaging: number;
}

export interface IComponentEfficiency {
  main_component: string;
  component_type: string;
  sub_components: ISubComponentEfficiency[];
  pc_nm: string;
  description: string;
  opacifier: string;
  recyclability_status: string;
  stage: string;
  state: string;
  template: string;
  isDataComplete: boolean;
  isEdited: boolean;
  isCalculated: boolean;
  _id: string;
  main_id: string;
  componentId: string;
  id: number;
  packaging_level: string;
  weight: string | number;
  material_efficiency: number;
  Amount_of_PCR_Materials_per_Component: number;
  PCR_Percent_Per_Component: number;
}

export interface ISubComponentEfficiency {
  name: string;
  opacity: string;
  color: string;
  finishing_process: string;
  material: IMaterialEfficiency[];
  weight: string | number;
}

export interface IMaterialEfficiency {
  material_name: string;
  material_type: string;
  layer: string;
  converting_process: string;
  material_pct: string | number;
  productEnvironmentalFootPrint?: string;
  carbonFootPrint?: string;
  virginPlasticValue?: string;
  _id: string;
  materialId: string;
  pcr_content: number;
  material_weight: number;
  material_efficiency: number;
}

export interface ISustainablePackagingPCR {
    sum_of_pcr_all_packaging: number;
    sum_weight_of_all_components: number;
    components: IComponentPCR[];
    pcr_content_all_packaging: number;
}

export interface IComponentPCR {
  main_component: string;
  component_type: string;
  sub_components: ISubComponentPCR[];
  pc_nm: string;
  description: string;
  opacifier: string;
  recyclability_status: string;
  stage: string;
  state: string;
  template: string;
  isDataComplete: boolean;
  isEdited: boolean;
  isCalculated: boolean;
  _id: string;
  main_id: string;
  componentId: string;
  packaging_level: string;
  weight: string | number;
  id: number;
  material_efficiency: number;
  Amount_of_PCR_Materials_per_Component: number;
  PCR_Percent_Per_Component: number;
}

export interface ISubComponentPCR {
  name: string;
  opacity: string;
  color: string;
  finishing_process: string;
  material: IMaterialPCR[];
  weight: number;
}

export interface IMaterialPCR {
  material_name: string;
  material_type: string;
  layer: string;
  converting_process: string;
  material_pct: string | number;
  _id: string;
  materialId: string;
  pcr_content: number;
  material_weight: number;
  virgin_non_pcr_amount: number;
  PCR_Material_Percent_Component: number;
}

export interface IComponent {
  main_component?: string;
  component_type: string;
  sub_components: ISubComponent[];
  pc_nm: string;
  description: string;
  opacifier: string;
  recyclability_status: string;
  stage: string;
  state: string;
  template: string;
  isDataComplete: boolean;
  isEdited: boolean;
  isCalculated: boolean;
  _id: string;
  main_id: string;
  componentId: string;
  recyclability_disruptors_present_component_flag_4_2: number;
  recyclability_disruptors_list_formatted_4_5: string | null;
  id: number;
  weight: string | number;
  material_efficiency: number;
  Amount_of_PCR_Materials_per_Component: number;
  PCR_Percent_Per_Component: number;
}

export interface ISubComponent {
  name: string;
  opacity: string;
  color: string;
  finishing_process: string;
  material: IMaterial[];
  weight: string | number;
}

export interface IMaterial {
  material_name: string;
  material_type: string;
  layer: string;
  converting_process: string;
  material_pct: string | number;
  productEnvironmentalFootPrint: string;
  carbonFootPrint: string;
  virginPlasticValue: string;
  _id: string;
  materialId: string;
  pcr_content: number;
  recyclability_disruptors_present_material_4_1: number | null;
  recyclability_disruptors_list_4_4: string | null;
}

export interface ResultDataType {
  experimental: Experimental;
  isBaselinePresent: boolean;
  isBaselineDataComplete: boolean,
  baseline: Baseline;
  final: Final;
}

export interface ResultData {
  experimental: Experimental;
  isBaselinePresent: boolean;
  isBaselineDataComplete: boolean;
  baseline: Baseline;
  baselinePackaging: BaselinePackaging;
  myProductPackaging: BaselinePackaging;
}
export interface Final {
  assessment_id: string;
  version: string;
  formula_end_of_life: FormulaEndOfLife;
  distribution: Distribution;
  manufacturing: Manufacturing;
  packproduction: Packproduction;
  packagingeol: Packagingeol;
  rawmaterials: Rawmaterials;
  usephase: Usephase;
  totallca: Totallca;
  "sustainablepackaging-recyclable-content": ISustainableRecycleReady;
  "sustainablepackaging-rollup-compare": ISustainableTotalRollup;
  gaia_score: GaiaScoreProps;
  renewable_feedback_stock: RenewableFeedstock;
  watchlist: WatchList;

}

export interface Baseline {
  assessment_id: string;
  version: string;
  formula_end_of_life: FormulaEndOfLife;
  distribution: Distribution;
  manufacturing: Manufacturing;
  packproduction: Packproduction;
  packagingeol: Packagingeol;
  rawmaterials: Rawmaterials;
  usephase: Usephase;
  totallca: Totallca;
  "sustainablepackaging-recyclable-content": ISustainableRecycleReady;
  "sustainablepackaging-recyclability-disruptors": ISustainablePackagingDisruptors;
  "sustainablepackaging-material-efficiency": ISustainablePackagingMaterialEfficiency;
  "sustainablepackaging-pcr": ISustainablePackagingPCR;
  gaia_score: GaiaScoreProps;
  renewable_feedback_stock: RenewableFeedstock;
  watchlist: WatchList;
  green_chemistry_rollup: object;

}

export interface Experimental {
  assessment_id: string;
  version: string;
  formula_end_of_life: FormulaEndOfLife;
  distribution: Distribution;
  manufacturing: Manufacturing;
  packproduction: Packproduction;
  packagingeol: Packagingeol;
  rawmaterials: Rawmaterials;
  usephase: Usephase;
  totallca: Totallca;
  "sustainablepackaging-recyclable-content": ISustainableRecycleReady;
  "sustainablepackaging-rollup-compare": ISustainableTotalRollup;
  "sustainablepackaging-recyclability-disruptors": ISustainablePackagingDisruptors;
  "sustainablepackaging-material-efficiency": ISustainablePackagingMaterialEfficiency;
  "sustainablepackaging-pcr": ISustainablePackagingPCR;
  gaia_score: GaiaScoreProps;
  renewable_feedback_stock:RenewableFeedstock;
  watchlist: WatchList;
  green_chemistry_rollup: object;
}
export interface WatchList {

  unique_constituents: string[]; 
 
  overall_scores: { [key: string]: number | null }; 
 
  count_of_4_ingredients: number; // Count of 4-ingredient constituents
 
  count_of_3_ingredients: number; // Count of 3-ingredient constituents
 
  watchlist_score: number; 
 
  watchlist_score_actual: number; // Actual watchlist score
 
  max_watchlist_score: number; // Maximum possible watchlist score
 
  watchlist_table: WatchListTableItem[]; // Array for detailed table information
 
  max_scores_per_raw: { [key: string]: number | null }; // Key-value pairs for max scores per RAW
 
  watchlist_icon_boolean: { [key: string]: number }; // Key-value pairs for icon booleans (1 or 0)
 
 }
 
 
 
 export interface WatchListTableItem {
 
  "Constituent ID": string; // Constituent ID
 
  "Constituent Name": string; // Constituent Name
 
  "RAW Code": string; // RAW codes associated with the constituent
 
  "Score": number; // Score for the constituent
 
  "Reason": string; // Reason or additional context
 
 }
 
 

 // Renewable Feedstock Origin Interfaces
 
 export interface RenewableFeedstock {
 
  raw_materials: RenewableRawMaterial[];
 
  min_con_bio_based_origins: Record<string, MinConBioBasedOrigin>;
 
  sum_chemical_percentages: Record<string, SumChemicalPercentage>;
 
  renewable_feedstock_sub_total: number;
 
  sum_of_organic_chemical_percents: number;
 
  renewable_feedstock_total: number;
 
 }
 
 
 
 export interface RenewableRawMaterial {
 
  raw_material_id: string;
 
  raw_material_name: string;
 
  raw_material_value: string;
 
  compositions: RenewableComposition[];
 
  raw_bio_based_origin: number[];
 
  min_raw_bio_based_origin: number;
 
  sum_of_organic_chemical_percents_per_raw: number;
 
  bio_based_orgin_raw_percents: number;
 
  leaf_icon_booleans: string;
 
 }
 
 
 
 export interface RenewableComposition {
 
  composition_id: string;
 
  raw_chemical_percentage: number;
 
  organic_designation: string;
 
 }
 
 
 
 export interface MinConBioBasedOrigin {
 
  min_con_bio_based_origin: number;
 
  rawMaterials: string[];
 
 }
 
 
 
 export interface SumChemicalPercentage {
 
  sum_chemical_percentage: number;
 
  rawMaterials: string[];
 
 }
 
 
export interface ISustainableRecycleReady  {
    percentage_recycle_ready_all_packaging: number;
    components: IRecycleComponent[];
    Sum_Weight_of_Recycle_Ready_Components: number;
    Sum_Weight_of_All_Components: number;
}

export interface IRecycleComponent {
  main_component: string;
  component_type: string;
  sub_components: IRecycleSubComponent[];
  pc_nm: string;
  description: string;
  opacifier: string;
  recyclability_status: string;
  stage: string;
  state: string;
  template: string;
  isDataComplete: boolean;
  isEdited: boolean;
  isCalculated: boolean;
  _id: string;
  main_id: string;
  componentId: string;
  packaging_level: string;
  id: number;
  weight: string;
  material_efficiency: number;
  Amount_of_PCR_Materials_per_Component: number;
  PCR_Percent_Per_Component: number;
}

export interface IRecycleSubComponent {
  name: string;
  opacity: string;
  color: string;
  finishing_process: string;
  material: IRecycleMaterial[];
  weight: number;
}

export interface IRecycleMaterial {
  material_name: string;
  material_type: string;
  layer: string;
  converting_process: string;
  material_pct: string | number;
  _id: string;
  materialId?: string;
  pcr_content: number;
}


export interface ISustainableTotalRollup {
  Difference_Recycle_Ready: number;
  Difference_PCR_Content: number;
  Difference_Material_Efficiency: number;
  Score_Recycle_Ready: number;
  Score_PCR_Content: number;
  Score_Material_Efficiency: number;
  Weighting_Recycle_Ready: number;
  Weighting_PCR_Content: number;
  Weighting_Material_Efficiency: number;
  Final_Score: number;
  Final_Score_Disrupters: number;
}

export interface IRawMaterial {
  raw_material_id: string;
  raw_material_production_PEF_score_per_functional_unit: number;
  raw_material_ef_total?: {
    climate_change_amount: number;
  };
}

export interface IEolRawMaterial {
  raw_material_id: string;
  eol_raw_mat_PEF_score_functional_unit: number;
  sum_eol_raw_ef?: {
    climate_change_amount: number;
  };
}

export interface VarProductInterface {
  assessment_id: string;
  createdAt: string;
  formula_end_of_life: FormulaEndOfLife;
  distribution: Distribution;
  manufacturing: Manufacturing;
  packproduction: Packproduction;
  packagingeol: Packagingeol;
  rawmaterials: Rawmaterials;
  usephase: Usephase;
  totallca: Totallca;
  updatedAt: string;
}
export interface VarBaseLineInterface {
  assessment_id: string;
  _id: string;
  distribution: Distribution;
  packproduction: Packproduction;
  packagingeol: Packagingeol;
  usephase: Usephase;
  rawmaterials?: Rawmaterials;
  formula_end_of_life?: FormulaEndOfLife;
}
export interface BaselinePackaging {
  ConsumablesUsed: number;
  assessmentId: string;
  assessmentType: string;
  claimedVolumed: number;
  fg_revision: string;
  fg_spec: string;
  formulaId: string;
  formula_id: string;
  net_content: number;
  packaging_level: PackagingLevelData[];
  productEvaluation: number;
  productId: string;
  productSegment: string;
  productSubSegment: string;
  production_country: string;
  sales_country: string;
  useDose: string;
  user: User;
}
export interface Final {
  packagingeol: Packagingeol;
  rawmaterials: Rawmaterials;
  formula_end_of_life: FormulaEndOfLife;
}

export interface FormulaEndOfLife {
  updated_at: string;
  n_dose_per_product: number;
  evaporated_water: number;
  water_use_in_m3: number;
  eol_wateruse_nDose_evapwater: number;
  amount_as_percent: number;
  eol_unpolluted_wastewater: EolUnpollutedWasteWaterSectionOne;
  one_minus_b: number;
  eol_waterrelease: EolUnpollutedWasteWaterSectionOne;
  eol_uwwp_and_waterrelease: EolUnpollutedWasteWaterSectionOne;
  chemical_percent_normalized?: ChemicalPercentNormalizedEntity[] | null;
  eol_formula_total?: EolFormulaTotalEntity[] | null;
  eol_total_part_1: EolUnpollutedWasteWaterSectionOne;
  eol_formula_final: SumEolRawEfOrEolFormulaFinalOrSumTransportationEf;
  claimed_volume_in_kg: number;
  amount_in_percent: number;
  one_minus_t: number;
  b: number;
  raw_materials?: RawMaterialsEntity[] | null;
}
export interface EolUnpollutedWasteWaterSectionOne {
  climate_change_amount: number;
  ozone_depletion_amount: number;
  ionising_radiation_amount: number;
  photochemical_ozone_formation_amount: number;
  particulate_matter_amount: number;
  human_toxicity_non_cancer_amount: number;
  human_toxicity_cancer_amount: number;
  acidification_amount: number;
  eutrophication_freshwater_amount: number;
  eutrophication_marine_amount: number;
  eutrophication_terrestrial_amount: number;
  ecotoxicity_freshwater_amount: number;
  land_use_amount: number;
  water_use_amount: number;
  resource_use_fossils_amount: number;
  resource_use_minerals_and_metals_amount: number;
}
export interface ChemicalPercentNormalizedEntity {
  rawMaterialId: string;
  chemicalPercentNormalized?: ChemicalPercentNormalizedEntity1[] | null;
}
export interface ChemicalPercentNormalizedEntity1 {
  EUINCIName: string;
  USINCIName: string;
  primaryFunction: PrimaryFunction;
  CASNumber: string;
  CONNumber: string;
  percentage: string;
  minPercentage: string;
  maxPercentage: string;
  intended: string;
  chemical_percent_normalized: number;
  raw_con_ef: EolUnpollutedWasteWaterSectionOne;
}
export interface PrimaryFunction {
  id: string;
  value: string;
}
export interface EolFormulaTotalEntity {
  formulaId: string;
  x: XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf;
}
export interface XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf {
  climate_change_amount: number;
  ozone_depletion_amount: number;
  ionising_radiation_amount: number;
  photochemical_ozone_formation_amount: number;
  particulate_matter_amount: number;
  human_toxicity_non_cancer_amount: number;
  human_toxicity_cancer_amount: number;
  acidification_amount: number;
  eutrophication_freshwater_amount: number;
  eutrophication_marine_amount: number;
  eutrophication_terrestrial_amount: number;
  land_use_amount: number;
  water_use_amount: number;
  resource_use_fossils_amount: number;
  resource_use_minerals_and_metals_amount: number;
  ecotoxicity_freshwater_amount: number;
}
export interface SumEolRawEfOrEolFormulaFinalOrSumTransportationEf {
  climate_change_amount: number;
  climate_change_amount_functional_unit: number;
  ozone_depletion_amount: number;
  ionising_radiation_amount: number;
  photochemical_ozone_formation_amount: number;
  particulate_matter_amount: number;
  human_toxicity_non_cancer_amount: number;
  human_toxicity_cancer_amount: number;
  acidification_amount: number;
  eutrophication_freshwater_amount: number;
  eutrophication_marine_amount: number;
  eutrophication_terrestrial_amount: number;
  land_use_amount: number;
  water_use_amount: number;
  resource_use_fossils_amount: number;
  resource_use_minerals_and_metals_amount: number;
  ecotoxicity_freshwater_amount: number;
  total: number;
}
export interface RawMaterialsEntity {
  raw_material_id: string;
  raw_material_value: number;
  rawmat_percent_normalized: number;
  eol_raw_con_ef: EolRawConEf;
  sum_eol_raw_con_ef: number;
  ecotoxicity_freshwater: number;
  sum_eol_raw_con_ef_x: SumEolRawConEfX;
  sum_eol_raw_ef: SumEolRawEfOrEolFormulaFinalOrSumTransportationEf;
  CONNumber: string;
  eol_raw_mat_PEF_score_functional_unit: number;
}
export interface EolRawConEf {
  CONNumber: string;
  impact_factors: XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf;
}
export interface SumEolRawConEfX {
  climate_change_amount: number;
  ozone_depletion_amount: number;
  ionising_radiation_amount: number;
  photochemical_ozone_formation_amount: number;
  particulate_matter_amount: number;
  human_toxicity_non_cancer_amount: number;
  human_toxicity_cancer_amount: number;
  acidification_amount: number;
  eutrophication_freshwater_amount: number;
  eutrophication_marine_amount: number;
  eutrophication_terrestrial_amount: number;
  land_use_amount: number;
  water_use_amount: number;
  resource_use_fossils_amount: number;
  resource_use_minerals_and_metals_amount: number;
}
export interface Distribution {
  updated_at: string;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose1: string;
  Claimed_Volume_Of_Finished_Product: number;
  rate_of_restitution: number;
  Use_Dose: number;
  SPICE_distribution_PRODUCT: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  rate_of_restitution_dose_mass: number;
  SPICE_distribution_FINAL: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_scarcity: number;
  resource_use_fossil: number;
  resource_use_minerals_metals: number;
}
export interface SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_scarcity: number;
  resource_use_fossil: number;
  resource_use_minerals_metals: number;
  total: number;
}
export interface Manufacturing {
  updated_at: string;
  claimed_volume_in_kg: number;
  converted_amount_electricity: number;
  manufacturing_ef_electricity: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  manufacturing_ef_natural_gas: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  manufacturing_ef_fuel_oil: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  converted_tap_water_use: number;
  manufacturing_ef_tap_water: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  manufacturing_ef_waste_water: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  total_manufacturing: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  product_manufacturing_total: ProductManufacturingTotalOrManufacturing;
}
export interface ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_use: number;
  resource_use_fossils: number;
  resource_use_minerals_and_metals: number;
}
export interface ProductManufacturingTotalOrManufacturing {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_use: number;
  resource_use_fossils: number;
  resource_use_minerals_and_metals: number;
  total: number;
}
export interface Packproduction {
  updated_at: string;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose1: string;
  Claimed_Volume_Of_Finished_Product: number;
  rate_of_restitution: number;
  Use_Dose: number;
  SPICE_packaging_production_emissions: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  SPICE_packaging_production_PRODUCT: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  rate_of_restitution_dose_mass: number;
  SPICE_packaging_production_FINAL: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface Packagingeol {
  updated_at: string;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose1: string;
  Claimed_Volume_Of_Finished_Product: number;
  rate_of_restitution: number;
  Use_Dose: number;
  SPICE_pack_EOL_PRODUCT: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  rate_of_restitution_dose_mass: number;
  SPICE_pack_EOL_FINAL: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface Rawmaterials {
  updated_at: string;
  net_content: number;
  formula_id: string;
  transportation_mileage_ef_kg?: TransportationMileageEfKgEntity[] | null;
  claimed_value_in_kg: number;
  transportation_mileage_ef: XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf;
  sum_transportation_ef: SumEolRawEfOrEolFormulaFinalOrSumTransportationEf;
  formula_production_ef_total: SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase;
  raw_materials?: RawMaterialsEntity1[] | null;
}
export interface TransportationMileageEfKgEntity {
  referenceProduct_name: string;
  emission_factors: XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf;
}
export interface SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase {
  climate_change_amount: number;
  climate_change_amount_functional_unit: number;
  ozone_depletion_amount: number;
  ionising_radiation_amount: number;
  photochemical_ozone_formation_amount: number;
  particulate_matter_amount: number;
  human_toxicity_non_cancer_amount: number;
  human_toxicity_cancer_amount: number;
  acidification_amount: number;
  eutrophication_freshwater_amount: number;
  eutrophication_marine_amount: number;
  eutrophication_terrestrial_amount: number;
  ecotoxicity_freshwater_amount: number;
  land_use_amount: number;
  water_use_amount: number;
  resource_use_fossils_amount: number;
  resource_use_minerals_and_metals_amount: number;
  total: number;
}
export interface RawMaterialsEntity1 {
  raw_material_id: string;
  raw_material_value: number;
  raw_material_name: string;
  rawmat_percent_normalized: number;
  sum_raw_ef: SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase;
  raw_con_ef?: RawConEfEntity[] | null;
  chemical_percent_normalized?: ChemicalPercentNormalizedEntity2[] | null;
  raw_material_production: EolUnpollutedWasteWaterSectionOne;
  raw_material_tranport: XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf;
  raw_material_ef_total: SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase;
  raw_material_production_PEF_score_per_functional_unit: number;
}
export interface RawConEfEntity {
  CONNumber: string;
  raw_con_ef: EolUnpollutedWasteWaterSectionOne;
}
export interface ChemicalPercentNormalizedEntity2 {
  CONNumber: string;
  chemical_percent_normalized: number;
}
export interface Usephase {
  updated_at: string;
  n_dose_per_product: number;
  Q_heat: number;
  use_phase_ef_electricity: EolUnpollutedWasteWaterSectionOne;
  converted_heat_natural_gas: EolUnpollutedWasteWaterSectionOne;
  use_phase_ef_natural_gas: EolUnpollutedWasteWaterSectionOne;
  converted_heat_fuel_oil: EolUnpollutedWasteWaterSectionOne;
  use_phase_ef_fuel_oil: EolUnpollutedWasteWaterSectionOne;
  heat_total: EolUnpollutedWasteWaterSectionOne;
  mj_heat_total: EolUnpollutedWasteWaterSectionOne;
  MConsumable: number;
  ef_waste_truck: EolUnpollutedWasteWaterSectionOne;
  converted_waste_truck: EolUnpollutedWasteWaterSectionOne;
  total_consumable: EolUnpollutedWasteWaterSectionOne;
  final_use_phase: SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase;
}
export interface Totallca {
  updated_at: string;
  total_lifecycle_total_pef: number;
  total_lifecycle_total_pef_excluding_use_phase_functional_unit: number;
  total_formulation_TOTAL_PEF_functional_unit: number;
  normalization_weightFactors: NormalizationWeightFactors;
  total_formulation_pre_normalization: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  product_id: string;
  assessment_id: string;
  assessment_type: string;
  user: User;
  calculation_output: CalculationOutput;
  assessment_type_data?: ExperimentalEntityOrAssessmentTypeDataEntity[] | null;
  normalization_factors_cursor?: NormalizationFactorsCursorEntity[] | null;
  impact_keys?: string[] | null;
  pre_normalization: PreNormalization;
  total_packaging_pre_normalization: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  total_lifecycle_pre_normalization: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  total_lifecycle_pre_normalization_excluding_use_phase: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  post_normalization: PostNormalizationOrPostNormalizationAndWeighted;
  post_normalization_and_weighted: PostNormalizationOrPostNormalizationAndWeighted;
  total_pef: TotalPef;
  total_packaging_TOTAL_PEF_functional_unit: number;
}
export interface NormalizationWeightFactors {
  climate_change: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  ozone_depletion: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  ionising_radiation: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  photochemical_ozone_formation: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  particulate_matter: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  human_toxicity_non_cancer: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  human_toxicity_cancer: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  acidification: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  eutrophication_freshwater: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  eutrophication_marine: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  eutrophication_terrestrial: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  ecotoxicity_freshwater: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  land_use: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  resource_use_fossils: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  resource_use_minerals_and_metals: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
  water_use: ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse;
}
export interface SustainableTotalRollup {
  Difference_Recycle_Ready: number;
  Difference_PCR_Content: number;
  Difference_Material_Efficiency: number;
  Score_Recycle_Ready: number;
  Score_PCR_Content: number;
  Score_Material_Efficiency: number;
  Weighting_Recycle_Ready: number;
  Weighting_PCR_Content: number;
  Weighting_Material_Efficiency: number;
  Final_Score: number;
  Final_Score_Disrupters: number;
}
export interface MyProductDials {
  error: boolean;
  impact_keys?: string[] | null;
  normalization_factors_cursor?: NormalizationFactorsCursorEntity[] | null;
  normalization_weightFactors: NormalizationWeightFactors;
  post_normalization: PostNormalizationOrPostNormalizationAndWeighted;
  post_normalization_and_weighted: PostNormalizationOrPostNormalizationAndWeighted;
  pre_normalization: PreNormalization;
  total_formulation_TOTAL_PEF_functional_unit: number;
  total_formulation_pre_normalization: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  total_lifecycle_pre_normalization: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  total_lifecycle_pre_normalization_excluding_use_phase: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  total_lifecycle_total_pef: number;
  total_lifecycle_total_pef_excluding_use_phase_functional_unit: number;
  total_packaging_TOTAL_PEF_functional_unit: number;

  total_packaging_pre_normalization: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;

  total_pef: TotalPef;
  "sustainablepackaging-rollup-compare": SustainableTotalRollup;
}
export interface ClimateChangeOrOzoneDepletionOrIonisingRadiationOrPhotochemicalOzoneFormationOrParticulateMatterOrHumanToxicityNoncancerOrHumanToxicityCancerOrAcidificationOrEutrophicationFreshwaterOrEutrophicationMarineOrEutrophicationTerrestrialOrEcotoxicityFreshwaterOrLandUseOrResourceUseFossilsOrResourceUseMineralsAndMetalsOrWaterUse {
  Normalization_Factor: number;
  Weighting_Factor: number;
}
export interface FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase {
  climate_change: number;
  climate_change_functional_unit: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_use: number;
  resource_use_fossils: number;
  resource_use_minerals_and_metals: number;
  total: number;
}
export interface User {
  name: string;
  email: string;
}
export interface CalculationOutput {
  _id: AssessmentIdOrIdOrProductId;
  product_id: AssessmentIdOrIdOrProductId;
  formula_input_output: FormulaInputOutput;
  isDelete: string;
  created_at: UpdatedAtOrCreatedAt;
  updated_at: UpdatedAtOrCreatedAt;
}
export interface AssessmentIdOrIdOrProductId {
  $oid: string;
}
export interface FormulaInputOutput {
  input: Input;
  output: Output;
}
export interface Input {
  experimental?: ExperimentalEntityOrBaselineEntity[] | null;
  baseline?: ExperimentalEntityOrBaselineEntity[] | null;
}
export interface ExperimentalEntityOrBaselineEntity {
  assessment_id: AssessmentIdOrIdOrProductId;
  version: string;
  formula_end_of_life: FormulaEndOfLife1;
  distribution: DistributionOrPackproductionOrPackagingeol;
  manufacturing: Manufacturing1;
  packproduction: DistributionOrPackproductionOrPackagingeol;
  packagingeol: DistributionOrPackproductionOrPackagingeol;
  rawmaterials: Rawmaterials1;
  usephase: Usephase1;
}
export interface FormulaEndOfLife1 {
  updated_at: UpdatedAtOrCreatedAt;
  user: User;
  assessment_type: string;
  useDose: number;
  formulaId: string;
  productSegment: string;
  productSubSegment: string;
  parameter: string;
  claimedVolumed: number;
  retentionRate: number;
  rawMaterials?: RawMaterialsEntity[] | null;
  net_content: number;
}
export interface UpdatedAtOrCreatedAt {
  $date: string;
}
export interface DistributionOrPackproductionOrPackagingeol {
  updated_at: UpdatedAtOrCreatedAt;
  user: User;
  assessment_type: string;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose: string;
}
export interface Manufacturing1 {
  updated_at: UpdatedAtOrCreatedAt;
  user: User;
  assessment_type: string;
  net_content: number;
}
export interface Rawmaterials1 {
  updated_at: UpdatedAtOrCreatedAt;
  user: User;
  assessment_type: string;
  net_content: number;
  formula_id: string;
  data?: DataEntity[] | null;
}
export interface DataEntity {
  raw_material_id: string;
  raw_material_value: number;
}
export interface Usephase1 {
  updated_at: UpdatedAtOrCreatedAt;
  user: User;
  assessment_type: string;
  claimedVolumed: number;
  retentionRate: number;
  useDose: number;
  ConsumablesUsed: number;
  productSegment: string;
  productSubSegment: string;
}
export interface Output {
  experimental?: ExperimentalEntityOrAssessmentTypeDataEntity[] | null;
  baseline?: BaselineEntity[] | null;
}
export interface ExperimentalEntityOrAssessmentTypeDataEntity {
  assessment_id: string;
  version: string;
  formula_end_of_life: FormulaEndOfLife2;
  distribution: Distribution1;
  manufacturing: Manufacturing2;
  packproduction: Packproduction1;
  packagingeol: Packagingeol1;
  rawmaterials: Rawmaterials2;
  usephase: Usephase2;
}
export interface FormulaEndOfLife2 {
  updated_at: UpdatedAtOrCreatedAt;
  n_dose_per_product: number;
  evaporated_water: number;
  water_use_in_m3: number;
  eol_wateruse_nDose_evapwater: number;
  amount_as_percent: number;
  eol_unpolluted_wastewater: EolUnpollutedWasteWaterSectionOne;
  one_minus_b: number;
  eol_waterrelease: EolUnpollutedWasteWaterSectionOne;
  eol_uwwp_and_waterrelease: EolUnpollutedWasteWaterSectionOne;
  chemical_percent_normalized?: ChemicalPercentNormalizedEntity[] | null;
  eol_formula_total?: EolFormulaTotalEntity[] | null;
  eol_total_part_1: EolUnpollutedWasteWaterSectionOne;
  eol_formula_final: SumEolRawEfOrEolFormulaFinalOrSumTransportationEf;
  claimed_volume_in_kg: number;
  amount_in_percent: number;
  one_minus_t: number;
  b: number;
  raw_materials?: RawMaterialsEntity[] | null;
}
export interface Distribution1 {
  updated_at: UpdatedAtOrCreatedAt;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose1: string;
  Claimed_Volume_Of_Finished_Product: number;
  rate_of_restitution: number;
  Use_Dose: number;
  SPICE_distribution_PRODUCT: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  rate_of_restitution_dose_mass: number;
  SPICE_distribution_FINAL: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface Manufacturing2 {
  updated_at: UpdatedAtOrCreatedAt;
  claimed_volume_in_kg: number;
  converted_amount_electricity: number;
  manufacturing_ef_electricity: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  manufacturing_ef_natural_gas: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  manufacturing_ef_fuel_oil: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  converted_tap_water_use: number;
  manufacturing_ef_tap_water: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  manufacturing_ef_waste_water: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  total_manufacturing: ManufacturingEfElectricityOrManufacturingEfNaturalGasOrManufacturingEfFuelOilOrManufacturingEfTapWaterOrManufacturingEfWasteWaterOrTotalManufacturing;
  product_manufacturing_total: ProductManufacturingTotalOrManufacturing;
}
export interface Packproduction1 {
  updated_at: UpdatedAtOrCreatedAt;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose1: string;
  Claimed_Volume_Of_Finished_Product: number;
  rate_of_restitution: number;
  Use_Dose: number;
  SPICE_packaging_production_emissions: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  SPICE_packaging_production_PRODUCT: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  rate_of_restitution_dose_mass: number;
  SPICE_packaging_production_FINAL: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface Packagingeol1 {
  updated_at: UpdatedAtOrCreatedAt;
  Net_contents: string;
  Product_Evacuation: string;
  Use_Dose1: string;
  Claimed_Volume_Of_Finished_Product: number;
  rate_of_restitution: number;
  Use_Dose: number;
  SPICE_pack_EOL_PRODUCT: SPICEDistributionPRODUCTOrSPICEPackagingProductionEmissionsOrSPICEPackagingProductionPRODUCTOrSPICEPackEOLPRODUCT;
  rate_of_restitution_dose_mass: number;
  SPICE_pack_EOL_FINAL: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface Rawmaterials2 {
  updated_at: UpdatedAtOrCreatedAt;
  net_content: number;
  formula_id: string;
  transportation_mileage_ef_kg?: TransportationMileageEfKgEntity[] | null;
  claimed_value_in_kg: number;
  transportation_mileage_ef: XOrImpactFactorsOrEmissionFactorsOrRawMaterialTranportOrTransportationMileageEf;
  sum_transportation_ef: SumEolRawEfOrEolFormulaFinalOrSumTransportationEf;
  formula_production_ef_total: SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase;
  raw_materials?: RawMaterialsEntity1[] | null;
}
export interface Usephase2 {
  updated_at: UpdatedAtOrCreatedAt;
  n_dose_per_product: number;
  Q_heat: number;
  use_phase_ef_electricity: EolUnpollutedWasteWaterSectionOne;
  converted_heat_natural_gas: EolUnpollutedWasteWaterSectionOne;
  use_phase_ef_natural_gas: EolUnpollutedWasteWaterSectionOne;
  converted_heat_fuel_oil: EolUnpollutedWasteWaterSectionOne;
  use_phase_ef_fuel_oil: EolUnpollutedWasteWaterSectionOne;
  heat_total: EolUnpollutedWasteWaterSectionOne;
  mj_heat_total: EolUnpollutedWasteWaterSectionOne;
  MConsumable: number;
  ef_waste_truck: EolUnpollutedWasteWaterSectionOne;
  converted_waste_truck: EolUnpollutedWasteWaterSectionOne;
  total_consumable: EolUnpollutedWasteWaterSectionOne;
  final_use_phase: SumRawEfOrRawMaterialEfTotalOrFormulaProductionEfTotalOrFinalUsePhase;
}
export interface BaselineEntity {
  assessment_id: AssessmentIdOrIdOrProductId;
  version: string;
  formula_end_of_life: FormulaEndOfLife2;
  distribution: Distribution1;
  manufacturing: Manufacturing2;
  packproduction: Packproduction1;
  packagingeol: Packagingeol1;
  rawmaterials: Rawmaterials2;
  usephase: Usephase2;
}
export interface NormalizationFactorsCursorEntity {
  Impact_Category: string;
  Normalization_Factor: number;
  Weighting_Factor: number;
}
export interface PreNormalization {
  raw_material_production: RawMaterialProductionOrUsePhase;
  pack_production: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
  manufacturing: ProductManufacturingTotalOrManufacturing;
  distribution: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
  use_phase: RawMaterialProductionOrUsePhase;
  formula_eol: FormulaEol;
  pack_eol: SPICEDistributionFINALOrSPICEPackagingProductionFINALOrSPICEPackEOLFINALOrPackProductionOrDistributionOrPackEol;
}
export interface RawMaterialProductionOrUsePhase {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer_amount: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_use: number;
  resource_use_fossils: number;
  resource_use_minerals_and_metals: number;
  total: number;
}
export interface FormulaEol {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_non_cancer: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  land_use: number;
  water_use: number;
  resource_use_fossils: number;
  resource_use_minerals_and_metals: number;
  ecotoxicity_freshwater: number;
  total: number;
}
export interface PostNormalizationOrPostNormalizationAndWeighted {
  raw_material_production: RawMaterialProductionOrManufacturingOrUsePhase;
  pack_production: PackProductionOrDistributionOrPackEol;
  manufacturing: RawMaterialProductionOrManufacturingOrUsePhase;
  distribution: PackProductionOrDistributionOrPackEol;
  use_phase: RawMaterialProductionOrManufacturingOrUsePhase;
  formula_eol: FormulaEolOrTotalFormulationPreNormalizationOrTotalPackagingPreNormalizationOrTotalLifecyclePreNormalizationOrTotalLifecyclePreNormalizationExcludingUsePhase;
  pack_eol: PackProductionOrDistributionOrPackEol;
}
export interface RawMaterialProductionOrManufacturingOrUsePhase {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
  water_use: number;
  resource_use_fossils: number;
  resource_use_minerals_and_metals: number;
}
export interface PackProductionOrDistributionOrPackEol {
  climate_change: number;
  ozone_depletion: number;
  ionising_radiation: number;
  photochemical_ozone_formation: number;
  particulate_matter: number;
  human_toxicity_cancer: number;
  acidification: number;
  eutrophication_freshwater: number;
  eutrophication_marine: number;
  eutrophication_terrestrial: number;
  ecotoxicity_freshwater: number;
  land_use: number;
}
export interface TotalPef {
  raw_material_production_functional_unit: number;
  pack_production_functional_unit: number;
  manufacturing_functional_unit: number;
  distribution_functional_unit: number;
  use_phase_functional_unit: number;
  formula_eol_functional_unit: number;
  pack_eol_functional_unit: number;
}

export interface ProductData {
  massComposition: string;
  carbonFootprint: number;
}

export interface IproductEnvironmentalFootprint {
  tradeName: string;
  rawCode: string;
  baseline: ProductData;
  myProduct: ProductData;
}
// Result Context realated interfaces

export interface IBarGraphObject {
  lifecyclestage: string;
  baseline: number;
  myproduct: number;
}

// footprintData
export interface IEnvFPScore {
  raw_material_id: string;
  raw_material_production_PEF_score_per_functional_unit: number;
}

export interface ITabInfoFootPrint {
  heading?: string;
  percentage: number;
  myproduct: number;
  baseline: number;
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

export interface ISustainableTabStructure {
  totalScore: { heading: string; percentage: number };
  pcrContent: ITabInfoSustainable;
  materialEfficiency: ITabInfoSustainable;
  recycleReady: ITabInfoSustainable;
  disruptors: ITabInfoSustainable;
}

export interface ResultContextProp {
  resultData: ResultDataType | null;
  resultFormulationData: ResultDataType | null;
  productEnvironmentalFootprintData: FootprintStructure;
  carbonFootprintData: FootprintStructure;
  sustainablePackagingData: ISustainableStructure;
  greenChemistryData: IGreenChemistryStructure;
  assessmentsType?: string | null;
  setCurrentTab: (currentTab: string) => void;
  setCurrentSustainableSection: (currentSustainableSection: string) => void;
  setCurrentGreenChemistrySection: (
    currentGreenChemistrySection: string
  ) => void;
  currentGreenChemistrySection: string;
  footPrintData: IFootprintData[];
  currentTab: string;
  currentSustainableSection: string;
  resultDataRefetch: () => void;
  refetchResultBaseline: () => void;
  packakingComponetList: IPackagingLevelObject | null;
  dialsErrorMsg: string;
  dialsError: boolean;
  resultkey?:string;
}

export interface ResultProviderProps {
  children: ReactNode;
  productId: string;
  assessmentId: string;
  assessmentType: string;
  version?: string;
}

export interface IFootprintData {
  rawMaterialId: string;
  envFootprint: number;
  carbonFootprint: number;
  gaiaScore: string;
  leaf_icon_boolean: string;
  watchlist_icon_boolean: string;
}
// Result Context realated interfaces

export interface IPEFData {
  raw_material_production_functional_unit: number;
  pack_production_functional_unit: number;
  manufacturing_functional_unit: number;
  distribution_functional_unit: number;
  use_phase_functional_unit: number;
  formula_eol_functional_unit: number;
  pack_eol_functional_unit: number;
}

export interface IBarGraphObject {
  lifecyclestage: string;
  baseline: number;
  myproduct: number;
}

// footprintData
export interface IEnvFPScore {
  raw_material_id: string;
  raw_material_production_PEF_score_per_functional_unit: number;
}

export interface ITabInfoFootPrint {
  heading?: string;
  percentage: number;
  myproduct: number;
  baseline: number;
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

export interface IPieChartSeries {
  actaulRangeIndicator: string;
  colors_series1: string;
  dialsIndicator: string;
  rangeIndicator: number;
  data_series1?: number | string;
}

// recycle ready realted types
// Recycle ready - RR - Horizontal bar chart
export interface IRRBarChartData {
  category: string;
  value: number;
}

export interface IRRProductInfo {
  weight: string;
  recycleReady: string;
}

export interface IRRDetailTable {
  componentType: string;
  packagingLayer: string;
  baselineProduct: IRRProductInfo;
  myProduct: IRRProductInfo;
}

export interface IRecycleReadyStucture {
  barData: IRRBarChartData[];
  detailedData: IRRDetailTable[];
}

export interface IDials {
  PieChartJSONSeries1: IPieChartSeries[];
  pie_chart_percentage: string;
  pie_chart_sub_title: string;
  total_lifecycle_total_pef_excluding_use_phase_functional_unit: number;
}
export interface FootprintStructure {
  totalProduct: Record<string, IBarGraphObject[]>;
  formulation: IproductEnvironmentalFootprint[] | [];
  packaging: Record<string, Component[]>;
  dials: IDials | null;
  tabs: IFootprintTabStructure;
}

export interface ISustainableTabStructure {
  totalScore: { heading: string; percentage: number };
  pcrContent: ITabInfoSustainable;
  materialEfficiency: ITabInfoSustainable;
  recycleReady: ITabInfoSustainable;
  disruptors: ITabInfoSustainable;
}
export interface IGreenChemistryTabStructure {
  totalScore: ITabInfoSustainable;
  gaiaScore: ITabInfoSustainable;
  watchListScore: ITabInfoSustainable;
  renewableOriginBonus: ITabInfoSustainable;
}

export interface ISustainableStructure {
  pcrContent: {
    dialData: { baseline: string; myproduct: string; per_pcr_diff: string };
    pcrTableData: object;
  };
  materialEfficiency: {
    barData: { baseline: string; myproduct: string };
    detailedData: Component[];
  };
  recycleReady: IRecycleReadyStucture;
  disruptors: { baselineProduct: object; myproduct: object; watchOut: string };
  dials: IDials | null;
  tabs: ISustainableTabStructure;
}
export interface IGreenChemistryStructure {
  renewableOriginBonus: {
    dialData: { baseline: string; myproduct: string; per_pcr_diff: string };
    robTableData: IGreenChemFormulationData[];
    totalPercent:{baselineOrganic:string,baselineRenewable:string,myproductOrganic:string,myproductRenewable:string},
    regression: boolean;
  };
  dials: IDials | null;
  tabs: IGreenChemistryTabStructure;
  watchList:{baselineData:object,myProductData:object,max_watchlist_score_baseline:string | null,max_watchlist_score_myproduct:string | null}
  gaiaScore:{baselineData:object,myProductData:object}
}
export interface GaiaScoreProps {
raw_materials: GaiaScoreMaterialProps[];
step_3_raw_sum_without_water: number;
step_8_fml_GAIA_score: number;
step_16_count_of_raws: number;
step_17_count_of_not_preferred: number;
step_18_count_of_less_preferred: number;
step_19_count_of_most_preferred: number;
}
export interface GaiaScoreMaterialProps {  
compositions: GaiaScoreMaterialCompositionsProps[];
rawMaterialID: string;
raw_material_value: string;
step_1_chemical_sum_without_water: number;
step_4_raw_adjusted_composition_without_water: number;
step_6_GAIA_RAW_score: number;
step_7_GAIA_RAW_in_FML: number;
step_13_deficit_GAIA_RAW_score: number;
step_14_deficit_GAIA_RAW_in_FML: number;
tradeName: string;
}

export interface GaiaScoreMaterialCompositionsProps {  
CONNumber:string
Gaia_Score: string;
USINCIName: string;
con_adjusted_composition_without_water: number;
percentage:string
step_2_con_adjusted_composition_without_water: number;
step_5_gaia_con_score_without_water: { Gaia_Score: number, step_5_gaia_con_score_without_water: number };
step_9_deficit_GAIA_CON_score: number;
step_10_assign_gaia_score_weight: number;
step_11_deficit_GAIA_CON_weighted_score: number;
step_12_deficit_GAIA_CON_score_without_water: number;
}

export interface ResultProviderProps {
  children: ReactNode;
  productId: string;
  assessmentId: string;
  assessmentType: string;
}



export interface IGCMyBaselineProduct {
  raw_material_id: string;
  raw_material_name: string;
  raw_material_value: number;
  compositions?: (CompositionsEntity)[] | null;
  raw_bio_based_origin?: (number)[] | null;
  min_raw_bio_based_origin: number;
  sum_of_organic_chemical_percents_per_raw: number;
  bio_based_orgin_raw_percents: number;
}
export interface CompositionsEntity {
  composition_id: string;
  raw_chemical_percentage: number;
  organic_designation: string;
}

export interface IRenewableFeedbackStock {
  raw_materials?: (RawMaterialsEntity2)[] | null;
  renewable_feedstock_total: number;
}
export interface RawMaterialsEntity2 {
  raw_material_id: string;
  raw_material_name: string;
  raw_material_value: number;
  compositions?: (CompositionsEntity)[] | null;
  raw_bio_based_origin?: (number)[] | null;
  min_raw_bio_based_origin: number;
  sum_of_organic_chemical_percents_per_raw: number;
  bio_based_orgin_raw_percents: number;
}
export interface CompositionsEntity {
  composition_id: string;
  raw_chemical_percentage: number;
  organic_designation: string;
}
