import React from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import {LightTooltipProps} from "../breadcrumb/types";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    borderRadius: "32px 32px 32px 0px",
    padding: "12px",
    border: "1px solid black",
    width: "487px",
    height: "198px",
    fontFamily: "kenvue-sans",
    transform: "translate3d(290px, -8.3333px, 0px)",
  },
}));

const LightTooltipComponent = (props: LightTooltipProps) => {

  const [tooltipOpenCommon, setTooltipOpenCommon] = React.useState(false);

  const handleTooltipCloseCommon = () => {
      setTooltipOpenCommon(false);
  };
  
  const handleTooltipToggleCommon = () => {
      setTooltipOpenCommon(!tooltipOpenCommon);
  };  

return (
  
      <LightTooltip key={props.tooltipkey}
            placement="top-start"
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipCloseCommon}
            open={tooltipOpenCommon}
            
            title={
              <>
                {( props.title ) && (  
                  <h3
                      className="header"
                      style={{
                      fontWeight: "700px",
                      fontSize: "23px",
                      margin: "0px",
                      lineHeight: "27.65px",
                      }}
                  >
                      {props.title}
                  </h3>
                )}

                {(props.subTitle) && (  
                  <h3
                      className="header"
                      style={{
                      fontWeight: "700px",
                      fontSize: "19.2px",
                      lineHeight: "27px",
                      marginTop: "9px",
                      }}
                  >
                      {props.subTitle}
                  </h3>
                )}

                <p
                  style={{
                    fontFamily: "kenvue-sans-regular",
                    fontWeight: "400px",
                    fontSize: "12px",
                    lineHeight: "auto",
                  }}
                >
                  {props.contents}
                </p>
              </>
            }
          >
            <InfoIcon
              style={{
                cursor: "pointer",
                marginLeft: "9px",
                width: "20px",
              }}
              onMouseMove={handleTooltipToggleCommon}
            />
      </LightTooltip>
  
);
};

export default LightTooltipComponent;
