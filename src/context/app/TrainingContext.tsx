import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { PriveTrainingDto } from 'src/common/api/types/training';
import getData from 'src/hooks/useApi';
import { ApiResponse } from 'src/utils/axios';
import { defaultApiResponse } from './AppContext';

type TrainingContext = {
  getPriveTraining: () => ApiResponse<PriveTrainingDto>;
};

const defaultValues: TrainingContext = {
  getPriveTraining: async () => defaultApiResponse,
};

export const TrainingContext = createContext<TrainingContext>(defaultValues);

const TrainingProvider: React.FC<{ children: any }> = ({ children }) => {
  const getPriveTraining = async () => {
    const priveTrainingId = '62fa1f25bacc03711136ad5f';
    const url = `/api/trainingen/${priveTrainingId}`;
    const { data, error } = await getData<PriveTrainingDto>(url);
    if (error) toast.error('Fout bij laden privé training');
    return { data, error };
  };

  return (
    <TrainingContext.Provider
      value={{
        getPriveTraining,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingProvider;

export const useTrainingContext = () => useContext(TrainingContext);
