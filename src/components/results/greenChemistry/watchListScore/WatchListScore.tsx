import React, { useContext } from "react";
import "./watchListScore.scss";
import {
  WATCH_LIST_SCORE_DIRECTION_CONTENT,
  WATCH_LIST_SCORE_GOOD_JOB_CONTENT,
  WATCH_LIST_SCORE_HEADING,
  WATCH_LIST_SCORE_WATCH_OUT_CONTENT,
  WATCH_LIST_SCORE_WATCH_OUT_SCORE_5_CONTENT,
} from "../constant";
import { Typography } from "@mui/material";
import GoodJobAlert from "../../commonComponents/GoodJobAlert";
import WatchOutAlert from "../../commonComponents/WatchOutAlert";
import DetailedTableWatchList from "./DetailedTableWatchList";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

export const WatchListScore: React.FC = () => {
  const { greenChemistryData } = useContext(ResultDataContext);
    const { isBaselineSkipped } = useContext(ProductDataContext);
  const myProductResult = parseFloat(greenChemistryData?.watchList?.max_watchlist_score_myproduct) || null;
  const baselineResult = parseFloat(greenChemistryData?.watchList?.max_watchlist_score_baseline) || null;
  const baselineContent = !isBaselineSkipped ? (
  <div className="inner-content-baseline">
    There are no Watch List ingredients present in the formula
  </div>
) : (
  <span
    style={{
      fontFamily: "Kenvue Sans",
      fontWeight: 700,
      fontStyle: "normal",
      fontSize: "15.02px",
      lineHeight: "120%",
      letterSpacing: "0%",
      verticalAlign: "middle",
      position: "relative",
      left: "4.5rem"

    }}
  >
    N/A
  </span>
);

  const renderDetailedTableOrMessage = () =>
    baselineResult !== null ? (
      <DetailedTableWatchList baseline={true}/>
    ) : baselineContent

  return (
    <div className="mainContainer">
      <div className="textContainer">
        <div className="text-heading">{WATCH_LIST_SCORE_HEADING}</div>
        <div className="subtext">
          <span className="direction-text">Kenvue’s Direction:</span>
          <span className="inner-text">
            {WATCH_LIST_SCORE_DIRECTION_CONTENT}
          </span>
        </div>
      </div>
      <div className="contentContainer tables-watchlist">
        <div className="leftContentContainer">
          <div className="baseline-container">
            <div className="baseline-heading">
              <div className="baseline-nested">
                <div className="ellipse" />
                <Typography className="baseline-product">
                  Baseline Product
                </Typography>
              </div>
            </div>
            {renderDetailedTableOrMessage()}
          </div>
        </div>
        <div className="rightContentContainer">
          <div className="myproduct-container">
            <div className="myproduct-heading">
              <div className="myproduct-nested">
                <div className="ellipse" />
                <Typography className="myproduct-product">
                  My Product
                </Typography>
              </div>
            </div>
            {myProductResult == null ? (
              <GoodJobAlert message={WATCH_LIST_SCORE_GOOD_JOB_CONTENT} />
            ) : (
              <WatchOutAlert
              message={
                myProductResult ==5
                  ? WATCH_LIST_SCORE_WATCH_OUT_SCORE_5_CONTENT
                  : WATCH_LIST_SCORE_WATCH_OUT_CONTENT
              }
            
                warning={myProductResult!=5}
              />
            )}
            {myProductResult !=null && <DetailedTableWatchList baseline={false}/>}
          </div>
        </div>
      </div>
      {myProductResult != null || baselineResult != null ?
        <div className="contentContainer">
          <div className="leftContentContainerEmpty"></div>
          <div className="footerContainer">
            <div className="footer-heading">Color Key</div>

            <div className="footer-color">
              {/* Score 3 */}
              <div className="score-3">
                <div className="rectangle"></div>
                <div className="text">
                  <div className="inner-content">3</div>
                  <div className="subtext">Consider <br />Alternatives</div>
                </div>
              </div>

              {/* Score 4 */}
              <div className="score-4">
                <div className="rectangle"></div>
                <div className="text">
                  <div className="inner-content">4</div>
                  <div className="subtext">Suggest <br />Avoiding Use</div>
                </div>
              </div>

              {/* Score 5 */}
              <div className="score-5">
                <div className="rectangle"></div>
                <div className="text">
                  <div className="inner-content">5</div>
                  <div className="subtext">Avoid <br />Use</div>
                </div>
              </div>
            </div>
          </div>
        </div> : ''
      }
    </div>
  );
};