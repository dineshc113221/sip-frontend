import { useEffect, useState } from "react";
import axios from "axios";
import { getLoggedInUserDetails } from "@consumer/core-login-ui-mf";

const useFetch = <T,>(url: string, token: string): [boolean, T | null] => {
  const [fetchedData, setFetchedData] = useState<T | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getAllFetchedData = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const loggedInUserDetails = getLoggedInUserDetails();
        data[0]['loggedInUserDetails'] = loggedInUserDetails;

        setFetchedData(data);
        setLoaded(true);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    // Only fetch if token exists and we haven't already fetched
    if (token && !fetchedData) {
      getAllFetchedData();
    }
  }, [fetchedData, token, url]);

  return [loaded, fetchedData];
};

export default useFetch;
