import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { PriveTrainingCollection } from "src/types/EntityTpes/TrainingType";
import { atob, btoa } from "buffer";
import { getTrainingById, update } from "src/controllers/TrainingController";
import { TrainingNotFoundError } from "src/shared/RequestError";
import { closeClient, getTrainingCollection } from "src/utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getTrainingData(req, res);
  else if (req.method === "PUT") return updateTrainingData(req, res);
  else return res.status(405).send("Not Allowed");
};

const getTrainingData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const data = await getTrainingById(new ObjectId(id as string));
  if (!data) {
    throw new TrainingNotFoundError();
  }

  const result = {
    subtitle: Buffer.from(data.subtitle, "base64").toString(),
    content: Buffer.from(data.content, "base64").toString().split("\n"),
    image: data.image,
    prijsExcl: data.prijsExcl,
    bullets: data.bullets,
  };

  //closeClient(;

  return res.status(200).send(result);
};

const updateTrainingData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const { subtitle, content, image, price, bullets } = req.body;

  const training = await getTrainingById(new ObjectId(id as string));
  if (!training) throw new TrainingNotFoundError();

  training.subtitle = Buffer.from(subtitle, "base64").toString();
  training.content = Buffer.from(content.join("\n"), "base64").toString();
  training.image = image;
  training.prijsExcl = price;
  training.bullets = bullets;

  await update(training._id, training);

  //closeClient(;

  return res.status(200).send(training);
};

export default handler;
