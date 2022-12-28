import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getInschrijvingenByIds } from "src/controllers/InschrijvingController";
import { getKlantById } from "src/controllers/KlantController";
import { mapToKlantDetail } from "src/mappers/klanten";
import client from "src/utils/MongoDb";
import { KlantNotFoundError } from "src/shared/RequestError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getKlantDetail(req, res);
  return res.status(405).send({ message: "Not Allowed" });
};

interface RequestQuery {
  slug?: string;
}

type KlantDetailResponse = {};

const getKlantDetail = async (
  req: NextApiRequest,
  res: NextApiResponse<KlantDetailResponse>
) => {
  const { slug: _id } = req.query as RequestQuery;

  await client.connect();

  const klant = await getKlantById(new ObjectId(_id));
  if (!klant) throw new KlantNotFoundError();

  const inschrijvingen = await getInschrijvingenByIds(klant.inschrijvingen);

  const result = mapToKlantDetail(klant, inschrijvingen);

  await client.close();

  return res.status(200).send(result);
};

export default handler;
