import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { nanoid } from 'nanoid';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ModalType } from 'src/components/Modal/Modal/BaseModal';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { defaultTrainingTimeSlots } from 'src/mappers/trainingDays';
import { ModalContext } from './ModalContext';

type TrainingDayContext = {
  trainingDays: TrainingDayDto[];
  getTrainingDays: () => Promise<TrainingDayDto[]>;
  updateTrainingDay: (trainingDayDto: TrainingDayDto) => void;
  updateAvailableDays: (trainingDays: string[]) => void;
  saveTrainingDays: () => Promise<void>;
  error?: string;
};

const trainingDayContextDefaultValues: TrainingDayContext = {
  trainingDays: [],
  getTrainingDays: async () => {
    const { data: trainingDays } = await getData('/api/admin/trainingdays');
    return trainingDays;
  },
  updateTrainingDay: () => {},
  updateAvailableDays: () => {},
  saveTrainingDays: async () => {},
};

export const TrainingDayContext = createContext<TrainingDayContext>(
  trainingDayContextDefaultValues
);

const TrainingDayProvider: React.FC<{ children: any }> = ({ children }) => {
  const [trainingDays, setTrainingDays] = useState<TrainingDayDto[]>([]);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const save = useMutation();
  const { updateModal, openModal } = useContext(ModalContext);

  const getTrainingDays = async () => {
    if (hasLoaded) return sortAscending(trainingDays);
    const { data, error } = await getData('/api/admin/trainingdays');
    setTrainingDays(data);
    setHasLoaded(true);
    if (error) toast.error(error);
    return data;
  };

  const updateTrainingDay = (trainingDayDto: TrainingDayDto) => {
    setTrainingDays(() =>
      trainingDays.map((day) => (day._id === trainingDayDto._id ? trainingDayDto : day))
    );
  };

  const updateAvailableDays = (days: string[]) => {
    const remainingTrainingDays = trainingDays.filter((day) =>
      days.includes(day.date.split('T')[0])
    );
    const newDates = days.filter(
      (day) => !trainingDays.map((td) => td.date.split('T')[0]).includes(day)
    );
    const newTrainingDays: TrainingDayDto[] = newDates.map((date) => ({
      date: date,
      _id: nanoid(4),
      timeslots: defaultTrainingTimeSlots,
    }));

    setTrainingDays(() => sortAscending([...remainingTrainingDays, ...newTrainingDays]));
  };

  const saveTrainingDays = async (confirmed?: boolean) => {
    const { error, data } = await save(
      '/api/admin/trainingdays',
      {
        selected: trainingDays,
        confirmed,
      },
      { method: 'PUT' }
    );
    if (error) {
      if (error.code === 409) {
        updateModal(
          {
            type: 'error' as ModalType,
            content: error.message,
            caption: 'Ben je zeker?',
            callbackData: true,
          }, // getting typeError cannot read ERROR of undefined when using ModalType.ERROR
          () => saveTrainingDays
        );
        openModal();
      } else {
        toast.error(error.message);
      }
    }
    if (data) {
      toast.success('save succesvol');
      setTrainingDays(data);
    }
  };

  return (
    <TrainingDayContext.Provider
      value={{
        trainingDays,
        getTrainingDays,
        updateTrainingDay,
        saveTrainingDays,
        updateAvailableDays,
      }}
    >
      {children}
    </TrainingDayContext.Provider>
  );
};

export default TrainingDayProvider;

const sortAscending = (trainingDays: TrainingDayDto[]): TrainingDayDto[] => {
  return trainingDays.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
