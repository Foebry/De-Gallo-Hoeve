import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { createContext, useContext } from 'react';
import { FeedbackDto } from 'src/common/api/types/feedback';
import { IsKlantCollection } from 'src/common/domain/klant';
import getData from 'src/hooks/useApi';
import { useUserContext } from '../app/UserContext';
import { useFeedbackContext } from '../FeedbackContext';
import { AuthProvider, useAuthContext } from './authContext';

type contextType = {
  getKlantData: (id: string) => Promise<IsKlantCollection>;
  getInschrijvingen: (ids: string[]) => Promise<InschrijvingCollection[]>;
  getFeedback: () => Promise<FeedbackDto[]>;
};

const defaultValues: contextType = {
  getKlantData: async (id: string) => ({} as IsKlantCollection),
  getInschrijvingen: async (ids: string[]) => [],
  getFeedback: async () => [],
};

export const ApiContext = createContext<contextType>(defaultValues);

const ApiProvider: React.FC<{ children: any }> = ({ children }) => {
  const { klant, initializeKlant } = useUserContext();
  const { feedback, setFeedback } = useFeedbackContext();

  const getKlantData = async (klantId: string) => {
    if (klant) return klant;
    const url = `/api/admin/klanten/${klantId}`;
    const { data, error } = await getData(url);
    if (data) {
      initializeKlant(data);
      return data;
    }
    return null;
  };

  const getInschrijvingen = async (inschrijvingenIds: string[]) => {
    const url = '/api/inschrijvingen';
    const params = { ids: inschrijvingenIds };
    const { data, error } = await getData(url, params);
    if (data) return data;
    return null;
  };

  const getFeedback = async () => {
    if (feedback.length) return feedback;
    const url = '/api/customer-feedback';
    const { data, error } = await getData(url);
    if (data) {
      setFeedback(data);
      return data;
    }
    return null;
  };

  return (
    <ApiContext.Provider
      value={{
        getKlantData,
        getInschrijvingen,
        getFeedback,
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </ApiContext.Provider>
  );
};

export default ApiProvider;

export const useApiContext = () => ({ ...useContext(ApiContext), ...useAuthContext() });
