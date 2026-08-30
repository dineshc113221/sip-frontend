import React, { useEffect, useMemo, useState } from "react";
import { PostContext, Post, BasicUserInfo } from "./DataContext";
import useFetch from "./useFetch";
import { ApiEndPoints, ApiEndPointsURL } from "../../constants/ApiEndPoints.constant";

interface Props {
  children: React.ReactNode;
  loggedInUser: BasicUserInfo;
}

export default function DataProvider({ children, loggedInUser }: Readonly<Props>) {
  const apiURLS = ApiEndPointsURL;
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(loggedInUser?.accessToken || '');
  }, [loggedInUser]);
  const [loaded, data] = useFetch<Post[]>(`${apiURLS}${ApiEndPoints.master_data}`, token);
  

  const value = useMemo(() => ({
    loaded,
    globaldata: data,
    formulationData: data ? data[0]?.formulation : {},
    packagingData: data ? data[0]?.packaging : {},
    token,
    loggedInUser,
    setLoggedInUser: () => {}, 
  }), [loaded, data, token, loggedInUser]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}
