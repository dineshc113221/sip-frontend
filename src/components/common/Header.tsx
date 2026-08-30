import React from "react";
import { Divider } from "@mui/material";
import logo from "../../assets/images/Sustainable-Innovation-Tool-Logo-With-Endorsement-Line.svg";
import "../../assets/css/result-page.scss";
const Header: React.FC = () => {
  return (
  <>
    <img
        src={logo}
        alt="Sustainable Innovation Profiler"
        style={{width: "359.27px", height:"35px",  }}
      ></img>
      <div className="result1-divider"> <Divider/></div>
  </>
  );
};
 
export default Header;

