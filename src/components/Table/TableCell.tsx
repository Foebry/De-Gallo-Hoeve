import React, { ReactNode } from 'react';
import { SpacingOption } from './TableRow';

interface Props {
  body: string | ReactNode;
  spacing?: SpacingOption;
  width: string;
  pointer?: boolean;
}

const TableCell: React.FC<Props> = ({ body, width, spacing = 'text-left' }) => {
  return (
    <div
      className={`px-1 py-5 ${spacing} flex gap-1 items-center ${spacing === 'text-right' && 'justify-end'}`}
      style={{ minWidth: width }}
    >
      {body}
    </div>
  );
};

export default TableCell;
