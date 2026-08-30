import {
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  Box,
  TableBody,
  Typography,
  TableFooter,
  TableSortLabel,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Component, ComponentDetail } from "../../../structures/packaging";
import { ResultDataContext } from "../../../contexts/resultData/ResultDataContext";
import "../../../assets/css/table.scss";
import "../../../assets/css/SIP.css";
import resultinfo from "../../../assets/images/infoiconresult.svg"
import { ExpandMore } from "@mui/icons-material";
import { getColGroup, sortData } from "../../../helper/GenericFunctions";
import {
  IGreenChemFormulationData,
  SortableTableHeaderProps,
} from "../sustainablePackaging/structure";
import { CustomTooltip } from "../../consumer-packaging-tab/TableViewPackaging.component";
import EllipsisTooltipCell from "../../common/EllipsisTooltipCell";
import { ProductDataContext } from "../../../contexts/productData/ProductDataContext";

interface DetailedTableProps {
  currentTab: string;
}

const getHeaderColumns = (
  currentTab: string
): Array<SortableTableHeaderProps["column"]> => {
   // Common columns
  const baseColumns = [
    {
      id: "componentName" as keyof Component,
      label: "Component Type",
      rowSpan: 2,
      width: "212px",
    },
    {
      id: "componentName" as keyof Component,
      label: (
        <span style={{ whiteSpace: "nowrap" }}>
          Sub component
          <br />
          Name
        </span>
      ),
      rowSpan: 2,
      width: "154px",
    },
    {
      id: "materialName" as keyof ComponentDetail,
      label: (
        <span style={{ whiteSpace: "nowrap" }}>
          Material
          <br />
          Name
        </span>
      ),
      rowSpan: 2,
      width: "140px",
    },
    {
      id: "componentName" as keyof Component,
      label: "Layer",
      rowSpan: 2,
      width: "140px",
    },
  ];
  switch (currentTab) {
     case "PCR_CONTENT":
      return [
        ...baseColumns,
        {
          id: "materialType" as keyof ComponentDetail,
          label: "Material Type",
          rowSpan: 2,
          width: "145px",
        },
      ];

    case "MATERIAL_EFFICIENCY":
      return baseColumns;
    case "RENEWABLE":
      return [
        {
          id: "rawMaterialTradeName" as keyof IGreenChemFormulationData,
          label: "RAW Material Trade Name",
          rowSpan: 2,
          width: "295px",
        },
        {
          id: "rawCode" as keyof IGreenChemFormulationData,
          label: "RAW Code",
          rowSpan: 2,
          width: "161px",
        },
      ];
  }
};
const createMaterialEfficiencyPCRColumns = (
  currentTab: string
): Array<SortableTableHeaderProps["column"]> => {
  const isMaterialEfficiency = currentTab === "MATERIAL_EFFICIENCY";

  return [
    {
      id: "baseLineComponentWeight" as keyof Component,

      label: "Weight (g)",

      justifyContent: "center",

      width: "110px",

      height: "60px",

      padding: "0px",
    },

    {
      id: isMaterialEfficiency
        ? ("baselineComponentWeightDose" as keyof Component)
        : ("baselineComponentPCRContent" as keyof Component),

      label: (
        <span style={{ whiteSpace: "nowrap" }}>
          {isMaterialEfficiency ? (
            <>
              Weight <br /> per dose (g)*
            </>
          ) : (
            "% PCR Content"
          )}
        </span>
      ),

      width: isMaterialEfficiency ? "230px" : "158px",

      height: "60px",

      padding: "0px",

      justifyContent: "center",

      tooltipMessage: isMaterialEfficiency
        ? "Weight per dose (g)*"
        : "% PCR Content",
    },

    {
      id: "myProductComponentWeight" as keyof Component,

      label: "Weight (g)",

      justifyContent: "center",

      width: "110px",

      height: "60px",

      padding: "0px",
    },

    {
      id: isMaterialEfficiency
        ? ("myProductComponentWeightDose" as keyof Component)
        : ("myProductComponentPCRContent" as keyof Component),

      label: (
        <span style={{ whiteSpace: "nowrap" }}>
          {isMaterialEfficiency ? (
            <>
              Weight <br /> per dose (g)*
            </>
          ) : (
            "% PCR Content"
          )}
        </span>
      ),

      width: isMaterialEfficiency ? "230px" : "158px",

      height: "60px",

      justifyContent: "center",

      padding: "0px",

      tooltipMessage: isMaterialEfficiency
        ? "Weight per dose (g)*"
        : "% PCR Content",
    },
  ];
};

const createColumn = (
  prefix: string
): Array<SortableTableHeaderProps["column"]> => [
  {
    id: `${prefix}Weight` as keyof IGreenChemFormulationData,

    label: "% w/w",

    justifyContent: "center",

    width: "110.09px",

    height: "42px",

    padding: "12px 18px",
  },

  {
    id: `${prefix}Organic` as keyof IGreenChemFormulationData,

    label: <span style={{ whiteSpace: "nowrap" }}>% organic</span>,

    width: "160.09px",

    height: "42px",

    padding: "12px 15px",

    justifyContent: "center",

    tooltipMessage: "% organic",
  },

  {
    id: `${prefix}Renewable` as keyof IGreenChemFormulationData,

    label: <span style={{ whiteSpace: "nowrap" }}>% renewable origin</span>,

    width: "224.83px",

    height: "42px",

    padding: "12px 15px",

    justifyContent: "center",

    tooltipMessage: "% renewable origin",
  },
];

const createRenewableColumns = (): Array<
  SortableTableHeaderProps["column"]
> => [...createColumn("baseline"), ...createColumn("myProduct")];

const getHeaderColumns2 = (
  currentTab: string
): Array<SortableTableHeaderProps["column"]> => {
  switch (currentTab) {
    case "MATERIAL_EFFICIENCY":

    // fallthrough

    case "PCR_CONTENT":
      return createMaterialEfficiencyPCRColumns(currentTab);

    case "RENEWABLE":
      return createRenewableColumns();

    default:
      return [];
  }
};
const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  order,
  orderBy,
  onRequestSort,
  column,
  tab,
}) => {
  const {
    id,
    label,
    align,
    colSpan = 1,
    rowSpan = 1,
    width,
    height,
    justifyContent = "left",
    tooltipMessage,
    padding,
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
        height: height ?? "96px",
        width: width,
        minWidth: width,
        padding: padding,
        border: "1px solid #E4E7EC",
        backgroundColor: "#F8F8F8",
        tableLayout: "fixed",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent={justifyContent}>
        <span style={{ whiteSpace: "nowrap" }}>{label}</span>
        {tooltipMessage && (
          <CustomTooltip title={tooltipMessage}>
            <IconButton size="small" className="info-icon">
              <img src={resultinfo} alt="result-info"/>
            </IconButton>
          </CustomTooltip>
        )}
        {tab == "RENEWABLE" ? (
          <TableSortLabel
            active={orderBy === id}
            direction={order}
            onClick={handleSort}
            sx={{
              "&.Mui-active": {
                color: "theme.palette.primary.main",
                fontWeight: "bold",
              },
              "& .MuiTableSortLabel-icon": {
                opacity: 0.3,
                transition: "opacity 0.3s",
              },
              "&:hover .MuiTableSortLabel-icon": {
                opacity: 1,
              },
            }}
          ></TableSortLabel>
        ) : (
          ""
        )}
      </Box>
    </TableCell>
  );
};
const DetailedTable = (props: DetailedTableProps) => {
  const {
    productEnvironmentalFootprintData,
    sustainablePackagingData,
    greenChemistryData,
  } = useContext(ResultDataContext);
  const staticData =
    productEnvironmentalFootprintData?.packaging?.consumerPackaging;
  const totalData = sustainablePackagingData?.materialEfficiency?.barData;
  const totalPCRData = sustainablePackagingData?.pcrContent?.dialData;
  const totalRenewablePercent =
    greenChemistryData?.renewableOriginBonus?.totalPercent;
  const renewableData: IGreenChemFormulationData[] =
    greenChemistryData?.renewableOriginBonus?.robTableData;
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});
  const [outerSort, setOuterSort] = useState<{
    orderBy: keyof Component | keyof IGreenChemFormulationData | null;
    order: "asc" | "desc";
  }>({
    order: "asc",
    orderBy: null,
  });
  const {  isBaselineSkipped } = useContext(ProductDataContext);

  const [innerSort, setInnerSort] = useState<{
    orderBy: keyof ComponentDetail | null;
    order: "asc" | "desc";
  }>({
    order: "asc",
    orderBy: null,
  });

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const headerColumns = getHeaderColumns(props.currentTab);
  const headerColumns2 = getHeaderColumns2(props.currentTab);
  const handleOuterSort = (
    property: keyof Component | keyof IGreenChemFormulationData
  ) => {
    if (
      property === "baseLineComponentWeight" ||
      property === "myProductComponentWeight" ||
      property === "myProductComponentWeightDose" ||
      property === "baselineComponentWeightDose" ||
      property === "rawMaterialTradeName" ||
      property === "rawCode" ||
      property === "baselineComponentPCRContent" ||
      property === "myProductComponentPCRContent" ||
      property === "baselineWeight" ||
      property === "baselineOrganic" ||
      property === "baselineRenewable" ||
      property === "componentName" ||
      property === "myProductWeight" ||
      property === "myProductOrganic" ||
      property === "myProductRenewable"
    ) {
      setOpenRows({});
    }
    const isAsc = outerSort.orderBy === property && outerSort.order === "asc";
    setOuterSort({ orderBy: property, order: isAsc ? "desc" : "asc" });
  };

  const handleInnerSort = (property: keyof ComponentDetail) => {
    const isAsc = innerSort.orderBy === property && innerSort.order === "asc";
    setInnerSort({ orderBy: property, order: isAsc ? "desc" : "asc" });
  };

  const handleSortingRequest = (
    property:
      | keyof Component
      | keyof ComponentDetail
      | keyof IGreenChemFormulationData
  ) => {
    const isOuterSort =
      property === "componentName" ||
      property === "baseLineComponentWeight" ||
      property === "myProductComponentWeight" ||
      property === "myProductComponentWeightDose" ||
      property === "baselineComponentWeightDose" ||
      property === "rawMaterialTradeName" ||
      property === "rawCode" ||
      property === "baselineComponentPCRContent" ||
      property === "myProductComponentPCRContent" ||
      property === "baselineWeight" ||
      property === "baselineOrganic" ||
      property === "baselineRenewable" ||
      property === "myProductWeight" ||
      property === "myProductOrganic" ||
      property === "myProductRenewable";

    if (isOuterSort) {
      // Reset innerSort when switching to outerSort
      setInnerSort({ orderBy: null, order: "asc" });
      handleOuterSort(
        property as keyof Component | keyof IGreenChemFormulationData
      );
    } else {
      // Reset outerSort when switching to innerSort
      setOuterSort({ orderBy: null, order: "asc" });
      handleInnerSort(property as keyof ComponentDetail);
    }
  };

  const getFormattedValue = (
    currentTab: string,
    pcrValue: string | undefined,
    weightValue: string | undefined
  ): string => {
    let formattedValue = "";

    if (currentTab === "PCR_CONTENT") {
      formattedValue =
        pcrValue != null ? parseFloat(pcrValue).toFixed(2) + "%" : "";
    } else {
      formattedValue =
        weightValue != null ? parseFloat(weightValue).toFixed(2) : "";
    }

    return formattedValue;
  };

  const renderTotal = () => {
    const formatValue = (value: string) =>
      value ? parseFloat(value)?.toFixed(2) : "0.00";
    
    if (props.currentTab === "PCR_CONTENT") {
      return (
        <TableRow className="result_detailed_table_div1">
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>

          <TableCell style={{}} className="result_detailed_table_total">
            Total
          </TableCell>
          <TableCell style={{}} className="result_detailed_table_total_value">
            { !isBaselineSkipped ? formatValue(totalPCRData?.baseline) + "%" : '' }
          </TableCell>
          <TableCell style={{}}>&nbsp;</TableCell>
          <TableCell style={{}} className="result_detailed_table_total_value">
            {formatValue(totalPCRData?.myproduct) + "%"}
          </TableCell>
        </TableRow>
      );
    }
    if (props.currentTab == "RENEWABLE") {
      return (
        <TableRow className="result_detailed_table_div1">
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>
          <TableCell
            className="result_detailed_table_total"
            style={{ width: "90%", textAlign: "center" }}
          >
            Total
          </TableCell>
          <TableCell className="result_detailed_table_total_value">
            {!isBaselineSkipped ? formatValue(totalRenewablePercent?.baselineOrganic) + "%" : 'N/A'}
          </TableCell>
          <TableCell className="result_detailed_table_total_value">
           {!isBaselineSkipped ? formatValue(totalRenewablePercent?.baselineRenewable) + "%" : 'N/A'}
          </TableCell>
          <TableCell className="result_detailed_table_total_value"></TableCell>
          <TableCell className="result_detailed_table_total_value">
            {formatValue(totalRenewablePercent?.myproductOrganic) + "%"}
          </TableCell>
          <TableCell className="result_detailed_table_total_value">
            {formatValue(totalRenewablePercent?.myproductRenewable) + "%"}
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow className="result_detailed_table_div1">
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell
          className="result_detailed_table_total"
          style={{ width: "45%", textAlign: "center" }}
        >
          Total
        </TableCell>
        <TableCell className="result_detailed_table_total_value">
          {!isBaselineSkipped ? formatValue(totalData?.baseline) : ""}
        </TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell className="result_detailed_table_total_value">
          {formatValue(totalData?.myproduct)}
        </TableCell>
      </TableRow>
    );
  };
  return (
    <TableContainer
      className="custom-table-container origin-bonus-table"
      sx={{
        maxHeight: "800px",
      }}
    >
      <Box sx={{ maxWidth: "1330px" }}>
        {" "}
        {/* ✅ Force table min-width */}{" "}
        <Table
          stickyHeader
          sx={{
            width: "100%",
            tableLayout:
              props.currentTab === "PCR_CONTENT" ||
              props.currentTab === "MATERIAL_EFFICIENCY"
                ? "fixed"
                : "auto", // fills wrapper
          }}
        >
          <colgroup>{getColGroup(props.currentTab)}</colgroup>

          <TableHead
            sx={{
              position: "sticky",
              zIndex: 1,
              "& th": {
                fontFamily: "kenvue-sans",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "150%",
                color: "#000000",
              },
            }}
          >
            {/* First Row */}
            <TableRow className="header-row header-first-row">
              {headerColumns?.map((column) => {
                const isInnerSort =
                  props.currentTab === "PCR_CONTENT" ||
                  props.currentTab === "MATERIAL_EFFICIENCY";
                const sortConfig =
                  isInnerSort &&
                  (column.id === "materialName" || column.id === "materialType")
                    ? innerSort
                    : outerSort;

                const isActive =
                  sortConfig.orderBy === column.id &&
                  ((isInnerSort && sortConfig === innerSort) ||
                    (!isInnerSort && sortConfig === outerSort)); // Ensure correct config is active
                const order = isActive ? sortConfig.order : undefined; // Order only for the active column
                return (
                  <SortableTableHeader
                    key={column.id}
                    order={order}
                    orderBy={sortConfig.orderBy}
                    onRequestSort={handleSortingRequest}
                    column={column}
                    tab={props.currentTab}
                  />
                );
              })}

              <TableCell
                align="center"
                sx={{
                  maxWidth:
                    props.currentTab == "PCR_CONTENT" ? "268px" : "339.75px",
                  backgroundColor: "#F8F8F8",
                  border: "1px solid #E4E7EC",
                  height: "36px",
                  padding: "0px",
                }}
                colSpan={props.currentTab == "RENEWABLE" ? 3 : 2}
              >
                <span>Baseline Product</span>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width:
                    props.currentTab == "PCR_CONTENT" ? "268px" : "339.75px",
                  padding: "0px",
                  paddingLeft: "0px",
                  backgroundColor: "#F8F8F8",
                  border: "1px solid #E4E7EC",
                  height: "36px",
                }}
                colSpan={props.currentTab == "RENEWABLE" ? 3 : 2}
              >
                My Product
              </TableCell>
            </TableRow>

            {/* Second Row */}
            <TableRow
              sx={{
                top: "36px",
                position: "sticky",
              }}
              className="header-second-row"
            >
              {headerColumns2?.map((column) => (
                <SortableTableHeader
                  key={column.id}
                  order={
                    outerSort.orderBy === column.id
                      ? outerSort.order
                      : undefined
                  }
                  orderBy={outerSort.orderBy}
                  onRequestSort={handleSortingRequest}
                  column={column}
                  tab={props.currentTab}
                />
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {props.currentTab == "RENEWABLE" &&
              sortData(
                [...renewableData],
                outerSort.orderBy as keyof IGreenChemFormulationData,
                outerSort.order
              ).map((row, index) => (
                <TableRow
                  hover
                  key={index + 1}
                  sx={{
                    cursor: "pointer",
                    height: "72px !important",
                    "& td": {
                      height: "72px",
                      maxHeight: "72px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      padding: "16px 20px",
                      border: "1px solid #e0e0e0",
                      color: "#000",
                      fontFamily: "kenvue-sans-regular",
                      fontSize: "13.33px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                    },
                  }}
                >
                  <TableCell className="table-cell-0">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          flexGrow: 1,
                          fontWeight: "400",
                          fontFamily: "kenvue-sans-regular",
                          fontSize: "14px",
                          color: "#000",
                          lineHeight: "18px",
                        }}
                      >
                        {row.rawMaterialTradeName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell className="table-cell-1">{row.rawCode}</TableCell>

                  {/* For Renewable Tab */}
                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="table-cell-2"
                  >
                    <CustomTooltip
                      title={
                        row.baselineWeight
                          ? parseFloat(row.baselineWeight)?.toFixed(6)
                          : ""
                      }
                    >
                      <span>
                        {row.baselineWeight
                          ? parseFloat(row.baselineWeight)?.toFixed(2)
                          : ""}
                      </span>
                    </CustomTooltip>
                  </TableCell>

                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="table-cell-3"
                  >
                    {row.baselineOrganic
                      ? parseFloat(row.baselineOrganic)?.toFixed(2)
                      : ""}
                  </TableCell>

                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="table-cell-4"
                  >
                    {row.baselineRenewable}
                  </TableCell>

                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="table-cell-5"
                  >
                    <CustomTooltip
                      title={
                        row.myProductWeight
                          ? parseFloat(row.myProductWeight)?.toFixed(6)
                          : ""
                      }
                    >
                      <span>
                        {row.myProductWeight
                          ? parseFloat(row.myProductWeight)?.toFixed(2)
                          : ""}
                      </span>
                    </CustomTooltip>
                  </TableCell>

                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="table-cell-6"
                  >
                    {row.myProductOrganic
                      ? parseFloat(row.myProductOrganic)?.toFixed(2)
                      : ""}
                  </TableCell>

                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="table-cell-7"
                  >
                    {row.myProductRenewable}
                  </TableCell>
                </TableRow>
              ))}
            {props.currentTab !== "RENEWABLE" &&
              sortData(
                [...staticData],
                outerSort.orderBy as keyof Component,
                outerSort.order
              ).map((row, index) => {
                const getDisplayValue = (
                  value: number | null | undefined,
                  isPercentage: boolean = false
                ): string => {
                  if (value == null) {
                    return "";
                  }

                  let formattedValue = value.toFixed(2);

                  if (isPercentage) {
                    formattedValue += "%";
                  }

                  return formattedValue;
                };

                const isPCRContent = props.currentTab === "PCR_CONTENT";

                const displayValue = isPCRContent
                  ? getDisplayValue(row?.baselineComponentPCRContent, true)
                  : getDisplayValue(row?.baselineComponentWeightDose);

                const displayMyProduct = isPCRContent
                  ? getDisplayValue(row?.myProductComponentPCRContent, true)
                  : getDisplayValue(row?.myProductComponentWeightDose);

                return (
                  <React.Fragment key={index + 1}>
                    <TableRow
                      hover
                      sx={{
                        cursor: "pointer",
                        height: "72px",
                        "& td": {
                          height: "72px",
                          maxHeight: "72px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          padding: "16px 20px",
                          border: "1px solid #E4E7EC",
                          color: "#000",
                          fontFamily: "kenvue-sans-regular",
                          fontSize: "13.33px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "150%",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",

                              display: "block",
                              fontWeight: "700",
                              fontFamily: "kenvue-sans",
                              fontSize: "14px",
                              color: "#000000",
                              lineHeight: "18px",
                            }}
                          >
                            {row.componentName}
                            <IconButton
                              size="small"
                              aria-label="expand row"
                              data-testid="ExpandMoreIcon"
                              sx={{
                                ml: 1,
                                transform: openRows[index]
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.3s",
                              }}
                              onClick={() => toggleRow(index)}
                            >
                              <ExpandMore />
                            </IconButton>
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>

                      {props.currentTab === "RECYCLE_READY" ||
                      props.currentTab === "PCR_CONTENT" ? (
                        <TableCell></TableCell>
                      ) : (
                        ""
                      )}

                      <TableCell sx={{ textAlign: "center" }}>
                        {row.baseLineComponentWeight
                          ? row.baseLineComponentWeight?.toFixed(2)
                          : ""}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {displayValue}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.myProductComponentWeight?.toFixed(2) ?? ""}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {displayMyProduct}
                      </TableCell>
                    </TableRow>
                    {openRows[index] && (
                      <>
                        {sortData(
                          [...row.details],
                          innerSort.orderBy,
                          innerSort.order
                        ).map((detail, index) => (
                          <TableRow
                            key={index + 1}
                            sx={{
                              "& td": {
                                height: "72px",
                                maxHeight: "72px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                backgroundColor: "#F8F8F8",
                                border: "1px solid #E4E7EC", // Add border to each cell
                                padding: "16px 20px !important",
                                color: "#000",
                                fontFamily: "kenvue-sans-regular",
                                fontSize: "13.33px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "150%",
                              },
                            }}
                          >
                            <TableCell></TableCell>

                            <EllipsisTooltipCell>
                             {detail.sub_component_name}
                            </EllipsisTooltipCell>

                            <EllipsisTooltipCell>
                              {detail.materialName}
                            </EllipsisTooltipCell>

                            {/* <TableCell>{detail.materialName}</TableCell> */}
                            <TableCell>{ detail.layer}</TableCell>

                            {props.currentTab === "RECYCLE_READY" ||
                            props.currentTab === "PCR_CONTENT" ? (
                            <EllipsisTooltipCell>
                            {detail.materialType}</EllipsisTooltipCell>
                            ) : (
                              ""
                            )}
                            <TableCell sx={{ textAlign: "center" }}>
                              {detail.baselineMaterialWeight &&
                              parseFloat(detail.baselineMaterialWeight) !== null
                                ? parseFloat(
                                    detail.baselineMaterialWeight
                                  )?.toFixed(2)
                                : ""}
                            </TableCell>

                            <TableCell sx={{ textAlign: "center" }}>
                              {getFormattedValue(
                                props.currentTab,
                                detail.baselineMaterialPCRContent,
                                detail.baselineMaterialWeightDose
                              )}
                            </TableCell>

                            <TableCell sx={{ textAlign: "center" }}>
                              {detail.myProductMaterialWeight &&
                              Number.parseFloat(detail.myProductMaterialWeight) !==
                                null
                                ? Number.parseFloat(
                                    detail.myProductMaterialWeight
                                  )?.toFixed(2)
                                : ""}
                            </TableCell>

                            <TableCell sx={{ textAlign: "center" }}>
                              {getFormattedValue(
                                props.currentTab,
                                detail.myProductMaterialPCRContent,
                                detail.myProductMaterialWeightDose
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
          </TableBody>
          <TableFooter>{renderTotal()}</TableFooter>
        </Table>
      </Box>
    </TableContainer>
  );
};
export default DetailedTable;
