/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/usePackaging.ts
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import recycle_na from "../../assets/images/Recyclable_Icon.svg";
import recycle_not_ready from "../../assets/images/recycle_not_ready.svg";
import recycle_ready from "../../assets/images/recycle_ready.svg";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import {
  PackagingComponentData,
  ParentComponentData,
} from "../../structures/packaging";
import { SelectChangeEvent } from "@mui/material";

import { useConsumerPackagingContext } from "./ConsumerPackagingContext";

const usePackaging = (
  isNewComponent:boolean,
  packagingtype:string,
  componentId?:number,
  componentData?: PackagingComponentData,

) => {
  const { packagingData:packagingMasterData } = useGlobaldata();
  const [isViewMode, setIsViewMode] = useState<boolean>(!isNewComponent);
  const [staticRecycleStatus, setStaticRecycleStatus] = useState(componentData?.recyclability_status || "");
  const [importComponentDialogOpen, setImportComponentDialogOpen] = useState<boolean>(false);
  const [validateDropdownvalues, setValidateDropdownvalues] =useState<boolean>(false);
  const dialogKey = 0;
  const [popupPage, setPopupPage] = useState<string>("");
  const [recordStatus, setRecordStatus] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isDeleteButtonHide, setIsDeleteButtonHide] = useState(false);
  const componentType = ""
  const [componentUnits, setComponentUnits] = useState<string>("g");
  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [isImportData, setIsImportData] = useState<boolean>(false);
  const [isImportDataCheck, setIsImportDataCheck] = useState<boolean>(false);
  const initialized = false;
  const {handelImportPackingData,handleDeleteComponent,resetData,handleClickCancelContinue,handelChangeRecycleStatus,handleClickEditCancle,setPcNmToEmpty,isComponentDataChangePrimary,setIsComponentDataChangePrimary,isComponentDataChangeSecondary,setIsComponentDataChangeSecondary,setWarningPopUp} = useConsumerPackagingContext();

  const [isParentComponentData, setIsParentComponentData] =
    useState<ParentComponentData>({
      vpc_spec: "",
      vcomponent_description: "",
      composition: [],
    });
  const [isSaveEnabledOld, setIsSaveEnabledOld] = useState<"true" | "false" | "NA">(
    "NA"
  );
  const isSaved = false;
  const [openDailog, setOpenDailog] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [recyclabilityStatusDialogOpen, setRecyclabilityStatusDialogOpen] =
    useState<boolean>(false);
  
  const recyclabilityStatusDialogKey = 0;
  const [error, setError] = useState("");
  const [changedFieldsPopupOpen, setChangedFieldsPopupOpen] = useState(false);

  const [errors, setErrors] = useState<Map<number, string | null>>(new Map());

  useEffect(()=>{
    componentData?._id === undefined && setMode('add')
  },[componentData])  

  const handleComponentUnitsChange = useCallback(
    (e: SelectChangeEvent) => {
      setComponentUnits(e.target.value);
     
    },
    []
  );

  const handleCloseChangeDailog = () => {
    if(componentId !== undefined && (packagingtype === 'Primary' || packagingtype === 'Secondary')){
      handleClickEditCancle(componentId,packagingtype);
    }
    setChangedFieldsPopupOpen(false);
    setWarningPopUp(false)
  };

  const handleContinueChangevlaue = () => {
    setChangedFieldsPopupOpen(false);
    setWarningPopUp(false)
    if (packagingtype === 'Primary') {
      setIsComponentDataChangePrimary((prevState) =>
        prevState.map(item =>
          item.index === componentId+'p' && item.value === true ? { ...item, value: false } : item
        )
      );
      
    }
    else if (packagingtype === 'Secondary') {
      setIsComponentDataChangeSecondary((prevState) =>
        prevState.map(item =>
          item.index === componentId+'s' && item.value === true ? { ...item, value: false } : item
        )
      );
    }
   
    if(componentId !== undefined && (packagingtype === 'Primary' || packagingtype === 'Secondary')){
     setPcNmToEmpty(componentId,packagingtype)
    }

   
    setIsParentComponentData((prev) => ({
      ...prev,
      vpc_spec: "",
    }));
  };


  const handleCloseImportComponentDialog = useCallback(() => {
    setImportComponentDialogOpen(false);
  }, []);

  const handleOpenImportComponentPopup = useCallback(() => {
    setImportComponentDialogOpen(true);
  }, []);

  const handleCloseRecyclabilityStatusDialog = useCallback(() => {
    setRecyclabilityStatusDialogOpen(false);
  }, []);

  const handleOpenRecyclabilityStatusPopup = useCallback(
    (popupPage: string, recordStatus: string) => {
      setPopupPage(popupPage);
      setRecordStatus(recordStatus);
      setRecyclabilityStatusDialogOpen(true);
    },
    []
  );

  const handleClickCancelButton = useCallback(() => {
    setIsViewMode(false);
    setOpenDailog(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleOpenDeletePopup = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      ev.stopPropagation();
      setDeletePopupOpen(true);
      handleMenuClose();
    },
    [handleMenuClose]
  );

  const handleMoreHorizClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleEditPackagingComponent = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      setMode("edit");
      console.log(ev)
      setIsViewMode(false)
      handleMenuClose();
     
    },
    [handleMenuClose,mode]
  );


  const handleCloseDialog = useCallback(() => {
    setOpenDailog(false);
  }, []);

  const handleCancelContinueSave = useCallback(() => {
    if(componentId !== undefined && (packagingtype === 'Primary' || packagingtype === 'Secondary')){
      handleClickCancelContinue(componentId,packagingtype)
      setOpenDailog(false);
    }
  }, []);

  // Function to validate weight
  const validateWeight = (value: string | null) => {
    // Check for empty value or zero value
    if (value === "0") {
      setError("Weight cannot be 0, Please enter the valid weight");
    } else {
      setError("");
    }
  };


  const validateFields = useCallback((): boolean => {
    const isStaticRecycle =
      staticRecycleStatus !== "" && staticRecycleStatus !== "N/A";
    return (
      componentType?.trim() !== "" &&
      isStaticRecycle
    );
  }, [
    componentType,
    staticRecycleStatus,
  ]);

  // Update save button state
  const updateSaveButtonState = useCallback(
    (isEnabled: boolean) => {
      if (initialized && isEnabled && validateFields()) {
        setIsSaveEnabledOld("true");
      } else {
        setIsSaveEnabledOld("false");
      }
    },
    [validateFields, initialized, mode]
  );

  // Function to set the rows changed flag

  const handleCloseDeletePopup = () => {
    setDeletePopupOpen(false);
     setTimeout(() => {
           setIsDeleteButtonHide(false);
        }, 1000);
  
  };

  const callChildRecycleComponentData = useCallback(
    (componentData: string = "") => {
   
      setStaticRecycleStatus(componentData);
      componentId !== undefined && handelChangeRecycleStatus(componentData,componentId,packagingtype === "Primary" ? 'Primary' : 'Secondary',isImportData)
    },
    []
  );

  const callChildComponentData = useCallback(
    (
      componentData: PackagingComponentData = {
        pc_nm: "",
        description: "",
        component_type: "",
        recyclability_status: "",
        weight: "",
        opacifier: "",
        stage: "",
        state: "",
        template: "",
        isEdited: false,
        sub_components: [],
        isCalculated:false
      }
    ) => {
    
      setValidateDropdownvalues(true);
      setIsImportDataCheck(true)
     if(componentId !== undefined){
      setIsImportData(true);
      handelImportPackingData(componentData,componentId,packagingtype === 'Primary' ? 'Primary' : 'Secondary', componentData._id === undefined);
     }
    },
    [componentData]
  );


  const imageSrc = useMemo(() => {
    if (staticRecycleStatus === "Recycle Ready") {
      return recycle_ready;
    } else if (staticRecycleStatus === "Not Recycle Ready") {
      return recycle_not_ready;
    } else {
      return recycle_na;
    }
  }, [staticRecycleStatus]);

  const imageClassName = useMemo(() => "packaging-recyclable-ready-not", []);

  const isButtonEnabled = useMemo(
    () =>
    componentData?.component_type?.trim() !== "" &&
    componentData?.component_type?.trim().toLowerCase() !== "none",
    [componentData]
  );

  const handleChangeAccordion = () => {
    if (!expanded) {
      setExpanded(true);
    }
  };
  
  const handleDelete = () => {
    setIsDeleteButtonHide(true)
    componentId !== undefined && handleDeleteComponent(componentId, packagingtype === 'Primary' ? 'Primary' : 'Secondary')
    handleCloseDeletePopup()
  };
  // useEffect to check if a component's index is present with true value
  useEffect(() => {
    const id = packagingtype === "Primary"? componentId + 'p' : componentId + 's';
    
    const trueItem1 = isComponentDataChangePrimary.find((item) =>item.index === id && item.value === true);
    const trueItem2 = isComponentDataChangeSecondary.find((item) =>item.index === id && item.value === true);
   
    // for temporary removing this conditaion && assessmentsType === "experimental" , later we can add this
    if (trueItem1 || trueItem2) {
        setWarningPopUp(true)
        setChangedFieldsPopupOpen(true);
        //edit warning will open component index has value true
    }
  }, [isComponentDataChangePrimary,isComponentDataChangeSecondary]);


  useEffect(() => {
    componentData?.weight && validateWeight(componentData?.weight);
  }, [componentData?.weight ]);

  useEffect(()=>{
    if(resetData){
      setIsViewMode(true)
      setMode("edit")
    }
  },[resetData]);
  

  useEffect(()=>{
    setStaticRecycleStatus(componentData?.recyclability_status ?? "")
  },[componentData?.recyclability_status])

  useEffect(() => {
    if (!initialized && isSaveEnabledOld === "NA") return; // Skip validation until initialization is complete
  }, [validateFields, isSaveEnabledOld, mode, initialized]);


  return {
      staticRecycleStatus,
      importComponentDialogOpen,
      dialogKey,
      popupPage,
      recordStatus,
      anchorEl,
      deletePopupOpen,
      componentUnits,
      isParentComponentData,
      isSaved,
      openDailog,
      recyclabilityStatusDialogOpen,
      recyclabilityStatusDialogKey,
      error,
      changedFieldsPopupOpen,
      errors,
      isImportData,
      handleCloseChangeDailog,
      handleContinueChangevlaue,
      handleCloseImportComponentDialog,
      handleOpenImportComponentPopup,
      handleCloseRecyclabilityStatusDialog,
      handleOpenRecyclabilityStatusPopup,
      handleClickCancelButton,
      handleMenuClose,
      handleOpenDeletePopup,
      handleMoreHorizClick,
      handleEditPackagingComponent,
      handleCancelContinueSave,
      handleChangeAccordion,
      handleCloseDialog,
      imageSrc,
      imageClassName,
      isButtonEnabled,
      packagingMasterData,
      updateSaveButtonState,
      callChildComponentData,
      callChildRecycleComponentData,
      handleDelete,
      setErrors,
      handleCloseDeletePopup,
      handleComponentUnitsChange,
      mode,
      validateDropdownvalues,
      isViewMode,
      isImportDataCheck,
      isDeleteButtonHide
  };
};

export default usePackaging;
