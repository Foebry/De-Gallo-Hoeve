import { NextApiRequest, NextApiResponse } from "next";
import baseResponse from "../../../types/responseType";
import { notAllowed } from "../../../handlers/ResponseHandler";
import {
  validate,
  validateCsrfToken,
} from "../../../handlers/validationHelper";
import { loginSchema } from "../../../types/schemas";
import { onLoginSuccess } from "../../../handlers/loginHandler";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case "POST":
      return login(req, res);
    default:
      return notAllowed(res);
  }
};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  return validateCsrfToken({ req, res }, () => {
    return validate({ req, res }, { schema: loginSchema }, onLoginSuccess);
  });
};

export default handler;
