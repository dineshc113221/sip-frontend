import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,

  Box,

} from "@mui/material";
import "../../assets/css/Style.scss";
import close_icon from "../../assets/images/close_icon.svg";
import warningIcon from "../../assets/images/warningIcon.svg";

interface ConfirmationWithoutBaselineProps {
  open: boolean;
  onClose: () => void;
  onAddBaseline: () => void;
  dialogTitle?: React.ReactNode;
  dialogContent?: string;
  userCRUDAccess_assessment:0 | 1;
}

export const ConfirmationWithoutBaselinePopupBox: React.FC<ConfirmationWithoutBaselineProps> = ({
  open,
  onClose,
  onAddBaseline,
  dialogTitle,
  dialogContent,
  userCRUDAccess_assessment
}) => {

            
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          width: "708px",
          borderRadius: "36px",
          paddingLeft: "16px",
          paddingRight: "16px",
          maxWidth: "708px",
          height: "204px",
          overflow: "hidden"
        },
      }}
    >
      <Box sx={{ padding: "0" }} >
        <span>
          <DialogTitle style={{
            padding: 0,
            paddingBottom: "6px",
            paddingTop: "16px"
          }}>
            <Typography
              fontSize={"33.18px"}
              sx={{
                margin: "5px",
                fontWeight: "700",
                lineHeight: "120%",
                letterSpacing: "0%",
                fontSize: "33.18px",
                fontFamily: "kenvue-sans",
                padding: "0px"
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, textAlign: "center" }}>
                  <img src={warningIcon} alt="warning" style={{
                    position: "relative",
                    right: "10px",
                    width: "25px",
                    height: "25px"
                  }} />
                  {dialogTitle}
                </div>
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    top: "-15px",
                    left: "5px"
                  }}
                >
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={close_icon}
                      alt=""
                      style={{ width: "16px" }}
                    />
                  </button>
                </div>

                
              </div>
            </Typography>
          </DialogTitle>
        </span>
      </Box>

      <DialogContent
        sx={{
          fontFamily: "kenvue-sans-regular",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "150%",
          flex: "none",
          padding: "0",
          width: "65%",
          position: "relative",
          alignItems: "center",
          textAlign: "center",
          left: "15%",
          color: "#000000"
        }}
      >
        {dialogContent}
      </DialogContent>

      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: "0.7rem"
        }}
      >

        <button type="button" data-testid="cancel-button" aria-label="cancel"
          onClick={onClose}
          style={{
            fontSize: "16px",
            fontWeight: 400,
            top: "20px",
            left: "20px",
            fontFamily: "kenvue-sans-regular",
            padding: "10px",
            width: "105px",
            backgroundColor: "white",
            color: "#000000",
            borderRadius: "9999px",
            border: "1px solid #000000",
            cursor: "pointer",
            height: "56px",
            lineHeight: "150%",
          }}
          disabled={!userCRUDAccess_assessment}

        >
          Cancel
        </button>
        <button type="button" data-testid="add-baseline-button" aria-label="add-baseline"
          onClick={onAddBaseline}
          style={{
            fontSize: "16px",
            lineHeight: "150%",
            fontWeight: 400,
            top: "20px",
            left: "20px",
            fontFamily: "kenvue-sans-regular",
            padding: "10px",
            width: "188px",
            backgroundColor: "#000000",
            color: "white",
            borderRadius: "9999px",
            border: "1px solid #000000",
            cursor: "pointer",
            height: "56px",
            letterSpacing: 0,
          }}
          disabled={!userCRUDAccess_assessment}

        >
          Yes, add baseline
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationWithoutBaselinePopupBox;
