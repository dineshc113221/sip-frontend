import React, { useContext } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import full_arrow_right_small from "../../assets/images/full_arrow_right_small.svg";
import arrow_full_small_red from "../../assets/images/arrow_full_small_red.svg";
import arrow_full_small_down_green from "../../assets/images/arrow_full_small_down_green.svg";
import { ResultSection1Prop } from "../breadcrumb/types";
import "../../assets/css/result-page.scss";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";

const ResultSection1: React.FC<ResultSection1Prop> = (props) => {
  const {  isBaselineSkipped } = useContext(ProductDataContext);
  
  const handleSelected = (selectedIndex: number) => {
    const threadLinks = Array.from(
      document.querySelectorAll("[class*=result_section1_card]")
    );

    threadLinks.forEach((tl: Element, index: number) => {
      tl.classList.remove("selected_result_section1_card");
      if (index + 1 === selectedIndex) {
        tl.classList.add("selected_result_section1_card");
      }
    });
  };

  const onClickSeeDetails = () => {
    props.handleSectionChange(props.sectionName);
  };

  const percentage = props?.percent?.percentage ?? 0;

  let arrowImage = null;

  const roundedPercentage = Math.round(percentage);
  if (roundedPercentage > 0) {
    arrowImage = arrow_full_small_red;
  } else if (roundedPercentage < 0) {
    arrowImage = arrow_full_small_down_green;
  }
  const formattedPercentage =
    roundedPercentage >= 0 ? `+${roundedPercentage}` : roundedPercentage;


  return (
    <Card
      key={props.indexSection1}
      variant="outlined"
      onClick={() => {
        handleSelected(parseInt(props.indexSection1));
        onClickSeeDetails();
      }}
      className={`result_section1_card ${
        props.indexSection1 === "1" && " selected_result_section1_card"
      }`}
    >
      <CardContent className="result1-card-section">
        <div>
          <Typography className="result_section1_typography1">
            {props.title}
          </Typography>
          <Typography className="result_section1_typography2">
            <>
              {!isBaselineSkipped ? (
                <>
                  {formattedPercentage}%{" "}
                  {arrowImage &&  <img alt="result" src ={ arrowImage }/>}
                </>
              ) : (
                <>--</>
              )}
            </>

            
           
          </Typography>
          <div className="result1-card-content">
            <div className="result1-card-column">
              <Typography className="result-product">
                <div className="dot_grey_small_baseline_result_page">
                  &nbsp;
                </div>
                Baseline Product
              </Typography>
              <Typography className="result1_section1_typography3">
                 <>
              {!isBaselineSkipped ? (
                <>
                {props?.percent?.baseline
                  ? props?.percent?.baseline.toFixed(2)
                  : "0.00"}{" "}
                {props.currentTab === "CARBON_FOOTPRINT"
                  ? " gCO2 eq"
                  : " points"}
                </>
              ) : (
                <>N/A</>
              )}
            </>

              </Typography>
            </div>

            <div className="result1-card-column">
              <Typography className="result-product">
                <div className="dot_grey_small_myproduct_result_page">
                  &nbsp;
                </div>
                My Product
              </Typography>
              <Typography className="result1_section1_typography3">
                {(props?.percent?.myproduct ?? 0).toFixed(2)}{" "}
                {props.currentTab === "CARBON_FOOTPRINT"
                  ? " gCO2 eq"
                  : " points"}
              </Typography>
            </div>
          </div>
        </div>

        <button
          style={{
            display: "flex",
            padding: "10px 5px",
            background: "none",
            border: "none",
            alignItems: "center",
          }}
          type="button"
        >
          <Typography
            sx={{
              fontFamily: "kenvue-sans-regular",
              fontWeight: "400",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            See Details
          </Typography>
          <img
            src={full_arrow_right_small}
            style={{ marginLeft: "8px" }}
            alt="Arrow"
          />
        </button>
      </CardContent>
    </Card>
  );
};

export default ResultSection1;
