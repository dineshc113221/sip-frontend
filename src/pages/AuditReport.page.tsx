import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailAuditReport } from "../hooks/UseGetProductDetails";

const AuditReportPage: React.FC<{ isAssessment: boolean }> = (props: { isAssessment: boolean }) => {
  const [isDataAvailable, setIsDataAvailable] = React.useState<boolean>(false);
  const { id } = useParams();
  const { data } = useGetProductDetailAuditReport(id, props?.isAssessment);


  const viewReport = async (response) => {
    const file = new Blob([response.data], { type: "application/pdf" });
    // //Build a URL from the file
    const fileURL = window.URL.createObjectURL(file);
    window.open(fileURL);
    URL.revokeObjectURL(fileURL);
    return response.data;
  };

  const downloadReport = async (response) => {
    const filename = `SIPAuditTrailReport_${id}_${new Date().toISOString()}.pdf`;
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

  const getAndDownloadReport = () => {
    const result = data;
    if (result?.data) {
      setIsDataAvailable(true)
      viewReport(result);
      downloadReport(result);
    } else {
      setIsDataAvailable(false);
    }
  };

  React.useEffect(() => {
    if (data?.data) {
      getAndDownloadReport();
    }
  }, [data])

  if (isDataAvailable) {
    return <></>;
  } else {
    return <p>No data available</p>;
  }

};

export default AuditReportPage;
