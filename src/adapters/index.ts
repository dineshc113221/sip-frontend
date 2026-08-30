import axios from "axios";
import { IHeadersType } from "../models/Common.model";


export async function get(url:string, additionalHeaders:IHeadersType,token:string) {
  
  const headers = {
    'Authorization': `Bearer ${token}`, // Add token to headers
    ...additionalHeaders, // Add any other headers passed
  };

  const response = await axios.get(url, {
    method: "GET",
    headers,
  });
  const data = await response.data;
  return data;
}

export async function getFileBlob(url, additionalHeaders,token:string) {
  
  const headers = {
    'Authorization': `Bearer ${token}`, // Add token to headers
    ...additionalHeaders, // Add any other headers passed
  };
  return await axios.get(url, {
    method: "GET",
    headers,
    responseType: "blob",
  });
}

export async function post<T>(url:string, additionalHeaders:IHeadersType, body:T,token:string) {
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json', // Ensure the correct content type
    ...additionalHeaders,
  };

  return axios
    .post(url, body, { headers })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
}

export async function put<T>(url:string, additionalHeaders:IHeadersType, body:T,token:string) {
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  return axios
    .put(url, body, { headers })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
}
