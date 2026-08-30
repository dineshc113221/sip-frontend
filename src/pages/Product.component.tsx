import React, { useEffect } from "react";
import ProductTabsComponent from "../components/dashboard/ProductTab.component";
import { useGetProductDetailsMyProduct } from "../hooks/UseGetProductDetails";
import { Context } from "../utills/useContext";
import { ProductComponentProp } from "../components/breadcrumb/types";
import { useLoading } from "../contexts/loadingPage/LoadingContext";
import Loading from "react-loading";

const ProductComponent: React.FC<ProductComponentProp> = (productValue) => {
  const { data, refetch, isLoading } = useGetProductDetailsMyProduct(
    productValue.is_search,
    "myproduct"
  );
 const { setLoading } = useLoading();
  useEffect(() => {
    refetch();
    isLoading ? setLoading(true) : setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productValue, refetch,isLoading]);
  const loadingData = () => {
    if (isLoading) {
     return <Loading type="balls" color="#000000" height={20} width={20}/>
    } 
    else {
     return <p>No data available</p>
    }
  }
  return (
    <Context.Provider value={null}>
      <div
        style={{
          paddingBottom: "10px",
        }}
      >
        <div>
          <div className="product-tab" style={{ marginTop: "20px" }}>
            {data ? (
              <ProductTabsComponent
                product={data?.data}
                selectedValue={productValue.selectedValu}
                refetch={refetch}
              />
            ) : loadingData()
            }
          </div>
        </div>
      </div>
    </Context.Provider>
  );
};

export default ProductComponent;
