import { Geslacht } from '@/types/EntityTpes/HondTypes';
import { TrainingType } from '@/types/EntityTpes/TrainingType';
import { createContext, useContext, useState } from 'react';
import { IsKlantCollection } from 'src/common/domain/klant';
import getData from 'src/hooks/useApi';
import { useApiContext } from '../api/ApiContext';

type Inschrijving = {
  datum: Date;
  training: TrainingType;
};

type contextType = {
  klant: IsKlantCollection | null;
  isLoggedIn: boolean;
  initializeKlant: (klant: IsKlantCollection) => void;
  getInschrijvingenData: (ids: string[]) => Promise<Inschrijving[]>;
  clearData: () => void;
};

const defaultValues: contextType = {
  klant: null,
  isLoggedIn: false,
  initializeKlant: () => {
    console.log({ status: 'hello from defaultInitializeKlant' });
  },
  getInschrijvingenData: async () => [],
  clearData: () => {},
};

export const UserContext = createContext<contextType>(defaultValues);

const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[]>([]);
  const [klant, setKlant] = useState<IsKlantCollection | null>(null);
  const { getKlantData, getInschrijvingen } = useApiContext();

  const clearData = () => setKlant(null);

  const initializeKlant = (klant: IsKlantCollection) => {
    setKlant(klant);
    localStorage.setItem('klantId', klant._id.toString());
    setIsLoggedIn(true);
  };

  const getKlantById = async (id: string) => {
    if (klant) return klant;
    const klantData = await getKlantData(id);
    if (klantData) return klantData;
  };

  const getInschrijvingenData = async (inschrijvingIds: string[]) => {
    if (inschrijvingen) return inschrijvingen;
    const inschrijvingenData = await getInschrijvingen(inschrijvingIds);
    setInschrijvingen(inschrijvingenData);
    return inschrijvingenData;
  };

  return (
    <UserContext.Provider
      value={{
        klant,
        isLoggedIn,
        initializeKlant,
        getInschrijvingenData,
        clearData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);
