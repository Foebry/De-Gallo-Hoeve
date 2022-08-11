import axios from "axios";
import react from "react";
import { toast } from "react-toastify";

interface ApiError {
  response: {
    data: {};
  };
}

type REQUESTMETHOD = "POST" | "PUT" | "PATCH" | "DELETE";

const useMutation = () => {
  const executerFunc = async (
    endpoint: string,
    payload: any,
    formErrors: any,
    setFormErrors: any,
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
    } catch (errorData) {
      const formError = errorData as ApiError;
      const errors: any = formError.response.data as typeof formErrors;
      setFormErrors({ ...formError, ...errors });
      toast.error(errors.message);
      return { data: undefined, error: formError.response.data };
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
    const ras_id = hond.ras_id?.value;
    const geslacht = hond.geslacht?.value;
    const geboortedatum = hond.geboortedatum?.[0] ?? "";
    return { ...hond, ras_id, geslacht, geboortedatum };
  });
  return { ...payload, honden: new_honden };
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
