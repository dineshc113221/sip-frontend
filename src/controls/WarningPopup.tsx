import React from "react";
import { ToastWarning } from "../components/breadcrumb/types";
import "../assets/css/tooltip.scss";
import WarningIcon from "../assets/images/warningIcon.svg";
const WarningPopup: React.FC<ToastWarning> = ({ handleExit, handleReview }) => {
   
    return (
        <div className="toast-overlay">
            <div className="toast" style={{ zIndex: '9999999' }}>
                <div className="toastDiv">
                    <div className="toasttitleIcon1">
                        <img src={WarningIcon} style={{ width: "36px", height: "36px" }} alt="Warning"/>
                        <span className="toastTitle" style={{fontSize: "34.84px"}}>Warning</span>

                         </div>
                    <div className="bodyToast">
                        <span>You’ve made changes, but haven’t recalculated your assessment. </span>
                        <span>Return to your assessment to recalculate.</span>
                    </div>
                </div>
                <div className="toast-buttons">

                    <button className="buttonCancel" onClick={handleExit} style={{ width: "80px", height: "56px" }}>Exit</button>
                    <button className="buttonContinue" onClick={handleReview} style={{ width: "237px", height: "56px" }}>Review and recalculate</button>
                </div>
            </div>
        </div>
    )
}
export default WarningPopup;