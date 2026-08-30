import React from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import great_job from "../../assets/images/great_job.svg";
import warning_dials from "../../assets/images/warning_dials.svg";
import { PieChartDialsProps } from "../breadcrumb/types";
import "../../assets/css/ProductAssessment.scss";
import flipIcon from "../../assets/images/FLIP CARD.svg"
export const PieChart: React.FC<PieChartDialsProps> = (props: PieChartDialsProps) => {
  let imageSrc = "";
  if (props.sub_title === "Good" || props.sub_title === "Excellent") {
    imageSrc = great_job;
  } else if (props.sub_title === "Poor" || props.sub_title === "Very poor") {
    imageSrc = warning_dials;
  } else {
    imageSrc = "";
  }
  React.useLayoutEffect(() => {
    const data_series0 = props.data_series0;
    const data_series1 = props.data_series1;

    const root = am5.Root.new(`chartdiv_${props.chartDivIndex}`);

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    root._logo?.dispose();
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        startAngle: 180, endAngle: 360
      })
    );

    chart.children.unshift(am5.Label.new(root, {
      text: `${props.sub_title}`,
      fontSize: 23,
      fontWeight: "700",
      textAlign: "center",
      fontFamily: "kenvue-sans",
      x: am5.percent(50),
      centerX: am5.percent(50),
      y: am5.percent(75),
      centerY: am5.percent(75),
      paddingBottom: 0
    }));

    chart.children.unshift(am5.Picture.new(root, {
      width: 32,
      height: 32,
      src: imageSrc,
      y: am5.percent(90),
      centerY: am5.percent(90),
      x: am5.percent(50),
      centerX: am5.percent(50),
      marginBottom: 29.12,
    }));

    const series0 = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "rangeIndicator",
        categoryField: "dialsIndicator",
        legendLabelText: "actaulRangeIndicator",
        startAngle: 180,
        endAngle: 360,
        radius: am5.percent(60),
        innerRadius: am5.percent(47),
        y: am5.percent(-5),
      })
    );

    const tooltip_series0 = am5.Tooltip.new(root, {
      labelText: "[bold]{dialsIndicator}: {actaulRangeIndicator}"
    });

    series0.set("tooltip", tooltip_series0);

    const assignedColors = (numberOfColors: number) => {
      const colors = [];
      for (let i = 0; i < numberOfColors; i++) {
        const color = data_series0[i].colors;
        // Validate and check if color is present and in the right format
        if (color && /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
          colors.push(am5.color(color));
        } else {
          // Use a default color if the color is invalid or missing
          colors.push(am5.color("#000000")); // Fallback color
        }
      }
      return colors;
    };

    const chartColors = assignedColors(data_series0 ? data_series0.length : 0);

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

    const series1 = chart.series.push(
      am5percent.PieSeries.new(root, {
        startAngle: 180,
        endAngle: 360,
        valueField: "rangeIndicator",
        innerRadius: am5.percent(70),
        categoryField: "dialsIndicator",
        legendLabelText: "actaulRangeIndicator",
        y: am5.percent(-5),
      })
    );

    const tooltip_series1 = am5.Tooltip.new(root, {
      labelText: "[bold]{dialsIndicator}: {actaulRangeIndicator}"
    });

    series1.set("tooltip", tooltip_series1);

    const assignedColorsSeries1 = (numberOfColors: number) => {
      const colors = [];
      for (let i = 0; i < numberOfColors; i++) {
        const color = data_series1[i].colors_series1;
        // Validate and check if color is present and in the right format
        if (color && /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
          colors.push(am5.color(color));
        } else {
          // Use a default color if the color is invalid or missing
          colors.push(am5.color("#000000")); // Fallback color
        }
      }
      return colors;
    };

    const chartColorsSeries1 = assignedColorsSeries1(data_series1 ? data_series1.length : 0);

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

    const showPercentage = (props.title !== 'Packaging Circularity' && props.title !== "Green Chemistry") ? "%" : "";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        textAlign: "center",
        centerY: am5.percent(100),
        centerX: am5.p50,
        text: `\n[bold fontSize:16px]${(props.pie_chart_percentage === 'N/A') ? props.pie_chart_percentage : (props.pie_chart_percentage + showPercentage)}[/]`
      })
    );

    series0.data.setAll(data_series0 || []);
    series1.data.setAll(data_series1 || []);

    return () => {
      root.dispose();
    };
  }, [props, imageSrc]);


  return (
     <div
        id={`chartdiv_${props.chartDivIndex}`}
        className="pieChartdiv"
        style={{
          border:
          props.selectedpiechart === "selected"
            ? "2px solid #000"
            : "1px solid #B4B4B4",
          ...props.style
        }}
      >
        <div className="divTitle">
          <span className="fontTitle" style={{width: "100%"}}>{props.title}</span>      
          {props.children}
        </div>
      </div>
  );
}

const PieChartDials: React.FC<PieChartDialsProps> = (props: PieChartDialsProps) => {
  return (

    <label>
      <span className="visually-hidden">Flip card</span>
      <input type="checkbox" id="flipcardCheckbox" name="flipcardCheckbox" />
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <PieChart {...props}>
              <div className="tooltip-container">
                  <img className="image" src={flipIcon} alt="flip icon" />
                  <div className="SustainableTooltip">Click on the dial to flip</div>
              </div>
            </PieChart>
          </div>
          <div
            className="flip-card-back"
            style={{
              border:
                props.selectedpiechart === "selected"
                  ? "2px solid #000"
                  : "1px solid #B4B4B4",
            }}
          >
            <props.flipcard_description />
          </div>
        </div>
      </div>
    </label>

  );
}
export default PieChartDials;