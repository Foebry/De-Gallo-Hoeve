import { nanoid } from 'nanoid';
import React from 'react';
import { Body } from 'src/components/Typography/Typography';
import { classNames } from 'src/shared/functions';

type OptionData = {
  title: string;
};

type Props = {
  type: 'vertical' | 'horizontal';
  selected: boolean;
  onClick: (option: number) => void;
  id: number;
  data: OptionData;
  content: string[];
};

const OptionCard: React.FC<Props> = (props) => {
  return (
    <>
      <div
        data-id={props.id}
        onClick={() => props.onClick(props.id)}
        className={`flex border-2 rounded-xl max-w-7/12 md:max-w-1/3 cursor-pointer min-w-2xs ${classNames({
          'flex-col': props.type === 'vertical',
          'flex-row': props.type === 'horizontal',
          'border-green-200': props.selected,
        })}`}
      >
        <div
          className={`rounded-t-xl p-2 min-h-content font-semibold  ${classNames({
            'bg-green-200 text-grey-200': props.selected,
            'bg-grey-200 text-green-200': !props.selected,
          })}`}
        >
          {props.data.title}
        </div>
        <div className="min-h-content p-5">
          {props.content.map((paragraph) => (
            <Body key={nanoid()} className="py-2">
              {paragraph}
            </Body>
          ))}
        </div>
      </div>
    </>
  );
};

export default OptionCard;
