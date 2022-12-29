import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getContentCollection } from "src/controllers/ContentController";
import client from "src/utils/MongoDb";
import { ContentCollection } from "src/types/EntityTpes/ContentTypes";
import { atob, btoa } from "buffer";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getContent(req, res);
  else if (req.method === "PUT") return changeContent(req, res);
  else return res.status(405).send("Not Allowed");
};

const getContent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  await client.connect();
  const data = (await getContentCollection().findOne({
    _id: new ObjectId(id as string),
  })) as ContentCollection;

  const result = {
    subtitle: atob(data.subtitle),
    content: atob(data.content).split("\n"),
    image: data.image,
  };
  // await client.close();
  return res.status(200).send(result);
};

const changeContent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subtitle, content, image } = req.body;
  const { id } = req.query;

  await client.connect();
  await getContentCollection().updateOne(
    { _id: new ObjectId(id as string) },
    {
      $set: {
        subtitle: btoa(subtitle),
        content: btoa(content.join("\n")),
        image,
      },
    }
  );
  await client.close();
  return res.status(200).send({ subtitle, content, image });
};

export default handler;
