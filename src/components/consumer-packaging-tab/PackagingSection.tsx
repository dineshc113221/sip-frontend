/* eslint-disable react-hooks/exhaustive-deps */
// PackagingSection.tsx
import React, { useContext, useEffect, useState } from "react";
import plusicon from "../../assets/images/add-icon.svg";
import Tooltipcommon from "../../controls/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { PackagingSectionProps } from "../../structures/packaging";
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { CheckCRUDAccess } from "../../helper/GenericFunctions";
import { Tooltip, Button } from "@mui/material";
import {
  useConsumerPackagingContext,
  ConsumerPackagingListView,
} from "../consumer-packaging-tab";

const PackagingSection: React.FC<PackagingSectionProps> = React.memo(
  ({ title, counter, components, onAddComponent }) => {
    const [expandedComponentId, setExpandedComponentId] = useState<
      number | null
    >(null);
    const [addCom, setAddCom] = useState<boolean>(false);
    const {
      primaryData,
      secondaryData,
      counterPrimary,
      counterSecondary,
      isSaveEnabled,
      resetData,
      isOneTimeSaveDone
    } = useConsumerPackagingContext();
    const { usersData } = useContext(ProductDataContext);
    const handleAddComponent = () => {
      onAddComponent();
      setAddCom(true);
    };

    useEffect(() => {
      if (resetData) {
        setExpandedComponentId(null);
      }
    }, [resetData]);

  useEffect(()=>{
    if(!isSaveEnabled && addCom){
      setAddCom(false)
    }
  
  },[isSaveEnabled])

  useEffect(()=>{
    if(!isSaveEnabled && (counterPrimary !==0 || counterSecondary !== 0) && !addCom){
      setExpandedComponentId(null)
    }else{
    if(title === "Primary"){
      setExpandedComponentId(counterPrimary -1)
    }
    if(title === "Secondary"){
      setExpandedComponentId(counterSecondary -1)
     }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[counterSecondary,counterPrimary]);
  
  const onExpandClick = (index:number,isEditClick:boolean) =>{
    if(index === expandedComponentId && !isEditClick){
      setExpandedComponentId(null)
    }
    else{
      setExpandedComponentId(index)
    }
  }
   return (
    <div className="packing-section-main">
      <div className="packaging-component-div1">
        <div className="packaging-component-div2">
          <span className="header packaging-component-span">
            {title} Packaging Components
          </span>
          <Tooltipcommon
            content={`Record the number of ${title.toLowerCase()} packaging components that you
            will be assessing for this product.`}
              direction={"packaging-componenets"}
            >
              <InfoIcon />
            </Tooltipcommon>
          </div>
        </div>
        {counter < 10 && (
          <Tooltip
            title={
              CheckCRUDAccess(usersData, "consumer_packaging") === 0
                ? "You don't have permission"
                : ""
            }
            placement="top"
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  color: "black", // Text color
                  backgroundColor: "white", // Background color
                  border: "1px solid black", // Border color
                  borderRadius: "10px 10px 10px 10px",
                  padding: "8px 12px",
                  transform: "translateX(10px) translateY(-10px)", // Position adjustment
                  margin: "0",
                },
              },
            }}
          >
            <div className="packaging-add-new">
              <span>
                <Button
                  onClick={handleAddComponent}
                  style={{
                    textDecoration: "none",
                    fontSize: "16px",
                    fontFamily: "kenvue-sans-regular",
                    fontWeight: "400",
                    textTransform: "none",
                    color: "black",
                    cursor:
                      CheckCRUDAccess(usersData, "consumer_packaging") === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  endIcon={<img src={plusicon} alt="" />}
                  disabled={
                    CheckCRUDAccess(usersData, "consumer_packaging") === 0
                  }
                >
                  Add {title.toLowerCase()} packaging component
                </Button>
              </span>
            </div>
          </Tooltip>
        )}
        {title === "Primary" &&
          primaryData?.length !== 0 &&
          components?.map((component, index) => (
            <ConsumerPackagingListView
              key={component._id ? component._id : index}
              componentId={index}
              packagingtype={title}
              title={`Component #${index + 1}`}
              componentData={component}
              isNewComponent={!component._id}
              expanded={index === expandedComponentId}
              onExpand={onExpandClick}
              isOneTimeSaveDone={index+ 1 === components.length? false : isOneTimeSaveDone}
            />
          ))}
        {title === "Secondary" &&
          secondaryData?.length !== 0 &&
          components?.map((component, index) => (
            <ConsumerPackagingListView
              key={component._id ? component._id : index}
              componentId={index}
              packagingtype={title}
              title={`Component #${index + 1}`}
              componentData={component}
              isNewComponent={!component._id}
              expanded={index === expandedComponentId}
              onExpand={onExpandClick}
              isOneTimeSaveDone={index+ 1 === components.length? false : isOneTimeSaveDone}
            />
          ))}
      </div>
    );
  }
);

export default PackagingSection;
