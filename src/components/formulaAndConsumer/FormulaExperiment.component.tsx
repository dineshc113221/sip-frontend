import React, { useState } from "react";
import { WARNING_MSG } from "../../constants/ExperimentalTooltip.constant";
import DialogBox from "../../controls/DialogBox";
import IntensityBar from "../formulation/intensityBar";
import { IformulaCodeDetailData } from "../../structures/formulation";

const FormulaExperiment: React.FC<{
  isParentData: IformulaCodeDetailData;
  handelFormulationChanges: () => void;
  handelSaveChanges: (hasData: boolean) => void;
  isClear: boolean;
}> = () => {
  const [openDailog, setOpenDailog] = useState(false);


  const handleCloseDialog = () => {};

  const handleSave = () => {
    setOpenDailog(false);
  };

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "auto" }}>
          <p
            style={{
              fontFamily: "kenvue-sans",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Formulation Composition
          </p>
        </div>

        <DialogBox
          text={WARNING_MSG}
          buttonOneText="cancel"
          buttonTwoText="continue"
          open={openDailog}
          onClose={handleCloseDialog}
          onClick={handleSave}
        />
      </div>
      <br />
      <IntensityBar />
    </>
  );
};

export default FormulaExperiment;
