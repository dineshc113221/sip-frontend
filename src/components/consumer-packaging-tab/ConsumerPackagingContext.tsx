import React, { createContext, useContext, ReactNode } from 'react';
import { SelectChangeEvent } from '@mui/material'; // Import the correct type for SelectChangeEvent
import {useConsumerPackaging} from '../consumer-packaging-tab';
import {PackagingComponentData, PackagingDataType, SubComponent } from "../../structures/packaging";

 
type IndexValuePair = { index: string; value: boolean };
// Define the context type
export interface ConsumerPackagingContextType {
  packagingAllData: PackagingDataType;
  packagingSavedData: PackagingDataType;
  primaryData: PackagingComponentData[];
  secondaryData: PackagingComponentData[];
  isSaveEnabled: boolean;
  allFlagsCalculated: boolean;
  productEvacuationValue: string;
  isPrimaryAddEnabled: boolean;
  isSecondaryAddEnabled: boolean;
  isComponentDataChangePrimary:IndexValuePair[];
  isComponentDataChangeSecondary:IndexValuePair[];
  counterPrimary:number;
  counterSecondary:number;
  resetData:boolean;
  isCalculating: boolean;
  primaryRecycleStatus: string;
  secondaryRecycleStatus: string;
  setIsComponentDataChangePrimary:React.Dispatch<React.SetStateAction<IndexValuePair[]>>;
  setPrimaryData: React.Dispatch<React.SetStateAction<PackagingComponentData[]>>;
  setSecondaryData: React.Dispatch<React.SetStateAction<PackagingComponentData[]>>;
  setIsComponentDataChangeSecondary:React.Dispatch<React.SetStateAction<IndexValuePair[]>>;
  setIsSaveEnabled:React.Dispatch<React.SetStateAction<boolean>>;
  handelChangeTableData: (subComponents: SubComponent[], index: number, type: 'Primary' | 'Secondary',isAdd:boolean,isImportData:boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'Primary' | 'Secondary',isAdd:boolean,isImportData:boolean) => void;
  handleChangeSelect: (e: SelectChangeEvent<string>,type: 'Primary' | 'Secondary',isAdd:boolean,isImportData:boolean) => void;
  handelImportPackingData: (data: PackagingComponentData, index: number, type: 'Primary' | 'Secondary',isAdd:boolean) => void;
  handleSavePacking: (isAutoSave: boolean) => void;
  handleSavePackingOnTab: (isAutoSave: boolean) => void;
  handleSaveCalculatePacking: (isAutoSave: boolean) => void;
  handelChangeRecycleStatus: (status: string, index: number,type: 'Primary' | 'Secondary',isImportData:boolean) => void;
  setProductEvacuationValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddPrimary: () => void;
  handleAddSecondary: () => void;
  handleDeleteComponent:(index: number, type: 'Primary' | 'Secondary') => void;
  handleClickCancelContinue:(index: number, type: 'Primary' | 'Secondary') => void;
  handleClickEditCancle:(index: number, type: 'Primary' | 'Secondary',componentData?: PackagingComponentData) => void;
  setPcNmToEmpty:(index: number, type: 'Primary' | 'Secondary') => void;
  isOneTimeSaveDone: boolean;
  setWarningPopUp:React.Dispatch<React.SetStateAction<boolean>>;
  setIsProductEvacuationChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManualOverride:React.Dispatch<React.SetStateAction<boolean>>;
  allCalculated: boolean;
  isCalculationUpdatedPackaging: boolean;
}
 
// Create the context
export const ConsumerPackagingContext = createContext<ConsumerPackagingContextType | undefined>(undefined);
 
// Create the provider component
export const ConsumerPackagingProvider: React.FC<{children: ReactNode }> = ({ children }) => {
  const consumerPackaging = useConsumerPackaging();
 
  return (
<ConsumerPackagingContext.Provider value={consumerPackaging}>
      {children}
</ConsumerPackagingContext.Provider>
  );
};
 
// Create a custom hook for consuming the context
// eslint-disable-next-line react-refresh/only-export-components
export const useConsumerPackagingContext = () => {
  const context = useContext(ConsumerPackagingContext);
  if (!context) {
    throw new Error('useConsumerPackagingContext must be used within a ConsumerPackagingProvider');
  }
  return context;
};
