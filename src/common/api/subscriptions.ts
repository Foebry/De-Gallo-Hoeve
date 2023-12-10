import { useMemo } from 'react';
import { useAxiosContext, SWROptions } from 'src/context/AxiosContext';

export type ActiveServiceEntry = {
  date: string;
  timeSlots: Record<string, number>;
};

export const useGetActiveEntriesForService = <T>(id: string, options?: SWROptions<T>) => {
  const { useSWR } = useAxiosContext();
  const swrKey = useMemo(() => '', []);
  const url = `/api/subscriptions/disabled-days/${id}`;
  return useSWR<ActiveServiceEntry[]>(swrKey, url, { ...options, errorMessage: '', fallbackData: [] });
};
