/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import { renderAsync } from "docx-preview";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useGlobaldata } from "../contexts/masterData/DataContext";
import { useParams } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import './styles.css';
import { useStorageFileReader } from "../adapters/Api";

const ChangeLogs: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useGlobaldata();
  const [datafetchError, setDataFetchError] = useState<boolean>(false);
  const { filename } = useParams();

  const targetFileName = filename || "SIP Change Log.docx";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [docData, setDocData] = useState<Blob | null>(null);
  const { getFileFromStorage } = useStorageFileReader();

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest('a');

    if (anchor && anchor.href) {
      e.preventDefault();
      e.stopPropagation();
      window.open(anchor.href, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      try {
        const res = await getFileFromStorage(targetFileName);

        if (res.data && res.data.size > 0) {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          });
          setDocData(blob);
        } else {
          setDataFetchError(true);
        }
      } catch (err) {
        setDataFetchError(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadDoc();
    }
  }, [token, targetFileName]);

  useEffect(() => {
    if (docData && containerRef.current) {
      containerRef.current.innerHTML = "";

      const options = {
        className: "docx_viewer",
        inWrapper: true,
        ignoreWidth: true,
        experimental: true,
        breakPages: true,
        useBase64URL: true
      };

      renderAsync(docData, containerRef.current, undefined, options)
        .then(() => console.log("DOCX Rendered"))
        .catch((error) => console.error(error));
    }
  }, [docData]);

  return (
    <Box className="change-log">
      <Box className="header-container"><Header /></Box>

      <Box className="change-log-page">

        {datafetchError && (
          <Box className="message-container">
            <Typography color="error" variant="h6">Unable to load document</Typography>
            <Button variant="contained" startIcon={<DownloadIcon />} sx={{ mt: 2 }} onClick={() => {
              if (docData) {
                const url = window.URL.createObjectURL(docData);
                const link = document.createElement('a');
                link.href = url;
                link.download = targetFileName;
                link.click();
              }
            }}>Download File</Button>
          </Box>
        )}

        {loading && (
          <CircularProgress sx={{ mt: 10, color: '#00b097' }} />
        )}

        <div
          ref={containerRef}
          className="doc-viewer-container"
          onClick={handleDocumentClick}
          style={{ display: (loading || datafetchError) ? "none" : "block" }}
        />
      </Box>
    </Box>
  );
};

export default ChangeLogs;