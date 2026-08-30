import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import warningIcon from "../../assets/images/warningIcon.svg";

interface DeletePopupProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  dialogTitle?: string;
  dialogContent?: string;
  buttonOneText?: string;
  buttonTwoText?: string;
}

const DeleteSubcomponentPopup: React.FC<DeletePopupProps> = ({
  open,
  onClose,
  onDelete,
  dialogTitle,
  dialogContent,
  buttonOneText,
  buttonTwoText
}) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          display: 'flex',
          flexDirection: 'column',
          width: '708px',
                    height: '222px',
          borderRadius: '32px',
          padding: '16px',
          maxWidth: '708px !important',
          gap: '16px',
          margin:'0px',
          borderWidth: '1px',
          // position: 'absolute',
        },
       
      }}
    >
        <Box
        sx={{
          width: '676px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignSelf: 'stretch',
          
        }}
      >
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
          padding: "0px",
        }}
      >
        <img src={warningIcon} alt="warning" />

        <Typography
          fontSize={"34.84px"}
          sx={{
            fontFamily: "kenvue-sans",
            color: '#000000',
            fontWeight: 700,
            lineHeight: '120%',
            letterSpacing:'0%',
           marginLeft:'12px'
          }}
        >
          {dialogTitle}
        </Typography>
      </DialogTitle>
     <DialogContent
  sx={{
    display: "flex",
    justifyContent: "center", // Centers the child div
    alignItems: "center",     // Optional, vertically centers if needed
    overflow: "hidden",
    padding: "10px !important",
    fontFamily: "kenvue-sans-regular",
            color: "#000000",
    marginTop:'10px'
  }}
>
  <div
    style={{
      width: "448px",
      fontWeight: 400,
      fontStyle: "normal",
      fontSize: "13.33px",
      lineHeight: "150%",
      textAlign: "center",
    }}
  >
    {dialogContent}
  </div>
</DialogContent>

      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "20px",
          padding: "0px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: "400",
            top: "20px",
            left: "20px",
            fontFamily: "kenvue-sans-regular",
            padding: "10px",
            width: "105px",
            backgroundColor: "white",
            color: "#000000",
            borderRadius: "9999px",
            border: "1px solid black",
            cursor: "pointer",
            height: "56px",
          }}
        >
                    {buttonOneText}

        </button>
        <button data-testid= "delete-confirm-button" aria-label="Confirm delete"
          onClick={onDelete}
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: "400",
            top: "20px",
            left: "20px",
            fontFamily: "kenvue-sans-regular",
            padding: "10px",
            width: "115px",
            backgroundColor: "black",
            color: "#ffffff",
            borderRadius: "9999px",
            border: "1px",
            cursor: "pointer",
            height: "56px",
            opacity: 1,
            marginLeft:'0px'
          }}
        >
          {buttonTwoText}

        </button>
        </DialogActions>
        </Box>
    </Dialog>
  );
};

export default DeleteSubcomponentPopup;
