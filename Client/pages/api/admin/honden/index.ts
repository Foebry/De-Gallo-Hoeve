import { NextApiRequest, NextApiResponse } from "next";
import { HOND } from "../../../../controllers/HondController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "../../../../helpers/RequestHelper";
import {
  mapToHondenOverviewResult,
  PaginatedKlantHond,
} from "../../../../middleware/mappers/honden";
import {
  HondCollection,
  KlantHond,
} from "../../../../types/EntityTpes/HondTypes";
import { GenericRequest } from "../../auth/login";

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
  console.log({ status: "inside handler" });
  try {
    const data = await getPaginatedData<KlantHond>(req.query, req.url, HOND);
    console.log({ data });

    const result = mapToHondenOverviewResult(data);

    return res.status(200).send(result);
  } catch (e: any) {
    return res.status(e.code).send(e.message);
  }
};

export default handler;
