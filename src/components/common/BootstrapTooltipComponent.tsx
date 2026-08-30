import React from "react";
import Tooltip, { TooltipProps, tooltipClasses} from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

export interface BootstrapTooltipComponentProps {
  title: string;
  subtitle: string;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      backgroundColor: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      borderRadius: "32px 32px 32px 32px",
      padding: "10px",
      border: "1px solid black",
      width: "437px",
      height: "auto",
      fontFamily: "kenvue-sans",
      transform: "translate3d(290px, -8.3333px, 0px)",
    },
  }));

const BootstrapTooltipComponent: React.FC<BootstrapTooltipComponentProps> = (props) => {

  return (

        <BootstrapTooltip
            className="BootstrapTooltip"
            title={
            <>
                <h3 className="header BootstrapTooltip-h3">
                    {props.title}
                </h3>
                <p className="BootstrapTooltip-p">
                    {props.subtitle}
                </p>
            </>
        }
        >
        <InfoIcon className="packaging-InfoIcon" />
        </BootstrapTooltip>

  );
};

export default BootstrapTooltipComponent;
