import { FEEDBACK_API } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FeedbackDto } from 'src/common/api/types/feedback';
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
  feedback: FeedbackDto[];
  setFeedback: Dispatch<SetStateAction<FeedbackDto[]>>;
};

type FeedbackQuery = {
  code: string;
};

const defaultValues: FeedbackContext = {
  disabled: false,
  sendFeedback: async () => {},
  isLoading: false,
  errors: {},
  feedback: [],
  setFeedback: () => {},
};

export const FeedbackContext = createContext<FeedbackContext>(defaultValues);

const FeedbackProvider: React.FC<{ children: any }> = ({ children }) => {
  const mutate = useMutation<FeedbackBody>(FEEDBACK_API);
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FeedbackBody>>({});
  const [feedback, setFeedback] = useState<FeedbackDto[]>([]);

  const sendFeedback = async (body: FeedbackBody, query: FeedbackQuery) => {
    if (disabled) return;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await mutate(body, { params: query });
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
        feedback,
        setFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;

export const useFeedbackContext = () => useContext(FeedbackContext);
