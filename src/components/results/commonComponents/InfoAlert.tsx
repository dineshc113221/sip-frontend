import React,{useState} from "react";
import "../greenChemistry/renewableOriginBonus/renewableOriginBonus.scss";
import infoIcon from "../../../assets/images/info.svg";
import closeIcon from "../../../assets/images/close_icon.svg"
interface InfoAlertProps {
  message: string;
  onClose?: () => void;
}

const InfoAlert: React.FC<InfoAlertProps> = ({
  message,
  onClose,
}) => {
  const [isBoxVisible, setIsBoxVisible] = useState(true);

const handleClose = () => {
  setIsBoxVisible(false);
};
  return (
    isBoxVisible && (
        <div className="info-alert">
           <div className="info-text">
          Information
        </div>
          <div className="info-alert__content">
            <img src={infoIcon} alt="info" style={{ position: "relative", top: "-7px" }} />
            <span className="info-alert__text">{message}</span>
          </div>

          {onClose && (
            <button type="button"
              className="info-alert__close"
              onClick={handleClose}
              aria-label="Close alert"
            >
              <img src={closeIcon} alt="CloseIcon" style={{ width: "18px", height: "18px", position: "relative", top: "-10px", right: "-6px" }} />

            </button>
          )}
        </div>
    
    )
  );
};

export default InfoAlert;