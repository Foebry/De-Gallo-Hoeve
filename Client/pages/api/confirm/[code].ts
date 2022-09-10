import { NextApiRequest, NextApiResponse } from "next";
import { getConfirmCollection } from "../../../controllers/ConfirmController";
import { setVerified } from "../../../controllers/KlantController";
import client from "../../../middleware/MongoDb";
import { InvalidConfirmCodeError } from "../../../middleware/RequestError";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "GET"
    ? confirm(req, res)
    : req.method === "PATCH"
    ? reset(req, res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    const { code } = req.query;

    const confirmCollection = getConfirmCollection();

    const confirm = await confirmCollection.findOne({ code });
    if (!confirm) throw new InvalidConfirmCodeError();

    await setVerified(confirm.klant_id);
    await confirmCollection.deleteOne({ code });

    return res.redirect("/login");
  } catch (e: any) {
    return res.redirect("/auth/invalid-confirmation-code");
  }
};

const reset = (req: NextApiRequest, res: NextApiResponse) => {};

export default handler;
