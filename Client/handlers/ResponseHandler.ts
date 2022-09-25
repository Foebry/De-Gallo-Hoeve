import { NextApiResponse } from "next";
import { destroyCookie } from "nookies";
import { LOGIN } from "../types/linkTypes";

interface ResponseHandler {
  badRequest: (
    res: NextApiResponse,
    message?: string,
    response?: object
  ) => void;
  unauthorizedAccess: (res: NextApiResponse) => void;
  notFound: (res: NextApiResponse, message?: string) => void;
  unProcessableEntity: (
    res: NextApiResponse,
    message?: string,
    response?: object
  ) => void;
  internalServerError: (res: NextApiResponse) => void;
  notAllowed: (res: NextApiResponse) => void;
}

const responseHandler: ResponseHandler = {
  badRequest: (res, message, response = {}) => {
    res.status(400).json({ message, ...response });
    return res.end();
  },
  unauthorizedAccess: (res) => {
    destroyCookie({ res }, "Client", {
      httpOnly: false,
      maxAge: 3600,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    res.status(401).json({ code: 401, message: "Unauthorized Access" });
    return res.end();
  },
  notFound: (res, message = "Not Found") => {
    res.status(404).json({ message });
    return res.end();
  },
  notAllowed: (res) => {
    res.status(405).json({ message: "Not allowed" });
    return res.end();
  },
  unProcessableEntity: (res, message = "UnprocessableEntity", response) => {
    res.status(422).json({ code: 422, message, ...response });
    return res.end();
  },
  internalServerError: (res) => {
    res.status(500).json({ message: "Internal Server Error" });
    return res.end();
  },
};

export const {
  internalServerError,
  notAllowed,
  notFound,
  badRequest,
  unauthorizedAccess,
  unProcessableEntity,
} = responseHandler;
