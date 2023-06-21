import axios, { AxiosPromise } from 'axios';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import getData from 'src/hooks/useApi';
import { sleep } from 'src/shared/functions';
import { Options, REQUEST_METHOD } from 'src/utils/axios';
import { RevalidateOptions } from './app/klantContext';

type contextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  send: <T>(endpoint: string, payload: any, options?: Options) => AxiosPromise<T>;
  get: (endpoint: string, options?: Options) => AxiosPromise<any>;
  increase: () => void;
  decrease: () => void;
  useSWR: <T>(
    url: string,
    shouldRevalidate: boolean,
    options?: RevalidateOptions,
    errorMessage?: string,
    fallbackData?: T
  ) => {
    data?: T;
    error?: Partial<T> & { message: string; code: number };
    loading: boolean;
  };
};

const defaultValues: contextType = {
  isLoading: false,
  setIsLoading: () => {},
  send: async () => ({} as AxiosPromise),
  get: async () => ({} as AxiosPromise),
  increase: () => {},
  decrease: () => {},
  useSWR: () => ({ loading: true }),
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

  const useSWR = <T extends unknown>(
    url: string,
    shouldRevalidate: boolean,
    options?: RevalidateOptions,
    errorMessage?: string,
    fallbackData?: T
  ) => {
    const [error, setError] = useState<Partial<T> & { message: string; code: number }>();
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState<boolean>(false);
    const currentRetries = useRef<number>(0);
    const retries = options?.maxRetries ?? 5;

    const retry = useRef<() => Promise<void>>(async () => {
      toast.error(errorMessage ?? 'Fout bij ophalen van data');
      currentRetries.current += 1;
      await sleep(5);
      setError(error);
      if (!data) setData(fallbackData);
    });

    useEffect(() => {
      (async () => {
        if (!shouldRevalidate) return;

        setLoading(true);
        while (currentRetries.current < retries) {
          const { data, error } = await getData<T>(url);
          if (error) {
            await retry.current();
            continue;
          } else if (data) {
            setData(data);
            break;
          }
        }

        setLoading(false);
      })();
    }, [retries, url, shouldRevalidate, errorMessage]);

    return { data, error, loading };
  };

  return (
    <AxiosContext.Provider
      value={{
        isLoading,
        setIsLoading,
        increase,
        decrease,
        send,
        get,
        useSWR,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;

export const useAxiosContext = () => useContext(AxiosContext);
