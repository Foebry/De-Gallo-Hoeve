import { NextApiRequest, NextApiResponse } from "next";
import { processInschrijving } from "../../middleware/Helper";
import { validate, validateCsrfToken } from "../../handlers/validationHelper";
import baseResponse from "../../types/responseType";
import { inschrijvingSchema } from "../../types/schemas";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === "POST") return postInschrijving(req, res);

  res.status(405).json({ code: 405, message: "Not Allowed" });
};

const postInschrijving = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = { schema: inschrijvingSchema, message: "Foutieve input" };
  return secureApi({ req, res }, async () => {
    return validateCsrfToken({ req, res }, async () => {
      return validate({ req, res }, options, processInschrijving);
    });
  });
};
// const { klant_id } = req.body;
// const schema = inschrijvingSchema;
// const message = "Inschrijcing niet verwerkt";
// const options = { schema, message };

// return await validateCsrfToken({ req, res }, () => {
//   return validate(req, res, options, () => {
//     return confirmInschrijving({ req, res }, async () => {
//       return mailer.sendMail("inschrijving");
//     });
//   });
// });
// };

export default handler;
