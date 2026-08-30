import React, { useState, useContext, useEffect, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import complete from "../../assets/images/complete.svg";
import incomplete from "../../assets/images/incomplete.svg";
import logo from "../../assets/images/Sustainable-Innovation-Tool-Logo-With-Endorsement-Line.svg";
import makeStyles from "@mui/styles/makeStyles";
import { Avatar, Divider, Box, CircularProgress, Tooltip } from "@mui/material";
import "../../assets/css/tooltip.scss";
import { TabPanel } from "../../constants/Formula.constant";
import { ConsumerPackaging } from "./../consumer-packaging-tab";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import DialsResultProductAssessment from "../common/DialsResultProductAssessment";
import "react-toastify/dist/ReactToastify.css";
import EditAssessmentTitle from "../breadcrumb/EditAssessmentTitle.component";
import FormulaAndConsumer from "../formulation/formulation-tab/FormulaAndConsumer";
import { CommonBreadcrumb } from "../breadcrumb/CommonBreadcrumb.component";
import { ConsumerPackagingProvider } from "./../consumer-packaging-tab/ConsumerPackagingContext";
import { ConsumerPackagingRef } from "../consumer-packaging-tab/ConsumerPackaging.component";
import { AutoSaveContext } from "../../contexts/autoSaveContext/AutoSaveContext";
import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";
import { useNavigate } from "react-router-dom";
import WarningPopup from "../../controls/WarningPopup";
import { GetToastContainer } from "../../helper/GenericFunctions";
import VersionHistoryTab from "../history-page/VersionHistoryTab";

const useStyles = makeStyles({
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "#00B097",
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: "black",
    },
  },
});

const ProductAssessmentDetail: React.FC = () => {
  const classes = useStyles();
  const [breadcrumbData, setBreadcrumbData] = useState({
    productID: "",
    productName: "",
    experimentalID: "",
    experimentalName: "",
  });
  const { setTabSwitched, changedFields, showNavigationWarning,
    setShowNavigationWarning,
    pathNavigation, isDataCompleted } = useContext(AutoSaveContext);
  const navigate = useNavigate();
  const { productData, refetch, assessmentsData, assessmentsType, packagingDataComplete } =
    useContext(ProductDataContext);
  
 // const isBaseLineSkipped = productData
  const assessmentType = assessmentsType;
  const [value, setValue] = React.useState(0);
  const [isDialsWithoutDataShow, setIsDialsWithoutDataShow] = useState("yes");
  const [dialsWithoutDataShowMsg, setDialsWithoutDataShowMsg] = useState("Enter both your formulation and packaging data and hit 'calculate' to view results");
  const consumerPackagingRef = useRef<ConsumerPackagingRef>(null);
  const {
    dialsError,
    dialsErrorMsg
  } = useContext(ResultDataContext);
  const handleExit = () => {
    setShowNavigationWarning(false);
    if (pathNavigation === "help-support") {
      const link = document.createElement('a');
      link.href =
        'https://kenvue.service-now.com/solutionshub?id=sc_cat_item&sys_id=45c1ff5cdbb50b44a0737a8eaf961960';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      navigate(pathNavigation || "/");
    }

  };

  const handleReview = () => {
    setShowNavigationWarning(false);
  };
  useEffect(() => {
    if (!(assessmentsData?.isFormulationDataCompleted && assessmentsData?.isPackagingDataCompleted)) {
      setIsDialsWithoutDataShow("yes");
      setDialsWithoutDataShowMsg("Enter both your formulation and packaging data and hit 'calculate' to view results")
    }
    else if (dialsError || dialsError == undefined) {
      setIsDialsWithoutDataShow("yes");
      setDialsWithoutDataShowMsg(dialsErrorMsg)
    }
    else {
      setIsDialsWithoutDataShow("no");
      setDialsWithoutDataShowMsg("")
    }

  }, [dialsErrorMsg, dialsError,assessmentsData]);
  useEffect(() => {

    setBreadcrumbData(getBreadcrumbData(productData, assessmentsData));
    if (!assessmentsData) return;
  }, [productData, assessmentsData,]);
  //  **Helper Functions**
   
   const getBreadcrumbData = (productData, assessmentsData) => ({
   
    productID: productData?.productId,
    productName: productData?.productName,

    experimentalID: assessmentsData?._id,

    experimentalName: assessmentsData?.name,

  });


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0 && consumerPackagingRef.current) {
      consumerPackagingRef.current.packagingDataSave();
    }
    if (changedFields.length > 0) {
      setTabSwitched(true);
    }
    refetch();
  };
  const isProductDataEmpty = !(productData?.productId && productData?.productName);

  const isAssessmentDataEmpty = !(assessmentsData?._id && assessmentsData?.name);


  if (isProductDataEmpty || isAssessmentDataEmpty) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#00b097" }} />
      </Box>
    );
  }
  return (
    <ConsumerPackagingProvider>

      <img
        src={logo}
        alt="Sustainable Innovation Profiler"
        style={{ width: "359.27px", height: "35px", }}
      ></img>
      <Divider></Divider>

      <CommonBreadcrumb
        productID={breadcrumbData?.productID}
        experimentalID={breadcrumbData?.experimentalID}
        productName={breadcrumbData?.productName}
        experimentalName={breadcrumbData?.experimentalName}
        path={window.location.pathname}
      />
      {showNavigationWarning && isDataCompleted && (
        <WarningPopup handleExit={handleExit} handleReview={handleReview} />
      )}
      {/* START CODE - PRODUCT ASSESSMENT EDIT TITLE */}
      <EditAssessmentTitle />
      {/* END CODE - PRODUCT ASSESSMENT EDIT TITLE */}
      {<GetToastContainer />}

      {/* START CODE - DISPLAY DIALS AND CHART  - PRODUCT ASSESSMENT */}
      {(assessmentType === "final" || assessmentType === "experimental") && (
        <DialsResultProductAssessment
          page="product-assessment"
          dials_without_data_show={isDialsWithoutDataShow}
          dials_without_data_show_msg={dialsWithoutDataShowMsg}
        />
      )}
      {/* END CODE - DISPLAY DIALS AND CHART - PRODUCT ASSESSMENT */}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon position"
          className={classes.tabs}
          style={{ height: "61px", padding: "0px", borderRadius: "0px" }}
          sx={{
            "& .jss2": {
              padding: "0px",
              borderRadius: "0px",
            },
          }}
        >
          <Tab
            value={0}
            icon={
              assessmentsData?.isFormulationDataCompleted ? (
                <Avatar
                  style={{ height: "18px", width: "18px", marginLeft: "12px" }}
                  src={complete}
                />
              ) : (
                <Avatar
                  style={{ height: "18px", width: "18px", marginLeft: "12px" }}
                  src={incomplete}
                />
              )
            }
            sx={{
              fontWeight: value === 0 ? "700" : "400",
              fontSize: "19.2px",
              fontFamily: value === 0 ? "kenvue-sans" : "kenvue-sans-regular",
              textTransform: "none",
              paddingLeft: "0px",
              paddingRight: "0px",
              height: "41px",
            }}
            iconPosition="end"
            label="Formulation"
            style={{ marginRight: "36px" }}
          />
          <Tab
            value={1}
            icon={
              (assessmentsData?.isPackagingDataCompleted && packagingDataComplete) ? (
                <Avatar
                  style={{ height: "18px", width: "18px", marginLeft: "12px" }}
                  src={complete}
                />
              ) : (
                <Avatar
                  style={{ height: "18px", width: "18px", marginLeft: "12px" }}
                  src={incomplete}
                />
              )
            }
            sx={{
              fontWeight: value === 1 ? "700" : "400",
              fontSize: "19.2px",
              fontFamily: value === 1 ? "kenvue-sans" : "kenvue-sans-regular",
              textTransform: "none",
              paddingLeft: "0px",
              paddingRight: "0px",
              height: "41px",
            }}
            iconPosition="end"
            label="Consumer Packaging"
            style={{ marginRight: "36px" }}
          />
          {assessmentType != "baseline" && <Tab
            value={2}
            sx={{
              fontWeight: value === 2 ? "700" : "400",
              fontSize: "19.2px",
              fontFamily: value === 2 ? "kenvue-sans" : "kenvue-sans-regular",
              textTransform: "none",
              paddingLeft: "0px",
              paddingRight: "0px",
              height: "72px",
            }}
            iconPosition="end"
            label={<Tooltip
              title="Click here to view version change details and post result snapshots."
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                    fontSize: "13.3px",
                    borderRadius: "15px",
                    padding: "15px 10px",
                    border: "1px solid #E0E0E0",
                    fontFamily: "kenvue-sans-regular",
                    width: "197px",
                    height: "90px"
                  },
                },
                arrow: {
                  sx: {
                    color: "#ffffff",
                  },
                },
              }}
            >
              <span>Version History</span></Tooltip>}
          />}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <FormulaAndConsumer />
      </TabPanel>

      <TabPanel value={value} index={1}>

        <ConsumerPackaging ref={consumerPackagingRef} />

      </TabPanel>
      {assessmentType != "baseline" && <TabPanel value={value} index={2}>
        <VersionHistoryTab productId={productData?.productId} assessmentsData={assessmentsData} assessmentType={assessmentType} />
      </TabPanel>}
    </ConsumerPackagingProvider>
  );
};

export default ProductAssessmentDetail;
