import axios from 'axios';

export enum REQUEST_METHOD {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  GET = 'GET',
}
export type Options = Partial<{ method: REQUEST_METHOD; params: any }>;
export type ApiResponse<T> = Promise<{
  data: any | undefined;
  error: (Partial<T> & { message: string; code: number }) | undefined;
}>;

const send = async (endpoint: string, payload: any, options?: Options) => {
  return axios(endpoint, {
    method: options?.method ?? REQUEST_METHOD.POST,
    data: payload,
    withCredentials: true,
    params: options?.params ?? undefined,
  });
};

const get = async (endpoint: string, options?: Options) => {
  return axios(endpoint, {
    method: REQUEST_METHOD.GET,
    withCredentials: true,
    params: options?.params,
  });
};

export const axiosInstance = {
  send,
  get,
};
