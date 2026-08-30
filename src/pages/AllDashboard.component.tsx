import React from "react";
import DashboardTabsComponent from "./../components/dashboard/DashboardTabs.component";
import { Context } from "../utills/useContext";
import { Divider } from "@mui/material";
import AllProductComponent from "./Allproduct.component";

const AllProductDashboard = () => {
  const [isParentData, setIsParentData] = React.useState({
    vsearch: "",
  });

  function callChildData(seachData: { vsearch: string}) {
    setIsParentData(seachData);
  }
  
  return (
      <Context.Provider value={null}>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          <div>
            <div className="product-tab">
             <DashboardTabsComponent sendToParent={callChildData}/>
            </div>
          </div>
          <Divider></Divider>
          <div>
            <AllProductComponent is_search = {isParentData.vsearch} />
          </div>
        </div>
      </Context.Provider>
  );
};

export default AllProductDashboard;