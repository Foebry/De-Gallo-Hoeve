import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getHondById } from "@controllers/HondController";
import { getInschrijvingById } from "@controllers/InschrijvingController";
import {
  DetailInschrijvingResponse,
  mapToInschrijvingDetail,
} from "@middlewares/mappers/Inschrijvingen";
import client from "@middlewares/MongoDb";
import {
  HondNotFoundError,
  InschrijvingNotFoundError,
} from "@middlewares/RequestError";
import { GenericRequest } from "pages/api/auth/login";

interface DetailRequest extends NextApiRequest {
  query: { slug: string };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getInschrijvingDetail(req as GenericRequest<DetailRequest>, res);
};

const getInschrijvingDetail = async (
  req: GenericRequest<DetailRequest>,
  res: NextApiResponse<DetailInschrijvingResponse>
) => {
  const { slug: _id } = req.query;

  await client.connect();
  try {
    const inschrijving = await getInschrijvingById(new ObjectId(_id));
    if (!inschrijving) throw new InschrijvingNotFoundError();
    const hond = await getHondById(inschrijving.hond.id);
    if (!hond) throw new HondNotFoundError();

    const result = mapToInschrijvingDetail(inschrijving, hond);

    await client.close();

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
