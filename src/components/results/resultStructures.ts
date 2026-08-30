import { ComponentDetail, Component, GaiaComponentDetail } from "../../structures/packaging";
import {
  FootprintStructure,
  IFootprintTabStructure,
  IGreenChemistryStructure,
  IGreenChemistryTabStructure,
  ISustainableStructure,
  ISustainableTabStructure,
} from "../../structures/result";

export interface SortableTableHeaderProps {
  order: "asc" | "desc";
  orderBy: keyof Component | keyof ComponentDetail | keyof GaiaComponentDetail;
  onRequestSort?: (property: keyof Component | keyof ComponentDetail) => void;
  column: {
    id: keyof Component | keyof ComponentDetail | keyof GaiaComponentDetail;
    label: React.ReactNode;
    align?: "left" | "center" | "right";
    colSpan?: number;
    rowSpan?: number;
    width?: string;
    height?: string;
    justifyContent?: string;
    tooltipMessage?: string;
    padding?: string;
  };
}

export interface IBreadcrumbData {
  productID: string ;
  productName: string;
  experimentalID: string;
  experimentalName: string;
}

export interface ITabInfoDisplayComponent {
  key: string;
  comingSoon: boolean;
  value: number;
  index: number;
  currentTab: string;
  data: FootprintStructure | ISustainableStructure | IGreenChemistryStructure | null;
  tabsData: IFootprintTabStructure | ISustainableTabStructure |IGreenChemistryTabStructure | null;
}
