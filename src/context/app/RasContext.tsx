import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { PaginatedData } from 'src/common/api/shared/types';
import { RasDto } from 'src/common/api/types/ras';
import useMutation from 'src/hooks/useMutation';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { Option } from 'src/utils/MongoDb';
import { SWROptions, useAxiosContext } from '../AxiosContext';
import { emptyPaginatedResponse } from './AppContext';

export type RasQuery = Partial<{
  page: string;
  pageSize: string;
  ids: string;
  search: string;
}>;

export type Context = {
  isLoading: boolean;
  updateRas: (updateData: RasDto) => ApiResponse<RasDto> | Promise<undefined>;
  createRas: (rasDto: RasDto) => ApiResponse<RasDto> | Promise<undefined>;
  deleteRas: (rasDto: RasDto) => ApiResponse<{}> | Promise<undefined>;
  useGetPaginatedRassen: (
    query: RasQuery,
    options?: SWROptions<PaginatedData<RasDto>>
  ) => {
    data: PaginatedData<RasDto>;
    isLoading: boolean;
  };
  useGetRasOptions: (options?: SWROptions<RasDto[]>) => { data: Option[]; isLoading: boolean };
};

export const defaultValues: Context = {
  isLoading: false,
  updateRas: async () => undefined,
  createRas: async () => undefined,
  deleteRas: async () => undefined,
  useGetPaginatedRassen: () => ({ data: emptyPaginatedResponse(), isLoading: false }),
  useGetRasOptions: () => ({ data: [], isLoading: false }),
};

export const Context = createContext<Context>(defaultValues);

export const RasProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const swrKey = 'rassen';

  const mutate = useMutation<RasDto>('/api/admin/rassen');
  const { useSWR } = useAxiosContext();

  const { revalidate } = useSWR(swrKey);

  const useGetPaginatedRassen = (query: RasQuery, options?: SWROptions<PaginatedData<RasDto>>) => {
    const queryString = new URLSearchParams();

    if (query?.page) queryString.set('page', query.page.toString());
    if (query.pageSize) queryString.set('pageSize', query.pageSize.toString());
    if (query.search) queryString.set('search', query.search.toString());
    if (query.ids) queryString.set('ids', query.ids.toString());

    const url = queryString ? `/api/admin/rassen?${queryString.toString()}` : '/api/admin/rassen';

    const { data, isLoading } = useSWR<PaginatedData<RasDto>>(swrKey, url, {
      ...options,
      errorMessage: 'Fout bij laden van rassen',
      fallbackData: emptyPaginatedResponse(),
    });

    return { data: data ?? emptyPaginatedResponse(), isLoading };
  };

  const createRas = async (rasDto: RasDto) => {
    const { data, error } = await mutate('/', rasDto);
    if (error) toast.error(`error bij aanmaken van ras`);
    if (data) revalidate();
    return { data, error };
  };

  const updateRas = async (rasDto: RasDto) => {
    const { data, error } = await mutate(`/${rasDto.id}`, rasDto, {
      method: REQUEST_METHOD.PUT,
    });
    if (error) toast.error(`Fout bij updaten van ras`);
    if (data) revalidate();
    return { data, error };
  };

  const deleteRas = async (rasDto: RasDto) => {
    const { data, error } = await mutate(`/${rasDto.id}`, {}, { method: REQUEST_METHOD.DELETE });
    if (error) toast.error(`Fout bij verwijderen van ras`);
    if (data) revalidate();
    return { data, error };
  };

  const useGetRasOptions = (options?: SWROptions<RasDto[]>) => {
    const { data, isLoading } = useSWR<RasDto[]>(swrKey, '/api/rassen', {
      ...options,
      errorMessage: 'Fout bij laden van ras opties',
      fallbackData: [],
    });
    const rasOptions = data?.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam })) ?? [];

    return { data: rasOptions, isLoading };
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        createRas,
        deleteRas,
        updateRas,
        useGetPaginatedRassen,
        useGetRasOptions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default RasProvider;

export const useRasContext = () => useContext(Context);
