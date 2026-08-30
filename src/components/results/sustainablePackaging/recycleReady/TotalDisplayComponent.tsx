import React from "react";

interface ITotalDisplayComponentProps {
  baselinePercentage: string | undefined;
  myProductPercentage: string | undefined;
}

export const TotalDisplayComponent: React.FC<ITotalDisplayComponentProps> = ({
  baselinePercentage,
  myProductPercentage,
}: ITotalDisplayComponentProps) => {
  return (
    <div
      style={{
        display: "flex",
        border: "none",
      }}
    >
      <div style={{ width: "52%" }}></div>
      <div
        style={{
          display: "flex",
          border: "none",
          width: "48%",
        }}
      >
        <div style={{ width: "21%", textAlign: "center", color: "#2B2B2B" }}>
          Total
        </div>
        <div
          style={{
            width: "29%",
            textAlign: "center",
            fontWeight: "700",
            fontFamily: "kenvue-sans",
            fontSize: "14px",
          }}
        >
          {baselinePercentage}
        </div>
        <div style={{ display: "flex", width: "50%" }}>
          <div style={{ width: "44%" }}></div>
          <div
            style={{
              width: "56%",
              textAlign: "center",
              fontWeight: "700",
              fontFamily: "kenvue-sans",
              fontSize: "14px",
              paddingRight: "6px",
            }}
          >
            {myProductPercentage}
          </div>
        </div>
      </div>
    </div>
  );
};
