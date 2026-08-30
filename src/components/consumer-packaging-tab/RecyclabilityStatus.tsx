// RecyclabilityStatus.tsx
import React from "react";
import recycle_na from "../../assets/images/Recyclable_Icon.svg";
import recycle_not_ready from "../../assets/images/recycle_not_ready.svg";
import recycle_ready from "../../assets/images/recycle_ready.svg";

type RecyclabilityStatusProps = {
  status: string;
  packagingType: "Primary" | "Secondary";
};

const statusImages = {
  ready: recycle_ready,
  notready: recycle_not_ready,
  na: recycle_na,
};

const RecyclabilityStatus: React.FC<RecyclabilityStatusProps> = ({
  status,
  packagingType,
}) => {
  const srcImg = (status:string) => {
    if (status === "Recycle Ready") {
      return "ready";
    }
    else if (status === "Not Recycle Ready" || status === "Non Recycle Ready") {
       return "notready";
    }
     return "na";
  }
  const isNaStatus = status === "N/A"|| status===undefined;
  const containerClassName = isNaStatus 
    ? "packaging-div-rcorners1" 
    : "packaging-recyclable-ready-not-div-rcorners1";
  const imageClassName = isNaStatus 
    ? "packaging-RecyclableIcon" 
    : "packaging-recyclable-ready-not";
  const labelClassName1 = isNaStatus 
    ? "packaging-RecyclableIcon-lable1" 
    : "packaging-recyclable-ready-not-lable1";
  const labelClassName2 = isNaStatus 
    ? "packaging-RecyclableIcon-lable2" 
    : "packaging-recyclable-ready-not-lable2";

  return (
    <div className={containerClassName} style={{marginRight:packagingType === "Primary" ?"24px":""}}>
      <div>
        <img
          src={statusImages[srcImg(status)]}
          className={imageClassName}
          alt={`Recyclability Status ${status}`}
        />
      </div>
      <div>
        <p className={labelClassName1}>
          {packagingType} Packaging
        </p>
        <p className={labelClassName2}>
          Recyclability Status: <span style={{fontFamily:"kenvue-sans",fontWeight:'700'}}>{isNaStatus?'N/A':status}</span>
        </p>
      </div>
    </div>
  );
};

export default RecyclabilityStatus;
