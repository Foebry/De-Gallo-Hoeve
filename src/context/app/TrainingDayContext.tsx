import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { nanoid } from 'nanoid';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { defaultTrainingTimeSlots } from 'src/mappers/trainingDays';
import { sleep } from 'src/shared/functions';
import { REQUEST_METHOD } from 'src/utils/axios';
import { useModalContext } from '../ModalContext';
import { RevalidateOptions } from './klantContext';

type TrainingDayContext = {
  trainingDays?: TrainingDayDto[];
  updateTrainingDay: (trainingDayDto: TrainingDayDto) => void;
  updateAvailableDays: (trainingDays: string[]) => void;
  saveTrainingDays: () => Promise<void>;
  useGetAvailableTrainingDays: (
    options?: RevalidateOptions,
    url?: string
  ) => { data: TrainingDayDto[]; isLoading: boolean };
  error?: string;
};

const trainingDayContextDefaultValues: TrainingDayContext = {
  trainingDays: [],
  updateTrainingDay: () => {},
  updateAvailableDays: () => {},
  saveTrainingDays: async () => {},
  useGetAvailableTrainingDays: () => ({ data: [], isLoading: false }),
};

export const TrainingDayContext = createContext<TrainingDayContext>(
  trainingDayContextDefaultValues
);

const TrainingDayProvider: React.FC<{ children: any }> = ({ children }) => {
  const [trainingDays, setTrainingDays] = useState<TrainingDayDto[]>();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [lastUrl, setLastUrl] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const [revalidateTrainingDays, setRevalidateTrainingDays] = useState<boolean>(false);
  const save = useMutation<TrainingDayDto[]>('/api/admin/trainingdays');
  const currentRetries = useRef<number>(0);
  const { updateModal } = useModalContext();

  const updateTrainingDay = (trainingDayDto: TrainingDayDto) => {
    if (!trainingDays) return;
    setTrainingDays(() =>
      trainingDays.map((day) => (day._id === trainingDayDto._id ? trainingDayDto : day))
    );
  };

  const updateAvailableDays = (days: string[]) => {
    if (!trainingDays) return;
    const remainingTrainingDays = trainingDays?.filter((day) =>
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
      {
        selected: trainingDays,
        confirmed,
      },
      { method: REQUEST_METHOD.PUT }
    );
    if (error) {
      if (error.code === 409) {
        updateModal(error.message, () => saveTrainingDays);
      } else {
        toast.error(error.message);
      }
    }
    if (data) {
      toast.success('save succesvol');
      setRevalidateTrainingDays(true);
    }
  };

  const useGetAvailableTrainingDays = (options?: RevalidateOptions, url?: string) => {
    const maxRetries = options?.maxRetries ?? 5;
    const [loading, setLoading] = useState<boolean>(true);
    const urlMatchesLastUrl = url === lastUrl;

    useEffect(() => {
      setLoading(true);
      (async () => {
        if (!revalidateTrainingDays && trainingDays && urlMatchesLastUrl) {
          setLoading(false);
        } else {
          setLastUrl(url);
          while (!success && currentRetries.current <= maxRetries) {
            const { data, error } = await getData<TrainingDayDto[]>(
              url ?? '/api/admin/trainingdays'
            );
            if (error) {
              currentRetries.current += 1;
              toast.error('Fout bij laden van beschikbare training dagen');
              await sleep(5);
              continue;
            } else if (data) {
              setTrainingDays(data);
              setSuccess(true);
              setRevalidateTrainingDays(false);
              currentRetries.current = 0;
              break;
            }
          }
          setLoading(false);
          setSuccess(false);
        }
      })();
    }, [maxRetries, url, urlMatchesLastUrl]);
    return { data: trainingDays ?? [], isLoading: loading };
  };

  return (
    <TrainingDayContext.Provider
      value={{
        trainingDays,
        updateTrainingDay,
        saveTrainingDays,
        updateAvailableDays,
        useGetAvailableTrainingDays,
      }}
    >
      {children}
    </TrainingDayContext.Provider>
  );
};

export const useTrainingDayContext = () => useContext(TrainingDayContext);

export default TrainingDayProvider;

const sortAscending = (trainingDays: TrainingDayDto[]): TrainingDayDto[] => {
  return trainingDays.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
