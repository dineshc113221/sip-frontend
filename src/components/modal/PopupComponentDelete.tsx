import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import warningIcon from "../../assets/images/warningIcon.svg";
import "../../assets/css/Style.scss";

interface DeletePopupProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  dialogTitle?: string;
  dialogContent?: string;
  deleteHideButton?: boolean;
}

const DeletePopupBox: React.FC<DeletePopupProps> = ({
  open,
  onClose,
  onDelete,
  dialogTitle,
  dialogContent,
  deleteHideButton
}) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          width: "708px",
          borderRadius: "36px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
          gap: "10px",
          padding: "0px",
        }}
      >
        <img src={warningIcon} alt="warning" />

        <Typography
          fontSize={"34.84px"}
          sx={{
            fontFamily: "kenvue-sans",
          }}
        >
          {dialogTitle}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          overflow: "hidden",
          padding: "10px !important",
          fontFamily: "kenvue-sans-regular",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        {dialogContent}
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "24px",
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
            color: "black",
            borderRadius: "9999px",
            border: "1px solid black",
            cursor: "pointer",
            height: "56px",
          }}
        >
          Cancel
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
            width: "105px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "9999px",
            border: "1px",
            cursor: deleteHideButton? "not-allowed": "pointer",
            height: "56px",
            opacity: deleteHideButton ? 0.5 : 1
          }}
          disabled={deleteHideButton}
        >
          Delete
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePopupBox;
