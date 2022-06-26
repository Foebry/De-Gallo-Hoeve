import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React from "react";
import Button from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";
import { Body, Title2 } from "../components/Typography/Typography";
import getData from "../hooks/useApi";
import { CONTENT_TRAININGAPI } from "../types/apiTypes";
import { INSCHRIJVING_GROEP, INSCHRIJVING_PRIVE } from "../types/linkTypes";
import { SECTION_CONTENT, SECTION_DARKER } from "../types/styleTypes";

interface TrainingProps {
  prive: {
    priveContent: string[];
    priveImg: string;
  };
  group: {
    groupContent: string[];
    groupImg: string;
  };
}

const Trainingen: React.FC<TrainingProps> = ({
  prive: { priveContent, priveImg },
  group: { groupContent, groupImg },
}) => {
  const router = useRouter();
  return (
    <>
      <section className={SECTION_DARKER}>
        <div className={SECTION_CONTENT}>
          <div className="w-95p xs:w-1/2 mx-auto shadow-md">
            <img
              className="w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto"
              src={groupImg}
              alt=""
            />
          </div>
          <div className="block align-center gap-12 p24 mx-auto md:max-w-2/3">
            <Title2>Groepstrainingen</Title2>
            {groupContent.map((paragraph) => (
              <Body key={nanoid(5)}>{paragraph}</Body>
            ))}
            <FormRow className="mt-2">
              <Button
                className="mx-auto"
                label="Ik schrijf me in"
                onClick={() => router.push(INSCHRIJVING_GROEP)}
              />
            </FormRow>
          </div>
        </div>
      </section>
      <section className="bg-grey-500 px-5 py-5">
        <div className={SECTION_CONTENT}>
          <div className="block align-center gap-12 p24 mx-auto md:max-w-2/3">
            <Title2>Privétrainingen</Title2>
            {priveContent.map((paragraph) => (
              <Body key={nanoid(5)}>{paragraph}</Body>
            ))}
            <FormRow className="mt-2 mb-10">
              <Button
                className="mx-auto"
                label="Aanvragen"
                onClick={() => router.push(INSCHRIJVING_PRIVE)}
              />
            </FormRow>
          </div>
          <div className="w-95p xs:w-1/2 mx-auto shadow-md">
            <img
              className="w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto"
              src={priveImg}
              alt=""
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Trainingen;

export const getStaticProps = async () => {
  const {
    data: { prive, group },
  } = await getData(CONTENT_TRAININGAPI);

  return {
    props: {
      prive,
      group,
    },
    revalidate: 3600,
  };
};
