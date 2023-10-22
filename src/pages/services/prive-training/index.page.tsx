import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Button from 'src/components/buttons/Button';
import { Body, Title2, Title3 } from 'src/components/Typography/Typography';
import Skeleton from 'src/components/website/skeleton';
import Image from 'next/image';
import { GiCheckMark } from 'react-icons/gi';
import CheckMarkListItem from 'src/components/lists/CheckMarkListItem';

const PriveTraining: React.FC<{}> = () => {
  return (
    <>
      <Head>
        <title>De Gallo-hoeve - privé-training</title>
        <meta
          name="description"
          content="Honden trainer Hulshout en omstreken. Maak nu een account aan door enkele persoonlijke gegevens in te vullen, gegevens van uw hond(en). U ontvangt een email met registratie bevestiging, eenmaal bevestigt kan u nieuwe trainingen boeken."
          key="description registration"
        ></meta>
      </Head>
      <Skeleton>
        <div className="max-w-7xl mx-auto py-5 z-10" id="content-service-page">
          <section className="mb-20">
            <Title2 className="text-green-200">De Gallo-hoeve: Privé hondentrainer aan huis</Title2>
            <Body>
              Welkom bij De Gallo-hoeve, dé plek waar jij de perfecte oplossing vindt voor de training en opvoeding van
              jouw trouwe viervoeter.
            </Body>
            <Body>
              Onze privé hondentrainer komt bij jou thuis om persoonlijke begeleiding te bieden, zodat jij en je hond
              optimaal kunnen genieten van een harmonieuze relatie.
            </Body>
          </section>
          <section className="flex justify-between items-center">
            <div>
              <section className="mb-20">
                <Title3>Waarom kiezen voor een privé honden trainer aan huis?</Title3>
                <div>
                  <Body>
                    Het hebben van een goed opgevoed hond is essentieel voor het creëren van een gelukkige en gezonde
                    leefomgeving.
                  </Body>
                  <Body>
                    Het kan echter lastig zijn om tijd vij te maken voor groepslessen of om naar een trainingscentrum te
                    reizen.
                  </Body>
                  <Body>Daarom biedt De Gallo-hoeve de unieke service van een privé honden trainer aan huis.</Body>
                </div>
                <div>
                  <Body>
                    Met onze aanpak kunnen we ons volledig richten op de specifieke behoeften en uitdagingen die jij en
                    je hond ervaren.
                  </Body>
                  <Body>
                    We komen bij jou thuis, in de vertrouwde omgeving van je hond, waardoor we beter kunnen inschatten
                    wat er nodig is om gewenst gedrag te bevorderen en ongewenst gedrag af te leren.
                  </Body>
                </div>
              </section>
              <section className="mb-20">
                <Title3>Wat kun je verwachten van onze privé honden trainer?</Title3>
                <div>
                  <Body>
                    Onze ervaren en gekwalificeerde hondentrainer zal eerst een uitgebreide intake doen om een diepgaand
                    inzicht te krijgen in de specifieke behoeften van jouw hond.
                  </Body>
                  <Body>
                    Vervolgens zal er een op maat gemaakt traininsplan worden opgesteld, rekening houdend met zowel de
                    fysieke als de mentale gezondheid van je hond.
                  </Body>
                </div>
                <div>
                  <Body>
                    Tijdens de trainingssessie zal onze privé honden trainer je begeleiden bij het aanleren van
                    basiscommando&apos;s, socialisatie, zindelijkheidstraining en nog veel meer.
                  </Body>
                  <Body>
                    Daarnaast besteden we ook aandacht aan gedragsproblemen zoals aggressie, angst of verlatingsangst
                  </Body>
                </div>
              </section>
            </div>
            <div className="-z-30 pointer-events-none">
              <Image
                src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656188984/De-Gallo-Hoeve/content/pexels-blue-bird-7210258_m74qdh.jpg"
                alt=""
                layout="fill"
                width={400}
                height={400}
                className="opacity-60 blur-md pointer-events-none"
              />
            </div>
          </section>
          <section className="mb-20">
            <Title3>Voordelen van privé training aan huis</Title3>
            <div>
              <Body>
                Het kiezen voor privé training aan huis biedt diverse voordelen ten opzichte van groepslessen of
                trainingen op externe locatie:
              </Body>
              <ul>
                <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                  <span className="font-semibold underline">Individuele aandacht</span>: Je krijgt persoonlijke
                  begeleiding die volledig is afgestemd op de behoeften van jouw hond.
                </CheckMarkListItem>
                <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                  <span className="font-semibold underline">Vertrouwde omgeving</span>: De training vindt plaats in jouw
                  eigen huis, waaroor je hond zich comfortabeler voelt en beter kan leren.
                </CheckMarkListItem>
                <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                  <span className="font-semibold underline">Tijdsbesparing</span>: Geen reistijd naar een
                  trainingscentrum of wachten op andere cursisten. Je bespaart tijd door de trainer bij jou aan huis te
                  ontvangen.
                </CheckMarkListItem>
                <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                  <span className="font-semibold underline">Flexibiliteit</span>: Trainingsessies kunnen worden gepland
                  op een tijdstip dat voor jou het beste uitkompt.
                </CheckMarkListItem>
              </ul>
            </div>
          </section>
          <section className="mb-20">
            <Title3>Waarom kiezen voor De Gallo-hoeve?</Title3>
            <div>
              <Body>
                Bij De Gallo-hoeve streven we naar de hoogste standaarden in hondentraining en gedragsbegeleiding.
              </Body>
              <Body>
                Onze privé honden trainer heeft jarenlange ervaring en is gepassioneerd in het helpen van baasjes om een
                sterke band met hun hond op te bouwen.
              </Body>
            </div>
            <div>
              <Body>We geloven in positieve trainingsmethoden, waarbij beloning en motivatie centraal staan.</Body>
              <Body>Dit zorgt voor een plezierige leerervaring voor zowel jou als je hond.</Body>
              <Body>
                Daarnaast hechten we veel waarde aan continue ondersteuning, ook buiten de trainingsessies om.
              </Body>
            </div>
          </section>
          <section className="mb-20">
            <Title3>Maak vandaag nog een afspraak!</Title3>
            <div>
              <Body>Wil je graag de beste zorg en training voor jouw hond, maar dan gewoon bij jou thuis?</Body>
              <Body>Aarzel niet langer en maak vandaag nog een afspraak</Body>
              <Body>Samen werken we aan een gehoorzame, blije en evenwichtige viervoeter!</Body>
            </div>
            <div className="flex justify-center mt-10">
              <Button label={<Link href="/inschrijving">Maak een afspraak</Link>} />
            </div>
          </section>
        </div>
      </Skeleton>
    </>
  );
};

export default PriveTraining;
