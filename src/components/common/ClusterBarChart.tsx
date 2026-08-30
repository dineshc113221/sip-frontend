import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ResultDataContext } from "../../contexts/resultData/ResultDataContext";
import * as am5xy from "@amcharts/amcharts5/xy";
import { IBarGraphObject } from "../../structures/result";
import { GraphTags } from "../results/commonComponents/GraphTags";
import "../../assets/css/clusterBarChart.scss"
import { Divider } from "@mui/material";

export interface IClusterBarChartProps {
  barData: IBarGraphObject[];
  currentTab: string;
}

const ClusterBarChart: React.FC<IClusterBarChartProps> = (
  props: IClusterBarChartProps
) => {
  const { setCurrentTab } = useContext(ResultDataContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (props.barData) {
      setData(props.barData);
    }
  }, [props.barData]);

  useEffect(() => {
    setCurrentTab(props?.currentTab);
  }, [props.currentTab, setCurrentTab]);

  useLayoutEffect(() => {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new("clusterbarchartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    root._logo?.dispose();
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      })
    );

    chart.zoomOutButton.set("forceHidden", true);
    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.4,
      minorGridEnabled: true,
      strokeOpacity: 1,
      minGridDistance: window.innerWidth < 1151 ? 24 : 58,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "lifecyclestage",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({
      location: 1,
      strokeOpacity: 0,
    });

    xRenderer.labels.template.setAll({
      maxWidth: 104,
      width: 104,
      minWidth: 104,
      centerX: am5.p50,
      textAlign: "center",
      oversizedBehavior: "wrap",
      fontSize: "10px",
      fontWeight: "400",
      lineHeight: am5.percent(150),
    });

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0,
        }),
      })
    );

    yAxis.get("renderer").grid.template.setAll({
      strokeOpacity: 0.1,
      strokeWidth: 1.25,
    });

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: string, fieldName: string, color: am5.Color) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "lifecyclestage",
          fill: color,
          paddingLeft: 36,
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(60),
        tooltipY: 0,
        strokeOpacity: 0,
      });

      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "", // removed y-axis values being displayed under bar, use this to display values ---> {valueY} instead of ""
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,

          }),
        });
      });
    }

    makeSeries("Baseline", "baseline", am5.color("#D2D2D2"));
    makeSeries("My Product", "myproduct", am5.color("#D3BDF2"));
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <>
      <div
        className="clusterBar-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "34px",
          borderRadius: "32px",
          background: "#FBFAFA",
        }}
      >
        <div
          className="sharp-text"
        >
          <p
            style={{
              fontFamily: "kenvue-sans",
              textAlign: "center"
            }}
          >
            {props.currentTab === "PRODUCT_ENVIRONMENTAL_FOOTPRINT"
              ? "Product Environmental Footprint (Points)"
              : "Product Carbon Footprint (g CO2 eq.)"}
          </p>
        </div>
        <div className="clusterbarchart-main">
          <div id="clusterbarchartdiv" />
          <div
            style={{
              paddingBottom: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p style={{ fontWeight: "700", fontFamily: "kenvue-sans" }}>
              Life Cycle Stages
            </p>
            <GraphTags />
          </div>
        </div>
      </div>
      <div className="result1-divider"> <Divider /></div>
    </>
  );
};
export default ClusterBarChart;
