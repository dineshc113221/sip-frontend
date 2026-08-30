import {
  Box,
  Select,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  FormControl,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import MenuItem from "@mui/material/MenuItem";
import "../../../assets/css/tooltip.scss";
import "../../../assets/css/calculating.scss";
import "../../../assets/css/formulation-tab.scss";
import Tooltipcommon from "../../../controls/Tooltip";
import "../../../assets/css/SIP.css";
import DialogBox from "../../../controls/DialogBox";
import {
  FML_NUMBER_TOOLTIP_CONTENT,
  NET_CONTENT_TOOLTIP_CONTENT,
  PRODUCT_SEGMENT_TOOLTIP_CONTENT,
  PRODUCT_SUB_SEGMENT_TOOLTIP_CONTENT,
  PRODUCT_ZONE_TOOLTIP_CONTENT,
  SALES_ZONE_TOOLTIP_CONTENT,
  USE_DOSE_TOOLTIP_CONTENT,
  USE_SCENARIO_TOLTIP_CONTENT,
  WARNING_MSG_CANCEL,
} from "../../../constants/ExperimentalTooltip.constant";
import { useGlobaldata } from "../../../contexts/masterData/DataContext";
import FormulationAndCompositionTable from ".././formulationComposition/FormulationAndCompositionTable";
import PopupImportFormula from "../../breadcrumb/PopupComponentImportFormula";
import useFormulaAndConsumer from "./useFormulaAndConsumer";
import FormField, {
  ConsumablesUsedField,
  SelectFieldLable,
} from ".././FormField";
import { styled } from "@mui/material/styles";
import { ProductDataContext } from "../../../contexts/productData/ProductDataContext";
import lockImage from "../../../assets/images/lockicon.svg";
import { PartialDataWarning } from "../../common/PartialDataWarningFormulation";
import {
  CheckCRUDAccess
} from "../../../helper/GenericFunctions";
import calculatingicon from "../../../assets/images/calculate.svg";
import FormulationLegends from "./FormulationLegends";
import { useConsumerPackagingContext } from "../../consumer-packaging-tab/ConsumerPackagingContext";
import { AutoSaveContext } from "../../../contexts/autoSaveContext/AutoSaveContext";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
<Tooltip
    arrow
    classes={{ popper: className }}
    placement="right-start"
     {...props}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: "black",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    border: "1px solid black", // Border color
    borderRadius: "10px 10px 10px 0px", // Border radius
    padding: "8px 12px", // Padding
    marginTop: "-21px",
    fontFamily: "kenvue-sans-regular",
    lineHeight: 1.5,
    transformOrigin: "center bottom", // Tooltip opens above the element
  },
}));

const FormulaAndConsumer: React.FC = () => {
  const { formulationData: formulationMasterData } = useGlobaldata();
  const {
    handleSavePacking
  } = useConsumerPackagingContext();
  const {
    usersData,
    formulation: assessmentFormulation,
    assessmentsData,assessmentsType,newChangesInFormulation,formulationDataComplete,bothDataComplete,setSingleClickHit, singleClickHit, bothPackFormulaStatus, setIsPackagingDirty, validateCheckFinal,isBaselinePresent
  } = useContext(ProductDataContext);

  const {
    handleChange,
    handelBlurUnit,
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
    handleOpenImportFormulaPopup,
    handleClick1,
    handleClick2,
    handleCloseImportFormulaDialog,
    callChildData,
    handelFormulationTableChanges,
    formulationData,
    isWarningEditDialog,
    handleCloseEditWarningDialog,
    showImportFormula,
    handleContinueEditWarningDialogButton,
    isSaveEnable,
    responseDone,
    allFlagsCalculated,
    isImportFormula,
    disabled,
    useDose,
    isExperimental,
  } = useFormulaAndConsumer();
  const baselineMissing =
  !isBaselinePresent &&
  !assessmentsData?.isBaselineSkipped;
  const {  setIsDataCompleted } = useContext(AutoSaveContext);
  const isCRUDAccessChecked = usersData !== undefined && usersData !== null;
  const isOwner = CheckCRUDAccess(usersData, "formulation") === 1;
  const error = "TextField this filed";
  const getColor = (validator: boolean): string => {
    const color = validator ? "#444444BF" : "black";
    return color;
  };
  const [enableNetQuantityTooltip, setEnableNetQuantityTooltip] = useState<boolean>(false);
  const [enableDoseTooltip, setEnableDoseTooltip] = useState<boolean>(false);
  useEffect(() => {
    setSingleClickHit(isSaveEnable);
  }, [isSaveEnable, setSingleClickHit]);
  const getSaveButtonClassName = () => {
    if (isOwner === false || validateCheckFinal) {
        return "whiteButtonFomulaCalculating";
      }
   if (baselineMissing) {
  return "whiteButtonFomulaCalculating";
}

    
    if (!(assessmentsData.isBaselineCalcUpdated === false && singleClickHit === false && allFlagsCalculated === true && bothPackFormulaStatus === false) && bothDataComplete) {
      if (responseDone) {
        return "calculatingButton";
      } else {
        return "calculatingButtonNonToggle";
      }
    } else {
      return "whiteButtonFomulaCalculating";
    }
  };

  const getButtonText = () => {
    if (responseDone) {
      return "Calculating";
    }
    return "Calculate";
  };

  const showEdited = () => {
    return assessmentFormulation?.isEdited && !isExperimental;
  };

  const getCursorType = (value: boolean) => {
    if (value) {
      return "not-allowed";
    }
    return "pointer";
  };

  const handleBothCalculation = (e: React.FormEvent) => {

    handleClickSaveButton(e);
    handleSavePacking(false)
    // After successful calculation logic
     setIsPackagingDirty(false);
  }
   

 const shouldDisableButton = (
  singleClickHit,
  allFlagsCalculated,
  bothPackFormulaStatus
) => {
  if (!isOwner || validateCheckFinal || !bothDataComplete) {
    return true;
  }

  return baselineMissing || (
    !assessmentsData.isBaselineCalcUpdated &&
    singleClickHit === false &&
    allFlagsCalculated === true &&
    bothPackFormulaStatus === false
  );
};
  useEffect(() => {
    setIsDataCompleted(formulationDataComplete)
  }, [formulationDataComplete, setIsDataCompleted])
  
  return (
    <>
      <Box className="formula-main-div">
      {
    (!formulationDataComplete)&& (
        <PartialDataWarning message="There are one or more incomplete data fields." />
    )
}
{
    (!assessmentsData?.formulation?.isCalculated || !newChangesInFormulation?.isCalculated) && allFlagsCalculated && assessmentsType=='baseline' && (
        <PartialDataWarning message="You’ve made changes, but haven’t recalculated your assessment." />
    )
}



        <Box
          className="formula-1div"
          sx={{
            display: "grid",
            position: "relative",
            height: {
              xs: "100%", // For smaller screens (optional)
              sm: "160px", // Matches max-width: 880px
              md: "160px",
              xl: "160px",
            },
          }}
        >
          {/* FML Number Section */}
          <Box className="fml-number">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="700"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                variant="subtitle1"
              >
                {`FML Number ${showEdited() ? "(Edited)" : ""}`}
              </Typography>

              <Tooltipcommon
                content={FML_NUMBER_TOOLTIP_CONTENT}
                direction="fml-top"
                disable={disabled?.netContent || !isOwner}
              >
                <InfoIcon />
              </Tooltipcommon>
            </div>
            <TextField
              className="disabledfield"
              variant="standard"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: "16px",
                },
                width: "100%", 
              }}
              value={formulationData.fmlCode}
              InputProps={{
                readOnly: true,
              }}
              disabled={true}
            />
          </Box>

          {/* Import Formula Section */}
          {showImportFormula && (
            <Box className="import">
              <button
                onClick={handleOpenImportFormulaPopup}
                disabled={!isOwner}
                style={{
                  cursor: getCursorType(!isOwner),
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: "400",
                  fontFamily: "kenvue-sans-regular",
                  padding: "14px",
                  backgroundColor: getColor(!isOwner),
                  color: "white",
                  borderRadius: "24px",
                  border: "1px",
                  width: "100%",
                }}
              >
                Import Formula
              </button>
            </Box>
          )}

          {/* Description Section */}
          <Box className="description">
            <Typography
              fontWeight="700"
              fontSize="13.33px"
              sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
            >
              Formula Description
            </Typography>
            <TextField
              className="disabledfield"
              variant="standard"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: "16px",
                },
                width: "100%", fontSize: "16px !important"
              }}
              value={formulationData.description}
              disabled={disabled?.description || !isOwner}
              name="description"
              onChange={handleChange}
            />
          </Box>

          {/* Save and Cancel Buttons */}
          <Box
            className="button-container"
            sx={{
              position: "absolute",
              top: "0px",
              right: "10px",
              display: "flex",
              gap: "10px",
            }}
          >
            {isCRUDAccessChecked && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {(responseDone) ?
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <img id='Vector' src={calculatingicon} alt="Calculating" />
                      <p className="calculating-text">{"Calculating"}</p>
                    </div> :
                    <button

                      onClick={handleBothCalculation}
                      className={getSaveButtonClassName()}
                      disabled={shouldDisableButton(singleClickHit, allFlagsCalculated, bothPackFormulaStatus)}

                    >
                      {getButtonText()}
                    </button>
                  }
                </div>
              </div>
            )}
          </Box>
        </Box>

        <Box
          className="top-Net"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "96px",
          }}
        >
          <Box
          data-testid="formulation-tooltip-box"
          onMouseEnter={()=>setEnableNetQuantityTooltip(true)}
          onMouseLeave={()=>setEnableNetQuantityTooltip(false)}>
            <CustomTooltip
              title={
                errors.netContent &&
                "Net Content cannot be 0, Please enter the valid Net Content value"
              }
              open={enableNetQuantityTooltip}
            >
              <div
                style={{

                  color: getColor(disabled?.netContent),
                }}
                className={errors.netContent ? "netcontent_error" : "netContent"}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    fontWeight="700"
                    fontSize={"13.33px"}
                    sx={{
                      fontFamily: "kenvue-sans !important",
                      fontWeight: "700",
                      color: getColor(disabled?.netContent || !isOwner),
                      // paddingLeft: errors.netContent ? "10px" : "0px",
                    }}
                    variant="subtitle1"
                  >
                    Net Contents
                  </Typography>
                  <Typography
                    fontWeight="400"
                    fontSize={"13.33px"}
                    sx={{ fontFamily: "kenvue-sans-regular", color: "red" }}
                    variant="subtitle1"
                    color={"red"}
                  >
                    *
                  </Typography>
                  <Tooltipcommon
                    content={NET_CONTENT_TOOLTIP_CONTENT}
                    direction="net-content-top"
                    disable={disabled?.netContent || !isOwner}
                    setEnableCustomTooltip={setEnableNetQuantityTooltip}
                  >
                    <InfoIcon />
                  </Tooltipcommon>
                </div>
                <div style={{ width: "150px", display: "flex" }}>
                  <div style={{ width: "68px" }}>
                    <form noValidate>
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        value={formulationData?.netContent ?? ""}
                        name="netContent"
                        onChange={(e) => {
                          const netContentValue = e.target.value;
                          // Allow only numbers and a single dot
                          if (netContentValue === "" || /^\d+(?:\.\d*)?$/.test(netContentValue)) {
                            handleChange(e);
                          }
                        }}
                        onBlur={handelBlurUnit}
                        sx={{
                          fontFamily: "kenvue-sans-regular",
                        '& .MuiInputBase-input': {
                          fontSize: "16px",
                          padding:'7px 0 5px'
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
                        type="number"
                        inputProps={{
                          inputMode: "decimal",
                          pattern: "[0-9]*\\.?[0-9]*",
                        }}
                        style={{
                          padding: "6px 0px",
                          cursor: getCursorType(mode === "view"),
                        }}
                        error={errors.netContent}
                        disabled={disabled?.netContent || !isOwner}
                        className="disabledfield"
                      /></form>
                  </div>

                  <div style={{ width: "100px", marginTop: "-3px" }}>
                    <FormControl
                      sx={{
                        m: 0,
                        minWidth: "auto",
                        border: "none",
                        "& fieldset": {
                          border: "none",
                        },
                      }}
                    >
                      <Select
                        sx={{
                          "& .MuiMenuItem-root":
                          {
                            backgroundColor: "none",
                          },
                        }}
                        disabled={disabled?.netContent || !isOwner}
                        className="disabledfield"
                        value={formulationData.netContentUnit}
                        name="netContentUnit"
                        onChange={handleChange}
                        error={errors.netContentUnit}
                        style={{
                          width: "auto",
                          fontFamily: "kenvue-sans-regular",
                          fontWeight: "700",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "16px",
                          color: getColor(disabled?.netContent || !isOwner),
                        }}
                      >
                        {formulationMasterData.netContent?.map((option) => (
                          <MenuItem sx={{
                            fontFamily: "kenvue-sans-regular",
                            fontWeight: "400",
                            fontSize: "16px", color: "black"
                          }} style={{ fontWeight: 700 }} key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </CustomTooltip>
          </Box>
          <FormField
            width="188px"
            label="Production Zone"
            required

            tooltipContent={PRODUCT_ZONE_TOOLTIP_CONTENT}
            dropdownOptions={formulationMasterData.productionZone?.map(
              (zone) => ({ value: zone, label: zone })
            )}
            dropdownValue={formulationData.productionZone}
            onDropdownChange={handleChange}
            name="productionZone"
            dropDownWidth="167px"
            error={errors.productionZone}
            disabled={disabled?.productionZone || !isOwner}
          />
          <FormField
            width="164px"
            label="Sales Zone"
            required
            tooltipContent={SALES_ZONE_TOOLTIP_CONTENT}
            dropdownOptions={formulationMasterData.salesZone?.map((zone) => ({
              value: zone,
              label: zone,
            }))}
            dropdownValue={formulationData.salesZone}
            onDropdownChange={handleChange}
            name="salesZone"
            dropDownWidth="135px"
            error={errors.salesZone}
            disabled={disabled?.salesZone || !isOwner}
          />
        </Box>
        <Box
          className="product"
          sx={{

          }}
        >
          <div
            className={errors.productSegment ? "select_errorProduct" : "productSegment"}
          >
            <SelectFieldLable
              lable="Product Segment"
              tooltipLable={PRODUCT_SEGMENT_TOOLTIP_CONTENT}
              disable={disabled?.productSegment || !isOwner}
            />
            <FormControl
              sx={{
                border: "none",
                "& fieldset": {
                  border: "none",
                },
              }}
              error={!!error}
              fullWidth
            >
              <Select
                value={formulationData.productSegment}
                name="productSegment"
                onChange={handleChange}
                error={errors.productSegment}
                disabled={disabled?.productSegment || !isOwner}
                className="disabledfield"
                sx={{
                  width: "174px",
                  fontFamily: "kenvue-sans-regular",
                  fontWeight: "400",
                  fontSize: "16px",
                  color: getColor(disabled?.productSegment || !isOwner),
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {formulationMasterData.segment?.map((product, index) => (
                  <MenuItem sx={{
                    fontFamily: "kenvue-sans-regular",
                    fontWeight: "400",
                    fontSize: "16px", color: "black"
                  }}
                    key={`${index}+${product.productSegment}`}
                    value={product.productSegment}
                  >
                    {product.productSegment}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div
            className={errors.productSubSegment ? "select_errorProduct" : "productSubSegment"}

          >
            <SelectFieldLable
              lable="Product Sub-segment"
              tooltipLable={PRODUCT_SUB_SEGMENT_TOOLTIP_CONTENT}
              disable={disabled?.productSubSegment || !isOwner}
            />
            <FormControl
              sx={{
                border: "none",
                "& fieldset": {
                  border: "none",
                },
              }}
            >
              <Select
                value={formulationData.productSubSegment}
                name="productSubSegment"
                onChange={handleChange}
                error={isImportFormula && errors.productSubSegment}
                disabled={disabled?.productSubSegment || !isOwner}
                className="disabledfield"
                sx={{
               "& .MuiMenuItem-root":
                  {
                    backgroundColor: "none",
                  },
                  fontFamily: "kenvue-sans-regular",
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "black",
                  width: "208px",
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {subSegments?.map((subSegment, index) => (
                  <MenuItem sx={{
                    fontFamily: "kenvue-sans-regular",
                    fontWeight: "400",
                    fontSize: "16px", color: "black"
                  }} key={`${index}+${subSegment}`} value={subSegment}>
                    {subSegment}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Box 
          onMouseEnter={()=>setEnableDoseTooltip(true)}
          onMouseLeave={()=>setEnableDoseTooltip(false)}
          >
          <CustomTooltip
            title={
              errors.useDose &&
              "Use Dose cannot be 0, Please enter the valid Use Dose value"
            }
            open={enableDoseTooltip}
          >
            <div
              className={errors.useDose ? "netcontent_error2" : "netContentArea"}
              style={{

                alignItems: "start",
                color: getColor(disabled?.useDose),
              }}
            >
              <SelectFieldLable
                lable="Use Dose"
                tooltipLable={USE_DOSE_TOOLTIP_CONTENT}
                disable={disabled?.useDose || !isOwner}
                setEnableCustomTooltip={setEnableDoseTooltip}
              />
              <div style={{ width: "150px", display: "flex" }}>
                <div style={{ width: "68px" }}>
                  <form noValidate>
                    <TextField
                      id="standard-basic"
                      variant="standard"
                      value={useDose}
                      name="useDose"
                      onChange={handleChange}
                      onBlur={handelBlurUnit}
                      error={errors.useDose}
                      disabled={disabled?.useDose || !isOwner}
                      className="disabledfield"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      style={{ padding: "6px 0px" }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: "16px",
                          padding:'7px 0 5px'
                        }
                      }}
                    /></form>
                </div>

                <div style={{ width: "100px", marginTop: "-3px" }}>
                  <FormControl
                    sx={{
                      m: 0,
                      minWidth: "auto",
                      border: "none",
                      "& fieldset": {
                        border: "none",
                      },
                    }}
                  >
                    <Select
                      sx={{
                        "& .MuiMenuItem-root":
                        {
                          backgroundColor: "none",
                          fontSize: "14px",
                          color: "black"
                        },
                      }}
                      value={formulationData.useDoseUnit}
                      name="useDoseUnit"
                      onChange={handleChange}
                      error={errors.useDoseUnit}
                      disabled={disabled?.useDose || !isOwner}
                      className="disabledfield"
                      style={{
                        width: "auto",
                        fontWeight: "700",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                        fontFamily: "kenvue-sans-regular !important",
                        color: "black"
                      }}
                    >
                      {formulationMasterData.useDose?.map((option) => (
                        <MenuItem sx={{
                          fontFamily: "kenvue-sans-regular",
                          fontWeight: "400",
                          fontSize: "16px",
                          color: "black"
                        }} key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </CustomTooltip>
          </Box>
          
          <FormField
            label="Use Scenario"
            required
            tooltipContent={USE_SCENARIO_TOLTIP_CONTENT}
            dropdownOptions={formulationMasterData.useScenario?.map((scenario) => ({
              value: scenario,
              label: scenario,
            }))}
            dropdownValue={formulationData.useScenario}
            onDropdownChange={handleChange}
            name="useScenario"
            dropDownWidth="135px"
            error={errors.useScenario}
            disabled={disabled?.useScenario || !isOwner}
          />
          <div className="Consumable-used-filed">
            <ConsumablesUsedField
              onHandleChange1={handleClick1}
              onHandleChange2={handleClick2}
              consumablesLable={formulationData.consumablesUsed}
              disabled={!isOwner}
            />
          </div>
        </Box>
      </Box>
      <div style={{ display: "flex", width: "100%", marginTop: "36px" }}>
        <div style={{ width: "auto", display: "flex" }}>
          <p
            style={{
              fontFamily: "kenvue-sans",
              fontWeight: "700",
              fontSize: "16px",
              margin: "0px",
              color: "black"
            }}
          >
            Formula Composition
          </p>
          {!isExperimental && (
            <img
              src={lockImage}
              alt="lock-icon"
              style={{ marginLeft: "5px" }}
            />
          )}
        </div>
      </div>
      <br />
      <FormulationAndCompositionTable
        mode={mode}
        formulationRawMaterials={formulationData.rawMaterials}
        handelFormulationTableChanges={handelFormulationTableChanges}
        isClear={isClear}
      />
      <br />
      <FormulationLegends />
      {/* <IntensityBar /> */}
      <PopupImportFormula
        key={dialogKey}
        open={importFormulaDialogOpen}
        onClose={handleCloseImportFormulaDialog}
        sendToParent={callChildData}
      />
      <DialogBox
        text={WARNING_MSG_CANCEL}
        buttonOneText="Cancel"
        buttonTwoText="Continue"
        open={showWariningMsg}
        onClose={handleCloseDialog}
        onClick={handleContinueDialogButton}
      />
      <DialogBox
        text={
          "You are editing the material composition of a formula. These changes are only captured in the SIP tool for simulation purposes. These changes will NOT reflect back in Concerto. The formula code will no longer be attached to this experimental assessment product"
        }
        buttonOneText="Cancel"
        buttonTwoText="Continue"
        open={isWarningEditDialog}
        onClose={handleCloseEditWarningDialog}
        onClick={handleContinueEditWarningDialogButton}
      />
    </>
  );
};
export default FormulaAndConsumer;
