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
  klantId: number | undefined;
  setKlantId: Dispatch<SetStateAction<number | undefined>>;
}

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [requiresUpdate, setRequiresUpdate] = useState<boolean>(false);
  const [klantId, setKlantId] = useState<number>();

  return (
    <AppContext.Provider
      value={{
        requiresUpdate,
        setRequiresUpdate,
        klantId,
        setKlantId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
