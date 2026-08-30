import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  FormControl,
  MenuItem,
} from "@mui/material";
import recycle_na from "../../assets/images/Recyclable_Icon.svg";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "../../assets/css/Style.scss";
import CloseIcon from "@mui/icons-material/Close";
import recycle_not_ready from "../../assets/images/recycle_not_ready.svg";
import recycle_ready from "../../assets/images/recycle_ready.svg";
import { Recyclability } from "../../structures/packaging";

const recyclabilityValue = ["Recycle Ready", "Not Recycle Ready"];

const RecyclabilityStatusPopup: React.FC<Recyclability> = ({
  open,
  componentType,
  popupPage,
  onClose,
  recordStatus,
  sendToParentComponent,
  index,
  status,
}) => {
  const [popupPageName, setPopupPageName] = useState<string>("");
  const [editRecycleStatus, setEditRecycleStatus] = useState<string>(status || "");
  const [showTextarea, setShowTextarea] = useState<string>("none");

  const handleClose = () => {
    onClose();
    setPopupPageName("");
    setEditRecycleStatus("");
    setShowTextarea("none");
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setEditRecycleStatus(event.target.value);
    if (event.target.value === recordStatus) {
      setShowTextarea("none");
    } else {
      setShowTextarea("block");
    }
  };

  const handleSave = async () => {
    sendToParentComponent(editRecycleStatus);
    onClose();
  };

  useEffect(() => {
    if (popupPageName.length === 0) {
      setPopupPageName(popupPage);
    }

    if (editRecycleStatus.length === 0) {
      setEditRecycleStatus(recordStatus);
    }
  }, [popupPageName.length, editRecycleStatus.length, popupPage, recordStatus]);

  const renderRecycleStatusButton = () => {
    const buttonStyle = {
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: "400",
      top: "20px",
      left: "20px",
      fontFamily: "kenvue-sans-regular",
      padding: "10px",
      marginTop: "5px",
      width: "10%",
      color: "white",
      borderRadius: "20px",
      border: "1px",
    };

    if (editRecycleStatus === "Select") {
      return (
        <div style={{ paddingLeft: "5px", paddingTop: "15px" }}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "grey",
            }}
          >
            Save
          </button>
        </div>
      );
    } else if (editRecycleStatus === "Recycle Ready") {
      return (
        <div
          style={{
            paddingLeft: "5px",
            paddingTop: "15px",
            display: showTextarea,
          }}
        >
          <button
            onClick={handleSave}
            style={{
              ...buttonStyle,
              backgroundColor: "black",
            }}
          >
            Save
          </button>
        </div>
      );
    } else {
      return (
        <div style={{ paddingLeft: "5px", paddingTop: "15px" }}>
          <button
            onClick={handleSave}
            style={{
              ...buttonStyle,
              backgroundColor: "black",
            }}
          >
            Save
          </button>
        </div>
      );
    }
  };

  return (
    <Dialog
      className="header"
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: { borderRadius: "32px", width: "758px" },
      }}
    >
      <DialogTitle
        className="header"
        sx={{ fontFamily: "kenvue-sans" }}
        fontWeight="bold"
        style={{ fontSize: "33.18px", fontWeight: "700" }}
      >
        Recyclability Status
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 28,
            top: 28,
            float: "right",
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ fontFamily: "kenvue-sans", fontWeight: "normal", height: "100%" }}
      >
        <span
          style={{
            fontFamily: "kenvue-sans-regular",
            fontWeight: "400",
            fontSize: "16px",
          }}
        >
          Through Kenvue's Healthy Lives Mission we're committed to making our
          packaging 100% recyclable or refillable by 2025.
          <br />
          <br />
          Please review Kenvue's{" "}
          <a
            style={{
              color: "black",
              fontWeight: "700",
              whiteSpace: "pre-line",
            }}
            href="https://kenvue.sharepoint.com/teams/rndsustainability-kv/SitePages/Sustainable-Packaging.aspx"
            target="_blank"
          >
            {" "}
            Design for Recyclability Guidebook
          </a>{" "}
          to determine whether this packaging component is Recycle Ready (DfR
          L1) or Not Recycle Ready (DfR L2 or L3).
        </span>
        <Grid item container direction="row">
          <Grid item xs={12}>
            <div style={{ width: "auto", marginTop: "25px" }}>
              <div
                className="packaging-popup-recyclable-ready-not-div-rcorners1"
                style={{ marginRight: "75px", display: "flex" }}
              >
                <div>
                  {(() => {
                    let imgSrc: string;
                    let imgAlt: string;

                    if (editRecycleStatus === "Select") {
                      imgSrc = recycle_na;
                      imgAlt = "Not recyclable";
                    } else if (editRecycleStatus === "Recycle Ready") {
                      imgSrc = recycle_ready;
                      imgAlt = "Recycle-ready";
                    } else {
                      imgSrc = recycle_not_ready;
                      imgAlt = "Not recycle-ready";
                    }

                    return (
                      <img
                        src={imgSrc}
                        alt={imgAlt}
                        className="packaging-popup-recyclable-ready-not"
                      />
                    );
                  })()}
                </div>

                <div style={{ paddingLeft: "10px" }}>
                  <p className="packaging-popup-recyclable-ready-not-lable1">
                    {componentType}
                  </p>
                  <span className="packaging-popup-recyclable-ready-not-lable2">
                    <div style={{ display: "flex" }}>
                      <div style={{ fontWeight: 700 }}>
                        Recyclability Status{" "}
                        <span style={{ color: "red" }}>*</span>{" "}
                      </div>
                      <div style={{ marginTop: "-10px" }}>
                        <FormControl
                          sx={{
                            m: 1,
                            border: "none",
                            "& fieldset": {
                              border: "none",
                            },
                          }}
                        >
                          <Select
                            style={{
                              height: "28px",
                              border: "none",
                              fontWeight: "400",
                            }}
                            displayEmpty
                            value={editRecycleStatus}
                            onChange={handleChangeStatus}
                            name={`recyclability_status_${index}`}
                          >
                            <MenuItem disabled value={editRecycleStatus}>
                              Select
                            </MenuItem>

                            {recyclabilityValue.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </span>
                </div>
              </div>

              {renderRecycleStatusButton()}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RecyclabilityStatusPopup;
