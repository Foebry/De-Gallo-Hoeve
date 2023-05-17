import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { OptionsOrGroups } from 'react-select';
import { toast } from 'react-toastify';
import { RasDto } from 'src/common/api/types/ras';
import { optionInterface } from 'src/components/register/HondGegevens';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { sleep } from 'src/shared/functions';
import { PaginatedData } from 'src/shared/RequestHelper';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { Option } from 'src/utils/MongoDb';
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
    options?: RevalidateOptions
  ) => Promise<PaginatedData<RasDto> | undefined>;
  useGetRasOptions: (options?: RevalidateOptions) => Option[];
};

export const defaultValues: Context = {
  isLoading: false,
  getRassen: async () => [],
  getRasOptions: async () => [],
  updateRas: async () => undefined,
  createRas: async () => undefined,
  deleteRas: async () => undefined,
  useGetPaginatedRassen: async () => emptyPaginatedResponse,
  useGetRasOptions: () => [],
};

export const Context = createContext<Context>(defaultValues);

export const RasProvider: React.FC<{ children: any }> = ({ children }) => {
  const [rassen, setRassen] = useState<RasDto[]>();
  const [paginatedRassen, setPaginatedRassen] = useState<PaginatedData<RasDto>>();
  const [shouldRevalidate, setShouldRevalidate] = useState<boolean>(true);
  const currentRetries = useRef<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const create = useMutation<RasDto>('/api/admin/rassen');
  const update = useMutation<RasDto>(`/api/admin/rassen`);
  const softDelete = useMutation<RasDto>(`api/admin/rassen`);

  const getRassen = async () => {
    const { data, error } = await getData<RasDto[]>('/api/rassen');
    if (error) toast.error('Fout bij laden van rassen');
    return data;
  };

  const useGetPaginatedRassen = async (options?: RevalidateOptions) => {
    const maxRetries = options?.maxRetries ?? 5;

    useEffect(() => {
      (async () => {
        if (!shouldRevalidate && paginatedRassen) return paginatedRassen;
        else {
          while (!success && currentRetries.current <= maxRetries) {
            const { data, error } = await getData<PaginatedData<RasDto>>(
              '/api/admin/rassen'
            );
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van rassen');
              sleep(5);
              continue;
            } else if (data) {
              setPaginatedRassen(data);
              setSuccess(true);
              currentRetries.current = 0;
              setShouldRevalidate(false);
            }
          }
        }
      })();
    }, [maxRetries]);
    return paginatedRassen ?? emptyPaginatedResponse;
  };

  const createRas = async (rasDto: RasDto) => {
    const { data, error } = await create(rasDto);
    if (error) toast.error(`error bij aanmaken van ras`);
    if (data) setShouldRevalidate(true);
    return { data, error };
  };

  const updateRas = async (rasDto: RasDto) => {
    const { data, error } = await update(rasDto, {
      method: REQUEST_METHOD.PUT,
      params: { id: rasDto.id },
    });
    if (error) toast.error(`Fout bij updaten van ras`);
    if (data) setShouldRevalidate(true);
    return { data, error };
  };

  const deleteRas = async (rasDto: RasDto) => {
    const { data, error } = await softDelete(
      {},
      { method: REQUEST_METHOD.DELETE, params: { id: rasDto.id } }
    );
    if (error) toast.error(`Fout bij verwijderen van ras`);
    if (data) setShouldRevalidate(true);
    return { data, error };
  };

  const getRasOptions = async () => {
    const rasData = await getRassen();
    return rasData
      ? rasData.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam }))
      : [];
  };

  const useGetRasOptions = (options?: RevalidateOptions) => {
    const retries = options?.maxRetries ?? 5;

    useEffect(() => {
      (async () => {
        if (!shouldRevalidate && rassen)
          return rassen.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam }));
        else {
          while (!success && currentRetries.current <= retries) {
            const { data, error } = await getData<RasDto[]>('/api/rassen');
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van rassen');
              await sleep(5);
              continue;
            } else if (data) {
              setSuccess(true);
              currentRetries.current = 0;
              setRassen(data);
              setShouldRevalidate(false);
              break;
            }
          }
        }
      })();
    }, [retries]);
    currentRetries.current = 0;
    return rassen?.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam })) ?? [];
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
