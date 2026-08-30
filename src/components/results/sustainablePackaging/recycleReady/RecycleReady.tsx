import React, { useContext } from "react";
import "./recycleReady.scss";
import { Typography } from "@mui/material";
import { RECYCLE_READY_PARTONE, RECYCLE_READY_SECONDPART } from "../../strings";
import { HorizontalBarChart } from "./HorizontalBarChartRR";
import { RRDetailedResultsTable } from "./DetailedResultsTable";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { GraphTags } from "../../commonComponents/GraphTags";

export const RecycleReady: React.FC = () => {
  const { sustainablePackagingData } = useContext(ResultDataContext);
  const baselinePercentage =
    sustainablePackagingData?.tabs?.recycleReady?.baseline;
  const myProductPercentage =
    sustainablePackagingData?.tabs?.recycleReady?.myproduct;

  return (
    <div className="main-container">
      <div className="top-container">
        <Typography className="top-heading">
          Has the packaging been designed to be “recycle ready”?
        </Typography>
        <div className="top-main-container">
          <div className="top-content-container">
            <Typography className="inner-content heading">
              Kenvue’s Direction
            </Typography>
            <Typography className="inner-content">
              {RECYCLE_READY_PARTONE}
              <span className="inner-span">We are in control</span>
              {RECYCLE_READY_SECONDPART}
            </Typography>
            <Typography className="inner-content">
              The{" "}
              <a
                href="https://kenvue.sharepoint.com/teams/rndsustainability-kv/SitePages/Sustainable-Packaging.aspx"
                className="inner-span-underlined"
                target="_blank"
              >
                Design for Recyclability Guidebook
              </a>{" "}
              is Kenvue’s global guide to develop packaging that is designed to
              be recycled.
            </Typography>
          </div>
          <div className="top-graph-container">
            <h1>Proportion of "recycle ready" packaging</h1>
            <HorizontalBarChart
              data={sustainablePackagingData.recycleReady.barData}
            />
            <div
              style={{
                padding: "0px",
                height: "76px",
                display: "flex",
                flexDirection: "column",
                gap: "36px",
              }}
            >
              <p
                style={{
                  padding: "0px",
                  margin: "0px",
                  fontFamily: "kenvue-sans",
                  color: "#444444",
                  fontSize: "12px",
                }}
              >
                % of packaging “recycle ready” by weight
              </p>

              <GraphTags />
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-container">
        <Typography className="table-heading">Detailed Results</Typography>
        <div className="bottom-table-container">
          <RRDetailedResultsTable
            data={sustainablePackagingData.recycleReady.detailedData}
            baselinePercentage={baselinePercentage}
            myProductPercentage={myProductPercentage}
          />
        </div>
      </div>
    </div>
  );
};
