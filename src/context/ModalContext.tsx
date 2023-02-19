import { createContext, useState } from 'react';

type ModalContext = {
  message: string | undefined;
  callback: ((confirmed: boolean) => any) | undefined;
  updateModal: (msg?: string, callBack?: () => any) => void;
};

const trainingDayContextDefaultValues: ModalContext = {
  message: '',
  callback: () => {},
  updateModal: () => {},
};

export const ModalContext = createContext<ModalContext>(trainingDayContextDefaultValues);

const ModalProvider: React.FC<{ children: any }> = ({ children }) => {
  const [message, setMessage] = useState<string>();
  const [callback, setCallback] = useState<(confirmed: boolean) => any>();

  const updateModal = (msg?: string, cb?: (confirmed: boolean) => any) => {
    setMessage(msg);
    setCallback(cb);
  };

  return (
    <ModalContext.Provider
      value={{
        message,
        callback,
        updateModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
