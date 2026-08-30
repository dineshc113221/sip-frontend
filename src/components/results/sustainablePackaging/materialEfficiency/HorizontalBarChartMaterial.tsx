import React, { useLayoutEffect, useContext, useMemo } from "react";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

const HorizontalBarChart: React.FC = () => {
  const { sustainablePackagingData } = useContext(ResultDataContext);
    const {  isBaselineSkipped } = useContext(ProductDataContext);

  const barData = useMemo(() => {
    return (
      sustainablePackagingData?.materialEfficiency?.barData || {
        baseline: "0",
        myproduct: "0",
      }
    );
  }, [sustainablePackagingData?.materialEfficiency?.barData]);
  useLayoutEffect(() => {
    const baselineValue = !isBaselineSkipped ? Number.parseFloat(barData.baseline): null ;
    const myProductValue = Number.parseFloat(barData.myproduct);
    const maxValue = Math.max(baselineValue, myProductValue);

    // Calculate dynamic padding based on the maximum value
    // Add extra space for the label (value + "g" + padding)
    const paddingFactor = maxValue * 0.25; // Adjust this factor based on font size
    const xAxisMax = maxValue + paddingFactor;

    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 40, // Increase left padding
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "data",
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 25,
          strokeOpacity: 0,
          strokeWidth: 2,
          inversed: true,
        }),
      })
    );

    yAxis.get("renderer").labels.template.setAll({
      visible: false,
    });
    yAxis.get("renderer").setAll({
      minGridDistance: 30,
      stroke: am5.color(0x000000),
      strokeWidth: 2,
      strokeOpacity: 1,
    });

    yAxis.get("renderer").grid.template.setAll({
      visible: false,
      height: 100,
    });

    const xRenderer = am5xy.AxisRendererX.new(root, {
      strokeOpacity: 1,
      strokeWidth: 2,
      minGridDistance: 50,
    });

    xRenderer.ticks.template.setAll({
      visible: true,
      strokeOpacity: 1,
      stroke: am5.color(0x000000),
      strokeWidth: 2,
      length: 10,
      location: 0,
      dy: -43,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: xAxisMax,
        strictMinMax: true,
        renderer: xRenderer,
      })
    );

    xRenderer.setAll({
      stroke: am5.color(0x000000),
      strokeWidth: 2,
    });

    xRenderer.grid.template.setAll({
      visible: false,
    });

    xRenderer.labels.template.setAll({
      visible: true,
      fontSize: 12,
      fill: am5.color(0x333333),
      centerY: am5.p100,
      dy: -15,
    });

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        categoryYField: "data",
        sequencedInterpolation: true,
      })
    );

    series.columns.template.setAll({
      tooltipText: "{categoryY}: {valueX}",
      strokeOpacity: 0,
      fillOpacity: 1,
      height: 40,
      centerY: am5.p50,
      dx: 2, // Offset to the right
    });

    series.columns.template.adapters.add("fill", (fill, target) => {
      const dataItem = target.dataItem as { get: (key: string) => string };
      if (dataItem) {
        const category = dataItem.get("categoryY");
        if (category === "baseline") {
          return am5.color("#D2D2D2");
        } else if (category === "myProduct") {
          return am5.color("#D5C0F3");
        }
      }
      return fill;
    });

    series.bullets.push(function (root, _series, dataItem) {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: dataItem.get("valueX")?.toFixed(2).toString() + " g",
          fill: am5.color(0x000000),
          centerY: am5.p50,
          dx: 10,
          fontFamily: "kenvue-sans-regular", // Apply font family
          fontSize: 16, // font-size: 16px
          fontWeight: "400", // font-weight: 400
          lineHeight: 1.5, // line-height of 150% translates to 1.5
        }),
        locationX: 1,
      });
    });

    const data = [
      { data: "baseline", value: baselineValue },
      { data: "myProduct", value: myProductValue },
    ];

    yAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [barData]); // Added barData to dependencies

  return (
    <div
      id="chartdiv"
      style={{
        width: "100%",
        maxWidth: "601.72px",
        height: "210px",
        alignContent: "center",
      }}
    />
  );
};

export default HorizontalBarChart;
