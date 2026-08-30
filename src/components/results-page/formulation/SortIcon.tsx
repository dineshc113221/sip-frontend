import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { SortIconProps } from "../../../structures/formulation";

export const SortIcon: React.FC<SortIconProps> = ({ direction, active }) => {
  const getArrowIcon = () => {
    return direction === "asc" ? (
      <ArrowUpwardIcon style={{ fontSize: "16px" }} /> // Set specific size
    ) : (
      <ArrowDownwardIcon style={{ fontSize: "16px" }} />
    );
  };
  return (
    <span
      style={{
        padding: "5px 0px 0px 5px",
        color: active ? "black" : "#C8C8C8",
      }}
      className="MuiTableSortLabel-icon"
    >
      {active ? (
        getArrowIcon()
      ) : (
        <ArrowUpwardIcon style={{ fontSize: "16px" }} />
      )}{" "}
    </span>
  );
};

export const IconComponent: React.FC<{
  orderBy: string;
  orderDirection: "asc" | "desc";
}> = ({ orderBy, orderDirection }) => (
  <SortIcon
    direction={orderBy === "myProduct.carbonFootprint" ? orderDirection : "asc"}
    active={orderBy === "myProduct.carbonFootprint"}
  />
);
