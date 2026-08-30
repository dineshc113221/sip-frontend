import React, { useState,useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  Box,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import "../../assets/css/Style.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import close_icon from "../../assets/images/close_icon.svg";

interface WithoutBaselineProps {
  open: boolean;
  onClose: () => void;
  onSkipAssessment: () => void;
  dialogTitle?: React.ReactNode;
  dialogContent?: string;
  loading?:boolean;
  onJustificationEvent:(val:string)=>void;
  userCRUDAccess_assessment?:0|1;
  isChangeJustficationFlag:boolean
  onChangeJustification:()=>void;

}

export const WithoutBaselinePopupBox: React.FC<WithoutBaselineProps> = ({
  open,
  onClose,
  onSkipAssessment,
  dialogTitle,
  dialogContent,
  loading,
  onJustificationEvent,
  userCRUDAccess_assessment,
  isChangeJustficationFlag,
  onChangeJustification
}) => {

  const [justificationValue, setJustificationValue] = useState("");

  const commonFontStyle = {
    fontFamily: "kenvue-sans-regular",
    fontSize: "16px",
    backgroundColor: "transparent",
  };

  const isButtonDisabled = !justificationValue;
  
  const handleJustificationValue = (e: SelectChangeEvent) => {
    setJustificationValue(e?.target?.value);
      onJustificationEvent(e?.target?.value);
  }

  useEffect(() => {
  setJustificationValue("");
}, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          width: "750px",
          borderRadius: "36px",
          paddingLeft: "16px",
          paddingRight: "16px",
          maxWidth: "750px",
          height: "434px",
          overflow: "hidden"
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          <DialogTitle
            style={{
              display: "flex",
              width: "fit-content",
              alignItems: "center",
              padding: "16px 16px 0px 16px"
            }}
          >
            <Typography
              fontSize={"33.18px"}
              sx={{
                margin: "5px",
                fontWeight: "700",
                lineHeight: "120%",
                letterSpacing: "0%",
                fontSize: "33.18px",
                fontFamily: "kenvue-sans"
              }}
            >
              {dialogTitle}
            </Typography>
          </DialogTitle>
        </span>

       <button
  type="button"
  onClick={onClose}
  aria-label="Close"
  style={{
    display: "flex",
    position: "relative",
    top: "-10px",
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer"
  }}
>
  <img
    src={close_icon}
    alt=""
    style={{
      width: "28px"
    }}
  />
</button>

      </Box>
      <DialogContent
        sx={{
          fontFamily: "kenvue-sans-regular",
          fontSize: "13.33px",
          fontWeight: "400",
          lineHeight: "150%",
          padding: "16px 17px 23px 17px",
          flex: "none"

        }}
      >
        {dialogContent}
      </DialogContent>
      <Box sx={{ paddingLeft: "16px", paddingRight: "16px" }}>

        <Typography
          fontSize={"13.33px"}
          sx={{
            fontWeight: "700",
            lineHeight: "120%",
            letterSpacing: "0%",
            fontFamily: "kenvue-sans",
            paddingBottom: "12px"
          }}
        >
          Justification <Box component="span" sx={{ color: "error.main" }}>*</Box>
        </Typography>
        <Select
          style={{ height: "56px", border: "none", width: "100%", ...commonFontStyle }}
          onChange={handleJustificationValue}
          IconComponent={ExpandMoreIcon}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#999' }}>Select an option</span>;
            }
            return selected;
          }}
        >

          <MenuItem style={commonFontStyle} value={"Early-stage innovation: Baseline assessment not applicable at this stage"}>
            Early-stage innovation: Baseline assessment not applicable at this stage
          </MenuItem>

          <MenuItem style={commonFontStyle} value="New consumer benefit: No existing product reflects this consumer benefit">
            New consumer benefit: No existing product reflects this consumer benefit
          </MenuItem>

          <MenuItem style={commonFontStyle} value={"Data limitation: Baseline identified, but product data is unavailable in Kenvue systems"}>
            Data limitation: Baseline identified, but product data is unavailable in Kenvue systems
          </MenuItem>
        </Select>
        {
          justificationValue.length !==0 && <div
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "34px",
              backgroundColor: "#ECFDF5",
              borderRadius: "4px",
              boxSizing: "border-box",
              position: "relative",
              top: "20px",
              height:"34px"
            }}
          >
            <div
              style={{
                width: "3px",
                height: "34px",
                backgroundColor: "#008000",
                borderRadius: "9999px",
                marginRight: "10px",
                flexShrink: 0,
              }}
            />

            <span
              style={{
                color: "#404040",
                fontFamily: "Kenvue Sans",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "16px",
                letterSpacing: 0,
              }}
            >
              This project has been designated as a non-comparative assessment.
            </span>
          </div>
        }
      </Box>


      <DialogActions
        style={{
          display: "flex",
          justifyContent: "left",
          position: "relative",
         top:"2rem"
        }}
      >

        <button type="button" data-testid="save-button" aria-label="save"
          onClick={isChangeJustficationFlag ? onChangeJustification : onSkipAssessment}
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: "400",
            top: "20px",
            left: "20px",
            fontFamily: "kenvue-sans-regular",
            padding: "10px",
            width: "88px",
            background: "#000000",
            color: "white",
            borderRadius: "9999px",
            border: "1px",
            cursor: isButtonDisabled||loading ? "not-allowed" : "pointer",
            height: "56px",
            opacity: isButtonDisabled ? 0.5 : 1
          }}
          disabled={isButtonDisabled|| !userCRUDAccess_assessment}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default WithoutBaselinePopupBox;
