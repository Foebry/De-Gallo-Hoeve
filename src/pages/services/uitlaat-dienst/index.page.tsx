import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from 'src/components/buttons/Button';
import CheckMarkListItem from 'src/components/lists/CheckMarkListItem';
import { Body, Title2, Title3, EbmeddedLink } from 'src/components/Typography/Typography';
import Skeleton from 'src/components/website/skeleton';

const UitlaatDienst: React.FC<{}> = () => {
  return (
    <>
      <Head>
        <title>De Gallo-hoeve - uitlaatdienst</title>
        <meta
          name="description"
          content="Honden trainer Hulshout en omstreken. Maak nu een account aan door enkele persoonlijke gegevens in te vullen, gegevens van uw hond(en). U ontvangt een email met registratie bevestiging, eenmaal bevestigt kan u nieuwe trainingen boeken."
          key="description registration"
        ></meta>
      </Head>
      <Skeleton>
        <div className="max-w-7xl mx-auto py-5 z-10" id="content-service-page">
          <section className="mb-20">
            <Title2 className="text-green-200">De Gallo-hoeve - Uitlaatdienst voor uw hond</Title2>
            <div>
              <Body>Welkom bij De Gallo-hoeve, de dienst waar uw hond de tijd van zijn leven zal hebben!</Body>
              <Body>
                Onze uitlaatdienst is speciaal ontworpen om tegemoet te komen aan de behoeften van zowel honden als hun
                eigenaars.
              </Body>
              <Body>
                We begrijpen dat het soms moeilijk kan zijn om voldoende tijd vrij te maken voor lange wandelingen met
                uw harige vriend en daarom staan wij klaar om u te helpen.
              </Body>
            </div>
          </section>
          <section className="flex justify-between items-center">
            <div>
              <section className="mb-20">
                <Title3>Waarom kiezen voor De Gallo-hoeve?</Title3>
                <div>
                  <Body>
                    Bij De Gallo-hoeve geloven we in het creëren van een veilige en stimulerende omgeving waarin uw hond
                    zich optimaal kan ontwikkelen
                  </Body>
                  <Body>Hier zijn enkele redenen waarom u voor onze uitlaatdienst zou moeten kiezen:</Body>
                  <ul>
                    <CheckMarkListItem className="" checkMarkColor="text-green-200">
                      <span className="font-semibold underline">Professionele begeleiding</span>: Ons team bestaat uit
                      een ervaren en gekwalificeerde proessional die een passie heeft voor dierenwelzijn. U kunt erop
                      vertrouwen dat uw hond in goede handen is.
                    </CheckMarkListItem>
                    <CheckMarkListItem className="" checkMarkColor="text-green-200">
                      <span className="font-semibold underline">Flexibiliteit</span>: We begrijpen dat iedere hond uniek
                      is en verschillende behoeften heeft. Daarom
                    </CheckMarkListItem>
                  </ul>
                </div>
              </section>
              <section className="mb-20">
                <Title3>Hoe werkt onze uitlaatdienst?</Title3>
                <div>
                  <Body>
                    Bij De Gallo-hoeve streven we ernaar om het proces zo eenvoudig mogelijk te maken voor onze klanten.
                  </Body>
                  <Body>Hier is een overzicht van hoe onze uitlaatdienst werkt:</Body>
                  <ul>
                    <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                      <span className="font-semibold underline">Aanmelding</span>: U kunt zich eenvoudig{' '}
                      <EbmeddedLink to="/register">
                        <span className="font-semibold">registreren</span>
                      </EbmeddedLink>{' '}
                      via onze website of telefonisch contact met ons opnemen. We plannen vervolgens en
                      kennismakingsgesprek in om meer te weten te komen over uw hond en zijn specifieke behoeften.
                    </CheckMarkListItem>
                    <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                      <span className="font-semibold underline">Uitlaatschema</span>: uzelf stelt een uitlaatschema op
                      dat past bij uw wensen en de behoeften van uw hond. U kunt kiezen uit verschillend pakketten,
                      variërend van dagelijkse wandelingen tot meerdere keren per week.
                    </CheckMarkListItem>
                    <CheckMarkListItem className="py-1" checkMarkColor="text-green-200">
                      <span className="font-semibold underline">Veiligheid en communicatie</span>: Veiligheid staat bij
                      ons voorop. Onze begeleider is getraind in het herkennen van signalen van stress of ongemak bij
                      honden. Daarnaast staan we altijd open voor communicatie en zullen we u regelmatig op de hoogte
                      hoden van de activiteiten en het welzijn van uw hond..
                    </CheckMarkListItem>
                  </ul>
                </div>
              </section>
            </div>
            <div className="-z-10">
              <Image
                src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1688751489/De-Gallo-Hoeve/content/pexels-blue-bird-7210754_rwez0z.jpg"
                alt=""
                layout="fill"
                width={400}
                height={400}
                className="opacity-60 blur-md pointer-events-none"
              />
            </div>
          </section>
          <section className="mb-20">
            <Title3>Maak vandaag nog een afspraak!</Title3>
            <div>
              <Body>Bent u geïnteresseerd in onze uitlaatdienst? Maak dan vandaag nog en afspraak!</Body>
              <Body>
                Kies voor De Gallo-hoeve en geef uw hond de kans om zijn nodige behoeftes te kunnen doen wanneer u dit
                niet kan.
              </Body>
            </div>
            <div className="flex justify-center mt-10">
              <Button label={<Link href="/inschrijving/uitlaat-dienst">Maak een afspraak</Link>} />
            </div>
          </section>
        </div>
      </Skeleton>
    </>
  );
};

export default UitlaatDienst;
