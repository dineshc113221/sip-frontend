import React, {  useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ProductDataProvider } from '../contexts/productData/ProductDataContext'
import { ResultDataProvider } from '../contexts/resultData/ResultDataContext'
import { ProductAssessmentDetail } from '../components/assessment-page';
import { useGetAssessmentDetailBySipID } from '../hooks/UseGetProductDetails';
import { CircularProgress, Box } from '@mui/material';

export const ProductAssessmentDetailsPage:React.FC = () => {
    const param = useParams();
  const { data: sipDataReponse, refetch, isLoading } = useGetAssessmentDetailBySipID(param.assessmentId);
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
    }, [sipDataReponse])
  

     React.useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
     }, []);
  
    useEffect(()=>{
      refetch();
    },[refetch,param.assessmentId])


  const isDataAvailable = !!(assessmentData?.assessmentId && assessmentData?.productId && assessmentData?.type);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress sx={{ color: '#00b097' }} />
        </Box>
      );
    }

    if (isDataAvailable) {
      return (
        <ProductDataProvider
          productId={assessmentData.productId}
          assessmentId={assessmentData.assessmentId}
          assessmentType={assessmentData.type}
        >
          <ResultDataProvider
            productId={assessmentData.productId}
            assessmentId={assessmentData.assessmentId}
            assessmentType={assessmentData.type}
          >
            <ProductAssessmentDetail />
          </ResultDataProvider>
        </ProductDataProvider>
      );
    }

    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <span style={{fontFamily: "kenvue-sans-regular"}}>No data available.</span>
      </Box>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
}