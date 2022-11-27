import { NextApiRequest, NextApiResponse } from "next";
import { INSCHRIJVING } from "@controllers/InschrijvingController";
import {
  getPaginatedData,
  PaginatedRequestQuery,
  PaginatedResponse,
} from "helpers/RequestHelper";
import { InschrijvingCollection } from "types/EntityTpes/InschrijvingTypes";
import { GenericRequest } from "pages/api/auth/login";
import {
  mapToAdminInschrijvingenOverviewResult,
  PaginatedInschrijving,
} from "@middlewares/mappers/Inschrijvingen";

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
