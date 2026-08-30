import React from "react";
import Divider from "@mui/material/Divider";
import TabsDesign from "../commonComponents/TabsDesign";
import result_hint_icon from "../../../assets/images/result_hint_icon.svg";
import {  IGreenChemistryTabStructure, ISustainableTabStructure, ITabInfoSustainable } from "../../../structures/result";

interface ICardsSectionProps {
tabSectionData: ISustainableTabStructure | IGreenChemistryTabStructure;
  setCurrentSection: (section: string) => void;
  totalScore?: string; // Optional prop for any additional customization
}

const CardsSection: React.FC<ICardsSectionProps> = ({
  tabSectionData,
  setCurrentSection,
  totalScore,
}: ICardsSectionProps) => {
    
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };
  const sectionData: ITabInfoSustainable[] = Object.values(
    tabSectionData
  );
  return (
    <>
      <div className="sustainable-card-container">
        <div className="hint-section">
          <div className="hint-row">
            <img src={result_hint_icon} alt="Hint Icon" className="hint-icon" />
            {/*yellow color icon*/}
            <div className="hint-text">
              <span>Which area should I focus on?</span>
            </div>
          </div>
          <p className="subtext">
            Explore each tab to dive deeper into your data and uncover valuable
            insights to drive informed decisions.
          </p>
        </div>
        <div className="tabs-section">
          {sectionData.map((tab, index) => (
           
            <TabsDesign
            key={index+1}
            tab={tab}
            total_score={totalScore}
            index={index}
            selectedTab={selectedTab}
            handleTabClick={handleTabClick}
            setCurrentSection={setCurrentSection}
          />
          ))}
        </div>
        {totalScore=='green'?'':
        <div className="subtext">
          Please note that the scores displayed cover all packaging received by
          the Consumer i.e. Primary and Secondary packaging.
        </div>
}
      </div>

      <div className="divider-section" style={{ margin: "24px -34px" }}>
        <Divider orientation="horizontal" variant="middle" />
      </div>
    </>
  );
};

export default CardsSection;
