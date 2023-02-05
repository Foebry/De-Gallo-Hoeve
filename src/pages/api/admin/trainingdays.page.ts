import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { closeClient, getTrainingDaysCollection } from 'src/utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getAvailableDays(req, res);
  if (req.method === 'POST') return setAvailabelDays(req, res);
  return res.status(405).send('Not Allowed');
};

const getAvailableDays = async (req: NextApiRequest, res: NextApiResponse) => {
  const collection = await getTrainingDaysCollection();
  const data = await collection.find({ date: { $gt: new Date() } }).toArray();

  const result = data.map((day) => day.date.toISOString().split('T')[0]);

  return res.status(200).send(result);
};

const setAvailabelDays = async (req: NextApiRequest, res: NextApiResponse) => {
  const { selected } = req.body;
  const collection = await getTrainingDaysCollection();

  const data = await collection.find({ date: { $gt: new Date() } }).toArray();
  const currentTrainingDays = data.map((day) => ({
    date: day.date.toISOString().split('T')[0],
    _id: day._id,
  }));

  const deletedTrainingDays = currentTrainingDays.filter(
    (day) => !selected.includes(day.date)
  );
  const daysToAdd = selected.filter(
    (day: string) => !currentTrainingDays.map((day) => day.date).includes(day)
  );

  await collection.deleteMany({
    _id: { $in: deletedTrainingDays.map((day) => day._id) },
  });

  await collection.insertMany(
    daysToAdd.map((day: string) => ({
      _id: new ObjectId(),
      date: new Date(day),
    }))
  );

  // verwijder inschrijvingen met data uit deleteTrainingDays vervolgens deze klanten verwittigen.
  //closeClient(;

  return res.status(200).send(selected);
};

export default handler;
