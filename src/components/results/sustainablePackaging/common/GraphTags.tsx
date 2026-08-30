import React from "react";

interface GraphTagPropType {
  title: string;
  color: string;
}

export const GraphTag: React.FC<GraphTagPropType> = ({
  title,
  color,
}: GraphTagPropType) => {
  return (
    <div
      style={{
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid",
        height: "30px",
        paddingRight: "5px",
        paddingLeft: "5px",
      }}
    >
      <div
        style={{
          height: "15px",
          width: "15px",
          borderRadius: "10px",
          backgroundColor: color,
        }}
      ></div>
      <p
        style={{
          fontSize: "12px",
          marginLeft: "5px",
          fontFamily: "kenvue-sans-regular",
        }}
      >
        {title}
      </p>
    </div>
  );
};
