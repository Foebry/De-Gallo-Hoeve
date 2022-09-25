import { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../middleware/Mailer";
import { validate, validateCsrfToken } from "../../middleware/Validator";
import { contactSchema } from "../../types/schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") res.status(405).send({ message: "Not Allowed" });
  console.log(req.body);
  try {
    await validate(
      { req, res },
      { schema: contactSchema, message: "Bericht niet verzonden" }
    );
    console.log(req.body);
    const data = req.body;
    mailer.contact(data);
    return res.status(200).send({ message: "Bericht ontvangen!" });
  } catch (e: any) {
    console.log({ error: e });
    return res.status(e.code).json(e.response);
  }
};

export default handler;
