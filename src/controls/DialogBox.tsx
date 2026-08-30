import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import "../assets/css/Style.scss";
import { makeStyles } from "@mui/styles";
import Warning from "../assets/images/warning-icon.svg";
import "../assets/css/button.scss";

const useStyles = makeStyles(() => ({
  backdrop: { zIndex: 1400, color: "#fff" },
  dialog: {
    padding: "20px",
    borderRadius: "16px",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  },
  iconButton: {
    marginRight: "10px",
  },
  dialogContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom:"24px"
    
  },
  dialogActions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    margin: "0 5px",
  },
}));

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  text?: string;
  buttonOneText?: string;
  buttonTwoText?: string;
  isDeleteButtonHide?: boolean
}

const DialogBox: React.FC<PopupProps> = ({
  open,
  onClose,
  onClick,
  buttonOneText,
  buttonTwoText,
  text,
  isDeleteButtonHide
}) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.backdrop}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { width: "708px", height: "auto", borderRadius: "32px",padding:'10px' },
      }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <IconButton className={classes.iconButton}>
          <img src={Warning} alt="Warning" />
        </IconButton>
        <Typography
          fontWeight="bold"
          fontSize={"34.84px"}
          sx={{
            fontFamily: "kenvue-sans",
            height: "auto",
            color:'#000000'
          }}
          variant="h5"
        >
          Warning
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography
          fontSize={"14px"}
          sx={{ fontFamily: "kenvue-sans-regular", height: "auto" }}
          variant="subtitle1"
        >
          {text}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.dialogActions} sx={{justifyContent:'center'}}>
        <button
          onClick={onClose}
          className={`whiteButton ${classes.button}`}
        >
          {buttonOneText}
        </button>
        <button
          onClick={onClick}
          className={`blackButton ${classes.button}`}
          disabled={isDeleteButtonHide}
          style={{opacity:isDeleteButtonHide? 0.5 :1}}
        >
          {buttonTwoText}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
