import React from "react";
import result_hint_icon from "../../../../assets/images/result_hint_icon.svg";
import "./totalScore.scss";
import { TOTAL_SCORE_DESCRIPTION1, TOTAL_SCORE_DESCRIPTION2, TOTAL_GAIA_CONTENT, WATCH_LIST_CONTENT, RENEWABLE_ORIGIN_BONOUS_CONTENT } from "../constant";
import { Divider } from "@mui/material";

export const TotalScoreGreen: React.FC = () => {
  return (
    <div className="totalscore-main-section-green">
      <div className="hint-section-green">
        <img src={result_hint_icon} alt="Hint Icon" />
        <span className="hint-text">What is the Green Chemistry Score?</span>
      </div>

      <div className="description-section-green">
        <span>{TOTAL_SCORE_DESCRIPTION1}</span>
        <span>{TOTAL_SCORE_DESCRIPTION2}</span>
      </div>


      <div className="pillar-section-green">
        <div className="pillar-card" style={{width:"236px"}}>
          <h3>GAIA</h3>
          <p>{TOTAL_GAIA_CONTENT}</p>
        </div>
        <div className="divider" />

        <div className="pillar-card" style={{width:"228px"}}>
          <h3>Watch List</h3>
          <p>{WATCH_LIST_CONTENT}</p>
        </div>
        <div className="divider" />

        <div className="pillar-card" style={{width:"210px"}}>
          <h3>Renewable Origin Bonus</h3>
          <p>{RENEWABLE_ORIGIN_BONOUS_CONTENT}</p>
        </div>

      </div>

      <Divider
      className="total-score-divider"/>
    </div>
  );
};