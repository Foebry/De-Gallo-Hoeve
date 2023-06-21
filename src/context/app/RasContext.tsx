import { createContext, useContext, useRef, useState } from 'react';
import { OptionsOrGroups } from 'react-select';
import { toast } from 'react-toastify';
import { RasDto } from 'src/common/api/types/ras';
import { optionInterface } from 'src/components/register/HondGegevens';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { PaginatedData } from 'src/shared/RequestHelper';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { Option } from 'src/utils/MongoDb';
import { useAxiosContext } from '../AxiosContext';
import { emptyPaginatedResponse } from './AppContext';
import { RevalidateOptions } from './klantContext';

export type Context = {
  isLoading: boolean;
  getRassen: () => Promise<RasDto[] | undefined>;
  getRasOptions: () => Promise<OptionsOrGroups<any, optionInterface>>;
  updateRas: (updateData: RasDto) => ApiResponse<RasDto> | Promise<undefined>;
  createRas: (rasDto: RasDto) => ApiResponse<RasDto> | Promise<undefined>;
  deleteRas: (rasDto: RasDto) => ApiResponse<{}> | Promise<undefined>;
  useGetPaginatedRassen: (
    url?: string,
    options?: RevalidateOptions
  ) => {
    data: PaginatedData<RasDto>;
    isLoading: boolean;
  };
  useGetRasOptions: (options?: RevalidateOptions) => Option[];
};

export const defaultValues: Context = {
  isLoading: false,
  getRassen: async () => [],
  getRasOptions: async () => [],
  updateRas: async () => undefined,
  createRas: async () => undefined,
  deleteRas: async () => undefined,
  useGetPaginatedRassen: () => ({ data: emptyPaginatedResponse(), isLoading: false }),
  useGetRasOptions: () => [],
};

export const Context = createContext<Context>(defaultValues);

export const RasProvider: React.FC<{ children: any }> = ({ children }) => {
  const [revalidateList, setRevalidateList] = useState<boolean>(false);
  const [revalidateOptions, setRevalidateOptions] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const rassen = useRef<RasDto[]>();
  const paginatedRassen = useRef<PaginatedData<RasDto>>(emptyPaginatedResponse());
  const lastPaginatedUrl = useRef<string>();

  const create = useMutation<RasDto>('/api/admin/rassen');
  const update = useMutation<RasDto>(`/api/admin/rassen`);
  const softDelete = useMutation<RasDto>(`api/admin/rassen`);
  const { useSWR } = useAxiosContext();

  const getRassen = async () => {
    const { data, error } = await getData<RasDto[]>('/api/rassen');
    if (error) toast.error('Fout bij laden van rassen');
    return data;
  };

  const useGetPaginatedRassen = (
    url = '/api/admin/rassen',
    options?: RevalidateOptions
  ) => {
    const urlMatchesLastUrl = url === lastPaginatedUrl.current;
    const shouldRevalidate =
      revalidateList || !urlMatchesLastUrl || !paginatedRassen.current;

    const { data, error, loading } = useSWR<PaginatedData<RasDto>>(
      url,
      shouldRevalidate,
      options,
      'Fout bij laden van rassen',
      emptyPaginatedResponse()
    );

    if (data && shouldRevalidate) {
      lastPaginatedUrl.current = url;
      paginatedRassen.current = data;
      setRevalidateList(false);
    } else if (error) lastPaginatedUrl.current = url;

    return { data: paginatedRassen.current, isLoading: loading };
  };

  const createRas = async (rasDto: RasDto) => {
    const { data, error } = await create(rasDto);
    if (error) toast.error(`error bij aanmaken van ras`);
    if (data) setRevalidateList(true);
    return { data, error };
  };

  const updateRas = async (rasDto: RasDto) => {
    const { data, error } = await update(rasDto, {
      method: REQUEST_METHOD.PUT,
      params: { id: rasDto.id },
    });
    if (error) toast.error(`Fout bij updaten van ras`);
    if (data) setRevalidateList(true);
    return { data, error };
  };

  const deleteRas = async (rasDto: RasDto) => {
    const { data, error } = await softDelete(
      {},
      { method: REQUEST_METHOD.DELETE, params: { id: rasDto.id } }
    );
    if (error) toast.error(`Fout bij verwijderen van ras`);
    if (data) setRevalidateList(true);
    return { data, error };
  };

  const getRasOptions = async () => {
    const rasData = await getRassen();
    return rasData
      ? rasData.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam }))
      : [];
  };

  const useGetRasOptions = (options?: RevalidateOptions) => {
    const shouldRevalidate = !rassen.current || revalidateOptions;

    const { data, error, loading } = useSWR<RasDto[]>(
      '/api/rassen',
      shouldRevalidate,
      options,
      'Fout bij laden van ras opties',
      []
    );
    if (data && shouldRevalidate) {
      rassen.current = data;
      setRevalidateOptions(false);
    }

    return (
      rassen.current?.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam })) ?? []
    );
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        getRassen,
        getRasOptions,
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
