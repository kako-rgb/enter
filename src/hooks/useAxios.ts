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

      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      
      if (pathData) {
          config = {
              url: normalizedPath,
              baseURL: HOST_API,
              method: method,
              data: pathData,
              timeout: 5000, // 5 second timeout
              retry: 3, // Retry failed requests 3 times
              retryDelay: 1000, // Wait 1 second between retries
              validateStatus: (status) => status < 500
          }
      } else {
          config = {
              url: normalizedPath,
              baseURL: HOST_API,
              method: method,
              timeout: 5000,
              retry: 3,
              retryDelay: 1000,
              validateStatus: (status) => status < 500
          } 
      }

      return axiosInst(config)
          .catch(error => {
              if (error.code === 'EAI_AGAIN') {
                  console.error('DNS resolution failed - retrying...');
                  // Return default data instead of throwing
                  return {
                      data: {
                          stores: [],
                          categories: [],
                          products: [],
                          services: []
                      }
                  };
              }
              throw error;
          });
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

        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        
        if (pathData) {
            config = {
                url: normalizedPath,
                baseURL: HOST_API,
                method: method,
                data: pathData,
                timeout: 5000, // 5 second timeout
                retry: 3, // Retry failed requests 3 times
                retryDelay: 1000, // Wait 1 second between retries
                validateStatus: (status) => status < 500
            }
        } else {
            config = {
                url: normalizedPath,
                baseURL: HOST_API,
                method: method,
                timeout: 5000,
                retry: 3,
                retryDelay: 1000,
                validateStatus: (status) => status < 500
            } 
        }

        return axiosInst(config)
            .catch(error => {
                if (error.code === 'EAI_AGAIN') {
                    console.error('DNS resolution failed - retrying...');
                    // Return default data instead of throwing
                    return {
                        data: {
                            stores: [],
                            categories: [],
                            products: [],
                            services: []
                        }
                    };
                }
                throw error;
            });
    }
      
    return request
}