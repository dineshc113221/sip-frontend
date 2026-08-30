import React from "react";
import result_hint_icon from "../../../../assets/images/result_hint_icon.svg";
import "./totalScore.scss";
import { TOTAL_SCORE_DESCRIPTION, TOTAL_SCORE_MATERIAL_EFFICIENCY, TOTAL_SCORE_PCR_CONTENT, TOTAL_SCORE_RECYCLABILITY_DISRUPTORS, TOTAL_SCORE_RECYCLE_READY } from "../../strings";

export const TotalScore: React.FC = () => {
  return (
    <div className="totalscore-main-section">
      <div className="hint-section">
        <img src={result_hint_icon} alt="Hint Icon" />
        <span className="hint-text">What is the Packaging Circularity score?</span>
      </div>

      <div
        className="description-section"
        dangerouslySetInnerHTML={{ __html: TOTAL_SCORE_DESCRIPTION }}
      ></div>

      <div className="pillar-section">
        <div className="pillar-card">
          <h3>PCR Content</h3>
          <p>{TOTAL_SCORE_PCR_CONTENT}</p>
        </div>

        <div className="divider" />

        <div className="pillar-card">
          <h3>Material Efficiency</h3>
          <p>{TOTAL_SCORE_MATERIAL_EFFICIENCY}</p>
        </div>

        <div className="divider" />

        <div className="pillar-card">
          <h3>Recycle Ready</h3>
          <p>{TOTAL_SCORE_RECYCLE_READY}</p>
        </div>

        <div className="divider" />

        <div className="pillar-card">
          <h3>Recyclability Disruptors</h3>
          <p>{TOTAL_SCORE_RECYCLABILITY_DISRUPTORS}</p>
        </div>
      </div>
    </div>
  );
};
