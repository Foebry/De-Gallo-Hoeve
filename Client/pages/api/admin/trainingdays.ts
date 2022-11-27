import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getTrainingDaysCollection } from "@controllers/TrainingController";
import client from "@middlewares/MongoDb";
import { TrainingDaysCollection } from "types/EntityTpes/TrainingType";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getAvailableDays(req, res);
  if (req.method === "POST") return setAvailabelDays(req, res);
  return res.status(405).send("Not Allowed");
};

const getAvailableDays = async (req: NextApiRequest, res: NextApiResponse) => {
  await client.connect();
  const data = (await getTrainingDaysCollection()
    .find({ date: { $gt: new Date() } })
    .toArray()) as TrainingDaysCollection[];

  const result = data.map((day) => day.date.toISOString().split("T")[0]);
  return res.status(200).send(result);
};

const setAvailabelDays = async (req: NextApiRequest, res: NextApiResponse) => {
  const { selected } = req.body;
  await client.connect();

  const currentCollections = (await getTrainingDaysCollection()
    .find({ date: { $gt: new Date() } })
    .toArray()) as TrainingDaysCollection[];
  const currentTrainingDays = currentCollections.map((day) => ({
    date: day.date.toISOString().split("T")[0],
    _id: day._id,
  }));

  const deletedTrainingDays = currentTrainingDays.filter(
    (day) => !selected.includes(day.date)
  );
  const daysToAdd = selected.filter(
    (day: string) => !currentTrainingDays.map((day) => day.date).includes(day)
  );

  await getTrainingDaysCollection().deleteMany({
    _id: { $in: deletedTrainingDays.map((day) => day._id) },
  });

  await getTrainingDaysCollection().insertMany(
    daysToAdd.map((day: string) => ({
      _id: new ObjectId(),
      date: new Date(day),
    }))
  );

  // verwijder inschrijvingen met data uit deleteTrainingDays vervolgens deze klanten verwittigen.
  await client.close();

  return res.status(200).send(selected);
};

export default handler;
