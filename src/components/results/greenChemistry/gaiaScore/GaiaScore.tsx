import React from "react";
import { Box, Typography } from "@mui/material";
import "./GaiaScore.scss"
import { Graph }from "./Graph";
import { GaiaGraphTable } from "./GaiaGraphTable";
import GaiaScoreTable from "./GaiaScoreTable";

export const GaiaScore: React.FC = () => {
    return (
        <Box className="main-gaia-score">
            <Box component="div" sx={{width: "100%", maxWidth:"1230px", gap:"8px", display: "flex", flexDirection: "column"}}>
                <Typography className='container1_typography1'>
                    What are the GAIA scores of the raw materials in the formulation?
                </Typography>
                <div className='container1_typography2'>
                    <Box component="span" className='typography3'>Kenvue’s Direction:</Box> 
                    <Box component="span" className="fontGaia"> GAIA is Kenvue’s patented, peer reviewed method to assess the potential environmental impacts of formulations at the end of the product’s life. Ingredients are scored on a 100-point scale based on available environmental safety data, with higher scores indicating more favorable environmental safety characteristics. When published data are not available, we use modeled data and reduce GAIA scores to account for uncertainty. Water in a formula is not included in the GAIA score – only non-water ingredients.</Box>
                </div>
            </Box>
            <Box className="main-graph-table">
                <Box component="div" className="graph">
                    <Graph />
                </Box>
                <Box component="div" className="table">
                    <GaiaGraphTable/>
                </Box>
            </Box>
            <Box component="div" className="detailed-result">
                <GaiaScoreTable />
            </Box>
        </Box>
    )
}