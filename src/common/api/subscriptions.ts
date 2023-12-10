import { useMemo } from 'react';
import { useAxiosContext, SWROptions } from 'src/context/AxiosContext';

type ActivServiceEntry = {
  date: string;
  timeSlots: Record<string, number>;
};

export const useGetActiveEntriesForService = <T>(id: string, options?: SWROptions<T>) => {
  const { useSWR } = useAxiosContext();
  const swrKey = useMemo(() => '', []);
  const url = `/api/subscriptions/disabled-days/${id}`;
  return useSWR<ActivServiceEntry[]>(swrKey, url, { ...options, errorMessage: '', fallbackData: [] });
};
