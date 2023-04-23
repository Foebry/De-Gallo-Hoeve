import { FEEDBACK_API } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import { createContext, useState } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';
import useMutation from 'src/hooks/useMutation';
import { FeedbackBody } from 'src/pages/api/feedback/schemas';

type FeedbackContext = {
  disabled: boolean;
  sendFeedback: (
    body: FeedbackBody,
    params: FeedbackQuery
  ) => Promise<Partial<FeedbackBody> | void>;
  isLoading: boolean;
  errors: Partial<FeedbackBody>;
};

type FeedbackQuery = {
  code: string;
};

const defaultValues: FeedbackContext = {
  disabled: false,
  sendFeedback: async () => {},
  isLoading: false,
  errors: {},
};

export const FeedbackContext = createContext<FeedbackContext>(defaultValues);

const FeedbackProvider: React.FC<{ children: any }> = ({ children }) => {
  const mutate = useMutation();
  const router = useRouter();
  const api = FEEDBACK_API;
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FeedbackBody>>({});

  const sendFeedback = async (body: FeedbackBody, query: FeedbackQuery) => {
    if (disabled) return;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await mutate<FeedbackBody>(api, body, { params: query });
    setIsLoading(false);
    if (error) {
      setDisabled(false);
      setErrors(error);
      toast.error(error.message ?? 'Er is iets misgegaan, probeer later opnieuw');
    }
    if (data) {
      toast.success('Hartelijk dank voor uw beoordeling!');
      setDisabled(false);
      router.push('/');
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        disabled,
        sendFeedback,
        isLoading,
        errors,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;
