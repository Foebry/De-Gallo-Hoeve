import React, { useContext } from 'react';
import { ModalContext } from 'src/context/ModalContext';
import Button from './buttons/Button';
import { Body, Caption, Title4 } from './Typography/Typography';

const Modal = () => {
  const { message, updateModal, callback } = useContext(ModalContext);
  const confirm = async () => {
    await callback?.(true);
    updateModal();
  };
  const cancel = () => {
    updateModal();
  };

  return (
    <div
      className={`${
        !message && 'hidden'
      } modal z-50 w-1/3 h-1/3 px-5 bg-white-900 opacity-80 rounded-xl flex items-center justify-center text-center flex-col border-red-900 border-2`}
    >
      <div>
        <Caption className="text-red-900">Opgelet !</Caption>
        <Body>{message}</Body>
        <Title4 className="text-green-200">Ben je zeker dat je wil doorgaan?</Title4>
      </div>
      <div className="flex py-10 justify-between w-1/3">
        <div>
          <Button label="doorgaan" onClick={confirm} />
        </div>
        <div>
          <Button
            className="bg-red-900 border-red-900"
            label="stoppen"
            onClick={cancel}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
