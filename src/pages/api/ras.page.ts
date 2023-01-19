import { NextApiRequest, NextApiResponse } from "next";
import { closeClient } from "src/utils/db";
import { getRasOptions } from "src/utils/MongoDb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).send({});

  const rassen = await getRasOptions();

  closeClient();

  return res.status(200).send(rassen);
};

export default handler;
