import React, { Ref, RefObject, useEffect, useRef, useState } from 'react';
import { FeedbackDto } from 'src/common/api/types/feedback';
import { Title2 } from 'src/components/Typography/Typography';
import { useFeedbackContext } from 'src/context/app/FeedbackContext';
import FeedbackCard from './card';

type Props = {
  feedback: FeedbackDto[];
};

const FeedbackSection: React.FC<Props> = ({ feedback }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleFeedBack, maxVisible] = useDetermineVisibleFeedback(feedback, sectionRef);

  return (
    <section className="bg-white pb-24 mx-auto md:px-5" ref={sectionRef}>
      <Title2 className="text-green-200">Wat zeggen onze klanten?</Title2>
      <div className="px-5 mx-auto max-w-7xl md:px-0 flex flex-wrap justify-center gap-10 mt-20 mb-30">
        {visibleFeedBack.slice(0, maxVisible).map((info) => (
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

const useDetermineVisibleFeedback = (
  feedback: FeedbackDto[],
  sectionRef: RefObject<HTMLElement>
): [feedback: FeedbackDto[], maxVisible: number] => {
  const [visibleFeedBack, setVisibleFeedBack] = useState<FeedbackDto[]>(feedback);
  const minCardWidth = 300;
  const gap = 40;
  const sectionWidth = sectionRef.current?.offsetWidth ?? 0;
  const maxVisible = Math.floor(sectionWidth / (minCardWidth + gap));
  const { firstRender, setFirstRender } = useFeedbackContext();

  const newVisibleFeedback = useRef<(currentFeedback: FeedbackDto[]) => FeedbackDto[]>(
    (currentFeedback: FeedbackDto[]): FeedbackDto[] => {
      const currentVisible = currentFeedback.slice(0, maxVisible);
      const newFeedback = [...currentFeedback.slice(maxVisible), ...currentVisible];
      return newFeedback;
    }
  );

  useEffect(() => {
    const delay = firstRender ? 0 : 8_000;
    setTimeout(() => {
      const newFeedbackArray = newVisibleFeedback.current(visibleFeedBack);
      setVisibleFeedBack(() => newFeedbackArray);
    }, delay);
    return;
  }, [visibleFeedBack, sectionWidth, maxVisible, firstRender]);

  setFirstRender(false);
  return [visibleFeedBack, maxVisible];
};

export default FeedbackSection;
