import { NextApiRequest, NextApiResponse } from "next";
import { HOND } from "src/controllers/HondController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "src/shared/RequestHelper";
import {
  mapToHondenOverviewResult,
  PaginatedKlantHond,
} from "src/mappers/honden";
import { KlantHond } from "src/types/EntityTpes/HondTypes";
import { GenericRequest } from "src/pages/api/auth/login.page";
import { closeClient } from "src/utils/db";
import { logError } from "src/controllers/ErrorLogController";

type ListHondenRequest = {
  query: PaginatedRequestQuery;
  url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getHondenOverview(req as GenericRequest<ListHondenRequest>, res);
  return res.status(405).send("Not allowed");
};

const getHondenOverview = async (
  req: GenericRequest<ListHondenRequest>,
  res: NextApiResponse<PaginatedResponse<PaginatedKlantHond>>
) => {
  try {
    const data = await getPaginatedData<KlantHond>(req.query, req.url, HOND);

    const result = mapToHondenOverviewResult(data);

    closeClient();

    return res.status(200).send(result);
  } catch (e: any) {
    await logError("honden", req, e);
    closeClient();
    return res.status(e.code).send(e.message);
  }
};

export default handler;
