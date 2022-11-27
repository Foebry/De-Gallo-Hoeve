import { NextApiRequest, NextApiResponse } from "next";
import { RAS } from "../../../../controllers/rasController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "../../../../helpers/RequestHelper";
import {
  mapToRassenOverviewResult,
  PaginatedRas,
  Ras,
} from "../../../../middleware/mappers/rassen";
import { GenericRequest } from "../../auth/login";

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
  const data = await getPaginatedData<Ras>(req.query, req.url, RAS);

  const result = mapToRassenOverviewResult(data);

  return res.status(200).send(result);
};

export default handler;
