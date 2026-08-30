import React from "react";
import { IRRSortableTableHeaderProps } from "../structure";
import { TableCell, TableSortLabel } from "@mui/material";

export const RRSortableTableHeader: React.FC<IRRSortableTableHeaderProps> = ({
  order,
  orderBy,
  onRequestSort,
  column,
}) => {
  const {
    id,
    label,
    align = "left",
    colSpan = 1,
    rowSpan = 1,
    width,
    height,
  } = column;

  const handleSort = () => {
    onRequestSort(id);
  };

  return (
    <TableCell
      align={align}
      colSpan={colSpan}
      rowSpan={rowSpan}
      sx={{
        position: "sticky",
        width: width ?? "auto", // Set width if provided, fallback to 'auto'
        height: height,
        backgroundColor: "#F8F8F8 !important",
        border: "1px solid #E4E7EC !important",
        fontFamily: "kenvue-sans",
      }}
    >
      <TableSortLabel
        active={orderBy === id}
        direction={order}
        onClick={handleSort}
        style={{
          fontFamily: "kenvue-sans !important",
          fontSize: "12px !important",
        }}
        sx={{
          "&.Mui-active": {
            color: "theme.palette.primary.main",
            fontWeight: "bold",
          },
          "& .MuiTableSortLabel-icon": {
            opacity: 0.1,
            transition: "opacity 0.3s, font-weight 0.3s",
          },
          "&:not(.Mui-active)": {
            color: "theme.palette.text.secondary",
            fontWeight: "normal",
          },
          "&:hover .MuiTableSortLabel-icon": {
            opacity: 1,
            fontWeight: "bold",
          },
          fontSize: "12px",
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};
