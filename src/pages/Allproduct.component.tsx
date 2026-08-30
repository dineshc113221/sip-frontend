import React,{useEffect} from "react";
import { Context } from "../utills/useContext";
import AllProductTabsComponent from "../components/dashboard/AllProductTab.component";
import { useGetProductDetailsAllList } from "../hooks/UseGetProductDetails";
import {ProductComponentProp} from "../components/breadcrumb/types";
import { useLoading } from "../contexts/loadingPage/LoadingContext";

const AllProductComponent:React.FC<ProductComponentProp> = (productValue) => {
  const { data,refetch, isLoading } = useGetProductDetailsAllList(productValue.is_search,'all');
  const { setLoading } = useLoading();

  useEffect(() => {
    isLoading ? setLoading(true) : setLoading(false);
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[productValue,isLoading])


  return (
      <Context.Provider value={null}>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          <div>
            <div className="product-tab">
              {data ? (
                <AllProductTabsComponent
                  product={data?.data}
                  selectedValue={productValue?.selectedValu || ""}
                  refetch = {refetch}
                />
              ) : (
                <p style={{fontFamily:"kenvue-sans-regular",fontSize:'19.02px'}}>No data available</p>
              )}
            </div>
          </div>
        </div>
      </Context.Provider>
    
  );
};

export default AllProductComponent;