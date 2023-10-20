import { NextRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AvailabilityDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import { PaginatedData } from 'src/common/api/shared/types';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import useMutation from 'src/hooks/useMutation';
import { CheckAvailabilityType } from 'src/pages/api/subscriptions/schemas';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { SWROptions, useAxiosContext } from '../AxiosContext';
import { defaultApiResponse, emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

export type InschrijvingQuery = Partial<{
  page: string;
  pageSize: string;
  ids: string;
}>;

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
    query: InschrijvingQuery,
    options?: SWROptions<PaginatedData<InschrijvingDto>>
  ) => {
    data: PaginatedData<InschrijvingDto>;
    isLoading: boolean;
  };
  useGetInschrijvingDetail: (
    id: string,
    options?: SWROptions<InschrijvingDto>
  ) => {
    data: InschrijvingDto | null;
    isLoading: boolean;
  };
  editInschrijving: (dto: InschrijvingDto) => ApiResponse<InschrijvingDto>;
  softDeleteInschrijving: (dto: InschrijvingDto) => ApiResponse<{}>;
  useCheckAvailabilityRecurringWalkingServiceSubscriptions: (payload: SubscriptionDto) => {
    data: AvailabilityDto | null;
    isLoading: boolean;
    refetch: (payload: SubscriptionDto) => Promise<void>;
    error?: any;
  };
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
  useCheckAvailabilityRecurringWalkingServiceSubscriptions: () => ({
    data: null,
    isLoading: false,
    refetch: async () => {},
  }),
};

const Context = createContext<Context>(defaultValues);

const InschrijvingProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const create = useMutation<InschrijvingDto>('api/inschrijvingen/');
  const edit = useMutation<InschrijvingDto>('/api/inschrijvingen/');
  const softDelete = useMutation<InschrijvingDto>('/api/inschrijvingen/');
  const swrKey = useMemo(() => 'inschrijvign', []);
  const { useSWR } = useAxiosContext();

  const { revalidate } = useSWR(swrKey);

  const createInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await create('/', dto);
    if (error) toast.error('Fout bij aanmaken inschrijving');
    if (data) revalidate();
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const editInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await edit(`/${dto.id}`, dto, {
      method: REQUEST_METHOD.PUT,
    });
    if (error) toast.error('Fout bij bewerken inschrijving');
    if (data) {
      revalidate();
    }
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const softDeleteInschrijving = async (dto: InschrijvingDto) => {
    if (disabled) defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await softDelete(`/${dto.id}`, null, {
      method: REQUEST_METHOD.DELETE,
    });
    if (error) toast.error('Fout bij verwijderen inschrijving');
    if (data) revalidate();
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetPaginatedInschrijvingen = (query: InschrijvingQuery, options?: RevalidateOptions) => {
    const queryString = new URLSearchParams();
    if (query.page) queryString.set('page', query.page.toString());

    const url = queryString ? `/api/admin/inschrijvingen?${queryString}` : '/api/admin/inschrijvingen';

    const { data, isLoading } = useSWR<PaginatedData<InschrijvingDto>>(swrKey, url, {
      ...options,
      errorMessage: 'Fout bij laden van inschrijvingen',
      fallbackData: emptyPaginatedResponse(),
    });
    return { data: data ?? emptyPaginatedResponse(), isLoading };
  };

  const useGetInschrijvingDetail = (id: string, options?: RevalidateOptions) => {
    const { data, isLoading } = useSWR<InschrijvingDto>(swrKey, `/api/admin/inschrijvingen/${id}`, {
      ...options,
      errorMessage: 'Fout bij laden van inschrijving detail',
      fallbackData: EMPTY_INSCHRIJVING_DETAIL,
    });

    return { data: data ?? EMPTY_INSCHRIJVING_DETAIL, isLoading };
  };

  const useCheckAvailabilityRecurringWalkingServiceSubscriptions = (payload: SubscriptionDto) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<AvailabilityDto | null>(null);
    const [error, setError] = useState<any>();
    const mutate = useMutation<AvailabilityDto, CheckAvailabilityType>('/api/subscriptions/check-availability');
    const refetch = async (payload: SubscriptionDto) => {
      setIsLoading(true);
      const { data: mutateData, error: mutateError } = await mutate('', payload);
      setIsLoading(false);
      if (mutateData) setData(mutateData);
      setError(mutateError);
    };

    useEffect(() => {
      (async () => {
        const { data: mutationData, error: mutationError } = await mutate('', payload);
        setIsLoading(false);
        if (mutationData) setData(mutationData);
        setError(mutationError);
      })();
    }, []);

    return { isLoading, data, error, refetch };
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
        useCheckAvailabilityRecurringWalkingServiceSubscriptions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default InschrijvingProvider;

export const useInschrijvingContext = () => useContext(Context);
