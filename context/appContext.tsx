import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export const AppContext = createContext<AppContextInterface | null>(null);

export interface AppContextInterface {
  children?: ReactNode;
  requiresUpdate: boolean;
  setRequiresUpdate: Dispatch<SetStateAction<boolean>>;
}

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [requiresUpdate, setRequiresUpdate] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        requiresUpdate,
        setRequiresUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
