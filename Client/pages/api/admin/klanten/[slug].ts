import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getKlantById } from "../../../../controllers/KlantController";
import { mapToKlantDetail } from "../../../../middleware/mappers";
import client from "../../../../middleware/MongoDb";
import { KlantNotFoundError } from "../../../../middleware/RequestError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getKlantDetail(req, res);
  return res.status(405).send({ message: "Not Allowed" });
};

interface RequestQuery {
  slug?: string;
}

const getKlantDetail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug: _id } = req.query as RequestQuery;

  await client.connect();

  const klant = await getKlantById(new ObjectId(_id));
  if (!klant) throw new KlantNotFoundError();

  const result = mapToKlantDetail(klant);

  return res.status(200).send(result);
};

export default handler;
