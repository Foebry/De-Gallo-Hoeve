import { FEEDBACK_API } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import useMutation from 'src/hooks/useMutation';
import { FeedbackBody } from 'src/pages/api/feedback/schemas';

type FeedbackContext = {
  disabled: boolean;
  sendFeedback: (body: FeedbackBody) => Promise<any>;
};

const defaultValues: FeedbackContext = {
  disabled: false,
  sendFeedback: async () => {},
};

export const FeedbackContext = createContext<FeedbackContext>(defaultValues);

const ModalProvider: React.FC<{ children: any }> = ({ children }) => {
  const mutate = useMutation();
  const router = useRouter();
  const api = FEEDBACK_API;
  const [disabled, setDisabled] = useState<boolean>(false);
  const sendFeedback = async (body: FeedbackBody) => {
    if (disabled) return;
    setDisabled(true);
    const { data, error } = await mutate(api, body);
    if (error) {
      setDisabled(false);
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
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default ModalProvider;
