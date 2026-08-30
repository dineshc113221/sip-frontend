import React, { useContext, useMemo } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { PackagingComponentData } from "../../structures/packaging";
import { useConsumerPackagingContext } from "./ConsumerPackagingContext";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { CheckCRUDAccess } from "../../helper/GenericFunctions";

export interface ImportComponentProps {
  handleOpenImportComponentPopup: () => void;
  type: 'Primary' | 'Secondary';
  isSaved: boolean;
  index:number
  componentData:PackagingComponentData;
  isImportData:boolean;
}

const ImportComponent: React.FC<ImportComponentProps> = ({
  handleOpenImportComponentPopup,
  isSaved,
  type,
  index,
  componentData,
  isImportData,
}) => {
  const { handleChange } = useConsumerPackagingContext();
  const { assessmentsType, usersData } = useContext(ProductDataContext);

  //for temporary Disable lock fetaure in future we can add this for baseline and final
  const isFieldDisabled = false;

  // Determine if the import button should be enabled
  const isImportButtonEnabled = useMemo(() => {
    if (CheckCRUDAccess(usersData, "consumer_packaging") === 0) {
       return false;
    }
    // later final and baseline condition we can remove from here 
    else if (assessmentsType === "experimental" || assessmentsType === "final" || assessmentsType === "baseline") {
      return true;
    }
    return !!(componentData.fieldsExist ? componentData.fieldsExist.pc_nm : true);
  }, [assessmentsType, componentData,usersData]);


  const handleImportClick = () => {
    handleOpenImportComponentPopup();
  };

  const renderPCSpecField = () => {
    return (
      <div style={{ width: "135px" }}>
        <Typography
          fontWeight="700"
          fontSize={"13.33px"}
          sx={{
            fontFamily: "kenvue-sans",
            fontWeight: "700",
            color:'#000000'
          }}
          variant="subtitle1"
        >
          PC Spec {isFieldDisabled  && componentData.isEdited && ` (Edited)`}
        </Typography>
        <TextField
          className="disabledfield"
          variant="standard"
          sx={{
            "& .MuiInput-underline:before": { borderBottom: "2px solid black" },
            "& .MuiInput-underline.Mui-disabled:before": { borderBottom: "2px solid black" },
            "& .MuiInput-underline:after": { borderBottom: "2px solid black" },
            "& .MuiInput-underline:focus:after": { borderBottom: "2px solid black" },
            "& .MuiInput-underline:hover:before": { borderBottom: "2px solid black" }, "& .MuiInputBase-input": {
                  fontFamily: "kenvue-sans-regular !important",
                  fontSize:'16px !important'
                }
          }}
          value={componentData.pc_nm}
          name={`pc_nm_${index}`}
          InputProps={{ readOnly: true }}
          inputProps={{ readOnly: true }}
          disabled
        />
      </div>
    );
  };

  const renderImportButton = () => {
    return (
      <div
        style={{
          width: "184px",
          cursor: isSaved ? "not-allowed" : "pointer", // Set cursor based on isSaved state
        }}
      >
        {isImportButtonEnabled && (
          <Button
            onClick={handleImportClick}
            style={{
              textDecoration: "none",
              fontFamily: "kenvue-sans-regular",
              fontWeight: "400",
              lineHeight: "30px",
              textTransform: "none",
              color: "black",
              borderColor: "black",
              borderRadius: "27px",
              marginTop: "0px",
              minHeight:"52px",
              cursor: isSaved ? "not-allowed" : "pointer", // Set cursor based on isSaved state
            }}
            variant="outlined"
            disabled={isSaved}
            className="disabledfield"
          >
            Import Component
          </Button>
        )}
      </div>
    );
  };

  const renderDescriptionField = () => {
    return (
      <div className="packing-description-field">
        <Typography
          fontWeight="700"
          fontSize={"13.33px"}
          sx={{
            fontFamily: "kenvue-sans",
            fontWeight: "700",
            color:'#000000'
          }}
          variant="subtitle1"
          className="description"
        >
          Component Description
        </Typography>
        <TextField
          className="disabledfield"
          multiline
          maxRows={2}
          style={{
            fontFamily: "kenvue-sans-regular",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "1.5",
            color: isFieldDisabled && componentData.fieldsExist?.description ? "gray" : "",
          }}
          variant="standard"
          inputProps={{
            maxLength: 150,
            pattern: ".*"
          }}
          sx={{
            width:"631px",
            "&:disabled": { borderBottom: "2px solid black" },
            "& .MuiInputBase-root": {
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              color: isFieldDisabled && componentData.fieldsExist?.description ? "gray" : "",
            },
            "& .MuiInput-underline.Mui-disabled:before": {
              borderBottom: "2px solid black",
              color: isFieldDisabled && componentData.fieldsExist?.description ? "gray" : "",
            },
            "& .MuiInput-input" :{
  fontFamily: "kenvue-sans-regular",
        fontWeight: "400"
}
          }}
          name={`description_${index}`}
          value={componentData.description}
          onChange={(e) =>
            handleChange(e, type, componentData._id === undefined, isImportData)
          }
          disabled={(isFieldDisabled && componentData.fieldsExist?.description) || CheckCRUDAccess(usersData, "consumer_packaging") === 0}
        />
      </div>
    );
  };

  return (
    <div className="packing-accordiondetails-importComponent">
      {renderPCSpecField()}
      {renderImportButton()}
      {renderDescriptionField()}
    </div>
  );
};

export default ImportComponent;
