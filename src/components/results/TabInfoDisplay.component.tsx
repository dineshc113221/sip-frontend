import React, { useContext } from "react";
import { TabPanel } from "../../constants/Formula.constant";

import {
  CURRENT_SECTION,
 

} from "../../constants/String.constants";

import "../../assets/css/sustainablePackagingCard.scss";
import "../../assets/css/result-page.scss";
import { ITabInfoDisplayComponent } from "./resultStructures";

import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";
import TabsSection from "./commonComponents/TabsSection";

const TabInfoDisplay: React.FC<ITabInfoDisplayComponent> = ({
  currentTab,
  data,
  tabsData,
  value,
  index,
  comingSoon,
}) => {
  const [currentDefaultSection, setCurrentDefaultSection] = React.useState<string>(
    CURRENT_SECTION.TOTAL_PRODUCT
  );
  const {
    currentSustainableSection,
    setCurrentSustainableSection,
    currentGreenChemistrySection,
    setCurrentGreenChemistrySection
  } = useContext(ResultDataContext);
  const handleSectionChange = (selectedSection: string): void => {
    setCurrentDefaultSection(selectedSection);
  };
 

  return (
    <>
      {!comingSoon ? (
        <TabPanel value={value} index={index}>
          <TabsSection
            currentTab={currentTab}
            tabsData={tabsData}
            setCurrentSection={currentTab==='GREEN_CHEMISTRY'?setCurrentGreenChemistrySection:setCurrentSustainableSection}
            currentSection={currentTab==='GREEN_CHEMISTRY'?currentGreenChemistrySection:currentSustainableSection}
            handleSectionChange={handleSectionChange}
            currentDefaultSection={currentDefaultSection}
            data={data}
          />
        </TabPanel>
      ) : (
        <div className="ComingSoon">Coming Soon</div>
      )}
    </>
  );
};

export default TabInfoDisplay;
