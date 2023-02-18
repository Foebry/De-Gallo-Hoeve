import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { TrainingDaysCollection } from '@/types/EntityTpes/TrainingType';
import { ObjectId } from 'mongodb';
import { getController } from 'src/services/Factory';
import { getCurrentTime } from 'src/shared/functions';
import { InternalServerError } from 'src/shared/RequestError';
import { getTrainingDaysCollection } from 'src/utils/db';
import { INSCHRIJVING } from './InschrijvingController';

export const getEnabledTrainingDays = async (): Promise<TrainingDaysCollection[]> => {
  const collection = await getTrainingDaysCollection();
  return collection.find({ date: { $gt: new Date() } }, { sort: { date: 1 } }).toArray();
};

const getAvailableForInschrijving = async (): Promise<AvailableForInschrijving> => {
  const inschrijvingController = getController(INSCHRIJVING);
  let enabledDays = await getEnabledTrainingDays();
  const date = new Date(enabledDays[0].date);
  const disabled: string[] = [];
  const endDate = enabledDays.reverse()[0].date.toISOString();
  const enabledDateString = enabledDays.map(
    (day) => day.date.toISOString().split('T')[0]
  );

  while (true) {
    const newDate = new Date(date.setDate(date.getDate() + 1));
    if (newDate > new Date(endDate)) break;
    const dateString = newDate.toISOString().split('T')[0];
    const trainingDayInQuestion = enabledDays.find(
      (day) => day.date.toISOString().split('T')[0] === dateString
    );
    if (
      !enabledDateString.includes(dateString) ||
      trainingDayInQuestion!.timeslots.length === 0
    ) {
      disabled.push(dateString);
      enabledDays = enabledDays.filter(
        (day) => day._id.toString() !== trainingDayInQuestion?._id.toString()
      );
    }
    continue;
  }

  const activeDates = enabledDays
    .map((day) => day.date)
    .sort((a, b) => a.getTime() - b.getTime());
  const actieveInschrijvingen =
    await inschrijvingController.getInschrijvingenBetweenDates(
      activeDates[0],
      new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
    );

  let available = enabledDays.map((day) => {
    const relevantInschrijvingen = actieveInschrijvingen.filter(
      (inschrijving) =>
        inschrijving.datum.toISOString().split('T')[0] ===
        day.date.toISOString().split('T')[0]
    );
    if (!relevantInschrijvingen.length) return day;

    relevantInschrijvingen.forEach((inschrijving) => {
      const relevantTimeslot = inschrijving.datum
        .toISOString()
        .split('T')[1]
        .split('.')[0]
        .split(':')
        .slice(0, 2)
        .join(':');

      day.timeslots = day.timeslots.filter((timeslot) => timeslot !== relevantTimeslot);
    });
    return day;
  });

  available.forEach((trainingDay) => {
    if (trainingDay.timeslots.length === 0) disabled.push(trainingDay.date.toISOString());
  });
  available = available.filter(
    (trainingDay) => !disabled.includes(trainingDay.date.toISOString())
  );

  return {
    disabled: disabled
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((dateString) => dateString.split('T')[0]),
    available: available
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((trainingDay) => ({
        date: trainingDay.date.toISOString().split('T')[0],
        timeslots: trainingDay.timeslots,
        _id: trainingDay._id.toString(),
      })),
  };
};

const updateOne = async (trainingDay: TrainingDaysCollection): Promise<void> => {
  const collection = await getTrainingDaysCollection();
  const { modifiedCount } = await collection.updateOne(
    { _id: trainingDay._id },
    {
      $set: {
        timeslots: trainingDay.timeslots,
        updated_at: getCurrentTime(),
      },
    }
  );
  if (modifiedCount !== 1) throw new InternalServerError();
};

export const deleteMany = async (_ids: ObjectId[]): Promise<void> => {
  const collection = await getTrainingDaysCollection();
  await collection.deleteMany({ _id: { $in: _ids } });
};

export const deleteAll = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    const collection = await getTrainingDaysCollection();
    await collection.deleteMany({});
  }
};

export const saveMany = async (
  trainingDays: TrainingDaysCollection[]
): Promise<TrainingDaysCollection[]> => {
  const collection = await getTrainingDaysCollection();
  await collection.insertMany(trainingDays);
  return trainingDays;
};

const trainingDayController: IsTrainingDayController = {
  getAvailableForInschrijving,
  getEnabledTrainingDays,
  updateOne,
  deleteMany,
  deleteAll,
  saveMany,
};

type AvailableForInschrijving = {
  disabled: string[];
  available: TrainingDayDto[];
};

export type IsTrainingDayController = {
  getAvailableForInschrijving: () => Promise<AvailableForInschrijving>;
  getEnabledTrainingDays: () => Promise<TrainingDaysCollection[]>;
  updateOne: (trainingDay: TrainingDaysCollection) => Promise<void>;
  deleteMany: (_ids: ObjectId[]) => Promise<void>;
  deleteAll: () => Promise<void>;
  saveMany: (trainingDays: TrainingDaysCollection[]) => Promise<TrainingDaysCollection[]>;
};

export default trainingDayController;
export const TRAININGDAY = 'TrainingDayController';
