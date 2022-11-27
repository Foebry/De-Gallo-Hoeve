import { NextApiRequest, NextApiResponse } from "next";
import client, { getRasOptions } from "../../middleware/MongoDb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).send({});
  await client.connect();
  const rassen = await getRasOptions();
  // await client.close();

  return res.status(200).send(rassen);
};

export default handler;
