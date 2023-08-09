import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { InschrijvingErrorInterface } from 'src/pages/inschrijving/index.page';
import { LoginErrorInterface } from 'src/pages/login/index.page';
import moment from 'moment';
import { useState } from 'react';

interface ApiError {
  response: {
    data: {};
  };
}

type FormError = InschrijvingErrorInterface | LoginErrorInterface;

type REQUESTMETHOD = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';

const useMutation = <T>(
  errors?: any,
  setErrors?: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const executerFunc = async (
    endpoint: string,
    payload: any,
    options?: Partial<{
      method: REQUESTMETHOD;
      params: any;
    }>
  ): Promise<{
    data: any | undefined;
    loading: boolean;
    error:
      | (Partial<T> & { message: string; code: number; errorCode: string })
      | undefined;
  }> => {
    try {
      setIsLoading(true);
      const { data } = await axios(endpoint, {
        method: options?.method ?? 'POST',
        data: payload,
        withCredentials: true,
        params: options?.params ?? undefined,
      });
      setIsLoading(false);
      return { data, error: undefined, loading: isLoading };
    } catch (error: any) {
      let data = { ...error.response.data, code: error.response.status };
      if (typeof data.message !== 'string') data = { ...data, ...data.message };
      setIsLoading(false);
      return { data: undefined, error: data, loading: isLoading };
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
  let errors = {};
  const inschrijvingen = payload?.inschrijvingen ?? [];
  const new_inschrijvingen = inschrijvingen.map((inschrijving: any, index: number) => {
    if (inschrijving.hond_id === undefined)
      errors = {
        ...errors,
        [`inschrijvingen[${index}][hond]`]: 'Gelieve een hond aan te duiden',
      };
    if (!inschrijving.tijdslot)
      errors = {
        ...errors,
        [`inschrijvingen[${index}][timeslot]`]: 'Gelieve een tijdstip aan te duiden',
      };

    if (inschrijving.hond_id && inschrijving.tijdslot && inschrijving.datum) {
      return {
        ...inschrijving,
        hond_id: inschrijving.hond_id.value,
        hond_naam: inschrijving.hond_id.label,
        datum: moment
          .utc([inschrijving.datum, inschrijving.tijdslot.value].join(' '))
          .local(),
      };
    }
    return {};
  });
  return [{ ...payload, inschrijvingen: new_inschrijvingen }, errors];
};

export const structureDetailsPayload = (payload: any) => {
  const details = payload?.details ?? [];
  const start = payload['period'].from;
  const eind = payload['period'].to;
  const newDetails = details.map((detail: any) => {
    const medicatie = detail.medicatie?.value;
    const ontsnapping = detail.ontsnapping?.value;
    const sociaal = detail.sociaal?.value;
    return { ...detail, medicatie, ontsnapping, sociaal };
  });
  return { start, eind, details: newDetails };
};

export default useMutation;
