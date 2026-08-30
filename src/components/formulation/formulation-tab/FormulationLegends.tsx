import React from "react";
import leafIcon from "../../../assets/images/leaf_icon_formulation.svg";
import warningIcon from "../../../assets/images/Warning_icon_formulation.svg";
import {
  LEAF_ICON_CONTENT,
  WARNING_ICON_CONTENT,
} from "../../../constants/ExperimentalTooltip.constant";

const FormulationLegends: React.FC = () => {
    const iconLegends=[
        {
            icon:leafIcon,
            content:LEAF_ICON_CONTENT
        },{
            icon:warningIcon,
            content:WARNING_ICON_CONTENT
        }
    ]
  return (
    <div className="table-bottom-color-band-formulation">
      <div className="color-band-left-empty"></div>
      <div className="color-band-div">
        
        <div>
          <div className="icon-key-section">
            <div className="Icon-key">Icon Key</div>
            {iconLegends.map((item)=>(
                <div className="icon-content" key={item.content}>
                <img src={item.icon} alt="SIP" />
                <div>{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulationLegends;
