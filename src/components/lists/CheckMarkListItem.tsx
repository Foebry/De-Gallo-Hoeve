import React from 'react';
import { ExtendedPropTypes } from '@/types/AppTypes';
import { GiCheckMark } from 'react-icons/gi';

type Props = ExtendedPropTypes<HTMLLIElement> & { checkMarkColor?: string };

const CheckMarkListItem: React.FC<Props> = ({ children, className, checkMarkColor = 'text-black' }) => {
  return (
    <li className={`flex items-center gap-2 ${className}`}>
      <GiCheckMark className={`shrink-0 ${checkMarkColor}`} />
      <p>{children}</p>
    </li>
  );
};

export default CheckMarkListItem;
