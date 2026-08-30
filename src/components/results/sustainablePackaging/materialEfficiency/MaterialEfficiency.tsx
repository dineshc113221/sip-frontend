import React from "react";
import "./materialEfficiency.scss";
import { Typography } from "@mui/material";
import {
  MATERIAL_EFFICIENCY_PARTONE,
  MATERIAL_EFFICIENCY_SECONDPART,
} from "../../strings";
import DetailedTable from "../../commonComponents/DetailedTable";
import HorizontalBarChart from "./HorizontalBarChartMaterial";
import { GraphTags } from "../../commonComponents/GraphTags";

export const MaterialEfficiency: React.FC = () => {
  return (
    <div className="main-section">
      <div className="top-section">
        <div className="top-heading">
          Has the material efficiency of the packaging been optimized?
        </div>
      
      <div className="top-main-section">
        <div className="top-content-section">
          <Typography className="inner-content heading">
            Kenvue’s Direction
          </Typography>
          <Typography className="inner-content">
            {MATERIAL_EFFICIENCY_PARTONE}
            <span className="inner-span">desired consumer experience</span> with
            the <span className="inner-span">most efficient structure.</span>
            {MATERIAL_EFFICIENCY_SECONDPART}
          </Typography>
        </div>
        <div className="top-graph-section">
          <div className="top-graph-headline">
            <Typography className="headline-text">
              Packaging material usage per dose*
            </Typography>
            <Typography className="subtext">
              *For self care products, dose is defined as the maximum product
              allowed in a 24 hour period.
            </Typography>
          </div>
          <HorizontalBarChart />
          <div className="graph-bottom-section">
            <Typography className="graph-text">
              Grams of packaging per dose*
            </Typography>
            <GraphTags />
          </div>
        </div>
      </div>
      </div>
      <div className="bottom-section">
        <Typography className="table-heading">Detailed Results</Typography>
        <DetailedTable currentTab={"MATERIAL_EFFICIENCY"} />
      </div>
    </div>
  );
};
