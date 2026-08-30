import React from "react";
import baselineGraphKey from "../../../assets/images/baselineGraphKey.svg";
import myProductGraphKey from "../../../assets/images/myProductGraphKey.svg";
import "./graphTags.scss";

export const GraphTags: React.FC = () => {
  return (
    <div className="graphtags-top-container">
      <div className="baseline-holder">
        <img src={baselineGraphKey} alt="baseline-key" />
        <p style={{ width: "53px" }} className="graph-tags-text">
          Baseline
        </p>
      </div>
      <div className="myproduct-holder">
        <img src={myProductGraphKey} alt="myproduct-key" />
        <p
          style={{
            width: "72px",
          }}
          className="graph-tags-text"
        >
          My Product
        </p>
      </div>
    </div>
  );
};
