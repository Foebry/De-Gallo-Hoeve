import axios, { AxiosPromise } from 'axios';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import getData from 'src/hooks/useApi';
import { sleep } from 'src/shared/functions';
import { Options, REQUEST_METHOD } from 'src/utils/axios';
import { RevalidateOptions } from './app/klantContext';

export type SWROptions<T> = {
  maxRetries?: number;
  shouldRevalidate?: boolean;
  errorMessage?: string;
  fallbackData?: T;
};

type SWRCache = Record<string, Record<string, any>>;

type contextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  send: <T>(endpoint: string, payload: any, options?: Options) => AxiosPromise<T>;
  get: (endpoint: string, options?: Options) => AxiosPromise<any>;
  increase: () => void;
  decrease: () => void;
  useSWR: <T>(
    key: string,
    url?: string,
    options?: SWROptions<T>
  ) => {
    data?: T;
    error?: Partial<T> & { message: string; code: number };
    isLoading: boolean;
    revalidate: () => void;
  };
};

const defaultValues: contextType = {
  isLoading: false,
  setIsLoading: () => {},
  send: async () => ({} as AxiosPromise),
  get: async () => ({} as AxiosPromise),
  increase: () => {},
  decrease: () => {},
  useSWR: () => ({ isLoading: true, revalidate: () => null }),
};

export const AxiosContext = createContext<contextType>(defaultValues);

const AxiosProvider: React.FC<{ children: any }> = ({ children }) => {
  const [requestCount, setRequestCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(requestCount > 0);
  const swrCache = useRef<SWRCache>({});
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
    return execute(endpoint, { ...options, method: options?.method ?? REQUEST_METHOD.POST }, payload);
  };

  const get = async (endpoint: string, options?: Options) =>
    execute(endpoint, { ...options, method: REQUEST_METHOD.GET });

  const useSWR = <T extends unknown>(key: string, url?: string, options: SWROptions<T> = {}) => {
    const [error, setError] = useState<Partial<T> & { message: string; code: number }>();
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState<boolean>(false);
    const currentRetries = useRef<number>(0);
    const retries = options?.maxRetries ?? 5;

    const revalidate = () => {
      const entries = Object.entries(swrCache.current);
      const newCache: SWRCache = {};
      entries.forEach(([cacheKey, value]) => {
        if (cacheKey !== key) newCache[cacheKey] = value;
      });
      swrCache.current = newCache;
    };

    const retry = useRef<() => Promise<void>>(async () => {
      toast.error(options?.errorMessage ?? 'Fout bij ophalen van data');
      currentRetries.current += 1;
      await sleep(5);
      setError(error);
      if (!data) setData(options?.fallbackData);
    });

    useEffect(() => {
      (async () => {
        if (!url) return;

        const apiResultInCache = swrCache.current[key] && swrCache.current[key][url];
        const cachedResult = swrCache.current[key]?.[url];
        const canRetry = currentRetries.current < retries;

        if (apiResultInCache) {
          console.log({ apiResultInCache });
          return setData(cachedResult);
        }

        setLoading(true);
        while (canRetry) {
          const { data, error } = await getData<T>(url);
          if (error) {
            await retry.current();
            continue;
          } else if (data) {
            setData(data);
            swrCache.current = { ...swrCache.current, [key]: { ...swrCache.current[key], [url]: data } };
            break;
          }
        }
        setLoading(false);
      })();
    }, [key, url, retries, options]);

    return { data, error, isLoading: loading, revalidate };
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
