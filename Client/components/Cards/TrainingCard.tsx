import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React from "react";
import { INSCHRIJVING } from "../../types/linkTypes";
import Button from "../buttons/Button";
import FormRow from "../form/FormRow";
import { Body } from "../Typography/Typography";
import { GiCheckMark } from "react-icons/gi";
import Image from "next/image";

interface TrainingProps {
  type: string;
  price: number;
  kmHeffing: number;
  gratisVerplaatsingBinnen: number;
}

const TrainingCard: React.FC<TrainingProps> = ({
  type,
  price,
  kmHeffing,
  gratisVerplaatsingBinnen,
}) => {
  const router = useRouter();
  return (
    <div
      className="border cursor-pointer border-gray-100 rounded-lg pb-2 hover:shadow-xl max-w-md flex-shrink"
      onClick={() =>
        router.push({ pathname: INSCHRIJVING, query: { type } }, INSCHRIJVING)
      }
    >
      <div className="bg-green-200 text-center text-2xl py-8 text-gray-50 rounded-t-lg">
        Privé training
      </div>
      <div className="pb-2">
        <div className="mb-5">
          <Image
            src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656188984/De-Gallo-Hoeve/content/pexels-blue-bird-7210258_m74qdh.jpg"
            width="448"
            height="262"
            alt="degallohoeve hondenschool border-collie training prive"
          />
        </div>
        <div className="px-2 flex flex-col gap-2">
          <Body>
            Heeft u een nieuwe pup en wil u ondersteuning bij de puppytraining?
          </Body>
          <Body>Wil u wat meer oefening op clicker training?</Body>
          <Body>
            Graag wat hulp bij de training voor basis commando&apos;s (zitten,
            liggen, rechtstaan, ...)
          </Body>
          <Body>Wandelt uw hond niet correct aan de lijn?</Body>
          <Body>
            Eerder op zoek naar gevorderde trainingen voor bewaking, politie of
            defensie? (blaffen en stil zijn op commando, leren bijten en lossen,
            ...)
          </Body>
          <Body>
            Vertoond uw hond gedragsproblemen, ook hiermee kunnen wij u helpen
          </Body>
          <Body>En nog zoveel meer ...</Body>
        </div>
        <ul className="pl-5 md:pl-20 mt-10">
          <li className="flex gap-2">
            <GiCheckMark />
            <Body>1 hond per inschrijving</Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark />
            <Body>Bij u thuis</Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark />
            <Body>€ {kmHeffing} / kilometer</Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark />
            <Body>
              gratis verplaatsing binnen {gratisVerplaatsingBinnen} kilometer
            </Body>
          </li>
          <li className="flex gap-2">
            <GiCheckMark />
            <Body>€ {Math.round(price * 1.21).toFixed(2)} incl.btw / uur</Body>
          </li>
        </ul>
      </div>
      <FormRow className="mt-10">
        <Button
          className="mx-auto"
          label="Aanvragen"
          onClick={() =>
            router.push(
              { pathname: INSCHRIJVING, query: { type } },
              INSCHRIJVING
            )
          }
        />
      </FormRow>
    </div>
  );
};

export default TrainingCard;
