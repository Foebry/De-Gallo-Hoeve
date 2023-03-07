import React from 'react';
import { Control, FieldValues } from 'react-hook-form';

type Props = {
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

const FeedbackService: React.FC<Props> = ({ control, setActiveStep }) => {
  return <div>feedback-service</div>;
};

export default FeedbackService;
