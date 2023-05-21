import { NextRouter, useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { KlantDto } from 'src/common/api/types/klant';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { sleep } from 'src/shared/functions';
import { PaginatedData, PaginatedResponse } from 'src/shared/RequestHelper';
import { REQUEST_METHOD } from 'src/utils/axios';
import { emptyPaginatedResponse } from './AppContext';

const DEFAULT_KLANT_DETAIL: KlantDto = {
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
  getKlanten: () => Promise<PaginatedData<KlantDto> | undefined>;
  getKlant: (id: string) => Promise<ApiResponse<KlantDto> | undefined>;
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
    options?: RevalidateOptions,
    url?: string
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
  getKlanten: async () => emptyPaginatedResponse,
  getKlant: async () => undefined,
  updateKlant: async () => {},
  deleteKlant: async () => {},
  useGetPaginatedKlanten: () => ({ data: emptyPaginatedResponse, isLoading: false }),
  useGetKlantDetail: () => ({ data: null, isLoading: false }),
};

const Context = createContext<Context>(defaultValues);

const KlantProvider: React.FC<{ children: any }> = ({ children }) => {
  const [revalidateKlanten, setRevalidateKlanten] = useState<boolean>(false);
  const [revalidateKlant, setRevalidateKlant] = useState<boolean>(false);
  const [klanten, setKlanten] = useState<PaginatedResponse<KlantDto>>();
  const [klantDetail, setKlantDetail] = useState<KlantDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [lastPaginatedUrl, setLastPaginatedUrl] = useState<string>();
  const currentRetries = useRef<number>(0);

  const update = useMutation<KlantDto>('/api/admin/klanten');
  const remove = useMutation<{}>('/api/admin/klanten');

  const getKlanten = async () => {
    if (!revalidateKlanten && klanten) return klanten;
    setIsLoading(true);
    const { data, error } = await getData<PaginatedResponse<KlantDto>>('/');
    if (data) setKlanten(data);
    else if (error) toast.error('Fout bij laden van klanten');
    setIsLoading(false);
    return data;
  };

  const getKlant = async (id: string) => {
    setIsLoading(true);
    const { data, error } = await getData<KlantDto>(`/${id}`);
    if (data) setKlantDetail(data);
    else if (error) toast.error('Fout bij laden van klant detail');
    setIsLoading(false);
    return { data, error };
  };

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
      setRevalidateKlant(true);
      setRevalidateKlanten(true);
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
      setRevalidateKlant(true);
      setRevalidateKlanten(true);
    } else if (error) toast.error('Fout bij verwijderen van klant');
    setIsLoading(false);
    setDisabled(false);
    return { data, error };
  };

  const useGetPaginatedKlanten = (options?: RevalidateOptions, url?: string) => {
    const maxRetries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const urlMatchesLastUrl = url === lastPaginatedUrl;

    useEffect(() => {
      setLoading(true);
      (async () => {
        if (!revalidateKlanten && klanten && urlMatchesLastUrl) {
          setLoading(false);
        } else {
          setLastPaginatedUrl(url);
          while (!success && currentRetries.current <= maxRetries) {
            const { data, error } = await getData<PaginatedData<KlantDto>>(
              url ?? '/api/admin/klanten'
            );
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van klanten');
              await sleep(5);
              continue;
            } else if (data) {
              setKlanten(data);
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
    return { data: klanten ?? emptyPaginatedResponse, isLoading: loading };
  };

  const useGetKlantDetail = (options?: RevalidateOptions, url?: string) => {
    const maxRetries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRef<NextRouter>(useRouter());
    const klantId = url?.split('/').reverse()[0];
    const hasDataStored = !revalidateKlant && klantDetail;

    useEffect(() => {
      setLoading(true);
      (async () => {
        if (hasDataStored) {
          setLoading(false);
        } else {
          while (!success && currentRetries.current <= maxRetries) {
            if (klantId === 'undefined') {
              currentRetries.current += 1;
              await sleep(1);
              continue;
            }
            const { data, error } = await getData<KlantDto>(url!);
            if (error) {
              if (error.code === 403) {
                router.current.push(`/login?redirectUrl=admin/klanten/${klantId}`);
                currentRetries.current = 0;
                break;
              }
              currentRetries.current += 1;
              toast.error('Fout bij laden van detail klant');
              await sleep(5);
              continue;
            } else if (data) {
              setKlantDetail(data ?? null);
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
    }, [maxRetries, url, hasDataStored, klantId]);
    return { data: klantDetail ?? DEFAULT_KLANT_DETAIL, isLoading: loading };
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        disabled,
        getKlant,
        getKlanten,
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
