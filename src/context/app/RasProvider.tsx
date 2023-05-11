import { createContext, useContext, useState } from 'react';
import { OptionsOrGroups } from 'react-select';
import { RasDto } from 'src/common/api/types/Ras';
import { optionInterface } from 'src/components/register/HondGegevens';
import getData from 'src/hooks/useApi';

type Context = {
  getRassen: () => Promise<RasDto[]>;
  getRasOptions: () => OptionsOrGroups<any, optionInterface>[];
};

const defaultValues: Context = {
  getRassen: async () => [],
  getRasOptions: () => [],
};

export const Context = createContext<Context>(defaultValues);

const RasProvider: React.FC<{ children: any }> = ({ children }) => {
  const [rassen, setRassen] = useState<RasDto[]>();

  const getRassen = async () => {
    if (rassen) return rassen;
    const { data } = await getData('/api/rassen');
    if (data) setRassen(data);
    return data;
  };

  const getRasOptions = () =>
    rassen?.map((rasDto) => ({ value: rasDto.id, label: rasDto.naam })) ?? [];

  return (
    <Context.Provider
      value={{
        getRassen,
        getRasOptions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default RasProvider;

export const useRasContext = () => useContext(Context);
