import moment from 'moment';
import { useAxiosContext } from 'src/context/AxiosContext';
import { ApiResponse, Options } from 'src/utils/axios';

const useMutation = <T, E = Partial<T> & { message: string; code: number }>(
  endpoint: string
) => {
  const { increase, decrease, send } = useAxiosContext();
  const executerFunc = async (payload: any, options?: Options): ApiResponse<T, E> => {
    try {
      increase();
      const { data } = await send<T>(endpoint, payload, options);
      return { data, error: undefined };
    } catch (error: any) {
      const data = { ...error.response.data, code: error.response.status };
      return { data: undefined, error: data };
    } finally {
      decrease();
    }
  };
  return executerFunc;
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

export default useMutation;
