import React from "react";
import result_hint_icon from "../assets/images/result_hint_icon.svg";
import BootstrapTooltipComponent from "../components/common/BootstrapTooltipComponent";
import { TOTAL_PRODUCT_PEF_CONTENT, FORMULATION_PEF_CONTENT, CONSUMER_PACKAGING_PEF_CONTENT, TOTAL_PRODUCT_CF_CONTENT, FORMULATION_CF_CONTENT, CONSUMER_PACKAGING_CF_CONTENT, TOTAL_PRODUCT_PEF, FORMULATION_PEF, CONSUMER_PACKAGING_PEF, TOTAL_PRODUCT_CF, FORMULATION_CF, CONSUMER_PACKAGING_CF } from "../components/results/strings";
import "../assets/css/result-page.scss";
export const ResultHTMLContents1: React.FC = () => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="result_section1_sub_div1">
          <img src={result_hint_icon} alt="" />
        </div>
        <div className="result_section1_sub_label1">
          Which area should I focus on?
        </div>
      </div>
      <div className="result_section1_sub_label2">
        Explore each tab to dive deeper into your data and uncover valuable
        insights to drive informed decisions.
      </div>
    </>
  );
};

export const ResultHTMLContents2 = () => {
  return (
    <div>
      Please note that the results shown exclude the consumer use phase and impact of rinsed water treatment.
      Results are displayed per functional unit (e.g. per dose of product).
    </div>
  );
};

export const ResultHTMLContents3 = (
  varCurrentTab: string,
  currentSection: string
) => {
  const getFootprintText = () => {
    if (varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT") {
      switch (currentSection) {
        case "TOTAL_PRODUCT":
          return "product life cycle stages";
        case "FORMULATION":
          return "raw materials in the formulation";
        case "CONSUMER_PACKAGING":
          return "packaging components and materials";
        default:
          return "Product Environmental Footprint"; // default to general text if no match
      }
    } else {
      switch (currentSection) {
        case "TOTAL_PRODUCT":
          return "product life cycle stages";
        case "FORMULATION":
          return "raw materials in the formulation";
        case "CONSUMER_PACKAGING":
          return "packaging components and materials";
        default:
          return "Product Carbon Footprint"; // default to general text if no match
      }
    }
  };
  const getMainContent = () => {
    if (varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT") {
      switch (currentSection) {
        case "TOTAL_PRODUCT":
          return TOTAL_PRODUCT_PEF;
        case "FORMULATION":
          return FORMULATION_PEF;
        case "CONSUMER_PACKAGING":
          return CONSUMER_PACKAGING_PEF;
        default:
          return "Default PEF Content";
      }
    } else if (varCurrentTab === "CARBON_FOOTPRINT") {
      switch (currentSection) {
        case "TOTAL_PRODUCT":
          return TOTAL_PRODUCT_CF;
        case "FORMULATION":
          return FORMULATION_CF;
        case "CONSUMER_PACKAGING":
          return CONSUMER_PACKAGING_CF;
        default:
          return "Default CF Content";
      }
    }
    return "Default Content";
  };
  const getContent = () => {
    if (varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT") {
      switch (currentSection) {
        case "TOTAL_PRODUCT":
          return TOTAL_PRODUCT_PEF_CONTENT;
        case "FORMULATION":
          return FORMULATION_PEF_CONTENT;
        case "CONSUMER_PACKAGING":
          return CONSUMER_PACKAGING_PEF_CONTENT;
        default:
          return "Default PEF Content";
      }
    } else if (varCurrentTab === "CARBON_FOOTPRINT") {
      switch (currentSection) {
        case "TOTAL_PRODUCT":
          return TOTAL_PRODUCT_CF_CONTENT;
        case "FORMULATION":
          return FORMULATION_CF_CONTENT;
        case "CONSUMER_PACKAGING":
          return CONSUMER_PACKAGING_CF_CONTENT;
        default:
          return "Default CF Content";
      }
    }
    return "Default Content";
  };

  return (
    <div className="main">
      <div className="result1_section2_div1">

        {((varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT") &&
          (currentSection === "FORMULATION" || currentSection === "CONSUMER_PACKAGING")) ? (
          <>
            Which {getFootprintText()} have the highest <span className="insert-break"></span>
          </>
        ) : (
          <>
            Which {getFootprintText()} have <span className="insert-break"></span> the highest{" "}
          </>
        )}

        {varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
          ? "Product Environmental Footprint"
          : "Product Carbon Footprint"}
        ?
        <span className="spanResult" style={{ marginLeft: "5px" }}>
          <BootstrapTooltipComponent
            title={
              varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
                ? "Product Environmental Footprint"
                : "Product Carbon Footprint"
            }
            subtitle={`Which ${getFootprintText()} have the highest ${varCurrentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
              ? "Product Environmental Footprint"
              : "Product Carbon Footprint"
              }?`}
          />
        </span>
      </div>
      <div className="kenvueField">

        <div className="content">
          <span className="kenvueDirection">Kenvue's Direction: </span>
          <span className="mainContent" style={{
            fontFamily: "kenvue-sans-regular",
            fontWeight: 400,
            fontSize: "13.33px",
            letterSpacing: " 0.00938em",
            lineHeight: "19.99px",


          }}>
            {getMainContent()}
          </span>
        </div>

        <div>
          <span className="KenvueText"
            style={{
              fontFamily: "kenvue-sans-regular",
              fontWeight: 400,
              fontSize: "13.33px",
              letterSpacing: " 0.00938em",
              lineHeight: "19.99px",


            }}
          >{getContent()}</span>
        </div>
      </div>
    </div>
  );
};
