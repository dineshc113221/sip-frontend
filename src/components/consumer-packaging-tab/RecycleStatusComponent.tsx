import React from "react";

interface RecycleStatusComponentProps {
  staticRecycleStatus: string;
}

const RecycleStatusComponent: React.FC<RecycleStatusComponentProps> = ({
  staticRecycleStatus,
}) => {
  const getRecycleStatusText = (status: string) => {
    switch (status) {
      case "Recycle Ready":
        return "Recycle Ready";
      case "Not Recycle Ready":
        return "Not Recycle Ready";
      default:
        return "N/A";
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "32px",
        padding: "16px",
        marginBottom: "24px",
        backgroundColor: "#FBFAFA",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "200px",
          height: "54px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: "kenvue-sans-regular",
            fontSize: "13.33px",
            fontWeight: "700",
          }}
        >
          Recyclability Status<span style={{ color: "red" }}>*</span>
        </div>
        <div
          style={{
            fontFamily: "kenvue-sans-regular",
            fontSize: "16px",
            fontWeight: "400",
            paddingTop: "4px",
          }}
        >
          {getRecycleStatusText(staticRecycleStatus)}
        </div>
      </div>
    </div>
  );
};

export default RecycleStatusComponent;
