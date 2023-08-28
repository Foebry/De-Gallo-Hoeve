import React from 'react';
import { Control } from 'react-hook-form';
import { FormType } from '../index.page';

type Props = {
  control: Control<FormType, any>;
};

const ChooseOption: React.FC<Props> = ({}) => {
  return <div>ChooseOption</div>;
};

export default ChooseOption;
