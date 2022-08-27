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
  const options = { schema: inschrijvingSchema, message: "Foutieve input" };
  return secureApi({ req, res }, async () => {
    return validateCsrfToken({ req, res }, async () => {
      return validate({ req, res }, options, handleInschrijving);
    });
  });
};

export default handler;
