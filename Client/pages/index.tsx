import { Body, Title1 } from "../components/Typography/Typography";
import TrainingCard from "../components/Cards/TrainingCard";
import Image from "next/image";
import Skeleton from "../components/website/skeleton";
import { GiCheckMark } from "react-icons/gi";
import { getPriveTraining } from "../controllers/TrainingController";

interface IndexProps {
  prijsExcl: number;
  kmHeffing: number;
  gratisVerplaatsingBinnen: number;
}

const Index: React.FC<IndexProps> = ({
  prijsExcl,
  kmHeffing,
  gratisVerplaatsingBinnen,
}) => {
  return (
    <Skeleton>
      <section className="mb-40 block flex-wrap mt-10 items-center max-w-7xl justify-between mx-auto md:flex md:px-5">
        <div className="mx-auto w-1/2 flex flex-wrap rotate-135 gap-5 self-center md:w-4/12 md:mx-0 md:self-end relative mt-28">
          <div className="w-5/12 max-w-sm aspect-square border-4 border-green-200 overflow-hidden relative images">
            <div className="aspect-square -rotate-135 absolute image">
              <Image
                src={
                  "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659626902/De-Gallo-Hoeve/content/image1_swsxl6.png"
                }
                width={800}
                height={800}
                objectFit="cover"
                alt="degallohoeve hondenschool beagle duitse herder"
              />
            </div>
          </div>
          <div className="w-5/12 aspect-square border-4 border-green-200 overflow-hidden relative images -order-1">
            <div className="aspect-square -rotate-135 absolute image">
              <Image
                src={
                  "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656188518/De-Gallo-Hoeve/content/intro_gfgoo0.jpg"
                }
                width={800}
                height={800}
                objectFit="cover"
                alt="degallohoeve zaakvoerder duitseherder"
              />
            </div>
          </div>
          <div className="w-5/12 max-w-sm aspect-square border-4 border-green-200 overflow-hidden relative images">
            <div className="aspect-square -rotate-135 absolute image">
              <Image
                src={
                  "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656174227/De-Gallo-Hoeve/images/pexels-helena-lopes-1959052_eosst4.jpg"
                }
                width={800}
                height={800}
                objectFit="cover"
                alt="labrador retriever landschap honden"
              />
            </div>
          </div>
        </div>
        <div className="px-5 mx-auto md:mx-0 md:w-7/12 md:px-0">
          <Title1 className="text-green-200">De Gallo-hoeve</Title1>
          <Body>
            Ik ben Seppe Fabry, samen met mijn vrouw Julie Luytens en onze
            dochter wonen wij in de gezellige buurt van Hulshout.
          </Body>
          <Body>
            Zelf hebben wij 3 honden, waarvan 1 Beagle (teef) en 2 Mechelse
            herders (1 teef en 1 reu).
          </Body>
          <Body>
            Tot nu toe sta ik elke dag met de vrouwelijke Mechelse herder te
            werken in de bewaking, want werken met mijn eigen honden is altijd
            mijn droom geweest.
          </Body>
          <Body>
            Sinds ik met mijn eigen hond begon te trainen en werken, kreeg ik
            steeds meer inspiratie om andere mensen te helpen door hun bij te
            leren wat ikzelf geleerd heb.
          </Body>
        </div>
      </section>
      <section className="bg-white pb-2 mx-auto md:px-5">
        <div className="px-5 mx-auto  max-w-7xl md:px-0">
          <Title1 className="text-green-200">Onze diensten</Title1>
          <div className="text-center flex flex-col gap-3">
            <Body>
              Onze diensten binnen de Gallo-hoeve zijn uitsluitend privé
              traingen aan huis.
            </Body>
            <Body>Waarom aan huis?</Body>
            <Body>
              Heb je zelf geen tijd om elke zondag ochtend naar de hondenschool
              te gaan? <br />
              En heb je liever dat je het weekend thuis kunt spenderen en ook
              alles met je hond kunt leren?
            </Body>
            <Body>
              Reserveer hieronder dan een testsessie, de eerste consultatie is
              gratis.
            </Body>
            <Body>
              Hierna kom ik tot bij u thuis en gaan wij samenzitten om alles
              rond uw hond te bespreken:
            </Body>
            <ul className="mx-auto text-left pl-20 pt-2 pb-3 flex flex-col gap-1 md:w-4/5 md:pl-80">
              <li className="flex gap-1 items-center">
                <GiCheckMark />
                Hoe oud is uw hond?
              </li>
              <li className="flex gap-1 items-center">
                <GiCheckMark />
                Welk ras is het en wat wil je leren?
              </li>
              <li className="flex gap-1 iems-center">
                <GiCheckMark />
                Wat zijn je einddoelen dat je wilt bereiken?
              </li>
              <li className="flex gap-1 items-center">
                <GiCheckMark />
                Is de hond bedoeld als huishond?
              </li>
              <li className="flex gap-1 items-center">
                <GiCheckMark />
                Of wil je gaag werken in de bewaking sector (afhankelijk van het
                ras), Politie, Defensie?
              </li>
              <li className="flex gap-1 items-center">
                <GiCheckMark />
                Wil je er graag hondensport mee doen?
              </li>
            </ul>
            <span className="text-left md:pl-80">
              <Body>Samen vinden wij een oplossing op al jou vragen.</Body>
              <Body>
                Wist u trouwens dat wij onze honden niet trainen, maar onze
                honden ons trainen?
              </Body>
            </span>
          </div>
        </div>
        <div className="px-5 max-w-7xl pb-24 relative md:mx-auto md:px-0">
          <div className="flex gap-10 justify-center flex-wrap sm:flex-nowrap max-w-7xl md:mx-auto py-24 relative ">
            <TrainingCard
              type="prive"
              price={prijsExcl}
              kmHeffing={kmHeffing}
              gratisVerplaatsingBinnen={gratisVerplaatsingBinnen}
            />
          </div>
        </div>
      </section>
    </Skeleton>
  );
};

export default Index;

export const getStaticProps = async () => {
  const { prijsExcl, kmHeffing, gratisVerplaatsingBinnen } =
    await getPriveTraining();

  return {
    props: {
      prijsExcl,
      kmHeffing,
      gratisVerplaatsingBinnen,
    },
    revalidate: 86400,
  };
};
