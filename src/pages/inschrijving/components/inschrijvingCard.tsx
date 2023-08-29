import React, { ReactNode } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FormType } from '../uitlaat-dienst/index.page';

type Props = {
  date: string;
  children: ReactNode;
  index: number;
};

const InschrijvingCard: React.FC<Props> = ({ date, children, index }) => {
  const month = new Date(date).toLocaleString('nl', { month: 'long' }).substring(0, 3);
  const day = date.split('-').reverse()[0];

  const handleDelete = () => {};

  return (
    <div className={`4xs:flex border-2 rounded justify-between 4xs:pr-5 max-w-lg mx-auto mb-2 relative items-center`}>
      <div className={`border-r-2 rounded-l p-10 flex flex-col gap-1 items-center bg-green-200`}>
        <div className={`text-gray-200 flex flex-col items-center`}>
          <span className={`text-gray-200`}>{month}</span>
          <span className={`text-gray-200`}>{day}</span>
        </div>
      </div>
      <div className="py-2 my-auto w-full pl-5">
        <div className="flex flex-col gap-4">{children} </div>
      </div>
      <div className="absolute -right-20 text-3xl text-red-900 cursor-pointer" onClick={handleDelete} data-id={index}>
        <RiDeleteBin6Line className="pointer-events-none" />
      </div>
    </div>
  );
};

export default InschrijvingCard;
