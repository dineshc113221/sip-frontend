import React from "react";
import { TableCell, Box } from "@mui/material";

interface SortableTableHeaderProps<Row> {
  id?: keyof Row;
  label: string| React.ReactNode;
  width?: string;
  infoIcon?: React.ReactNode;
  subLabel?: string;
  className?:string;
}

const SortableTableHeader = <Row,>({
  id,
  label,
  infoIcon,
  subLabel,
  width = "auto",
  className = "",
}: SortableTableHeaderProps<Row>) => {
  return (
     <TableCell 
      sx={{ width }} 
      className={className}
      data-column-id={id as string} // adds it for testing/sorting
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <div className="cell-text">
          <span className="Cell-text-bold">
            {label}{subLabel && <><br /><span className="Cell-text-bold">{subLabel}</span></>} 
          </span>
         
        </div>
        {infoIcon && <Box ml={1}>{infoIcon}</Box>}
      
      </Box>
    </TableCell>
  );
};

export default SortableTableHeader;
