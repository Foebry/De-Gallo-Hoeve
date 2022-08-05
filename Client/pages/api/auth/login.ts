import { NextApiRequest, NextApiResponse } from "next";
import validate from "../../../middleware/Validator";
import baseResponse from "../../../types/responseType";
import { setCookie } from "nookies";
import jwt from "jsonwebtoken";
import db from "../../../middleware/db";
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
  const { success, response } = await validate(req, res, {
    schema: loginSchema,
  });
  return !success ? res.status(400).send(response) : createJWT(req, res);
};

const createJWT = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = process.env.JWT_SECRET;
  const payload = await db.getJwtPayload(req.body, res);
  if (res.statusCode !== 200) return;
  try {
    const token = jwt.sign({ payload }, `${secret}`);
    setCookie({ res }, "jwt", token, {
      httpOnly: true,
      maxAge: 3600,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({});
  } catch (e: any) {
    return res.status(500).json(e.message);
  }
};

export default handler;
