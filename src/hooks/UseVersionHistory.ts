import { useQuery } from "react-query";
import { useAdminVersionHistory, useProductResultData } from "../adapters/Api";

export const useFetchVersionHistory = () => {
  const { getVersionHistory } = useAdminVersionHistory();    
  return useQuery(["ui-version-history"], () => getVersionHistory());
};

export const useFetchUserAckVersion = (id) => {
    const { getUserAcknowledgedVersion } = useAdminVersionHistory();    
    return useQuery(["ui-user-ack-version"], () => getUserAcknowledgedVersion(id));
}

export const useFetchAssessmentBasedVersionHistory = (data) => {
  const { getVersionBasedAssessmentHistory } = useProductResultData();    
  return useQuery(["ui-assessment-version-history"], () => getVersionBasedAssessmentHistory(data));
};
