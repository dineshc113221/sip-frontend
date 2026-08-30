import React from "react";
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import Tooltipcommon from "../../controls/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CONSUMABLE_USED_TOOLTIP_CONTENT } from "../../constants/ExperimentalTooltip.constant";

type DropdownOption = {
  value: string;
  label: string;
};
type FormFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  tooltipContent?: string;
  dropdownOptions?: DropdownOption[];
  dropdownValue?: string;
  onDropdownChange: (e: SelectChangeEvent<string>) => void;
  marginLeftSide?: string;
  dropDownWidth?: string;
  error?: boolean;
  disabled: boolean;
  width?: string;
};

type ConsumablesUsedField = {
  onHandleChange1: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHandleChange2: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  consumablesLable: string;
};

type SelectFieldLableProp = {
  lable: string;
  tooltipLable: string;
  disable?: boolean;
  setEnableCustomTooltip?: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SelectFieldLable: React.FC<SelectFieldLableProp> = ({
  lable,
  tooltipLable,
  disable,
  setEnableCustomTooltip
}) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Typography
      fontWeight="700"
      fontSize={"13.33px"}
      sx={{
        fontFamily: "kenvue-sans",
        fontWeight: "700",
        color: disable ? "#444444BF" : "black",
      }}
      variant="subtitle1"
    >
      {lable}
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
      content={tooltipLable}
      disable={disable}
      direction={lable === "Use Dose" ? "use-dose-top" : "sales-zone-top"}
      setEnableCustomTooltip={setEnableCustomTooltip}
    >
      <InfoIcon />
    </Tooltipcommon>
  </div>
);

export const ConsumablesUsedField: React.FC<ConsumablesUsedField> = ({
  consumablesLable,
  onHandleChange1,
  onHandleChange2,
  disabled,
}) => (
  <>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography
        fontWeight="700"
        fontSize={"13.33px"}
        fontFamily="kenvue-sans"
        variant="subtitle1"
      >
        Consumables Used
      </Typography>

      <Tooltipcommon
        content={CONSUMABLE_USED_TOOLTIP_CONTENT}
        direction="cons-used-top"
      >
        <InfoIcon />
      </Tooltipcommon>
    </div>
    <div
      style={{
        width: "100px",
        marginTop: "7px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <IconButton
        onClick={onHandleChange2}
        disabled={disabled}
        style={{
          width: "35px",
          height: "35px",
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        <RemoveIcon />
      </IconButton>

      <span
        style={{
          fontFamily: "kenvue-sans-regular",
          fontSize: "16px",
          color: "black",
        }}
      >
        {consumablesLable === "" ? "0" : consumablesLable}
      </span>

      <IconButton
        onClick={onHandleChange1}
        disabled={disabled}
        style={{
          width: "35px",
          height: "35px",
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        <AddIcon />
      </IconButton>
    </div>
  </>
);

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required = false,
  tooltipContent,
  dropdownOptions,
  dropdownValue,
  onDropdownChange,
  marginLeftSide,
  dropDownWidth,
  error,
  disabled,
  width,
}) => (
  <div
    style={{
      width: width,
      marginLeft: marginLeftSide,
      padding: "16px",
      height: "86px",
    }}
    className={error ? "select_error" : ""}
  >
    <div style={{ display: "flex", alignItems: "center", marginLeft: "0px" }}>
      <Typography
        fontWeight="700"
        fontSize="13.33px"
        sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
        variant="subtitle1"
      >
        {label}
      </Typography>
      {required && (
        <Typography
          fontWeight="400"
          fontSize="13.33px"
          sx={{ fontFamily: "kenvue-sans-regular" }}
          variant="subtitle1"
          color="red"
        >
          *
        </Typography>
      )}
      {tooltipContent && (
        <Tooltipcommon content={tooltipContent} direction="product-zone-top">
          <InfoIcon />
        </Tooltipcommon>
      )}
    </div>
    <div style={{ width: "150px", display: "flex" }}>
      {dropdownOptions && (
        <div style={{ width: "100px", marginTop: "-3px" }}>
          <FormControl
            error={error}
            sx={{
              fontWeight: 400,
              fontSize: "13px",
              m: 0,
              width: dropDownWidth,
              minWidth: "auto",
              border: "none",
              "& fieldset": {
                border: "none",
              },
            }}
          >
            <Select
              sx={{
                "& .css-18jcskp-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                  {
                    backgroundColor: "none",
                  },
              }}
              error={error}
              value={dropdownValue}
              name={name}
              onChange={onDropdownChange}
              disabled={disabled}
              displayEmpty
              className="disabledfield"
              style={{
                width: "auto",
                fontFamily: "kenvue-sans-regular",
                fontWeight: "400",
                justifyContent: "start",
                alignItems: "center",
                fontSize: "16px",
                marginLeft: "-14px",
                color: "black",
              }}
            >
              <MenuItem
                sx={{
                  fontFamily: "kenvue-sans-regular",
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "black",
                }}
                value=""
              >
                Select
              </MenuItem>
              {dropdownOptions.map((option) => (
                <MenuItem
                  sx={{
                    fontFamily: "kenvue-sans-regular",
                    fontWeight: "400",
                    fontSize: "16px",
                    color: "black",
                  }}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  </div>
);

export default FormField;
