import { NextApiRequest, NextApiResponse } from "next";
import { validate, validateCsrfToken } from "../../handlers/validationHelper";
import baseResponse from "../../types/responseType";
import { inschrijvingSchema } from "../../types/schemas";
import { secureApi } from "../../handlers/authenticationHandler";
import { handleInschrijving } from "../../handlers/inschrijvingsHandler";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === "POST") return postInschrijving(req, res);

  res.status(405).json({ code: 405, message: "Not Allowed" });
};

const postInschrijving = async (req: NextApiRequest, res: NextApiResponse) => {
  secureApi({ req, res });
  await validateCsrfToken({ req, res });
  await validate({ req, res }, { schema: inschrijvingSchema });

  return await handleInschrijving({ req, res });
};

export default handler;
