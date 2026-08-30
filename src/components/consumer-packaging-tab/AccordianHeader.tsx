import React, { useContext } from "react";
import {
  Typography,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { BootstrapTooltipSideBar } from "../dashboard/SidebarAction.component";
import dataInCompleteIcon from "../../assets/images/dataInCompleteIcon.svg";
import deleteIcon from "../../assets/images/delete-pacaking.svg";
import { CheckCRUDAccess } from "../../helper/GenericFunctions";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";

interface AccordionHeaderProps {
  expanded: boolean;
  componentheader: string;
  handleExpandClick: (index: number, isEditClick: boolean) => void;
  handleOpenDeletePopup: (event: React.MouseEvent<HTMLElement>) => void;
  componentId: number;
  isData: boolean;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  expanded,
  componentheader,
  handleExpandClick,
  handleOpenDeletePopup,
  componentId,
  isData
}) => {
 const { usersData } = useContext(ProductDataContext);

  return (
    <div style={{ display: "flex", flexDirection: "row", position: "relative", justifyContent: "space-between" }}>
      <div style={{}}>
        <Typography fontSize={"13.33px"} sx={{ fontFamily: "kenvue-sans", fontWeight: "400",color:"#000000 !important" }}>
          {componentheader}
        </Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center",fontFamily:'kenvue-sans-regular',fontSize:'16px'
         }}>
          {isData && (
            <>
              <img src={dataInCompleteIcon} alt="Data incomplete" style={{ marginRight: "8px" }} /> Data incomplete
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            <BootstrapTooltipSideBar className="BootstrapTooltipSidebar" title={<p className="BootstrapTooltipSidebar-p"> {expanded ? "Collapse" : "Expand"}</p>}>
              {expanded ? (<ExpandLessIcon data-testid="expand-less-icon" sx={{ marginTop: "6px", cursor: "pointer" }} onClick={() => handleExpandClick(componentId, false)} />)
                : (<ExpandMoreIcon data-testid="expand-more-icon" sx={{ marginTop: "6px", cursor: "pointer" }} onClick={() => handleExpandClick(componentId, false)} />)
              }
            </BootstrapTooltipSideBar>
           
            {(CheckCRUDAccess(usersData, "consumer_packaging") !== 0) &&
              <IconButton
                data-testid="delete-button"
                className="disabledfield"
                onClick={handleOpenDeletePopup}
                sx={{
                  marginLeft: "20px",
                  padding: "1.5px !important",
                  backgroundColor: "transparent",
                  "&:hover": {
                    "& .MuiSvgIcon-root": {
                      color: "red",
                    },
                  },
                  "&:disabled": {
                    cursor: "not-allowed",
                  },
                }}
              >
                <img src={deleteIcon} alt="delete-icon" />
              </IconButton>}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AccordionHeader;

