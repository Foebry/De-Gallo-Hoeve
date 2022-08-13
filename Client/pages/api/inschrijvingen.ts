import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../middleware/Mailer";
import {
  confirmInschrijving,
  validate,
  validateCsrfToken,
} from "../../middleware/Validator";
import baseResponse from "../../types/responseType";
import { inschrijvingSchema } from "../../types/schemas";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === "POST") return postInschrijving(req, res);

  res.status(405).json({ code: 405, message: "Not Allowed" });
};

const postInschrijving = async (req: NextApiRequest, res: NextApiResponse) => {
  await validateCsrfToken({ req, res }, () => {
    return validate(req, res, { schema: inschrijvingSchema }, () => {
      return confirmInschrijving({ req, res });
    });
  });

  if (res.statusCode === 201) mailer.sendMail("inschrijving");

  return res;
};

export default handler;
