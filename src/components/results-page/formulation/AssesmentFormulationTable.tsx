import React, { useContext, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  TableSortLabel,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import "../../../assets/css/table.scss";
import {
  RowData,
  IAssementFormulationTable,
} from "../../../structures/formulation";
import { ResultDataContext } from "../../../contexts/resultData/ResultDataContext";
import { CustomTooltip } from "../../consumer-packaging-tab/TableViewPackaging.component";

const AssementFormulationTable: React.FC<IAssementFormulationTable> = (
  props
) => {
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("tradeName");

  const { productEnvironmentalFootprintData, carbonFootprintData } =
    useContext(ResultDataContext);

  const pefFormulation = productEnvironmentalFootprintData.formulation as { baseline: { carbonFootprint: number }; myProduct: { carbonFootprint: number } }[];
  const cfFormulation = carbonFootprintData.formulation as { baseline: { carbonFootprint: number }; myProduct: { carbonFootprint: number } }[];

  const totalBaselinePef = useMemo(() => {
    return pefFormulation.reduce((sum, item) => sum + (item.baseline.carbonFootprint || 0), 0);
  }, [pefFormulation]);

  const totalMyproductPef = useMemo(() => {
    return pefFormulation.reduce((sum, item) => sum + (item.myProduct.carbonFootprint || 0), 0);
  }, [pefFormulation]);

  const totalBaselineCarbon = useMemo(() => {
    return cfFormulation.reduce((sum, item) => sum + (item.baseline.carbonFootprint || 0), 0);
  }, [cfFormulation]);

  const totalMyproductCarbon = useMemo(() => {
    return cfFormulation.reduce((sum, item) => sum + (item.myProduct.carbonFootprint || 0), 0);
  }, [cfFormulation]);

  const data =
    props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
      ? productEnvironmentalFootprintData?.formulation
      : carbonFootprintData?.formulation;

  const handleSortRequest = (property: string) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getPropertyValue = (
    row: RowData,
    property: string
  ): number | string => {
    switch (property) {
      case "tradeName":
        return row.tradeName;
      case "rawCode":
        return row.rawCode;
      case "baseline.massComposition":
        return row.baseline.massComposition;
      case "baseline.carbonFootprint":
        return row.baseline.carbonFootprint;
      case "myProduct.massComposition":
        return row.myProduct.massComposition;
      case "myProduct.carbonFootprint":
        return row.myProduct.carbonFootprint;
      default:
        return "";
    }
  };

  const sortedData = [...(data ?? [])].sort((a, b) => {

    const aValue = getPropertyValue(a, orderBy);

    const bValue = getPropertyValue(b, orderBy);

    const parsedAValue =

      ["myProduct.massComposition", "baseline.carbonFootprint", "myProduct.carbonFootprint"].includes(orderBy)

        ? parseFloat(aValue as string) || 0

        : aValue;

    const parsedBValue =

      ["baseline.massComposition", "myProduct.massComposition", "baseline.carbonFootprint", "myProduct.carbonFootprint"].includes(orderBy)

        ? parseFloat(bValue as string) || 0

        : bValue;

    if (typeof parsedAValue === "string" && typeof parsedBValue === "string") {

      return orderDirection === "asc"

        ? parsedAValue.localeCompare(parsedBValue)

        : parsedBValue.localeCompare(parsedAValue);

    }
    // Ensure parsedAValue and parsedBValue are numbers for arithmeticconst 
    const numAValue = typeof parsedAValue === "number" ? parsedAValue : parseFloat(parsedAValue) || 0;
    const numBValue = typeof parsedBValue === "number" ? parsedBValue : parseFloat(parsedBValue) || 0;
    return orderDirection === "asc" ? numAValue - numBValue : numBValue - numAValue;
  });



  const arrowStyles = {
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
  };

  return (
    <TableContainer component={Paper} className="pef-cf-forulation-custom-table-container" sx={{ overflow: "auto", tableLayout: "fixed" }}>
      <Table stickyHeader>
        <TableHead className="pef-cf-table-head">
          <TableRow className="pef-cf-forulation-header-row">
            <TableCell
              rowSpan={2}
              sx={{ minWidth: "284px", minHeight: "96px !important", padding: "12px 24px" }}
              className="css-iul604-MuiTableCell-root pef-cf-forulation-header-cell pef-cf-forulation-first-cell" align="left"
            >
              <Box component="div" display="flex" alignItems="center">
                <span>Raw Material Trade Name</span>
                <TableSortLabel
                  active={orderBy === "tradeName"}
                  direction={orderBy === "tradeName" ? orderDirection : "asc"}
                  onClick={() => handleSortRequest("tradeName")}
                  sx={arrowStyles}
                />
              </Box>
            </TableCell>
            <TableCell
              rowSpan={2}
              className="css-iul604-MuiTableCell-root pef-cf-forulation-header-cell pef-cf-forulation-first-cell"
              align="left"
              sx={{ minWidth: "151px" }}
            >
              <Box display="flex" alignItems="center">
                <span>RAW Code</span>
                <TableSortLabel
                  active={orderBy === "rawCode"}
                  direction={orderBy === "rawCode" ? orderDirection : "asc"}
                  onClick={() => handleSortRequest("rawCode")}
                  sx={arrowStyles}
                />
              </Box>
            </TableCell>
            <TableCell
              className="css-iul604-MuiTableCell-root pef-cf-forulation-header-cell"
              align="center"
              style={{ border: "1px solid #E4E7EC" }}
              sx={{ Width: "483px" }}
              colSpan={2}
            >
              <span style={{ padding: "15px 0px" }}>Baseline Product</span>
            </TableCell>
            <TableCell
              className="css-iul604-MuiTableCell-root pef-cf-forulation-header-cell"
              align="center"
              style={{ border: "1px solid #E4E7EC" }}
              sx={{ Width: "483px" }}
              colSpan={2}
            >
              <span style={{ padding: "15px 0px" }}>My Product</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              className="css-iul604-MuiTableCell-root pef-cf-forulation-sub-header-cell"
              sx={{
                border: "1px solid #E4E7EC",
                width: "152px",
                background: "#f5f5f5 !important",
              }}
            >
              <Box
                display="inline-flex"
                alignItems="center"
                margin="10px"
                gap="2px"
              >
                <span style={{ width: "min-content" }}>
                  Mass Composition&nbsp;%
                </span>
                <TableSortLabel
                  active={orderBy === "baseline.massComposition"}
                  direction={
                    orderBy === "baseline.massComposition"
                      ? orderDirection
                      : "asc"
                  }
                  onClick={() => handleSortRequest("baseline.massComposition")}
                  sx={arrowStyles}
                />
              </Box>
            </TableCell>
            <TableCell
              className="css-iul604-MuiTableCell-root pef-cf-forulation-sub-header-cell"
              sx={{
                border: "1px solid #E4E7EC",
                width: "330px",
                background: "#f5f5f5 !important",
              }}
            >
              <Box
                display="inline-flex"
                gap="2px"
                justifyContent="space-between"
                alignItems="center"
                margin="10px"
              >
                <span style={{ whiteSpace: "pre-line" }}>
                  {" "}
                  {/*props.subHeaderText*/}
                  {props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                    ? "Product Environmental Footprint (points)"
                    : " Product Carbon Footprint \n(g CO2 eq.)"}{" "}
                </span>
                <CustomTooltip title= {props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                  ? "Product Environmental Footprint (points)"
                  : " Product Carbon Footprint (g CO2 eq.)"}>  
                  <IconButton size="small" className="pef-cf-forulation-info-icon">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                 </CustomTooltip>
                <TableSortLabel
                  active={orderBy === "baseline.carbonFootprint"}
                  direction={
                    orderBy === "baseline.carbonFootprint"
                      ? orderDirection
                      : "asc"
                  }
                  onClick={() => handleSortRequest("baseline.carbonFootprint")}
                  sx={arrowStyles}
                />
              </Box>
            </TableCell>
            <TableCell
              className="css-iul604-MuiTableCell-root pef-cf-forulation-sub-header-cell"
              sx={{
                border: "1px solid #E4E7EC",
                width: "152px",
                background: "#f5f5f5 !important",
              }}
            >
              <Box
                display="inline-flex"
                alignItems="center"
                margin="10px"
                gap="2px"
              >
                <span style={{ width: "min-content" }}>
                  Mass Composition&nbsp;%
                </span>
                <TableSortLabel
                  active={orderBy === "myProduct.massComposition"}
                  direction={
                    orderBy === "myProduct.massComposition"
                      ? orderDirection
                      : "asc"
                  }
                  onClick={() => handleSortRequest("myProduct.massComposition")}
                  sx={arrowStyles}
                />
              </Box>
            </TableCell>
            <TableCell
              className="css-iul604-MuiTableCell-root pef-cf-forulation-sub-header-cell"
              sx={{
                border: "1px solid #E4E7EC",
                width: "330px",
                background: "#f5f5f5 !important",
              }}
            >
              <Box
                display="inline-flex"
                gap="2px"
                justifyContent="space-between"
                alignItems="center"
                margin="10px"
              >
                <span style={{ whiteSpace: "pre-line" }}>
                  {" "}
                  {props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                    ? "Product Environmental Footprint (points)"
                    : " Product Carbon Footprint \n(g CO2 eq.)"}{" "}
                </span>
                <CustomTooltip title= {props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                  ? "Product Environmental Footprint (points)"
                  : " Product Carbon Footprint (g CO2 eq.)"}>
                  <IconButton size="small" className="pef-cf-forulation-info-icon">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </CustomTooltip>
                <TableSortLabel
                  active={orderBy === "myProduct.carbonFootprint"}
                  direction={
                    orderBy === "myProduct.carbonFootprint"
                      ? orderDirection
                      : "asc"
                  }
                  onClick={() => handleSortRequest("myProduct.carbonFootprint")}
                  sx={arrowStyles}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow
              key={index + 1}
              style={{ fontFamily: "kenvue-sans-regular" }}
              className={index % 2 === 0 ? "pef-cf-forulation-odd-row" : "pef-cf-forulation-even-row"}
            >
              <TableCell className="css-iul604-MuiTableCell-root pef-cf-forulation-body-cell" sx={{ width: "284px !important", height: "72px !important", fontFamily: "kenvue-sans-regular" }}>
                {row.tradeName}
              </TableCell>
              <TableCell className="css-iul604-MuiTableCell-root pef-cf-forulation-body-cell" sx={{ fontFamily: "kenvue-sans-regular" }}>
                {row.rawCode}
              </TableCell>
              <TableCell
                className="css-iul604-MuiTableCell-root pef-cf-forulation-body-cell"
                sx={{ width: "152px", textAlign: "center !important", fontFamily: "kenvue-sans-regular" }}
              >
                <CustomTooltip title={row.baseline.massComposition != null ? parseFloat(row.baseline.massComposition)?.toFixed(6) : ''}>
                  <span>
                    {row.baseline.massComposition != null ? parseFloat(row.baseline.massComposition)?.toFixed(2) : ''}
                  </span>
                </CustomTooltip>
              </TableCell>
              <TableCell className="css-iul604-MuiTableCell-root pef-cf-forulation-body-cell" style={{ fontFamily: "kenvue-sans-regular" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{fontFamily: "kenvue-sans-regular" }}
                >
                  {row.baseline.massComposition !== null ? (
                    <>
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
                        value={
                           (() => {
                            const total = props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                              ? totalBaselinePef
                              : totalBaselineCarbon;
                            return total > 0 ? (row.baseline.carbonFootprint / total) * 100 : 0;
                          })()
                        }
                        className="pef-cf-forulation-linear-progress-bar"
                      />
                      {row.baseline.carbonFootprint !== 0 && <Typography
                        variant="body2"
                        className="pef-cf-forulation-progress-value"
                      >{`${row.baseline.carbonFootprint}`}</Typography>}
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      className="pef-cf-forulation-progress-value"
                      sx={{ width: "200px" }}
                    >
                      &nbsp;
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell
                className="css-iul604-MuiTableCell-root pef-cf-forulation-body-cell"
                sx={{ width: "152px", textAlign: "center !important", fontFamily: "kenvue-sans-regular" }}
              >
                <CustomTooltip title={row.myProduct.massComposition != null ? parseFloat(row.myProduct.massComposition)?.toFixed(6) : ''}>
                  <span>
                    {row.myProduct.massComposition != null ? parseFloat(row.myProduct.massComposition)?.toFixed(2) : ''}
                  </span>
                </CustomTooltip>
              </TableCell>
              <TableCell className="css-iul604-MuiTableCell-root pef-cf-forulation-body-cell" style={{ fontFamily: "kenvue-sans-regular" }}>
                <Box
                  display="flex"
                  alignItems="center"
                >
                  {row.myProduct.massComposition !== null ? (
                    <>
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
                        value={
                        (() => {
                            const total = props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                              ? totalMyproductPef
                              : totalMyproductCarbon;
                            return total > 0 ? (row.myProduct.carbonFootprint / total) * 100 : 0;
                          })()
                        }
                        className="pef-cf-forulation-linear-progress-bar"
                      />
                      {row.myProduct.carbonFootprint !== 0 && <Typography
                        variant="body2"
                        className="pef-cf-forulation-progress-value"
                      >{`${row.myProduct.carbonFootprint}`}</Typography>}
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      className="pef-cf-forulation-progress-value"
                      sx={{ width: "200px" }}
                    >
                      &nbsp;
                    </Typography>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssementFormulationTable;