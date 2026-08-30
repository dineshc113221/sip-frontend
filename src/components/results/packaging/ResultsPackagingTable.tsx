import React, { useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { ExpandMore } from "@mui/icons-material";
import "../../../assets/css/packagingtable.css";
import "../../../assets/css/SIP.css";
import "../../../assets/css/ResultsPackingTableComponent.scss";
import resultinfo from "../../../assets/images/infoiconresult.svg"
import ProgressBarWithLabel from "../../formulaAndConsumer/ProgressBarWithLabel";
import { ResultDataContext } from "../../../contexts/resultData/ResultDataContext";
import EllipsisTooltipCell from "../../common/EllipsisTooltipCell";
import { CustomTooltip } from "../../consumer-packaging-tab/TableViewPackaging.component";

interface IResultPackaging {
  currentTab: string;
}

const SortableTableHeader= ({
 
  column,
  className = "",
}) => {
  const { label, align = "left",  justifyContent = "left",
 colSpan = 1, rowSpan = 1, width, tooltipMessage,
  } = column;

 

  return (
    <TableCell
      align={align}
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={{ border: "1px solid #E4E7EC" }}
      className={className}
      sx={{
        position: "sticky",
        width: width || "auto", // Set width if provided, fallback to 'auto'
      }}
    >
      <Box display="flex" alignItems="center" justifyContent={justifyContent} {...(tooltipMessage && { gap: "12px" })}>

        <span style={{ whiteSpace: "break-word" }}>{label}</span>
        {tooltipMessage && (
          <CustomTooltip title={tooltipMessage}>
            <IconButton size="small" className="info-icon" sx={{ flexShrink: 0, width: 24, height: 24, minWidth: 24, minHeight: 24 }}>
              <img src={resultinfo} alt="result-info" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, transform: 'translate(0)' }}/>
            </IconButton>
          </CustomTooltip>
        )}
       
      </Box>
    </TableCell>
  );
};

export const ResultsPackagingTable: React.FC<IResultPackaging> = (props) => {
  const { productEnvironmentalFootprintData } =
    useContext(ResultDataContext);
  const staticData =
    productEnvironmentalFootprintData?.packaging?.consumerPackaging;
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Calculate total component PEF scores separately for baseline and myProduct
  const totalBaselineComponentFootprint = staticData.reduce(
    (sum, comp) => sum + (Number(comp.baselineComponentFootprint) || 0),
    0
  );
  const totalMyComponentFootprint = staticData.reduce(
    (sum, comp) => sum + (Number(comp.myProductComponentFootprint) || 0),
    0
  );

  // Helpers to get sum of material PEF scores for a component (baseline and myProduct)
  const getMaterialBaselineSum = (details = []) =>
    details.reduce(
      (sum, detail) => sum + (Number(detail.baselineEnvironmentalFootprint) || 0),
      0
    );

  const getMaterialMySum = (details = []) =>
    details.reduce(
      (sum, detail) => sum + (Number(detail.myProductEnvironmentalFootprint) || 0),
      0
    );

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScrollInteraction = () => {
    setActiveTooltip(null);
  };



 



  return (
    <div className="table-wrapper-resultspacking">

      <TableContainer
        component={Paper}
        className="table-container-results"
        onScrollCapture={handleScrollInteraction}
        onWheel={handleScrollInteraction}
        sx={{ overflow: "auto" }}
      >
        <Box sx={{ maxWidth: "1339px" }}>
         
               <Table
                 stickyHeader
                 sx={{
                   width: "100%",
                   tableLayout:"fixed"
                    
                 }}
          >
             <colgroup>
          
                <col style={{ width: "110px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "95px" }} />
                <col style={{ width: "135px" }} />
                <col style={{ width: "85px" }} />
                <col style={{ width: "229px" }} />
                <col style={{ width: "85px" }} />
                <col style={{ width: "229px" }} />

            </colgroup>
          <TableHead
            sx={{
              position: "sticky",
              zIndex: 1,
              fontWeight: "bold",

              "& th": {
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
                whiteSpace: "normal",
                wordWrap: "break-word",
              },
              "& .MuiTableSortLabel-root:not(.Mui-active)": {
                fontWeight: "bold",
              },
            }}
          >
            <TableRow
              className="table-first-heading-row"
              sx={{
                position: "sticky",
                top: "0px", // Adjust this value according to the height of the previous row
                "& th": {
                  textAlign: 'center',
                  whiteSpace: "normal", // Allow normal white space
                  wordWrap: "break-word", // Allow words to break
                  height: "10px !important",
                  padding: "12px",
                },
              }}
            >
              <SortableTableHeader
             
                className="table-cell0"
                column={{
                  id: "componentName",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
                <>
                  Component
                  <br />
                  Name
                </>
              }
            </span>
          ),
                  rowSpan: 2,
                  width: "125px",
                }}
              />
              <SortableTableHeader
             
                className="table-cell1"
                column={{
                  id: "componentName",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
                <>
                  Sub component
                  <br />
                  Name
                </>
              }
            </span>
          ),
                  rowSpan: 2,
                  width: "154px",
                }}
              />
                 <SortableTableHeader
                
                className="table-cell2"
                column={{
                  id: "materialName",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
                <>
                  Material
                  <br />
                  Name
                </>
              }
            </span>
          ),
                  rowSpan: 2,
                  width: "140px",
                }}
              />
              <SortableTableHeader
               
                className="table-cell3"
                column={{
                  id: "materialName",
                  label: "Layer",
                  rowSpan: 2,
                  width: "105px",
                }}
              />
              <SortableTableHeader
               
                className="table-cell4"
                column={{
                  id: "materialType",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
                <>
                  Material
                  <br />
                  Type
                </>
              }
            </span>
          ),
                  rowSpan: 2,
                  width: "111px",
                }}
              />
              <SortableTableHeader
              
                className="table-cell5"
                column={{
                  id: "convertingProcess",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
                <>
                  Manufacturing
                  <br />
                  Process
                </>
              }
            </span>
          ),
                  rowSpan: 2,
                  width: "145px",
                }}
              />
              <TableCell
                className="table-cell6"
                colSpan={2}

                style={{ border: "1px solid #E4E7EC", textAlign: 'center',color:'#000',padding:'8px 12px !important' }}
                sx={{

                  position: "sticky",
                  border: "1px solid #E4E7EC",
                  width: '382px',
                  "& .MuiTableRow-root th": {
                    padding:'8px 12px !important'
                  }
                }}
              >
                Baseline Product
              </TableCell>
              <TableCell
                className="table-cell7"
                colSpan={2}
                align="center"
                style={{ border: "1px solid #E4E7EC", textAlign: 'center',color:'#000' }}
                sx={{
                  position: "static",
                  border: "1px solid #E4E7EC",
                  width: '382px'
                }}
              >
                My Product
              </TableCell>
            </TableRow>
            <TableRow
              className="table-second-heading-row"
              sx={{
                position: "sticky",
                top: "36px",
                "& th": {
                  whiteSpace: "normal", // Allow normal white space
                  wordWrap: "break-word", // Allow words to break
                },
              }}
            >
              <SortableTableHeader
              className="table-cell7"

                column={{
                  id: "baseLineComponentWeight",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
             <>Weight (g)</>
              }
            </span>
          ),
                  // label: "Weight (g)",
                  justifyContent : "center"
                }}
              />
              <SortableTableHeader
                                className="table-cell7"

                column={{
                  id: "baselineEnvironmentalFootprint",
                  label: (
                    <span>
                      {props.currentTab ===
                        "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                        ? "Product Environmental Footprint (points)"
                        : " Product Carbon Footprint \n(g CO2 eq.)"}

                    </span>
                  ),
                  tooltipMessage: props.currentTab ===
                    "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                    ? "Product Environmental Footprint (points)"
                    : " Product Carbon Footprint \n(g CO2 eq.)",

                }}
              />
              <SortableTableHeader
                                className="table-cell7"

                column={{
                  id: "myProductComponentWeight",
                  label: (
            <span style={{ whiteSpace: "nowrap" }}>
              {
             <>Weight (g)</>
              }
            </span>
          ),
                  justifyContent : "center"
                }}
              />
              <SortableTableHeader
                                className="table-cell7"

                column={{
                  id: "myProductEnvironmentalFootprint",
                  label: (
                    <span>
                      {props.currentTab ===
                        "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                        ? "Product Environmental Footprint (points)"
                        : " Product Carbon Footprint \n(g CO2 eq.)"}

                    </span>
                  ),
                  tooltipMessage: props.currentTab ===
                    "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                    ? "Product Environmental Footprint (points)"
                    : " Product Carbon Footprint \n(g CO2 eq.)",

                }}
              />
            </TableRow>
          </TableHead>
          <TableBody className="table-body-results">
            {staticData.map((row, index) => {
              // Calculate component-level fill percentages separately for baseline and myProduct
              const compBaselineFootprint = Number(row.baselineComponentFootprint) || 0;
              const compBaselineFillPercent = totalBaselineComponentFootprint > 0 ? (compBaselineFootprint / totalBaselineComponentFootprint) * 100 : 0;

              const compMyFootprint = Number(row.myProductComponentFootprint) || 0;
              const compMyFillPercent = totalMyComponentFootprint > 0 ? (compMyFootprint / totalMyComponentFootprint) * 100 : 0;

              // For material-level, precompute sums for this component (baseline and myProduct)
              const details = row.details || [];
              const materialBaselineSum = getMaterialBaselineSum(details);
              const materialMySum = getMaterialMySum(details);

              return (
                <React.Fragment key={index + 1}>
                  <TableRow
                    className="consumer-component-table-cell"
                    hover
                    sx={{
                      cursor: "pointer",
                      "& td": {
                        border: "1px solid #e0e0e0", // Add border to each cell
                        padding: "12px !important",
                        fontSize: "13.33px",
                        color: '#000000',
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ overflow: "hidden" }}
                      >
                        <CustomTooltip title={row.componentName}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              whiteSpace: "normal",
                              minWidth: 0,
                            }}
                            className="consumer-component-table-cell-typography"
                          >
                            {row.componentName}
                          </Typography>
                        </CustomTooltip>
                        <IconButton
                          size="small"
                          aria-label="expand row"
                          onClick={() => toggleRow(index)}
                          sx={{ flexShrink: 0 }}
                        >
                          {openRows[index] ? <ExpandMore /> : <ChevronRight />}
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{ textAlign: "center", width: "137px" }}>
                      {row.baseLineComponentWeight ? row.baseLineComponentWeight?.toFixed(2) : ""}
                    </TableCell>
                    <TableCell width={"260px"} style={{ padding: "12px 24px !important" }}>
                      {Boolean(row.baseLineComponentWeight) && (
                        <CustomTooltip
                          title={Number(row.baselineComponentFootprint || 0).toFixed(6)}
                          PopperProps={{
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [50, -10],
                                },
                              },
                            ],
                          }}
                          open={activeTooltip === `comp-baseline-${index}`}
                          onOpen={() => setActiveTooltip(`comp-baseline-${index}`)}
                          onClose={() => setActiveTooltip(null)}
                        >
                          <span>
                            <ProgressBarWithLabel
                              value={compBaselineFillPercent}
                              color="#3F7AB4"
                              label={`${Number(row.baselineComponentFootprint || 0).toFixed(2)}`}
                              width="130px"
                            />
                          </span>
                        </CustomTooltip>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", width: "137px" }}>
                      {row.myProductComponentWeight ? row.myProductComponentWeight?.toFixed(2) : ""}
                    </TableCell>
                    <TableCell width={"260px"} style={{ padding: "12px 24px !important" }}>
                      {Boolean(row.myProductComponentWeight) && (
                        <CustomTooltip
                          title={Number(row.myProductComponentFootprint || 0).toFixed(6)}
                          PopperProps={{
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [50, -10],
                                },
                              },
                            ],
                          }}
                          open={activeTooltip === `comp-myproduct-${index}`}
                          onOpen={() => setActiveTooltip(`comp-myproduct-${index}`)}
                          onClose={() => setActiveTooltip(null)}
                        >
                          <span>
                            <ProgressBarWithLabel
                              value={compMyFillPercent}
                              color="#3F7AB4"
                              label={`${Number(row.myProductComponentFootprint || 0).toFixed(2)}`}
                              width="130px"
                            />
                          </span>
                        </CustomTooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  {openRows[index] && (
                    <>
                      {details.map((detail, detailIndex) => {
                        // Material-level fill percentages for baseline and myProduct
                        const matFootprint = Number(detail.baselineEnvironmentalFootprint) || 0;
                        const matFillPercent = materialBaselineSum > 0 ? (matFootprint / materialBaselineSum) * 100 : 0;
                        const myMatFootprint = Number(detail.myProductEnvironmentalFootprint) || 0;
                        const myMatFillPercent = materialMySum > 0 ? (myMatFootprint / materialMySum) * 100 : 0;
                        return (
                          <TableRow
                            key={detailIndex + 1}
                            sx={{
                              "& td": {
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e0e0e0", // Add border to each cell
                                padding: "12px !important",
                                fontSize: "13.33px",
                                color: "#000000",
                              },
                            }}
                          >
                            <TableCell></TableCell>
                            <EllipsisTooltipCell maxWidth={200}>{detail.sub_component_name}</EllipsisTooltipCell>
                            <EllipsisTooltipCell maxWidth={200}>{detail.materialName}</EllipsisTooltipCell>
                            <TableCell>{detail.layer}</TableCell>
                            <EllipsisTooltipCell maxWidth={100}>{detail.materialType}</EllipsisTooltipCell>
                            <EllipsisTooltipCell maxWidth={154}>{detail.convertingProcess}</EllipsisTooltipCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {detail.baselineWeight ? parseFloat(detail.baselineWeight).toFixed(2) : ""}
                            </TableCell>
                            <TableCell style={{ padding: "12px 24px !important" }}>
                              {detail.baselineWeight && (
                                <CustomTooltip
                                  title={Number(detail.baselineEnvironmentalFootprint || 0).toFixed(6)}
                                  PopperProps={{
                                    modifiers: [
                                      {
                                        name: "offset",
                                        options: {
                                          offset: [50, -10],
                                        },
                                      },
                                    ],
                                  }}
                                  open={activeTooltip === `detail-baseline-${index}-${detailIndex}`}
                                  onOpen={() => setActiveTooltip(`detail-baseline-${index}-${detailIndex}`)}
                                  onClose={() => setActiveTooltip(null)}
                                >
                                  <span>
                                    <ProgressBarWithLabel
                                      value={matFillPercent}
                                      color="#3F7AB4"
                                      label={`${Number(detail.baselineEnvironmentalFootprint || 0).toFixed(2)}`}
                                      width="130px"
                                    />
                                  </span>
                                </CustomTooltip>
                              )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {detail.myProductWeight ? parseFloat(detail.myProductWeight).toFixed(2) : ""}
                            </TableCell>
                            <TableCell style={{ padding: "12px 24px !important" }}>
                              {detail.myProductWeight && (
                                <CustomTooltip
                                  title={Number(detail.myProductEnvironmentalFootprint || 0).toFixed(6)}
                                  PopperProps={{
                                    modifiers: [
                                      {
                                        name: "offset",
                                        options: {
                                          offset: [50, -10],
                                        },
                                      },
                                    ],
                                  }}
                                  open={activeTooltip === `detail-myproduct-${index}-${detailIndex}`}
                                  onOpen={() => setActiveTooltip(`detail-myproduct-${index}-${detailIndex}`)}
                                  onClose={() => setActiveTooltip(null)}
                                >
                                  <span>
                                    <ProgressBarWithLabel
                                      value={myMatFillPercent}
                                      color="#3F7AB4"
                                      label={`${Number(detail.myProductEnvironmentalFootprint || 0).toFixed(2)}`}
                                      width="130px"
                                    />
                                  </span>
                                </CustomTooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
          </Table>
          </Box>
      </TableContainer>

    </div>
  );
};
