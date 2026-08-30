import { Tabs, Tab, Box, Divider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import "../../assets/css/tooltip.scss";
import DialsResultProductAssessment from "../common/DialsResultProductAssessment";
import { CURRENT_TAB } from "../../constants/String.constants";
import TabInfoDisplay from "./TabInfoDisplay.component";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { CommonBreadcrumb } from "../breadcrumb/CommonBreadcrumb.component";
import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";
import {
  IFootprintTabStructure,
  IGreenChemistryTabStructure,
  ISustainableTabStructure,
} from "../../structures/result";
import Header from "../common/Header";
import "./viewAllResults.scss";
import { useFetchVersionHistory } from "../../hooks/UseVersionHistory";

type TabType =
  | CURRENT_TAB.CARBON_FOOTPRINT
  | CURRENT_TAB.GREEN_CHEMISTRY
  | CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT
  | CURRENT_TAB.SUSTAINABLE_PACKAGING
  | CURRENT_TAB.TOP_LINE_RESULTS;

interface ITabInfo {
  title: string;
  id: TabType;
  comingSoon: boolean;
  tabsData:
  | IFootprintTabStructure
  | ISustainableTabStructure
  | IGreenChemistryTabStructure
  | null;
  classNameCustom: string;
}

const useStyles = makeStyles({
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "#00B097",
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: "black !important",
      fontWeight: "700 !important",
      width: "auto !important",
      fontFamily: "kenvue-sans !important"
    },
  },
});

interface VersionTagProps {
  latestVersion: string
}

export const CurrentVesrionIndicator = () => {
  return <div className='current-version-indicator' />
}

export const VersionTag: React.FC<VersionTagProps> = (props) => {
  return <div className="current-version">Version {`${props.latestVersion.split(".")[0]}`} <CurrentVesrionIndicator /></div>
}

const VersionController = (props: { latestVersion: string }) => {
  return (
    <div className="controller-top-div">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 className="results-heading">Results</h2>
        {props.latestVersion && <VersionTag latestVersion={props.latestVersion} />}
      </div>
      <div className="controller-second-div">
        <button type="button" className="export-button" disabled>
          Export - Coming soon!
        </button>
      </div>
    </div>
  );
};

const ViewAllResults: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);
  const { data: versionData } = useFetchVersionHistory();

  const {
    productEnvironmentalFootprintData,
    carbonFootprintData,
    sustainablePackagingData,
    greenChemistryData,
    currentTab,
    setCurrentTab,
} = useContext(ResultDataContext);
  const tabsInfo: ITabInfo[] = [
    {
      title: "Top Line Results",
      id: CURRENT_TAB.TOP_LINE_RESULTS,
      comingSoon: true,
      tabsData: null,
      classNameCustom: "top-line-results-main-menu",
    },
    {
      title: "Product Environmental Footprint",
      id: CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT,
      comingSoon: false,
      tabsData: productEnvironmentalFootprintData.tabs,
      classNameCustom: "product-environmental-footprint-main-menu",
    },
    {
      title: "Product Carbon Footprint",
      id: CURRENT_TAB.CARBON_FOOTPRINT,
      comingSoon: false,
      tabsData: carbonFootprintData.tabs,
      classNameCustom: "carbon-footprint-main-menu",
    },
    {
      title: "Green Chemistry",
      id: CURRENT_TAB.GREEN_CHEMISTRY,
      comingSoon: false,
      tabsData: greenChemistryData.tabs,
      classNameCustom: "green-chemistry-main-menu",
    },
    {
      title: "Packaging Circularity",
      id: CURRENT_TAB.SUSTAINABLE_PACKAGING,
      comingSoon: false,
      tabsData: sustainablePackagingData.tabs,
      classNameCustom: "sustainable-packaging-main-menu",
    },
  ];

  const [breadcrumbData, setBreadcrumbData] = useState({
    productID: "",
    productName: "",
    experimentalID: "",
    experimentalName: "",
  });
  const { productData, assessmentsData } = useContext(ProductDataContext);
  useEffect(() => {
    const breadCrumData = {
      productID: productData?.productId,
      productName: productData?.productName,
      experimentalID: assessmentsData?._id,
      experimentalName: assessmentsData?.name,
    };
    setBreadcrumbData(breadCrumData);
  }, [productData, assessmentsData]);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tabInfo = tabsInfo.find((_tab, index) => index === newValue);
    if (tabInfo) {
      setCurrentTab(tabInfo?.id);
    }
  };

  const getRelevantData = () => {
    switch (currentTab) {
      case CURRENT_TAB.CARBON_FOOTPRINT:
        return carbonFootprintData;
      case CURRENT_TAB.PRODUCT_ENVIRONMENTAL_FOOTPRINT:
        return productEnvironmentalFootprintData;
      case CURRENT_TAB.SUSTAINABLE_PACKAGING:
        return sustainablePackagingData;
      case CURRENT_TAB.GREEN_CHEMISTRY:
        return greenChemistryData;
      case CURRENT_TAB.TOP_LINE_RESULTS:
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      <CommonBreadcrumb
        productID={breadcrumbData?.productID}
        experimentalID={breadcrumbData?.experimentalID}
        productName={breadcrumbData?.productName}
        experimentalName={breadcrumbData?.experimentalName}
        path={window.location.pathname}
      />
      <VersionController latestVersion={versionData?.data[0]?.version_number} />
      <DialsResultProductAssessment
        page="result"
        dials_without_data_show="no"
        selectedtab={value}
      />

      <Box className="box-result-main-menu">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon position tabs example"
          className={classes.tabs}
        >
          {tabsInfo.map((tabInfo) => (
            <Tab
              className={`result_tabs_label1 ${tabInfo.classNameCustom}`}
              sx={{ textTransform: "none" }}
              iconPosition="end"
              label={tabInfo.title}
              key={tabInfo.title}
            />
          ))}
        </Tabs>
      </Box>
      <div className="result1-divider"> <Divider /></div>

      <div>
        {tabsInfo.map(
          (tab, index) =>
            (currentTab as CURRENT_TAB) === tab.id && (
              <TabInfoDisplay
                key={tab.id}
                currentTab={currentTab}
                comingSoon={tab.comingSoon}
                value={value}
                index={index}
                tabsData={tab.tabsData}
                data={getRelevantData()}
              />
            )
        )}
      </div>
    </>
  );
};
export default ViewAllResults;
