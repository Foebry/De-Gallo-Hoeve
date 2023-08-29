import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { classNames, notEmpty } from 'src/shared/functions';

type OptionData = {
  title: string;
};

type Props = {
  children: ReactNode;
  type: 'vertical' | 'horizontal';
  selected: boolean;
  onClick: (option: number) => void;
  id: number;
  data: OptionData;
};

const OptionCard: React.FC<Props> = (props) => {
  return (
    <>
      <div
        data-id={props.id}
        onClick={() => props.onClick(props.id)}
        className={`flex border rounded-xl max-w-1/2 ${classNames({
          'flex-col': props.type === 'vertical',
          'flex-row': props.type === 'horizontal',
        })}`}
      >
        <div
          className={`rounded-t-xl p-2  ${classNames({
            'bg-green-200 text-grey-200': props.selected,
            'bg-grey-200 text-green-200': !props.selected,
          })}`}
        >
          {props.data.title}
        </div>
        {props.children}
      </div>
    </>
  );
};

export default OptionCard;
