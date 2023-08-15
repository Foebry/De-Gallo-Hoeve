import { createContext, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { PaginatedData } from 'src/common/api/shared/types';
import { KlantDto } from 'src/common/api/types/klant';
import useMutation from 'src/hooks/useMutation';
import { REQUEST_METHOD } from 'src/utils/axios';
import { SWROptions, useAxiosContext } from '../AxiosContext';
import { emptyPaginatedResponse } from './AppContext';

const EMPTY_KLANT_DETAIL: KlantDto = {
  created_at: '',
  email: '',
  gemeente: '',
  gsm: '',
  honden: [],
  id: '',
  inschrijvingen: [],
  lnaam: '',
  nr: '',
  postcode: '',
  straat: '',
  verified: false,
  vnaam: '',
};

export type KlantenQuery = Partial<{
  search: string;
  page: number;
}>;

type Context = {
  isLoading: boolean;
  disabled: boolean;
  updateKlant: (id: string, updateData: KlantDto) => Promise<ApiResponse<KlantDto> | void>;
  deleteKlant: (id: string) => Promise<ApiResponse<{}> | void>;
  useGetPaginatedKlanten: (
    query: KlantenQuery,
    options?: SWROptions<PaginatedData<KlantDto>>
  ) => { data: PaginatedData<KlantDto>; isLoading: boolean };
  useGetKlantDetail: (id: string, options?: SWROptions<KlantDto>) => { data: KlantDto; isLoading: boolean };
};

type ApiError<T> = Partial<T> & { message: string; code: number };
type ApiResponse<T> = { data: T | undefined; error: ApiError<T> | undefined };
export type RevalidateOptions = Partial<{
  maxRetries: number;
  revalidate: number;
}>;

const defaultValues: Context = {
  isLoading: false,
  disabled: false,
  updateKlant: async () => {},
  deleteKlant: async () => {},
  useGetPaginatedKlanten: () => ({ data: emptyPaginatedResponse(), isLoading: false }),
  useGetKlantDetail: () => ({ data: EMPTY_KLANT_DETAIL, isLoading: false }),
};

const Context = createContext<Context>(defaultValues);

const KlantProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const swrKey = useMemo(() => 'klanten', []);

  const update = useMutation<KlantDto>('/api/admin/klanten');
  const remove = useMutation<{}>('/api/admin/klanten');
  const { useSWR } = useAxiosContext();

  const { revalidate } = useSWR(swrKey);

  const updateKlant = async (id: string, updateData: KlantDto) => {
    if (disabled) return;
    setIsLoading(true);
    setDisabled(true);
    const { data, error } = await update(`/${id}`, updateData, {
      method: REQUEST_METHOD.PUT,
    });
    if (data) {
      toast.success('klant succesvol gewijzigd!');
      revalidate();
    } else if (error) toast.error('Fout bij wijzigen klant');
    setIsLoading(false);
    setDisabled(false);
    return { data, error };
  };

  const deleteKlant = async (id: string) => {
    if (disabled) return;
    setIsLoading(true);
    setDisabled(true);
    const { data, error } = await remove(`/${id}`, null, {
      method: REQUEST_METHOD.DELETE,
    });
    if (data) {
      toast.success('Klant succesvol verwijderd!');
      revalidate();
    } else if (error) toast.error('Fout bij verwijderen van klant');
    setIsLoading(false);
    setDisabled(false);
    return { data, error };
  };

  const useGetPaginatedKlanten = (query: KlantenQuery, options?: SWROptions<PaginatedData<KlantDto>>) => {
    const queryString = new URLSearchParams();
    if (query.page) queryString.set('page', query.page.toString());
    if (query.search) queryString.set('search', query.search.toString());

    const url = queryString ? `/api/admin/klanten?${queryString}` : '/api/admin/klanten';

    const { data, isLoading } = useSWR<PaginatedData<KlantDto>>(swrKey, url, {
      ...options,
      errorMessage: 'Fout bij laden van klanten',
      fallbackData: emptyPaginatedResponse(),
    });
    return { data: data ?? emptyPaginatedResponse(), isLoading };
  };

  const useGetKlantDetail = (id: string, options?: SWROptions<KlantDto>) => {
    const { data, isLoading } = useSWR<KlantDto>(swrKey, `/api/admin/klanten/${id}`, {
      ...options,
      errorMessage: 'Fout bij laden van klant detail',
      fallbackData: EMPTY_KLANT_DETAIL,
    });

    return { data: data ?? EMPTY_KLANT_DETAIL, isLoading };
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        disabled,
        updateKlant,
        deleteKlant,
        useGetPaginatedKlanten,
        useGetKlantDetail,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default KlantProvider;

export const useKlantContext = () => useContext(Context);
