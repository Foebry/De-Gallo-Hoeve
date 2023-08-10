import { createContext, useContext, useState, ReactNode } from 'react';
import { ModalType } from 'src/components/Modal/Modal/BaseModal';

export type ModalData = {
  caption?: string;
  type: ModalType;
  content?: ReactNode;
  callbackData?: any;
};

type ModalContext = {
  callback: ((confirmed: boolean) => any) | undefined;
  updateModal: (data: ModalData, callBack?: (param: any) => any) => void;
  modalData: ModalData;
  openModal: () => void;
  closeModal: () => void;
  isModalActive: boolean;
};

const trainingDayContextDefaultValues: ModalContext = {
  callback: () => {},
  updateModal: () => {},
  modalData: { type: ModalType.DEFAULT, content: <></> },
  openModal: () => {},
  closeModal: () => {},
  isModalActive: false,
};

export const ModalContext = createContext<ModalContext>(trainingDayContextDefaultValues);

const ModalProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isModalActive, setModalActive] = useState<boolean>(false);
  const [callback, setCallback] = useState<(confirmed: boolean) => any>();
  const [modalData, setModalData] = useState<ModalData>({ type: ModalType.DEFAULT });

  const updateModal = (data: ModalData, cb?: (confirmed: boolean) => any) => {
    setModalData(data);
    if (cb) setCallback(cb);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const openModal = () => setModalActive(true);

  return (
    <ModalContext.Provider
      value={{
        callback,
        updateModal,
        modalData,
        openModal,
        closeModal,
        isModalActive,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);

export default ModalProvider;
