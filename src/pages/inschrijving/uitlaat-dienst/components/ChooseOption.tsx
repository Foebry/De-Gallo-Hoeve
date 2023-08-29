import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { Body, Title3 } from 'src/components/Typography/Typography';
import OptionCard from '../../components/OptionCard';
import { FormType } from '../index.page';
import { classNames } from '../../../../shared/functions';

type Props = {
  control: Control<FormType, any>;
};

const ChooseOption: React.FC<Props> = ({}) => {
  const [selectedOption, setSelectedOption] = useState<number>(-1);

  const selectOption = (option: number) => {
    setSelectedOption(option);
  };

  const options: { type: 'vertical' | 'horizontal'; title: string; content: any }[] = [
    {
      type: 'vertical',
      title: 'Ik kies voor een periode steeds dezelfde weekdagen, momenten en hond(en)',
      content: '',
    },
    {
      type: 'vertical',
      title: 'Ik kies verschillende data waarbij moment of hond(en) kunnen verschillen',
      content: '',
    },
  ];

  return (
    <div className="flex justify-between gap-5">
      {options.map((option, index) => (
        <OptionCard
          type={option.type}
          id={index}
          key={index}
          onClick={() => selectOption(index)}
          data={{ title: option.title }}
          selected={selectedOption === index}
        >
          {option.content}
        </OptionCard>
      ))}
      {/* <OptionCard
        type="vertical"
        selected={selectedOption === 'abc'}
        onClick={() => selectOption('abc')}
        id={'abc'}
        data={{ title: 'Ik kies voor een periode steeds dezelfde weekdagen, momenten en hond(en)' }}
      >
        <div className={``}>
          <p>
            Kies deze optie wanneer u tijdens een langere periode graag steeds op dezelfde weekdagen onze dienst wil
            gebruiken.
          </p>
        </div>
      </OptionCard>
      <OptionCard
        type="vertical"
        selected={selectedOption === 'def'}
        onClick={() => selectOption('def')}
        id="def"
        data={{ title: 'Ik kies verschillende data waarbij moment of hond(en) kunnen verschillen' }}
      >
        <div>
          <p>Kies deze optie wanneer u enkele losstaande data onze dienst wil gebruiken.</p>
        </div>
      </OptionCard> */}
    </div>
  );
};

const options = [{}];

export default ChooseOption;
