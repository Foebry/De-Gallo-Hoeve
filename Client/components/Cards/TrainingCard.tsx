import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { INSCHRIJVING_PRIVE } from "../../types/linkTypes";
import Button from "../buttons/Button";
import FormRow from "../form/FormRow";
import { Body } from "../Typography/Typography";
import { GiCheckMark } from "react-icons/gi";
import Image from "next/image";

interface TrainingProps {
  title: string;
  body: string[];
  link: string;
  items?: string[];
  image: string;
}

const TrainingCard: React.FC<TrainingProps> = ({
  body,
  title,
  link = INSCHRIJVING_PRIVE,
  items = [],
  image,
}) => {
  const router = useRouter();
  return (
    <div
      className="border cursor-pointer border-gray-100 rounded-lg pb-2 hover:shadow-xl max-w-md min-w-2xs"
      onClick={() => router.push(link)}
    >
      <div className="bg-green-200 text-center text-2xl py-8 text-gray-50 rounded-t-lg">
        {title}
      </div>
      <div className="pb-2">
        <div className="mb-5">
          <Image src={image} width="448" height="262" />
        </div>
        {body.slice(0, 1).map((paragraph) => (
          <Body key={nanoid(5)} className="px-2">
            {paragraph}
          </Body>
        ))}
        <ul className="pl-20 mt-10">
          {items.map((item) => (
            <Body key={nanoid(5)} className="flex gap-2">
              <GiCheckMark />
              {item}
            </Body>
          ))}
        </ul>
      </div>
      <FormRow className="mt-10">
        <Button
          className="mx-auto"
          label="Aanvragen"
          onClick={() => router.push(link)}
        />
      </FormRow>
    </div>
  );
};

export default TrainingCard;
