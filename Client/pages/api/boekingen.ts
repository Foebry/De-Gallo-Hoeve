import type { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../middleware/Mailer";
import { validate } from "../../middleware/Validator";
import baseResponse from "../../types/responseType";
import { boekingSchema } from "../../types/schemas";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === "POST") return postBoeking(req, res);

  res.status(405).json({ code: 405, message: "Not Allowed" });
};

const postBoeking = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  validate(req.body, res, { schema: boekingSchema }, () => {});

  mailer.sendMail("boeking");

  res.status(201).json({ success: "Uw boeking is goed ontvangen!" });
};

export default handler;
