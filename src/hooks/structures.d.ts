interface IRawMaterialObject {
    rawMaterialId:string,
    tradeName:string,
    percentage:string,
  }
  
  interface IGetUseDoseResponse {
    "_id": string,
    "Product Segment": string,
    "Product Sub-Segment": string,
    "Use Dose / g":string | null,
    "Use Scenario": string | null,
    "Water Use / L": string | null,
    "Starting Temperature / C": string | null,
    "Finishing Temperature / C": string | null,
    "Evaporated Water / %": string | null,
    "Density / g/cm3": string | null
  }