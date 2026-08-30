/* eslint-disable */
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    styled,
    Typography
} from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import warningIcon from "../../assets/images/warningIcon.svg";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        width: "708px",
        height: "302px",
        maxWidth: "none",
        borderRadius: "30px"
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        overflow: "hidden"
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

interface AckVersionProps {
    modalState: boolean;
    setAcknowledgeVersion: (e: React.Dispatch<React.SetStateAction<boolean>>) => unknown;
}

const PopupComponentVersionAcknowledge: React.FC<AckVersionProps> = ({
    modalState = false,
    setAcknowledgeVersion
}) => {
    const [open, setOpen] = useState(modalState);
    useEffect(() => {
        setOpen(modalState)
    }, [modalState])

    return (
        <BootstrapDialog
            // onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogContent dividers>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: "8px", maxHeight: "42px" }}>
                    <img src={warningIcon} alt="warning" style={{ marginRight: "10px", paddingTop: "4px" }} />
                    <Typography sx={{ m: 0, pt: "2px", fontWeight: 700, fontSize: "34.84px", fontFamily: "kenvue-sans !important" }}>
                        Important Update
                    </Typography>
                </Box>
                <Box sx={{ p: {xs: "0 30px 10px"}, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* NOSONAR */}
                    <Typography gutterBottom justifyContent={{ xs: "center" }} alignItems={{ xs: "center" }} margin={{ xs: "18px 0px 24px" }} sx={{fontFamily: "kenvue-sans-regular !important", width: "482px", maxHeight: "140px", fontSize: "13.33px", color: "#000000" }}>
                        A recent update to the Sustainable Innovation Profiler 
                        may impact sustainability scores for some products. 
                        To review changes, open the 
                        <a style={{fontWeight: "bold", textDecoration: "none", fontFamily: "kenvue-sans", fontSize: "13.3px", padding: "2px"}}>"Version History"</a> 
                        tab in each product assessment, where you can see a summary of updates, 
                        their impact on your assessment, and the full history of previous product scores. 
                        For complete details on the new method version, visit the <a style={{cursor: "pointer", color: "#00B097", textDecoration: "underline", fontFamily: "kenvue-sans", textUnderlineOffset: "4px", fontSize: "13.3px"}} onClick={()=>window.open("/changelog", "_blank")}>SIP Change Log.</a>
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "black",
                            color: "white",
                            height: "56px",
                            width: "166px",
                            textTransform: "none",
                            borderRadius: "999px",
                            px: 3,
                            "&:hover": { bgcolor: "#222" },
                        }}
                        onClick={()=>{
                            setAcknowledgeVersion(setOpen);
                        }}
                    >
                        <Typography style={{fontFamily: "kenvue-sans-regular", fontSize: "15px", fontWeight: 400}}>I Acknowledge</Typography>
                    </Button>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
}

export default PopupComponentVersionAcknowledge;