import { LOGOUT } from '@/types/apiTypes';
import { INDEX } from '@/types/linkTypes';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthDto, AuthKlantDto } from 'src/common/api/dtos/AuthDto';
import { HondDto } from 'src/common/api/types/hond';
import { InschrijvingDto } from 'src/common/api/types/inschrijving';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { REQUEST_METHOD } from 'src/utils/axios';

type contextType = {
  klant: AuthKlantDto | null;
  honden: Omit<HondDto, 'klant'>[];
  inschrijvingen: Omit<InschrijvingDto, 'klant'>[];
  logout: () => Promise<void>;
  initializeKlant: (data: AuthDto) => Promise<void>;
};

const defaultValues: contextType = {
  klant: null,
  honden: [],
  inschrijvingen: [],
  logout: async () => {},
  initializeKlant: async () => {},
};
export const UserContext = createContext<contextType>(defaultValues);

const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [honden, setHonden] = useState<Omit<HondDto, 'klant'>[]>([]);
  const [inschrijvingen, setInschrijvingen] = useState<Omit<InschrijvingDto, 'klant'>[]>([]);
  const [klant, setKlant] = useState<AuthKlantDto | null>(null);
  const router = useRouter();
  const logoutMutation = useMutation<{}>(LOGOUT);

  const logout = async () => {
    await logoutMutation('/', {}, { method: REQUEST_METHOD.DELETE });
    setKlant(null);
    setInschrijvingen([]);
    setHonden([]);
    router.push(INDEX);
  };

  const getMe = async () => {
    const { data } = await getData<AuthDto>('/api/auth/me');
    if (data) initializeKlant.current(data);
  };
  const initializeKlant = useRef(async (data: AuthDto) => {
    if (!data || data?.loggedIn === false) setKlant(null);
    else if (data && data.loggedIn) {
      const { honden, inschrijvingen, ...klant } = data.klant;
      setHonden(honden);
      setInschrijvingen(inschrijvingen);
      setKlant(klant);
    }
  });

  useEffect(() => {
    getMe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        klant,
        honden,
        inschrijvingen,
        logout,
        initializeKlant: initializeKlant.current,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);
