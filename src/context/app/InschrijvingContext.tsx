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
  useGetPaginatedInschrijvingen: (options?: RevalidateOptions) => {
    data: PaginatedData<InschrijvingDto>;
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
  editInschrijving: async () => defaultApiResponse,
  softDeleteInschrijving: async () => defaultApiResponse,
};

const Context = createContext<Context>(defaultValues);

const InschrijvingProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [paginatedInschrijvingen, setPaginatedInschrijvingen] =
    useState<PaginatedData<InschrijvingDto>>();
  const [shouldRevalidate, setShouldRevalidate] = useState<boolean>(true);
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

  const useGetPaginatedInschrijvingen = (options?: RevalidateOptions) => {
    const retries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      (async () => {
        if (!shouldRevalidate && paginatedInschrijvingen) {
          setLoading(false);
        } else {
          console.log({ status: 'hello' });
          while (!success && currentRetries.current <= retries) {
            const { data, error } = await getData<PaginatedData<InschrijvingDto>>(
              '/api/admin/inschrijvingen'
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
        }
      })();
    }, [retries, loading]);
    currentRetries.current = 0;

    return {
      data: paginatedInschrijvingen ?? emptyPaginatedResponse,
      isLoading: loading,
    };
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        disabled,
        createInschrijving,
        editInschrijving,
        useGetPaginatedInschrijvingen,
        softDeleteInschrijving,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default InschrijvingProvider;

export const useInschrijvingContext = () => useContext(Context);
