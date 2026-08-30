/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { TextField, Tooltip, Typography, FormControl, Select,MenuItem } from "@mui/material";
import Tooltipcommon from "../../controls/Tooltip";
import {
 
  COMPONENT_TYPE,
  COMPONENT_WEIGHT,
  OPACIFIERS,
} from "../../constants/ExperimentalTooltip.constant";
import FormField from "./FormField";
import { PackagingComponentData } from "../../structures/packaging";
import usePackaging from "./usePackaging";
import { useConsumerPackagingContext } from "./ConsumerPackagingContext";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { CheckCRUDAccess } from "../../helper/GenericFunctions";
interface PackagingComponent {
  componentId:number;
  packagingtype:  'Primary' | 'Secondary';
  componentData: PackagingComponentData;
  isNewComponent: boolean;
  isImportDataCheck: boolean;
}
export const WeightFliedComp: React.FC<PackagingComponent> = ({
    isNewComponent,
    packagingtype,
    componentId,
  componentData,
    isImportDataCheck
}) => {
const {
    componentUnits,
    error,
    isImportData,
  handleComponentUnitsChange,
   
  } = usePackaging(
    isNewComponent,
    packagingtype,
    componentId,
    componentData
    );
  const [weightSavedValue,setWeightSavedValue] =useState<string>("");
  const { usersData } = useContext(ProductDataContext);
  const { handleChange } = useConsumerPackagingContext();

   //for temporary Disable lock fetaure in future we can add this for baseline and final --- ((assessmentsType === "baseline" || assessmentsType === "final") && componentData.fieldsExist?.weight)
  const isFieldDisabled = CheckCRUDAccess(usersData, "consumer_packaging") === 0;

  const weightError = error || ((componentData._id !== undefined || isImportDataCheck) && (componentData?.weight?.trim()) === "" || componentData?.weight === null);
  useEffect(() => {
   componentData && setWeightSavedValue(componentData.weight ? componentData.weight :"")
  }, [])
    
    return (
        <Tooltip
              title={error || ""}
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
            >
              <div
                style={{
                  width: "196px",
                  padding: weightError ? "10px" : "0px",
                  marginTop: weightError ? "-8px" : "0px",
                  backgroundColor: weightError ? "#fbd2d280" : "transparent", // Light red background on error
                  borderRadius: weightError ? "20px" : "0px", // Optional: Add rounded corners for better appearance
                  paddingBottom: weightError ? "inherit" : "0px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    fontWeight="700"
                    fontSize={"13.33px"}
                    sx={{ fontFamily: "kenvue-sans",width:"max-content", fontWeight: "700", color: "#000000"
                    }}
                    variant="subtitle1"
                  >
                    Component Weight
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
                    content={COMPONENT_WEIGHT}
                    direction="net-content-top"
                  >
                    <InfoIcon />
                  </Tooltipcommon>
                </div>
                <div style={{ width: "120px", display: "flex" }}>
            <div style={{ width: "70px" }}>
              <form noValidate>
                <TextField
                                        id="standard-basic"

                      className="disabledfield"

                      variant="standard"
                      placeholder="0.000"
                      value={componentData?.weight?.toString() || ''}
                      onChange={(e) => {
                      
                      
                          handleChange(e, packagingtype, componentData._id === undefined, isImportData);
                       
                  }}
                  sx={{

                        "& .MuiInputBase-input": {
                          width: "53px",
                          padding: "4.5px 0px",
                          marginLeft: "5px",
                          fontFamily: "kenvue-sans-regular !important",
                          fontSize:'16px !important'
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
                      disabled={(isFieldDisabled &&  weightSavedValue !== "" &&  weightSavedValue  === componentData?.weight?.toString())}
                      name={`weight_${componentId}`}
                    /></form>
                  </div>
                  <div
                    style={{
                      width: "100px",
                      marginTop: "-1px",
                    }}
                  >
                    <FormControl
                      sx={{
                        m: 0,
                        minWidth: "auto",
                        border: "none",
                        "& fieldset": {
                          border: "none",
                  },
                        "& .MuiOutlinedInput-input":{
                          padding:"5px 32px 0px 0px;"
                        }
                      }}
                    >
                      <Select
                        required
                        value={componentUnits}
                        onChange={handleComponentUnitsChange}
                        disabled={(isFieldDisabled && componentData?.weight?.toString() !== "")}
                        className="disabledfield"
                        style={{
                          width: "auto",
                          fontFamily: "kenvue-sans",
                          fontSize: "16px",
                          fontWeight: "700",
                          lineHeight: "24px",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft:'7px'
                        }}
                  name={`weight_unit_${componentId}`}
                >
                  <MenuItem style={{
                               fontFamily: "kenvue-sans-regular",
                               fontSize: "16px",
                  }} value="g">g</MenuItem>
                  <MenuItem style={{
                               fontFamily: "kenvue-sans-regular",
                               fontSize: "16px",
                  }} value="ml">ml</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </Tooltip>
    )
}
export const PackagingComponent: React.FC<PackagingComponent> = ({
  componentId,
  packagingtype,
  componentData,
  isNewComponent,
  isImportDataCheck
}) => {
const {
  isImportData,
  packagingMasterData,
  } = usePackaging(
    isNewComponent,
    packagingtype,
    componentId,
    componentData
    );
  const { handleChangeSelect } = useConsumerPackagingContext();

    return (
        <>
           <div className="packing-accordiondetails-form">
             <FormField
              validateDropdownvalues={componentData._id !== undefined || isImportDataCheck}
              label="Component Type"
              name={`component_type_${componentId}`}
              required
              tooltipContent={COMPONENT_TYPE}
              direction="packaging-filed-top"
              value={componentData?.component_type || ''}
              onChange={(e)=>handleChangeSelect(e,packagingtype,componentData._id===undefined,isImportData) }   
              options={packagingMasterData?.componentType}
              isEdited={componentData.fieldsExist?.component_type}
            />
          <WeightFliedComp isNewComponent={isNewComponent} componentData={componentData}
            componentId={componentId} packagingtype={packagingtype} isImportDataCheck={isImportDataCheck} />
                        
              <FormField
                  isEdited={componentData.fieldsExist?.opacifier}
                  // Update validation logic: check if ID exists OR import check is true
                  validateDropdownvalues={componentData._id !== undefined || isImportDataCheck}
                  label="Recyclability Disruptors"
                  name={`opacifier_${componentId}`}
                  required
                  tooltipContent={OPACIFIERS}
                  direction="recyclability-isruptors"
                  // Ensure value is a string (even if empty) so FormField can split it safely
                  value={componentData?.opacifier || ''} 
                  onChange={(e) => handleChangeSelect(e, packagingtype, componentData._id === undefined, isImportData)}
                  options={packagingMasterData?.opacifier} 
              />
          
          </div>
          <div style={{ width: "1325px", display: "flex", marginTop: "32px" }}>
          <FormField
                validateDropdownvalues={componentData._id !== undefined || isImportDataCheck}
              label="Recyclability Status"
              name={`recyclability_status_${componentId}`}
              required
              tooltipContent="Recyclability Status"
              direction="packaging-filed-top"
              value={componentData?.recyclability_status || ''}
              onChange={(e)=>handleChangeSelect(e,packagingtype,componentData._id===undefined,isImportData) }
              options={["Recycle Ready", "Not Recycle Ready"]}
              isEdited={componentData.fieldsExist?.recyclability_status}
              isRecyclabilityField={true}
            />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "auto", display: "flex" }}>
              <p
                style={{
                  fontFamily: "kenvue-sans",
                  fontWeight: "700",
                fontSize: "16px",
                  color:'#000000'
                }}
              >
               Component Composition
     
              </p>
            </div>
          </div>
        </>
    )
}