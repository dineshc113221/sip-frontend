import React from "react";
import DashboardTabsComponent from "./../components/dashboard/DashboardTabs.component";
import { Context } from "../utills/useContext";
import { Divider} from "@mui/material";
import ProductComponent from "../pages/Product.component";
import "../assets/css/index.scss";

const Dashboard = () => {
 const [isParentData, setIsParentData] = React.useState({
    vsearch: "",
  });

  function callChildData(seachData: { vsearch : string}) {
    setIsParentData(seachData);
  }

  return (
      <Context.Provider value={null}>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
            <div className="product-tab">
                <DashboardTabsComponent sendToParent={callChildData} />
            </div>
       
          <Divider></Divider>
          <div>
            <ProductComponent is_search = {isParentData.vsearch} />
          </div>
        </div>
      </Context.Provider>
  );
};

export default Dashboard;