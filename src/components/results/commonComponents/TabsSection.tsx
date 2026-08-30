import React from "react";
import {
  ResultHTMLContents1,
  ResultHTMLContents2,
  ResultHTMLContents3,
} from "../../../constants/Results.constant";
import {
  CURRENT_SECTION,
  CURRENT_TAB,
  GREEN_CHEMISTRY_SECTIONS,
  SUSTAINABLE_SECTIONS,
} from "../../../constants/String.constants";
import ClusterBarChart from "../../common/ClusterBarChart";
import ResultSection1 from "../../common/ResultSection1Component";
import ResultSection2 from "../../common/ResultSection2Component";
import { PcrContent } from "../../results/sustainablePackaging/pcrContent/PcrContent"
import "../../../assets/css/sustainablePackagingCard.scss";
import { RecycleReady } from "../../results/sustainablePackaging/recycleReady/RecycleReady";
import {
  FootprintStructure,
  IFootprintTabStructure,
  IGreenChemistryStructure,
  IGreenChemistryTabStructure,
  ISustainableStructure,
  ISustainableTabStructure,
} from "../../../structures/result";
import { MaterialEfficiency } from "../../results/sustainablePackaging/materialEfficiency/MaterialEfficiency";
import RecyclabilityDisruptors from "../sustainablePackaging/recyclabilityDisruptors/RecyclabilityDisruptors";
import { TotalScore } from "../sustainablePackaging/totalScore/TotalScore";
import { AssementFormulationTable } from "../../results-page";
import { ResultsPackagingTable } from "../packaging/ResultsPackagingTable";
import { GaiaScore } from "../greenChemistry/gaiaScore/GaiaScore";
import { WatchListScore } from "../greenChemistry/watchListScore/WatchListScore";
import { TotalScoreGreen } from "../greenChemistry/totalScore/TotalScore";
import { RenewableOriginBonus } from "../greenChemistry/renewableOriginBonus/RenewableOriginBonus";
import CardsSection from "./CardsSection";


import "../../../assets/css/result-page.scss"
import { Divider } from "@mui/material";
interface TabsDesignProps {
  currentTab: string;
  tabsData: IFootprintTabStructure | ISustainableTabStructure | IGreenChemistryTabStructure;
  setCurrentSection: (section: SUSTAINABLE_SECTIONS | GREEN_CHEMISTRY_SECTIONS) => void;
  currentSection: string;
  handleSectionChange: (section: CURRENT_SECTION) => void;
  currentDefaultSection: string;
  data: FootprintStructure | ISustainableStructure | IGreenChemistryStructure;
}
const TabsSection: React.FC<TabsDesignProps> = ({
  currentTab,
  tabsData,
  setCurrentSection,
  currentSection,
  handleSectionChange,
  currentDefaultSection,
  data,
}) => {
  const renderSustainablePackaging = () => (
    <>
      <CardsSection
        tabSectionData={tabsData as ISustainableTabStructure}
        setCurrentSection={setCurrentSection}
      />


      {currentSection === SUSTAINABLE_SECTIONS.RECYCLE_READY && <RecycleReady />}
      {currentSection === SUSTAINABLE_SECTIONS.PCR_CONTENT && <PcrContent />}
      {currentSection === SUSTAINABLE_SECTIONS.MATERIAL_EFFICIENCY && <MaterialEfficiency />}
      {currentSection === SUSTAINABLE_SECTIONS.RECYCLABILITY_DISRUPTORS && <RecyclabilityDisruptors />}
      {currentSection === SUSTAINABLE_SECTIONS.TOTAL_SCORE && <TotalScore />}
    </>
  );

  const renderGreenChemistry = () => (
    <div className="green-chemistry-main">
      <CardsSection
        tabSectionData={tabsData as IGreenChemistryTabStructure}
        setCurrentSection={setCurrentSection}
        totalScore="green"
      />

      {currentSection === GREEN_CHEMISTRY_SECTIONS.TOTAL_SCORE && <TotalScoreGreen />}
      {currentSection === GREEN_CHEMISTRY_SECTIONS.GAIA_SCORE && <GaiaScore />}
      {currentSection === GREEN_CHEMISTRY_SECTIONS.WATCH_LIST_SCORE && <WatchListScore />}
      {currentSection === GREEN_CHEMISTRY_SECTIONS.RENEWABLE_ORIGIN_BONUS && <RenewableOriginBonus />}

    </div>
  );

  const renderDefaultTab = () => (
    <>
      <div className="result1_section1_main_div">
        <div className="result-section-head">
          <ResultHTMLContents1 />
        </div>
        <div className="result1_section1_sub_div2">
          <div className="result1_section1_sub_div3">
            {tabsData && "totalProduct" in tabsData && (
              <ResultSection1
                sectionName={CURRENT_SECTION.TOTAL_PRODUCT}
                handleSectionChange={handleSectionChange}
                title="Total Product"
                percent={tabsData?.totalProduct}
                indexSection1="1"
                currentTab={currentTab}
              />
            )}
          </div>
          <div className="result1_section1_sub_div3">
            {tabsData && "formulation" in tabsData && (
              <ResultSection1
                sectionName={CURRENT_SECTION.FORMULATION}
                handleSectionChange={handleSectionChange}
                title="Formulation"
                percent={tabsData?.formulation}
                indexSection1="2"
                currentTab={currentTab}
              />
            )}
          </div>
          <div className="result1_section1_sub_div3">
            {tabsData && "packaging" in tabsData && (
              <ResultSection1
                sectionName={CURRENT_SECTION.CONSUMER_PACKAGING}
                handleSectionChange={handleSectionChange}
                title="Consumer Packaging"
                percent={tabsData?.packaging}
                indexSection1="3"
                currentTab={currentTab}
              />
            )}
          </div>
        </div>

        <div className="bottom-text">
          <ResultHTMLContents2 />
        </div>
      </div>
      <div className="result1-divider"> <Divider /></div>

      <div className="combined">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            {ResultHTMLContents3(currentTab, currentDefaultSection)}
          </div>
        </div>
        <div className="result1_section2_div2">
          <ResultSection2 currentSection={currentDefaultSection} />
        </div>
      </div>

      {currentDefaultSection === CURRENT_SECTION.TOTAL_PRODUCT &&
        data &&
        "totalProduct" in data && (
          <div className="result_section3_div1">
            <ClusterBarChart barData={data.totalProduct.barData} currentTab={currentTab} />
          </div>
        )}

      {currentDefaultSection === CURRENT_SECTION.FORMULATION && (
        <div className="result_section3_div1">
          <AssementFormulationTable currentTab={currentTab} subHeaderText="Product Carbon Footprint" />
        </div>
      )}

      {currentDefaultSection === CURRENT_SECTION.CONSUMER_PACKAGING && (
        <div className="result_section3_div1">
          <ResultsPackagingTable currentTab={currentTab} />
        </div>
      )}
    </>
  );

  // Main render logic
  if (currentTab === CURRENT_TAB.SUSTAINABLE_PACKAGING) {
    return renderSustainablePackaging();
  } else if (currentTab === CURRENT_TAB.GREEN_CHEMISTRY) {
    return renderGreenChemistry();
  } else {
    return renderDefaultTab();
  }
};

export default TabsSection;
