import { Link, useNavigate } from "react-router-dom";
import { IBreadcrumbData } from "./types";
import React, { useContext, useEffect } from "react";
import { SidebarContext } from "../../contexts/sidebarData/SidebarStateContext";
import { AutoSaveContext } from "../../contexts/autoSaveContext/AutoSaveContext";
import { CheckCRUDAccess, truncate } from "../../helper/GenericFunctions";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import useFormulaAndConsumer from "../formulation/formulation-tab/useFormulaAndConsumer";
import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";

interface IBreadcrumbProps extends IBreadcrumbData {
  path: string;
}

export const CommonBreadcrumb: React.FC<IBreadcrumbProps> = ({
  productID,
  productName,
  experimentalID,
  experimentalName,
  path,
}: IBreadcrumbProps) => {
  const navigate = useNavigate();
  const { currentSection } = useContext(SidebarContext);
  const { allFlagsCalculated } = useFormulaAndConsumer();
   const {
      dialsError,
    } = useContext(ResultDataContext);
  const { usersData, bothPackFormulaStatus } = useContext(ProductDataContext);
  const isOwnerFormulation = CheckCRUDAccess(usersData, "formulation") === 1;
  const isOwner = isOwnerFormulation;
  const { setTabSwitched, changedFields, 
    setPathNavigation,
    setShowNavigationWarning, isDataCompleted, setIsOwnerUser } = useContext(AutoSaveContext);
  useEffect(() => {
    setIsOwnerUser(isOwner)
  }, [isOwner, setIsOwnerUser]);
  const checkForTabSwitch = () => {
    if (changedFields.length > 0) {
      setTabSwitched(true);
    }
  };

  let currentLink = "";
  const crumbs: React.ReactElement[] = path
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink = `| ${crumb}`;
      return (
        <div key={crumb}>
          <Link style={{ color: "black" }} to={currentLink}>
            {crumb}
          </Link>
        </div>
      );
    });
  const handleBreadcrumbClick = (intendedPath: string) => {
    if (bothPackFormulaStatus && isOwner && isDataCompleted && allFlagsCalculated && !dialsError) {
      setPathNavigation(intendedPath);
      setShowNavigationWarning(true);
    } else {
      navigate(intendedPath);
    }
  };
  const renderBreadCrumbContent = () => {

    if (
      (crumbs[0]?.props?.children?.props?.children === "product-assessment" ||
        crumbs[0]?.props?.children?.props?.children === "view-all-results") &&
      experimentalID !== ""
    ) {
      return (
        <div style={{ display: "flex", width: "auto" }}>
          <div style={{ width: "flex" }}>
            <button
              type="button"
              className="breadcrumb1"
              onClick={() => {
                checkForTabSwitch();
                handleBreadcrumbClick(currentSection === "home" ? "/dashboard" : "/allproduct");
              }}
              style={{
                marginTop: "1px",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "kenvue-sans-regular",
                border: "none",
                backgroundColor: "transparent",
                padding: "0px",
                color:'#000',
                fontSize: "13.33px",
                fontWeight: 400,
                lineHeight: "19.99px",
              }}
            >
              {currentSection === "home" ? "Home" : "All Product"}{" "}
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>|</span>
            </button>
          </div>
          <div style={{ width: "flex", marginLeft: "5px" }}>
            <button
              onClick={() => {
                checkForTabSwitch();
                handleBreadcrumbClick(`/my-product-detail/${productID}`);
              }}
              style={{
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "kenvue-sans-regular",
                border: "none",
                backgroundColor: "transparent",
                padding: "0px",
                textAlign: "left",
                fontSize: "13.33px",
              }}
            >
              {productName}
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>|</span>
            </button>
          </div>
          <div style={{ width: "flex", marginLeft: "5px" }}>
            <button
              className="findingDiv"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                width: "flex",
                pointerEvents: "none",
                fontFamily: "kenvue-sans",
                fontWeight: "700",
                border: "none",
                backgroundColor: "transparent",
                padding: "0px",
                fontSize: "13.33px",
              }}
            >
              {truncate(experimentalName, 50)}
            </button>
          </div>
        </div>
      );
    } else if (
      crumbs[0].props.children.props.children === "my-product-detail" &&
      experimentalID === ""
    ) {
      return (
        <div style={{ display: "flex", width: "auto" }}>
          <div style={{ width: "flex" }}>
            <button
              onClick={() => {
                checkForTabSwitch();
                handleBreadcrumbClick(currentSection === "home" ? "/dashboard" : "/allproduct");
              }}
              style={{
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "kenvue-sans-regular",
                border: "none",
                backgroundColor: "transparent",
                padding: "0px",
                color: '#000',
                fontSize: "13.33px",
              }}
            >
              {currentSection === "home" ? "Home" : "All Product"}
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>|</span>
            </button>
          </div>
          <button
            style={{
              width: "flex",
              pointerEvents: "none",
              fontFamily: "kenvue-sans",
              fontWeight: "700",
              border: "none",
              backgroundColor: "transparent",
              padding: "0px",
              fontSize: "13.33px",
            }}
          >
            &nbsp;{productName}
          </button>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", width: "auto", alignItems: "baseline" }}>
          <div style={{ width: "flex" }}>
            <Link
              style={{
                textDecoration: "none",
                fontFamily: "kenvue-sans-regular",
                fontSize: "13.33px",
                fontWeight: 400,
                lineHeight: "19.99px",
                textAlign: "left",
                color:'#000'
              }}
              to={currentSection === "home" ? '/dashboard' :'/allproduct'}
            >
              {currentSection === "home" ? "Home" : "All Product"}
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>|</span>
            </Link>
          </div>
          <div>
            <button
              style={{
                width: "flex",
                pointerEvents: "none",
                fontFamily: "kenvue-sans",
                fontWeight: "700",
                fontSize: "13.33px",
                border: "none",
                backgroundColor: "transparent",
                lineHeight: "19.99px",
                padding: "0px",
              }}
            >
              &nbsp;{productName}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        marginTop: "5px",
        padding: "16px",
      }}
    >
      {renderBreadCrumbContent()}
    </div>
  );
};
