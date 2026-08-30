// Declaring an Enums to work with Dynamic table changes JFUX-433
export enum CURRENT_TAB {
  TOP_LINE_RESULTS = "TOP_LINE_RESULTS",
  PRODUCT_ENVIRONMENTAL_FOOTPRINT = "PRODUCT_ENVIRONMENTAL_FOOTPRINT",
  CARBON_FOOTPRINT = "CARBON_FOOTPRINT",
  GREEN_CHEMISTRY = "GREEN_CHEMISTRY",
  SUSTAINABLE_PACKAGING = "SUSTAINABLE_PACKAGING",
}
export enum CURRENT_SECTION {
  TOTAL_PRODUCT = "TOTAL_PRODUCT",
  FORMULATION = "FORMULATION",
  CONSUMER_PACKAGING = "CONSUMER_PACKAGING",
}

export enum ASSESSMENT_TYPE {
  FINAL_ASSESSMENT = "final",
  BASELINE_ASSESSMENT = "baseline",
  EXPERIMENTAL_ASSESSMENT = "experimental",
}

export enum SUSTAINABLE_SECTIONS {
  TOTAL_SCORE = "Total Score",
  PCR_CONTENT = "PCR Content",
  MATERIAL_EFFICIENCY = "Material Efficiency",
  RECYCLE_READY = "Recycle Ready",
  RECYCLABILITY_DISRUPTORS = "Recyclability Disruptors",
}

export enum GREEN_CHEMISTRY_SECTIONS {
  TOTAL_SCORE = "Total Score",
  GAIA_SCORE = "GAIA Score",
  WATCH_LIST_SCORE = "Watch List Score",
  RENEWABLE_ORIGIN_BONUS = "Renewable Origin Bonus",
}

export const GaiaTableHeader = ["rawMaterialTradeName", "rawCode","constituent"]

export const TIMEOUT_LIST = {
  inActivityTime: 1680000,
  deadlineTime: 1680000
};

export const LABELS = {
  BODY_MSG: "Your session is about to expire due to inactivity. Please click on Continue to extend the session.",
  TIME_LEFT_MSG: "Time left:",
  LOGOUT: "Logout",
  CONTINUE: "Continue",
};