import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { HondDto } from 'src/common/api/types/hond';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { ApiResponse, REQUEST_METHOD } from 'src/utils/axios';
import { defaultApiResponse } from './AppContext';

type HondContext = {
  isLoading: boolean;
  disabled: boolean;
  getHonden: () => ApiResponse<HondDto[]>;
  getHondById: (id: string) => ApiResponse<HondDto>;
  updateHond: (hondDto: HondDto) => ApiResponse<HondDto>;
  postHond: (hondDto: HondDto) => ApiResponse<HondDto>;
  deleteHond: (hondDto: HondDto) => ApiResponse<{}>;
  useGetHonden: () => Promise<HondDto[] | undefined>;
};

const defaultValues: HondContext = {
  isLoading: false,
  disabled: false,
  getHonden: async () => defaultApiResponse,
  getHondById: async () => defaultApiResponse,
  updateHond: async () => defaultApiResponse,
  postHond: async () => defaultApiResponse,
  deleteHond: async () => defaultApiResponse,
  useGetHonden: async () => [],
};

export const HondContext = createContext<HondContext>(defaultValues);

const HondProvider: React.FC<{ children: any }> = ({ children }) => {
  const [honden, setHonden] = useState<HondDto[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const update = useMutation<HondDto>('/api/honden');
  const create = useMutation<HondDto>('/api/honden');
  const softDelete = useMutation<{}>('/api/honden');

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
    return { data, error };
  };

  const postHond = async (hondDto: HondDto) => {
    if (disabled) return defaultApiResponse;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await create(hondDto);
    if (error) toast.error(`Fout bij aanmaken van hond`);
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
    setDisabled(false);
    setIsLoading(false);
    return { data, error };
  };

  const useGetHonden = async () => {
    return [];
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
        useGetHonden,
      }}
    >
      {children}
    </HondContext.Provider>
  );
};

export default HondProvider;

export const useHondContext = () => useContext(HondContext);
