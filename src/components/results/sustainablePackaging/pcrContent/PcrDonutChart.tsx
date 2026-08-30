import React, { useLayoutEffect,useContext } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

interface DialDataProps {
    dialsData: {
        baseline: string;
        myproduct: string;
        per_pcr_diff: string;
    };
    chartSection?: string
}
const PcrDonutChart: React.FC<DialDataProps> = ({ dialsData, chartSection }) => {
    const {  isBaselineSkipped } = useContext(ProductDataContext);

    const vbaseline = parseFloat(dialsData?.baseline);
    const vmyproduct = parseFloat(dialsData?.myproduct);
    const rounded_dial_percentage = parseFloat(dialsData.per_pcr_diff);
    let dial_percentage;
    
    // Apply conditions
    if (rounded_dial_percentage > 0 && rounded_dial_percentage < 10) {
      dial_percentage = `+${rounded_dial_percentage.toFixed(1)}`;
    } else if (rounded_dial_percentage > 0 && rounded_dial_percentage >= 10) {
      dial_percentage = `+${Math.round(rounded_dial_percentage)}`;
    } else if (rounded_dial_percentage < 0 && Math.abs(rounded_dial_percentage) < 10) {
      dial_percentage = rounded_dial_percentage.toFixed(1);
    } else if (rounded_dial_percentage < 0 && Math.abs(rounded_dial_percentage) >= 10) {
      dial_percentage = Math.round(rounded_dial_percentage).toString();
    } else {
      dial_percentage = rounded_dial_percentage.toString(); // Fallback for cases not covered
    }
    
    useLayoutEffect(() => {

        const data_series0 = [
            {
                dialsIndicator: "Baseline",
                rangeIndicator: vbaseline,
                colors: "#D4D4D4",
                actaulRangeIndicator: "",
            },
            {
                dialsIndicator: "Remaining Baseline Data",
                rangeIndicator: (100 - vbaseline),
                colors: "#F8F8F8",
                actaulRangeIndicator: "",
            },
        ];

        const data_series1 = [
            {
                dialsIndicator: "My Product",
                rangeIndicator: vmyproduct,
                colors_series1: "#D5C0F3",
                actaulRangeIndicator: "",
            },
            {
                dialsIndicator: "Remaining Data",
                rangeIndicator: (100 - vmyproduct),
                colors_series1: "#F8F8F8",
                actaulRangeIndicator: "",
            },
        ];

        const root = am5.Root.new(`chartDonutdiv`);

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        root._logo?.dispose();

        const chart = root.container.children.push(am5percent.PieChart.new(root, {
            layout: root.verticalLayout,
            innerRadius: am5.percent(20)
        }));
        
        const text = `${vbaseline} %`;
         chart.children.unshift(am5.Label.new(root, {
            text: ` Baseline \n  [fontSize: 13.33px; fontFamily: "kenvue-sans"; fontStyle:"Bold";FontWeight:"700"] ${!isBaselineSkipped ? text : "N/A"} `,
            fontSize: 12,
            textAlign: "center",
            fontFamily: "kenvue-sans-regular",
            x: am5.percent(50),
            centerX: am5.percent(50),
            y: am5.percent(68),
            centerY: am5.percent(70),
            paddingTop: 0,
            paddingBottom: 0,
        }));

        chart.children.unshift(am5.Label.new(root, {
            text: `My \n Product \n [bold]${vmyproduct}%`,
            fontSize: 12,
            textAlign: "center",
            fontFamily: "kenvue-sans-regular",
            x: chartSection === "renewableOriginBonus" ? am5.percent(68) : am5.percent(18),
            centerX: am5.percent(18),
            y: chartSection === "renewableOriginBonus" ? am5.percent(22) : am5.percent(30),
            centerY: am5.percent(30),
            paddingTop: 0,
            paddingBottom: 0
        }));

        const series0 = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "rangeIndicator",
                categoryField: "dialsIndicator",
                legendLabelText: "actaulRangeIndicator",
                radius: am5.percent(55),
                innerRadius: am5.percent(40),
                y: am5.percent(-5),
            })
        );

        const assignedColors = (numberOfColors: number) => {
            const colors = [];
            for (let i = 0; i < numberOfColors; i++) {
                colors.push(am5.color(data_series0[i].colors));
            }
            return colors;
        };

        const chartColors = assignedColors(data_series0.length);

        const colorSet = am5.ColorSet.new(root, {
            colors: chartColors,
            passOptions: {
                lightness: -0.05,
                hue: 0
            }
        });

        series0.set("colors", colorSet);

        series0.ticks.template.set("forceHidden", true);
        series0.labels.template.set("forceHidden", true);
        series0.slices.template.set("toggleKey", "none");

        series0.labels.template.set("text", "{category} \n [bold]{valuePercentTotal}%[/]");

        const series1 = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "rangeIndicator",
                categoryField: "dialsIndicator",
                legendLabelText: "actaulRangeIndicator",
                innerRadius: am5.percent(65),
                y: am5.percent(-5),
            })
        );

        const assignedColorsSeries1 = (numberOfColors: number) => {
            const colors = [];
            for (let i = 0; i < numberOfColors; i++) {
                colors.push(am5.color(data_series1[i].colors_series1));
            }
            return colors;
        };

        const chartColorsSeries1 = assignedColorsSeries1(data_series1.length);

        const colorSetSeries1 = am5.ColorSet.new(root, {
            colors: chartColorsSeries1,
            passOptions: {
                lightness: -0.05,
                hue: 0
            }
        });

        series1.set("colors", colorSetSeries1);
        series1.ticks.template.set("forceHidden", true);
        series1.labels.template.set("forceHidden", true);
        series1.slices.template.set("toggleKey", "none");

        series1.labels.template.setAll({
            fontSize: 12,
            fontFamily: "kenvue-sans-regular",
            maxWidth: 100,
            oversizedBehavior: "wrap"
        });

        series1.labels.template.set("text", "{category} \n [bold]{valuePercentTotal}%[/]");

        // Play initial series animation
        // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
        series0.appear(5000, 100);
        series1.appear(5000, 100);
        const displayValue = !isBaselineSkipped ? dial_percentage + '%[/]' : '--';
        chart.seriesContainer.children.push(
            am5.Label.new(root, {
                textAlign: "center",
                centerY: am5.percent(85),
                centerX: am5.p50,
                text: `[fontSize:39.81px fontWeight:700 fontFamily:kenvue-sans ]${displayValue}`
            }
        ));

        series0.data.setAll(data_series0);
        series1.data.setAll(data_series1);

        return () => {
            root.dispose();
        };
    }, [vbaseline, vmyproduct, dial_percentage]);

    return <div id="chartDonutdiv" style={{ width: "621px", height: "492px", margin:"-50px" }} />;
}

export default PcrDonutChart;