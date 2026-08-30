import React from "react";
import { ListItemIcon } from "@mui/material";
import { BootstrapTooltipSideBar } from "./SidebarAction.component";

interface SidebarItemProps {
  open: boolean;
  selected?: boolean;
  label: string;
  icon: string;
  tooltip: string;
  onClick: () => void;
  selectedIcon?: string;
  textColor?: string;
  borderHighlight?: boolean;
  fontWeightSelected?: number;
  fontWeightNormal?: number;
  fontSize?: string;
  marginTop?: string;
  marginBottom?: string;
  filterSelected?: string;
}

// ---- Helper Functions ----
const getImgSize = (label: string) => (label === "Sign out" ? "24px" : "36px");

const getBorderLeft = (borderHighlight: boolean, selected: boolean) =>
  borderHighlight && selected ? "4px solid #00b097" : "4px solid transparent";

const getImgSrc = (selected: boolean, selectedIcon?: string, icon?: string) =>
  selected && selectedIcon ? selectedIcon : icon || "";

const getImgFilter = (selected: boolean, filterSelected?: string) =>
  selected && filterSelected ? filterSelected : "none";

const getFontFamily = (selected: boolean) =>
  selected ? "kenvue-sans" : "kenvue-sans-regular";

const getFontWeight = (
  selected: boolean,
  fontWeightSelected: number,
  fontWeightNormal: number
) => (selected ? fontWeightSelected : fontWeightNormal);

// ---- Component ----
const SidebarItem: React.FC<SidebarItemProps> = ({
  open,
  selected = false,
  label,
  icon,
  tooltip,
  onClick,
  selectedIcon,
  textColor = "#fff",
  borderHighlight = true,
  fontWeightSelected = 700,
  fontWeightNormal = 400,
  fontSize = "16px",
  marginTop = "35px",
  marginBottom = "0px",
  filterSelected,
}) => {
  const imgSize = getImgSize(label);
  const borderLeft = getBorderLeft(borderHighlight, selected);
  const imgSrc = getImgSrc(selected, selectedIcon, icon);
  const imgFilter = getImgFilter(selected, filterSelected);
  const fontFamily = getFontFamily(selected);
  const fontWeight = getFontWeight(selected, fontWeightSelected, fontWeightNormal);

  return (
    <ListItemIcon
      onClick={onClick}
      className={`sidebar-icon ${selected ? "selected" : ""}`}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: open ? "flex-start" : "center",
        marginTop,
        marginBottom,
        minWidth: 0,
        mr: open ? 1 : "auto",
        borderLeft,
        height: imgSize,
        background: "none",
        width: "100%",
        paddingLeft: open ? "10px" : "0px",
        paddingRight: open ? "16px" : "0px",
      }}
    >
      <BootstrapTooltipSideBar
        className="BootstrapTooltipSidebar"
        title={<p className="BootstrapTooltipSidebar-p">{tooltip}</p>}
      >
        <img
          src={imgSrc}
          alt={label.toLowerCase()}
          style={{
            filter: imgFilter,
            margin: open ? "0 8px 0 0" : 0,
            display: "block",
            marginLeft: open ? 0 : "auto",
            marginRight: open ? 0 : "auto",
            height: imgSize,
            width: imgSize,
          }}
        />
      </BootstrapTooltipSideBar>

      {open && (
        <span
          style={{
            fontFamily,
            fontWeight,
            color: textColor,
            fontSize,
            marginLeft: "10px",
            lineHeight: 1.5,
          }}
        >
          {label}
        </span>
      )}
    </ListItemIcon>
  );
};

export default SidebarItem;
