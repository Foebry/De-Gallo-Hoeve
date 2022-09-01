import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollections } from "../../../middleware/MongoDb";
import { Confirm, Klant } from "../../../types/collections";
import baseResponse from "../../../types/responseType";

interface Response extends baseResponse {}

const handler = (req: NextApiRequest, res: NextApiResponse<Response>) => {
  req.method === "GET"
    ? confirm(req, res)
    : req.method === "PATCH"
    ? reset(req, res)
    : res.status(405).json({ code: 405, message: "Not Allowed" });
};

const confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  const { confirmCollection, klantCollection } = getCollections([
    "confirm",
    "klant",
  ]) as {
    confirmCollection: Collection<Confirm>;
    klantCollection: Collection<Klant>;
  };

  const confirm = await confirmCollection.findOne({ code });
  if (!confirm) {
    console.log(`code ${code} not found`);
    return res.redirect("/auth/invalid-confirmation-code");
  }

  await klantCollection.updateOne(
    { _id: confirm.klant_id },
    { $set: { verified: true } }
  );
  await confirmCollection.deleteOne({ code });

  return res.redirect("/login");
};

const reset = (req: NextApiRequest, res: NextApiResponse) => {};

export default handler;
