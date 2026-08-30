/* eslint-disable */
import React, { ChangeEvent, useContext, useMemo } from "react";
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Tooltipcommon from "../../controls/Tooltip";
import "../../assets/css/SIP.css";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { CheckCRUDAccess } from "../../helper/GenericFunctions";
import checkedIcon from "../../assets/images/Checkbox.svg";
 
interface FormFieldProps {
  validateDropdownvalues: boolean;
  label: string;
  required?: boolean;
  tooltipContent: string;
  direction: string;
  value: string | string[];
  onChange: (
    e: SelectChangeEvent<any> | ChangeEvent<HTMLInputElement>
  ) => void;
  options?: string[] | null;
  name?: string;
  isEdited: boolean;
  isRecyclabilityField?: boolean;
}
 
const FormField: React.FC<FormFieldProps> = ({
  validateDropdownvalues,
  label,
  required = false,
  tooltipContent,
  direction,
  value,
  onChange,
  options = [],
  name,
  isEdited,
  isRecyclabilityField,
}) => {
  const { assessmentsType, usersData } = useContext(ProductDataContext);
 
  const isMultiSelect = label === "Recyclability Disruptors";
  const safeOptions = options || [];
 
  // PARSING LOGIC:
  const selectedValues: string[] = isMultiSelect
    ? Array.isArray(value)
      ? value
      : value && typeof value === "string"
        ? value.split(",")
        : []
    : [typeof value === "string" ? value : ""];
 
  // Validation Logic
  const isValuePresent = isMultiSelect
    ? selectedValues.every((v) => safeOptions.includes(v)) &&
    selectedValues.length > 0
    : safeOptions.includes(value as string);
 
  // Disable Logic
  const isFieldDisabled = useMemo(() => {
    if (CheckCRUDAccess(usersData, "consumer_packaging") === 0) {
      return true;
    }
    return false;
  }, [assessmentsType, isEdited]);
 
  const labelStyle = { color: "black" };
  const textStyle = { color: "black" };
 
  // Error Calculation
  const hasError = validateDropdownvalues
    ? isMultiSelect
      ? selectedValues.length === 0
      : !value || !isValuePresent
    : false;
 
  // --- Width Calculation ---
  let selectwidth = "120px";
  if (label === "Recyclability Disruptors") {
    selectwidth = "493px";
  } else if (label === "Finishing Process") {
    selectwidth = "200px";
  }
 
  // --- Custom Icons ---
  const CustomCheckedIcon = () => (
    <img
      src={checkedIcon}
      alt="checked"
      style={{ width: "24px", height: "24px" }}
    />
  );
 
  const CustomUncheckedIcon = () => (
    <span
      style={{
        width: "24px",
        height: "24px",
        border: "2px solid #000",
        borderRadius: "4px",
        display: "block",
        backgroundColor: "transparent",
        boxSizing: "border-box",
      }}
    />
  );
 
  // --- Multi Select Change Handler ---
  const handleMultiChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value: val },
    } = event;
 
    let newValues = typeof val === "string" ? val.split(",") : val;
 
    // "Select All" Logic
    if (newValues.includes("select-all")) {
      if (selectedValues.length === safeOptions.length) {
        newValues = [];
      } else {
        newValues = safeOptions;
      }
    }
 
    const syntheticEvent = {
      target: {
        value: newValues,
        name: name,
      },
    } as any;
 
    onChange(syntheticEvent);
  };

  // Shared MenuProps to prevent scrolling when open
  const sharedMenuProps = {
    disableScrollLock: false, // Changed to false to prevent window scroll when menu is open
    anchorOrigin: {
      vertical: 'bottom' as const,
      horizontal: 'left' as const,
    },
    transformOrigin: {
      vertical: 'top' as const,
      horizontal: 'left' as const,
    },
    PaperProps: {
      style: {
        zIndex: 1300,
        maxHeight: "415px",
        borderRadius: "8px",
        marginTop: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      },
    },
  };
 
  return (
    <div
      style={{
        width: isMultiSelect ? "493px" : "auto",
        height: isMultiSelect ? "85px" : "auto",
        padding: isMultiSelect ? "12px 16px" : (hasError ? "6px 12px" : "0px"),
        marginTop: label == "Component Type" ? "0px" : "-12px",
        backgroundColor: hasError ? "#fbd2d280" : "transparent",
        borderRadius: isMultiSelect ? "12px" : (hasError ? "20px" : "0px"),
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: isMultiSelect ? "8px" : "0px" }}>
        <Typography
          fontWeight="700"
          fontSize={"13.33px"}
          sx={{
            fontFamily: "kenvue-sans",
            fontWeight: "700",
            width: "max-content",
            ...labelStyle,
          }}
          variant="subtitle1"
        >
          {label}
        </Typography>
        {required && (
          <Typography
            fontWeight="400"
            fontSize={"13.33px"}
            sx={{ fontFamily: "kenvue-sans-regular" }}
            variant="subtitle1"
            color={"red"}
          >
            *
          </Typography>
        )}
        {tooltipContent !== "" && (
          <Tooltipcommon content={tooltipContent} direction={direction}>
            <InfoIcon style={{ ...textStyle, fontSize: '22px', marginLeft: '4px' }} />
          </Tooltipcommon>
        )}
      </div>
 
      <div>
        <FormControl sx={{ border: "none", "& fieldset": { border: "none" } }}>
          {isMultiSelect ? (
            /* --- MULTI SELECT --- */
            <Select
              multiple
              value={selectedValues}
              onChange={handleMultiChange}
              displayEmpty
              disabled={isFieldDisabled}
              className="disabledfield"
              renderValue={(selected) => {
                const selectedArr = selected as string[];
                const displayText = selectedArr.length === 0 ? "Select" : selectedArr.join(", ");
                return (
                  <span
                    style={{
                      fontFamily: "kenvue-sans-regular",
                      color: selectedArr.length === 0 ? "rgba(0, 0, 0, 0.6)" : "#000",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                    }}
                  >
                    {displayText}
                  </span>
                );
              }}
              sx={{
                width: "fit-content",
                minWidth: "70px",
                maxWidth: "392px",
                height: "24px",
                backgroundColor: "transparent !important",
                "&.Mui-focused": { backgroundColor: "transparent !important" },
                "& .MuiSelect-select": {
                  padding: "0px !important",
                  paddingRight: "28px !important",
                  paddingTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  height: "24px",
                  minHeight: "24px",
                  ...textStyle,
                },
                "& .MuiSelect-icon": {
                  right: "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#000",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
              MenuProps={{
                ...sharedMenuProps,
                PaperProps: {
                    ...sharedMenuProps.PaperProps,
                    style: {
                        ...sharedMenuProps.PaperProps.style,
                        width: "447px",
                        marginLeft: "-16px",
                    }
                }
              }}
            >
              {/* Select All Option */}
              <MenuItem
                value="select-all"
                sx={{
                  height: "56px",
                  width: "447px",
                  "&.Mui-selected": { backgroundColor: "transparent !important" },
                  "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" }
                }}
              >
                <Checkbox
                  checked={safeOptions.length > 0 && selectedValues.length === safeOptions.length}
                  icon={<CustomUncheckedIcon />}
                  checkedIcon={<CustomCheckedIcon />}
                  sx={{ padding: "4px 9px" }}
                />
                <ListItemText
                  primary="Select All"
                  primaryTypographyProps={{ fontFamily: "kenvue-sans-regular", fontSize: "16px" }}
                />
              </MenuItem>
 
              {/* Option List */}
              {safeOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    height: "56px",
                    width: "447px",
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" }
                  }}
                >
                  <Checkbox
                    checked={selectedValues.indexOf(option) > -1}
                    icon={<CustomUncheckedIcon />}
                    checkedIcon={<CustomCheckedIcon />}
                    sx={{ padding: "4px 9px" }}
                  />
                  <ListItemText
                    primary={option}
                    primaryTypographyProps={{ fontFamily: "kenvue-sans-regular", fontSize: "16px" }}
                  />
                </MenuItem>
              ))}
            </Select>
          ) : (
            /* --- SINGLE SELECT --- */
            <Select
              value={isValuePresent ? value : ""}
              name={name}
              onChange={onChange}
              displayEmpty
              disabled={isFieldDisabled}
              className="disabledfield"
              MenuProps={sharedMenuProps}
              sx={{
                "& .MuiSelect-select": {
                  padding: hasError ? "12.5px 0px" : "14.5px 0px",
                  backgroundColor: "none",
                  ...textStyle,
                },
              }}
              style={{
                width: isRecyclabilityField ? "auto" : selectwidth,
                fontFamily: "kenvue-sans-regular",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "24px",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "3px",
                ...textStyle,
              }}
            >
              <MenuItem
                className="textFormat"
                style={{
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "16px",
                }}
                disabled
                value=""
              >
                Select
              </MenuItem>
              {options?.map((option, i) => (
                <MenuItem
                  style={{
                    fontFamily: "kenvue-sans-regular",
                    fontSize: "16px",
                    color: "black",
                  }}
                  className="textFormat"
                  key={i + 1}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </div>
 
      {isRecyclabilityField && (
        <p style={{ marginTop: '8px', marginBottom: '0px' }}>
          <i className="textFormat" style={{ fontSize: "12px" }}>
            {"Please review Kenvue's "}
          </i>
          <a
            href="https://kenvue.sharepoint.com/teams/rndsustainability-kv/SitePages/Sustainable-Packaging.aspx"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "black",
              fontFamily: "kenvue-sans",
              fontWeight: "700",
              whiteSpace: "pre-line",
              textUnderlineOffset: "4px",
              fontSize: "12px",
            }}
          >
            {"Design for Recyclability Guidebook"}
          </a>
          <i className="textFormat" style={{ fontSize: "12px" }}>
            {" to determine component recyclability."}
          </i>
        </p>
      )}
    </div>
  );
};
 
export default FormField;