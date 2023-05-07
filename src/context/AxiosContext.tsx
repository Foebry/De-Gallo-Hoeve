import axios, { AxiosPromise } from 'axios';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Options, REQUEST_METHOD } from 'src/utils/axios';

type contextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  send: (endpoint: string, payload: any, options?: Options) => AxiosPromise<any>;
  get: (endpoint: string, options?: Options) => AxiosPromise<any>;
  increase: () => void;
  decrease: () => void;
};

const defaultValues: contextType = {
  isLoading: false,
  setIsLoading: () => {},
  send: async (endpoint: string, payload: any, options?: Options) => ({} as AxiosPromise),
  get: async (endpoint: string, options?: Options) => ({} as AxiosPromise),
  increase: () => {},
  decrease: () => {},
};

export const AxiosContext = createContext<contextType>(defaultValues);

const AxiosProvider: React.FC<{ children: any }> = ({ children }) => {
  const [requestCount, setRequestCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(requestCount > 0);
  const increase = () => setRequestCount((counter) => (counter += 1));
  const decrease = () => setRequestCount((counter) => (counter -= 1));

  useEffect(() => {
    setIsLoading(requestCount > 0);
  }, [requestCount]);

  const execute = async (endpoint: string, options: Options, payload?: string) => {
    return axios(endpoint, {
      method: options.method!,
      data: payload,
      params: options.params,
      withCredentials: true,
    });
  };

  const send = async (endpoint: string, payload: string, options?: Options) => {
    return execute(
      endpoint,
      { ...options, method: options?.method ?? REQUEST_METHOD.POST },
      payload
    );
  };

  const get = async (endpoint: string, options?: Options) =>
    execute(endpoint, { ...options, method: REQUEST_METHOD.GET });

  return (
    <AxiosContext.Provider
      value={{
        isLoading,
        setIsLoading,
        increase,
        decrease,
        send,
        get,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;

export const useAxiosContext = () => useContext(AxiosContext);
