import { NextApiRequest, NextApiResponse } from "next";
import { KLANT } from "../../../../controllers/KlantController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "../../../../helpers/RequestHelper";
import {
  mapToAdminKlantenOverviewResult,
  PaginatedKlant,
} from "../../../../middleware/mappers/klanten";
import { IsKlantCollection } from "../../../../types/EntityTpes/KlantTypes";
import { GenericRequest } from "../../auth/login";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getKlantenOverview(req as GenericRequest<ListKlantenRequest>, res);
};

interface ListKlantenRequest extends NextApiRequest {
  query: PaginatedRequestQuery;
  url: string;
}

const getKlantenOverview = async (
  req: GenericRequest<ListKlantenRequest>,
  res: NextApiResponse<PaginatedResponse<PaginatedKlant>>
) => {
  const data = await getPaginatedData<IsKlantCollection>(
    req.query,
    req.url,
    KLANT
  );
  console.log({ url: req.url });
  const result = mapToAdminKlantenOverviewResult(data);

  return res.status(200).send(result);
};

export default handler;
