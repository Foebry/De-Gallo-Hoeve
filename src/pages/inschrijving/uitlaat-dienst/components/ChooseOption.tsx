import React, { useState } from 'react';
import { Control, Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import OptionCard from '../../components/OptionCard';
import { FormType } from '../index.page';

type Props = {
  control: Control<FormType, any>;
  getValues: UseFormGetValues<FormType>;
  setValue: UseFormSetValue<FormType>;
};

const ChooseOption: React.FC<Props> = ({ control, getValues, setValue }) => {
  const recurring = getValues().recurring;
  const [selectedOption, setSelectedOption] = useState<number>(recurring === true ? 0 : recurring === false ? 1 : -1);

  const selectOption = (option: number) => {
    setValue('recurring', option === 0);
    setSelectedOption(option);
  };

  const options: { type: 'vertical' | 'horizontal'; title: string; content: any }[] = [
    {
      type: 'vertical',
      title: 'Ik kies voor een periode steeds dezelfde weekdagen, momenten en hond(en)',
      content: [
        'Gebruik deze optie wanneer u gedurende en bepaalde periode onze dienst op dezelfde weekdagen wil gebruiken.',
        'Selecteer hierna de periode die van toepassing is.',
        'Vervolgens selecteerd u de weekdagen die u interesseren.',
        'Tot slot selecteerd u het moment of de verschillende momenten die voor u het beste uitkomen, alsook de hond(en) die voor deze dagen van toepassing zijn.',
        'Wij komen dan gedurende de geslecteerde periode, wekelijks op de afgesproken weekdagen langs.',
      ],
    },
    {
      type: 'vertical',
      title: 'Ik kies verschillende data waarbij moment of hond(en) kunnen verschillen',
      content: [
        'Gebruik deze optie wanneer u voor enkele aparte dagen onze dienst wil gebruiken.',
        'Selecteer vervolgens de dagen die voor u van toepassing zijn.',
        'Tot slot kiest u voor iedere geslecteerde dag het moment of de verschillende momenten die voor u het beste uitkomen alsook de hond(en) die voor deze dag van toepassing zijn.',
        'Wij komen dan iedere geselecterde dag, bij u langs.',
      ],
    },
  ];

  return (
    <Controller
      control={control}
      name="recurring"
      render={() => (
        <div className="flex flex-wrap justify-center gap-5">
          {options.map((option, index) => (
            <OptionCard
              type={option.type}
              id={index}
              key={index}
              onClick={() => selectOption(index)}
              data={{ title: option.title }}
              selected={selectedOption === index}
              content={option.content}
            />
          ))}
        </div>
      )}
    />
  );
};

export default ChooseOption;
