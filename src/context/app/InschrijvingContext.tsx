import { NextRouter } from 'next/router';
import { createContext, useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import useMutation from 'src/hooks/useMutation';
import { PaginatedData } from 'src/shared/RequestHelper';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { useAxiosContext } from '../AxiosContext';
import { defaultApiResponse, emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

const EMPTY_INSCHRIJVING_DETAIL: InschrijvingDto = {
  id: '',
  training: '',
  created_at: '',
  updated_at: '',
  datum: '',
  klant: {
    id: '',
    lnaam: '',
    vnaam: '',
  },
  hond: {
    id: '',
    naam: '',
    ras: '',
  },
};

type Context = {
  isLoading: boolean;
  disabled: boolean;
  createInschrijving: (dto: InschrijvingDto) => ApiResponse<InschrijvingDto>;
  useGetPaginatedInschrijvingen: (
    url?: string,
    options?: RevalidateOptions
  ) => {
    data: PaginatedData<InschrijvingDto>;
    isLoading: boolean;
  };
  useGetInschrijvingDetail: (
    router: NextRouter,
    options?: RevalidateOptions
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
    data: emptyPaginatedResponse(),
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
  const lastPaginatedUrl = useRef<string>();
  const inschrijvingDetail = useRef<InschrijvingDto | null>(null);
  const paginatedInschrijvingen = useRef<PaginatedData<InschrijvingDto>>(
    emptyPaginatedResponse()
  );
  const [revalidateList, setRevalidateList] = useState<boolean>(false);
  const [revalidateDetail, setRevalidateDetail] = useState<boolean>(false);

  const create = useMutation<InschrijvingDto>('api/inschrijvingen/');
  const edit = useMutation<InschrijvingDto>('/api/inschrijvingen/');
  const softDelete = useMutation<InschrijvingDto>('/api/inschrijvingen/');
  const lastLoadedId = useRef<string>('');
  const { useSWR } = useAxiosContext();

  const createInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await create(dto);
    if (error) toast.error('Fout bij aanmaken inschrijving');
    setRevalidateList(true);
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
    if (data) {
      setRevalidateDetail(true);
      setRevalidateList(true);
    }
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
    if (data) setRevalidateList(true);
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetPaginatedInschrijvingen = (
    url: string = '/api/admin/inschrijvingen',
    options?: RevalidateOptions
  ) => {
    const urlMatchesLastUrl = url && url === lastPaginatedUrl.current;
    const shouldRevalidate =
      revalidateList || !urlMatchesLastUrl || !paginatedInschrijvingen.current;

    const { data, error, loading } = useSWR<PaginatedData<InschrijvingDto>>(
      url,
      shouldRevalidate,
      options,
      'Fout bij laden van inschrijvingen',
      emptyPaginatedResponse()
    );
    if (data && shouldRevalidate) {
      paginatedInschrijvingen.current = data;
      lastPaginatedUrl.current = url;
      setRevalidateList(false);
    } else if (error) {
      lastPaginatedUrl.current = url;
    }
    return { data: paginatedInschrijvingen.current, isLoading: loading };
  };

  const useGetInschrijvingDetail = (router: NextRouter, options?: RevalidateOptions) => {
    const { isReady } = router;
    const { slug: id } = router.query as { slug: string };
    const newIdOrMissingData = id !== lastLoadedId.current || !inschrijvingDetail;
    const shouldRevalidate = isReady && (revalidateDetail || newIdOrMissingData);

    const { data, error, loading } = useSWR<InschrijvingDto>(
      `/api/admin/inschrijvingen/${id}`,
      shouldRevalidate,
      options,
      'Fout bij laden van inschrijving detail',
      EMPTY_INSCHRIJVING_DETAIL
    );
    if (data && shouldRevalidate) {
      inschrijvingDetail.current = data;
      if (id !== 'undefined') lastLoadedId.current = id;
      setRevalidateDetail(false);
    } else if (error) {
      inschrijvingDetail.current = null;
      if (id !== 'undefined') lastLoadedId.current = id;
    }

    return { data: inschrijvingDetail.current, isLoading: loading };
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
