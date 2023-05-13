import { LOGINAPI } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { IsKlantCollection } from 'src/common/domain/klant';
import useMutation from 'src/hooks/useMutation';
import { useUserContext } from '../app/UserContext';

type LoginBody = {
  email: string;
  password: string;
};

type RegisterBody = {};

type LoginRegisterErrors = Partial<LoginBody & RegisterBody>;

export type AuthContext = {
  disabled: boolean;
  login: (body: LoginBody) => Promise<Partial<LoginBody> | void>;
  errors: LoginRegisterErrors;
};

export const defaultValues: AuthContext = {
  disabled: false,
  login: async ({}) => {},
  errors: {},
};

export const AuthContext = createContext<AuthContext>(defaultValues);

export const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
  const { initializeKlant } = useUserContext();
  const loginMutation = useMutation<IsKlantCollection>(LOGINAPI);
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>();
  const [errors, setErrors] = useState<LoginRegisterErrors>({});

  const login = async (body: LoginBody) => {
    if (disabled) return;
    setDisabled(true);
    const { data, error } = await loginMutation(body);
    setDisabled(false);
    if (error) {
      setErrors(error);
      toast.error(error.message ?? 'Er is iets misgegaan, probeer later opnieuw');
    }
    if (data) {
      initializeKlant(data);
      router.push(callbackUrl ?? '/');
      setCallbackUrl(() => undefined);
      setErrors({});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        disabled,
        login,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
