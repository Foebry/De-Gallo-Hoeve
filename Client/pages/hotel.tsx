import { useRouter } from "next/router";
import React from "react";
import Button from "../components/buttons/Button";
import { Body, Link, Title2 } from "../components/Typography/Typography";
import { RESERVATIE } from "../types/linkTypes";

interface HotelProps {}

const Hotel: React.FC<HotelProps> = ({}) => {
  const router = useRouter();
  return (
    <section className="bg-grey-900 px-5 py-5">
      <div className="max-w-8xl flex items-center py-24 mx-auto gap-12">
        <div className="min-w-fit shadow-md">
          <img
            className="block aspect-3/4 h-auto w-full rounded border-2 border-grey-100"
            src="https://loremflickr.com/300/400/dog"
            alt=""
          />
        </div>
        <div>
          <Title2>Reserveren</Title2>
          <Body>
            Reserveren van een plekje gebeurt uitsluitend op afspraak en na{" "}
            <Link to="register">registratie</Link>.
          </Body>
          <Body>
            Onze reserveringsprocedure is zeer gebruiksvriendelijk, waarbij u
            zelf ook het verblijf (=de slaapkennel) van uw trouwe hond(en) kan
            kiezen. Hierdoor kunnen wij er altijd voor zorgen dat de verblijven
            voor ontvangst ontsmet en gekuist zijn. Dit is dan ook wettelijk
            verplicht.
          </Body>
          <Button
            label="Reserveer een plekje"
            onClick={() => router.push(RESERVATIE)}
          />
          <Title2>Verblijven</Title2>
          <Body>
            Elk verblijf heeft een binnen en buitenkennel met afmetingen van 4
            m². Indien er nood is aan een groter verblijf omwille van meerdere
            honden hebben wij nog verblijven staan van 6 m².
          </Body>
          <Body>
            Ook is er een grote speelweide waar jullie trouwe viervoeters eens
            lekker kunnen rondspurten en spelen.
          </Body>
          <Body>
            Indien de hond een oudere leeftijd heeft en dus meer nood heeft aan
            rust, wordt hem dat zeker ook gegund. Voor iedere hond is hier een
            plaatsje.
          </Body>
          <Title2>Wat verwachten wij van u?</Title2>
          <Body>
            Wanneer uw hond bij ons komt logeren, bent u verplicht het
            paspoortje mee te nemen.
          </Body>
          <Body>
            Daarnaast vragen wij u ervoor te zorgen dat uw hond de nodige
            vaccinaties heeft gehad + ontwormd is.
          </Body>
        </div>
      </div>
    </section>
  );
};

export default Hotel;
