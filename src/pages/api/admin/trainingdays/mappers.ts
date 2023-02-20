import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { TrainingDaysCollection } from '@/types/EntityTpes/TrainingType';
import { defaultTrainingTimeSlots } from 'src/mappers/trainingDays';

export const mapToAvailableTrainingDays = (
  data: TrainingDaysCollection[]
): TrainingDayDto[] =>
  data.map((trainingDay) => ({
    date: trainingDay.date.toISOString(),
    _id: trainingDay._id.toString(),
    timeslots: trainingDay.timeslots ?? [...defaultTrainingTimeSlots],
  }));
