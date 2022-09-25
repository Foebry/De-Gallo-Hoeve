import axios from "axios";
import { toast } from "react-toastify";
import { InschrijvingErrorInterface } from "../pages/inschrijving";
import { LoginErrorInterface } from "../pages/login";
import moment from "moment";

interface ApiError {
  response: {
    data: {};
  };
}

type FormError = InschrijvingErrorInterface | LoginErrorInterface;

type REQUESTMETHOD = "POST" | "PUT" | "PATCH" | "DELETE";

const useMutation = (
  errors?: any,
  setErrors?: React.Dispatch<React.SetStateAction<any>>
) => {
  const executerFunc = async (
    endpoint: string,
    payload: any,
    options?: {
      method: REQUESTMETHOD;
    }
  ) => {
    try {
      const { data } = await axios(endpoint, {
        method: options?.method ?? "POST",
        data: payload,
        withCredentials: true,
      });
      return { data, error: undefined };
    } catch (error: any) {
      const data = error.response.data;
      setErrors?.({ ...errors, ...data });
      toast.error(data.message);
      return { data: undefined, error: data };
    }
  };
  return executerFunc;
};

export const handleErrors = (errors: any, setError: any) => {
  Object.entries(errors).forEach((error) => {
    const key = error[0];
    const message = error[1];
    setError(key, { message });
  });
};

export const structureHondenPayload = (payload: any) => {
  const honden = payload?.honden ?? [];
  const new_honden = honden.map((hond: any) => {
    const ras = hond.ras?.label;
    const geslacht = hond.geslacht?.label;
    return { ...hond, ras, geslacht };
  });
  return { ...payload, honden: new_honden };
};

export const structureInschrijvingenPayload = (payload: any) => {
  const inschrijvingen = payload?.inschrijvingen ?? [];
  console.log({ inschrijvingen });
  const new_inschrijvingen = inschrijvingen.map((inschrijving: any) => ({
    ...inschrijving,
    hond_id: inschrijving.hond_id.value,
    hond_naam: inschrijving.hond_id.label,
    datum: moment
      .utc([inschrijving.datum, inschrijving.tijdslot.value].join(" "))
      .local(),
  }));
  return { ...payload, inschrijvingen: new_inschrijvingen };
};

export const structureDetailsPayload = (payload: any) => {
  const details = payload?.details ?? [];
  const start = payload["period"].from;
  const eind = payload["period"].to;
  const newDetails = details.map((detail: any) => {
    const medicatie = detail.medicatie?.value;
    const ontsnapping = detail.ontsnapping?.value;
    const sociaal = detail.sociaal?.value;
    return { ...detail, medicatie, ontsnapping, sociaal };
  });
  return { start, eind, details: newDetails };
};

export default useMutation;
