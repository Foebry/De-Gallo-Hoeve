import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getInschrijvingenByIds } from "src/controllers/InschrijvingController";
import { getKlantById } from "src/controllers/KlantController";
import { mapToKlantDetail } from "src/mappers/klanten";
import { KlantNotFoundError } from "src/shared/RequestError";
import { closeClient } from "src/utils/db";
import { GenericRequest } from "../../auth/login.page";
import { DetailRequest } from "../inschrijvingen/[slug].page";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getKlantDetail(req as GenericRequest<DetailRequest>, res);
  return res.status(405).send({ message: "Not Allowed" });
};
type KlantDetailResponse = {};

const getKlantDetail = async (
  req: GenericRequest<DetailRequest>,
  res: NextApiResponse<KlantDetailResponse>
) => {
  const { slug: _id } = req.query;

  const klant = await getKlantById(new ObjectId(_id));
  if (!klant) throw new KlantNotFoundError();

  const inschrijvingen = await getInschrijvingenByIds(klant.inschrijvingen);

  const result = mapToKlantDetail(klant, inschrijvingen);

  closeClient();

  return res.status(200).send(result);
};

export default handler;
