import React, { useMemo, useContext, forwardRef, useImperativeHandle, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Divider,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "../../assets/css/SIP.css";
import "../../assets/css/calculating.scss";
import "../../assets/css/ConsumerPackingComponent.scss"
import { CheckCRUDAccess } from "../../helper/GenericFunctions";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import Tooltipcommon from "../../controls/Tooltip";
import { PRODUCT_EVACUATION } from "../../constants/ExperimentalTooltip.constant";
import {PartialDataWarning,PackagingSection,RecyclabilityStatus,useConsumerPackagingContext} from ".";
import calculatingicon from "../../assets/images/calculate.svg";
import useFormulaAndConsumer from "../formulation/formulation-tab/useFormulaAndConsumer";
import { AutoSaveContext } from "../../contexts/autoSaveContext/AutoSaveContext";
export interface ConsumerPackagingRef {
  packagingDataSave: () => void;
}
// Separate component for loading state
const LoadingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <img id='Vector' src={calculatingicon} alt="Calculating" />
    <p className="calculating-text">{"Calculating"}</p>
  </div>
);
const ConsumerPackaging = forwardRef<ConsumerPackagingRef>((props,ref) => {
  const [errorProduct, setErrorProduct] = React.useState<string | null>(null);
  const {
    handleAddPrimary,
    handleAddSecondary,
    primaryData,
    secondaryData,
    setProductEvacuationValue,
    setIsProductEvacuationChanged,
    // setPrimaryData,
    productEvacuationValue,
    isSaveEnabled,
    allFlagsCalculated,
    handleSavePacking,
    handleSavePackingOnTab,
    isCalculating,
    primaryRecycleStatus,
    secondaryRecycleStatus,
    setIsSaveEnabled,
    counterPrimary,
    counterSecondary,
    allCalculated,
    isCalculationUpdatedPackaging,
    setIsManualOverride
  } = useConsumerPackagingContext();

  const {assessmentsType,bothDataComplete,setSingleClickHit, singleClickHit,bothPackFormulaStatus, setValidateCheck, setValidateCheckPackaging, setIsPackagingDirty, validateCheckFinal, isBaselinePresent}=useContext(ProductDataContext)
  const { handleClickSaveButton } = useFormulaAndConsumer();
  const {  setIsDataCompleted } = useContext(AutoSaveContext);
  const [prodEvacuationTooltip, setProdEvacuationTooltip] = useState<boolean>(false);
  
  const packagingDataSave = () => {
    handleSavePackingOnTab(true);
    console.log(props)
  }
  const isAnyDataIncompletePrimary = primaryData?.some(
    (item) => item.isDataComplete === false || item.isDataComplete === undefined
  );
  
  const isAnyDataIncompletesecondary = secondaryData?.some(
    (item) => item.isDataComplete === false || item.isDataComplete === undefined
  );
  useEffect(() => {
    const PackagingDataComplete = !(isAnyDataIncompletePrimary || isAnyDataIncompletesecondary);
    setIsDataCompleted(PackagingDataComplete)
  }, [isAnyDataIncompletePrimary, isAnyDataIncompletesecondary, setIsDataCompleted ])
  const { usersData, assessmentsData } = useContext(ProductDataContext);
  const isOwner = CheckCRUDAccess(usersData, "consumer_packaging") === 0;
  useImperativeHandle(ref, () => ({
    packagingDataSave
  }));

   useEffect(() => {
     setSingleClickHit(isSaveEnabled);
   }, [isSaveEnabled, setSingleClickHit])
   useEffect(() => {
     // Set validateCheck to true if there is an error message in errorProduct
     const hasErrors = (errorProduct !== null && errorProduct !== "");
     setValidateCheck(hasErrors);
     setValidateCheckPackaging(hasErrors)

  }, [errorProduct]);
  const validateEvacuation = (value: string) => {
    if (!value || Number(value) === 0) {
      setErrorProduct(
        "Product Evacuation field cannot be blank, please enter a value between 1 - 100%"
      );
      
    } else if (Number(value) > 100) {
      setErrorProduct(
        "Product Evacuation field cannot be greater than 100%, please enter a value between 1 - 100%."
      );
      
    } else {
      
      setErrorProduct("");
      setIsSaveEnabled(true);
    }
  };
  useEffect(() => {
    if (!productEvacuationValue || Number(productEvacuationValue) === 0) {
      setErrorProduct(
        "Product Evacuation field cannot be blank, please enter a value between 1 - 100%"
      );

    } else if (Number(productEvacuationValue) > 100) {
      setErrorProduct(
        "Product Evacuation field cannot be greater than 100%, please enter a value between 1 - 100%."
      );
    }
    else {

      setErrorProduct("");
    }
  }, [productEvacuationValue])

  const baselineMissing =
  !isBaselinePresent &&
  !assessmentsData?.isBaselineSkipped;
  const isProductEvacuationDisabled = useMemo(() => {
    if (primaryData?.length === 0) {
      return true;
    }
      return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryData, productEvacuationValue]);
  const handleProductEvacuationOnChange = (value) => {
    validateEvacuation(value);
    setProductEvacuationValue(value);
    setIsProductEvacuationChanged(false);
    setIsPackagingDirty(true);
    setIsManualOverride(true)
 
  }
  const handleBothCalculation = () => {
    handleSavePacking(false)
    if (handleClickSaveButton) {
      const mockEvent = { preventDefault: () => { } } as React.FormEvent;
      handleClickSaveButton(mockEvent)
    }
    // After successful calculation logic
    setIsPackagingDirty(false);
  }
  
  // Helper functions outside component
  const getButtonStyles = (singleClickHit, allFlagsCalculated, bothPackFormulaStatus) => {


const isDisabledState =
  baselineMissing ||
  validateCheckFinal ||
  (
    !assessmentsData.isBaselineCalcUpdated &&
    singleClickHit === false &&
    allFlagsCalculated === true &&
    bothPackFormulaStatus === false
  );

    if (isOwner||!bothDataComplete) {
      return {
        cursor: "not-allowed",
        opacity: "50%"
      };
    }
    return {
      cursor: isDisabledState ? "not-allowed" : "pointer",
      opacity: isDisabledState ? "50%" : 1
    };
  };
  
const shouldDisableButton = (
  singleClickHit,
  allFlagsCalculated,
  bothPackFormulaStatus
) => {
  if (isOwner || validateCheckFinal || !bothDataComplete) {
    return true;
  }

  return baselineMissing || (
    !assessmentsData.isBaselineCalcUpdated &&
    singleClickHit === false &&
    allFlagsCalculated === true &&
    bothPackFormulaStatus === false
  );
};
  return (
    <>
      {/** START CODE - PRIMARY - SECONDARY - PACKAGING */}
      {(primaryData?.length || secondaryData?.length) ? (
  <>
    {/* Show warning for incomplete data fields */}
    {(isAnyDataIncompletePrimary || isAnyDataIncompletesecondary) && (
      <PartialDataWarning message="There are one or more incomplete data fields." />
    )}

    {/* Show warning for recalculation needed */}
    {(!allCalculated || isCalculationUpdatedPackaging)&& allFlagsCalculated && assessmentsType === 'baseline' && (
      <PartialDataWarning message="You’ve made changes, but haven’t recalculated your assessment." />
    )}
  </>
) : null}


      <div className="PackagingButtonEnable"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="packing-recycle-status-row">
          <RecyclabilityStatus
            status={primaryRecycleStatus}
            packagingType="Primary"
          />
          <RecyclabilityStatus
            status={secondaryRecycleStatus}
            packagingType="Secondary"
          />
        </div>
        <div className="calcButtonPackaging" style={{ width: "120px", textAlign: "right" }}>
          {!isCalculating ? (
            <button
                    style={getButtonStyles(singleClickHit, allFlagsCalculated, bothPackFormulaStatus)}
              
              className="disabledfield packaging-save-btn"
              onClick={() => handleBothCalculation()}
      disabled={shouldDisableButton(singleClickHit, allFlagsCalculated, bothPackFormulaStatus)}
            >
              {"Calculate"}
            </button>
          ) : (
           <LoadingIndicator />
          )}
        </div>
      </div>
      {/** END CODE - PRIMARY - SECONDARY - PACKAGING */}

      {/** START CODE - PRIMARY PACKAGING */}

      <div>
        <div className="packaging-main-div">
          <span className="header packaging-main-title">Primary Packaging</span>
          <br />
        </div>
        <br />
        <Divider sx={{ bgcolor: "black" }} />
        <div style={{ width: "auto", display: "flex", marginTop: "25px" }}>
          <div style={{ width: "480px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="700"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                variant="subtitle1"
              >
                Number of Primary Packaging Components
              </Typography>
              <Typography
                fontWeight="400"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans-regular" }}
                variant="subtitle1"
                color={"red"}
              >
                *
              </Typography>
            </div>

            <div style={{ width: "100px", marginTop: "10px", display: "flex" }}>
              <div
                style={{ width: "auto", marginTop: "0px", marginLeft: "5px",fontSize:"16px", fontFamily: "kenvue-sans-regular" }}
              >
                <span>{primaryData?.length}</span>
              </div>
            </div>
          </div>
          <Box
            data-testid="evacuation-tooltip-box"
            onMouseEnter={()=>setProdEvacuationTooltip(true)}
            onMouseLeave={()=>setProdEvacuationTooltip(false)}>
            <Tooltip
              title={errorProduct || ""}
              arrow
              placement="right-start"
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    color: "black", // Text color
                    backgroundColor: "white", // Background color
                    border: "1px solid black", // Border color
                    borderRadius: "10px 10px 10px 0px",
                    padding: "8px 12px",
                    transform: "translateX(10px) translateY(-10px)", // Position adjustment
                    margin: "0",
                  },
                },
              }}
              open={prodEvacuationTooltip}
            >
              <div data-testId="evacuation-input-container"
                style={{
                  width: "202px",
                  backgroundColor: errorProduct ? "#f8d7da" : "transparent", // Light red background on error
                  borderRadius: errorProduct ? "20px" : "0px", // Optional: Add rounded corners for better appearance
                  padding: errorProduct ? "10px" : "0px",
                  marginTop: errorProduct ? "-12px" : "0px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    fontWeight="700"
                    fontSize={"13.33px"}
                    sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                    variant="subtitle1"
                  >
                    Product Evacuation
                  </Typography>
                  <Typography
                    fontWeight="400"
                    fontSize={"13.33px"}
                    sx={{ fontFamily: "kenvue-sans-regular" }}
                    variant="subtitle1"
                    color={"red"}
                  >
                    *
                  </Typography>

                  <Tooltipcommon
                    content={PRODUCT_EVACUATION}
                    direction="product-evacuation"
                    setEnableCustomTooltip={setProdEvacuationTooltip}
                  >
                    <InfoIcon />
                  </Tooltipcommon>
                </div>
                <div style={{ width: "150px", display: "flex" }}>
                  <div style={{ width: "68px" }}>
                  <TextField
    className="standard-basic"
    style={{ width: "68px" }}
    variant="standard"
    value={productEvacuationValue}
    onChange={(e) => {
      const val = e.target.value;

      if (/^\d+(?:\.\d*)?$/.test(val) || val === "") {
        handleProductEvacuationOnChange(val);
      }
    }}
    disabled={
      isProductEvacuationDisabled ||
      CheckCRUDAccess(usersData, "consumer_packaging") === 0
    }
    type="text"
    inputMode="decimal"
    onKeyDown={(e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault(); 
      }
    }}
    sx={{
      "& .MuiInputBase-input": {
        fontFamily: "kenvue-sans-regular !important",
        fontSize: "16px !important",
      },
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
      "& input[type=number]::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "& input[type=number]::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    }}
    InputProps={{
      inputMode: "decimal", 
      endAdornment: (
        <InputAdornment position="end">
          <Typography
            fontWeight="400"
            fontSize={"16px"}
            sx={{ fontFamily: "kenvue-sans-regular" }}
          >
            {productEvacuationValue.trim() === "" ? "" : `%`}
          </Typography>
        </InputAdornment>
      ),
    }}
  />

                  </div>
                </div>
              </div>
            </Tooltip>
          </Box>
        </div>
      </div>
      <br />
      <Divider />

      <PackagingSection
        title="Primary"
        counter={counterPrimary}
        components={primaryData}
        onAddComponent={handleAddPrimary}
      />
      {/** END CODE - PRIMARY PACKAGING */}

      {/** START CODE - SECONDARY PACKAGING */}

      <div>
        <div className="packaging-main-div">
          <span className="header packaging-main-title">
            Secondary Packaging
          </span>
          <br />
        </div>
        <br />
        <Divider sx={{ bgcolor: "black" }} />

        <div style={{ width: "auto", display: "flex", marginTop: "25px" }}>
          <div style={{ width: "480px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="700"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                variant="subtitle1"
              >
                Number of Secondary Packaging Components
              </Typography>
            </div>

            <div style={{ width: "100px", marginTop: "10px", display: "flex" }}>
              <div
                style={{ width: "auto", marginTop: "0px", marginLeft: "5px" }}
              >
                <span style={{ fontFamily: "kenvue-sans-regular", fontWeight: "400", fontSize: "16px" }}>{counterSecondary}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Divider />
      <PackagingSection
        title="Secondary"
        counter={counterSecondary}
        components={secondaryData}
        onAddComponent={handleAddSecondary}
      />
      {/** END CODE - SECONDARY PACKAGING */}
    </>
  );
});

export default ConsumerPackaging;
