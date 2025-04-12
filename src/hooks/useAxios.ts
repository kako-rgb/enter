import { HOST_API, isValidUrl } from '@/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { signOut } from 'next-auth/react';

export const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

type AxiosProps = {
    method: string,
    path: string,
    pathData?: any
}

const handleResponse = async (response: AxiosResponse) => {
  if (response.status === 401) {
    console.log('Error');
    if (typeof window !== 'undefined') {
      await signOut();
    }
  }
  return response;
};

export function axiosHandler(token?: string) {

  let config: AxiosRequestConfig ;
  
  let headers: RawAxiosRequestHeaders;
  
    if (token) {
      headers = {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      };
    } else {
      headers = {
        "Content-Type": "application/json",
      };
    }
   
  const axiosInst: AxiosInstance = axios.create({
      headers: headers,
      timeout: 200000,
  });
  
  
   
  function request({ method, pathData, path }: AxiosProps) {
      if (!HOST_API) {
          throw new Error('HOST_API is not defined');
      }

      // Ensure path starts with forward slash and is properly encoded
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      const encodedPath = encodeURI(normalizedPath);
      
      config = {
          url: encodedPath,
          baseURL: HOST_API,
          method: method,
          ...(pathData && { data: pathData })
      };

      return axiosInst(config);
  }
    
    return request
}

export default function useAxios(token?: string) {

    let config: AxiosRequestConfig ;
    
    let headers: RawAxiosRequestHeaders;
    
      if (token) {
        headers = {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        };
      } else {
        headers = {
          "Content-Type": "application/json",
        };
      }
     
    const axiosInst: AxiosInstance = axios.create({
        headers: headers,
        timeout: 200000,
    });
    

    axiosInst.interceptors.response.use(async function (response) {
      return await handleResponse(response);
    });
    
     
    function request({ method, pathData, path }: AxiosProps) {
        if (!HOST_API) {
            throw new Error('HOST_API is not defined');
        }

        // Ensure path starts with forward slash and is properly encoded
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const encodedPath = encodeURI(normalizedPath);
        
        config = {
            url: encodedPath,
            baseURL: HOST_API,
            method: method,
            ...(pathData && { data: pathData })
        };

        return axiosInst(config);
    }
      
    return request
}