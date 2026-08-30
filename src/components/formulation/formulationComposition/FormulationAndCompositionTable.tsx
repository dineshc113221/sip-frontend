import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Box,
  Grid,
  TableSortLabel,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  CircularProgress,
  Popper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import deleteIcon  from "../../../assets/images/delete-pacaking.svg";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import InfoIcon from "@mui/icons-material/Info";

import "../../../assets/css/formulationtables.scss";
import {
  PRODUCT_ENVIRONMENTAL_FOOTPRINT_TOOLTIP,
  CARBON_FOOTPRINT_FOOTPRINT_TOOLTIP,
  GREEN_CHEMISTRY_FOOTPRINT_TOOLTIP,
} from "../../../constants/ExperimentalTooltip.constant";
import { BootstrapTooltip } from "../../../constants/Formula.constant";
import useFormulationTable from "./useFormulationTable";
import { RawMaterialsData } from "../../../structures/formulation";
import leafIcon from "../../../assets/images/leaf_icon_formulation.svg";
import warningIcon from "../../../assets/images/Warning_icon_formulation.svg";
import { getComparator, stableSort } from "../../../helper/PackagingFormuationFuncations";
import { StyledIconButton } from "../../consumer-packaging-tab/TableViewPackaging.component";

const TwoLineTypography = styled(Typography)(() => ({
  width: "100%",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  wordWrap: "break-word",
  display: "inline-block",
  fontFamily: "kenvue-sans-regular",
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "18px",
  textAlign: "left",
  "&::after": {
    content: '""',
    whiteSpace: "pre",
  },
}));
const CustomTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "& input": {
      textOverflow: "ellipsis", // Ensure ellipsis is shown for overflowing text
      whiteSpace: "nowrap",
      overflow: "hidden",
      display: "block",
      fontSize:"13.33px !important"
    },
    "&:hover input": {
      overflow: "visible",
      whiteSpace: "normal",
    },
  },
  "& fieldset": {
    border: "none", // Remove border around the TextField
  },
  "& .MuiOutlinedInput-root:hover fieldset": {
    border: "none", // Ensure no border on hover
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    border: "none",
  },
}));

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    placement="top"
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12,
    border: "1px solid black", // Border color
    borderRadius: "10px 10px 10px 0px", // Border radius
    padding: "8px 12px", // Padding
    marginTop: "-15px",

    fontFamily: "kenvue-sans-regular",
    lineHeight: 1.5,
    marginLeft: "-5px !important",
    transformOrigin: "center bottom", // Tooltip opens above the element
  },
}));
interface FormulationAndCompositionTableProp {
  formulationRawMaterials: RawMaterialsData[];
  handelFormulationTableChanges: (
    formulationRawMaterials: RawMaterialsData[]
  ) => void;
  isClear: boolean;
  mode: string;
}

const FormulationAndCompositionTable: React.FC<
  FormulationAndCompositionTableProp
> = ({
  formulationRawMaterials,
  handelFormulationTableChanges,
  isClear,
  mode,
}) => {
    const {
      rows,
      searchValue,
      searchResults,
      noResultFound,
      debouncedSearchTerm,
      order,
      orderBy,
      totalEnvFootprint,
      totalCarbonFootprint,
      handleMassChange,
      handleSearchChange,
      handleDeleteRow,
      isFormulaCompositionEditable,
      handleMouseEnterWeight,
      handleMouseLeaveWeight,
      handleSearchSelect,
      errors,
      formattedTotalWeight,
      handleBlur,
      handleRequestSort,
      isLoading,
      formattedTotalWeight_envFootprint,
      formattedTotalWeight_carbonFootprint,
      getTotalWeight,
      inFocusRows,
      setInFocusRows,
      anchorEl,
      isSearchResultsOpen,
    } = useFormulationTable({
      handelFormulationTableChanges,
      isClear,
      formulationRawMaterials,
    });
    const [activeEditTooltipRow, setActiveEditTooltipRow] = useState<number | null>(null);
    const [activeTradeNameTooltipRow, setActiveTradeNameTooltipRow] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    // function to validate user input
    const validateEnteredValue = (indexPosition: number, value: string) => {
      if (value.startsWith("0") && value !== "0" && !value.startsWith("0.")) {
        value = value.replace(/^0+/, "");
      }
      value = value.replace(/^[+-]/g, ""); // removing + and - signs if present

      // splitting the current value and checking there are only 6 decimal places
      const parts = value.split(".");
      if (parts.length > 1 && parts[1].length > 6) {
        parts[1] = parts[1].substring(0, 6);
        value = parts.join(".");
      }
      const zeroDotRegex = /^0\.0*$/;
      const zeroDecimalRegex = /^0\.\d$/;
      if (
        value === "0." ||
        zeroDotRegex.exec(value) ||
        zeroDecimalRegex.exec(value)
      ) {
        handleMassChange(indexPosition, value);
        return;
      }

      // Check for making sure the entered value is in 0-100 range
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        value = "0";
      } else if (numericValue > 100) {
        value = "100"; // number above 100 is reset to 100
      } else if (numericValue < 0) {
        value = "0"; // number below 0 is reset to 0
      }

      handleMassChange(indexPosition, value.toString()); // converting float value back again to string as function expects
    };

  const handleRowBlur = (rowId: string, value: string, index: number) => {
      handleBlur(rowId, value,index);
      setInFocusRows((prevRows) =>
        prevRows?.filter((rowPos) => rowPos !== index)
      );
    };

    const getBorderColor = (error: string | null | undefined) => {
      return error ? "2px solid red" : "2px solid #00B097";
    };

    const getSortDirection = (field) => (orderBy === field ? order : false);
    const getDirection = (field) => (orderBy === field ? order : "asc");

    const handleScrollInteraction = () => {
        handleMouseLeaveWeight(); 
        setActiveEditTooltipRow(null);
        setActiveTradeNameTooltipRow(null);
    };

    return (
      <div className="table-wrapper1" style={{ maxWidth: "1330px" }}>
        <Grid container style={{ maxWidth: "1330px" }}>
          <Grid style={{ width: "100%" }}>
            <TableContainer 
                component={Paper} 
                className="table-containers"
                onScrollCapture={handleScrollInteraction}
                onWheel={handleScrollInteraction}
            >
              <Table stickyHeader>
                <TableHead className="table-head">
                  <TableRow>
                    {/* <TableCell sx={{ width: '2%', paddingLeft: '1px' }}></TableCell>{} */}
                    <TableCell
                      className="table-cell0"
                      sx={{ width: "242px !important", }}
                      sortDirection={getSortDirection("tradeName")}
                      rowSpan={2}
                    >
                      <TableSortLabel
                        active={true}
                        direction={getDirection("tradeName")}
                        onClick={() => handleRequestSort("tradeName")}
                        hideSortIcon={false}
                      // style={{icon :orderBy === 'tradeName' ? {fontWeight:'bold'} : {opacity:0.5},}}
                      >
                        <span className="Cell-text-bold">Raw Material Trade Name</span>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      className="table-cell1"
                      sx={{ width: "155px !important" }}
                      sortDirection={getSortDirection("rawMaterialId")}
                      rowSpan={2}
                    >
                      <TableSortLabel
                        active={true}
                        direction={getDirection("rawMaterialId")}
                        onClick={() => handleRequestSort("rawMaterialId")}
                        hideSortIcon={false}
                      >
                        <span className="Cell-text-bold">Raw Code</span>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      className="table-cell2"
                      sx={{ width: "155px !important" }}
                      sortDirection={getSortDirection("percentage")}
                      rowSpan={2}
                    >
                      <TableSortLabel
                        active={true}
                        direction={getDirection("percentage")}
                        onClick={() => handleRequestSort("percentage")}
                        hideSortIcon={false}
                      >
                        <span className="Cell-text-bold" style={{ whiteSpace: "wrap" }}>Mass % Composition</span>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell sx={{ width: "0.5%" }} className="divider" rowSpan={2}></TableCell>
                    <TableCell
                      className="table-cell3"
                      sortDirection={getSortDirection("envFootprint")}
                      rowSpan={2}
                    >
                      <TableSortLabel
                        active={true}
                        direction={getDirection("envFootprint")}
                        onClick={() => handleRequestSort("envFootprint")}
                        className="table-sort-label"
                      >
                        <div className="cell-content">
                          <div className="cell-text">
                            <span className="Cell-text-bold">
                              Product Environmental Footprint <span className="Cell-text-bold">(Points per Functional unit)</span>
                            </span>
                          </div>
                          <BootstrapTooltip
                            className="BootstrapTooltip"
                            title={
                              <p className="BootstrapTooltip-p">
                                {PRODUCT_ENVIRONMENTAL_FOOTPRINT_TOOLTIP}
                              </p>
                            }
                            placement="top"
                            arrow
                          >
                            <InfoIcon className="packaging-InfoIcon" />
                          </BootstrapTooltip>
                        </div>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      className="table-cell4"
                      sx={{ width: "227px !important" }}
                      sortDirection={getSortDirection("carbonFootprint")}
                      rowSpan={2}
                    >
                      <TableSortLabel
                        active={true}
                        direction={getDirection("carbonFootprint")}
                        onClick={() => handleRequestSort("carbonFootprint")}
                        hideSortIcon={false}
                        className="table-sort-label"
                      >
                        <div className="cell-content">
                          <div className="cell-text">
                            <span className="Cell-text-bold">Product Carbon Footprint <span className="Cell-text-bold">(g CO2 eq. per functional unit)</span></span>

                          </div>
                          <BootstrapTooltip
                            className="BootstrapTooltip"
                            title={
                              <p className="BootstrapTooltip-p">
                                {CARBON_FOOTPRINT_FOOTPRINT_TOOLTIP}
                              </p>
                            }
                          >
                            <InfoIcon className="packaging-InfoIcon" />
                          </BootstrapTooltip>
                        </div>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      className="green-chemistry"
                      sx={{
                        width: "226.62px",
                        height: "36px",
                        border: "1px solid #E4E7EC",
                        borderBottom: "none",
                        textAlign: "center",
                      }}
                      colSpan={2}
                    >
                      <div className="cell-content" style={{ paddingLeft: "10px" }}>
                        <TwoLineTypography
                          variant="body1"
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "kenvue-sans" }}
                        >
                          Green Chemistry
                          <BootstrapTooltip
                            className="BootstrapTooltip"
                            title={
                              <p className="BootstrapTooltip-p">
                                {GREEN_CHEMISTRY_FOOTPRINT_TOOLTIP}
                              </p>
                            }
                          >
                            <InfoIcon className="packaging-InfoIcon" style={{ marginTop: "0px" }} />
                          </BootstrapTooltip>
                        </TwoLineTypography>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className="table-header-secondrow"
                    sx={{
                      position: "sticky",
                      top: "36px",
                      height: "42px",
                      background: "red",
                    }}
                  >
                    <TableCell
                      className="css-iul604-MuiTableCell-root"
                      sx={{
                        borderTop: "1.5px solid #E4E7EC",
                        borderRight: "1.5px solid #E4E7EC",
                        borderLeft: "1px solid #E4E7EC",
                        width: "107.62px!important",
                        padding: "0px!important",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        display="inline-flex"
                        alignItems="center"
                        margin="10px"
                        gap="2px"
                        justifyContent={"center"}
                      >
                        <TwoLineTypography style={{ paddingLeft: "12px", fontFamily: "kenvue-sans" }} variant="body1">GAIA Score</TwoLineTypography>
                        <TableSortLabel
                          active={true}
                          direction={getDirection("gaiaScore")}
                          onClick={() => handleRequestSort("gaiaScore")}
                        />
                      </Box>
                    </TableCell>
                    <TableCell
                      className="css-iul604-MuiTableCell-root"
                      sx={{
                        borderTop: "1.5px solid #E4E7EC",
                        borderRight: "1.5px solid #E4E7EC",
                        borderLeft: "1px solid #E4E7EC",
                        width: "119px!important",
                        padding: "0px!important",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        display="inline-flex"
                        alignItems="center"
                        margin="10px"
                        gap="2px"
                        justifyContent={"center"}
                      >
                        <TwoLineTypography style={{ fontFamily: "kenvue-sans" }} variant="body1">Indicators</TwoLineTypography>

                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="table-body-formulation">
                  {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                    const error = errors?.get(row.rawMaterialId);
                    const emptyOrUndefined = (value: string | undefined) => {
                      return value === "" || value === undefined;
                    };
                    const fullValue = emptyOrUndefined(row.percentage)
                      ? 0
                      : parseFloat(row?.percentage?.toString()).toFixed(6);
                    return (
                      <TableRow key={row.rawMaterialId + index} className="table-row">
                        <TableCell className="table-cell-row" sx={{ width: "242px !important" }}>
                          <Box className="table-box">
                            {isFormulaCompositionEditable && (

                              <Tooltip title={"Delete"} placement="bottom" className="buttonLeft"
                                PopperProps={{
                                  modifiers: [
                                    {
                                      name: "offset",
                                      options: {
                                        offset: [0, 10], // Adjust the vertical offset here
                                      },
                                    },
                                  ],
                                }}>

                                <StyledIconButton
                                  className={"icon-button"}
                                  disabled={!isFormulaCompositionEditable}
                                  onClick={() => handleDeleteRow(index)}
                                >

                                  {mode !== "view" &&
                                    <img src={deleteIcon} alt="Delete Material" />}
                                </StyledIconButton>
                              </Tooltip>
                            )}
                            <CustomTooltip
                              title={row.tradeName}
                              open={activeTradeNameTooltipRow === index}
                              onOpen={() => setActiveTradeNameTooltipRow(index)}
                              onClose={() => setActiveTradeNameTooltipRow(null)}
                              PopperProps={{
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [40, -5], // Adjust the vertical offset here
                                    },
                                  },
                                ],
                              }}
                            >
                              <CustomTextField
                                variant="outlined"
                                value={row.tradeName}
                                inputProps={{ readOnly: true }}
                                fullWidth
                                className="disabledfield"
                                sx={{
                                  marginLeft:"3px",
                                  "& .MuiInputBase-input": {
                                    fontSize: "13.33px",
                                    height: "20px",
                                    padding: "0px",
                                  },
                                }}
                              />
                            </CustomTooltip>
                          </Box>
                        </TableCell>
                        <TableCell
                          className="table-cell5"
                          sx={{
                            width: "155px !important",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          <Box className="table-box1">
                            <TextField
                              variant="outlined"
                              value={row.rawMaterialId}
                              inputProps={{ readOnly: true }}
                              fullWidth
                              className="disabledfield"
                              InputProps={{
                                style: {
                                  fontFamily: "kenvue-sans-regular",
                                  fontSize: "13.33px !important",
                                  fontWeight: 400,
                                  lineHeight: "19.99px",
                                  paddingLeft: "0px", // Adjust the right padding here
                                  paddingRight: "0px",
                                },
                              }}
                              sx={{
                                
                                "& fieldset": {
                                  border: "none", // Remove the border around the TextField
                                },
                                "& .MuiInputBase-input": {
                                  fontSize: "13.33px !important",
                                },
                                "& .MuiOutlinedInput-root": {
                                  padding: "0px",
                                  "&:hover fieldset": {
                                    border: "none",
                                    paddingLeft: "0px", // Adjust the right padding here
                                    paddingRight: "0px",

                                    // Ensure no border on hover
                                  },
                                  "&.Mui-focused": {
                                    "& fieldset": {
                                      border: "none",
                                    },
                                  },
                                },
                              }}
                            />
                          </Box>
                        </TableCell>

                        <TableCell
                          className="table-cell9"
                          sx={{
                            width: "155px !important",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          <CustomTooltip 
                            title={error || fullValue}
                            open={activeEditTooltipRow === index}
                            onOpen={() => setActiveEditTooltipRow(index)}
                            onClose={() => setActiveEditTooltipRow(null)}
                            PopperProps={{
                              modifiers: [
                                {
                                  name: "offset",
                                  options: {
                                    offset: [40, -15], // Adjust the vertical offset here
                                  },
                                },
                              ],
                            }}>
                            <form noValidate>
                              <TextField
                                value={
                                  inFocusRows?.includes(index)
                                    ? row.percentage
                                    : parseFloat(row.percentage).toFixed(2)
                                }
                                onChange={(e) => {
                                  validateEnteredValue(index, e.target.value);
                                }}
                                variant="outlined"
                                fullWidth
                                type="number"
                                disabled={!isFormulaCompositionEditable}
                                onBlur={(e) => {
                                  handleRowBlur(row.rawMaterialId, e.target.value, index);
                                }}
                                onFocus={() => setInFocusRows((prevRows) => [...prevRows, index])}
                                InputProps={{
                                  endAdornment: <span style={{ fontSize: "13.33px", fontFamily: "kenvue-sans-regular", fontWeight: "400", color: "#000000", paddingLeft: "2px" }}>%</span>,
                                  sx: {

                                    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                    {
                                      "-webkit-appearance": "none",
                                    },
                                  },
                                }}
                                inputProps={{
                                  step: "0.000001",
                                  min: 0,
                                  max: 100,
                                  readOnly: !isFormulaCompositionEditable,
                                }}
                                sx={{
                                  "& input": {
                                    marginLeft: "15px",
                                    maxWidth: "50px",
                                    paddingY: "10px",
                                    textAlign: "right",
                                    cursor: !isFormulaCompositionEditable ? "not-allowed" : "text",
                                    fontFamily: "kenvue-sans-regular",
                                    fontSize: "13.33px !important",
                                    fontWeight: 400,
                                    lineHeight: "19.99px",
                                  },
                                  "& fieldset": {
                                    border: error ? "2px solid red" : "none", // Red border if error
                                  },
                                  "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": {
                                      border: error ? "2px solid red" : "none", // Red border on hover if error
                                    },
                                    "&.Mui-focused": {
                                      "& fieldset": {
                                        border: mode !== "view" ? getBorderColor(error) : "none",
                                      },
                                    },
                                  },
                                }}
                              /></form>
                          </CustomTooltip>
                        </TableCell>

                        <TableCell sx={{ width: "0.5%" }} className="divider"></TableCell>

                        <TableCell
                          className="table-cell6"
                          sx={{ width: "269px !important", margin: "0px" }}
                        >
                          <Box display="flex" alignItems="center">
                            <LinearProgress
                              sx={{
                                "--LinearProgress-thickness": "19px",
                                maxWidth: "150px",
                                minWidth: "150px",
                                width: "150px",
                                background: "#D2D1D2",
                                [`& .MuiLinearProgress-bar`]: {
                                  backgroundColor: "#3774b1",
                                },
                              }}
                              variant="determinate"
                              value={totalEnvFootprint > 0 ? (row.envFootprint / totalEnvFootprint) * 100 : 0}
                              className="linear-progress-bar"
                            />
                            <Typography variant="body2" className="progress-value" style={{ fontFamily: "kenvue-sans-regular" }}>{`${row.envFootprint ? row.envFootprint.toFixed(6) : ""
                              }`}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell className="table-cell7" sx={{ margin: "0px" }}>
                          <Box display="flex" alignItems="center">
                            <LinearProgress
                              sx={{
                                "--LinearProgress-thickness": "19px",
                                maxWidth: "130px",
                                width: "130px",
                                minWidth: "130px",
                                background: "#D2D1D2",
                                [`& .MuiLinearProgress-bar`]: {
                                  backgroundColor: "#3774B1",
                                },
                              }}
                              variant="determinate"
                              value={totalCarbonFootprint > 0 ? (row.carbonFootprint / totalCarbonFootprint) * 100 : 0}
                              className="linear-progress-bar"
                            />
                            <Typography variant="body2" className="progress-value" style={{ fontFamily: "kenvue-sans-regular" }}>{`${row.carbonFootprint ? row.carbonFootprint.toFixed(6) : ""
                              }`}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          className="table-cell8"
                          sx={{
                            width: "107.62px !important",
                            margin: "0px",
                            textAlign: "center",
                            borderLeft: "1px solid #E4E7EC!important",
                            padding: "16px 0px 16px 0px"
                          }}
                        >
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <Typography variant="body2" className="progress-value" style={{ fontFamily: "kenvue-sans-regular" }}>
                              {`${row.gaiaScore ? Number(row.gaiaScore).toFixed(2) : ""}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell

                          className="table-cell8"

                          sx={{ width: "119px !important", margin: "0px", borderLeft: "1px solid #E4E7EC!important", padding: "16px 0px 16px 0px" }}

                        >

                          <Box display="flex" alignItems="center" justifyContent="space-evenly">

                            {/* Leaf Icon or Placeholder */}

                            {row?.leaf_icon_boolean === 'LEAF' ? (

                              <img src={leafIcon} alt="LEAF" />

                            ) : (

                              <Box width="33px" height="24px" /> // Placeholder for Leaf Icon

                            )}



                            {/* Warning Icon or Placeholder */}

                            {row?.watchlist_icon_boolean === '1' ? (

                              <img src={warningIcon} alt="WARNING" />

                            ) : (

                              <Box width="33px" height="24px" /> // Placeholder for Warning Icon

                            )}

                          </Box>

                        </TableCell>






                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="sticky-footer1">
                <div
                  className={`disabledfield-wrapper ${!isFormulaCompositionEditable ? "setWidthforwrapper" : ""
                    }`}>
                  {isFormulaCompositionEditable && (
                    <>
                      <TextField
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="disabledfield"
                        placeholder="Search Raw material or code here..."
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: isLoading ? (
                            <CircularProgress
                              color="inherit"
                              size={20}
                              sx={{ position: "absolute", right: "5px" }}
                            />
                          ) : (
                            <p style={{ position: "absolute", right: "5px", minWidth: "20px" }}></p>
                          ),
                        }}
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
                          marginBottom: "10px",
                          marginTop: "5px",
                          "& input": {
                            padding: "8px 14px",
                          },
                          "& fieldset": {
                            border: "none", // Remove the border around the TextField
                          },
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              border: "none", // Ensure no border on hover
                            },
                            "&.Mui-focused": {
                              "& fieldset": {
                                border: "2px solid #00B097",
                              },
                            },
                          },
                        }}
                      />
                      <Popper
                        open={isSearchResultsOpen}
                        anchorEl={anchorEl}
                        placement="top-start"
                        className="formulation-table-searchresults"
                      >
                        <div
                          ref={listRef}
                          className={searchResults.length > 0 ? "search-results" : "noDataMain"}
                          style={{
                            fontFamily: "kenvue-sans-regular",
                          }}
                        >
                          <Table>
                            <TableBody>
                              {mode !== "view" &&
                                searchResults?.map((result, index) => (
                                  <TableRow
                                    key={`${index}+${result.tradeName}`}
                                    hover
                                    onClick={() => handleSearchSelect(result)}
                                  >
                                    <TableCell style={{ fontFamily: "kenvue-sans-regular" }}>{result.tradeName}</TableCell>
                                    <TableCell style={{ fontFamily: "kenvue-sans-regular" }}>{result.rawMaterialId}</TableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>


                          </Table>
                        
                        </div>
                      </Popper>
                    </>
                  )}
                </div>
                { noResultFound && debouncedSearchTerm === searchValue &&  (
                  <div className="noData" style={{marginLeft:"-6px"}}>
                    <div className="cancelIcon"><CancelOutlinedIcon /></div>
                    <div style={{ fontSize: "14.33px" }}><span className="NoDataTitle">Raw material not found.</span></div>
                  </div>
                )}
                {isFormulaCompositionEditable && (
                  <div style={{ width: "100%", borderBottom: "1px solid #e0e0e0" }}>

                  </div>

                )}
                <div
                  style={{

                    paddingTop: isFormulaCompositionEditable ? "10px" : "",
                  }}
                >
                  <div className="notify">
                    <span className="notifyFont">Missing Raw Material? <span className="notifyFontt"><a href='mailto:sipport@kenvue.com?subject=SIP%20Raw%20Material%20Not%20Found%20Inquiry&body=Hello%20Team%2C%0A%0AI%20am%20reaching%20out%20to%20you%20regarding%20a%20Raw%20Material%20that%20I%20cannot%20find%20in%20SIP.%0A%0ARaw%20Material%20Code%20in%20Question%3A%20%3CINSERT%20PDRM%2FCONCERTO%20RAW%20CODE%20HERE%3E%0A%0AAny%20other%20comments%2Fdetails%3A%20%3CINCLUDE%20COMMENTS%20HERE%3E' style={{ color: 'inherit' }} >Email Us</a></span></span>

                  </div>
                  <div className="total-mass">
                    <span className="totalFont" style={{color: "#2B2B2B"}}>Total:</span>
                    <Typography
                      className="score-title"
                      onMouseEnter={handleMouseEnterWeight}
                      onMouseLeave={handleMouseLeaveWeight}
                    >
                      {formattedTotalWeight}%
                    </Typography>
                    {parseFloat(getTotalWeight().toFixed(6)) === 100 ? (
                      <CheckCircleOutlineIcon className="success-icon" />
                    ) : (
                      <HighlightOffIcon className="error-icon" />
                    )}
                  </div>
                  <div className="env-weight">
                    <Typography className="score-title">
                      {formattedTotalWeight_envFootprint}
                    </Typography>
                  </div>

                  <div className="carbon-weight">
                    <Typography className="score-title">
                      {formattedTotalWeight_carbonFootprint}
                    </Typography>
                  </div>

                  <div className="greenChem-weight">
                  </div>
                </div>

              </div>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    );
  };

export default FormulationAndCompositionTable;