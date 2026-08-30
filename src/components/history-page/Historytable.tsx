/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import "../../assets/css/admin-page.scss";
import { CurrentVesrionIndicator } from '../results/ViewAllResults.component';
import arrow_full_small_up_green from "../../assets/images/arrow_full_small_up_green.svg";
import arrow_full_small_down_red from "../../assets/images/arrow_full_small_down_red.svg";
import neutral_indicator from "../../assets/images/neutral_indicator.svg";

interface ImpactScoreChange {
    old_score: number | null;
    new_score: number | null;
    old_description: string | null;
    new_description: string | null;
}

export interface ImpactOnAssessments {
    pef?: ImpactScoreChange;
    carbon?: ImpactScoreChange;
    green_chem?: ImpactScoreChange;
    pack_circularity?: ImpactScoreChange;
}

const IMPACT_LABELS: Record<string, string> = {
    pef: "Product Environmental Footprint",
    carbon: "Product Carbon Footprint",
    green_chem: "Green Chemistry",
    pack_circularity: "Pack Circularity",
};

const DESCRIPTION_RANK: Record<string, number> = {
    "Excellent": 5,
    "Good": 4,
    "No Improvement": 3,
    "Poor": 2,
    "Very Poor": 1,
};

const getImpactArrow = (oldDesc: string | null, newDesc: string | null) => {
    if (!oldDesc || !newDesc) return null;
    const oldRank = DESCRIPTION_RANK[oldDesc] ?? 0;
    const newRank = DESCRIPTION_RANK[newDesc] ?? 0;
    if (newRank > oldRank) return arrow_full_small_up_green;
    if (newRank < oldRank) return arrow_full_small_down_red;
    return neutral_indicator;
};

const renderTextWithLinks = (text: string) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (
        <span style={{ whiteSpace: "pre-wrap" }}>
            {parts.map((part, i) => {
                const partKey = `${i}-${part}`;
                return urlRegex.test(part) ? (
                    <a
                        key={partKey}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#000000", textDecoration: "underline", textUnderlineOffset: "1px", wordBreak: "break-all" }}
                    >
                        {part}
                    </a>
                ) : (
                    <React.Fragment key={partKey}>{part}</React.Fragment>
                );
            })}
        </span>
    );
};
export interface HistoryItem {
  _id: string;
  version_number: string;
  date: string;
  what_change: string;
  impact_on_assessments?: ImpactOnAssessments;
  hasSnapshot?: boolean;
  hasImpact?: boolean;
}

export interface HistoryTableProps {
    data: HistoryItem[];
    isSnapshotRequired?: boolean;
    urldata?: string;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data, isSnapshotRequired, urldata }: HistoryTableProps) => {

    const renderImpactOnAssessments = (impact: ImpactOnAssessments | undefined) => {
        if (!impact) return "";
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "8px 0" }}>
                {Object.entries(impact).map(([key, value]) => {
                    if (

                        value?.old_score == null ||
                        value?.new_score == null
                    ) {
                        return null;
                    } const label = IMPACT_LABELS[key] || key;
                    const arrowSrc = getImpactArrow(value.old_description, value.new_description);
                    return (
                        <div key={key} style={{ display: "flex", flexDirection: "column", gap: "2px", fontFamily: "kenvue-sans-regular", fontSize: "13.33px", lineHeight: "150%", color: "#000000" }}>
                            <span style={{ fontWeight: 700, fontFamily: "kenvue-sans" }}>{label}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span>{value.old_description || "N/A"}</span>
                                <span>→</span>
                                <span style={{ fontWeight: 500 }}>{value.new_description || "N/A"}</span>
                                {arrowSrc && <img src={arrowSrc} alt="trend" style={{ width: "18px", height: "18px" }} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };


    const COL_WIDTH_VERSION  = "160px";
    const COL_WIDTH_DATE     = isSnapshotRequired ? "140px" : "160px";
    const COL_WIDTH_SNAPSHOT = "160px";
    const COL_WIDTH_CHANGE   = isSnapshotRequired ? "410px" : "460px";
    const COL_WIDTH_IMPACT   = isSnapshotRequired ? "416px" : "510px";

    const snapshotCol: any = isSnapshotRequired
        ? [{ id: "snapshotUrl", label: "Snapshot", width: COL_WIDTH_SNAPSHOT }]
        : [];

    const columns: { id: string; label: string; width: string }[] = [
        { id: "version_number", label: "Version", width: COL_WIDTH_VERSION },
        { id: "date", label: "Date", width: COL_WIDTH_DATE },
        ...snapshotCol,
        { id: "what_change", label: "What's changed?", width: COL_WIDTH_CHANGE },
        { id: "impact", label: "Impact on assessment", width: COL_WIDTH_IMPACT },
    ];

    return <TableContainer
        className="version-table-container"
        component={Paper}
        elevation={0}
        sx={{
            width: "100%",
            maxHeight: isSnapshotRequired ? "336px" : "auto",
            overflow: "auto",
            "&::-webkit-scrollbar": {
                width: "6px",
                height: "6px"
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#000000",
                borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
                marginTop: "60px",
                backgroundColor: "transparent"
            }
        }}
    >
        <Table
            stickyHeader
            size="small"
            sx={{
                width: "100%",
                tableLayout: "fixed"
            }}
        >
            <TableHead>
                <TableRow
                    className='history-table-header'
                    sx={{
                        backgroundColor: "#fafafa",
                        "& th": {
                            backgroundColor: "#fafafa",
                            fontWeight: 700,
                            fontSize: "13.33px",
                            fontFamily: "kenvue-sans",
                            color: "#000000",
                            borderBottom: "1px solid rgba(0,0,0,0.15)",
                            borderRight: "none !important",
                            height: 60,
                            boxSizing: "border-box"
                        },
                    }}
                >
                    {columns.map((col) => (
                        <TableCell
                            key={col.id}
                            className='history-table-header'
                            sx={{ width: col.width, fontWeight: 700, fontSize: "13.33px", fontFamily: "kenvue-sans" }}
                        >
                            {col.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {data.map((row, index) => (
                    <TableRow
                        className="version-row"
                        key={row._id}
                        hover
                        sx={{
                            backgroundColor:
                                index % 2 === 0 ? "white" : "#F8F8F8",
                            height: 60,
                            "& td": {
                                fontSize: "13.33px",
                                fontWeight: "400 !important",
                                fontFamily: "kenvue-sans-regular !important",
                                borderRight: "1px solid #E4E7EC !important",
                                borderBottom: "1px solid #E4E7EC",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                overflow: "hidden",
                                "&:last-child": {
                                    borderRight: "none",
                                },
                            },
                        }}
                    >
                        <TableCell className="version-cell"><span style={{ display: "flex", alignItems: "center" }}><span style={{marginRight: "8px"}}>V{row.version_number}</span> {index == 0 && <CurrentVesrionIndicator />}</span></TableCell>
                        <TableCell className="version-cell">{row.date?.replace(/-/g, ".")}</TableCell>
                        {isSnapshotRequired && <TableCell className="version-cell">
                            <a
                                href={`${urldata}/${row.version_number}/report`}
                                className="version-snapshot-link"
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "black", textUnderlineOffset: "4px" }}
                            >
                               {
  row.hasSnapshot
    ? `Snapshot ${row.version_number}`
    : ""
}
                            </a>
                        </TableCell>}

                        <TableCell className="version-cell">{renderTextWithLinks(row.what_change || "")}</TableCell>
                        <TableCell className="version-cell">
                           {
  row.hasImpact &&
  row.impact_on_assessments
    ? renderImpactOnAssessments(row.impact_on_assessments)
    : ""
}
                        </TableCell>
                    </TableRow>
                ))}

                {data.length === 0 && (
                    <TableRow>
                        <TableCell
                            className="version-cell"
                            colSpan={columns.length}
                            align="center"
                            sx={{ py: 3, borderBottom: "none" }}
                        >
                            Nothing to see here yet!
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>

        </Table>
    </TableContainer>
}

export default HistoryTable;