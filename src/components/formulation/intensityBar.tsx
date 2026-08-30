import React from "react";
import "../../assets/css/intensity.css";

const IntensityBar: React.FC = () => {
  return (
    <div
      style={{
        width: "376px",
        height: "80px",
        backgroundColor: "#F9FBFA",
        padding: "10px",
        float: "inline-end",
      }}
    >
      <span
        style={{
          color: "#2B2B2B",
          fontSize: "13.33px",
          fontWeight: "700",
          fontFamily: "kenvue-sans",
        }}
      >
        Intensity
      </span>
      <div className="bar-clipper">
        <div className="bar-wrapper">
          <span className="bar1"></span>
          <span className="bar2"></span>
          <span className="bar3"></span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            marginTop: "15px",
            color: "#2B2B2B",
            fontSize: "12px",
            fontFamily: "kenvue-sans-regular",
            fontWeight: "400",
          }}
        >
          Low
        </div>
        <div
          style={{
            marginLeft: "80%",
            marginTop: "15px",
            color: "#2B2B2B",
            fontSize: "12px",
            fontFamily: "kenvue-sans-regular",
            fontWeight: "400",
          }}
        >
          High
        </div>
      </div>
    </div>
  );
};

export default IntensityBar;
