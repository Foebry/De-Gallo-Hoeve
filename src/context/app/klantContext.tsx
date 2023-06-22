import { NextRouter } from 'next/router';
import { createContext, useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { KlantDto } from 'src/common/api/types/klant';
import useMutation from 'src/hooks/useMutation';
import { PaginatedData } from 'src/shared/RequestHelper';
import { REQUEST_METHOD } from 'src/utils/axios';
import { useAxiosContext } from '../AxiosContext';
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

type Context = {
  isLoading: boolean;
  disabled: boolean;
  updateKlant: (
    id: string,
    updateData: KlantDto
  ) => Promise<ApiResponse<KlantDto> | void>;
  deleteKlant: (id: string) => Promise<ApiResponse<{}> | void>;
  useGetPaginatedKlanten: (
    options?: RevalidateOptions,
    url?: string
  ) => { data: PaginatedData<KlantDto>; isLoading: boolean };
  useGetKlantDetail: (
    router: NextRouter,
    options?: RevalidateOptions
  ) => { data: KlantDto | null; isLoading: boolean };
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
  useGetKlantDetail: () => ({ data: null, isLoading: false }),
};

const Context = createContext<Context>(defaultValues);

const KlantProvider: React.FC<{ children: any }> = ({ children }) => {
  const [revalidateList, setRevalidateList] = useState<boolean>(false);
  const paginatedKlanten = useRef<PaginatedData<KlantDto>>(emptyPaginatedResponse());
  const lastPaginatedUrl = useRef<string>();
  const klantDetail = useRef<KlantDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const lastLoadedKlantId = useRef<string>('');

  const update = useMutation<KlantDto>('/api/admin/klanten');
  const remove = useMutation<{}>('/api/admin/klanten');
  const { useSWR } = useAxiosContext();

  const updateKlant = async (id: string, updateData: KlantDto) => {
    if (disabled) return;
    setIsLoading(true);
    setDisabled(true);
    const { data, error } = await update(updateData, {
      method: REQUEST_METHOD.PUT,
      params: { id },
    });
    if (data) {
      toast.success('klant succesvol gewijzigd!');
      klantDetail.current = data;
      setRevalidateList(true);
    } else if (error) toast.error('Fout bij wijzigen klant');
    setIsLoading(false);
    setDisabled(false);
    return { data, error };
  };

  const deleteKlant = async (id: string) => {
    if (disabled) return;
    setIsLoading(true);
    setDisabled(true);
    const { data, error } = await remove(null, {
      method: REQUEST_METHOD.DELETE,
      params: { id },
    });
    if (data) {
      toast.success('Klant succesvol verwijderd!');
      setRevalidateList(true);
    } else if (error) toast.error('Fout bij verwijderen van klant');
    setIsLoading(false);
    setDisabled(false);
    return { data, error };
  };

  const useGetPaginatedKlanten = (
    options?: RevalidateOptions,
    url: string = '/api/admin/klanten'
  ) => {
    const urlMatchesLastUrl = url && url === lastPaginatedUrl.current;
    const shouldRevalidate =
      revalidateList || !urlMatchesLastUrl || !paginatedKlanten.current;

    const { data, error, loading } = useSWR<PaginatedData<KlantDto>>(
      url,
      shouldRevalidate,
      options,
      'Fout bij laden van klanten',
      emptyPaginatedResponse()
    );
    if (data && shouldRevalidate) {
      paginatedKlanten.current = data;
      lastPaginatedUrl.current = url;
      setRevalidateList(false);
    } else if (error) {
      lastPaginatedUrl.current = url;
    }
    return { data: paginatedKlanten.current!, isLoading: loading };
  };

  const useGetKlantDetail = (router: NextRouter, options?: RevalidateOptions) => {
    const { isReady } = router;
    const { slug: id } = router.query as { slug: string };
    const newIdOrMissingData = id !== lastLoadedKlantId.current || !klantDetail;
    const shouldRevalidate = isReady && newIdOrMissingData;

    const { data, error, loading } = useSWR<KlantDto>(
      `/api/admin/klanten/${id}`,
      shouldRevalidate,
      options,
      'Fout bij laden van klant detail',
      EMPTY_KLANT_DETAIL
    );
    if (data && shouldRevalidate) {
      klantDetail.current = data;
      if (id !== 'undefined') lastLoadedKlantId.current = id;
    } else if (error) {
      klantDetail.current = null;
      if (id !== 'undefined') lastLoadedKlantId.current = id;
    }
    return { data: klantDetail.current, isLoading: loading };
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
