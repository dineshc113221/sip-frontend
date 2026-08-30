import React, { useContext } from "react";
import "./recyclabilityDisruptors.scss";
import { RECYCLABILITY_DISRUPTORS, RECYCLABILITY_DISRUPTORS_GOOD_JOB_CONTENT, RECYCLABILITY_DISRUPTORS_WATCH_OUT_CONTENT } from "../../strings";
import { Typography } from "@mui/material";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import DetailedTableDisruptors from "./DetailedTableDisruptors";
import GoodJobAlert from "../../commonComponents/GoodJobAlert";
import WatchOutAlert from "../../commonComponents/WatchOutAlert";

const RecyclabilityDisruptors: React.FC = () => {
  const { sustainablePackagingData } = useContext(ResultDataContext);
  const myProductResult = sustainablePackagingData?.disruptors?.watchOut;
  const baselineResult=sustainablePackagingData?.tabs?.disruptors?.baseline;

  const renderDetailedTableOrMessage = (isBaseline: boolean) => (
    baselineResult !== "Pass" ? (
      <DetailedTableDisruptors baseline={isBaseline} />

    ) : (
      <div className="inner-content-baseline">
        There are no recyclability disruptors present in the packaging.
      </div>
    )
  );

  return (
    <div className="main-container">
      <Typography className="top-heading">
        Are there any recyclability disruptors present in the packaging?
      </Typography>

      <div className="top-content-section">
        <Typography className="inner-content heading">Kenvue’s Direction:</Typography>
        <Typography className="inner-content">{RECYCLABILITY_DISRUPTORS}</Typography>
      </div>

      <div className="bottom-layout">
        <div className="left-section">
          <div className="nested-layout">
            <div className="first-line-layout">
              <div className="ellipse-baseline-container">
                <div className="ellipse" />
                <Typography className="baseline-product">Baseline Product</Typography>
              </div>
            </div>
            {renderDetailedTableOrMessage(true)}
          </div>
        </div>

        <div className="right-section">
          <div className="nested-layout">
            <div className="first-line-layout">
              <div className="ellipse-my-product-container">
                <div className="ellipse" />
                <Typography className="my-product">My Product</Typography>
              </div>
            </div>

            {myProductResult !== "Watch Out!!!" ? <GoodJobAlert message={RECYCLABILITY_DISRUPTORS_GOOD_JOB_CONTENT}/> : <WatchOutAlert message={RECYCLABILITY_DISRUPTORS_WATCH_OUT_CONTENT}/>}
            {myProductResult === "Watch Out!!!" && <DetailedTableDisruptors baseline={false} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclabilityDisruptors;
