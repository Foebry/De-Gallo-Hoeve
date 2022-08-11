import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../../middleware/Mailer";
import {
  confirmRegister,
  validateCsrfToken,
  validate,
} from "../../../middleware/Validator";
import baseResponse from "../../../types/responseType";
import { registerSchema } from "../../../types/schemas";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  req.method === "POST"
    ? register(req, res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  return validateCsrfToken({ req, res }, () => {
    return validate(req, res, { schema: registerSchema }, () => {
      return confirmRegister(req, res, () => {
        mailer.sendMail("register");
      });
    });
  });

  // mailer.sendMail("register");

  // res.status(201).json({success: "Bedankt voor uw registratie!"});
};

export default handler;
