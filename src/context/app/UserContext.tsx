import { TrainingType } from '@/types/EntityTpes/TrainingType';
import { createContext, useContext, useState } from 'react';
import { IsKlantCollection } from 'src/common/domain/klant';
import { useKlantContext } from './klantContext';

type Inschrijving = {
  datum: Date;
  training: TrainingType;
};

type contextType = {
  klant: IsKlantCollection | null;
  isLoggedIn: boolean;
  initializeKlant: (klant: IsKlantCollection) => void;
  clearData: () => void;
};

const defaultValues: contextType = {
  klant: null,
  isLoggedIn: false,
  initializeKlant: () => {},
  clearData: () => {},
};

export const UserContext = createContext<contextType>(defaultValues);

const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[]>();
  const [klant, setKlant] = useState<IsKlantCollection | null>(null);
  const { getKlant } = useKlantContext();

  const clearData = () => setKlant(null);

  const initializeKlant = (klant: IsKlantCollection) => {
    setKlant(klant);
    localStorage.setItem('klant', JSON.stringify({ ...klant, id: klant._id.toString() }));
    setIsLoggedIn(true);
  };

  return (
    <UserContext.Provider
      value={{
        klant,
        isLoggedIn,
        initializeKlant,
        clearData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);
