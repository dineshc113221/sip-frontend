import React, { useContext, useEffect } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import ListItemIcon from "@mui/material/ListItemIcon";
import openBar from "../../assets/images/toggle-expand.svg";
import close from "../../assets/images/toggle-collapse.svg";
import home from "../../assets/images/home.svg";
import homeg from "../../assets/images/Homeg.svg";
import changelog from "../../assets/images/changelog.svg";
import changelogg from "../../assets/images/changelogg.svg";
import adminIcon from "../../assets/images/admin.svg";
import adminIcong from "../../assets/images/adming.svg";
import Products from "../../assets/images/products.svg";
import Productsg from "../../assets/images/Productsg.svg";
import Help from "../../assets/images/help.svg";
import Helpg from "../../assets/images/Helpg.svg";
import signout from "../../assets/images/Log Out.svg";
import Kenvue_Logo from "../../assets/images/Kenvue K_Logo.svg";
import kenvue_full_logo from "../../assets/images/Kenvue Full_Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { SidebarContext } from "../../contexts/sidebarData/SidebarStateContext";
import { SideBarProps } from "../breadcrumb/types";
import { AutoSaveContext } from "../../contexts/autoSaveContext/AutoSaveContext";
import SidebarItem from "./SidebarItem";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { isSIPAdmin } from "../../helper/GenericFunctions";
import UserProfilePhoto from "./UserProfilePhoto";

export const BootstrapTooltipSideBar = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      placement="bottom-start"
    />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#00b097",
    marginLeft: "-20px",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#00b097",
    border: "2px solid #FFFFFF",
    boxShadow: theme.shadows[1],
    fontFamily: "kenvue-sans",
    fontWeight: "700",
  },
}));

const drawerWidth = 200;

const openedMixin = (): CSSObject => ({
  width: drawerWidth,
  overflow: "hidden",
  background: "black",
  borderRadius: "0px 35px 0px 0px",
  // position:"sticky"
});

const closedMixin = (theme: Theme): CSSObject => ({
  overflow: "hidden",
  borderRadius: "0px 35px 0px 0px",
  background: "black",
  width: `calc(${theme.spacing(7)} + 0px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7.5)} + 0.0px)`,
  },
  // position:"sticky"
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(),
    "& .MuiDrawer-paper": openedMixin(),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));



const renderLogo = (open) => {
  return !open ? (
    <img src={Kenvue_Logo} style={{ marginLeft: "25%", marginTop: "20px" }} alt="Admin Console" />
  ) : (
    <img style={{ marginTop: "20px", marginLeft: '-22px', display: "block" }} src={kenvue_full_logo} alt="kenvue-full-logo" />
  );
};


export default function SideBarAction(props: SideBarProps) {
  const navigate = useNavigate();
  const useLocations = useLocation();
  const { setTabSwitched, changedFields,
    setPathNavigation,
    isAllFlagsCalc,
    setShowNavigationWarning, isOwnerUser, isDataCompleted, hasUncalculatedChanges, isDialsSidebarError
  } = useContext(AutoSaveContext);
  const { setCurrentSection, currentSection } = useContext(SidebarContext);


  const [open, setOpen] = React.useState(false);

  const handleClickArrow = () => {
    setOpen((prevStep) => !prevStep);
  };
  const { onSignOutClick } = props;

  // Navigation handler
  const handleNavigation = (path: string) => {

    if (hasUncalculatedChanges && isOwnerUser && isDataCompleted && isAllFlagsCalc && !isDialsSidebarError) {
      setPathNavigation(path);
      setShowNavigationWarning(true);
    } else {
      navigate(path);
    }
  };

  const checkForTabSwitch = () => {
    if (changedFields.length > 0) {
      setTabSwitched(true);
    }
  };

  const homeIconClick = () => {
    handleNavigation("/dashboard");
    setCurrentSection("home");

    checkForTabSwitch();
  };

  const allProductClick = () => {
    handleNavigation("/allproduct");
    setCurrentSection("allProducts");

    checkForTabSwitch();
  };

  const changeLogClick = () => {
    handleNavigation("/changelog");
    setCurrentSection("changelog");

    checkForTabSwitch();
  };

  const adminConsoleClick = () => {
    handleNavigation("/admin");
    setCurrentSection("admin");

    checkForTabSwitch();
  };

  const openHelpLink = () => {
    const link = document.createElement('a');
    link.href =
      'https://kenvue.service-now.com/solutionshub?id=sc_cat_item&sys_id=45c1ff5cdbb50b44a0737a8eaf961960';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const helpSupportClick = () => {
    if (hasUncalculatedChanges && isOwnerUser && isDataCompleted && isAllFlagsCalc && !isDialsSidebarError) {
      setPathNavigation('help-support');
      setShowNavigationWarning(true);
    } else {
      openHelpLink();
    }
  };


  useEffect(() => {
    props?.getRoutePathName(useLocations?.pathname)
    if (useLocations?.pathname === "/allproducts" ||
      useLocations?.pathname === "/allproduct") {

      setCurrentSection("allProducts");
    } else if (useLocations?.pathname === "/changelog") {

      setCurrentSection("changelog");
    } else if (useLocations?.pathname === "/admin") {

      setCurrentSection("admin");
    } else if (useLocations?.pathname === "/dashboard") {

      setCurrentSection("home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocations?.pathname]);

  const { loggedInUser } = useGlobaldata();
  const isAdmin: boolean = isSIPAdmin(loggedInUser?.roles);


  return window.location.pathname !== "/sip/login" ? (

    <Box className="sidebar-main" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Drawer className="sidebar-drawer" variant="permanent" open={open}>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 0 : "auto",
            justifyContent: "center",
          }}
        >
          {renderLogo(open)}
        </ListItemIcon>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <List className="sidebar-list" sx={{ flex: 1 }}>
            <SidebarItem
              open={open}
              selected={currentSection === "home"}
              label="Home"
              icon={home}
              selectedIcon={homeg}
              tooltip="My Products"
              onClick={homeIconClick}
            />


            <SidebarItem
              open={open}
              selected={currentSection === "allProducts"}
              label="All Products"
              icon={Products}
              selectedIcon={Productsg}
              tooltip="All Products"
              onClick={allProductClick}
            />


            <SidebarItem
              open={open}
              selected={currentSection === "help"}
              label="Help"
              icon={Help}
              selectedIcon={Helpg}
              tooltip="Help & Support"
              onClick={helpSupportClick}
              filterSelected="invert(49%) sepia(99%) saturate(749%) hue-rotate(127deg) brightness(97%) contrast(101%)"
            />

            <SidebarItem
              open={open}
              selected={currentSection === "changelog"}
              label="Change Log"
              icon={changelog}
              selectedIcon={changelogg}
              tooltip="Change Log"
              onClick={changeLogClick}
            />
            {/* <-- user role enable*/}
            {isAdmin && <SidebarItem
              open={open}
              selected={currentSection === "admin"}
              label="Admin Console"
              icon={adminIcon}
              selectedIcon={adminIcong}
              tooltip="Admin Console"
              onClick={adminConsoleClick}
            />}

            {
              !open ? (
                <Divider
                  style={{
                    borderColor: "white",
                    width: "70%",
                    marginTop: "24px",
                    marginLeft: "10px",
                  }
                  }
                />
              ) : (
                <Divider
                  style={{
                    borderColor: "white",
                    width: "85%",
                    marginTop: "24px",
                    marginLeft: "10px",
                  }}
                />
              )}

            <ListItemIcon
              onClick={handleClickArrow}
              sx={{
                cursor: "pointer",
                minWidth: 0,
                marginTop: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: open ? "flex-start" : "center",
                width: "100%",
                paddingLeft: open ? "16px" : 0,
                paddingRight: open ? "16px" : 0,
              }}
            >
              {!open ? (
                <BootstrapTooltipSideBar
                  className="BootstrapTooltipSidebar"
                  title={<p className="BootstrapTooltipSidebar-p">Expand / Collapse</p>}
                >
                  <img
                    src={openBar}
                    alt="Open sidebar"
                    style={{ display: "block", margin: "0 auto", height: 24, width: 24 }}
                  />
                </BootstrapTooltipSideBar>
              ) : (
                <>
                  <BootstrapTooltipSideBar
                    className="BootstrapTooltipSidebar"
                    title={<p className="BootstrapTooltipSidebar-p">Expand / Collapse</p>}
                  >
                    <img src={close} alt="Close sidebar" style={{ height: 24, width: 24 }} />
                  </BootstrapTooltipSideBar>
                  <span
                    style={{
                      fontFamily: "kenvue-sans-regular",
                      fontWeight: 400,
                      color: "#fff",
                      fontSize: "13.33px",
                      marginLeft: "10px",
                      lineHeight: 1.5

                    }}
                  >
                    Close
                  </span>
                </>
              )}
            </ListItemIcon>

            {/* Remove duplicate ListItemText and only show text when open, handled above */}



          </List>
          <SidebarItem
            open={open}
            label="Sign out"
            icon={signout}
            tooltip="Sign out"
            onClick={onSignOutClick}
            marginTop="0"
            marginBottom="24px"
            textColor="#fff"
            fontSize="13.33px"
          />

        </Box>
        <UserProfilePhoto open={open} />
      </Drawer>
    </Box>
  ) : (
    <></>
  );
}