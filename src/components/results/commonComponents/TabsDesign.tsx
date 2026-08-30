/* eslint-disable react-refresh/only-export-components */
import React, { useContext } from "react";
import { Card, Divider } from "@mui/material";
import arrow_full_small_up_green from "../../../assets/images/arrow_full_small_up_green.svg";
import arrow_full_small_down_green from "../../../assets/images/arrow_full_small_down_green.svg";
import full_arrow_right_small from "../../../assets/images/full_arrow_right_small.svg";
import arrow_full_small_down_red from "../../../assets/images/arrow_full_small_down_red.svg";
import arrow_full_small_up_red from "../../../assets/images/arrow_full_small_up_red.svg";
import warning_alert_icon from "../../../assets/images/alert_warning_icon.svg";
import { ITabInfoSustainable } from "../../../structures/result";
import { ResultDataContext } from "../../../contexts/resultData/ResultDataContext";
import { ProductDataContext } from "../../../contexts/productData/ProductDataContext";

interface TabsDesignProps {
  tab: ITabInfoSustainable;
  index: number;
  selectedTab: number;
  total_score?: string;
  handleTabClick: (index: number) => void;
  setCurrentSection: (section: string) => void;
}
interface TabValueRowProps {
  percentage: string;
  heading: string;
  total_score: string;
  assesmentReport?: boolean;
  isBaselineSkipped?:boolean
}

const getHeading = (total_score:string, heading:string) => {
  return total_score === 'green' && heading=='Total Score'? 'Total Score Green' : heading;
};

const getRenewableoriginScore = (percent:number) => {
  let arrowSrc = null;
  let formattedValue = "";
  if (percent > 0) {
    arrowSrc = arrow_full_small_up_green;
    formattedValue = `+${percent}%`;
  } else if (percent < 0) {
    arrowSrc = arrow_full_small_down_red;
    formattedValue = `${percent}%`;
  } else {
    formattedValue = '+0%';
  }
  return { arrowSrc, formattedValue };
};

const getGaiaScore = (percent:number) => {
  let arrowSrc = null;
  let formattedValue = "";
  if (percent > 0) {
    arrowSrc = arrow_full_small_up_green;
    formattedValue = `+${percent}`;
  } else if (percent < 0) {
    arrowSrc = arrow_full_small_down_red;
    formattedValue = `${percent}`;
  } else {
    formattedValue = '+0';
  }
  return { arrowSrc, formattedValue };
};

const getTotalScore = (roundedPercent:number) => {
  let arrowSrc = null;
  let formattedValue = "";
  if (roundedPercent > 0) {
    arrowSrc = arrow_full_small_up_green;
    formattedValue = `+${roundedPercent}`;
  } else if (roundedPercent < 0) {
    arrowSrc = arrow_full_small_down_red;
    formattedValue = `${roundedPercent}`;
  } else {
    formattedValue = '+0';
  }
  return { arrowSrc, formattedValue };
};

const getRecycleReadyScore = (roundedPercent:number) => {
  let arrowSrc = null;
  let formattedValue = "";
  if (roundedPercent > 0) {
    arrowSrc = arrow_full_small_up_green;
    formattedValue = `+${roundedPercent}%`;
  } else if (roundedPercent < 0) {
    arrowSrc = arrow_full_small_down_red;
    formattedValue = `${roundedPercent}%`;
  } else {
    formattedValue = '+0%';
  }
  return { arrowSrc, formattedValue };
};

const getMaterialEfficiency = (roundedPercent:number) => {
  let arrowSrc = null;
  let formattedValue = "";
  if (roundedPercent > 0) {
    arrowSrc = arrow_full_small_up_red;
    formattedValue = `+${roundedPercent}%`;
  } else if (roundedPercent < 0) {
    arrowSrc = arrow_full_small_down_green;
    formattedValue = `${roundedPercent}%`;
  } else {
    formattedValue = '+0%';
  }
  return { arrowSrc, formattedValue };
};

const getWatchListScore = (percent:number) => {
  let arrowSrc = null;
  let formattedValue = "";
  if (percent > 0) {
    arrowSrc = arrow_full_small_up_red;
    formattedValue = `+${percent}`;
  } else if (percent < 0) {
    arrowSrc = arrow_full_small_down_green;
    formattedValue = `${percent}`;
  } else {
    formattedValue = '+0';
  }
  return { arrowSrc, formattedValue };
};

export const TabValueRow: React.FC<TabValueRowProps> = ({
  percentage,
  heading,
  total_score,
  assesmentReport=false,
  isBaselineSkipped
}) => {
  let arrowSrc = null;
  let formattedValue = "";
  const { resultData , resultkey  } = useContext(ResultDataContext);
  const myProductWatchlistMaxScore = resultData?.[resultkey]?.watchlist?.max_watchlist_score || '0';

  const roundedPercent = Number(Number.parseFloat(percentage).toFixed());
  const percent = Number(Number.parseFloat(percentage).toFixed(1));
  heading = getHeading(total_score, heading);
  // Determine the arrow and formatting logic based on the heading
  switch (heading) {
    case 'Watch List Score':
      if (percentage === 'Fail') {
        formattedValue = percentage;
      } else {
        ({ arrowSrc, formattedValue } = getWatchListScore(percent));
      }
      break;
    
    case 'Renewable Origin Bonus':
      ({ arrowSrc, formattedValue } = getRenewableoriginScore(percent));
      break;
    case 'GAIA Score':
      ({ arrowSrc, formattedValue } = getGaiaScore(roundedPercent));
      break;
    case 'Total Score':
      ({ arrowSrc, formattedValue } = getTotalScore(roundedPercent));
      break;
    case 'Total Score Green':
      ({ arrowSrc, formattedValue } = getTotalScore(roundedPercent));
      break;
    case 'PCR Content':
    case 'Recycle Ready':
      ({ arrowSrc, formattedValue } = getRecycleReadyScore(roundedPercent));
      break;
    case 'Material Efficiency':
      ({ arrowSrc, formattedValue } = getMaterialEfficiency(roundedPercent));
      break;

    default:
      formattedValue = '+0';
      break;
  }

  if(assesmentReport) return (
    <span>
      <div style={{ display: "flex", alignItems: "center", fontSize: "23.04px", paddingRight: arrowSrc ? "0" : "10px" }}>
         {formattedValue} {arrowSrc && <img src={arrowSrc} alt="Arrow" style={{marginLeft: "10px"}}/>}
      </div>
    </span>
  )

  let displayValue;

if (!isBaselineSkipped) {
  displayValue = formattedValue;
} else if (heading === "Watch List Score") {
  displayValue = Number.parseFloat(myProductWatchlistMaxScore)==5 ? 'Fail' : 'Pass';
} else {
  displayValue = "--";
}


  return (
    <div className="tab-value-row">
      <div
        className={`${
          heading === "Total Score" && total_score != "green"
            ? "tabValueTotalScore"
            : "tabValue"
        }`}
      >
        {displayValue}
      </div>
      {!isBaselineSkipped && arrowSrc && <img src={arrowSrc} alt="Arrow" /> }
    </div>
  );
};

const TabsDesign: React.FC<TabsDesignProps> = ({
  tab,
  index,
  total_score,
  selectedTab,
  handleTabClick,
  setCurrentSection,
}) => {
  const { greenChemistryData } = useContext(ResultDataContext);
  const {  isBaselineSkipped } = useContext(ProductDataContext);
const regression = greenChemistryData?.renewableOriginBonus?.regression;
  return (
    <>
      <Card
        onClick={() => {
          setCurrentSection(tab.heading);
          handleTabClick(index);
        }}
        key={index + tab.heading}
        className={`tab-card ${selectedTab === index ? "selected" : ""}`}
      >
        <div className="table-details">
          <div className="top-section-heading">
          <div className="heading-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
  <span>{tab.heading}</span>
  {tab.heading === "Renewable Origin Bonus" && regression && (
    <img src={warning_alert_icon} alt="warning_icon" style={{ width: '24px', height: '24px' }} />
  )}
</div>


            {/* Call TabValueRow and pass tab.percentage */}
            {tab.heading != "Recyclability Disruptors" ? (
              <TabValueRow
                percentage={tab.percentage}
                heading={tab.heading}
                total_score={total_score}
                isBaselineSkipped={isBaselineSkipped}
              />
            ) : (
              <div className="tab-value-row">
                <div className="tabValue">{!isBaselineSkipped ? tab.percentage : tab.myproduct}</div>
              </div>
            )}
          </div>
          {(tab.baseline != null &&
            tab.myproduct != null &&
            tab.heading != "Total Score") ||
          total_score === "green" ? (
            <div className="product-info">
              <div className="product-column">
                <div
                  className={`productSection ${
                    total_score === "green" ? "productSection-green" : ""
                  }`}
                >
                  <div className="dot_grey_small_baseline_result_page"></div>
                  <div className="product-label">Baseline Product</div>
                </div>
                <span className="product-value">
                  {
                    !isBaselineSkipped ? <>
                    <span className="value">{tab.baseline}</span>
                  {tab.heading === "Material Efficiency" && (
                    <span className="unit"> g per dose</span>
                  )}
                    </> : <span className="value">{"N/A"}</span>
                  }
                </span>
              </div>
              <div className="product-column">
                <div
                  className={`productSection ${
                    total_score === "green" ? "productSection-green" : ""
                  }`}
                >
                  <div style={{marginRight:"0px"}} className="dot_grey_small_myproduct_result_page"></div>
                  <div className="product-label">My Product</div>
                </div>
                <span className="product-value">
                  <span className="value">{tab.myproduct}</span>
                  {tab.heading === "Material Efficiency" && (
                    <span className="unit"> g per dose</span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="product-info">
              <div className="product-column">&nbsp;</div>
              <div className="product-column">&nbsp;</div>
            </div>
          )}

          <div className="SeeDetailsTab">
            <button type="button" className="SeeDetailRow">
              <p className="see-details">See Details</p>
              <img src={full_arrow_right_small} alt="Arrow" />
            </button>
          </div>
        </div>
      </Card>

      {index < 1 && (
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ backgroundColor: "#B4B4B4" }}
        />
      )}
    </>
  );
};

export default TabsDesign;
