import React  from "react";
import result_section2_packaging_end_of_life from "../../assets/images/result_section2_packaging_end_of_life.svg";
import result_section2_formula_end_of_life from "../../assets/images/result_section2_formula_end_of_life.svg";
import result_section2_consumer_use from "../../assets/images/result_section2_consumer_use.svg";
import result_section2_storage_distribution from "../../assets/images/result_section2_storage_distribution.svg";
import result_section2_finished_product_manufacturing from "../../assets/images/result_section2_finished_product_manufacturing.svg";
import result_section2_packaging_material_production from "../../assets/images/result_section2_packaging_material_production.svg";
import result_section2_raw_material_production from "../../assets/images/result_section2_raw_material_production.svg";
import Divider from '@mui/material/Divider';
import { ResultSection2Prop } from "../breadcrumb/types";
import "../../assets/css/result-page.scss";

const ResultSection2: React.FC<ResultSection2Prop> = (props) => {
    let arrFormulationIconsDisabled: string[];

if (props.currentSection === "FORMULATION") {
  arrFormulationIconsDisabled = ["Raw Material Production", "Formula End-of-Life"];
} else if (props.currentSection === "CONSUMER_PACKAGING") {
  arrFormulationIconsDisabled = ["Packaging Material Production", "Packaging End-of Life"];
} else {
  arrFormulationIconsDisabled = [
    "Raw Material Production",
    "Packaging Material Production",
    "Finished Product Manufacturing",
    "Storage & Distribution",
    "Consumer Use",
    "Formula End-of-Life",
    "Packaging End-of Life"
  ];
}

const arrResultSection2 = [
    {
        className: "raw-material-production",
        icon: result_section2_raw_material_production,
        label: "Raw Material Production",
    },
    {
        className: "packaging-material-production",
        icon: result_section2_packaging_material_production,
        label: "Packaging Material Production",
    },
    {
        className: "finished-product-manufacturing",
        icon: result_section2_finished_product_manufacturing,
        label: "Finished Product Manufacturing",
    },
    {
        className: "storage-distribution",
        icon: result_section2_storage_distribution,
        label: "Storage & Distribution",
    },
    {
        className: "consumer-use",
        icon: result_section2_consumer_use,
        label: "Consumer Use",
    },
    {
        className: "formula-end-of-life",
        icon: result_section2_formula_end_of_life,
        label: "Formula End-of-Life",
    },
    {  
        className: "packaging-end-of-life",
        icon: result_section2_packaging_end_of_life,
        label: "Packaging End-of Life",
    },
];

return (
    <div className="result1_section2_component">
        {arrResultSection2.map((row, index) => (
            <React.Fragment key={row.label}>
                <div
                    className={`result1_section2_div4 ${row.className}`}
                >
                    <img
                        alt="SIP"
                        className="result1_section2_icons"
                        src={row?.icon}
                        style={{
                            opacity: arrFormulationIconsDisabled.includes(row?.label) ? "" : "0.1",
                        }}
                    />
                    <p
                        className={
                            arrFormulationIconsDisabled.includes(row?.label)
                                ? "result1_section2_label"
                                : "result1_section2_label_blur"
                        }
                    >
                        {row.label}
                    </p>
                </div>
                {index < arrResultSection2.length - 1 && (
                    <div
                        className={`result1_section2_div5 ${row.className}-divider`}
                    >
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                            sx={{
                                borderRightWidth: 1.5,
                                marginTop: "10px",
                                height: "66px",
                                alignSelf: "center",
                            }}
                        />
                    </div>
                )}
            </React.Fragment>
        ))}
    </div>
);
}

export default ResultSection2;