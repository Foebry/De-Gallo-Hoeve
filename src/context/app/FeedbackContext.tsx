import { FEEDBACK_API } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { FeedbackDto } from 'src/common/api/types/feedback';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { FeedbackBody } from 'src/pages/api/feedback/schemas';
import { ApiResponse } from 'src/utils/axios';

type FeedbackContext = {
  disabled: boolean;
  isLoading: boolean;
  firstRender: boolean;
  setFirstRender: Dispatch<SetStateAction<boolean>>;
  errors: Partial<FeedbackBody>;
  feedback: FeedbackDto[];
  setFeedback: Dispatch<SetStateAction<FeedbackDto[]>>;
  sendFeedback: (
    body: FeedbackBody,
    params: FeedbackQuery
  ) => Promise<Partial<FeedbackBody> | void>;
  getFeedback: () => ApiResponse<FeedbackDto[]>;
};

type FeedbackQuery = {
  code: string;
};

const defaultValues: FeedbackContext = {
  disabled: false,
  isLoading: false,
  firstRender: true,
  errors: {},
  feedback: [],
  sendFeedback: async () => {},
  getFeedback: async () => ({ data: undefined, error: undefined }),
  setFeedback: () => {},
  setFirstRender: () => {},
};

export const FeedbackContext = createContext<FeedbackContext>(defaultValues);

const FeedbackProvider: React.FC<{ children: any }> = ({ children }) => {
  const postFeedback = useMutation<FeedbackBody>(FEEDBACK_API);
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FeedbackBody>>({});
  const [feedback, setFeedback] = useState<FeedbackDto[]>([]);

  const sendFeedback = async (body: FeedbackBody, query: FeedbackQuery) => {
    if (disabled) return;
    setDisabled(true);
    setIsLoading(true);
    const { data, error } = await postFeedback(body, { params: query });
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

  const getFeedback = async () => {
    const { data, error } = await getData<FeedbackDto[]>('/api/feedback');
    return { data, error };
  };

  return (
    <FeedbackContext.Provider
      value={{
        disabled,
        sendFeedback,
        isLoading,
        firstRender,
        errors,
        feedback,
        setFeedback,
        setFirstRender,
        getFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;

export const useFeedbackContext = () => useContext(FeedbackContext);
