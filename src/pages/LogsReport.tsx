import React, { useEffect, useState } from "react";
import { Card, CardContent, Table, TableHead, TableBody, TableCell, TableRow, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetAssessmentDetailBySipID, useGetProductDetailLogReport, useGetLogsInputsDetails } from "../hooks/UseGetProductDetails";
import '../assets/css/logReport.scss';
import JsonViewModal from "../models/JsonViewModal";

const LogsReport: React.FC = () => {
    const param = useParams();
    const { data: sipDataReponse, refetch } = useGetAssessmentDetailBySipID(param.id);
    const [assessmentData, setAssessmentData] = useState({ assessmentId: "", productId: "", assessmentType: "" });
    const [logsData, setLogsData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedlogId, setSelectedlogId] = useState<string | null>(null);
    const { data: inputData } = useGetLogsInputsDetails(selectedlogId);

    useEffect(() => {
        refetch();
    }, [refetch, param.id]);

    useEffect(() => {
        if (sipDataReponse) {
            const sipData = sipDataReponse[0] || { assessmentId: "", productId: "", assessmentType: "" };
            setAssessmentData({
                assessmentId: sipData.assessmentId,
                productId: sipData.productId,
                assessmentType: sipData.assessmentType,
            });
        }
    }, [sipDataReponse]);

    const { data: fetchedLogsData } = useGetProductDetailLogReport(
        assessmentData.productId && assessmentData.assessmentId ? assessmentData.productId : null,
        assessmentData.productId && assessmentData.assessmentId ? assessmentData.assessmentId : null
    );


    useEffect(() => {
        if (fetchedLogsData) {
            setLogsData(Array.isArray(fetchedLogsData) ? fetchedLogsData : []);
        }
    }, [fetchedLogsData]);

    const handleViewInput = (logId: string) => {
        setSelectedlogId(logId);
        setModalOpen(true);
    };
    const handleCopyJson = () => {
        if (inputData?.input) {
            navigator.clipboard.writeText(JSON.stringify(inputData.input, null, 2));
        }
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedlogId(null);
    };


    const tableCellStyle = {
        fontFamily: "kenvue-sans-regular",
        fontWeight: 400,
        fontSize: "13px",
        border: "1px solid #ccc",
        padding: "8px"
    };
    const tableCellStyleHeader = {
        fontFamily: "kenvue-sans",
        fontWeight: 700,
        fontSize: "13px",
        border: "1px solid #ccc",
        padding: "8px"
    };

    return (
        <div>
            <h1 className="CommonText" > Logs Report </h1>
            < JsonViewModal
                inputData={inputData}
                open={modalOpen}
                onClose={handleCloseModal}
                onCopy={handleCopyJson}
            />
            {
                logsData?.length > 0 ? (
                    <Card
                        sx={{
                            boxShadow: 'none !important',
                            fontFamily: "kenvue-sans-regular",
                            fontWeight: 400,
                            fontSize: "16px",
                            letterSpacing: "0%",  
                        }}>
                        <CardContent style={{paddingTop: "0px"}}>
                            <div>
                                <p className="CommonTextType"><span className="CommonText">Product ID: </span> {assessmentData.productId}</p >
                                <p className="CommonTextType"><span className="CommonText">Assessment ID: </span> {assessmentData.assessmentId}</p >
                                <p className="CommonTextType"><span className="CommonText">Assessment Type: </span> {assessmentData.assessmentType}</p >
                            </div>
                            <h1 className="CommonText" > Error Details: </h1>
                            < Table style={{ border: "1px solid #ccc", width: "100%" }
                            }>
                                <TableHead>
                                    <TableRow className="backgroundTable">
                                        <TableCell  style={tableCellStyleHeader}> Log ID </TableCell>
                                        < TableCell style={tableCellStyleHeader} > Step Function </TableCell>
                                        < TableCell style={tableCellStyleHeader} > Error Message </TableCell>
                                        < TableCell style={tableCellStyleHeader} > Execution ARN </TableCell>
                                        < TableCell sx={{ textAlign: "center" }}  style={tableCellStyleHeader} > Input </TableCell>
                                        < TableCell  style={tableCellStyleHeader} > Created At </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        logsData.map((log, index) => (
                                            <TableRow key={log._id} className={index % 2 === 0 ? "evenRow" : "oddRow"} >
                                                <TableCell className="column1" style={tableCellStyle} > {log._id} </TableCell>
                                                < TableCell className="column2" style={tableCellStyle} > {log.output?.type} </TableCell>
                                                < TableCell className="column3" style={tableCellStyle} > {log.output?.message} </TableCell>
                                                < TableCell className="column4" style={tableCellStyle} > {log.executionARN} </TableCell>
                                                < TableCell className="column5" style={tableCellStyle} sx={{textAlign: "center"}} >
                                                    <Button
                                                        onClick={() => handleViewInput(log._id)}
                                                        className="viewButton"
                                                    >View
                                                    </Button>
                                                </TableCell>
                                                < TableCell className="column6" style={tableCellStyle} >
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                        <p style={{ fontFamily: "kenvue-sans-regular", fontSize:"14px"}}>No logs found </p>
                )}
        </div>
    );
};

export default LogsReport;