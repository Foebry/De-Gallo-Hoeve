import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { HondDto } from 'src/common/api/types/hond';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { sleep } from 'src/shared/functions';
import { PaginatedData } from 'src/shared/RequestHelper';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { defaultApiResponse, emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

type HondContext = {
  isLoading: boolean;
  disabled: boolean;
  getHonden: () => ApiResponse<HondDto[]>;
  getHondById: (id: string) => ApiResponse<HondDto>;
  updateHond: (hondDto: HondDto) => ApiResponse<HondDto>;
  postHond: (hondDto: HondDto) => ApiResponse<HondDto>;
  deleteHond: (hondDto: HondDto) => ApiResponse<{}>;
  useGetPaginatedHonden: (
    options?: RevalidateOptions,
    url?: string
  ) => { data: PaginatedData<HondDto>; isLoading: boolean };
  useGetHondDetail: (
    options?: RevalidateOptions,
    url?: string
  ) => { data: HondDto | null; isLoading: boolean };
};

const defaultValues: HondContext = {
  isLoading: false,
  disabled: false,
  getHonden: async () => defaultApiResponse,
  getHondById: async () => defaultApiResponse,
  updateHond: async () => defaultApiResponse,
  postHond: async () => defaultApiResponse,
  deleteHond: async () => defaultApiResponse,
  useGetPaginatedHonden: () => ({ data: emptyPaginatedResponse, isLoading: false }),
  useGetHondDetail: () => ({ data: null, isLoading: false }),
};

export const HondContext = createContext<HondContext>(defaultValues);

const HondProvider: React.FC<{ children: any }> = ({ children }) => {
  const [paginatedHonden, setPaginatedHonden] = useState<PaginatedData<HondDto>>();
  const [hondDetail, setHondDetail] = useState<HondDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [lastPaginatedUrl, setLastPaginatedUrl] = useState<string>();
  const [revalidateHonden, setRevalidateHonden] = useState<boolean>(false);
  const [revalidateHondDetail, setRevalidateHondDetail] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const currentRetries = useRef<number>(0);

  const update = useMutation<HondDto>('/api/honden');
  const create = useMutation<HondDto>('/api/honden');
  const softDelete = useMutation<{}>('/api/honden');

  const getHonden = async () => {
    setIsLoading(true);
    const { data, error } = await getData<HondDto[]>('/api/honden');
    if (error) toast.error('Fout bij laden van honden');
    setIsLoading(false);
    return { data, error };
  };

  const getHondById = async (id: string) => {
    setIsLoading(false);
    const { data, error } = await getData<HondDto>(`/api/honden/${id}`);
    setIsLoading(false);
    if (error) toast.error('Fout bij laden van hond details');
    return { data, error };
  };

  const updateHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await update(hondDto, {
      method: REQUEST_METHOD.PUT,
      params: { id: hondDto.id },
    });
    setDisabled(false);
    setIsLoading(false);
    if (error) toast.error('Fout bij updaten van hond');
    return { data, error };
  };

  const postHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await create(hondDto);
    if (error) toast.error(`Fout bij aanmaken van hond`);
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const deleteHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await softDelete(null, {
      method: REQUEST_METHOD.DELETE,
      params: { id: hondDto.id },
    });
    if (error) toast.error('Fout bij verwijderen van hond');
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetPaginatedHonden = (options?: RevalidateOptions, url?: string) => {
    const maxRetries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const urlMatchesLastUrl = url === lastPaginatedUrl;

    useEffect(() => {
      setLoading(true);
      (async () => {
        if (!revalidateHonden && paginatedHonden && urlMatchesLastUrl) {
          setLoading(false);
        } else {
          setLastPaginatedUrl(url);
          while (!success && currentRetries.current <= maxRetries) {
            const { data, error } = await getData<PaginatedData<HondDto>>(
              url ?? '/api/admin/honden'
            );
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van honden');
              await sleep(5);
              continue;
            } else if (data) {
              setPaginatedHonden(data);
              setSuccess(true);
              currentRetries.current = 0;
              break;
            }
          }
          setLoading(false);
          setSuccess(false);
          currentRetries.current = 0;
          return;
        }
      })();
    }, [maxRetries, url, urlMatchesLastUrl]);
    return { data: paginatedHonden ?? emptyPaginatedResponse, isLoading: loading };
  };

  const useGetHondDetail = (options?: RevalidateOptions, url?: string) => {
    const maxRetries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const hondId = url?.split('/').reverse()[0];

    useEffect(() => {
      setLoading(true);
      (async () => {
        if (!revalidateHondDetail && hondDetail) {
          setLoading(false);
        } else {
          while (!success && currentRetries.current <= maxRetries) {
            if (hondId === 'undefined') {
              currentRetries.current += 1;
              await sleep(1);
              continue;
            }
            const { data, error } = await getData<HondDto>(url!);
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van detail hond');
              await sleep(5);
              continue;
            } else if (data) {
              setHondDetail(data ?? null);
              setSuccess(true);
              currentRetries.current = 0;
              break;
            }
          }
          currentRetries.current = 0;
          setLoading(false);
          setSuccess(false);
          return;
        }
      })();
    }, [maxRetries, url, hondId]);
    return { data: hondDetail, isLoading: loading };
  };

  return (
    <HondContext.Provider
      value={{
        isLoading,
        disabled,
        getHonden,
        getHondById,
        updateHond,
        postHond,
        deleteHond,
        useGetPaginatedHonden,
        useGetHondDetail,
      }}
    >
      {children}
    </HondContext.Provider>
  );
};

export default HondProvider;

export const useHondContext = () => useContext(HondContext);
