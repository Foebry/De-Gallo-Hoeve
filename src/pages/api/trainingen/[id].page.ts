import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getTrainingCollection } from "src/controllers/TrainingController";
import client from "src/utils/MongoDb";
import { PriveTrainingCollection } from "src/types/EntityTpes/TrainingType";
import { atob, btoa } from "buffer";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getTrainingData(req, res);
  else if (req.method === "PUT") return updateTrainingData(req, res);
  else return res.status(405).send("Not Allowed");
};

const getTrainingData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  await client.connect();
  const data = (await getTrainingCollection().findOne({
    _id: new ObjectId(id as string),
  })) as PriveTrainingCollection;

  const result = {
    subtitle: atob(data.subtitle),
    content: atob(data.content).split("\n"),
    image: data.image,
    prijsExcl: data.prijsExcl,
    bullets: data.bullets,
  };

  return res.status(200).send(result);
};

const updateTrainingData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const { subtitle, content, image, price, bullets } = req.body;

  await client.connect();
  await getTrainingCollection().updateOne(
    { _id: new ObjectId(id as string) },
    {
      $set: {
        subtitle: btoa(subtitle),
        content: btoa(content.join("\n")),
        image,
        price,
        bullets,
      },
    }
  );

  await client.close();

  return res.status(200).send({ subtitle, content, image, price, bullets });
};

export default handler;
