import { Geslacht } from '@/types/EntityTpes/HondTypes';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { PaginatedData } from 'src/common/api/shared/types';
import { HondDto } from 'src/common/api/types/hond';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { useAxiosContext } from '../AxiosContext';
import { defaultApiResponse, emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

type HondQuery = Partial<{
  page: string;
  pageSize: string;
  ids: string;
}>;

const EMPTY_HOND_DETAIL: HondDto = {
  id: '',
  naam: '',
  created_at: '',
  updated_at: '',
  geboortedatum: '',
  geslacht: '' as Geslacht,
  klant: {
    id: '',
    lnaam: '',
    vnaam: '',
  },
  ras: {
    id: '',
    naam: '',
  },
};

type HondContext = {
  isLoading: boolean;
  disabled: boolean;
  getHonden: () => ApiResponse<HondDto[]>;
  getHondById: (id: string) => ApiResponse<HondDto>;
  updateHond: (hondDto: HondDto) => ApiResponse<HondDto>;
  postHond: (hondDto: HondDto) => ApiResponse<HondDto>;
  deleteHond: (hondDto: HondDto) => ApiResponse<{}>;
  useGetPaginatedHonden: (
    query: HondQuery,
    options?: RevalidateOptions
  ) => { data: PaginatedData<HondDto>; isLoading: boolean };
  useGetHondDetail: (id: string, options?: RevalidateOptions) => { data: HondDto | null; isLoading: boolean };
};

const defaultValues: HondContext = {
  isLoading: false,
  disabled: false,
  getHonden: async () => defaultApiResponse,
  getHondById: async () => defaultApiResponse,
  updateHond: async () => defaultApiResponse,
  postHond: async () => defaultApiResponse,
  deleteHond: async () => defaultApiResponse,
  useGetPaginatedHonden: () => ({ data: emptyPaginatedResponse(), isLoading: false }),
  useGetHondDetail: () => ({ data: null, isLoading: false }),
};

export const HondContext = createContext<HondContext>(defaultValues);

const HondProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const swrKey = 'honden';

  const mutate = useMutation<HondDto>('/api/honden');
  const { useSWR } = useAxiosContext();

  const { revalidate } = useSWR(swrKey);

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
    const { data, error } = await mutate(`/${hondDto.id}`, hondDto, {
      method: REQUEST_METHOD.PUT,
    });
    setDisabled(false);
    setIsLoading(false);
    if (error) toast.error('Fout bij updaten van hond');
    if (data) {
      revalidate();
    }
    return { data, error };
  };

  const postHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await mutate('/', hondDto);
    if (error) toast.error(`Fout bij aanmaken van hond`);
    else if (data) revalidate();
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const deleteHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await mutate(`/${hondDto.id}`, null, {
      method: REQUEST_METHOD.DELETE,
    });
    if (error) toast.error('Fout bij verwijderen van hond');
    else if (data) revalidate();
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetPaginatedHonden = (query: HondQuery, options?: RevalidateOptions) => {
    const queryString = new URLSearchParams();
    if (query.ids) queryString.set('ids', query.ids.toString());

    const url = queryString ? `/api/admin/honden?${queryString.toString()}` : '/api/admin/honden';

    const { data, isLoading } = useSWR<PaginatedData<HondDto>>(swrKey, url, {
      ...options,
      errorMessage: 'Fout bij laden van honden',
      fallbackData: emptyPaginatedResponse(),
    });
    return { data: data ?? emptyPaginatedResponse(), isLoading };
  };

  const useGetHondDetail = (id: string, options?: RevalidateOptions) => {
    const url = `/api/admin/honden/${id}`;

    const { data, isLoading } = useSWR<HondDto>(swrKey, url, {
      ...options,
      fallbackData: EMPTY_HOND_DETAIL,
      errorMessage: 'Fout bij laden van hond detail',
    });

    return { data: data ?? EMPTY_HOND_DETAIL, isLoading };
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
