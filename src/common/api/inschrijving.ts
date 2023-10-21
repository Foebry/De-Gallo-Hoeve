import { useState } from 'react';
import useMutation from 'src/hooks/useMutation';
import { SubscriptionDto } from './dtos/Subscription';

export const useAvailabilityMutate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<SubscriptionDto>();
  const [error, setError] = useState<any>();
  const mutation = useMutation<SubscriptionDto>('/api/subscriptions/check-availability');

  const mutate = async (payload: SubscriptionDto) => {
    setIsLoading(true);
    const { data: mutationData, error } = await mutation('', payload);
    setIsLoading(false);
    if (error) setError(error);
    if (mutationData) setData(mutationData);
  };

  return { isLoading, data, error, mutate };
};

export const useCreateSubscription = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<SubscriptionDto>();
  const [error, setError] = useState<any>();
  const mutation = useMutation<SubscriptionDto>('/api/subscriptions');

  const mutate = async (payload: SubscriptionDto) => {
    setIsLoading(true);
    const { data: mutationData, error } = await mutation('', payload);
    setIsLoading(false);
    if (error) setError(error);
    if (mutationData) setData(mutationData);
  };

  return { isLoading, data, error, mutate };
};
