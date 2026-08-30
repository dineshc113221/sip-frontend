import { Divider } from "@mui/material";
import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/images/Sustainable-Innovation-Tool-Logo-With-Endorsement-Line 1.svg";
import "../../assets/css/Style.scss";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { DashboardTabsProps } from "../../structures/dashboard";
import Popup from "../common/PopupComponentAddEditProduct";
import { TrackGoogleAnalyticsEvent } from "../common/TrackGoogleAnalyticsEvent";

const DashboardTabsComponent = (dashboardData: DashboardTabsProps) => {  
  const { loggedInUser } = useGlobaldata();
  const [loginUserName, setLoginUserName] = React.useState(
    loggedInUser?.givenName
  );
  const [searchText, setSearchText] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const dialogKey = 0;
  const [lastSubmittedValue, setLastSubmittedValue] =  React.useState(""); // Tracks the last submitted value

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleSearchSubmit = () => {

    if (searchText.trim() && searchText !== lastSubmittedValue) {
  
     dashboardData.sendToParent({ vsearch: searchText });
  
     setLastSubmittedValue(searchText); // Update the last submitted value
  
    }
  
   };
  React.useEffect(() => {
    const trackEvent = async () => {
      await TrackGoogleAnalyticsEvent(
        "PAGE_VIEW",
        "My Product",
        {
          loginUserName,
          PAGE_VIEW: "/dashboard",
        }
      );
    };
  
    trackEvent();
    setLoginUserName(
      loggedInUser?.givenName
    );
  }, [ loginUserName,loggedInUser?.givenName]);

  return (
    <div>
      <img
        src={logo}
        alt="Sustainable Innovation Profiler"
        style={{ width: "359.27px", height:"35px",  }}
      ></img>
      <Divider></Divider>
      <div
        className="welcome-row-dashbord"
      >
        
        <div
  className="dashboard-head1"
  style={{
    alignItems: "center",
  }}
>
  <div
   
    className="header_dashboard1"
  >
    <span className="welcome-text">Welcome back,&nbsp;</span>
    <span className="username-text">{loginUserName}</span>
  </div>
</div>

        <div style={{ display: "flex", alignItems: "center", }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                border: isFocused ? "2px solid black" : "none", // Conditional border               
                padding: "5px", // Optional for spacing
                marginRight: "4px",
                width:"100%",
              }}
            >
              <SearchIcon
                onClick={() => {
                  dashboardData.sendToParent({ vsearch: searchText });
                }}
                style={{ paddingTop: "3px" }}
              />
              <input
                type="text"
                style={{
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "16px",
                  flex: 1, // Ensures the input takes available space
                  border: "none", // Remove the default border
                  outline: "none", // Remove the default focus outline
                }}
                // className="searchText"
                value={searchText}
                placeholder="Search"
                onFocus={() => setIsFocused(true)} // Set focus state

                onBlur={() => setIsFocused(false)} // Remove focus state
             
                onChange={(e) => {
             
                 setSearchText(e.target.value);
             
                 if (e.target.value === "") {
             
                  setLastSubmittedValue(""); // Reset the last submitted value if input is cleared
             
                  dashboardData.sendToParent({ vsearch: "" });
             
                 }
             
                }}
             
                onKeyDown={(e) => {
             
                 if (e.key === "Enter") {
             
                  handleSearchSubmit();
             
                 }
             
                }}
             
               />
             
              <CloseIcon style={{
                padding: "2px",
                cursor:"pointer",
                visibility: searchText ? "visible" : "hidden",
              }}
                onClick={() => {
                  setSearchText("");
                  setLastSubmittedValue(""); 
                  dashboardData.sendToParent({ vsearch: "" })
                }}
                />
              
            </div>
           
          
           <div className="divider-container" style={{ width: '2px', height: '25px', backgroundColor: "#BFBFBF", marginRight: "15px" }}>
             <Divider className="divider-dashboard" orientation="vertical" style={{ height: '100%', width: '1px' }} />
           </div>
          </div>
          <div className="add-button" style={{paddingRight:"20px"}}>
            <button
              onClick={handleOpenDialog}
              className="add-product-button"
              style={{
                fontFamily: "kenvue-sans-regular",
                fontSize: "16px",
                padding: "10px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
                border: "1px solid black",
                cursor: "pointer"
              }}
            >
              Add Product
            </button>
            <Popup
            key={dialogKey}
            open={dialogOpen}
            onClose={handleCloseDialog}
          />
          </div>
        </div>
      </div>
      
    </div>
 
);
};

export default DashboardTabsComponent;
