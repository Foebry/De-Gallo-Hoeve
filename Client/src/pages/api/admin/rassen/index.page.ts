import { NextApiRequest, NextApiResponse } from "next";
import { RAS } from "src/controllers/rasController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "src/helpers/RequestHelper";
import { mapToRassenOverviewResult, PaginatedRas } from "src/mappers/rassen";
import { GenericRequest } from "src/pages/api/auth/login.page";
import { RasCollection } from "src/types/EntityTpes/RasTypes";

type RassenOverviewRequest = {
  query: PaginatedRequestQuery;
  url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getRassenOverview(req as GenericRequest<RassenOverviewRequest>, res);
};

const getRassenOverview = async (
  req: GenericRequest<RassenOverviewRequest>,
  res: NextApiResponse<PaginatedResponse<PaginatedRas>>
) => {
  const data = await getPaginatedData<RasCollection>(req.query, req.url, RAS);

  const result = mapToRassenOverviewResult(data);

  return res.status(200).send(result);
};

export default handler;
