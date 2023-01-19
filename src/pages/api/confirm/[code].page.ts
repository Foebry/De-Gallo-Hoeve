import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteByKlantId,
  getConfirmByCode,
  reset as resetConfirm,
} from "src/controllers/ConfirmController";
import { getKlantById, setVerified } from "src/controllers/KlantController";
import {
  ExpiredConfirmCodeError,
  InvalidConfirmCodeError,
  KlantNotFoundError,
} from "src/shared/RequestError";
import { logError } from "src/controllers/ErrorLogController";
import { closeClient } from "src/utils/db";
import { ConfirmCollection } from "@/types/EntityTpes/ConfirmTypes";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return confirm(req, res);
  else if (req.method === "PUT") return reset(req, res);
  else return res.status(405).json({ code: 405, message: "Not Allowed" });
};

const confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { code } = req.query;

    const confirm = await getConfirmByCode(code as string);
    if (!confirm) {
      console.log(`Confirm ${code} not found`);
      throw new InvalidConfirmCodeError();
    }

    if (moment(confirm.valid_to) < moment()) {
      console.log(`code ${confirm.code} expired`);
      throw new ExpiredConfirmCodeError();
    }

    const klant = await getKlantById(confirm.klant_id);
    if (!klant) {
      console.log(`klant ${confirm.klant_id} not found`);
      throw new KlantNotFoundError();
    }

    await setVerified(klant);
    await deleteByKlantId(confirm.klant_id);

    // closeClient();

    return res.redirect("/login");
  } catch (e: any) {
    await logError("confirm", req, e);
    // closeClient();
    return res.status(e.code).send(e.response);
  }
};

const reset = async (
  req: NextApiRequest,
  res: NextApiResponse<ConfirmCollection>
) => {
  try {
    const { code } = req.query;

    const confirm = await getConfirmByCode(code as string);
    if (!confirm) throw new InvalidConfirmCodeError();

    const klant = await getKlantById(confirm.klant_id);
    if (!klant) throw new KlantNotFoundError();

    const newConfirm = await resetConfirm(confirm);

    return res.status(200).json(newConfirm);
  } catch (e: any) {
    await logError("reset", req, e);
    return res.status(e.code).send(e.response);
  }
};

export default handler;
