import { NextApiRequest, NextApiResponse } from "next";
import { mapToAdminKlantenOverviewResult } from "../../../../middleware/mappers";
import { getPaginatedKlanten } from "../../../../middleware/repositories/klanten";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return getKlantenOverview(req, res);
};

const getKlantenOverview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const data = await getPaginatedKlanten(req.query);
  const result = mapToAdminKlantenOverviewResult(data);

  return res.status(200).send(result);
};

export default handler;
