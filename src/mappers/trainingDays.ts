import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { TrainingDaysCollection } from '@/types/EntityTpes/TrainingType';

export const defaultTrainingTimeSlots = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const mapToAvailableTrainingDays = (
  data: TrainingDaysCollection[]
): TrainingDayDto[] =>
  data.map((trainingDay) => ({
    date: trainingDay.date.toISOString(),
    _id: trainingDay._id.toString(),
    timeslots: trainingDay.timeslots ?? defaultTrainingTimeSlots,
  }));
