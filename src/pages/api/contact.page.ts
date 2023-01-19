import { NextApiRequest, NextApiResponse } from "next";
import mailer from "src/utils/Mailer";
import { validate } from "src/services/Validator";
import { contactSchema } from "src/types/schemas";
import { logError } from "src/controllers/ErrorLogController";
import { closeClient } from "src/utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") res.status(405).send({ message: "Not Allowed" });
  try {
    await validate(
      { req, res },
      { schema: contactSchema, message: "Bericht niet verzonden" }
    );
    const data = req.body;
    await mailer.contact(data);

    closeClient();

    return res.status(200).send({ message: "Bericht ontvangen!" });
  } catch (e: any) {
    await logError("contact", req, e);
    closeClient();
    return res.status(e.code).json(e.response);
  }
};

export default handler;
