import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormulationDataType } from "../../structures/formulation";
import { useGlobaldata } from "../masterData/DataContext";
import {
  ApiEndPoints,
  ApiEndPointsURL,
} from "../../constants/ApiEndPoints.constant";
import axios from "axios";

interface IFormulationdata extends FormulationDataType {
  rawMaterialsPercentage: number;
}

export interface IFormulationFormData {
  productId: string;
  type: string;
  assessmentId: string;
  formulation: IFormulationdata;
  isCalculating: boolean;
  isBaselineCalcUpdated?: boolean;
}

interface IAutoSaveContext {
  tabSwitched: boolean;
  setTabSwitched: (value: boolean) => void;
  setFormulationFormData: (value: IFormulationFormData) => void;
  formulationFormData: IFormulationFormData;
  setChangedFields: (value: string[]) => void;
  autoSaveSuccess: boolean;
  setAutoSaveSuccess: (value: boolean) => void;
  taboutAutoSaveInProgress: boolean;
  changedFields: string[];
  refetchDetails: boolean;
  setRefetchDetails: (value: boolean) => void;
  calculateClick: boolean;
  setCalculateClick: (value: boolean) => void;
  calculateClickPackaging: boolean;
  setCalculateClickPackaging: (value: boolean) => void;
  pathNavigation: null | string;
  setPathNavigation: (path: null | string) => void;
  hasUncalculatedChanges: boolean;
  setHasUncalculatedChanges: (value: boolean) => void;
  showNavigationWarning: boolean;
  setShowNavigationWarning: (value: boolean) => void;
  isOwnerUser: boolean;
  setIsOwnerUser: (value: boolean) => void;
  isDataCompleted: boolean;
  setIsDataCompleted: (value: boolean) => void;
  isAllFlagsCalc: boolean;
  setIsAllFlagsCalc: (value: boolean) => void;
  isDialsSidebarError: boolean;
  setIsDialsSidebarError: (value: boolean) => void;

}

interface IAutoSaveProvider {
  children: ReactNode;
}

const initialRawMaterialData = [
  {
    tradeName: "",
    rawMaterialId: "",
    percentage: "",
    status: "",
    rmcStatus: "",
    EUINCIName: "",
    USINCIName: "",
    specNumber: "",
    cas: "",
    envFootprint: 0,
    carbonFootprint: 0,
    greenChemistry: 0,
  },
];

const initialErrorsData = {
  description: false,
  netContent: false,
  netContentUnit: false,
  productionZone: false,
  salesZone: false,
  productSegment: false,
  productSubSegment: false,
  useDose: false,
  useDoseUnit: false,
  rawMaterials: false,
  consumablesUsed: false,
  useScenario:false,
};

const AutoSaveContext = createContext<IAutoSaveContext>({
  tabSwitched: false,
  setTabSwitched: () => { },
  setChangedFields: () => { },
  formulationFormData: {
    productId: "",
    type: "",
    assessmentId: "",
    isCalculating: false,
    formulation: {
      fmlCode: "",
      description: "",
      netContent: "",
      netContentUnit: "",
      productionZone: "",
      salesZone: "",
      productSegment: "",
      productSubSegment: "",
      useDose: "",
      useDoseUnit: "",
      consumablesUsed: "",
      rawMaterials: initialRawMaterialData,
      isEdited: false,
      isDataValid:false,
      isCalculated: false,
      fieldsExist: initialErrorsData,
      rawMaterialsPercentage: 0,
      useScenario: "",
    },
  },
  setFormulationFormData: () => { },
  autoSaveSuccess: false,
  setAutoSaveSuccess: () => { },
  taboutAutoSaveInProgress: false,
  changedFields: [],
  refetchDetails: false,
  setRefetchDetails: () => { },
  calculateClick: false,
  setCalculateClick: () => { },
  calculateClickPackaging: false,
  setCalculateClickPackaging: () => { },
  pathNavigation: null,
  setPathNavigation: () => { },
  hasUncalculatedChanges: false,
  setHasUncalculatedChanges: () => {},
  showNavigationWarning: false,
  setShowNavigationWarning: () => { },
  isOwnerUser: false,
  setIsOwnerUser: () => {},
  isDataCompleted: false,
  setIsDataCompleted: () => { },
  isAllFlagsCalc: false,
  setIsAllFlagsCalc: () => {},
 isDialsSidebarError: false,
  setIsDialsSidebarError: () => {},
 
  
});

const AutoSaveStateProvider: React.FC<IAutoSaveProvider> = ({ children }) => {
  const { token } = useGlobaldata();
  const [tabSwitched, setTabSwitched] = useState<boolean>(false);
  const [formulationFormData, setFormulationFormData] =
    useState<IFormulationFormData | null>(null);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [taboutAutoSaveInProgress, setTaboutAutoSaveInProgress] =
    useState<boolean>(false);
  const [refetchDetails, setRefetchDetails] = useState<boolean>(false);
  const [autoSaveSuccess, setAutoSaveSuccess] = useState<boolean>(false);
  const [calculateClick, setCalculateClick] = useState<boolean>(false);
  const [calculateClickPackaging, setCalculateClickPackaging] = useState<boolean>(false);
  const [pathNavigation, setPathNavigation] = useState<string | null>(null);
  const [hasUncalculatedChanges, setHasUncalculatedChanges] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [isDataCompleted, setIsDataCompleted] = useState(false);
  const [isOwnerUser, setIsOwnerUser] = useState(false);
  const [isAllFlagsCalc, setIsAllFlagsCalc] = useState(false);
  const [isDialsSidebarError, setIsDialsSidebarError] = useState(false);

 
  const formulationAutoSaveCall = useCallback(async () => {
    setTaboutAutoSaveInProgress(true);
    setChangedFields([]);
    const response = await axios.post(
      `${ApiEndPointsURL}${ApiEndPoints.add_update_formulation}`,
      formulationFormData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      setAutoSaveSuccess(true);
      setRefetchDetails(true);
      setTaboutAutoSaveInProgress(false);
    }
  }, [formulationFormData, token]);

  useEffect(() => {
    if (tabSwitched) {
      if (changedFields.length > 0) {
        formulationAutoSaveCall();
        setTabSwitched(false);
      }
    }
  }, [changedFields, tabSwitched, formulationAutoSaveCall]);
  
  const value = useMemo(
    () => ({
      tabSwitched,
      setTabSwitched,
      formulationFormData,
      setFormulationFormData,
      setChangedFields,
      autoSaveSuccess,
      setAutoSaveSuccess,
      taboutAutoSaveInProgress,
      changedFields,
      refetchDetails,
      setRefetchDetails,
    
      calculateClick,
      setCalculateClick,
      calculateClickPackaging,
      setCalculateClickPackaging,
      pathNavigation,
      setPathNavigation,
      hasUncalculatedChanges,
      setHasUncalculatedChanges,
      showNavigationWarning,
      setShowNavigationWarning,
      isOwnerUser,
      setIsOwnerUser,
      isDataCompleted,
      setIsDataCompleted,
      isAllFlagsCalc,
      setIsAllFlagsCalc,
      isDialsSidebarError,
      setIsDialsSidebarError,
     
    }),
    [
      tabSwitched,
      setTabSwitched,
      formulationFormData,
      setFormulationFormData,
      setChangedFields,
      autoSaveSuccess,
      setAutoSaveSuccess,
      taboutAutoSaveInProgress,
      changedFields,
      refetchDetails,
      setRefetchDetails,
      calculateClick,
      setCalculateClick,
      calculateClickPackaging,
      setCalculateClickPackaging,
      pathNavigation,
      setPathNavigation,
      hasUncalculatedChanges,
      setHasUncalculatedChanges,
      showNavigationWarning,
      setShowNavigationWarning,
      isOwnerUser, 
      setIsOwnerUser,
      isDataCompleted,
      setIsDataCompleted,
      isAllFlagsCalc,
      setIsAllFlagsCalc,
      isDialsSidebarError,
      setIsDialsSidebarError,
      
    ]
  );

  return (
    <AutoSaveContext.Provider value={value}>
      {children}
    </AutoSaveContext.Provider>
  );
};

export { AutoSaveContext, AutoSaveStateProvider };
