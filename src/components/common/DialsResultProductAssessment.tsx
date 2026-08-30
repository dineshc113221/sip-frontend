import React, { useState, useEffect, useContext, useCallback } from "react";
import PieChartDials from "../common/PieChartDials";
import lock_out_warning from "../../assets/images/lock-out-warning.svg";
import great_job from "../../assets/images/large_great_job.svg";
import dials_without_data from "../../assets/images/dials_without_data.svg";
import dataInCompleteIcon from "../../assets/images/dataInCompleteIcon.svg";
import formulationEmpty from "../../assets/images/formulationEmpty.svg";
import ideaIcon from "../../assets/images/idea.svg";
import calculationFailed from "../../assets/images/calculationFailed.svg";
import small_arrow from "../../assets/images/small_arrow.svg";
import innovation_result from  "../../assets/images/innovation_result.svg";
import {
  ProductEnvironmentalFootprint_series0,
  CarbonFootprint_series0,
  GreenChemistry_series0,
  SustainablePackaging_series0,
  ProductEnvironmentalFootprintFlipcardDescription,
  SustainablePackagingFlipcardDescription,
  GreenChemistryFlipcardDescription,
  CarbonFootprintFlipcardDescription,
} from "../../constants/PieChartDials.constant";
import { useNavigate,useLocation } from "react-router-dom";
import result_arrow_full_small_left from "../../assets/images/result_arrow_full_small_left.svg";
import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import {
  DialsResultProductAssessmentProps,
  IPieChartJSONSeries1,
} from "../breadcrumb/types";
import "../../assets/css/ProductAssessment.scss";
import { TrackGoogleAnalyticsEvent } from "./TrackGoogleAnalyticsEvent";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { useConsumerPackagingContext } from "../consumer-packaging-tab";
import { CircularProgress, Box } from '@mui/material';

const DialsResultProductAssessment: React.FC<
  DialsResultProductAssessmentProps
> = (props) => {
  const navigate = useNavigate();
const { assessmentsData, newChangesInFormulation, isBaselinePresent,isBaselineSkipped } = useContext(ProductDataContext);
  const {
     allFlagsCalculated, isCalculationUpdatedPackaging, allCalculated
  } = useConsumerPackagingContext();
  const {
    productEnvironmentalFootprintData,
    carbonFootprintData,
    sustainablePackagingData,
    greenChemistryData,
  } = useContext(ResultDataContext);
  const [dialStatus, setDialStatus] = React.useState("look_out");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { loggedInUser } = useGlobaldata();

const { pathname } = useLocation();
const isViewAllResults = pathname.includes("/view-all-results") ?? false;


  const loginUserName = React.useMemo(() => {
    return (
      loggedInUser?.displayName
    );
  }, [loggedInUser?.displayName]);
  // Add useEffect to check data availability

 
  const handleCardClick = async (assessmentsData) => {
    // Prevent navigation if there's a text selection
    if (window.getSelection().toString()) {
      return;
    }

    // Construct the navigation path
    const pagePath = `/view-all-results/${assessmentsData.assessmentId}`;

    // Track the analytics event
    await TrackGoogleAnalyticsEvent("PAGE_VIEW", "View All Results", {
      loginUserName,
      PAGE_VIEW: pagePath,
    });

    // Navigate to the page
    navigate(pagePath);
  };

  const [
    productEnvironmentalFootprintSeries1,
    setProductEnvironmentalFootprintSeries1,
  ] = useState<IPieChartJSONSeries1[]>(
    productEnvironmentalFootprintData?.dials?.PieChartJSONSeries1
  );

  const [carbonFootprintSeries1, setCarbonFootprintSeries1] = useState<
    IPieChartJSONSeries1[]
  >(carbonFootprintData?.dials?.PieChartJSONSeries1);

  const [sustainablePackagingSeries1, setSustainablePackagingSeries1] =
    useState<IPieChartJSONSeries1[]>(
      carbonFootprintData?.dials?.PieChartJSONSeries1
    );
  const [greenChemistrySeries1, setGreenChemistrySeries1] =
    useState<IPieChartJSONSeries1[]>(
      greenChemistryData?.dials?.PieChartJSONSeries1
    );

  useEffect(() => {

    setProductEnvironmentalFootprintSeries1(

      productEnvironmentalFootprintData?.dials?.PieChartJSONSeries1 || []

    );

    setCarbonFootprintSeries1(

      carbonFootprintData?.dials?.PieChartJSONSeries1 || []

    );

    setSustainablePackagingSeries1(

      sustainablePackagingData?.dials?.PieChartJSONSeries1 || []

    );

    setGreenChemistrySeries1(

      greenChemistryData?.dials?.PieChartJSONSeries1 || []

    );

  }, [

    productEnvironmentalFootprintData?.dials?.PieChartJSONSeries1,

    carbonFootprintData?.dials?.PieChartJSONSeries1,

    sustainablePackagingData?.dials?.PieChartJSONSeries1,

    greenChemistryData?.dials?.PieChartJSONSeries1,

  ]);


  const getDialStatus = useCallback(() => {

    const scores = [

      productEnvironmentalFootprintData?.dials?.pie_chart_sub_title,

      carbonFootprintData?.dials?.pie_chart_sub_title,

      greenChemistryData?.dials?.pie_chart_sub_title,

      sustainablePackagingData?.dials?.pie_chart_sub_title,

    ];

    if (

      scores.some((score) => score === "Poor" || score === "Very Poor") ||

      scores.every((score) => score === "No Improvement")

    ) {

      return "look_out";

    }

    if (

      scores.some((score) => score === "Good" || score === "Excellent") &&

      scores.every(

        (score) =>

          score === "No Improvement" || score === "Good" || score === "Excellent"

      )

    ) {

      return "great_job";

    }

    return dialStatus;

  }, [

    productEnvironmentalFootprintData,

    carbonFootprintData,

    greenChemistryData,

    sustainablePackagingData,

    dialStatus,

  ]);



  useEffect(() => {

    setDialStatus(getDialStatus());

  }, [getDialStatus]);



  // Helper function to split and highlight a message
  const splitAndHighlightMessage = (message: string) =>
    message.split(/(Oops! Something went wrong)/g).map((part) =>
      part === "Oops! Something went wrong" ? (
        <strong key="highlight">{part}</strong>
      ) : (
        part
      )
    );

  // Helper function to make email clickable
  const makeEmailClickable = (parts: (string | JSX.Element)[]) =>
    parts.map((part) =>
      typeof part === "string" && part.includes("SIPport@kenvue.com") ? (
        <React.Fragment key={`email`}>
          {part.split(/(SIPport@kenvue\.com)/g).map((subPart) =>
            subPart === "SIPport@kenvue.com" ? (
              <a
                style={{ color: "inherit" }}
                key={`link`}
                href={`mailto:${subPart}`}
                className="email-link"
              >
                {subPart}
              </a>
            ) : (
              subPart
            )
          )}
        </React.Fragment>
      ) : (
        part
      )
    );

  // Helper function to format a message
  const formatMessage = (message: string) => {
    if (!message) return "";
    const highlightedParts = splitAndHighlightMessage(message);
    return makeEmailClickable(highlightedParts);
  };

  const renderWithoutBaseLineResult = () => {
    return (
      <div className="dials_without_baseline_data_div1">
        <div className="dials_without_data_div2">
          <div className="dials_without_data_div2_1">
            <img src={formulationEmpty} alt="SIP" />

          </div>
        </div>

        {/* Show specific error-related label or "Nothing here yet!" */}
        <div className="dials_without_data_label1" data-testid="error-message-label">Product results are ready to be viewed </div>

        <div className="dials_without_data_baseline_wrapper">
          <div className="dials_without_data_baseline_message">
            Your product has been successfully analyzed and results are ready to explore.<br />
            <span
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "4px", // increase for more space
              }}
            >
              Note
            </span>: You skipped adding a baseline assessment, so comparative scores will not be available.
          </div>

        </div>
        <button type="button" className="dials_without_data_baseline_label" onClick={() => handleCardClick(assessmentsData)}> View single product results <img src={small_arrow} style={{ position: "relative", top: "3px" }} alt="arrow"/> </button>
      </div>
    );
  }

   const renderWithoutBaseLineInnovationResult = () => {
    return (
      <div className="dials_without_baseline_data_div1 dials_without_baseline_innovation_div1">
        <div className="dials_without_data_div2">
          <div className="dials_without_data_div2_1">
            <img src={innovation_result} alt="SIP" />

          </div>
        </div>

        {/* Show specific error-related label or "Nothing here yet!" */}
        <div className="dials_without_data_label1" data-testid="error-message-label">See below for innovation results evaluation.  </div>

        <div className="dials_without_data_baseline_wrapper dials_without_data_baseline_innovation_wrapper">
          <div className="dials_without_data_baseline_message">
            To see comparative scores, a completed baseline assessment is required.<br />
            </div>

        </div>
      </div>
    );
  }
  // Main render function
  const renderDialsWithoutData = () => {
    const messagedials = props?.dials_without_data_show_msg;
    const isErrorMessage = messagedials?.includes("Oops! Something went wrong");
    const isBaselineErrorMessage = messagedials?.includes(
      "Oops! Something went wrong in the baseline calculation"
    );

    const getErrorMessage = () => {
      if (isBaselineErrorMessage) {
        return "Oops! Something went wrong in the baseline calculation";
      }
      if (isErrorMessage) {
        return "Oops! Something went wrong";
      }
      if (assessmentsData?.isBaselineCalcUpdated && allFlagsCalculated) return "New changes made";
      return "Nothing here yet!";
    };

    let filteredMessage = <span>{formatMessage(messagedials
      ?.replace(
        /(Oops! Something went wrong in the baseline calculation\.|Oops! Something went wrong\.?)/,
        ""
      )
      .trim())}</span>;
      
    if (assessmentsData?.isBaselineCalcUpdated && !isErrorMessage && isBaselinePresent && allFlagsCalculated) {
      if (newChangesInFormulation?.isCalculated === false || isCalculationUpdatedPackaging || !allCalculated ) {
        filteredMessage = <span>Please re-calculate this assessment to see updated scores.</span>
      } else {
        filteredMessage = <div style={{ display: "flex", flexDirection: "column", fontFamily: "kenvue-sans-regular", paddingTop: "24px" }}>
          <span>Changes were made in the Baseline.</span>
          <span>Please re-calculate this assessment to view updated results </span>
        </div>;
      }
    }

    return (
      <div className="dials_without_data_div1">
        <div className="dials_without_data_div2">
          <div className="dials_without_data_div2_1">
            {isErrorMessage ? (
              <img src={calculationFailed} alt="Calculation Failed" />
            ) : (
              <img src={dials_without_data} alt="SIP" />
            )}
          </div>
        </div>

        {/* Show specific error-related label or "Nothing here yet!" */}
        <div className="dials_without_data_label1" data-testid="error-message-label">{getErrorMessage()}</div>

        <div className="dials_without_data_wrapper">
          <div className="dials_without_data_message">
            {filteredMessage}
          </div>
        </div>
      </div>
    );
  };




  const renderViewResultButton = () => (

    <div className="pie_chart_main_div_view_result">

      <button

        style={{

          cursor: "pointer",

          border: "none",

          backgroundColor: "transparent",

          fontFamily: "kenvue-sans-regular",

          color: "#000",

        }}

        onClick={() => handleCardClick(assessmentsData)}

      >

        View All Results

      </button>

    </div>

  );



  const renderBackToAssessmentButton = () => (

    <div className="result_back_to_assessment">

      <div style={{ display: "flex", alignItems: "center" }}>

        <button

          style={{

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            background: "none",

            border: "none",
            fontFamily: "kenvue-sans-regular",
            color: '#000000'
          }}

          onClick={() => navigate(`/product-assessment/${assessmentsData.assessmentId}`)}

        >

          <img

            src={result_arrow_full_small_left}

            alt="Back Arrow"

            style={{ marginRight: "8px", marginLeft: "-14px" }}

          />Back to Assessment

        </button>

      </div>

    </div>

  );



  const renderAssessmentLabel = () => {

    if (dialStatus === "great_job") {
      return (
        <div className="pie_chart_great_jon_div">

          <div>

            <img src={great_job} alt="SIP" />

          </div>

          <div className="pie_chart_lock_out_label1">Great Job!</div>

          <div className="pie_chart_lock_out_label2">

            This product meets Kenvue's sustainable product innovation commitment.

          </div>

        </div>
      );
    }

    if (!isBaselineSkipped) {
      return (
        <div className="pie_chart_lock_out_div">

          <div>

            <img src={lock_out_warning} alt="SIP" />

          </div>

          <div className="pie_chart_lock_out_label1">Look out!</div>

          <div className="pie_chart_lock_out_label2">

            This product does not meet Kenvue's sustainable product innovation commitment. Can you identify the driver(s) and consider how we might improve the product's sustainability?

          </div>

        </div>
      );
    }

    return null;

  };



  const renderPieChartDials = () => {

    const pieCharts = [

      { data: productEnvironmentalFootprintSeries1, title: "Product Environmental Footprint", subTitle: productEnvironmentalFootprintData.dials.pie_chart_sub_title, percentage: productEnvironmentalFootprintData.dials.pie_chart_percentage, series0: ProductEnvironmentalFootprint_series0, series1: productEnvironmentalFootprintSeries1, description: ProductEnvironmentalFootprintFlipcardDescription, tabIndex: 1 },

      { data: carbonFootprintSeries1, title: "Product Carbon Footprint", subTitle: carbonFootprintData.dials.pie_chart_sub_title, percentage: carbonFootprintData.dials.pie_chart_percentage, series0: CarbonFootprint_series0, series1: carbonFootprintSeries1, description: CarbonFootprintFlipcardDescription, tabIndex: 2 },

      { data: greenChemistrySeries1, title: "Green Chemistry", subTitle: greenChemistryData.dials.pie_chart_sub_title, percentage: greenChemistryData.dials.pie_chart_percentage, series0: GreenChemistry_series0, series1: greenChemistrySeries1, description: GreenChemistryFlipcardDescription, tabIndex: 3 },

      { data: sustainablePackagingSeries1, title: "Packaging Circularity", subTitle: sustainablePackagingData?.dials?.pie_chart_sub_title ?? "", percentage: sustainablePackagingData?.dials?.pie_chart_percentage ?? "", series0: SustainablePackaging_series0, series1: sustainablePackagingSeries1, description: SustainablePackagingFlipcardDescription, tabIndex: 4 }

    ];

    return pieCharts.map((chart, index) => (

      chart.data !== undefined && (

        <PieChartDials

          key={index + 1}

          chartDivIndex={(index + 1).toString()}

          title={chart.title}

          sub_title={chart.subTitle}

          pie_chart_percentage={chart.percentage}

          data_series0={chart.series0}

          data_series1={chart.series1}

          flipcard_description={chart.description}

          selectedpiechart={props.selectedtab === chart.tabIndex ? "selected" : undefined}

        />


      )

    ));

  };

  const renderIncompleteDataMessage = () => (

    <div

      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "12px",
      }}

    >

      <img src={dataInCompleteIcon} alt="Data incomplete" />

      <span style={{ fontFamily: "kenvue-sans-regular", fontSize: "16px" }}>

        There are one or more incomplete packaging components that are not included in the results.

      </span>

    </div>

  );


  useEffect(() => {

    // Simulating data fetch or processing time

    const timeout = setTimeout(() => {

      setIsLoading(false); // Stop the loader after rendering

    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timeout); // Clean up the timeout

  }, []);
  const renderRecalculateMessage = (message: string) => (

    <div

      style={{

        display: "flex",

        justifyContent: "flex-end",

        alignItems: "center",

        gap: "12px",

      }}

    >

      <img src={ideaIcon} alt="Data incomplete" />

      <span style={{ fontFamily: "kenvue-sans-regular", fontSize: "16px" }}>

        {message}

      </span>

    </div>

  );
   
const getResultContent = () => {
  if (!isBaselineSkipped) {
    return renderPieChartDials();
  }

  return isViewAllResults
    ? renderWithoutBaseLineInnovationResult()
    : renderWithoutBaseLineResult();
};

const resultContent = getResultContent();
const getNavigationContent = () => {
  if (props.page !== "product-assessment") {
    return renderBackToAssessmentButton();
  }

  return !isBaselineSkipped
    ? renderViewResultButton()
    : null;
};

const content = getNavigationContent();


    return (
      <div className="pie_chart_main_div">
        {isLoading ? (
          <Box className="loaderCss" display="flex" justifyContent="center" alignItems="center" >
            <CircularProgress sx={{ color: '#00b097' }} />
          </Box>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>


            {props.dials_without_data_show === "yes" || (assessmentsData?.isBaselineCalcUpdated && allFlagsCalculated) ? (
              renderDialsWithoutData()
            ) : (
              <>
                {content}

                <div className="assessmentLabel">
                  {renderAssessmentLabel()}
                  {resultContent}{/* Render pie charts when done */}
                </div>

                {!assessmentsData.isPackagingDataCompleted ? (
                  renderIncompleteDataMessage()
                ) : (
                  (!allCalculated ||
                    newChangesInFormulation?.isCalculated === false ||
                    isCalculationUpdatedPackaging) && renderRecalculateMessage("New changes made. Please recalculate to see updated scores")
                )}
              </>
            )}

          </div>

        )}
      </div>
    );
  };

export default DialsResultProductAssessment;
