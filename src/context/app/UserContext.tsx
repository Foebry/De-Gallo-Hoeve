import { KlantHond } from '@/types/EntityTpes/HondTypes';
import { TrainingType } from '@/types/EntityTpes/TrainingType';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { HondDto } from 'src/common/api/types/hond';
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
  honden: HondDto[];
};

const defaultValues: contextType = {
  klant: null,
  isLoggedIn: false,
  initializeKlant: () => {},
  clearData: () => {},
  honden: [],
};

export const UserContext = createContext<contextType>(defaultValues);

const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[]>();
  const [klant, setKlant] = useState<IsKlantCollection | null>(null);
  const honden = useRef<HondDto[]>([]);
  // const klantHonden = useState<KlantHond[]>([]);
  // const { getKlant } = useKlantContext();

  const clearData = () => setKlant(null);

  const initializeKlant = (klant: IsKlantCollection) => {
    setKlant(klant);
    localStorage.setItem('klant', JSON.stringify({ ...klant, id: klant._id.toString() }));
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const initializeKlant = async () => {};
    initializeKlant();
  }, []);

  return (
    <UserContext.Provider
      value={{
        klant,
        isLoggedIn,
        initializeKlant,
        clearData,
        honden: honden.current,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);
