import React from 'react';
import { Control, FieldValues } from 'react-hook-form';

type Props = {
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

const FeedbackWebsite: React.FC<Props> = ({ control, setActiveStep }) => {
  return <div>feedback-website</div>;
};

export default FeedbackWebsite;
