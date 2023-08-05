import { ReactNode } from 'react';

type Props = {
  onClose: () => void;
  children: ReactNode;
};

const Modal: React.FC<Props> = ({ onClose, children }) => {
  return <div>{children}</div>;
};

export default Modal;
