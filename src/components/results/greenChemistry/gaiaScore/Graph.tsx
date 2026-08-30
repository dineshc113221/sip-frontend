import React, { useContext, useEffect, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import './GaiaScore.scss'
import { GraphTags } from '../../commonComponents/GraphTags';
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { GaiaScoreProps } from '../../../../structures/result';

interface GraphDataType {
  lifecyclestage: "Not Preferred" | "Less Preferred" | "Most Preferred";
  baseline: number;
  myproduct: number;
}

export const Graph = () => {
  const { greenChemistryData } = useContext(ResultDataContext);
  const [graphData, setGraphData] = useState<GraphDataType[]>([
      {
        "lifecyclestage": "Not Preferred",
        "baseline": 0,
        "myproduct": 0,
      },
      {
        "lifecyclestage": "Less Preferred",
        "baseline": 0,
        "myproduct": 0,
      },
      {
        "lifecyclestage": "Most Preferred",
        "baseline": 0,
        "myproduct": 0,
      }

  ]);
  
  
  React.useLayoutEffect(() => {

    /* Chart code */

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new("clusterbarchartdiv");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    root._logo?.dispose();
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      paddingLeft: 0,
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout
    }));

  
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.25,
      cellEndLocation: 0.75,
      minorGridEnabled: true,
      stroke: am5.color(0x000000),
      strokeWidth: 1,
      strokeOpacity:1
    })

    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "lifecyclestage",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
       
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xRenderer.labels.template.setAll({
      visible: true,
      fontSize: 12,
      fontWeight: "400",
      fill: am5.color(0x333333),
      centerY: am5.p100,
      dy: -15,
      fontStyle: "normal",
      fontFamily: 'kenvue-sans-regular',
      textAlign: "center",  
      maxWidth: 75,
      width: 75,
      minWidth: 75,
      oversizedBehavior: "wrap",
      lineHeight: am5.percent(150),
    });

    xAxis.data.setAll(graphData);

    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      numberFormat: "#'%  '",
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
      min: 0
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: string, fieldName: string, color: am5.Color) {
      const series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "lifecyclestage",
        fill: color,
        width: am5.percent(100),
      }));

      

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX} : {valueY.formatNumber('#.##')}",
        width: am5.percent(70),
        tooltipY: 0,
        strokeOpacity: 1,
      });

      series.data.setAll(graphData);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

    }

    makeSeries("Baseline", "baseline", am5.color("#D2D2D2"));
    makeSeries("My Product", "myproduct", am5.color("#D3BDF2"));

    // Add titles

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [graphData]);

 
  useEffect(() => {
    const gaiaScoreData = greenChemistryData.gaiaScore ;
    const myProductData = gaiaScoreData?.myProductData as GaiaScoreProps;
    const baselineData = gaiaScoreData?.baselineData as GaiaScoreProps;

    const updatedGraphData: GraphDataType[] = [
     {
      lifecyclestage: "Not Preferred",
      baseline: baselineData?.step_17_count_of_not_preferred,
      myproduct: myProductData.step_17_count_of_not_preferred,
     },
     {
       lifecyclestage: "Less Preferred",
       baseline: baselineData.step_18_count_of_less_preferred,
       myproduct: myProductData.step_18_count_of_less_preferred,
     },
     {
       lifecyclestage: "Most Preferred",
       baseline: baselineData.step_19_count_of_most_preferred,
       myproduct: myProductData.step_19_count_of_most_preferred,
     },
    ];
    setGraphData(updatedGraphData);
  },[greenChemistryData])
  return (
    <div className="gaia-graph-main">
    <div className="gaia-graph-heading">GAIA Score Distribution</div>
    <div
      style={{ display: "flex", width: "100%"}}
    >
      <div
        style={{ width: "5%", writingMode: "vertical-lr", marginBottom: "15%", marginLeft: "30px",  marginRight: "30px"}}
      >
        <p style={{ fontFamily: "kenvue-sans", alignItems: "center", transform: "rotate(180deg)", textAlign: "center" }}>
        % of raw materials by weight
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "30px" }}>
        <div id="clusterbarchartdiv" style={{ width: "90%"}} />
        <div
          style={{
            borderRadius: "10px",
            display: "flex",
              flexDirection: "column",
            marginLeft:'-172px'
          }}
        >
          <GraphTags />
        </div>
      </div>
    </div>
    </div>
  );
}
