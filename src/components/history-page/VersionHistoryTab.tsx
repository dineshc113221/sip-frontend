import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import HistoryTable, { HistoryItem } from "./Historytable";
import { useProductService } from "../../adapters/Api";
import { useFetchAssessmentBasedVersionHistory, useFetchVersionHistory } from "../../hooks/UseVersionHistory";
import { AssessmentDataType } from "../../contexts/productData/ProductDataContext";
import { VersionTag } from "../results/ViewAllResults.component";

interface VersionHistoryTabProps {
    productId: string;
    assessmentsData: AssessmentDataType;
    assessmentType: string;
}

const VersionHistoryTab: React.FC<VersionHistoryTabProps> = ({
    productId,
    assessmentsData,
    assessmentType
}) => {

    const { data: versionData } = useFetchVersionHistory();

    const { data, isFetching, isError } = useFetchAssessmentBasedVersionHistory({
        productId: productId,
        assessmentId: assessmentsData?._id,
        assessmentType: assessmentType
    });

    const [combinedVersionData, setCombinedVersionData] = useState<HistoryItem[]>()

    const findLatestMajorVersion = (versions) => {
        if (!Array.isArray(versions)) return null;
        const majorFormatRegex = /^v?\d+(\.0)?$/i;
        return (
            versions.find(
                (ver) =>
                    ver?.type === "major" &&
                    typeof ver?.version_number === "string" &&
                    majorFormatRegex.test(ver.version_number.trim()),
            ) || null
        );
    };

    useEffect(() => {

        if (data?.data && data.data.length > 0) {
            setCombinedVersionData(data.data);
            return;
        }
        if (data && (!data.data || data.data.length === 0)) {
            const latestMajor = findLatestMajorVersion(versionData?.data);
            if (latestMajor) {
                setCombinedVersionData([
                    { ...latestMajor, impact_on_assessments: null } as HistoryItem,
                ]);
            } else {
                setCombinedVersionData([]);
            }
        }
    }, [data, versionData])

    const { getProductDetailAuditReport } = useProductService();

    const viewReport = async (response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        // //Build a URL from the file
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL);
        URL.revokeObjectURL(fileURL);
        return response.data;
    };

    const downloadReport = async (response) => {
        const filename = `SIPAuditTrailReport_${assessmentsData?.assessmentId}_${new Date().toISOString()}.pdf`;
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        return response.data;
    };

    const getAndDownloadReport = async () => {
        const result = await getProductDetailAuditReport(assessmentsData?.assessmentId, true);
        if (result?.data) {
            viewReport(result);
            downloadReport(result);
        }
    };

    return <>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: "20px" }}>
            {versionData && <div style={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ m: 0 }} className="version-method-title" style={{ fontFamily: "kenvue-sans", fontSize: "19.2px", fontWeight: 700, marginRight: "8px" }}>
                    Current Version
                </Typography>
                <VersionTag latestVersion={versionData?.data[0]?.version_number} />
            </div>}

            <Button
                variant="contained"
                sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    borderRadius: "999px",
                    width: "207px",
                    height: "56px",
                    px: 3,
                    "&:hover": { bgcolor: "#222" }
                }}
                onClick={() => getAndDownloadReport()}
            >
                <Typography style={{
                    fontFamily: "kenvue-sans-regular",
                    fontSize: "15px",
                    fontWeight: 400
                }}>Generate Audit Log</Typography>
            </Button>
        </Box>
        <Box sx={{ mt: "24px", mb: "12px" }}>
            <Typography sx={{ m: 0 }} className="version-method-title" style={{ fontFamily: "kenvue-sans", fontSize: "16px", fontWeight: 700 }}>
                Method Version History
            </Typography>
        </Box>
        <Box>
            {isFetching && <div style={{ width: "80vw", height: "135px", display: "flex", alignItems: "center", zIndex: 1, justifyContent: "center" }}><CircularProgress sx={{ color: '#00b097' }} /></div>}
            {combinedVersionData && <HistoryTable data={combinedVersionData} isSnapshotRequired={true} urldata={`/productId/${productId}/assessment/${assessmentType}/${assessmentsData?._id}`} />}
            {isError && <div style={{ width: "80vw", height: "135px", display: "flex", alignItems: "center", zIndex: 1, justifyContent: "center" }}><Typography style={{ fontFamily: "kenvue-sans-regular", fontSize: "13.3px", fontWeight: "700" }}>Nothing to see here yet!</Typography></div>}
        </Box>
    </>

}

export default VersionHistoryTab;