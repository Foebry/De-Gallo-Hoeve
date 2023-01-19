import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getHondById } from "src/controllers/HondController";
import { getInschrijvingById } from "src/controllers/InschrijvingController";
import {
  DetailInschrijvingResponse,
  mapToInschrijvingDetail,
} from "src/mappers/Inschrijvingen";
import {
  HondNotFoundError,
  InschrijvingNotFoundError,
} from "src/shared/RequestError";
import { GenericRequest } from "src/pages/api/auth/login.page";
import { closeClient } from "src/utils/db";
import { logError } from "src/controllers/ErrorLogController";

export interface DetailRequest extends NextApiRequest {
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
  try {
    const inschrijving = await getInschrijvingById(new ObjectId(_id));
    if (!inschrijving) throw new InschrijvingNotFoundError();
    const hond = await getHondById(inschrijving.hond.id);
    if (!hond) throw new HondNotFoundError();

    const result = mapToInschrijvingDetail(inschrijving, hond);

    closeClient();

    return res.status(200).send(result);
  } catch (e: any) {
    await logError("admin/inschrijvingen/:id", req, e);
    closeClient();
    return res.status(e.code).send(e.response);
  }
};

export default handler;
