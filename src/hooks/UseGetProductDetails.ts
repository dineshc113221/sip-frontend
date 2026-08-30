import { useQuery, useMutation } from "react-query";
import { useProductService } from "../adapters/Api";

interface IRawMaterialObject {
  rawMaterialId: string;
  tradeName: string;
  percentage: string;
}

interface IGetUseDoseResponse {
  _id: string;
  "Product Segment": string;
  "Product Sub-Segment": string;
  "Use Dose / g": string | null;
  "Use Scenario": string | null;
  "Water Use / L": string | null;
  "Starting Temperature / C": string | null;
  "Finishing Temperature / C": string | null;
  "Evaporated Water / %": string | null;
  "Density / g/cm3": string | null;
}



export const useGetProductDetailsAllList = (
  vsearch: string,
  type: "all" | "myproduct"
) => {
  const { getProductDetailsAllList } = useProductService();

  return useQuery(["ui-product-all-list",vsearch, type], () =>
    getProductDetailsAllList(vsearch, type)
  );
};

export const useGetProductDetailsMyProduct = (
  vsearch: string,
  type: "all" | "myproduct"
) => {
  const { getProductDetailsMyProduct } = useProductService();

  return useQuery(["ui-product-my-list",vsearch, type], () =>
    getProductDetailsMyProduct(vsearch, type)
  );
};
export const useGetProductDetailByID = (id: string) => {
  const { getProductDetailByID } = useProductService();

  return useQuery(["ui-product-detail-by-id",id], () => getProductDetailByID(id));
};
export const useGetProductDetailAuditReport = (id: string, isAssessment: boolean) => {
  const { getProductDetailAuditReport } = useProductService();

  return useQuery(["ui-product-detail-audit-report"], () => getProductDetailAuditReport(id,isAssessment));
};
export const useGetAssessmentDetailBySipID = (id: string) => {
  const { getAssessmentDetailBySipID } = useProductService();

  return useQuery(["ui-assessment-detail-by-sip-id",id], () => getAssessmentDetailBySipID(id));
};
export const useGetProductAssessmentDetailByID = (id: string, type: string) => {
  const { getProductAssessmentDetailByID } = useProductService();

  return useQuery(
    ["ui-product-assessment-detail-by-id", id, type],
    () => getProductAssessmentDetailByID(id, type),
    {
      enabled: !!id && !!type, // Ensures the query runs only when both id and type are present
    }
  );
};


export const useGetUseDoseValue = (
  productSegment: string,
  productSubSegment: string
) => {
  const { getUseDoseValue } = useProductService();

  // return useQuery(["ui-use-dose"], () =>getUseDoseValue(productSegment,productSubSegment))
  return useMutation<IGetUseDoseResponse>({
    mutationKey: ["ui-useDose", productSegment, productSubSegment],
    mutationFn: () => getUseDoseValue(productSegment, productSubSegment),
  });
};

export const useGetRawMaterialDataByKeyword = (
  searchTerm: string,
  page: number
) => {
  const { getRawMaterialDataByKeyword } = useProductService();

  return useMutation<IRawMaterialObject[]>({
    mutationKey: ["ui-rawMaterial", searchTerm],
    mutationFn: () => getRawMaterialDataByKeyword(searchTerm, page),
  });
};

export const useGetProductAssessmentResultByID = (
  product_id: string,
  assessment_id: string,
  type: string
) => {
  const { getProductAssessmentResultByID } = useProductService();

  return useQuery(["ui-product-assessment-result-by-id",product_id, assessment_id, type], () =>
    getProductAssessmentResultByID(product_id, assessment_id, type)
  );
};

export const useGetBaselineTableResults = (
  product_id: string,
  assessment_id: string,
  type: string
) => {
  const { getProductBaselineAssessmentResultByID } = useProductService();

  return useQuery(["ui-product-assessment-result-by-formulation-id",product_id,assessment_id,type], () =>
    getProductBaselineAssessmentResultByID(product_id, assessment_id, type)
  );
};
export const useGetProductDetailLogReport = (product_id: string, assessment_id: string) => {
  const { getProductDetailLogReport } = useProductService();

  return useQuery(["ui-product-detail-log-report", product_id, assessment_id], () => getProductDetailLogReport(product_id, assessment_id));
};
export const useGetLogsInputsDetails = (log_id: string) => {
  const { getLogsInputsDetails } = useProductService();

  return useQuery(["ui-product-log-input-details", log_id], () => getLogsInputsDetails(log_id));
}