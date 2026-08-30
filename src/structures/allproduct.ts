import { ExperimentalDataItem } from "../components/breadcrumb/types";

export interface AllProductDetails {
    product : ExperimentalDataItem[];
    refetch: () => void;
    selectedValue?: string
  }

  
export interface Product {
    projectId: string;
    brandName: string;
    productName: string;
    description: string;
    projectName: string;
    _id: string;
  }
  
export interface CardProduct {
    projectId: string;
    brandName: string;
    productName: string;
    description: string;
    projectName: string;
    _id: string;
    users?: (UsersEntity)[] | null;
  }
  
export interface UsersEntity {
    name: string;
    role: string;
    mail: string;
  }
  