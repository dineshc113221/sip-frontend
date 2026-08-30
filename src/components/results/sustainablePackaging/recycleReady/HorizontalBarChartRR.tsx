import React, { useEffect, useState,useContext } from "react";
import { IRRBarChartData } from "../../../../structures/result";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";
import "./horizontalBarChart.scss";

type HorizontalBarChartPropsType = {
  data: IRRBarChartData[];
};

export const HorizontalBarChart: React.FC<HorizontalBarChartPropsType> = ({
  data,
}: HorizontalBarChartPropsType) => {
  const {  isBaselineSkipped } = useContext(ProductDataContext);

  const [animateWidths, setAnimateWidths] = useState<number[]>(
    data.map(() => 0)
  );
  const totalMaxValue = 100;
  const chartWidth = 413;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateWidths(data.map((item) => (item.value / totalMaxValue) * 100));
    }, 100);
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div className="chart-container">
      <div style={{ position: "relative" }} className="chart">
        <div>
          {data.map((item, index) => {
            let visibility: React.CSSProperties["visibility"] = "visible";

            if (item.category === "baseline" && isBaselineSkipped) {
              visibility = "hidden";
            }
            const filledWidth = `${(item.value / totalMaxValue) * 100}%`;
            return (
              <div className="bar" key={item.category}>
                <div
                  style={{
                    position: "relative",
                    height: "57px",
                    width: "100%",
                    backgroundColor: "#f8f8f8",
                    marginBottom: "30px",
                    visibility: visibility
                  }}
                >
                  <div
                    className="bar-filled"
                    style={{
                      width: `${animateWidths[index]}%`,
                      backgroundColor:
                        item.category === "baseline" ? "#D9D9D9" : "#D3BDF2",
                      transition: "width 1.5s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `calc(${filledWidth} + 5px)`,
                      transform: "translateY(-50%)",
                    }}
                    className="percentage-value"
                  >
                    {item?.value?.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "relative", marginTop: "10px", zIndex: 1 }}>
          <div className="x-axis">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
              <div key={num} className="x-axis-label">
                <div className="line" />
                <div className="value">{num}</div>
              </div>
            ))}
          </div>
          <div className="vertical-lines">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => {
              const leftPosition = `${(num / totalMaxValue) * chartWidth}px`;
              return (
                <div
                  className="vertical-line"
                  key={num}
                  style={{ left: leftPosition }}
                />
              );
            })}
          </div>
          <div className="left-end-line" />
        </div>
      </div>
    </div>
  );
};
