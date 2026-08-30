import React from "react";
import {
  TableCell,
  TextField,
  Popper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { MaterialEntity } from "../../structures/packaging";


interface SearchState {
  value: string;
  results: MaterialEntity[];
  anchorEl: HTMLInputElement | null;
  isOpen: boolean;
  noResult: boolean;
}

interface MaterialSearchCellProps {
  subComponentId: number | string;
  searchState: SearchState;
  handleSearchChange: (subComponentId: number | string, e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => void;
  handleRowClick: (subComponentId: number | string, result: MaterialEntity) => void;
  placeholder?: string;
  textFieldClassName?: string;
  colSpan?: number;
}

const MaterialSearchCell: React.FC<MaterialSearchCellProps> = ({
  subComponentId,
  searchState,
  handleSearchChange,
  handleRowClick,
  placeholder = "Search by Material Name",
  textFieldClassName,
  colSpan = 5,
}) => {
  return (
    <TableCell
      colSpan={colSpan}
      className="table-cell-material-search"
      style={{ border: "1px solid #E4E7EC" }}
    >
      <TextField
        className={textFieldClassName}
        placeholder={placeholder}
        value={searchState.value}
        onChange={(e) => handleSearchChange(subComponentId, e)}
        fullWidth
        sx={{
          fontFamily: "kenvue-sans-regular",
          fontSize: "13.33px",
          lineHeight: "20px",
          color: "#000000",
          "&::placeholder": { opacity: 1 },
          "& fieldset": { border: "none" },
          "& .MuiOutlinedInput-root": {
            padding: 0,
            "&:hover fieldset": { border: "none" },
            "&.Mui-focused fieldset": { border: "2px solid #00B097" },
          },
          "& .MuiOutlinedInput-input": {
            padding: "0 10px",
            height: "20px",
            fontFamily: "kenvue-sans-regular",
            fontSize: "13.33px",
            lineHeight: "20px",
            color: "#000000",
          },
          "& .MuiInputBase-input::placeholder": {
            fontFamily: "kenvue-sans-regular",
            fontSize: "13.33px",
            lineHeight: "20px",
            color: "rgba(68, 68, 68, 0.75)",
            opacity: 1,
          },
          "& .MuiInputBase-input": {
            padding: "14.43px 10px",
          },
        }}
      />

      <Popper
        open={searchState.isOpen}
        anchorEl={searchState.anchorEl}
        placement="bottom-start"
        className="packing-table-searchresults"
        disablePortal
      >
        <TableContainer>
          <Table>
            <TableBody>
              {searchState.results.map((result) => (
                <TableRow
                  key={result._id}
                  hover
                  style={{
                    cursor: "pointer",
                    height: "40px",
                    minHeight: "40px",
                    maxHeight: "max-content",
                  }}
                  onClick={() => handleRowClick(subComponentId, result)}
                >
                  <TableCell className="material-search-result">
                    {result.material_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {searchState.noResult && searchState.value && (
            <div className="noData">
              <div className="cancelIcon">
                <CancelOutlinedIcon />
              </div>
              <div style={{ fontSize: "14.33px" }}>
                <span className="NoDataTitle"> Material not found.</span>
              </div>
            </div>
          )}
        </TableContainer>
      </Popper>
    </TableCell>
  );
};

export default MaterialSearchCell;
