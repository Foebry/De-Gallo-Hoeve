import { Body, Title1 } from "../components/Typography/Typography";
import { atob } from "buffer";
import db, { conn } from "../middleware/db";
import { GetServerSideProps } from "next";
import TrainingCard from "../components/Cards/TrainingCard";
import { nanoid } from "nanoid";
import Image from "next/image";
import { INSCHRIJVING_GROEP, INSCHRIJVING_PRIVE } from "../types/linkTypes";

interface IndexProps {
  privetraining: string[];
  groepstraining: string[];
  wie: string[];
  image: { image: string };
}

const Index: React.FC<IndexProps> = ({
  privetraining,
  groepstraining,
  wie,
}) => {
  return (
    <>
      <section className="mb-40 mx-5 block flex-wrap mt-10 items-center max-w-7xl justify-between md:mx-auto md:flex">
        <div className="md:mb-0 max-w-sm relative flex flex-wrap md:px-0 md:w-4/12 rotate-135 gap-5 self-center mx-auto mdl:self-end">
          <div className="w-5/12 aspect-square border-4 border-green-200 overflow-hidden relative images">
            <div className="aspect-square -rotate-135 absolute image">
              <Image
                src={
                  "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659626902/De-Gallo-Hoeve/content/image1_swsxl6.png"
                }
                width={800}
                height={800}
                objectFit="cover"
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
              />
            </div>
          </div>
        </div>
        <div className="mx-auto md:mx-0 md:w-7/12">
          <Title1 className="text-green-200">De Gallo-hoeve</Title1>
          {wie.map((paragraph) => (
            <Body key={nanoid(5)} className="max-w-7xl mx-10 mdl:mx-auto">
              {paragraph}
            </Body>
          ))}
        </div>
      </section>
      <section className="bg-white pb-2">
        <div className="mx-auto  max-w-7xl px-5">
          <Title1 className="text-green-200">Onze diensten</Title1>
          {groepstraining.slice(0, 1).map((paragraph) => (
            <Body key={nanoid(5)} className="mdl:mx-auto">
              {paragraph}
            </Body>
          ))}
        </div>
        <div className="mx-5 max-w-7xl md:mx-auto py-24 relative">
          <div className="flex gap-10 justify-center flex-wrap sm:flex-nowrap max-w-7xl md:mx-auto py-24 relative ">
            <TrainingCard
              title="Groepstrainingen"
              body={groepstraining}
              items={[
                "1 hond per inschrijving",
                "max 10 inschrijvingen per training",
                "Training op Zondag",
                "€ 15,00",
              ]}
              link={INSCHRIJVING_GROEP}
              image="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656189950/De-Gallo-Hoeve/content/hondenschool-740x433_hove6a.jpg"
            />
            <TrainingCard
              title="Privétrainingen"
              body={privetraining}
              link={INSCHRIJVING_PRIVE}
              items={[
                "1 hond per inschrijving",
                "Bij u thuis of op locatie",
                "Woensdag, Vrijdag en Zaterdag",
                "€ 25,00",
              ]}
              image="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656188984/De-Gallo-Hoeve/content/pexels-blue-bird-7210258_m74qdh.jpg"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;

export const getServerSideProps = async (ctx: GetServerSideProps) => {
  interface ContentResult {
    content: string;
  }

  const data = (await db.query({
    builder: conn.select("content").from("content").whereIn("id", [1, 5, 6]),
  })) as ContentResult[];
  const image = await db.query({
    builder: conn.select("image").from("content").where({ id: 1 }).first(),
  });

  return {
    props: {
      image,
      wie: atob(data[0].content).split("\n"),
      privetraining: atob(data[1].content).split("\n"),
      groepstraining: atob(data[2].content).split("\n"),
    },
  };
};
