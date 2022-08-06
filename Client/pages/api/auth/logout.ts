import { NextApiRequest, NextApiResponse } from "next";
import baseResponse from "../../../types/responseType";
import {destroyCookie} from "nookies"
import { INDEX } from "../../../types/linkTypes";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  return req.method === "DELETE"
    ? logout(res)
    : res.status(405).json({code: 405, message: "Not Allowed"});
};

const logout = (res: NextApiResponse) => {
  destroyCookie({res}, "JWT", {httpOnly: true, maxAge:3600, secure: false, sameSite: "strict", path: "/"});
  destroyCookie({res}, "Client", {httpOnly: false, maxAge: 3600, secure: false, sameSite: "strict", path: "/"})
  return res.status(201).json({});
  return {
    redirect: {
      permanent: false,
      destination: INDEX
    }
  }
};


export default handler;