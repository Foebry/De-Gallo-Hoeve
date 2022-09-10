import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return req.method === "DELETE"
    ? logout(res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const logout = (res: NextApiResponse) => {
  destroyCookie({ res }, "JWT", {
    httpOnly: true,
    maxAge: 3600,
    secure: false,
    sameSite: "strict",
    path: "/",
  });
  destroyCookie({ res }, "Client", {
    httpOnly: false,
    maxAge: 3600,
    secure: false,
    sameSite: "strict",
    path: "/",
  });
  return res.status(201).json({});
};

export default handler;
