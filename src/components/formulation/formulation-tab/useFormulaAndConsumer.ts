/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext, useCallback, FormEvent, useMemo } from "react";
import { useGlobaldata } from "../../../contexts/masterData/DataContext";
import {
  RawMaterialsData,
  FormulationDataType,
  ErrorsType,
} from "../../../structures/formulation";
import { AssessmentDataType, ProductDataContext } from "../../../contexts/productData/ProductDataContext";
import { toast } from "react-toastify";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../../constants/ApiEndPoints.constant";
import axios from "axios";
import { ASSESSMENT_TYPE } from "../../../constants/String.constants";
import { useGetProductDetailByID, useGetUseDoseValue } from "../../../hooks/UseGetProductDetails";
import { SelectChangeEvent } from "@mui/material/Select";
import { ResultDataContext } from "../../../contexts/resultData/ResultDataContext";
import {
  AutoSaveContext,
  // IFormulationFormData
} from "../../../contexts/autoSaveContext/AutoSaveContext";
const initialRawData: RawMaterialsData[] = [];

const useFormulaAndConsumer = () => {
  const {
    formulation,
    refetch,
    productData,
    assessmentsData,
    setAssessmentsData,
    assessmentsType, setNewChangesInFormulation,setFormulationDataComplete,singleClickHit,validateCheck
  } = useContext(ProductDataContext);
  const { data: pData } = useGetProductDetailByID(productData?.productId);
  const [isBaseLineNewlyAdded, setIsBaseLineNewlyAdded] = useState(false);
 
  useEffect(()=>{
    if(pData?.length && assessmentsType=='baseline'){
     const assessmentData = pData[0]?.assessments;
     const expAssessmentCalculated =  assessmentData?.experimental?.find((e: any)=> 'isCalculatedButtonClicked' in e) || {};
     // eslint-disable-next-line no-unsafe-optional-chaining
     const finalAssessmentCalculated = assessmentData?.final && 'isCalculatedButtonClicked' in assessmentData?.final || {};
     setIsBaseLineNewlyAdded(Object.keys(expAssessmentCalculated).length > 0 || Object.keys(finalAssessmentCalculated).length > 0)
    }
  }, [pData])

  const { resultDataRefetch, refetchResultBaseline} =
    useContext(ResultDataContext);
  const {
    setChangedFields,
    setFormulationFormData,
    autoSaveSuccess,
    setAutoSaveSuccess, setCalculateClick, setIsAllFlagsCalc,
  } = useContext(AutoSaveContext);
  const { formulationData: formulationMasterData, token } = useGlobaldata();
  const [initialFormulationData, setInitialFormulationData] = useState({
    fmlCode: "",
    description: "",
    netContent: "",
    netContentUnit: "g",
    productionZone: "",
    salesZone: "",
    productSegment: "",
    productSubSegment: "",
    useDose: "",
    useDoseUnit: "g",
    consumablesUsed: "0",
    rawMaterials: initialRawData,
    isCalculated: false,
    useScenario:"",
    fieldsExist: {
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
    },
  });
  const [formulationData, setFormulationData] = useState<FormulationDataType>(
    initialFormulationData
  );
  const [formulationFinalData, setFormulationFinalData] =
    useState<FormulationDataType>(initialFormulationData);
  const [mode, setMode] = useState<string>("");
  const [isWarningEditDialog, setIsWarningEditDialog] =
    useState<boolean>(false);
  const [isEditDialog, setIsEditDialog] = useState<boolean>(false);
  const [showWariningMsg, setShowWariningMsg] = useState(false);
  const [isCancelEnable, setIsCancelEnable] = useState(false); // setting it true as inially in add mode cancel to be enabled
  const [isSaveEnable, setIsSaveEnable] = useState<boolean>(singleClickHit);
  const [counter, setCounter] = useState<number>(0);
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [subSegments, setSubSegments] = useState<string[] | null | undefined>([
    "",
  ]);
  const dialogKey = 0;
  const [importFormulaDialogOpen, setImportFormulaDialogOpen] =
    useState<boolean>(false);
  const [isImportFormula, setIsImportFormula] = useState(false);
  const isExperimental =
    assessmentsType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT; // true if assessment is Experimental
  const [initialFormValidation, setInitialFormValidation] =
    useState<boolean>(false); // true means form has all mandate values
  const [isClear, setIsClear] = useState(false);
  const [errors, setErrors] = useState<ErrorsType>({
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
  });
  const [disabled, setDisabled] = useState<ErrorsType>({
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
  });
  const [dataEdited, setDataEdited] = useState<boolean>(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [editedMembers, setEditedMembers] = useState<string[]>([]);
  const [isTableEdited, setIsTableEdited] = useState(false);
  const [showImportFormula, setShowImportFormula] = useState(true);
  const [subSegment, setSubSegment] = useState<string>(
    formulationData?.productSubSegment ?? ""
  );

  const isValueValid = (value: null | undefined | string) =>
    value !== null && value !== undefined && value !== "";

  const { mutate: refetchUseDose, data: useDoseData } = useGetUseDoseValue(
    selectedSegment,
    subSegment
  );

  const [useDose, setUseDose] = useState<string>("");
  const [importedFormulationData, setImportedFormulationData] =
    useState<FormulationDataType>();
  const [responseDone, setResponseDone] = useState<boolean>(false);

  // useDose related
  useEffect(() => {
    if (useDoseData) {
      const useDose = useDoseData["Use Dose / g"];
      if (useDose === null) {
        setUseDose("");
        return setErrors((prevErrors) => ({ ...prevErrors, useDose: true }));
      }
      setUseDose(useDose);
      setFormulationData((prevValues) => ({ ...prevValues, useDose: useDose }));
      setErrors((prevErrors) => ({ ...prevErrors, useDose: false }));
    }
  }, [useDoseData]);
  useEffect(() => {
    if (subSegment && selectedSegment) {
      if (
        selectedSegment !== formulationFinalData?.productSegment ||
        subSegment !== formulationFinalData?.productSubSegment
      ) {
        refetchUseDose();
      }
    }
    if (
      (selectedSegment === formulationFinalData?.productSegment ||
        subSegment === formulationFinalData?.productSubSegment) &&
      formulationFinalData?.useDose !== "" &&
      !isImportFormula
    ) {
      setUseDose(formulationFinalData.useDose);
    }
  }, [
    subSegment,
    selectedSegment,
    refetchUseDose,
    formulationFinalData.useDose,
    formulationFinalData?.productSegment,
    formulationFinalData?.productSubSegment,
    isImportFormula,
  ]);
  const preciseSum = (values: number[], precision: number = 6): number => {
  const total = values.reduce((a, b) => a + b, 0);
  return Number(total.toFixed(precision));
};

// Usage:
const getTotalWeight = useCallback(() => {
  const percentages = formulationData?.rawMaterials
    .map(r => Number(r?.material_PCT?? r?.percentage))
    .filter(v => !isNaN(v));
  return preciseSum(percentages, 6).toFixed(2);
}, [formulationData]);

    const allFlagsCalculated = useMemo(() => {
      if (!assessmentsData) return false;
      const requiredFlags = [
        assessmentsData.isCalculatedButtonClicked,
        assessmentsData.isFormulationCalculated,
        assessmentsData.isFormulationEOLCalculated,
        assessmentsData.isGreenChemistryCalculated,
        assessmentsData.isGreenChemistryRollupCalculated,
        assessmentsData.isLCACalculated,
        assessmentsData.isPackagingCalculated,
        assessmentsData.isSpiceCalculated,
        assessmentsData.isSustainabilityPackagingCalculated,
        assessmentsData.isSustainabilityPackagingRollupCalculated,
      ];
      return requiredFlags.every(flag => flag === true);
    }, [assessmentsData]);
  useEffect(() => {
    setIsAllFlagsCalc(allFlagsCalculated)
  }, [allFlagsCalculated, setIsAllFlagsCalc]);
  useEffect(() => {
    const mandateFields = [
      "netContent",
      "productionZone",
      "salesZone",
      "productSegment",
      "productSubSegment",
      "useDose",
      "useScenario"
    ];
    let val = true;
    if (formulationData) {
      const fields = Object.keys(formulationData) as Array<
        keyof FormulationDataType
      >;
      
      fields.forEach((key) => {        
        if (
          mandateFields?.includes(key) &&
          (formulationData[key] === "" ||
            formulationData[key] === null ||
            formulationData[key] === undefined)
        ) {
          val = false;
        }
      });
    }
    setInitialFormValidation(val);    

    setFormulationDataComplete(val && Number(getTotalWeight())===100)
  }, [formulationData, isImportFormula, formulationFinalData,getTotalWeight]);
  


  const getErrorsObject = () => {
    const errorFields = Object.keys(errors) as Array<keyof ErrorsType>;
    const errorObject: ErrorsType = { ...errors };
    errorFields.forEach((key) => {
      const typedKey = key as keyof FormulationDataType;
      const value = formulationData[typedKey];
      const errorValidation =
        key === "description"
          ? false
          : !isValueValid(value as null | undefined | string);
      errorObject[key] = errorValidation;
    });
    return errorObject;
  };
  

  const getDisabledObject = useCallback(() => {
    if (disabled) {
      const disabledFields = Object.keys(disabled) as Array<keyof ErrorsType>;
      const disabledObject: ErrorsType = { ...disabled };
      if (isExperimental && isImportFormula) {
        disabledFields.forEach((key) => {
          const disabledValidation = false;
          disabledObject[key] = disabledValidation;
        });
        return disabledObject;
      } else {
        return formulation?.fieldsExist;
      }
    }
  }, [disabled, isExperimental, isImportFormula, formulation?.fieldsExist]);

  const getModifiedValue = (value: string | undefined | null) => {
    if (value === undefined || value === null || value === "") {
      return "";
    } else {
      return value;
    }
  };

  const handleUseDoseChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { value } = e.target;
    if (isExperimental) {
      setUseDose(value);
    }
  };

  useEffect(() => {
    if (!isExperimental) {
      if (initialFormValidation) {
        setMode("edit");
        setDisabled(formulation?.fieldsExist);
        // eslint-disable-next-line prefer-const
        let updatedErrors = { ...errors };
        const errorFields = Object.keys(updatedErrors);
        errorFields.forEach((key) => {
          const typedKey = key as keyof ErrorsType;
          updatedErrors[typedKey] = false;
        });
      } else {
        setDisabled(formulation?.fieldsExist);
      }
    } else if (
      editedMembers.length === 0 &&
      initialFormValidation &&
      Number(getTotalWeight()) === 100 &&
      !isTableEdited
    ) {
      setMode("edit");
    }
  }, [
    isExperimental,
    formulationData,
    initialFormValidation,
    editedMembers.length,
    isTableEdited,
    editedMembers,
    getTotalWeight,
    errors,
    formulation?.fieldsExist,
  ]);

  useEffect(() => {
    setInitialFormulationData((prevValue) => ({
      ...prevValue,
      fmlCode:
        assessmentsData?.formulation?.fmlCode === undefined
          ? assessmentsData?.formula_number
          : assessmentsData?.formulation?.fmlCode,
    }));
  }, [assessmentsData]);

  useEffect(() => {
    setFormulationData((prevValues) => ({
      ...prevValues,
      fmlCode: initialFormulationData?.fmlCode,
    }));
    setFormulationFinalData((prevValues) => ({
      ...prevValues,
      fmlCode: initialFormulationData?.fmlCode,
    }));
  }, [initialFormulationData]);

  useEffect(() => {
    setInitialFormulationData((prevValue) => ({
      ...prevValue,
      fmlCode:
        assessmentsData?.formulation?.fmlCode === undefined
          ? assessmentsData?.formula_number
          : assessmentsData?.formulation?.fmlCode,
    }));
  }, [assessmentsData]);

  useEffect(() => {
    if (formulationData?.fmlCode && !isExperimental) {
      setShowImportFormula(false);
    } else if (!formulationData?.fmlCode) {
      setShowImportFormula(true);
    }
    
  }, [formulationData?.fmlCode, isExperimental]);


  const setDisabledAndErrors = (data: FormulationDataType) => {
    const errorFields = Object.keys(errors) as Array<keyof ErrorsType>;
    // eslint-disable-next-line prefer-const
    let errorObject: ErrorsType = { ...errors };
    errorFields.forEach((key) => {
      const typedKey = key as keyof FormulationDataType;
      const value = data[typedKey];
      const errorValidation =
        key === "description"
          ? false
          : !isValueValid(value as null | undefined | string);
      errorObject[key] = errorValidation;
    });
    setErrors(errorObject);
    if (!isExperimental) {
      setDisabled(getDisabledObject());
    }
  };

  const handleContinueDialogButton = () => {
    setFormulationData(formulationFinalData);
    setUseDose(formulationFinalData?.useDose);
    setSelectedSegment(formulationFinalData?.productSegment);
    setSubSegment(formulationFinalData?.productSubSegment);
    setSubSegments([formulationFinalData.productSubSegment]);
    setEditedMembers([]);
    setShowWariningMsg(false);
    setIsClear(true);
    setIsCancelEnable(false);
    setIsSaveEnable(false);
    setDataEdited(false);
    setMode("edit");
    setIsEditDialog(false);
    setDisabledAndErrors(formulationFinalData);
    if (isImportFormula) {
      setIsImportFormula(false);
    }
  };

  const handleCloseDialog = () => {
    setShowWariningMsg(false);
  };

  const handelEditClick = () => {
    setIsImportFormula(true);
    setMode("edit");
    // setIsCancelEnable(false) commented because even in Edit mode cancel to be enabled all the time JFUX-449
    setIsSaveEnable(true);
    const newErrors: ErrorsType = { ...errors };
    Object.keys(formulationData).forEach((key) => {
      if (!["fmlCode", "consumablesUsed"]?.includes(key)) {
        newErrors[key as keyof ErrorsType] =
          formulationData[key as keyof FormulationDataType] === "";
      }
    });
    setErrors(newErrors);
  };

  const cancelChanges = () => {
    setShowWariningMsg(true);
  };

  const handelBlurUnit = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    if (name === "netContent" || name === "useDose") {
      if (value === "0") {
        setErrors((prevState) => ({ ...prevState, [name]: true }));
      }
    }
  };

  function debounceFunction<T extends (...args: never[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: void, ...args: Parameters<T>): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  useEffect(() => {
    setMode("add");
  }, []);

  useEffect(() => {
    if (formulationData.fmlCode !== "" && formulationData.fmlCode !== undefined ) {
       setDisabledAndErrors(formulationData)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formulationData])
  
  const checkIfAutoFilled = (name: string) => {
    const fields = formulationData?.fieldsExist;
    if (fields) {
      if (name in fields) {
        return fields[name];
      }
    }
    return false;
  };

  const findChanges = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    if (mode === "edit" || mode === "add") {
      if (
        isEditDialog === false &&
        formulationData.fmlCode !== "" &&
        isExperimental &&
        !saveClicked &&
        checkIfAutoFilled(e.target.name)
      ) {
        setIsWarningEditDialog(true);
      }
      setIsSaveEnable(true);
    }
  };

  const makeChangesToFormulationData = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name === "useDose") {
      if (/^\d*\.?\d{0,4}$/.test(value)) {
        setUseDose(value);
      }
    }
    setEditedMembers((prevMembers) =>
      prevMembers?.includes(name) ? [...prevMembers] : [...prevMembers, name]
    );
    if (name === "productSegment") {
      handleSegmentChange(value);
      setErrors((prevState) => ({ ...prevState, [name]: false }));
    }
    if (name === "productSubSegment") {
      setSubSegment(value);
      setErrors((prevState) => ({ ...prevState, [name]: false }));
    }
    if (name === "netContent" && isExperimental) {
      if (/^\d*\.?\d{0,6}$/.test(value)) {
        setFormulationData((prevValues) => ({
          ...prevValues,
          [name]: value,
          isCalculated: false,
        }));
        setErrors((prevState) => ({ ...prevState, [name]: false }));
      }
    } else {
      setFormulationData((prevValues) => ({
        ...prevValues,
        [name]: value,
         isCalculated: false,
      }));      
      setErrors((prevState) => ({ ...prevState, [name]: false }));
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ): void => {
    setIsCancelEnable(true);
    setDataEdited(true);
    findChanges(e);
    makeChangesToFormulationData(e);
  };

  const handelFormulationTableChanges = (rawdata: RawMaterialsData[]) => {
    setFormulationData((prevFormulationData) => ({
      ...prevFormulationData,
      rawMaterials: rawdata,
      fmlCode: isExperimental ? "" : prevFormulationData.fmlCode,
      isCalculated: false,
    }));
  // Extract unique identifiers (assuming each material has an "id" property)
  const updatedMembers = rawdata.map(item => item.rawMaterialId);  

  setEditedMembers((prevEditedMembers) => [
    ...new Set([...prevEditedMembers, ...updatedMembers]) // Ensure uniqueness
  ]);
    setIsCancelEnable(true);
    setIsSaveEnable(true);
    setIsTableEdited(true);
    if (mode === "edit" || mode==="add") {
      if (
        isEditDialog === false &&
        formulationData.fmlCode !== "" &&
        isExperimental
      ) {
        setIsWarningEditDialog(true);
      }
    }
  };

  const handleSegmentChange = (selectedSegment: string) => {
    setSelectedSegment(selectedSegment);
    const segment = formulationMasterData.segment?.find(
      (d) => d.productSegment === selectedSegment
    );
    setSubSegments(segment ? segment.productSubSegment : []);
    setSubSegment("");
    setUseDose("");
    setFormulationData((prevValues) => ({
      ...prevValues,
      useDose: "",
      productSubSegment: "",
      isCalculated: false,
    }));    
  };

  const handleClickSaveButton = (e: FormEvent) => {
    setCalculateClick(true);
    setResponseDone(true);
    setSaveClicked(true);
    setErrors(getErrorsObject());
    setFormulationFinalData(formulationData);
    setIsImportFormula(false);
    if (initialFormValidation) {
      setIsSaveEnable(false);
      setIsCancelEnable(false);
    }
    handleSaveUpdate(e);
  };

  const handleContinueEditWarningDialogButton = () => {
    if (isExperimental) {
      setFormulationData((prev) => ({ ...prev, fmlCode: "" }));
    }
    setIsWarningEditDialog(false);
    setIsEditDialog(true);
    setIsImportFormula(true); // Chnage this to false if want to remove error in edit and formula import mode
  };

  const handleCloseEditWarningDialog = () => {
    setIsEditDialog(false);
    if (isImportFormula && importedFormulationData && isExperimental) {
      setFormulationData(importedFormulationData);
      setDisabledAndErrors(importedFormulationData);
    } else {
      setFormulationData(formulationFinalData);
      setDisabledAndErrors(formulationFinalData);
      setIsCancelEnable(false);
      setIsSaveEnable(false);
    }
    setIsWarningEditDialog(false);
  };

  const getFilteredDataRM = (rawMaterials: RawMaterialsData[]) => {
    if (rawMaterials.length) {
      return rawMaterials?.map((raw) => ({
        tradeName: raw.tradeName,
        rawMaterialId: raw.rawMaterialId,
        percentage: raw.material_PCT ?? raw.percentage,
      }));
    }
  };
  useEffect(() => {
    setNewChangesInFormulation(formulationData);
  }, [formulationData, setNewChangesInFormulation]);
  
  // Auto Update

  const setAutoSaveCallStates = useCallback(() => {
    setIsCancelEnable(false);
    setIsEditDialog(false);
    setDataEdited(false);
    setAutoSaveSuccess(false);
    setIsTableEdited(false);
  }, [setAutoSaveSuccess]);

  // global auto save code
  useEffect(() => {
    setChangedFields(editedMembers);
  }, [editedMembers, setChangedFields]);

  useEffect(() => {
    if (autoSaveSuccess) {
      refetch();
      setAutoSaveCallStates();
    }
  }, [autoSaveSuccess, setAutoSaveCallStates, refetch]);

  // updating form data which is used in api call
  useEffect(() => {
    const isEdited = editedMembers.length > 0;
    setFormulationFormData({
      productId: productData?.productId,
      type: assessmentsType,
      assessmentId: assessmentsData._id,
      isCalculating: false,
      isBaselineCalcUpdated: isBaseLineNewlyAdded || (!assessmentsData?.formulation?.isCalculated || !formulationData?.isCalculated) && allFlagsCalculated && assessmentsType=='baseline',
      formulation: {
        ...formulationData,
        rawMaterials: getFilteredDataRM(formulationData?.rawMaterials),
        consumablesUsed: counter.toString(),
        useDose: useDose,
        isEdited,
        isDataValid:!validateCheck,
        isCalculated : formulationData.isCalculated,
        rawMaterialsPercentage: Number(getTotalWeight()),
      },
    });
 
  }, [
    formulationData,
    assessmentsData._id,
    assessmentsType,
    counter,
    editedMembers.length,
    getTotalWeight,
    productData?.productId,
    setFormulationFormData,
    useDose,
    validateCheck
  ]);

  const autoSaveCall = useCallback(async () => {
    const isEdited = editedMembers?.length > 0;
    const fromData = {
      productId: productData?.productId,
      type: assessmentsType,
      assessmentId: assessmentsData._id,
      isCalculating: false,
      isBaselineCalcUpdated: isBaseLineNewlyAdded || (!assessmentsData?.formulation?.isCalculated || !formulationData?.isCalculated) && allFlagsCalculated && assessmentsType=='baseline',
      formulation: {
        ...formulationData,
        rawMaterials: getFilteredDataRM(formulationData.rawMaterials),
        consumablesUsed: counter.toString(),
        useDose: useDose,
        isCalculated: editedMembers?.length > 0 ? false : formulationData?.isCalculated,
        
        isEdited,
        isDataValid:!validateCheck,
        rawMaterialsPercentage: Number(getTotalWeight()),
      },
      
    };

    
    const response = await axios.post(
      `${ApiEndPointsURL}${ApiEndPoints.add_update_formulation}`,
      fromData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      // Normalize to an array if it's not one already
      let normalizedAssessmentList: AssessmentDataType[] = [];

      if (Array.isArray(response?.data?.['assessments']?.[fromData?.type])) {
        normalizedAssessmentList = response?.data?.['assessments']?.[fromData?.type];
      } else if (response?.data?.['assessments']?.[fromData?.type]) {
        normalizedAssessmentList = [response?.data?.['assessments']?.[fromData?.type]];
      }

      // Now you can safely use .find()
      if (normalizedAssessmentList.length > 0) {
        const responsedata = normalizedAssessmentList.find(
          (assessment: AssessmentDataType) => assessment?._id === fromData?.assessmentId
        );

        setAssessmentsData(responsedata);
        setFormulationFinalData(responsedata?.formulation)
        
        setAutoSaveCallStates();
      }
    }
  }, [
    editedMembers,
    assessmentsData._id,
    assessmentsType,
    counter,
    formulationData,
    getTotalWeight,
    productData?.productId,
    token,
    useDose,
    setAutoSaveCallStates,
    setAssessmentsData, validateCheck]);
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (editedMembers.length > 0 || isTableEdited) {
        autoSaveCall();
        setEditedMembers([]);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [
    isTableEdited,
    editedMembers,
    autoSaveCall,
    assessmentsData._id,
    assessmentsType,
    counter,
    formulationData,
    getDisabledObject,
    getTotalWeight,
    isExperimental,
    mode,
    productData?.productId,
    refetch,
    refetchResultBaseline,
    resultDataRefetch,
    token,
    useDose,
    formulationData?.rawMaterials,
  ]);

  const handleSaveUpdate = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const hasErrors = Object.values(formulationData).some(
      (key) =>
        (key !== "fmlCode" || key !== "consumablesUsed") &&
        formulationData[key as keyof FormulationDataType] === ""
    );
    if (hasErrors) {
      setErrors(getErrorsObject());
      return;
    }
    setEditedMembers([]);
    try {
      const isEdited = editedMembers.length > 0;
      const fromData = {
        productId: productData?.productId,
        type: assessmentsType,
        assessmentId: assessmentsData._id,
        isCalculating:true,
        isBaselineCalcUpdated: isBaseLineNewlyAdded || (!assessmentsData?.formulation?.isCalculated || !formulationData?.isCalculated) && allFlagsCalculated && assessmentsType=='baseline',
        formulation: {
          ...formulationData,
          rawMaterials: getFilteredDataRM(formulationData.rawMaterials),
          consumablesUsed: counter.toString(),
          useDose: useDose,
          isEdited,
          isDataValid:!validateCheck,
          isCalculated: true,
          rawMaterialsPercentage: Number(getTotalWeight()),
        },
      };
      const response = await axios.post(
        `${ApiEndPointsURL}${ApiEndPoints.add_update_formulation}`,
        fromData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setResponseDone(false);
        setCalculateClick(false);
        setErrors(getErrorsObject());
        toast.success(
         "Formulation and Packaging data calculated"
        );
        setIsCancelEnable(false);
        setIsSaveEnable(false);
        setIsEditDialog(false);
        setDataEdited(false);
        setEditedMembers([]);
        setErrors(getErrorsObject());
        if (!isExperimental) {
          setDisabled(getDisabledObject());
        }
        setTimeout(() => {}, ToastMessageNotificationTime);
        refetch();
        resultDataRefetch();
        refetchResultBaseline();
       
      } else {
        setResponseDone(false);
        setCalculateClick(false);
        resultDataRefetch();
        toast.warning(
          "Error occured while submitting the Component details, please try again!"
        );
      }
    } catch (ex) {
      setResponseDone(false);
      setCalculateClick(false);
      resultDataRefetch();
  // Check if the error response contains a 'message' property
  const errorMessage = ex?.response?.data?.message || ex.message || "An unexpected error occurred";
  // Display the message using toast
  toast.warning(errorMessage);

      
    }
  };

  const onImportData = (data: FormulationDataType) => {
    setUseDose(data?.useDose);
    setIsImportFormula(true);
    setMode("edit");
    setIsSaveEnable(true);
    setIsCancelEnable(true);
    setIsEditDialog(false);
    const updatedData = {
  ...data,
  rawMaterials: data?.rawMaterials?.map((item) => ({
    ...item,
    percentage: item.material_PCT,
  })),
};
setFormulationData(updatedData);
    setImportedFormulationData(data);
    setEditedMembers((prevMembers) => {
      const currentFields = Object.keys(data);
      const newMembers = currentFields.filter((field) => !prevMembers.includes(field)); 
      return [...prevMembers, ...newMembers]; 
    });
       setSaveClicked(false);
    setDisabledAndErrors(data);
  };

  const getChildData = (formulaData: FormulationDataType) => {
    return {
      fmlCode: formulaData.fmlCode ?? "",
      description: formulaData.description ?? "",
      netContent: formulaData.netContent ?? "",
      netContentUnit: formulaData.netContentUnit === "gm" ? "g" : formulaData.netContentUnit,
      productionZone: formulaData.productionZone ?? "",
      salesZone: formulaData.salesZone ?? "",
      productSegment: formulaData.productSegment ?? "",
      productSubSegment: formulaData.productSubSegment ?? "",
      useDose: formulaData.useDose ?? "",
      useDoseUnit: formulaData.useDoseUnit,
      consumablesUsed: formulaData.consumablesUsed ?? "0",
      rawMaterials: formulaData.rawMaterials ?? [],
      useScenario: formulaData.useScenario ?? "",
      fieldsExist:formulaData.fieldsExist ?? []
    };
  };

  const callChildData = (formulaData: FormulationDataType) => {
    if (formulaData) {
      const data = getChildData(formulaData)
      setCounter(parseFloat(formulaData.consumablesUsed ?? "0"));
      setSelectedSegment(data.productSegment);
      setSubSegment(data.productSubSegment);
      const segment = formulationMasterData.segment?.find(
        (d) => d.productSegment === data.productSegment
      );
      setSubSegments(segment ? segment.productSubSegment : []);
      setUseDose(formulaData.useDose ?? "");
      onImportData(data as FormulationDataType);
    }
  };

  useEffect(() => {
    if (!(formulation && mode !== "edit")) {
      setMode("add");
    }
  }, [formulation, mode]);

  const initialDataSetter = useCallback(
    (data: FormulationDataType) => {
      setFormulationData(data);
      setFormulationFinalData(data);
      setUseDose(data?.useDose);
      setSelectedSegment(data.productSegment);
      setSubSegments([]);
      setSubSegment(data.productSubSegment);
      setCounter(
        parseFloat(
          formulation?.consumablesUsed ? formulation.consumablesUsed : "0"
        )
      );
      const segment = formulationMasterData.segment?.find(
        (d) => d.productSegment === formulation?.productSegment
      );
      setSubSegments(segment ? segment.productSubSegment : []);
    },
    [
      formulation?.consumablesUsed,
      formulation?.productSegment,
      formulationMasterData.segment,
    ]
  );

  useEffect(() => {
    if (formulation) {
      const getNetContentUnit = () => {
        if (formulation.netContentUnit) {
          return formulation.netContentUnit === "gm"
            ? "g"
            : formulation.netContentUnit;
        } else {
          return "g";
        }
      };
      const data = {
        fmlCode: formulation.fmlCode,
        description: getModifiedValue(formulation.description),
        netContent: getModifiedValue(formulation.netContent),
        netContentUnit: getNetContentUnit(),
        productionZone: getModifiedValue(formulation.productionZone),
        salesZone: getModifiedValue(formulation.salesZone),
        productSegment: getModifiedValue(formulation.productSegment),
        productSubSegment: getModifiedValue(formulation.productSubSegment),
        useDose: getModifiedValue(formulation.useDose),
        useDoseUnit: formulation.useDoseUnit ?? "g",
        consumablesUsed: formulation.consumablesUsed ?? "0",
        isCalculated: formulation.isCalculated ?? false,
        rawMaterials: formulation.rawMaterials,
        fieldsExist: formulation.fieldsExist,
        useScenario: getModifiedValue(formulation.useScenario),
      };
      initialDataSetter(data as FormulationDataType);
    }
  }, [formulation, formulationMasterData, initialDataSetter]);

  const handleOpenImportFormulaPopup = () => {
    setImportFormulaDialogOpen(true);
  };

  const handleClick1 = () => {
    if (counter < 10) {
      setCounter(counter + 1);
      setFormulationData((prevValues) => ({
        ...prevValues,
        consumablesUsed: (counter + 1).toString(),
        isCalculated: false,
      }));
      setIsCancelEnable(true);
      setIsSaveEnable(true);
      setEditedMembers((prevValues) => [...prevValues, "consumablesUsed"]);
    }
  };
  const handleClick2 = () => {
    if (counter > 0) {
      setCounter(counter - 1);
      setFormulationData((prevValues) => ({
        ...prevValues,
        consumablesUsed: (counter - 1).toString(),
        isCalculated: false,
      }));
      setIsCancelEnable(true);
      setIsSaveEnable(true);
      setEditedMembers((prevValues) => [...prevValues, "consumablesUsed"]);
    }
  };

  const handleCloseImportFormulaDialog = () => {
    setImportFormulaDialogOpen(false);
  };

  return {
    handleChange,
    handelBlurUnit,
    counter,
    errors,
    handleClickSaveButton,
    subSegments,
    dialogKey,
    importFormulaDialogOpen,
    mode,
    showWariningMsg,
    isClear,
    handleContinueDialogButton,
    handleCloseDialog,
    cancelChanges,
    handleOpenImportFormulaPopup,
    handleClick1,
    handleClick2,
    handleCloseImportFormulaDialog,
    callChildData,
    handelEditClick,
    handelFormulationTableChanges,
    formulationData,
    isCancelEnable,
    isWarningEditDialog,
    handleCloseEditWarningDialog,
    dataEdited,
    handleContinueEditWarningDialogButton,
    isSaveEnable,
    responseDone,
    allFlagsCalculated,
    isImportFormula,
    initialFormValidation,
    disabled,
    debounceFunction,
    isExperimental,
    showImportFormula,
    useDose,
    handleUseDoseChange,
    handleSaveUpdate,
    setFormulationData,
    setFormulationFinalData,
  };
};

export default useFormulaAndConsumer;
