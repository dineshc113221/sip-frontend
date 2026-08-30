import React from "react";
import { Typography } from "@mui/material";
import green_tick from "../../../assets/images/green-tick.svg";
interface IGoodJob {
  message: string;
}

const GoodJobAlert: React.FC<IGoodJob> = ({ message }) => (
  <div className="alert-container good-job-alert">
    <div className="alert" role="alert">
      <div className="alert-content">
        <div className="icon-column">
          <img src={green_tick} alt="Green Tick" className="green-tick" />
        </div>
        <div className="text-column">
          <Typography className="alert-headline">Good job!</Typography>
          <Typography className="alert-body">{message} </Typography>
        </div>
      </div>
    </div>
  </div>
);

export default GoodJobAlert;
