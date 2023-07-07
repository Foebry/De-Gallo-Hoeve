import React from 'react';
import Image from 'next/image';
import style from './ServiceCard.module.css';
import { Body } from 'src/components/Typography/Typography';
import { GiCheckMark } from 'react-icons/gi';
import FormRow from 'src/components/form/FormRow';
import Button from 'src/components/buttons/Button';

type Props = {
  active?: boolean;
  title: string;
  imageSrc: string;
};

const ServiceCard: React.FC<Props> = ({ active = false, title, imageSrc }) => {
  return (
    <div
      className="border cursor-pointer border-gray-100 rounded-lg pb-2 hover:shadow-xl max-w-md relative flex-shrink"
      onClick={() => {}}
    >
      <div
        className={`${
          active ? 'bg-green-200' : style['coming-soon']
        } text-center text-2xl py-8 text-gray-50 rounded-t-lg`}
      >
        {title}
      </div>
      <div className="pb-2">
        <div className="mb-5">
          <Image
            src={imageSrc}
            width="448"
            height="262"
            alt="degallohoeve hondentrainer hond uitlaat-dienst wandelen"
          />
        </div>
        <div className="px-2 flex flex-col gap-2">
          <Body>Gaat u op vakantie voor enkele dagen of langer en heeft u geen oplossing voor uw hond?</Body>
          <Body>Heeft u het te druk met het werk en geen tijd om uw hond uit te laten?</Body>
          <Body>Bent u slecht te been, of heeft u graag hulp bij het uitlaten van uw hond?</Body>
          <Body>Dan staan wij iedere dag voor u klaar om u bij te staan.</Body>
        </div>
        <ul className="pl-5 md:pl-20 mt-10 mb-10">
          <li className="flex gap-2">
            <GiCheckMark /> <Body>Meerdere honden mogelijk</Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark /> <Body>Bij u thuis</Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark /> <Body>Tot 3 uitlaat-beurten mogelijk per dag</Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark /> <Body>€15 tot €35 per dag per hond</Body>
          </li>
        </ul>
        <FormRow className="absolute w-full bottom-2">
          <Button className="mx-auto bg-grey-200 border-grey-200" label="aanvragen" disabled={true} />
        </FormRow>
      </div>
    </div>
  );
};

export default ServiceCard;
