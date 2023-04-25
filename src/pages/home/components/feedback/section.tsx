import React, { useEffect, useState } from 'react';
import { FeedbackDto } from 'src/common/api/types/feedback';
import { Title2 } from 'src/components/Typography/Typography';
import FeedbackCard from './card';

type Props = {
  feedback: FeedbackDto[];
};

const FeedbackSection: React.FC<Props> = ({ feedback }) => {
  const visibleFeedBack = useDetermineVisibleFeedback(feedback);

  return (
    <section className="bg-white pb-24 mx-auto md:px-5">
      <Title2 className="text-green-200">Wat zeggen onze klanten?</Title2>
      <div className="px-5 mx-auto max-w-7xl md:px-0 flex justify-center gap-10 mt-20 mb-30">
        {visibleFeedBack.slice(0, 3).map((info) => (
          <FeedbackCard
            key={info.id}
            name={info.name}
            rating={info.rating}
            feedback={info.feedback}
          />
        ))}
      </div>
    </section>
  );
};

const useDetermineVisibleFeedback = (feedback: FeedbackDto[]): FeedbackDto[] => {
  const [visibleFeedBack, setVisibleFeedBack] = useState<FeedbackDto[]>(feedback);

  const newVisibleFeedback = (currentFeedback: FeedbackDto[]): FeedbackDto[] => {
    const currentVisible = currentFeedback.slice(0, 3);
    const newFeedback = [...currentFeedback.slice(3), ...currentVisible];
    return newFeedback;
  };

  useEffect(() => {
    setTimeout(() => {
      if (feedback.length <= 3) return feedback;
      const newFeedbackArray = newVisibleFeedback(visibleFeedBack);
      setVisibleFeedBack(() => newFeedbackArray);
    }, 10_000);
    return;
  }, [visibleFeedBack]);

  return visibleFeedBack;
};

export default FeedbackSection;
