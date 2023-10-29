import { KlantHond } from '@/types/EntityTpes/HondTypes';
import { TrainingType } from '@/types/EntityTpes/TrainingType';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { HondDto } from 'src/common/api/types/hond';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import { IsKlantCollection } from 'src/common/domain/klant';
import getData from 'src/hooks/useApi';
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

type AuthenticationResponse = {
  loggedIn: boolean;
  honden: HondDto[];
  inschrijvingen: InschrijvingDto[];
  role: string;
  name: string;
};

export const UserContext = createContext<contextType>(defaultValues);

const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [honden, setHonden] = useState<HondDto[]>([]);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[]>();
  const [klant, setKlant] = useState<IsKlantCollection | null>(null);
  const router = useRouter();

  const clearData = () => setKlant(null);

  const initializeKlant = async (klant: IsKlantCollection) => {
    setKlant(klant);
    localStorage.setItem('klant', JSON.stringify({ ...klant, id: klant._id.toString() }));
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const initializeKlant = async () => {
      const { data, error } = await getData<AuthenticationResponse>('/api/auth/me');
      if (data?.loggedIn) {
        setHonden(data.honden);
      } else router.push('/login');
    };
    initializeKlant();
  }, []);

  return (
    <UserContext.Provider
      value={{
        klant,
        isLoggedIn,
        initializeKlant,
        clearData,
        honden,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);
