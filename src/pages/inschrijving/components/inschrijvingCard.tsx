import React, { ReactNode } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FormType } from '../uitlaat-dienst/index.page';

type Props = {
  date?: string;
  weekday?: string;
  children: ReactNode;
  index: number;
  'data-id': string;
  onDelete: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const InschrijvingCard: React.FC<Props> = ({
  date,
  weekday,
  children,
  index,
  onDelete: handleDelete,
  'data-id': dataId,
}) => {
  const month = date ? new Date(date).toLocaleString('nl', { month: 'long' }).substring(0, 3) : undefined;
  const day = date?.split('-').reverse()[0];

  return (
    <div
      className={`4xs:flex border-2 rounded justify-between 4xs:pr-5 max-w-lg mx-auto mb-4
       relative`}
      data-id={dataId}
    >
      <div className={`border-r-2 rounded-l w-1/5 min-w-4xs bg-green-200 text-center relative`}>
        <div className={`text-gray-200 absolute inset-0 text-center flex flex-col items-center justify-center`}>
          {month && <span className={`text-gray-200`}>{month}</span>}
          {day && <span className={`text-gray-200`}>{day}</span>}
          {weekday && <span className={`text-gray-200`}>{weekday}</span>}
        </div>
      </div>
      <div className="py-2 my-auto w-full pl-5">
        <div className="flex flex-col gap-4">{children} </div>
      </div>
      <div
        className="absolute -right-20 inset-y-0 flex items-center text-3xl text-red-900 cursor-pointer"
        onClick={handleDelete}
        data-id={index}
      >
        <RiDeleteBin6Line className="pointer-events-none" />
      </div>
    </div>
  );
};

export default InschrijvingCard;
