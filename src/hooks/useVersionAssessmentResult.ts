import { useQuery } from "react-query";
import { useProductResultData } from "../adapters/Api";

export const useFetchVersionBasedResult = (data) => {    
    const { getVersionBasedResult } = useProductResultData();    
    return useQuery(["ui-version-based-result"], () => getVersionBasedResult(data));
}
