import { Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import "../../assets/css/tooltip.scss";
import { TIMEOUT_LIST } from "../../constants/String.constants";

const TimeoutPopupComponent = ({
  isPopupOpened,
  handleCloseTimeout,
  mfProps,
  labels,
}) => {
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = new Date(Date.now() + TIMEOUT_LIST.deadlineTime);

  const getTime = (deadline) => {
    const time = Date.parse(deadline.toString()) - Date.now();

    const calculateMin = Math.floor((time / 1000 / 60) % 60);
    const calculateSec = Math.floor((time / 1000) % 60);

    if ((calculateMin === 0 && calculateSec === 0) || calculateMin < 0) {
      sessionStorage.clear();
      localStorage.clear();
      mfProps?.publish("core-header-ui-mf:signout");
    }

    setMinutes(calculateMin);
    setSeconds(calculateSec);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={isPopupOpened} onClose={handleCloseTimeout}>
      <DialogContent dividers={true}>
        <div className="toast-overlay">
          <div className="toast" style={{ zIndex: "9999999", height: "auto" }}>
            <div className="toastDiv">
              <div className="toasttitleIcon">
                <span className="toastTitle">Session Expiry</span>
                <CloseIcon
                  onClick={handleCloseTimeout}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="toastSubTitle">
                {labels?.BODY_MSG ||
                  "Your session is about to expire due to inactivity. Please click 'Continue' to extend your session."}
              </div>
              <div className="toastSubTitle">
                {labels?.TIME_LEFT_MSG || "Time left:"} {minutes}:{seconds}
              </div>
            </div>
            <div className="toast-buttons">
              <button
                className="buttonCancel"
                onClick={() => mfProps?.publish("core-header-ui-mf:signout")}
              >
                {labels?.LOGOUT || "Logout"}
              </button>
              <button
                type="submit"
                onClick={handleCloseTimeout}
                className="buttonContinue"
              >
                {labels?.CONTINUE || "Continue"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeoutPopupComponent;
