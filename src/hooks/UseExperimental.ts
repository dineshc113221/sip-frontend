import { useQuery } from "react-query";
import { useProductService } from "../adapters/Api"; // Update the path as needed

export const useGetExperimentalDetails = () => {
  const { getExperimentalDetails } = useProductService();
  return useQuery(["ui-experimental"], () => getExperimentalDetails());
};
export const useGetExperimentalAssessmentDetails = (id: string) => {
  const { getExperimentalAssementDetails } = useProductService();
  return useQuery(["ui-experimental-assessment", id], () => getExperimentalAssementDetails(id));
};
