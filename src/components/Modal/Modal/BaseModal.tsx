import { useContext } from 'react';
import Button from 'src/components/buttons/Button';
import { Caption, Title4 } from 'src/components/Typography/Typography';
import { ModalContext } from 'src/context/ModalContext';

export enum ModalType {
  ERROR = 'error',
  DEFAULT = 'default',
}

type Props = {};

const BaseModal: React.FC<Props> = () => {
  const { callback, modalData, closeModal } = useContext(ModalContext);
  const { caption, type, content } = modalData;

  const confirm = async () => {
    await callback?.(modalData.callbackData);
    closeModal();
  };

  const cancel = () => {
    closeModal();
  };

  return (
    <div
      className={`modal z-50 px-5 py-2 bg-white-900 opacity-70 rounded-xl flex items-center justify-center flex-col ${
        type === ModalType.ERROR ? 'border-red-900 border-2' : ''
      }`}
    >
      <div>
        {caption && (
          <Caption className={type === ModalType.ERROR ? `text-red-900` : undefined}>
            {caption}
          </Caption>
        )}{' '}
        {content}
        {type === ModalType.ERROR && (
          <Title4 className="text-green-200">Ben je zeker dat je wil doorgaan?</Title4>
        )}
      </div>
      {type === ModalType.ERROR && (
        <div className="flex py-10 justify-between w-2/3">
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
      )}
    </div>
  );
};

export default BaseModal;
