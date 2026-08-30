import React from "react";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export const SelectedViewButton: React.FC<{
  name: "List View" | "Grid View";
  gridViewOpenClick: () => void;
}> = ({ name, gridViewOpenClick }) => {
  return (
    <button
      onClick={gridViewOpenClick}
      style={{
        cursor: "pointer",
        alignItems: "center",
        display: "flex",
        border: "none",
        textDecorationColor: "#6CC24A",
        borderBottom: "2px solid #00B097",
        borderWidth: "7%",
        marginRight: "auto",
        float: "right",
        background: "none",

        padding: 0,
      }}
    >
      {name === "Grid View" && <AppsIcon style={{ marginLeft: "0px" }} />}
      {name === "List View" && <FormatListBulletedIcon />}
      <span
        style={{ marginLeft: "3px" }}
        className="all_my_product_sort_selected_Label"
      >
        {name}
      </span>
    </button>
  );
};
