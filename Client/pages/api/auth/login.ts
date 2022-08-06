import { NextApiRequest, NextApiResponse } from "next";
import validate from "../../../middleware/Validator";
import baseResponse from "../../../types/responseType";
import setCookies from "../../../middleware/Controller";
import { loginSchema } from "../../../types/schemas";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case "POST":
      return login(req, res);
    default:
      return res.status(405).json({ code: 405, message: "Not Allowed" });
  }
};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  return await validate(req, res, {
    schema: loginSchema
  }, 
  setCookies);
};



export default handler;
