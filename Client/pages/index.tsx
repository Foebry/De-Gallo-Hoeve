import { Body, Title2 } from "../components/Typography/Typography";
import Image from "../components/Image";
import { ImageProps } from "../components/Image";
import Service, { ServiceProps } from "../components/Service";
import { atob } from "buffer";
import {
  SECTION_CONTENT,
  SECTION_DARKER,
  SECTION_LIGHTER,
} from "../types/styleTypes";
import { nanoid } from "nanoid";
import db, { conn } from "../middleware/db";

interface IndexProps {
  images: ImageProps[];
  diensten: ServiceProps[];
  image: string;
  content: string[];
}

const Index: React.FC<IndexProps> = ({ images, diensten, image, content }) => {
  return (
    <>
      <section className={SECTION_DARKER}>
        <div className={SECTION_CONTENT}>
          <div className="w-95p xs:w-1/2 mx-auto shadow-md">
            <img
              className="w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto"
              src={image}
              alt="hond duitse herder gallo-hoeve"
            />
          </div>
          <div className="block align-center gap-12 p24 mx-auto md:max-w-2/3">
            <Title2>Wie zijn we?</Title2>
            {content.map((paragraph) => (
              <Body key={nanoid(5)}>{paragraph}</Body>
            ))}
          </div>
        </div>
      </section>
      <section className={SECTION_LIGHTER}>
        <Title2>Onze diensten</Title2>
        <div className="max-w-8xl flex items-center gap-5 mx-auto justify-center flex-wrap sm:pb-25">
          {diensten.map(({ id, ...rest }) => (
            <Service key={id} id={id} {...rest} />
          ))}
        </div>
      </section>
      <section className={SECTION_DARKER}>
        <div className="flex flex-grow flex-shrink flex-wrap gap-2.5 justify-center">
          {images.map(({ id }) => (
            <Image key={id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  const data = await db.multiQuery([
    {
      key: "image",
      builder: conn.select("image").from("content").where({ id: 1 }).first(),
    },
    {
      key: "content",
      builder: conn.select("content").from("content").where({ id: 1 }).first(),
    },
    {
      key: "images",
      builder: conn.select("*").from("image"),
    },
    {
      key: "diensten",
      builder: conn
        .select("id", "image", "summary", "caption", "link")
        .from("dienst"),
    },
  ]);

  return {
    props: {
      images: data.images.slice(0, 12),
      diensten: data.diensten.map((dienst: any) => ({
        ...dienst,
        summary: atob(dienst.summary),
      })),
      content: atob(data.content).split("\n"),
      image: data.image,
    },
  };
};
