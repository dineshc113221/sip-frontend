import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useGetProductAssessmentDetailByID, useGetBaselineTableResults  } from "../../hooks/UseGetProductDetails";
import { FormulationDataType } from "../../structures/formulation";
import {
  PackagingComponentData,
  PackagingDataType,
  PackagingLevelData,
  SubComponent,
} from "../../structures/packaging";


export interface ProductDataProps {
  brandName: string;
  productId: string;
  productName: string;
  productSipId: string;
  user?: Array<UserDataType>;
  details?: AssessmentDataType;
}
export interface ProductContextProp {
  productData: ProductDataType;
  usersData: UserDataType[] | null;
  refetch: () => void;
  assessmentsData: AssessmentDataType;
  setAssessmentsData: (data: AssessmentDataType) => void;
  formulation: FormulationDataType | null;
  primaryPackaging: PackagingLevelData | null;
  secondaryPackaging: PackagingLevelData | null;
  assessmentsType?: string | null;
  packagingData: PackagingDataType | null;
  fetchingDataInProgress: boolean;
  isBaselinePresent: boolean;
  isBaselineDataComplete: boolean;
  isBaselineSkipped:boolean;
  setNewChangesInFormulation: (value: FormulationDataType) => void;
  newChangesInFormulation: FormulationDataType | null;
  setFormulationDataComplete: (value: boolean) => void;
  formulationDataComplete: boolean;
  setPackagingDataComplete: (value: boolean) => void;
  packagingDataComplete: boolean;
  bothDataComplete: boolean;
  singleClickHit: boolean;
  setSingleClickHit: (value: boolean) => void;
  bothPackFormulaStatus: boolean;
  setBothPackFormulaStatus: (value: boolean) => void;
  isPackagingDirty: boolean;
  setIsPackagingDirty: (value: boolean) => void;
  setValidateCheck: (value: boolean) => void;
  validateCheck: boolean;
  setValidateCheckEvacuation: (value: boolean) => void;
  validateCheckEvacuation: boolean;
  setValidateCheckFinal: (value: boolean) => void;
  validateCheckFinal: boolean;
  setValidateCheckFormulation: (value: boolean) => void;
  validateCheckFormulation: boolean;
  setValidateCheckPackaging: (value: boolean) => void;
  validateCheckPackaging: boolean;

}

interface ProductProviderProps {
  children: ReactNode;
  assessmentId: string;
  assessmentType: string;
  productId: string;
}

// Create the context
export const ProductDataContext = createContext<ProductContextProp>({
  productData: {
    productId: "",
    productName: "",
    brandName: "",
    productSipId: "",
  },
  usersData: null,
  refetch: () => {},
  assessmentsData: {
    assessmentId: "",
    name: "",
    _id: "",
  },
  setAssessmentsData: () => {},
  formulation: null,
  primaryPackaging: null,
  secondaryPackaging: null,
  assessmentsType: null,
  packagingData: null,
  fetchingDataInProgress: false,
  isBaselinePresent: false,
  isBaselineSkipped:false,
  isBaselineDataComplete: false,
  setNewChangesInFormulation: () => { },
  newChangesInFormulation: null,
  setFormulationDataComplete: () => { },
  formulationDataComplete: false,
  setPackagingDataComplete: () => { },
  packagingDataComplete: false,
  bothDataComplete: false,
  singleClickHit: false,
  setSingleClickHit: () => { },
  bothPackFormulaStatus: false,
  setBothPackFormulaStatus: () => { },
  isPackagingDirty: false,
  setIsPackagingDirty: () => { },
  setValidateCheck:()=>{},
  validateCheck:false,
  setValidateCheckEvacuation:()=>{},
  validateCheckEvacuation:false,
  setValidateCheckFinal:()=>{},
  validateCheckFinal: false,
  setValidateCheckFormulation: ()=>{},
  validateCheckFormulation: false,
  setValidateCheckPackaging: ()=>{},
  validateCheckPackaging:false,
});
// Initial values
export interface AssessmentDataType {
  assessmentId: string;
  name: string;
  _id: string;
  isFormulationDataCompleted?: boolean;
  isPackagingDataCompleted?: boolean;
  isFormulationCalculated?: boolean;
  isPackagingCalculated?: boolean;
  isCalculatedButtonClicked?: boolean;
  isFormulationEOLCalculated?: boolean;
  isGreenChemistryCalculated?: boolean;
  isGreenChemistryRollupCalculated?: boolean;
  isLCACalculated?: boolean;
  isSpiceCalculated?: boolean;
  isSustainabilityPackagingCalculated?: boolean;
  isSustainabilityPackagingRollupCalculated?: boolean;
  isBaselineSkipped?:boolean;
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
  packaging_level?: PackagingLevelData[] | null;
  formulation?: FormulationDataType | null;
  isBaselineCalcUpdated?: boolean;
}

interface ProductDataType {
  productId: string;
  productName: string;
  brandName: string;
  productSipId: string;
}

interface UserDataType {
  name: string;
  role: string;
  mail: string;
}

// Create a provider component

export const ProductDataProvider: React.FC<ProductProviderProps> = ({
  children,
  assessmentType,
  assessmentId,
  productId
}) => {
  const [formulation, setFormulation] = useState<FormulationDataType | null>(
    null
  );
  const [packagingData, setPackagingData] = useState<PackagingDataType | null>(
    null
  );
  const [primaryPackaging, setPrimaryPackaging] =
    useState<PackagingLevelData | null>(null);
  const [secondaryPackaging, setSecondaryPackaging] =
    useState<PackagingLevelData | null>(null);
  const [productData, setProductData] = useState<ProductDataType>({
    productId: "",
    productName: "",
    brandName: "",
    productSipId: "",
  });
  const [varIsBaselinePresent, setVarIsBaselinePresent] =
    useState<boolean>(false);
    const [varIsBaselineDataComplete, setVarIsBaselineDataComplete] =
    useState<boolean>(false);
      const [varIsBaselineSkipped, setVarIsBaselineSkipped] =
    useState<boolean>(false);
  const [usersData, setUsersData] = useState<UserDataType[]>([]);
  const [assessmentsData, setAssessmentsData] = useState<AssessmentDataType>({
    assessmentId: "",
    name: "",
    _id: "",
  });

  const [newChangesInFormulation, setNewChangesInFormulation] = useState<FormulationDataType | null>(
    null
  );
    const [singleClickHit, setSingleClickHit] = useState<boolean>(false);
  
  const [formulationDataComplete,setFormulationDataComplete]=useState(false);
  const [packagingDataComplete,setPackagingDataComplete]=useState(false);
  const [bothDataComplete, setBothDataComplete] = useState(false);
  const {
    data,
    refetch,
    isLoading: fetchingDataInProgress,
  } = useGetProductAssessmentDetailByID(assessmentId, assessmentType);
  const { data: resultData } = useGetBaselineTableResults(productId, assessmentId, assessmentType);
  useEffect(() => {
    setBothDataComplete(formulationDataComplete && packagingDataComplete)
  }, [formulationDataComplete, packagingDataComplete, assessmentsData, bothDataComplete])
  const [bothPackFormulaStatus, setBothPackFormulaStatus] = useState(false);
  const [isPackagingDirty, setIsPackagingDirty] = useState<boolean>(false);
   const [validateCheck,setValidateCheck]=useState<boolean>(false);
  const [validateCheckEvacuation, setValidateCheckEvacuation]=useState<boolean>(false);
  const [validateCheckFinal, setValidateCheckFinal]=useState<boolean>(false);
  const [validateCheckFormulation, setValidateCheckFormulation]=useState<boolean>(false);
  const [validateCheckPackaging, setValidateCheckPackaging] = useState<boolean>(false);
  function updateSubComponentMaterials(
    component,
  subComponents: SubComponent[],
  resultsMap: Map<string, string>,
  pefMap: Map<string, number>,
  cfMap: Map<string, number>
) {
  return subComponents?.map((subComponent) => {
    const updatedMaterial = subComponent?.material?.map((material) => {
      const key = `${component._id}-${material._id}`;
      return {
        ...material,
        virginPlasticValue: resultsMap.get(key) ?? material.virginPlasticValue,
        productEnvironmentalFootPrint: pefMap.has(key) ? String(pefMap.get(key)) : material.productEnvironmentalFootPrint,
        carbonFootPrint: cfMap.has(key) ? String(cfMap.get(key)) : material.carbonFootPrint,
      };
    });
    return { ...subComponent, material: updatedMaterial };
  }) ?? [];
}

function updateComponents(
  components: PackagingComponentData[],
  resultsMap: Map<string, string>,
  pefMap: Map<string, number>,
  cfMap: Map<string, number>,
  compTotalsMap?: Map<string, { totalpef: number; totalpcf: number }>
) {
  return (
    components?.map((component) => ({
      ...component,
      totalpef: compTotalsMap?.get(String(component._id))?.totalpef ?? component.totalpef,
      totalpcf: compTotalsMap?.get(String(component._id))?.totalpcf ?? component.totalpcf,
      sub_components: updateSubComponentMaterials(component, component?.sub_components ?? [], resultsMap, pefMap, cfMap),
    })) ?? []
  );
}
  const updatePackagingStates = useCallback((packagingLevels: PackagingLevelData[]) => {
    if (!packagingLevels) {
      setPrimaryPackaging(null);
      setSecondaryPackaging(null);
      return;
    }

    const resultsMap = new Map();
function processMaterial(
  component,
  material: { _id: string; virgin_non_pcr_amount: string | number },
  rMap: Map<string, string | number>
) {
  rMap.set(`${component}-${material._id}`, material.virgin_non_pcr_amount);
}

    function processSubComponent(
      sub,
  component,
  rMap: Map<string, string | number>
) {
  sub?.material?.forEach((mat) => processMaterial(component, mat, rMap));
}

function processComponent(
  component,
  rMap: Map<string, string | number>
) {
  component?.sub_components?.forEach((sub) => processSubComponent(sub,component.main_id,rMap));
}

// Main loop
resultData?.[assessmentType]?.["sustainablepackaging-pcr"]?.components?.forEach(
  (component) => processComponent(component, resultsMap)
);

    // Build PEF and CF maps by index-by-index matching between input and results packaging levels
    const pefMap = new Map<string, number>();
    const cfMap = new Map<string, number>();

    const packProd = resultData?.[assessmentType]?.['packproduction'];
    const packEol = resultData?.[assessmentType]?.['packagingeol'];

    // Prepare component totals map and build per-material maps in one pass
    const compTotalsMap = new Map<string, { totalpef: number; totalpcf: number }>();

    function processComponentMaterials(inputComp, prodComp, eolComp) {
      const inputSubs = inputComp?.sub_components || [];
      for (let subIdx = 0; subIdx < inputSubs.length; subIdx++) {
        const inputSub = inputSubs[subIdx];
        const prodSub = prodComp?.sub_components?.[subIdx];
        const eolSub = eolComp?.sub_components?.[subIdx];

        const inputMats = inputSub?.material || [];
        for (let matIdx = 0; matIdx < inputMats.length; matIdx++) {
          const inputMat = inputMats[matIdx];
          const prodMat = prodSub?.material?.[matIdx];
          const eolMat = eolSub?.material?.[matIdx];

          // Skip uncalculated materials (no result data exists yet)
          if (!prodMat && !eolMat) continue;

          const key = `${inputComp._id}-${inputMat._id}`;

          const pefProd = parseFloat(prodMat?.step_51_pack_prod_pef_score_functional_unit ?? 0);
          const pefEol = parseFloat(eolMat?.step_64_Pack_EOL_PEF_score_functional_unit ?? 0);
          pefMap.set(key, parseFloat(((pefProd + pefEol) * 1000000).toFixed(6)));

          const cfProd = parseFloat(prodMat?.step_48_pack_prod_pack_impact?.climate_change_functional_unit ?? 0);
          const cfEol = parseFloat(eolMat?.step_60_Pack_EOL_Pack_Impact?.climate_change_functional_unit ?? 0);
          cfMap.set(key, parseFloat(((cfProd + cfEol) * 1000).toFixed(6)));
        }
      }
    }

    function processLevelComponents(inputLevel, prodLevel, eolLevel) {
      const inputComponents = inputLevel?.components || [];
      for (let compIdx = 0; compIdx < inputComponents.length; compIdx++) {
        const inputComp = inputComponents[compIdx];
        const prodComp = prodLevel?.components?.[compIdx];
        const eolComp = eolLevel?.components?.[compIdx];

        // Compute component-level totals from result steps (packproduction + packagingeol)
        const step58 = parseFloat(prodComp?.step_58_pack_prod_pef_score_component_functional_unit ?? 0) || 0;
        const step65 = parseFloat(eolComp?.step_65_Pack_EOL_PEF_score_Component_functional_unit ?? 0) || 0;
        const compPEF = (step58 + step65) * 1000000;

        const step57 = parseFloat(prodComp?.step_57_pack_prod_pack_impact_component?.climate_change_functional_unit ?? 0) || 0;
        const step61 = parseFloat(eolComp?.step_61_Pack_EOL_Pack_Impact_component?.climate_change_functional_unit ?? 0) || 0;
        const compPCF = (step57 + step61) * 1000;

        compTotalsMap.set(String(inputComp._id), {
          totalpef: Number(compPEF.toFixed(6)),
          totalpcf: Number(compPCF.toFixed(6)),
        });

        processComponentMaterials(inputComp, prodComp, eolComp);
      }
    }

    for (let levelIdx = 0; levelIdx < packagingLevels.length; levelIdx++) {
      const inputLevel = packagingLevels[levelIdx];
      const prodLevel = packProd?.packaging_level?.[levelIdx];
      const eolLevel = packEol?.packaging_level?.[levelIdx];
      processLevelComponents(inputLevel, prodLevel, eolLevel);
    }

    

    const primaryLevel =
      packagingLevels.find((level) => level.packaging_level === "Primary") ||
      null;
    const secondaryLevel =
      packagingLevels.find((level) => level.packaging_level === "Secondary") ||
      null;

    const updatedPrimary = primaryLevel
      ? {
          ...primaryLevel,
          components: updateComponents(
            primaryLevel?.components ?? [],
            resultsMap,
            pefMap,
            cfMap,
            compTotalsMap
          ),
        }
      : null;

    const updatedSecondary = secondaryLevel
      ? {
          ...secondaryLevel,
          components: updateComponents(
            secondaryLevel?.components ?? [],
            resultsMap,
            pefMap,
            cfMap,
            compTotalsMap
          ),
        }
      : null;

    setPrimaryPackaging(updatedPrimary);
    setSecondaryPackaging(updatedSecondary);
  }, [resultData,assessmentType]);

  const findProductData = useCallback(
    (product: ProductDataProps) => {
      setProductData({
        productId: product.productId,
        productName: product.productName,
        brandName: product.brandName,
        productSipId: product.productSipId,
      });
      product.user && setUsersData(product.user);
    },
    []
  );

  const findAssessmentById = useCallback(
    (details: AssessmentDataType) => {
      if (details) {
        setAssessmentsData(details);
        const formulation = details.formulation ? details.formulation : null; // added this modification to auto fill exsisting data in baseline and final asssessments as response from server is little different JFUX-449
        setFormulation(formulation);
        if (details.packaging_level) {
          setPackagingData({ packaging_level: details.packaging_level });
          updatePackagingStates(details.packaging_level);
        }
      }
      // If not found
      return null;
    },
    [updatePackagingStates]
  );
useEffect(() => {
    setValidateCheckFinal(validateCheckFormulation || validateCheckEvacuation || validateCheckPackaging);
 
  }, [validateCheckFormulation, validateCheckEvacuation, validateCheckFinal, validateCheckPackaging]);

  useEffect(() => {
    if (data) {
      const product = data[0];
      findProductData(product);
      if (assessmentId) {
        findAssessmentById(product.details);
        setVarIsBaselinePresent(product.isBaselinePresent);
        setVarIsBaselineDataComplete(product.isBaselineDataComplete);
        setVarIsBaselineSkipped(product.isBaselineSkipped)  
      }
    }
  }, [data, assessmentId,findAssessmentById,findProductData]);

  useEffect(() => {
    refetch();
  }, [assessmentId,refetch]);

  const value = useMemo(() => {
    return {
      productData,
      usersData,
      refetch,
      assessmentsData,
      setAssessmentsData,
      formulation,
      primaryPackaging,
      secondaryPackaging,
      assessmentsType: assessmentType,
      packagingData,
      fetchingDataInProgress,
      isBaselinePresent: varIsBaselinePresent ?? false,
      isBaselineDataComplete: varIsBaselineDataComplete ?? false,
      isBaselineSkipped:varIsBaselineSkipped ?? false,
      newChangesInFormulation,
      setNewChangesInFormulation,
      setFormulationDataComplete,
      formulationDataComplete,
      setPackagingDataComplete,
      packagingDataComplete,
      bothDataComplete,
      singleClickHit,
      setSingleClickHit,
      bothPackFormulaStatus,
      setBothPackFormulaStatus,
      isPackagingDirty,
      setIsPackagingDirty,
      setValidateCheck,
      validateCheck,
      setValidateCheckEvacuation,
      validateCheckEvacuation,
      setValidateCheckFinal,
      validateCheckFinal,
      setValidateCheckFormulation,
      validateCheckFormulation,
      setValidateCheckPackaging,
      validateCheckPackaging,
    };
  }, [
    productData,
    usersData,
    refetch,
    assessmentsData,
    formulation,
    primaryPackaging,
    secondaryPackaging,
    assessmentType,
    packagingData,
    fetchingDataInProgress,
    varIsBaselinePresent,
    varIsBaselineDataComplete,
    varIsBaselineSkipped,
    newChangesInFormulation,
    setNewChangesInFormulation,
    setAssessmentsData,
    setFormulationDataComplete,
    formulationDataComplete,
    setPackagingDataComplete,
    packagingDataComplete,
    bothDataComplete,
    singleClickHit,
    setSingleClickHit,
    bothPackFormulaStatus,
      setBothPackFormulaStatus,
      isPackagingDirty,
      setIsPackagingDirty,
      setValidateCheck,
      validateCheck,
      setValidateCheckEvacuation,
      validateCheckEvacuation,
      setValidateCheckFinal,
      validateCheckFinal,
      setValidateCheckFormulation,
      validateCheckFormulation,
      setValidateCheckPackaging,
      validateCheckPackaging,
  ]);

  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};
