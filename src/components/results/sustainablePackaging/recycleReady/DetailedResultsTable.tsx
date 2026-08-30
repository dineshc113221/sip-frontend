import React, { useEffect, useState,useContext } from "react";
import { RRSortableTableHeader } from "../common/SortableTableHeader";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableBody,
  Box,
  Typography,
  TableFooter,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { sortData } from "../../../../helper/GenericFunctions";
import { IRRDetailTable } from "../../../../structures/result";
import { IDetailTableData, OrderByType } from "../structure";
import { CustomTooltip } from "../../../consumer-packaging-tab/TableViewPackaging.component";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

interface IRRDetailedResultsTableProps {
  data: IRRDetailTable[];
  baselinePercentage: string | undefined;
  myProductPercentage: string | undefined;
}

export const RRDetailedResultsTable: React.FC<IRRDetailedResultsTableProps> = ({
  data,
  baselinePercentage,
  myProductPercentage
}: IRRDetailedResultsTableProps) => {
  const {  isBaselineSkipped } = useContext(ProductDataContext);
  const [sort, setSort] = useState<{
    orderBy: OrderByType|null;
    order: "asc" | "desc";
  }>({
    order: "asc",
    orderBy: null,
  });
  const [displayData, setDisplayData] = useState<IDetailTableData[]>([]);
  const [sortedOuterData, setSortedOuterData] =
    useState<IDetailTableData[]>(displayData);
    const getColor = (recycleReadyStatus) => {
      if (recycleReadyStatus === "Yes") {
        return "#67C1B3";
      } else if (recycleReadyStatus === "No") {
        return "#FFA6A6";
      } else {
        return ""; // No color for empty string
      }
    };
  useEffect(() => {
    setDisplayData(
      data?.map((item) => ({
        componentType: item.componentType,
        packagingLayer: item.packagingLayer,
        baselineWeight: item.baselineProduct.weight,
        baselineRecycleReady: item.baselineProduct.recycleReady,
        myProductWeight: item.myProduct.weight,
        myProductRecycleReady: item.myProduct.recycleReady,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (displayData) {
      setSortedOuterData(sortData([...displayData], sort.orderBy, sort.order));
    }
  }, [displayData, sort.order, sort.orderBy]);

  const handleSort = (property: OrderByType) => {
    const isAsc = sort.orderBy === property && sort.order === "asc";
    setSort({ orderBy: property, order: isAsc ? "desc" : "asc" });
  };

  return (
    <div className="table-wrapper1 recycle-table">
    
          <TableContainer
            className="table-container"
            sx={{ maxHeight: "80vh" }}
          >
            <Table stickyHeader>
              <TableHead
                sx={{
                  position: "sticky",
                  zIndex: 1,

                  "& th": {
                    backgroundColor: "#F8F8F8",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    padding: "6px 1px 6px 8px !important",
                  },
                  "& .MuiTableSortLabel-root:not(.Mui-active)": {
                    fontWeight: 700,
                  },
                }}
              >
                <TableRow
                 
                  className="first-header-row"
                >
                  <RRSortableTableHeader
                    order={sort.orderBy==='componentType'?sort.order:undefined}
                    orderBy={sort.orderBy}
                    onRequestSort={handleSort}
                    column={{
                      id: "componentType",
                      label: "Component Type",
                      rowSpan: 2,
                    }}
                  />
                  <RRSortableTableHeader
                    order={sort.orderBy==='packagingLayer'?sort.order:undefined}
                    orderBy={sort.orderBy}
                    onRequestSort={handleSort}
                    column={{
                      id: "packagingLayer",
                      label: "Packaging Layer",
                      rowSpan: 2,
                    }}
                  />
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{
                      border: "1px solid #E4E7EC !important",
                     
                      backgroundColor: "#F8F8F8 !important",
                      fontFamily: "kenvue-sans !important",
                    }}
                  >
                    Baseline Product
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{
                      border: "1px solid #E4E7EC !important ",
                    
                      backgroundColor: "#F8F8F8 !important",
                      fontFamily: "kenvue-sans !important",
                    }}
                  >
                    My Product
                  </TableCell>
                </TableRow>
                <TableRow
                  className="second-header-row"
                  sx={{
                    position: "sticky",
                    top: "36px",
                    "& th": {
                      whiteSpace: "normal", // Allow normal white space
                      wordWrap: "break-word", // Allow words to break
                      backgroundColor: "#F8F8F8 !important",
                    },
                  }}
                >
                  <RRSortableTableHeader
                     order={sort.orderBy==='baselineWeight'?sort.order:undefined}
                    orderBy={sort.orderBy}
                    onRequestSort={handleSort}
                    column={{
                      id: "baselineWeight",
                      label: "Weight (g)",
                      align: "center",
                    }}
                  />
                  <RRSortableTableHeader
                     order={sort.orderBy==='baselineRecycleReady'?sort.order:undefined}
                    orderBy={sort.orderBy}
                    onRequestSort={handleSort}
                    column={{
                      id: "baselineRecycleReady",
                      align: "center",
                      label: (
                        <span
                          style={{
                            whiteSpace: "pre-line",
                          }}
                        >
                          Recycle Ready?
                          <CustomTooltip title="Recycle Ready">
                            <IconButton
                              size="small"
                              className="info-icon"
                              sx={{ ml: 1 }}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </CustomTooltip>
                        </span>
                      ),
                    }}
                  />
                  <RRSortableTableHeader
                     order={sort.orderBy==='myProductWeight'?sort.order:undefined}
                    orderBy={sort.orderBy}
                    onRequestSort={handleSort}
                    column={{
                      id: "myProductWeight",
                      label: "Weight (g)",
                      align: "center",
                    }}
                  />
                  <RRSortableTableHeader
                     order={sort.orderBy==='myProductRecycleReady'?sort.order:undefined}
                    orderBy={sort.orderBy}
                    onRequestSort={handleSort}
                    column={{
                      id: "myProductRecycleReady",
                      width: "202.66px",
                      align: "center",
                      label: (
                        <span
                          style={{
                            whiteSpace: "pre-line",
                            width: "100%",
                          }}
                        >
                          Recycle Ready?
                          <CustomTooltip title="Recycle Ready">
                            <IconButton
                              size="small"
                              className="info-icon"
                              sx={{ ml: 1 }}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </CustomTooltip>
                        </span>
                      ),
                    }}
                  />
                </TableRow>
              </TableHead>
              <TableBody sx={{fontFamily: "kenvue-sans-regular"}}>
                {sortedOuterData.map((row, index) => (
                  <TableRow
                    key={index + row.baselineWeight}
                    hover
                    sx={{
                      cursor: "pointer",
                      "& td": {
                        color:'#000',
                        border: "1px solid #E4E7EC", // Add border to each cell
                        padding: "10px 18px !important",
                        height: "72px",
                        fontFamily: "kenuve-sans-regular !important",
                      
                      },
                    }}
                  >
                    <TableCell sx={{ backgroundColor: "#FFFFFF !important" }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography className="outer-data" sx={{ fontFamily: "kenvue-sans-regular" }}>
                          {row.componentType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#FFFFFF !important" }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body1" className="outer-data" sx={{ fontFamily: "kenvue-sans-regular" }}>
                          {row.packagingLayer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF !important",
                      }}
                    >
                      <Typography sx={{ fontFamily: "kenvue-sans-regular", textAlign: "center" }}>
                        {row.baselineWeight}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          getColor(row.baselineRecycleReady)
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            flexGrow: 1,
                            textAlign: "center", fontFamily: "kenvue-sans-regular"
                          }}
                        >
                          {row.baselineRecycleReady}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF !important",
                      }}
                    >
                      <Typography sx={{ textAlign: "center", fontFamily: "kenvue-sans-regular" }}>
                        {row.myProductWeight}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                        getColor(row.myProductRecycleReady)
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            flexGrow: 1,
                            textAlign: "center", fontFamily: "kenvue-sans-regular"
                          }}
                        >
                          {row.myProductRecycleReady}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="recycle-table-footer">
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
              <TableCell sx={{ fontFamily: "kenvue-sans-regular" }}>Total</TableCell>
              <TableCell className="total-value" sx={{ fontFamily: "kenvue-sans" }}>{ !isBaselineSkipped ? baselinePercentage : "N/A"}</TableCell>
                  <TableCell></TableCell>
              <TableCell className="total-value" sx={{ fontFamily: "kenvue-sans" }}>{myProductPercentage}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
       
    </div>
  );
};
