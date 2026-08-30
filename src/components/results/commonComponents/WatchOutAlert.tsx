import React from 'react';
import { Typography } from '@mui/material';
import red_cross_icon from "../../../assets/images/red-cross-icon.svg";
import warning_alert_icon from "../../../assets/images/alert_warning_icon.svg";
interface IWatchOut {
  message: string;
  warning?: boolean;
  width?:string;
}

const WatchOutAlert: React.FC<IWatchOut> = ({ message, warning,width }) => {
 
  return (
    <div
      className={`alert-container watch-out-alert ${
        warning ? "warning-alert" : "error-alert"
      }`}
    >
      <div className="alert" role="alert" style={{height:warning? '76px':''}}>
        <div className="alert-content" style={{width: width||''}}>
          <div className="icon-column">
            {warning ? (
              <img
                src={warning_alert_icon}
                alt="Warning Alert"
                className="warning-alert-icon"
              />
            ) : (
              <img
                src={red_cross_icon}
                alt="Red Cross"
                className="red-cross-icon"
              />
            )}
          </div>
          <div className="text-column">
            <Typography className="alert-headline">Watch out!</Typography>
            <Typography className="alert-body">{message}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchOutAlert;