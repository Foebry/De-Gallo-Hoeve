import { Geslacht } from '@/types/EntityTpes/HondTypes';
import { NextRouter } from 'next/router';
import { createContext, useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { HondDto } from 'src/common/api/types/hond';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { PaginatedData } from 'src/shared/RequestHelper';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { useAxiosContext } from '../AxiosContext';
import { defaultApiResponse, emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

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
    url?: string,
    options?: RevalidateOptions
  ) => { data: PaginatedData<HondDto>; isLoading: boolean };
  useGetHondDetail: (
    router: NextRouter,
    options?: RevalidateOptions
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
  useGetPaginatedHonden: () => ({ data: emptyPaginatedResponse(), isLoading: false }),
  useGetHondDetail: () => ({ data: null, isLoading: false }),
};

export const HondContext = createContext<HondContext>(defaultValues);

const HondProvider: React.FC<{ children: any }> = ({ children }) => {
  const [revalidateList, setRevalidateList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const hondDetail = useRef<HondDto | null>(null);
  const lastPaginatedUrl = useRef<string>();
  const paginatedHonden = useRef<PaginatedData<HondDto>>(emptyPaginatedResponse());
  const lastLoadedId = useRef<string>('');

  const update = useMutation<HondDto>('/api/honden');
  const create = useMutation<HondDto>('/api/honden');
  const softDelete = useMutation<{}>('/api/honden');
  const { useSWR } = useAxiosContext();

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
    if (data) {
      hondDetail.current = data;
      setRevalidateList(true);
    }
    return { data, error };
  };

  const postHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await create(hondDto);
    if (error) toast.error(`Fout bij aanmaken van hond`);
    else if (data) setRevalidateList(true);
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
    else if (data) setRevalidateList(true);
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetPaginatedHonden = (
    url = '/api/admin/honden',
    options?: RevalidateOptions
  ) => {
    const urlMatchesLastUrl = url && url === lastPaginatedUrl.current;
    const shouldRevalidate =
      revalidateList || !urlMatchesLastUrl || !paginatedHonden.current;

    const { data, error, loading } = useSWR<PaginatedData<HondDto>>(
      url,
      shouldRevalidate,
      options,
      'Fout bij laden van honden',
      emptyPaginatedResponse()
    );
    if (data && shouldRevalidate) {
      lastPaginatedUrl.current = url;
      paginatedHonden.current = data;
      setRevalidateList(false);
    } else if (error) {
      lastPaginatedUrl.current = url;
    }
    return { data: paginatedHonden.current, isLoading: loading };
  };

  const useGetHondDetail = (router: NextRouter, options?: RevalidateOptions) => {
    const { isReady } = router;
    const { slug: id } = router.query as { slug: string };
    const newIdOrMissingData = id !== lastLoadedId.current || !hondDetail;
    const shouldRevalidate = isReady && newIdOrMissingData;

    const { data, error, loading } = useSWR<HondDto>(
      `/api/admin/honden/${id}`,
      shouldRevalidate,
      options,
      'Fout bij laden van hond detail',
      EMPTY_HOND_DETAIL
    );
    if (data && shouldRevalidate) {
      hondDetail.current = data;
      if (id !== 'undefined') lastLoadedId.current = id;
    } else if (error) {
      hondDetail.current = null;
      if (id !== 'undefined') lastLoadedId.current = id;
    }

    return { data: hondDetail.current, isLoading: loading };
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
