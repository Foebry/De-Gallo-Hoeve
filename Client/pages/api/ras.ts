import { NextApiRequest, NextApiResponse } from "next";
import client, { getConnection, getRasOptions } from "@middlewares/MongoDb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).send({});
  await getConnection();
  const rassen = await getRasOptions();
  // await client.close();

  return res.status(200).send(rassen);
};

export default handler;
