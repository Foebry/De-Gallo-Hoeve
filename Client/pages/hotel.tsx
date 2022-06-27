import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React from "react";
import Button from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";
import { Body, Link, Title2 } from "../components/Typography/Typography";
import getData from "../hooks/useApi";
import { CONTENT_HOTELAPI } from "../types/apiTypes";
import { RESERVATIE } from "../types/linkTypes";
import { SECTION_CONTENT, SECTION_DARKER } from "../types/styleTypes";

interface HotelProps {
  reserveren: string[];
  verblijven: string[];
  verwachtingen: string[];
}

const Hotel: React.FC<HotelProps> = ({
  reserveren,
  verblijven,
  verwachtingen,
}) => {
  const router = useRouter();
  return (
    <section className={SECTION_DARKER}>
      <div className={SECTION_CONTENT}>
        <div className="w-95p xs:w-1/2 mx-auto shadow-md">
          <img
            className="w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto"
            src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656192393/De-Gallo-Hoeve/images/65535_52063773527_a0d5f448de_300_400_nofilter_zcu4bp.jpg"
            alt=""
          />
        </div>
        <div className="block align-center gap-12 p24 mx-auto md:max-w-2/3">
          <Title2>Reserveren</Title2>
          <Body>
            Reserveren van een plekje gebeurt uitsluitend op afspraak en na{" "}
            <Link to="register">registratie</Link>.
          </Body>
          {reserveren.map((paragraph) => (
            <Body key={nanoid(5)}>{paragraph}</Body>
          ))}
          <FormRow>
            <Button
              label="Reserveer een plekje"
              onClick={() => router.push(RESERVATIE)}
              className="mx-auto"
            />
          </FormRow>
          <Title2>Verblijven</Title2>
          {verblijven.map((paragraph) => (
            <Body key={nanoid(5)}>{paragraph}</Body>
          ))}
          <Title2>Wat verwachten wij van u?</Title2>
          {verwachtingen.map((paragraph) => (
            <Body key={nanoid(5)}>{paragraph}</Body>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hotel;

export const getStaticProps = async () => {
  const { data } = await getData(CONTENT_HOTELAPI);

  return {
    props: {
      reserveren: data.reserveren,
      verblijven: data.verblijven,
      verwachtingen: data.verwachtingen,
    },
    revalidate: 3600,
  };
};
