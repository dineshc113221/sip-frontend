import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useLoading } from "../../contexts/loadingPage/LoadingContext";
const LoadingScreen:React.FC = () => {
const { isLoading } = useLoading();
 return !isLoading? null:(
<Box
     sx={{
       position: "fixed",
       top: 0,
       left: 0,
       width: "100vw",
       height: "100vh",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "rgba(255, 255, 255, 0.74)",
       zIndex: 9999,
     }}
>
     <CircularProgress sx={{ color: '#00b097' }} />
</Box>
 );
};
export default LoadingScreen;