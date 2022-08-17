import { NextApiRequest, NextApiResponse } from "next";
import { handleRegistration } from "../../../handlers/registratieHandler";
import {
  validateCsrfToken,
  validate,
} from "../../../handlers/validationHelper";
import baseResponse from "../../../types/responseType";
import { registerSchema } from "../../../types/schemas";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  req.method === "POST"
    ? register(req, res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = { schema: registerSchema };
  return await validateCsrfToken({ req, res }, async () => {
    return await validate({ req, res }, options, async () => {
      return await handleRegistration({ req, res });
    });
  });
};

export default handler;
