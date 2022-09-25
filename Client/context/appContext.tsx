import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { OptionsOrGroups } from "react-select";
import { optionInterface } from "../components/register/HondGegevens";
import getData from "../hooks/useApi";
import { RASSEN } from "../types/apiTypes";

type appContextType = {
  rassen: OptionsOrGroups<any, optionInterface>[];
  retrieveRassen: () => Promise<OptionsOrGroups<any, optionInterface>[]>;
  setRassen: Dispatch<SetStateAction<OptionsOrGroups<any, optionInterface>[]>>;
};

const appContextDefaultValues: appContextType = {
  retrieveRassen: async () => {
    const { data } = await getData(RASSEN);
    return data.rassen;
  },
  rassen: [],
  setRassen: () => {},
};

export const AppContext = createContext<AppContextInterface>(
  appContextDefaultValues
);

export interface AppContextInterface {
  rassen: OptionsOrGroups<any, optionInterface>[];
  retrieveRassen: () => Promise<OptionsOrGroups<any, optionInterface>[]>;
  setRassen: Dispatch<SetStateAction<OptionsOrGroups<any, optionInterface>[]>>;
}

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [rassen, setRassen] = useState<OptionsOrGroups<any, optionInterface>[]>(
    []
  );
  const retrieveRassen = async () => {
    if (rassen.length > 0) return rassen;
    const { data } = await getData(RASSEN);
    setRassen(data.rassen);
    return data.rassen;
  };

  return (
    <AppContext.Provider
      value={{
        rassen,
        retrieveRassen,
        setRassen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
