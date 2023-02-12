import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteMany,
  getEnabledTrainingDays,
  saveMany,
  TRAININGDAY,
} from 'src/controllers/TrainingDayController';
import { mapToAvailableTrainingDays } from 'src/mappers/trainingDays';
import { adminApi } from 'src/services/Authenticator';
import { createTrainingDay, getController } from 'src/services/Factory';
import { NotAllowedError, TrainingNotFoundError } from 'src/shared/RequestError';
import { closeClient, getTrainingDaysCollection } from 'src/utils/db';
import logger from 'src/utils/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    adminApi({ req, res });

    if (req.method !== 'GET' && req.method !== 'POST') throw new NotAllowedError();

    if (req.method === 'GET') return getAvailableDays(req, res);

    if (req.method === 'POST') return setAvailabelDays(req, res);
  } catch (error: any) {
    return res.status(error.code).json(error.response);
  }
};

const getAvailableDays = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getController(TRAININGDAY).getEnabledTrainingDays();

    // const result = data.map((day) => day.date.toISOString().split('T')[0]);

    const result = mapToAvailableTrainingDays(data);
    console.log({ result });

    return res.status(200).send(result);
  } catch (error: any) {
    return res.status(error.code).json(error.response);
  }
};

const setAvailabelDays = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log({ tatus: 'inside handler' });
  const { selected } = req.body;
  console.log({ selected });
  selected.forEach((dto: TrainingDayDto) => {
    if (dto.date === '2023-03-02T00:00:00.000Z')
      console.log({ timeslots: dto.timeslots });
  });
  const currentTrainingDays = await getEnabledTrainingDays();
  // const currentTrainingDays = await collection
  //   .find({ date: { $gt: new Date() } })
  //   .toArray();

  // const currentTrainingDays = data.map((day) => ({
  //   date: day.date.toISOString().split('T')[0],
  //   _id: day._id,
  //   timeslots: day.timeslots,
  // }));

  const deletedTrainingDays = currentTrainingDays.filter(
    (day) =>
      !selected
        .map((newDay: TrainingDayDto) => newDay.date.split('T')[0])
        .includes(day.date.toISOString().split('T')[0])
  );
  console.log({ deletedTrainingDays });
  const daysToAdd = selected.filter(
    (newDay: TrainingDayDto) =>
      !currentTrainingDays
        .map((day) => day.date.toISOString().split('T')[0])
        .includes(newDay.date.split('T')[0])
  );
  console.log({ daysToAdd });
  const daysToUpdate = currentTrainingDays
    .filter(
      (curr) =>
        !deletedTrainingDays
          .map((day) => day.date.toISOString().split('T')[0])
          .includes(curr.date.toISOString().split('T')[0])
    )
    .filter(
      (curr) =>
        !daysToAdd
          .map((day: TrainingDayDto) => day.date.split('T')[0])
          .includes(curr.date.toISOString().split('T')[0])
    )
    .map((curr) => ({
      ...curr,
      timeslots: selected.find(
        (dto: TrainingDayDto) =>
          dto.date.split('T')[0] === curr.date.toISOString().split('T')[0]
      ).timeslots,
    }));
  console.log({ daysToUpdate });

  if (deletedTrainingDays.length) {
    const _ids = deletedTrainingDays.map((day) => day._id);
    await deleteMany(_ids);
  }
  // await getController(TRAININGDAY).deleteMany(
  //   deletedTrainingDays.map((day) => day._id)
  // );
  // await collection.deleteMany({
  //   _id: { $in: deletedTrainingDays.map((day) => day._id) },
  // });

  if (daysToAdd.length) {
    const trainingDays = daysToAdd.map((day: TrainingDayDto) => createTrainingDay(day));
    await saveMany(trainingDays);
  }

  // await collection.insertMany(
  //   daysToAdd.map((day: TrainingDayDto) => createTrainingDay(day))
  // );
  for (const trainingDay of daysToUpdate) {
    await getController(TRAININGDAY).updateOne(trainingDay);
    // await collection.updateOne(
    //   { _id: new ObjectId(trainingDay._id) },
    //   { $set: { timeslots: trainingDay.timeslots } }
    // );
  }

  // verwijder inschrijvingen met data uit deleteTrainingDays vervolgens deze klanten verwittigen.
  //closeClient(;

  return res.status(200).send(selected);
};

export default handler;
