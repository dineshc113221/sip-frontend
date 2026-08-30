import {
    TableContainer,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableSortLabel,
    IconButton,
    Box,
    TableBody,
    Typography,
    TableFooter,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Component, GaiaComponentDetail } from "../../../../structures/packaging";
import "../../../../assets/css/table.scss";
import "../../../../assets/css/SIP.css";
import "./GaiaScore.scss"
import InfoIcon from "@mui/icons-material/Info";
import { ExpandMore } from "@mui/icons-material";
import { sortData } from "../../../../helper/GenericFunctions";
import { SortableTableHeaderProps } from "../../resultStructures";
import { GaiaTableHeader } from "../../../../constants/String.constants";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";
import { GaiaScoreMaterialCompositionsProps, GaiaScoreMaterialProps, GaiaScoreProps } from "../../../../structures/result";
import { CustomTooltip } from "../../../consumer-packaging-tab/TableViewPackaging.component";

interface TableDataType {
    rawCode: string;
    rawMaterialTradeName: string;
    concode: string;
    constituent: string;
    baseLineGaia: number;
    myProdWeight: number;
    baseLineWeight: number;
    myProdGaia: number;
    details?: TableDataType[];
}
type MergedDetail = {
    concode: string;
    constituent: string;
    baseLineGaia: number;
    myProdGaia: number;
    baseLineWeight: number;
    myProdWeight: number;
    rawCode: string;
    rawMaterialTradeName: string;
};

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
    order,
    orderBy,
    onRequestSort,
    column,
}) => {
    const {
        id,
        label,
        align,
        colSpan = 1,
        rowSpan = 1,
        width,
        tooltipMessage
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
                width: width ?? "339.75px",
                height: "96px",
                padding: "12px 24px",
                border: "1px solid #E4E7EC",
                backgroundColor: "#F8F8F8",
            }}
        >
            <Box display="flex" alignItems="center" gap="4px" justifyContent={GaiaTableHeader.includes(id) ? "left" : "center"}>

                <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                {tooltipMessage && (
                    <CustomTooltip title={tooltipMessage}>
                        <IconButton size="small" className="info-icon" sx={{ ml: 1 }}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                   </CustomTooltip>
                )}
                {
                    onRequestSort ? (
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
                        >
                        </TableSortLabel>

                    ) : null
                }
            </Box>
        </TableCell>
    );
};
const defaultComposition: GaiaScoreMaterialCompositionsProps = {
    CONNumber: "",
    Gaia_Score: null,
    USINCIName: "",
    con_adjusted_composition_without_water: 0,
    percentage: null,
    step_2_con_adjusted_composition_without_water: 0,
    step_5_gaia_con_score_without_water: { Gaia_Score: 0, step_5_gaia_con_score_without_water: 0 },
    step_9_deficit_GAIA_CON_score: 0,
    step_10_assign_gaia_score_weight: 0,
    step_11_deficit_GAIA_CON_weighted_score: 0,
    step_12_deficit_GAIA_CON_score_without_water: 0,
};
const GaiaScoreTable: React.FC = () => {
    const [gaiaTableData, setGaiaTableData] = useState<TableDataType[]>([{
        rawMaterialTradeName: "",
        rawCode: "",
        constituent: "",
        concode: "",
        baseLineWeight: 0,
        baseLineGaia: 0,
        myProdWeight: 0,
        myProdGaia: 0,
        details: [{
            rawMaterialTradeName: "",
            rawCode: "",
            constituent: "",
            concode: "",
            baseLineWeight: 0,
            baseLineGaia: 0,
            myProdWeight: 0,
            myProdGaia: 0,
        }]
    }]);
    const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({})
    const [outerSort, setOuterSort] = useState<{ orderBy: keyof Component | keyof GaiaComponentDetail|null; order: 'asc' | 'desc' }>({
        order: 'asc',
        orderBy: 'rawMaterialTradeName'
    })

    const toggleRow = useCallback((id: number) => {
        setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const handleOuterSort = (property: keyof Component | keyof GaiaComponentDetail) => {
        if (property === "baseLineComponentWeight" || property === "rawCode" || property === "myProductComponentWeightDose" || property === "baselineComponentWeightDose" || property === "rawMaterialTradeName" || property === "baseLineWeight" || property === "myProdWeight" || property === "baseLineGaia" || property === "myProdGaia") {
            setOpenRows({})
        }
        const isAsc = outerSort.orderBy === property && outerSort.order === 'asc'
        setOuterSort({ orderBy: property, order: isAsc ? 'desc' : 'asc' })
    }

    const backgroundColorCell = (value: number) => {
        if (value === null) {
            return "#F8F8F8 !important";
        }
        else if (value >= 80) {
            return "#67C1B3 !important";
        }
        else if (value < 60) {
            return "#FFA6A6 !important";
        }
        else if (value >= 60 && value < 80) {
            return "#FFD066 !important";
        }


    }
    const handleSortingRequest = (property: keyof Component | keyof GaiaComponentDetail) => {

        if (property === "rawMaterialTradeName" || property === "rawCode" || property === "baseLineWeight" || property === "myProdWeight" || property === "baseLineGaia" || property === "myProdGaia") {
            handleOuterSort(property)
        }

    }
    const { greenChemistryData } = useContext(ResultDataContext);
    const {  isBaselineSkipped } = useContext(ProductDataContext);
    const totalBaseLineGaia = greenChemistryData?.tabs?.gaiaScore?.baseline ?? '0'
    const totalMyProdGaia = greenChemistryData?.tabs?.gaiaScore?.myproduct ?? '0'


    const createMergedDetail = useCallback(
        (
            baselineComp: GaiaScoreMaterialCompositionsProps,
            myProductComp?: GaiaScoreMaterialCompositionsProps
        ): MergedDetail => {
            return {
                concode: baselineComp?.CONNumber || myProductComp?.CONNumber || "",
                constituent: baselineComp?.USINCIName || myProductComp?.USINCIName || "",
                baseLineGaia: baselineComp?.Gaia_Score != null ? Number(baselineComp?.Gaia_Score) : null,
                myProdGaia: myProductComp?.Gaia_Score != null ? Number(myProductComp?.Gaia_Score) : null,
                baseLineWeight: baselineComp?.percentage != null ? Number(baselineComp?.percentage) : null,
                myProdWeight: myProductComp?.percentage != null ? Number(myProductComp?.percentage) : null,
                rawCode: '',
                rawMaterialTradeName: '',
            };
        },
        []
    );



    // Helper function to check if a composition matches the given concode
    const isMatchingComposition = (comp: GaiaScoreMaterialCompositionsProps, concode: string): boolean => {
        return comp.CONNumber === concode;
    };




    const createRawMaterialMap = (
        rawMaterials: GaiaScoreMaterialProps[] = []
    ): Map<string, GaiaScoreMaterialProps> => {
        return new Map(rawMaterials.map((raw) => [raw.rawMaterialID, raw]));
    };

    useEffect(() => {
        const gaiaScoreData = greenChemistryData?.gaiaScore;
        const myProductData = gaiaScoreData?.myProductData as GaiaScoreProps;
        const baselineData = gaiaScoreData?.baselineData as GaiaScoreProps;

        if (!baselineData || !myProductData) {
            console.error("Missing baselineData or myProductData");
            setGaiaTableData([]);
            return;
        }

        // Create maps for quick lookup of raw materials by ID
        const baselineRawMaterialMap = createRawMaterialMap(baselineData.raw_materials);
        const myProductRawMaterialMap = createRawMaterialMap(myProductData.raw_materials);


        // Helper function to find a composition or return the default
        const findCompositionOrDefault = (
            compositions: GaiaScoreMaterialCompositionsProps[],
            concode: string,
            defaultComp: GaiaScoreMaterialCompositionsProps
        ): GaiaScoreMaterialCompositionsProps => {
            const matchingComposition = compositions.find((comp) => isMatchingComposition(comp, concode));
            return matchingComposition || defaultComp;
        };

        // Helper function to merge details for a specific concode
        const mergeDetailsForConcode = (
            concode: string,
            baselineCompositions: GaiaScoreMaterialCompositionsProps[],
            myProductCompositions: GaiaScoreMaterialCompositionsProps[],
            defaultComp: GaiaScoreMaterialCompositionsProps
        ): MergedDetail => {
            const baselineComp = findCompositionOrDefault(baselineCompositions, concode, defaultComp);
            const myProductComp = findCompositionOrDefault(myProductCompositions, concode, defaultComp);
            return createMergedDetail(baselineComp, myProductComp);
        };
        // Merge logic for raw materials
        const mergedRawMaterials = new Set([
            ...Array.from(baselineRawMaterialMap.keys()),
            ...Array.from(myProductRawMaterialMap.keys()),
        ]);

        const mergedTableData = Array.from(mergedRawMaterials).map((rawID) => {
            const baselineRaw = baselineRawMaterialMap.get(rawID);
            const myProductRaw = myProductRawMaterialMap.get(rawID);
            // Ensure compositions array exists for baseline and myProduct
            const baselineCompositions = baselineRaw?.compositions || [];
            const myProductCompositions = myProductRaw?.compositions || [];
            // Create a unified set of CONNumbers to handle all possible compositions
            const allConNumbers = new Set([
                ...baselineCompositions.map((comp) => comp.CONNumber),
                ...myProductCompositions.map((comp) => comp.CONNumber),
            ]);

            // Merge details for each concode
            const mergedDetails = Array.from(allConNumbers).map((concode) =>
                mergeDetailsForConcode(concode, baselineCompositions, myProductCompositions, defaultComposition)
            );
            return {
                rawCode: baselineRaw?.rawMaterialID || myProductRaw?.rawMaterialID || "",
                rawMaterialTradeName: baselineRaw?.tradeName || myProductRaw?.tradeName || "",
                concode: "", // Common field, if required
                constituent: "",
                baseLineGaia: baselineRaw?.step_6_GAIA_RAW_score ?? null,
                myProdGaia: myProductRaw?.step_6_GAIA_RAW_score ?? null,
                baseLineWeight: baselineRaw ? Number(baselineRaw.raw_material_value ?? null) : null,
                myProdWeight: myProductRaw ? Number(myProductRaw.raw_material_value ?? null) : null,
                details: mergedDetails,
            };
        });
        setGaiaTableData(mergedTableData);
    }, [createMergedDetail, greenChemistryData]);

let baselineGaiaValue = "N/A";

if (!isBaselineSkipped) {
  if (totalBaseLineGaia) {
    baselineGaiaValue = Number.parseFloat(totalBaseLineGaia).toFixed(2);
  } else {
    baselineGaiaValue = "0.00";
  }
}



    return (
        <>
            <div className="detailed-result-text">Detailed Results</div>
            <TableContainer className="custom-table-container" style={{ marginBottom: "36px", maxHeight: "423px" }}>
                <Table stickyHeader>
                    <TableHead
                        sx={{
                            position: "sticky",
                            zIndex: 1,
                            "& th": {

                                fontFamily: "kenvue-sans",
                                fontSize: '12px',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: '150%',
                                color: '#000',
                                textAlign: "center"
                            },
                        }}
                    >
                        <TableRow className="header-row table-header-firstrow" sx={{ height: "36px" }}>
                            <SortableTableHeader
                                 order={outerSort.orderBy==='rawMaterialTradeName'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                onRequestSort={handleSortingRequest}
                                column={{
                                    id: "rawMaterialTradeName",
                                    label: "RAW Material Trade Name",
                                    rowSpan: 2,
                                }}
                            />
                            <SortableTableHeader
                                order={outerSort.orderBy==='rawCode'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                onRequestSort={handleSortingRequest}
                                column={{
                                    id: "rawCode",
                                    label: "RAW Code",
                                    rowSpan: 2,
                                }}
                            />
                            <SortableTableHeader
                                 order={outerSort.orderBy==='constituent'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                column={{
                                    id: "constituent",
                                    label: "Constituent Name",
                                    rowSpan: 2,
                                }}
                            />
                            <SortableTableHeader
                                 order={outerSort.orderBy==='concode'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                column={{
                                    id: "concode",
                                    label: "CON Code",
                                    rowSpan: 2,
                                }}
                            />

                            <TableCell
                                align="center"
                                sx={{
                                    backgroundColor: '#F8F8F8', border: '1px solid #E4E7EC'
                                }}
                                colSpan={2}
                            >
                                <span style={{ padding: "15px 0px" }}>Baseline Product</span>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    paddingLeft: "0px", backgroundColor: '#F8F8F8', border: '1px solid #E4E7EC',
                                }}
                                colSpan={2}
                            >
                                My Product
                            </TableCell>
                        </TableRow>
                        <TableRow
                            className="table-header-secondrow"
                            sx={{
                                top: "36px",
                                position: "sticky",
                                height: "42px",
                            }}
                        >
                            <SortableTableHeader
                                 order={outerSort.orderBy==='baseLineWeight'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                onRequestSort={handleSortingRequest}
                                column={{
                                    id: "baseLineWeight",
                                    label: "%w/w*",
                                    rowSpan: 2,
                                }}
                            />
                            <SortableTableHeader
                                 order={outerSort.orderBy==='baseLineGaia'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                onRequestSort={handleSortingRequest}
                                column={{
                                    id: "baseLineGaia",
                                    label: "GAIA",
                                    rowSpan: 2,
                                    tooltipMessage: "GAIA"
                                }}
                            />

                            <SortableTableHeader
                                 order={outerSort.orderBy==='myProdWeight'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                onRequestSort={handleSortingRequest}
                                column={{
                                    id: "myProdWeight",
                                    label: "%w/w*",
                                    rowSpan: 2,
                                }}
                            />
                            <SortableTableHeader
                                 order={outerSort.orderBy==='myProdGaia'?outerSort.order:undefined}
                                orderBy={outerSort.orderBy}
                                onRequestSort={handleSortingRequest}
                                column={{
                                    id: "myProdGaia",
                                    label: "GAIA",
                                    rowSpan: 2,
                                    tooltipMessage: "GAIA"
                                }}
                            />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gaiaTableData && sortData(
                            [...gaiaTableData],
                            outerSort.orderBy as keyof GaiaComponentDetail,
                            outerSort.order
                        ).map((row, index) => (
                            <React.Fragment key={index + row.rawCode}>
                                <TableRow
                                    hover
                                    sx={{
                                        cursor: "pointer",
                                        "& td": {
                                            border: "1px solid #e0e0e0", // Add border to each cell

                                            padding: "16px 14px !important",
                                            color: '#000',
                                            fontFamily: "kenvue-sans-regular",
                                            fontSize: '13.33px',
                                            fontStyle: 'normal',
                                            fontWeight: 400,
                                            lineHeight: '150%',
                                        },
                                    }}
                                >
                                    <TableCell className="tablecell-0">
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{ width: '100%', textAlign: "left" }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    flexGrow: 1,
                                                    fontWeight: "400",
                                                    fontFamily: 'kenvue-sans-regular',
                                                    fontSize: '14px',
                                                    color: '#000',
                                                    lineHeight: '18px',
                                                }}
                                            >
                                                {row.rawMaterialTradeName}

                                            </Typography>
                                            <IconButton
                                                size="small"
                                                aria-label="expand row"
                                                sx={{
                                                    ml: 1,
                                                    transform: openRows[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s',
                                                    zIndex: 0
                                                }}
                                                onClick={() => toggleRow(index)}
                                            >
                                                <ExpandMore />
                                            </IconButton>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: "left" }}>{row.rawCode}</TableCell>


                                    <TableCell sx={{ textAlign: "left" }}>
                                        {row.constituent ?? ""}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        {row.concode ?? ""}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }} className="table-cell-5">

                                        <CustomTooltip title={row.baseLineWeight != null ? row.baseLineWeight.toFixed(6) : ""}>

                                            <span>
                                                {row.baseLineWeight != null ? row.baseLineWeight.toFixed(2) : ""}
                                            </span>
                                        </CustomTooltip>

                                    </TableCell>
                                    <TableCell
                                        sx={{ textAlign: "center", backgroundColor: backgroundColorCell(row.baseLineGaia) }}
                                    >
                                        {row.baseLineGaia != null ? row.baseLineGaia.toFixed(2) : ""}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <CustomTooltip title={row.myProdWeight != null ? row.myProdWeight.toFixed(6) : ""}>

                                            <span>
                                                {row.myProdWeight != null ? row.myProdWeight.toFixed(2) : ""}
                                            </span>
                                        </CustomTooltip>
                                    </TableCell>
                                    <TableCell
                                        sx={{ textAlign: "center", backgroundColor: backgroundColorCell(row.myProdGaia) }}
                                    >
                                        {row.myProdGaia != null ? row.myProdGaia.toFixed(2) : ""}
                                    </TableCell>



                                </TableRow>
                                {openRows[index] && (
                                    <>
                                        {sortData(
                                            [...row.details],
                                            outerSort.orderBy as keyof GaiaComponentDetail,
                                            outerSort.order
                                        ).map((detail, index) => (
                                            <TableRow
                                                key={index + detail.rawCode}
                                                sx={{
                                                    "& td": {
                                                        backgroundColor: "#F8F8F8",
                                                        border: "1px solid #E4E7EC", // Add border to each cell
                                                        padding: "16px 24px !important",
                                                        color: '#000',
                                                        fontFamily: "kenvue-sans-regular",
                                                        fontSize: '13.33px',
                                                        fontStyle: 'normal',
                                                        fontWeight: 400,
                                                        lineHeight: '150%'
                                                    },
                                                }}
                                            >
                                                <TableCell></TableCell>
                                                <TableCell>{detail.rawCode ?? ""}</TableCell>
                                                <TableCell>{detail.constituent ?? ""}</TableCell>
                                                <TableCell sx={{ textAlign: "center" }}>{detail.concode ?? ""}</TableCell>
                                                <TableCell sx={{ textAlign: "center" }}>
                                                    {detail.baseLineWeight != null ? detail.baseLineWeight.toFixed(2) : ""}
                                                </TableCell>
                                                <TableCell
                                                    sx={{ textAlign: "center", backgroundColor: backgroundColorCell(detail.baseLineGaia) }}
                                                >
                                                    {detail.baseLineGaia != null ? detail.baseLineGaia.toFixed(2) : ""}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "center" }}>
                                                    {detail.myProdWeight != null ? detail.myProdWeight.toFixed(2) : ""}
                                                </TableCell>
                                                <TableCell
                                                    sx={{ textAlign: "center", backgroundColor: backgroundColorCell(detail.myProdGaia) }}
                                                >
                                                    {detail.myProdGaia != null ? detail.myProdGaia.toFixed(2) : ""}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}

                    </TableBody>
                    <TableFooter className="gaiascore-table" style={{position:"sticky", insetBlockEnd:"0", background:"#ffffff"}}>
                        <TableCell colSpan={3}>
                            <Typography className="text-css" style={{ color: "#000", fontFamily: "kenvue-sans-regular" }}>*Composition shown excludes water for GAIA calculations</Typography>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell style={{ padding: "16px 0px 16px 32px" }}>
                            <Typography textAlign={"right"} className="result_detailed_table_total">Total</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography className="result_detailed_table_total_value">{baselineGaiaValue}</Typography>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <Typography className="result_detailed_table_total_value">{totalMyProdGaia ? Number.parseFloat(totalMyProdGaia).toFixed(2) : "0.00"}</Typography>
                        </TableCell>
                    </TableFooter>
                </Table>

            </TableContainer>

            <div className="table-bottom-color-band">
                <div className="color-band-left-empty"></div>
                <div className="color-band-div">
                    <div className="color-key">Color Key</div>
                    <div className="color-band">
                        <div className="color-band-1"></div>
                        <div className="color-band-2"></div>
                        <div className="color-band-3"></div>
                    </div>
                    <div className="color-band-text">
                        <div className="color-band-text-1">
                            <div className="div-first-child">&lt;60</div>
                            <div className="div-second-child">Not Preferred</div>
                        </div>
                        <div className="color-band-text-2">
                            <div className="div-first-child">60-80</div>
                            <div className="div-second-child">Less Preferred</div>
                        </div>
                        <div className="color-band-text-3">
                            <div className="div-first-child">&gt;80</div>
                            <div className="div-second-child">Most Preferred</div></div>
                    </div>
                </div>
            </div>

        </>
    );
};
export default GaiaScoreTable;
