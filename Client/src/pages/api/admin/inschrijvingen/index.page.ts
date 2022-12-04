import { NextApiRequest, NextApiResponse } from "next";
import { INSCHRIJVING } from "src/controllers/InschrijvingController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "src/shared/RequestHelper";
import { InschrijvingCollection } from "src/types/EntityTpes/InschrijvingTypes";
import { GenericRequest } from "src/pages/api/auth/login.page";
import {
  mapToAdminInschrijvingenOverviewResult,
  PaginatedInschrijving,
} from "src/mappers/Inschrijvingen";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET")
    return getInschrijvingOverview(
      req as GenericRequest<ListInschrijvingRequest>,
      res
    );
};

type ListInschrijvingRequest = {
  query: PaginatedRequestQuery;
  url: string;
};

const getInschrijvingOverview = async (
  req: GenericRequest<ListInschrijvingRequest>,
  res: NextApiResponse<PaginatedResponse<PaginatedInschrijving>>
) => {
  const data = await getPaginatedData<InschrijvingCollection>(
    req.query,
    req.url,
    INSCHRIJVING
  );

  const result = mapToAdminInschrijvingenOverviewResult(data);

  return res.status(200).send(result);
};

export default handler;
