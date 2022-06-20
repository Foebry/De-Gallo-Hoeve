import axios from "axios";

interface ApiError {
  response: {
    data: {};
  };
}

const useMutation = () => {
  const executerFunc = async (
    endpoint: string,
    payload: any,
    formErrors: any,
    setFormErrors: any
  ) => {
    const environment = process.env.NODE_ENV;
    const api =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API
        : process.env.NEXT_PUBLIC_DEV_API;

    const route = `${api + endpoint}`;
    try {
      const { data } = await axios(route, {
        method: "POST",
        data: payload,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      return { data, error: undefined };
    } catch (errorData) {
      const formError = errorData as ApiError;
      const errors: any = formError.response.data as typeof formErrors;
      setFormErrors({...formError, ...errors})
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
    return { ...hond, ras_id, geslacht };
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
