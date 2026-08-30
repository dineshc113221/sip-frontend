import React,{useEffect} from "react";
import { useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import { Context } from "../../utills/useContext";
import ProductAssessment from "./ProductAssessment.component";
import { useGetProductDetailByID } from "../../hooks/UseGetProductDetails";

const ProductDetail:React.FC = () => {
  const params = useParams();
  const { data , refetch } = useGetProductDetailByID(params.id);
   
  useEffect(()=>{
    refetch();
  },[refetch])

  return (
      <Context.Provider value={null}>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          <div>
            <div className="product-tab">
              {data ? ( <ProductAssessment productDetail = {data} refetch={refetch}/>
               
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
          <Divider></Divider>
        </div>
      </Context.Provider>
   
  );
};

export default ProductDetail;
