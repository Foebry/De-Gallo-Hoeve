import { NextApiRequest, NextApiResponse } from "next";
import { KLANT } from "src/controllers/KlantController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "src/shared/RequestHelper";
import {
  mapToAdminKlantenOverviewResult,
  PaginatedKlant,
} from "src/mappers/klanten";
import { IsKlantCollection } from "src/types/EntityTpes/KlantTypes";
import { GenericRequest } from "src/pages/api/auth/login.page";

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
  const result = mapToAdminKlantenOverviewResult(data);

  return res.status(200).send(result);
};

export default handler;
