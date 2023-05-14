import { createContext, useContext } from 'react';

type Context = {};

const defaultValues: Context = {};

const Context = createContext<Context>(defaultValues);

const InschrijvingProvider: React.FC<{ children: any }> = ({ children }) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};

export default InschrijvingProvider;

export const useInschrijvingContext = () => useContext(Context);
