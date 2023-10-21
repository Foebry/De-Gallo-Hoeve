import React from 'react';
import Select from 'react-select';
import { MultiSelectValue } from './Overview';

type Props = {
  onChange: (e: MultiSelectValue) => void;
  value: any[];
  isMulti?: boolean;
};

const timeFrameSelect: React.FC<Props> = ({ onChange, value, isMulti = false }) => {
  const options = [
    {
      label: 'ochtend',
      value: 'ochtend',
    },
    {
      label: 'middag',
      value: 'middag',
    },
    {
      label: 'avond',
      value: 'avond',
    },
  ];
  return <Select value={value} onChange={onChange} options={options} isMulti={isMulti} className="w-full" />;
};

export default timeFrameSelect;
