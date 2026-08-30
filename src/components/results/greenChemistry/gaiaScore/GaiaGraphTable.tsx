import React, { useContext, useEffect, useState } from "react";
import './GaiaScore.scss';
import result_hint_icon from "../../../../assets/images/result_hint_icon.svg";
import ellipse from "../../../../assets/images/ellipsedot.svg";
import arrowdown from "../../../../assets/images/arrowdown.svg";
import { Divider } from "@mui/material";
import { GaiaScoreMaterialProps, GaiaScoreProps } from "../../../../structures/result";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

interface DataType {
    item: string;
    number: number;
    arrow: boolean;
}
interface GraphTableDataType {
    heading:'Baseline Product'|'My Product';
    data: DataType[];
}

export const GaiaGraphTable: React.FC = () => {
    const { greenChemistryData } = useContext(ResultDataContext);
    const { isBaselineSkipped } = useContext(ProductDataContext);
    
    const [graphTableData, setGraphTableData] = useState<GraphTableDataType[]>([
    {
        heading: "Baseline Product",
        data: [
            {
                item: "0",
                number: 0,
                arrow: true
            }
        ]
    },
    {
        heading:"My Product",
        data: [
            {
                item: "",
                number: 0,
                arrow: false
            }
        ]
    }
]
    );
    
useEffect(() => {
    const gaiaScoreData = greenChemistryData.gaiaScore;
    const myProductData = gaiaScoreData?.myProductData as GaiaScoreProps;
    const baselineData = gaiaScoreData?.baselineData as GaiaScoreProps
   // Extract and sort data
    const processData = (data: GaiaScoreMaterialProps[]) => {
        if (data) {
        return [...data]
       .sort((a, b) => b.step_14_deficit_GAIA_RAW_in_FML - a.step_14_deficit_GAIA_RAW_in_FML) // Sort descending
       .slice(0, 3); // Get top 3 rows
    }
        return [];
   };
   const baselineTop3 = processData(baselineData.raw_materials);
   const myProductTop3 = processData(myProductData.raw_materials);
   // Prepare graph table data
   const formattedData: GraphTableDataType[] = [
     {
       heading: "Baseline Product",
       data: !isBaselineSkipped ? baselineTop3.map((item) => ({
         item: item.tradeName,
         number: item.step_14_deficit_GAIA_RAW_in_FML,
         arrow: false,
       })):[],
     },
     {
       heading: "My Product",
       data: myProductTop3.map((item) => ({
         item: item.tradeName,
         number: item.step_14_deficit_GAIA_RAW_in_FML,
         arrow: false,
       })),
     },
   ];
   setGraphTableData(formattedData);
 }, [greenChemistryData]);

    return (
        <div className="main-graph-table1">
            <div className="hint-section">
                <img src={result_hint_icon} alt="Which raw materials have the biggest impact on reducing the formulation’s GAIA score?" />
                <span className="hint-text">Which raw materials have the biggest impact on reducing the formulation’s GAIA score?</span>
            </div>

            <div className="table-divider">
                <Divider orientation="horizontal" variant="middle" />
            </div>
            <div className="table-body">
                {
                    graphTableData.map((ele,i) => (
                        <div className="table-section" key={i+1} style={{height : ele?.data.length ? '246px' : '50px' }}>
                            <div className="heading">
                                <span className="ellipse"><img src={ellipse} alt="ellipse" /></span>
                                <span className="ellipse-text">{ele?.heading}</span>
                            </div>
                            <div className="main-body">
                                {
                                   ele?.data.length ? ele?.data?.map((element) => (
                                        <div className="body" key={element?.item}>
                                            <div className="row-item"><span className="row-item-span">{element?.item}</span></div>
                                            <div style={{display:"flex", justifyContent:"space-between", gap:"8px"}}>
                                            <div className="row-number">{element?.number.toFixed(2)}</div>
                                                <div className="row-arrow">
                                                     <img src={arrowdown} alt="arrow-down" />
                                                </div>
                                            </div>
                                        </div>
                                   )) : <span style={{
                                       fontFamily: "kenvue-sans",
                                       fontWeight: 700,
                                       fontStyle: "bold",
                                       fontSize: "23.04px",
                                       lineHeight: "120%",
                                       letterSpacing: "0%",
                                       verticalAlign: "middle",
                                   }}> N/A </span>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}