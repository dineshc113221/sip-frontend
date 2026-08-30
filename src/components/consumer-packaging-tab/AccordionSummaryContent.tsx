import React from "react";
import { Typography } from "@mui/material";

interface AccordionSummaryContentProps {
  expanded: boolean;
  imageSrc: string;
  imageClassName: string;
  componentType: string | null;
  description: string | null;
  isSaved: boolean;
}

const AccordionSummaryContent: React.FC<AccordionSummaryContentProps> = ({
  expanded,
  imageSrc,
  imageClassName,
  componentType,
  description,
  isSaved,
}) => {
 
   
  let descriptionContent = description === "" ? null : description;
  descriptionContent = descriptionContent ?? "Component Description";

  return (
    <Typography
      sx={{
        marginTop: expanded && !isSaved ? "5px" : "0px",
      }}
    >
      <div style={{display:"flex", alignItems:"center"}}>
      <img src={imageSrc} className={imageClassName} alt="Recycle Status" />

      <div style={{ paddingLeft: "24px"}}>
        <div>
          <span className="component-accordionSummary-label" style={{opacity: componentType ?1:0.5}}>
            {componentType ?? "Component Type"}
          </span>
        </div>
        <div>
        <span className="component-accordionSummary-label2 truncated-text" style={{opacity: componentType ?1:0.5}}>
        {descriptionContent.length > 56 ? `${descriptionContent.substring(0, 56)}...` : descriptionContent}
      </span>
        </div>
      </div>
      </div>
    </Typography>
  );
};

export default AccordionSummaryContent;
