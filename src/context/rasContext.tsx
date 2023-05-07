import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { OptionsOrGroups } from 'react-select';
import { optionInterface } from '../components/register/HondGegevens';
import getData from '../hooks/useApi';
import { RASSEN } from '../types/apiTypes';

type RasContext = {
  rassen: OptionsOrGroups<any, optionInterface>[];
  retrieveRassen: () => Promise<OptionsOrGroups<any, optionInterface>[]>;
  setRassen: Dispatch<SetStateAction<OptionsOrGroups<any, optionInterface>[]>>;
};

const defaultValues: RasContext = {
  retrieveRassen: async () => {
    const { data: rassen } = await getData(RASSEN);
    return rassen;
  },
  rassen: [],
  setRassen: () => {},
};

export const RasContext = createContext<RasContext>(defaultValues);

//   export interface AppContextInterface {
//     rassen: OptionsOrGroups<any, optionInterface>[];
//     retrieveRassen: () => Promise<OptionsOrGroups<any, optionInterface>[]>;
//     setRassen: Dispatch<SetStateAction<OptionsOrGroups<any, optionInterface>[]>>;
//   }

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [rassen, setRassen] = useState<OptionsOrGroups<any, optionInterface>[]>([]);
  const retrieveRassen = async () => {
    if (rassen.length > 0) return rassen;
    const { data } = await getData(RASSEN);
    setRassen(data);
    return data;
  };

  return (
    <RasContext.Provider
      value={{
        rassen,
        retrieveRassen,
        setRassen,
      }}
    >
      {children}
    </RasContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext(RasContext);
