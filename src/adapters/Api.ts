import { IHeadersType } from "../models/Common.model";
import { ApiEndPointsURL, ApiEndPoints } from "../constants/ApiEndPoints.constant";
import { useGlobaldata } from "../contexts/masterData/DataContext";
import { get, getFileBlob, post } from ".";
import axios from "axios";

const getApiHeaders = (userId: string = ""): IHeadersType => ({
  "x-consumer-userId": userId,
  "x-consumer-system": "myApp",
  "x-consumer-correlationId": "test-1",
  "x-consumer-timestamp": new Date().toISOString(),
});

const apiBaseUrl = ApiEndPointsURL;

export const useProductService = () => {
  const { loggedInUser } = useGlobaldata();
  const token = loggedInUser?.accessToken || "";
  const getProductDetailsAllList = async (
    search: string,
    type: "all" | "myproduct"
  ) => {
    const apiUrl =
      search !== ""
        ? `${apiBaseUrl}${ApiEndPoints.product_all_list}/search/${search}?type=${type}`
        : `${apiBaseUrl}${ApiEndPoints.product_all_list}`;
    const headers = getApiHeaders();

    headers["x-consumer-userId"] = "";
    const productList = await get(apiUrl, headers, token);
    return productList;
  };
  const getProductDetailsMyProduct = async (
    search: string,
    type: "all" | "myproduct"
  ) => {
    const apiUrl =
      search !== ""
        ? `${apiBaseUrl}${ApiEndPoints.product_all_list}/search/${search}?type=${type}`
        : `${apiBaseUrl}${ApiEndPoints.product_my_product}`;

    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const productMyList = await get(apiUrl, headers, token);
    return productMyList;
  };
  const getProductDetailByID = async (id: string) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.product_detail_by_id}${id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const productDetails = await get(apiUrl, headers, token);
    return productDetails;
  };

  const getProductDetailAuditReport = async (id: string, isAssessment: boolean) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.product_detail_audit_report}/${id}?isAssessment=${isAssessment}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";

    const productDetails = await getFileBlob(apiUrl, headers, token);
    return productDetails;
  };
  const getProductAssessmentDetailByID = async (
    id: string,
    type: string
  ) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.assessment_detail_by_id}${type}/${id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const productDetails = await get(apiUrl, headers, token);
    return productDetails;
  };
  const getAssessmentDetailBySipID = async (id: string) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.assessment_detail_by_sip_id}${id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const productDetails = await get(apiUrl, headers, token);
    return productDetails;
  };
  const getRawMaterialDataByKeyword = async (
    searchTerm: string,
    page: number
  ) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.get_rawMaterial}?limit=1000&page=${page}&initialValue=${searchTerm}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const searchSuggestions = await get(apiUrl, headers, token);
    return searchSuggestions;
  };
  const getExperimentalDetails = async () => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.experimental}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const experimetnalList = await get(apiUrl, headers, token);
    return experimetnalList;
  };

  const getExperimentalAssementDetails = async (id: string) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.getExperimentalAssessment}${id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const experimetnalAssessmentList = await get(apiUrl, headers, token);
    return experimetnalAssessmentList;
  };

  const getProductAssessmentResultByID = async (
    product_id: string,
    assessment_id: string,
    type: string
  ) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.calculate_result_by_id}/${type}/${product_id}/${assessment_id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const productDetails = await get(apiUrl, headers, token);
    return productDetails;
  };

  const getProductBaselineAssessmentResultByID = async (
    product_id: string,
    assessment_id: string,
    type: string
  ) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.calculate_formulation_result_by_id}/${type}/${product_id}/${assessment_id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const productDetails = await get(apiUrl, headers, token);
    return productDetails;
  };

  const getUseDoseValue = async (
    productSegment: string,
    productSubSegment: string
  ) => {
    const apiUrl =
      productSegment !== "" &&
      productSubSegment !== "" &&
      `${apiBaseUrl}${ApiEndPoints.get_useDose}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const body = {
      productSegment: productSegment,
      productSubSegment: productSubSegment,
    };
    const useDoseValue = await post(apiUrl, headers, body, token);
    return useDoseValue;
  };
  const getProductDetailLogReport = async (product_id: string, assessment_id: string) => {
    if (!product_id || !assessment_id) {
      return null;
    }
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.product_detail_log_report}/${product_id}/${assessment_id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";

    const productDetails = await get(apiUrl, headers, token);
    return productDetails;
  };
  const getLogsInputsDetails = async (log_id: string) => {
    if (!log_id) {
      return null;
    }
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.product_detail_log_input}/${log_id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const ProductLogsInput = await get(apiUrl, headers, token);
    return ProductLogsInput;
  }
  return {
    getProductDetailsAllList,
    getProductDetailsMyProduct,
    getProductDetailByID,
    getProductDetailAuditReport,
    getProductAssessmentDetailByID,
    getAssessmentDetailBySipID,
    getRawMaterialDataByKeyword,
    getExperimentalDetails,
    getExperimentalAssementDetails,
    getProductAssessmentResultByID,
    getProductBaselineAssessmentResultByID,
    getUseDoseValue,
    getProductDetailLogReport,
    getLogsInputsDetails
  };
};

export const useProductResultData = () => {
  const { loggedInUser } = useGlobaldata();
  const token = loggedInUser?.accessToken || "";

  const getVersionBasedResult = async (data) => {
    const { productId, assessmentId, assessmentType, versionNumber } = data;
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.version_based_product_result}/${assessmentType}/${productId}/${assessmentId}/${versionNumber}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const versionHistoryData = await get(apiUrl, headers, token);
    return versionHistoryData;
  }

  const getVersionBasedAssessmentHistory = async (data) => {
    const { productId, assessmentId, assessmentType } = data;
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.version_based_assessment_history}/${assessmentType}/${productId}/${assessmentId}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const versionHistoryData = await get(apiUrl, headers, token);
    return versionHistoryData;
  }

  return {
    getVersionBasedResult,
    getVersionBasedAssessmentHistory
  }

}

export const useAdminVersionHistory = () => {
  const { loggedInUser } = useGlobaldata();
  const token = loggedInUser?.accessToken || "";

  const getVersionHistory = async () => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.admin_version_history}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const versionHistoryData = await get(apiUrl, headers, token);
    return versionHistoryData;
  }

  const postVersionHistory = async (formPayload) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.admin_version_history}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const versionHistoryData = await post(apiUrl, headers, formPayload, token);
    return versionHistoryData;
  }

  const getUserAcknowledgedVersion = async (id) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.user_acknowledge_version}/${id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const userAckVersion = await get(apiUrl, headers, token);
    return userAckVersion;
  }

  const postUserAcknowledgedVersion = async (id, data) => {
    const apiUrl = `${apiBaseUrl}${ApiEndPoints.user_acknowledge_version}/${id}`;
    const headers = getApiHeaders();
    headers["x-consumer-userId"] = "";
    const userAckVersion = await post(apiUrl, headers, data, token);
    return userAckVersion;
  }

  return {
    getVersionHistory,
    postVersionHistory,
    getUserAcknowledgedVersion,
    postUserAcknowledgedVersion
  }
}

export const useStorageFileReader = () => {
  const { loggedInUser } = useGlobaldata();
  const token = loggedInUser?.accessToken || "";

  const getFileFromStorage = async (filename) => {
    const apiUrl = `${ApiEndPointsURL}${ApiEndPoints.get_change_log}/${encodeURIComponent(filename)}`;
    const res = await axios.get(apiUrl, {
          responseType: "blob", 
          headers: { Authorization: `Bearer ${token}` },
   });
    return res;
  }

  return {
    getFileFromStorage
  }
} 