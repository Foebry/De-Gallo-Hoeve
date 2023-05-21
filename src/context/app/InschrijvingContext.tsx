import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { sleep } from 'src/shared/functions';
import { PaginatedData } from 'src/shared/RequestHelper';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { defaultApiResponse, emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

type Context = {
  isLoading: boolean;
  disabled: boolean;
  createInschrijving: (dto: InschrijvingDto) => ApiResponse<InschrijvingDto>;
  useGetPaginatedInschrijvingen: (
    options?: RevalidateOptions,
    url?: string
  ) => {
    data: PaginatedData<InschrijvingDto>;
    isLoading: boolean;
  };
  useGetInschrijvingDetail: (
    options?: RevalidateOptions,
    url?: string
  ) => {
    data: InschrijvingDto | null;
    isLoading: boolean;
  };
  editInschrijving: (dto: InschrijvingDto) => ApiResponse<InschrijvingDto>;
  softDeleteInschrijving: (dto: InschrijvingDto) => ApiResponse<{}>;
};

const defaultValues: Context = {
  isLoading: false,
  disabled: false,
  createInschrijving: async () => defaultApiResponse,
  useGetPaginatedInschrijvingen: () => ({
    data: emptyPaginatedResponse,
    isLoading: false,
  }),
  useGetInschrijvingDetail: () => ({
    data: null,
    isLoading: false,
  }),
  editInschrijving: async () => defaultApiResponse,
  softDeleteInschrijving: async () => defaultApiResponse,
};

const Context = createContext<Context>(defaultValues);

const InschrijvingProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [lastPaginatedUrl, setLastPaginatedUrl] = useState<string>();
  const [paginatedInschrijvingen, setPaginatedInschrijvingen] =
    useState<PaginatedData<InschrijvingDto>>();
  const [inschrijvingDetail, setInschrijvingDetail] = useState<InschrijvingDto | null>(
    null
  );
  const [shouldRevalidate, setShouldRevalidate] = useState<boolean>(true);
  const [revalidateInschrijving, setRevalidateInschrijving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const currentRetries = useRef<number>(0);

  const create = useMutation<InschrijvingDto>('api/inschrijvingen/');
  const edit = useMutation<InschrijvingDto>('/api/inschrijvingen/');
  const softDelete = useMutation<InschrijvingDto>('/api/inschrijvingen/');

  const createInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await create(dto);
    if (error) toast.error('Fout bij aanmaken inschrijving');
    setShouldRevalidate(true);
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const editInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await edit(dto, {
      method: REQUEST_METHOD.PUT,
      params: { id: dto.id },
    });
    if (error) toast.error('Fout bij bewerken inschrijving');
    if (data) setShouldRevalidate(true);
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const softDeleteInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await softDelete(null, {
      method: REQUEST_METHOD.DELETE,
      params: { id: dto.id },
    });
    if (error) toast.error('Fout bij verwijderen inschrijving');
    if (data) setShouldRevalidate(true);
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetPaginatedInschrijvingen = (options?: RevalidateOptions, url?: string) => {
    const retries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const urlMatchesLastUrl = url === lastPaginatedUrl;

    useEffect(() => {
      (async () => {
        if (!shouldRevalidate && paginatedInschrijvingen && urlMatchesLastUrl) {
          setLoading(false);
        } else {
          setLastPaginatedUrl(url);
          while (!success && currentRetries.current <= retries) {
            const { data, error } = await getData<PaginatedData<InschrijvingDto>>(
              url ?? '/api/admin/inschrijvingen'
            );
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van rassen');
              await sleep(5);
              continue;
            } else if (data) {
              setSuccess(true);
              currentRetries.current = 0;
              setPaginatedInschrijvingen(data);
              setShouldRevalidate(false);
              break;
            }
          }
          setLoading(false);
          setSuccess(false);
        }
      })();
    }, [retries, loading, url, urlMatchesLastUrl]);
    currentRetries.current = 0;

    return {
      data: paginatedInschrijvingen ?? emptyPaginatedResponse,
      isLoading: loading,
    };
  };

  const useGetInschrijvingDetail = (options?: RevalidateOptions, url?: string) => {
    const maxRetries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const inschrijvingId = url?.split('/').reverse()[0];
    const hasDataStored = !revalidateInschrijving && inschrijvingDetail;

    useEffect(() => {
      setLoading(true);
      (async () => {
        if (hasDataStored) {
          setLoading(false);
        } else {
          while (!success && currentRetries.current <= maxRetries) {
            if (inschrijvingId === 'undefined') {
              currentRetries.current += 1;
              await sleep(1);
              continue;
            }
            const { data, error } = await getData<InschrijvingDto>(url!);
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van detail hond');
              await sleep(5);
              continue;
            } else if (data) {
              setInschrijvingDetail(data ?? null);
              setSuccess(true);
              currentRetries.current = 0;
              break;
            }
          }
          currentRetries.current = 0;
          setLoading(false);
          setSuccess(false);
        }
      })();
    }, [hasDataStored, inschrijvingId, maxRetries, url]);
    return { data: inschrijvingDetail, isLoading: loading };
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        disabled,
        createInschrijving,
        editInschrijving,
        useGetPaginatedInschrijvingen,
        useGetInschrijvingDetail,
        softDeleteInschrijving,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default InschrijvingProvider;

export const useInschrijvingContext = () => useContext(Context);
