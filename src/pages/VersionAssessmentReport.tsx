/* eslint-disable */
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useFetchVersionBasedResult } from "../hooks/useVersionAssessmentResult";
import { calculateFootprintTabs, capitalizeFirstLetter, extractDialData, getRawMaterialDataFormulation } from "../helper/GenericFunctions";
import { FootprintStructure, IGreenChemistryStructure, ISustainableStructure } from "../structures/result";
import { CarbonFootprint_series0, CarbonFootprintFlipcardDescription, GreenChemistry_series0, GreenChemistryFlipcardDescription, ProductEnvironmentalFootprint_series0, ProductEnvironmentalFootprintFlipcardDescription, SustainablePackaging_series0, SustainablePackagingFlipcardDescription } from "../constants/PieChartDials.constant";
import { Alert, AlertTitle, Box, CircularProgress, Stack, styled, Typography } from "@mui/material";
import sip_logo from "../assets/images/Sustainable-Innovation-Tool-Logo-With-Endorsement-Line.svg";
import "../assets/css/version-history-report-dashboard.css";
import { useGetProductAssessmentDetailByID, useGetProductDetailByID } from "../hooks/UseGetProductDetails";
import lock_out_warning from "../assets/images/lock-out-warning.svg";
import great_job from "../assets/images/large_great_job.svg";
import arrow_full_small_red from "../assets/images/arrow_full_small_red.svg";
import arrow_full_small_down_green from "../assets/images/arrow_full_small_down_green.svg";
import { PieChartDialsProps } from "../components/breadcrumb/types";
import warning_dials from "../assets/images/warning_dials.svg";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dials_without_data from "../assets/images/dials_without_data.svg";
import calculationFailed from "../assets/images/calculationFailed.svg";
import { TabValueRow } from "../components/results/commonComponents/TabsDesign";
import { ASSESSMENT_TYPE } from "../constants/String.constants";

const StyledTypography = styled(Typography)`
    font-family: kenvue-sans-regular;
    font-size: 13.33px;
`;

const getFormulationPackagingFormattedValue = (percentage: any) => {
    let arrowImage = null;

    const roundedPercentage = Math.round(percentage);
    if (roundedPercentage > 0) {
        arrowImage = arrow_full_small_red;
    } else if (roundedPercentage < 0) {
        arrowImage = arrow_full_small_down_green;
    }
    const formattedPercentage =
        roundedPercentage >= 0 ? `+${roundedPercentage}` : roundedPercentage;
    return <span>
        <div style={{ display: "flex", alignItems: "center", fontSize: "23.04px", paddingRight: arrowImage ? "0" : "10px" }}>
            {formattedPercentage}% {arrowImage && <img src={arrowImage} alt="Arrow" style={{ marginLeft: "10px" }} />}
        </div>
    </span>
}

const MetricRow: React.FC<{ label: string; value: any; description: string; heading: string, id?: any }> = ({ label, value, description, heading, id }) => (
    <>
        <div className="version-content-header-spaced" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: id == "carbonFootprintData" && heading == "Consumer Packaging" ? "24px" : "5px" }}>
            <span>{label}</span>
            {(heading == "Formulation" || heading == "Consumer Packaging") && getFormulationPackagingFormattedValue(value)}
            {heading == "Recyclability Disruptors" && <span>
                <div style={{ display: "flex", alignItems: "center", fontSize: "23.04px" }}>
                    {value}
                </div>
            </span>}
            {(heading != "Formulation" && heading != "Consumer Packaging" && heading != "Recyclability Disruptors") && <TabValueRow percentage={value} heading={heading} total_score={""} assesmentReport={true} />}
        </div>
        <StyledTypography className="version-content-content" style={{ paddingTop: "5px" }}>{description}</StyledTypography>
    </>
);

const StatusAlert: React.FC<{ severity: "success" | "warning"; iconSrc: string; title: string; message: string; iconStyle?: React.CSSProperties }> = ({ severity, iconSrc, title, message, iconStyle }) => (
    <Stack sx={{ width: '100%', overflow: "hidden !important", marginBottom: "16px" }} spacing={2} className="alert-text-version">
        {severity === "success" && <ToastContainer />}
        <Alert icon={false} severity={severity} className={`version-alert-lookout-${severity}`}>
            <AlertTitle style={{ width: "800px" }}>
                <div style={{ display: "flex", width: "100%", height: "30px" }}>
                    <div>
                        <img alt="assessment" src={iconSrc} style={iconStyle || { paddingRight: "10px" }} />
                    </div>
                    <div style={{ width: "80%", marginTop: severity === 'warning' ? "5px" : 0, paddingLeft: severity === 'warning' ? "10px" : 0 }}>
                        <span style={{ fontFamily: "kenvue-sans", fontSize: severity === 'success' ? "19.2px" : "15.2px", fontWeight: "700", color: "#000000" }}>
                            {title}
                        </span>
                    </div>
                </div>
            </AlertTitle>
            <span style={{ fontFamily: "kenvue-sans-regular", fontSize: "13.33px", fontWeight: "400", color: "#000000", paddingLeft: "50px", overflow: "hidden" }}>
                {message}
            </span>
        </Alert>
    </Stack>
);

const PieChart: React.FC<PieChartDialsProps> = (props: PieChartDialsProps) => {
    let imageSrc = "";
    if (props.sub_title === "Good" || props.sub_title === "Excellent") {
        imageSrc = great_job;
    } else if (props.sub_title === "Poor" || props.sub_title === "Very poor") {
        imageSrc = warning_dials;
    }

    React.useLayoutEffect(() => {
        const root = am5.Root.new(`version_chartdiv_${props.chartDivIndex}`);
        root.setThemes([am5themes_Animated.new(root)]);
        root._logo?.dispose();

        const chart = root.container.children.push(
            am5percent.PieChart.new(root, { startAngle: 180, endAngle: 360 })
        );

        chart.children.unshift(am5.Label.new(root, {
            text: `${props.sub_title}`,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            fontFamily: "kenvue-sans",
            x: am5.percent(50),
            centerX: am5.percent(50),
            y: am5.percent(80),
            centerY: am5.percent(80),
            paddingBottom: 0
        }));

        chart.children.unshift(am5.Picture.new(root, {
            width: 21.57,
            height: 21.59,
            src: imageSrc,
            y: am5.percent(100),
            centerY: am5.percent(100),
            x: am5.percent(50),
            centerX: am5.percent(50),
            marginBottom: 50.12,
        }));

        const createSeries = (data: any[], radiusSettings: any, colorKey: string) => {
            const series = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "rangeIndicator",
                    categoryField: "dialsIndicator",
                    legendLabelText: "actaulRangeIndicator",
                    startAngle: 180,
                    endAngle: 360,
                    y: am5.percent(-5),
                    ...radiusSettings
                })
            );

            const colors = (data || []).map(item => {
                const color = item[colorKey];
                return (color && /^#([0-9A-F]{3}){1,2}$/i.test(color)) ? am5.color(color) : am5.color("#000000");
            });

            const colorSet = am5.ColorSet.new(root, {
                colors: colors,
                passOptions: { lightness: -0.05, hue: 0 }
            });

            series.set("colors", colorSet);
            series.ticks.template.set("forceHidden", true);
            series.labels.template.set("forceHidden", true);
            series.slices.template.set("toggleKey", "none");
            series.data.setAll(data || []);
            return series;
        };

        createSeries(props.data_series0, { radius: am5.percent(60), innerRadius: am5.percent(47) }, "colors");
        createSeries(props.data_series1, { innerRadius: am5.percent(70) }, "colors_series1");

        const showPercentage = (props.title !== 'Packaging Circularity' && props.title !== "Green Chemistry") ? "%" : "";

        chart.seriesContainer.children.push(
            am5.Label.new(root, {
                textAlign: "center",
                centerY: am5.percent(100),
                centerX: am5.p50,
                text: `\n[bold fontSize:18px]${(props.pie_chart_percentage === 'N/A') ? props.pie_chart_percentage : (props.pie_chart_percentage + showPercentage)}[/]`
            })
        );

        return () => {
            root.dispose();
        };
    }, [props, imageSrc]);

    return (
        <div id={`version_chartdiv_${props.chartDivIndex}`} className="versionpiechart"></div>
    );
};

const VersionAssessmentReport: React.FC = () => {
    const { productId, assessmentType, assessmentId, versionNumber } = useParams();
    const { data: productData } = useGetProductDetailByID(productId);
    const { data: assessmentdata } = useGetProductAssessmentDetailByID(assessmentId, assessmentType);
    const [headerData, setHeaderData] = useState<any>(assessmentdata);
    const [productState, setProductState] = useState<any>(productData);

    useEffect(() => {
        if (assessmentdata?.length) setHeaderData(assessmentdata[0]);
    }, [assessmentdata]);

    useEffect(() => {
        if (productData?.length) setProductState(productData[0]);
    }, [productData]);

    const { data: versionBasedResult, isFetching, error: versionDataFetchError } = useFetchVersionBasedResult({
        productId: productId,
        assessmentId: assessmentId,
        versionNumber: versionNumber,
        assessmentType: assessmentType
    });

    const defaultDials = {
        PieChartJSONSeries1: [
            { actaulRangeIndicator: "", colors_series1: "", dialsIndicator: "", rangeIndicator: 0, data_series1: "" },
            { actaulRangeIndicator: "", colors_series1: "", dialsIndicator: "", rangeIndicator: 0, data_series1: "" },
        ],
        pie_chart_percentage: "0",
        pie_chart_sub_title: "",
        total_lifecycle_total_pef_excluding_use_phase_functional_unit: 0,
    };

    const defaultTabs = {
        totalProduct: { percentage: 0, myproduct: 0, baseline: 0 },
        formulation: { percentage: 0, myproduct: 0, baseline: 0 },
        packaging: { percentage: 0, myproduct: 0, baseline: 0 },
    };

    const initialFootprintStructure = {
        totalProduct: { barData: [] },
        formulation: [],
        packaging: {},
        dials: defaultDials,
        tabs: defaultTabs,
    };

    const [productEnvironmentalFootprintData, setProductEnvironmentalFootprintData] = useState<FootprintStructure>(initialFootprintStructure);
    const [carbonFootprintData, setCarbonFootprintData] = useState<FootprintStructure>(initialFootprintStructure);
    const [sustainablePackagingData, setSustainablePackagingData] = useState<ISustainableStructure>({
        pcrContent: { dialData: { baseline: "0", myproduct: "0", per_pcr_diff: "0" }, pcrTableData: {} },
        materialEfficiency: { barData: { baseline: "0", myproduct: "0" }, detailedData: [] },
        recycleReady: { barData: [], detailedData: [] },
        disruptors: { baselineProduct: {}, myproduct: {}, watchOut: "" },
        dials: defaultDials,
        tabs: {
            totalScore: { heading: "Total Score", percentage: 30 },
            pcrContent: { heading: "PCR Content", percentage: "0", myproduct: "0", baseline: "0" },
            materialEfficiency: { heading: "Material Efficiency", percentage: "0", myproduct: "0", baseline: "0" },
            recycleReady: { heading: "Recycle Ready", percentage: "0", myproduct: "23", baseline: "32" },
            disruptors: { heading: "Recyclability Disruptors", percentage: "Pass", myproduct: "Pass", baseline: "Pass" },
        },
    });

    const [greenChemistryData, setGreenChemistryData] = useState<IGreenChemistryStructure>({
        renewableOriginBonus: {
            dialData: { baseline: "0", myproduct: "0", per_pcr_diff: "0" },
            robTableData: [{ rawMaterialTradeName: "", rawCode: "", baselineWeight: "0.00", baselineOrganic: "0.00", baselineRenewable: "0.00", myProductWeight: "0.00", myProductOrganic: "0.00", myProductRenewable: "0.00" }],
            totalPercent: { baselineOrganic: '0.00', baselineRenewable: '0.00', myproductOrganic: '0.00', myproductRenewable: '0.00' },
            regression: false
        },
        dials: defaultDials,
        tabs: {
            totalScore: { heading: "Total Score", percentage: "0", myproduct: "0", baseline: "0" },
            gaiaScore: { heading: "GAIA Score", percentage: "0", myproduct: "0", baseline: "0" },
            watchListScore: { heading: "Watch List Score", percentage: "0", myproduct: "0", baseline: "0" },
            renewableOriginBonus: { heading: "Renewable Origin Bonus", percentage: "0", myproduct: "0", baseline: "0" },
        },
        watchList: { baselineData: {}, myProductData: {}, max_watchlist_score_baseline: '0', max_watchlist_score_myproduct: '0' },
        gaiaScore: { baselineData: {}, myProductData: {} }
    });

    useEffect(() => {
        if (versionBasedResult?.data) {
            const data = versionBasedResult.data;
            const resultkey = assessmentType;

            // Helper to process PEF and Carbon Footprint similar logic
            const processFootprintLogic = (typeKey: "productEnvironmental" | "carbonFootprint", multiplier: number, tabKeys: any) => {
                const formulation = getRawMaterialDataFormulation(data[resultkey], data?.baseline, multiplier, typeKey);
                const dials = extractDialData(data[resultkey]?.totallca, data?.baseline?.totallca, typeKey);
                const tabs = calculateFootprintTabs(data, assessmentType, tabKeys, multiplier);
                return { formulation, dials, tabs };
            };

            const pefData = processFootprintLogic("productEnvironmental", 1000000, {
                totalProduct: "total_lifecycle_total_pef_excluding_use_phase_functional_unit",
                formulation: "total_formulation_TOTAL_PEF_functional_unit",
                packaging: "total_packaging_TOTAL_PEF_functional_unit",
            });
            setProductEnvironmentalFootprintData((prev) => ({ ...prev, ...pefData }));

            const cfData = processFootprintLogic("carbonFootprint", 1000, {
                totalProduct: "total_lifecycle_pre_normalization_excluding_use_phase.climate_change_functional_unit",
                formulation: "total_formulation_pre_normalization.climate_change_functional_unit",
                packaging: "total_packaging_pre_normalization.climate_change_functional_unit",
            });
            setCarbonFootprintData((prev) => ({ ...prev, ...cfData }));

            // Sustainable Packaging
            const dialSPPercentage = extractDialData(data?.[assessmentType] ?? {}, data?.baseline ?? {}, "sustainablePackaging");
            setSustainablePackagingData((prev) => ({ ...prev, dials: dialSPPercentage }));

            // Green Chemistry
            const dialGCPercentage = extractDialData(data?.[resultkey] ?? {}, data?.baseline ?? {}, "greenChemistry");
            const myProductScore = parseFloat(data?.[resultkey]?.watchlist?.watchlist_score) || 0;
            const baselineScore = parseFloat(data?.baseline?.watchlist?.watchlist_score) || 0;
            const myProductGaiaScore = data?.[resultkey]?.gaia_score?.step_8_fml_GAIA_score || 0;
            const baselineGaiaScore = data?.baseline?.gaia_score?.step_8_fml_GAIA_score || 0;
            const baselineGC = (data?.baseline?.renewable_feedback_stock?.renewable_feedstock_total) * 100;
            const myproductGC = (data?.[resultkey]?.renewable_feedback_stock?.renewable_feedstock_total) * 100;
            const per_rob_diff_GC = (myproductGC - baselineGC).toFixed(1);
            const per_gaia_score = ((myProductGaiaScore - baselineGaiaScore)).toFixed(2);
            const myProductWatchlistMaxScore = data?.[resultkey]?.watchlist?.max_watchlist_score || '0';
            const watchlistpercent = parseFloat(myProductWatchlistMaxScore) == 5 ? 'Fail' : (myProductScore - baselineScore).toFixed(1).toString() || '0';
            const myproducttotalscore = (data?.[resultkey]?.green_chemistry_rollup?.step_6_final_score_with_5_watchlist ?? 0).toFixed(2);
            const baselineTotalScore = (data?.[resultkey]?.baseline_green_chemistry_rollup?.step_5_final_score ?? 0).toFixed(2);
            let GCtotalScore = parseFloat(((myproducttotalscore - baselineTotalScore)).toFixed(0));
            GCtotalScore = isNaN(GCtotalScore) ? 0 : GCtotalScore;

            setGreenChemistryData((prevGCData) => ({
                ...prevGCData,
                dials: dialGCPercentage,
                tabs: {
                    ...prevGCData.tabs,
                    renewableOriginBonus: { ...prevGCData.tabs.renewableOriginBonus, percentage: per_rob_diff_GC || "0" },
                    watchListScore: { heading: 'Watch List Score', percentage: watchlistpercent },
                    gaiaScore: { heading: "GAIA Score", percentage: per_gaia_score },
                    totalScore: { heading: "Total Score", percentage: String(GCtotalScore) },
                },
            }));

            const getRelavantTotalRollUpPercentage = () => {
                    return assessmentType === ASSESSMENT_TYPE.FINAL_ASSESSMENT
                      ? data?.final?.["sustainablepackaging-rollup-compare"]
                        ?.Difference_Recycle_Ready
                      : data?.experimental?.["sustainablepackaging-rollup-compare"]
                        ?.Difference_Recycle_Ready;
        };

            // Sustainable Packaging Tabs Update
            setSustainablePackagingData((prevData) => ({
                ...prevData,
                tabs: {
                    ...prevData.tabs,
                    recycleReady: {
                        ...prevData.tabs.recycleReady,
                        percentage:
                            getRelavantTotalRollUpPercentage()?.toFixed(2)?.toString() + "%",
                    },
                    totalScore: { ...prevData.tabs.totalScore, percentage: data?.[resultkey]?.["sustainablepackaging-rollup-compare"]?.Final_Score_Disrupters ?? 0 },
                    disruptors: {
                        ...prevData.tabs.disruptors,
                        percentage: capitalizeFirstLetter(data?.[resultkey]?.["sustainablepackaging-recyclability-disruptors"]?.recyclability_disruptors_present_all_packaging_4_3 ?? "N/A")
                    },
                    materialEfficiency: {
                        ...prevData.tabs.materialEfficiency,
                        percentage: data?.[resultkey]?.["sustainablepackaging-rollup-compare"]?.Difference_Material_Efficiency ? parseFloat(data[resultkey]?.["sustainablepackaging-rollup-compare"]?.Difference_Material_Efficiency).toFixed().toString() : "0"
                    },
                    pcrContent: {
                        ...prevData.tabs.pcrContent,
                        percentage: data?.[resultkey]?.["sustainablepackaging-rollup-compare"]?.Difference_PCR_Content ? parseFloat(data[resultkey]?.["sustainablepackaging-rollup-compare"]?.Difference_PCR_Content).toFixed().toString() : "0"
                    },
                }
            }));
        }
    }, [versionBasedResult, isFetching, assessmentType]);

    const [dialStatus, setDialStatus] = useState("look_out");

    const getDialStatus = useCallback(() => {
        const scores = [
            productEnvironmentalFootprintData?.dials?.pie_chart_sub_title,
            carbonFootprintData?.dials?.pie_chart_sub_title,
            greenChemistryData?.dials?.pie_chart_sub_title,
            sustainablePackagingData?.dials?.pie_chart_sub_title,
        ];
        if (scores.some((score) => score === "Poor" || score === "Very Poor") || scores.every((score) => score === "No Improvement")) {
            return "look_out";
        }
        if (scores.some((score) => score === "Good" || score === "Excellent") && scores.every((score) => score === "No Improvement" || score === "Good" || score === "Excellent")) {
            return "great_job";
        }
        return dialStatus;
    }, [productEnvironmentalFootprintData, carbonFootprintData, greenChemistryData, sustainablePackagingData, dialStatus]);

    useEffect(() => {
        setDialStatus(getDialStatus());
    }, [getDialStatus]);

    useEffect(() => {
        if (versionDataFetchError) {
            toast.warning((versionDataFetchError as any)?.response?.data?.message || 'Something went wrong');
        }
    }, [versionDataFetchError]);

    const capitalizeLetter = (value: string) => {
        if (value == "PASS" || value == "FAIL") {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
        return value;
    };

    const renderAssessmentLabel = () => {
        if (dialStatus === "great_job") {
            return <StatusAlert severity="success" iconSrc={great_job} title="Great Job!" message="This product meets Kenvue's sustainable product innovation commitment." iconStyle={{ paddingRight: "10px", width: "48px", height: "48px" }} />;
        }
        return <StatusAlert severity="warning" iconSrc={lock_out_warning} title="Look out!" message="This product does not meet Kenvue's sustainable innovation commitment." iconStyle={{ paddingRight: "10px", width: "40px", height: "24px", marginTop: "20px" }} />;
    };

    const textConstants = {
        formulation: {
            productEnvironmentalFootprintData: "Assesses the product environmental footprint of formula raw materials during production and at end-of-life.",
            carbonFootprintData: "Assesses the carbon impact of formula raw materials during production and at end-of-life."
        },
        packaging: {
            productEnvironmentalFootprintData: "Assesses the product environmental footprint of  packaging materials during production and at end-of-life.",
            carbonFootprintData: "Assesses the carbon impact of packaging materials during production and at end-of-life."
        },
        greenChemistry: {
            gaia: "A measure of the potential environmental impacts on ingredients at the end of a product's life.",
            watchlist: "Flags ingredients for which there are new, emerging questions around human and/or environmental health.",
            renewableorigin: "The proportion of organic ingredients in the formula that are from a renewable origin."
        },
        packagingCircularity: {
            pcrContent: "Measures the proportion of post-consumer recycled material included in the packaging.",
            matEfficiency: "Measures the efficiency of the packaging structure by calculating the packaging weight per functional unit.",
            recycleReady: "Measures the proportion of packaging that has been designed to be 'recycle ready'",
            disrupters: "Flags the presence of packaging materials that are defined as 'recyclability disruptors'."
        },
        noteText: {
            productEnvironmentalFootprintData: "Note: The results shown exclude the consumer use phase and impact of rinsed water treatment. Results are displayed per functional unit (e.g. per dose of product).",
            carbonFootprintData: "Note: The results shown exclude the consumer use phase and impact of rinsed water treatment. Results are displayed per functional unit (e.g. per dose of product).",
            greenChemistry: "Note: The Renewable Origin bonus applies only when there is no regression in both the formula’s GAIA and Watch List scores.",
        }
    };

    const getContent = (chart: any) => {
        switch (chart.id) {
            case "productEnvironmentalFootprintData":
            case "carbonFootprintData":
                return (
                    <div className="version-history-content">
                        <MetricRow
                            label="Formulation"
                            heading="Formulation"
                            value={chart?.tabs?.formulation?.percentage}
                            description={textConstants.formulation[chart?.id]}
                        />
                        <MetricRow
                            label="Consumer Packaging"
                            heading="Consumer Packaging"
                            value={chart?.tabs?.packaging?.percentage}
                            description={textConstants.packaging[chart?.id]}
                            id={chart.id}
                        />
                    </div>
                );
            case "greenChemistry":
                return (
                    <div className="version-history-content">
                        <MetricRow
                            label="GAIA"
                            heading="GAIA Score"
                            value={chart?.data?.tabs?.gaiaScore?.percentage}
                            description={textConstants.greenChemistry.gaia}
                        />
                        <MetricRow
                            label="Watch List"
                            heading="Watch List Score"
                            value={chart?.data?.tabs?.watchListScore?.percentage}
                            description={textConstants.greenChemistry.watchlist}
                        />
                        <MetricRow
                            label="Renewable Origin"
                            heading="Renewable Origin Bonus"
                            value={chart?.data?.tabs?.renewableOriginBonus?.percentage}
                            description={textConstants.greenChemistry.renewableorigin}
                        />
                    </div>
                );
            case "packagingCircularity":
                return (
                    <div className="version-history-content">
                        <MetricRow
                            label="PCR Content"
                            heading="PCR Content"
                            value={chart?.data?.tabs?.pcrContent?.percentage + "%"}
                            description={textConstants.packagingCircularity.pcrContent}
                        />
                        <MetricRow
                            label="Material Efficiency"
                            heading="Material Efficiency"
                            value={chart?.data?.tabs?.materialEfficiency?.percentage + "%"}
                            description={textConstants.packagingCircularity.matEfficiency}
                        />
                        <MetricRow
                            label="Recycle Ready"
                            heading="Recycle Ready"
                            value={chart?.data?.tabs?.recycleReady?.percentage + "%"}
                            description={textConstants.packagingCircularity.recycleReady}
                        />
                        <MetricRow
                            label="Recyclability Disruptors"
                            heading="Recyclability Disruptors"
                            value={capitalizeLetter(chart?.data?.tabs?.disruptors?.percentage)}
                            description={textConstants.packagingCircularity.disrupters}
                        />
                    </div>
                );
            default:
                return <></>;
        }
    };

    const displayUsers = (users: any) => {
        if (!users) return;
        const maxLength = 58;
        if (users.length == 1 && users[0].name.length < maxLength) return users[0].name
        const userData: string = users.map((user: any) => user.name).join(",");
        if (userData.length > maxLength) return userData.slice(0, maxLength) + "...";
        else return userData;
    };

    const convertDateFormat = (isoDate: any) => {
        return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    };

    const renderDialsWithoutData = (messagedials: string) => {
        const isErrorMessage = messagedials?.includes("Oops! Something went wrong");
        const isBaselineErrorMessage = messagedials?.includes("Oops! Something went wrong in the baseline calculation");
        const getErrorMessage = () => isBaselineErrorMessage ? "Oops! Something went wrong in the baseline calculation" : (isErrorMessage ? "Oops! Something went wrong" : "Something went wrong");
        const filteredMessage = <span>{messagedials?.replace(/(Oops! Something went wrong in the baseline calculation\.|Oops! Something went wrong\.?)/, "").trim()}</span>;

        return (
            <div className="dials_without_data_div1">
                <div className="dials_without_data_div2">
                    <div className="dials_without_data_div2_1">
                        <img src={isErrorMessage ? calculationFailed : dials_without_data} alt="Status Icon" />
                    </div>
                </div>
                <div className="dials_without_data_label1" data-testid="error-message-label">{getErrorMessage()}</div>
                <div className="dials_without_data_wrapper">
                    <div className="dials_without_data_message">{filteredMessage}</div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }} className="history-version-page">
            <div className="version-history-header">
                <div className="version-history-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span> <StyledTypography style={{ fontSize: "33.18px", fontWeight: 700, fontFamily: "kenvue-sans", }}>{headerData?.details?.name}</StyledTypography></span>
                    <span><img src={sip_logo} alt="sip" /></span>
                </div>
                <span><StyledTypography style={{ paddingTop: "10px" }}>Baseline Product: {productState?.assessments?.baseline?.name}</StyledTypography></span>
                <div className="version-history-brand-details">
                    <span><StyledTypography>Brand: {productState?.brandName} | SIP ID: {headerData?.details?.assessmentId} | {assessmentType?.charAt(0)?.toUpperCase() + assessmentType.slice(1)} Assessment | {productState?.projectId ? productState?.projectId + " |" : ""} {headerData?.productName}</StyledTypography></span>
                    <span className="user-data-version"><StyledTypography className="team-members-breadcrumb">Date of Assessment: {convertDateFormat(headerData?.details?.createdAt)} | SIP Version {versionNumber} | Team Members: {displayUsers(headerData?.user)} </StyledTypography></span>
                </div>
            </div>
            {versionBasedResult && renderAssessmentLabel()}
            {isFetching && <Box className="loaderCss" display="flex" justifyContent="center" alignItems="center" >
                <CircularProgress sx={{ color: '#00b097' }} />
            </Box>}
            {versionDataFetchError && renderDialsWithoutData((versionDataFetchError as any)?.response?.data?.message)}
            {versionBasedResult && <div className="version-container">{[
                {
                    id: "productEnvironmentalFootprintData",
                    data: productEnvironmentalFootprintData?.dials?.PieChartJSONSeries1,
                    title: "Product Environmental Footprint",
                    subTitle: productEnvironmentalFootprintData.dials.pie_chart_sub_title,
                    percentage: productEnvironmentalFootprintData.dials.pie_chart_percentage,
                    series0: ProductEnvironmentalFootprint_series0,
                    series1: productEnvironmentalFootprintData?.dials?.PieChartJSONSeries1,
                    description: ProductEnvironmentalFootprintFlipcardDescription,
                    tabs: productEnvironmentalFootprintData?.tabs,
                    tabIndex: 1
                },
                {
                    id: "carbonFootprintData",
                    data: carbonFootprintData?.dials?.PieChartJSONSeries1,
                    title: "Product Carbon Footprint",
                    subTitle: carbonFootprintData.dials.pie_chart_sub_title,
                    percentage: carbonFootprintData.dials.pie_chart_percentage,
                    series0: CarbonFootprint_series0,
                    series1: carbonFootprintData?.dials?.PieChartJSONSeries1,
                    description: CarbonFootprintFlipcardDescription,
                    tabs: carbonFootprintData?.tabs,
                    tabIndex: 2
                },
                {
                    id: "greenChemistry",
                    data: greenChemistryData,
                    title: "Green Chemistry",
                    subTitle: greenChemistryData.dials.pie_chart_sub_title,
                    percentage: greenChemistryData.dials.pie_chart_percentage,
                    series0: GreenChemistry_series0,
                    series1: greenChemistryData?.dials.PieChartJSONSeries1,
                    description: GreenChemistryFlipcardDescription,
                    tabIndex: 3
                },
                {
                    id: "packagingCircularity",
                    data: sustainablePackagingData,
                    title: "Packaging Circularity",
                    subTitle: sustainablePackagingData?.dials?.pie_chart_sub_title ?? "",
                    percentage: sustainablePackagingData?.dials?.pie_chart_percentage ?? "",
                    series0: SustainablePackaging_series0,
                    series1: sustainablePackagingData?.dials.PieChartJSONSeries1,
                    description: SustainablePackagingFlipcardDescription,
                    tabIndex: 4
                }
            ].map((chart, index) => (
                chart.data !== undefined && (
                    <div className="version-history-wrapper" key={chart.id}>
                        <span style={{ fontWeight: 700, fontSize: "22.04px", fontFamily: "kenvue-sans", display: "block", textAlign: "center" }}>{chart.title}</span>
                        <div className="version-pie-container">
                            <PieChart
                                key={index + 1}
                                chartDivIndex={(index + 1).toString()}
                                title={chart.title}
                                sub_title={chart.subTitle}
                                pie_chart_percentage={chart.percentage}
                                data_series0={chart.series0}
                                data_series1={chart.series1}
                                flipcard_description={undefined}
                                versionResult={true}
                                tabs={chart.tabs}
                                style={{ border: "none", alignItems: "center", width: "100%" }}
                            />
                            <div className="text-container">
                                {getContent(chart)}
                            </div>
                        </div>
                        <div className="note-version" style={{ paddingBottom: chart.id == "greenChemistry" ? "42px" : "20px" }}><StyledTypography style={{ fontSize: "12px" }}>{textConstants.noteText[chart.id as keyof typeof textConstants.noteText]}</StyledTypography></div>
                    </div>
                )
            ))}</div>}
        </div>
    );
};

export default VersionAssessmentReport;