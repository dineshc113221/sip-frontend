
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ToastProps } from "../breadcrumb/types";
import "../../assets/css/tooltip.scss";
export const ToastMessage: React.FC<ToastProps> = ({ content, onConfirm, onCancel }) => {
    return (
        
            <div className="toast-overlay">
                <div className="toast" style={{ zIndex: '9999999' }}>
                    <div className="toastDiv">
                        <div className="toasttitleIcon">
                            <span className="toastTitle">Confirm Sign out</span>
                            <CloseIcon onClick={onCancel} style={{ cursor: "pointer" }} />
                        </div>

                        <span>{content}</span>
                    </div>
                    <div className="toast-buttons">
                     
                        <button className="buttonCancel" onClick={onCancel}>Cancel</button>
                        <button className="buttonContinue" onClick={onConfirm}>Continue</button>
                    </div>
                </div>
            </div>
        
    );
};