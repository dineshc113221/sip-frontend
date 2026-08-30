import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import "../assets/css/admin-page.scss";
import NewVersionHistoryPopup, { FormData } from '../components/common/NewVersionHistoryPopup';
import { useFetchVersionHistory } from '../hooks/UseVersionHistory';
import HistoryTable from '../components/history-page/Historytable';
import { useAdminVersionHistory } from '../adapters/Api';
import { toast } from 'react-toastify';
import { GetToastContainer } from '../helper/GenericFunctions';

const AdminEdits: React.FC = () => {
    const [openVersionPopup, setOpenVersionPopup] = useState<boolean>(false);
    const [versionSubmittedData, setVersionSubmittedData] = useState<FormData>();
    const { data, isFetching, refetch, isError } = useFetchVersionHistory();
    const { postVersionHistory } = useAdminVersionHistory();

    const postData = async () => {
        try {
            const data = await postVersionHistory(versionSubmittedData)
            if (data?.success) toast.success("New version created successfully!")
            else toast.error(data?.data?.message || "Something went wrong, please try again later!")
            refetch();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (versionSubmittedData) {
            postData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [versionSubmittedData])

    return <Box className="change-log">
        <Box className="header-container"><Header /></Box>
        <Box sx={{ width: "100%", height: "136px", display: "flex", alignItems: "center", borderBottom: "1px solid #BFBFBF" }}>
            <span className='admin-console-typo'>Admin Console</span>
            <Button
                variant="contained"
                sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    borderRadius: "999px",
                    width: "248px",
                    height: "56px",
                    px: 3,
                    "&:hover": { bgcolor: "#222" },
                }}
                onClick={() => setOpenVersionPopup(true)}
            >
                <Typography className="add-change-log">Log New Version History</Typography>
            </Button>
        </Box>
        <Typography className='admin-table-header'>
            Method Version History
        </Typography>
        {isFetching && <div style={{ width: "100vw", height: "135px", display: "flex", alignItems: "center", zIndex: 1, justifyContent: "center" }}><CircularProgress sx={{ color: '#00b097' }} /></div>}
        {!isFetching && data && <Box pt={{ xs: "58px" }}><HistoryTable {...data} /></Box>}
        {isError || !isFetching && data?.length == 0 && <Box sx={{ height: "135px", width: "100%", display: "flex", borderBottom: "1px solid #BFBFBF" }}>
            <Typography className='no-version-history'>
                Nothing to see here yet!
            </Typography>
        </Box>}
        <NewVersionHistoryPopup
            open={openVersionPopup}
            onClose={() => setOpenVersionPopup(false)}
            onSubmit={(data) => {
                setVersionSubmittedData(data)
            }}
            existingVersions={data ? data.data.map(e => e.version_number) : []}
        />
        <GetToastContainer />
    </Box>
}

export default AdminEdits;