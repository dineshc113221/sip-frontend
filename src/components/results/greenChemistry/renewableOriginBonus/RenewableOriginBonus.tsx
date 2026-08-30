import React, { useContext } from "react";
import "./renewableOriginBonus.scss";
import PcrDonutChart from "../../sustainablePackaging/pcrContent/PcrDonutChart";
import { GraphTags } from "../../commonComponents/GraphTags";
import { Typography } from "@mui/material";
import {
  RENEWABLE_ORIGIN_BONOUS_CONTENT_WATCHOUT,
  RENEWABLE_ORIGIN_BONOUS_KENVUE_CONTENT,
} from "../constant";
import DetailedTable from "../../commonComponents/DetailedTable";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import WatchOutAlert from "../../commonComponents/WatchOutAlert";
import InfoAlert from "../../commonComponents/InfoAlert";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

export const RenewableOriginBonus: React.FC = () => {
  const { greenChemistryData } = useContext(ResultDataContext);
  const { isBaselineSkipped } = useContext(ProductDataContext);

  const dialData = greenChemistryData?.renewableOriginBonus?.dialData || { baseline: '0', myproduct: '0', per_pcr_diff: '0' };
  const regression = greenChemistryData?.renewableOriginBonus?.regression;
  return (
    <div className="renewable-origin-container">
      {regression ? <WatchOutAlert
        message={RENEWABLE_ORIGIN_BONOUS_CONTENT_WATCHOUT}
        warning={true}
        width={"100%"}
      /> : ""}

      { isBaselineSkipped &&
        <InfoAlert
  message="Products showing regression from baseline in GAIA score or Watch List score are not eligible for the Renewable Origin Bonus. As this is a non-comparison assessment, the Renewable Origin Bonus will be applied automatically."
/>}
      
      <div className="heading-container">
        <span className="heading-title1">
          What proportion of the organic ingredients in my formula are from a
          renewable origin?
        </span>
      </div>
      
      <div className="content-container">
        <div className="left-section">
          <Typography className="inner-section heading">
            Kenvue’s Direction:
          </Typography>
          <Typography className="inner-section">
            {RENEWABLE_ORIGIN_BONOUS_KENVUE_CONTENT}
          </Typography>
        </div>
        <div className="right-section">
          <div className="chart-container">
            <Typography className="chart-heading">
              Proportion of organic ingredients from a renewable origin
            </Typography>

            <PcrDonutChart
              dialsData={dialData}
              chartSection={"renewableOriginBonus"}
            />
            <GraphTags />
          </div>
        </div>
      </div>
      <div className="bottom-section-table">
        <Typography className="table-heading">Detailed Results</Typography>
        <DetailedTable currentTab="RENEWABLE"/>
      </div>
    </div>
  );
};
