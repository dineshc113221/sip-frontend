import { Component, ComponentDetail } from "../../../structures/packaging";

export interface ISustainableDataObj {
  heading: string;
  value: string;
  baselineProduct?: string;
  myProduct?: string;
}

export interface IGreenChemFormulationData{
  rawMaterialTradeName: string;
  rawCode: string;
  baselineWeight: string;
  baselineOrganic:string;
  baselineRenewable:string;
  myProductWeight: string;
  myProductOrganic:string;
  myProductRenewable:string;
}

export type OrderByType =
  | "componentType"
  | "packagingLayer"
  | "baselineWeight"
  | "baselineRecycleReady"
  | "myProductWeight"
  | "myProductRecycleReady";

export interface IDetailTableData {
  componentType: string;
  packagingLayer: string;
  baselineWeight: string;
  baselineRecycleReady: string;
  myProductWeight: string;
  myProductRecycleReady: string;
}
type TextAlign = "left" | "center" | "right";
type DetailData = keyof Component | keyof ComponentDetail | keyof IGreenChemFormulationData;
export interface IRRSortableTableHeaderProps {
  order: "asc" | "desc";
  orderBy: OrderByType;
  onRequestSort: (property: OrderByType) => void;
  column: {
    id: OrderByType;
    label: React.ReactNode;
    align?: TextAlign;
    colSpan?: number;
    rowSpan?: number;
    width?: string;
    height?: string;
  };
}
export interface SortableTableHeaderProps {
  order: "asc" | "desc";
  orderBy: DetailData;
  
  onRequestSort: (property: DetailData) => void;
  className?: string;
  tab?: string;
  column: {
    id: DetailData;
    label?: React.ReactNode;
    align?: TextAlign;
    colSpan?: number;
    rowSpan?: number;
    width?: string;
    minwidth?: string;
    height?: string;
    justifyContent?:string;
    tooltipMessage?: string;
    padding?: string;

  };
}
