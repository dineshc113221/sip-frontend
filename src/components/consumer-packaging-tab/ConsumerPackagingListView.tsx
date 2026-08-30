import React from "react";
import { styled } from "@mui/material/styles";
import "../../assets/css/SIP.css";
import "../../assets/css/tiles.scss";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  WARNING_MSG_CHANGE_VALUE,
  WARNING_MSG_DELETE_PACKAGING_COMPONENT
} from "../../constants/ExperimentalTooltip.constant";
import DialogBox from "../../controls/DialogBox";
import PopupImportPCspec from "../breadcrumb/PopupComponentImportPCspec";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import ImportComponent from "./ImportComponent";
import AccordionSummaryContent from "./AccordionSummaryContent";
import AccordionHeader from "./AccordianHeader";
import {ConsumerPackagingListViewProps} from "../../structures/packaging";
import "./packaging.css";
import { PackagingComponent } from "./PackagingComponent";
import "../../assets/css/ConsumerPackingComponent.scss"
import {PackagingTable,usePackaging} from ".";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `1px solid black`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  borderRadius: `24px`,
}));

export const ConsumerPackagingListView: React.FC<
  ConsumerPackagingListViewProps
> = ({
  componentId,
  packagingtype,
  title,
  componentData,
  isNewComponent,
  expanded,
  onExpand
}) => {
  const {
    importComponentDialogOpen,
    dialogKey,
    deletePopupOpen,
    isSaved,
    changedFieldsPopupOpen,
    errors,
    isImportData,
    handleCloseChangeDailog,
    handleContinueChangevlaue,
    handleCloseImportComponentDialog,
    handleOpenImportComponentPopup,
    handleOpenDeletePopup,
    handleChangeAccordion,
    imageSrc,
    imageClassName,
    updateSaveButtonState,
    callChildComponentData,
    handleDelete,
    setErrors,
    handleCloseDeletePopup,
    isDeleteButtonHide,
    isImportDataCheck
  } = usePackaging(
    isNewComponent,
    packagingtype,
    componentId,
    componentData
    );
  
  
  return (
    <button
      style={{
        all: "unset",
        marginTop: "15px",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      onClick={() => { !expanded && onExpand(componentId, false) }} 
    >
      <Accordion
        expanded={expanded}
        onChange={handleChangeAccordion}
      >
        <AccordionSummary
          expandIcon={null}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ cursor: "default", "&:hover": { cursor: "default" } }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <AccordionHeader
              expanded={expanded}
              componentheader={title}
              handleOpenDeletePopup={handleOpenDeletePopup}
              componentId={componentId}
              handleExpandClick={onExpand}
              isData={!componentData?.isDataComplete}
            />
            <AccordionSummaryContent
              expanded={expanded}
              imageSrc={imageSrc}
              imageClassName={imageClassName}
              componentType={componentData.component_type !== ""?componentData.component_type:null}
              description={componentData.description !== ""?componentData.description:null}
              isSaved={isSaved}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <ImportComponent
            handleOpenImportComponentPopup={handleOpenImportComponentPopup}
            isSaved={isSaved}
            index={componentId}
            type={packagingtype}
            componentData={componentData}
            isImportData={isImportData}
          />
          <PackagingComponent isNewComponent={isNewComponent} componentData={componentData}
            componentId={componentId} packagingtype={packagingtype} isImportDataCheck={isImportDataCheck} />
          <PackagingTable
            isImportData={isImportData}
            updateSaveButtonState={updateSaveButtonState}
            isSaved={isSaved} // Pass the saved state to PackagingTable
            subComponent={componentData?.sub_components}
            errors={errors}
            setErrors={setErrors}
            componentId={componentId}
            packagingtype={packagingtype}
            isAdd={componentData._id === undefined}
            isEdited={componentData.isEdited}
            componentDataSend={componentData}
          />
        </AccordionDetails>
      </Accordion>
      {/** START CODE - IMPORT COMPONENT POPUP */}
      <PopupImportPCspec
        key={dialogKey}
        open={importComponentDialogOpen}
        onClose={handleCloseImportComponentDialog}
        sendToParentComponent={callChildComponentData}
      />
      {/** START CODE - DELETE POPUP */}
      <DialogBox
        text={WARNING_MSG_DELETE_PACKAGING_COMPONENT}
        buttonOneText="Cancel"
        buttonTwoText="Continue"
        open={deletePopupOpen}
        onClose={handleCloseDeletePopup}
        onClick={handleDelete}
        isDeleteButtonHide={isDeleteButtonHide}
      />

      {/** END CODE - DELETE POPUP */}
      <DialogBox
        text={WARNING_MSG_CHANGE_VALUE}
        buttonOneText="Cancel"
        buttonTwoText="Continue"
        open={changedFieldsPopupOpen}
        onClose={handleCloseChangeDailog}
        onClick={handleContinueChangevlaue}
      />
    </button>
  );
};