import React, { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductDataProvider } from "../contexts/productData/ProductDataContext";
import ViewAllResults from "../components/results/ViewAllResults.component";
import { ResultDataProvider } from "../contexts/resultData/ResultDataContext";
import { useGetAssessmentDetailBySipID } from "../hooks/UseGetProductDetails";
import { ConsumerPackagingProvider } from "../components/consumer-packaging-tab/ConsumerPackagingContext";

export const ViewAllResultsPage: React.FC = () => {
  const param = useParams();
  const { data:sipDataReponse,  refetch } = useGetAssessmentDetailBySipID(param.assessmentId);
  const assessmentData = useMemo(()=>{
    let sipData = {
      assessmentId: "",
      productId:"",
      assessmentType:""
    }
    if(sipDataReponse){
      sipData = sipDataReponse[0];
    }
    return {
      assessmentId:sipData?.assessmentId,
      productId:sipData?.productId,
      type: sipData?.assessmentType
    };
  },[sipDataReponse])

  
  useEffect(()=>{
    refetch();
  },[refetch,param.assessmentId])

  return (
    <>
       {(assessmentData.assessmentId && assessmentData.productId && assessmentData.type) ?
         <ProductDataProvider productId={assessmentData.productId} assessmentId={assessmentData.assessmentId} assessmentType={assessmentData.type}>
          <ResultDataProvider productId={assessmentData.productId} assessmentId={assessmentData.assessmentId} assessmentType={assessmentData.type}> 
            <ConsumerPackagingProvider>
              <ViewAllResults />
            </ConsumerPackagingProvider>
          </ResultDataProvider>
        </ProductDataProvider>
        :
        (<p>No data available</p>)}
    </>
  );
};
