import { NextApiRequest, NextApiResponse } from "next";
import baseResponse from "../../../types/responseType";
import {destroyCookie} from "nookies"

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  return req.method === "DELETE"
    ? logout(res)
    : res.status(405).json({code: 405, message: "Not Allowed"});
};

const logout = (res: NextApiResponse) => {
  destroyCookie({res}, "jwt", {httpOnly: true, maxAge:3600, secure: false, sameSite: "strict", path: "/"});
  return res.status(204).end();
};


export default handler;