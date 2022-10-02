import { Body, Title1 } from "../components/Typography/Typography";
import TrainingCard from "../components/Cards/TrainingCard";
import { nanoid } from "nanoid";
import Image from "next/image";
import client, { getIndexData, getRasOptions } from "../middleware/MongoDb";
import { OptionsOrGroups } from "react-select";
import { optionInterface } from "../components/register/HondGegevens";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import Skeleton from "../components/website/skeleton";

interface IndexProps {
  diensten: { subtitle: string; content: string[] };
  intro: { subtitle: string; content: string[] };
  trainingen: {
    subtitle: string;
    content: string[];
    bullets: string[];
    image: string;
    price: number;
    _id: string;
  }[];
  rassen: OptionsOrGroups<any, optionInterface>[];
}

const Index: React.FC<IndexProps> = ({
  intro,
  diensten,
  trainingen,
  rassen,
}) => {
  const { setRassen } = useAppContext();
  useEffect(() => {
    setRassen(rassen);
  }, []);
  return (
    <Skeleton>
      <section className="mb-40 block flex-wrap mt-10 items-center max-w-7xl justify-between mx-auto md:flex md:px-5">
        <div className="mx-auto w-1/2 relative flex flex-wrap rotate-135 gap-5 self-center md:w-4/12 md:mx-0 md:self-end">
          <div className="w-5/12 max-w-sm aspect-square border-4 border-green-200 overflow-hidden relative images">
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
        <div className="px-5 mx-auto md:mx-0 md:w-7/12 md:px-0">
          <Title1 className="text-green-200">{intro.subtitle}</Title1>
          {intro.content.map((paragraph) => (
            <Body key={nanoid(5)} className="max-w-7xl px-2 md:mx-auto">
              {paragraph}
            </Body>
          ))}
        </div>
      </section>
      <section className="bg-white pb-2 mx-auto md:px-5">
        <div className="px-5 mx-auto  max-w-7xl md:px-0">
          <Title1 className="text-green-200">{diensten.subtitle}</Title1>
          {diensten.content.map((paragraph) => (
            <Body key={nanoid(5)} className="px-2 md:mx-auto">
              {paragraph}
            </Body>
          ))}
        </div>
        <div className="px-5 max-w-7xl py-24 relative md:mx-auto md:px-0">
          <div className="flex gap-10 justify-center flex-wrap sm:flex-nowrap max-w-7xl md:mx-auto py-24 relative ">
            {trainingen.map((training) => (
              <TrainingCard
                key={training._id}
                title={training.subtitle}
                body={training.content}
                type="prive"
                items={training.bullets}
                image={training.image}
              />
            ))}
          </div>
        </div>
      </section>
    </Skeleton>
  );
};

export default Index;

export const getServerSideProps = async () => {
  await client.connect();
  const { intro, diensten, trainingen } = await getIndexData();
  const rassen = await getRasOptions();
  await client.close();

  return {
    props: {
      intro,
      diensten,
      trainingen,
      rassen,
      // groepstraining,
    },
    // revalidate: 3600,
  };
};
