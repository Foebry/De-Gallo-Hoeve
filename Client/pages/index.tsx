import { Body, Title2 } from "../components/Typography/Typography";
import Image from "../components/Image";
import { ImageProps } from "../components/Image";
import Service, { ServiceProps } from "../components/Service";
import {
  SECTION_CONTENT,
  SECTION_DARKER,
  SECTION_LIGHTER,
} from "../types/styleTypes";
import getData from "../hooks/useApi";
import { CONTENT_INDEXAPI, DIENSTENAPI, IMAGESAPI } from "../types/apiTypes";

interface IndexProps {
  images: ImageProps[];
  services: ServiceProps[];
  content: {
    content: string[];
    image: string;
  };
}

const Index: React.FC<IndexProps> = ({
  images,
  services,
  content: { content, image: frontImage },
}) => {
  return (
    <>
      <section className={SECTION_DARKER}>
        <div className={SECTION_CONTENT}>
          <div className="w-95p xs:w-1/2 mx-auto shadow-md">
            <img
              className="w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto"
              src={frontImage}
              alt="hond duitse herder gallo-hoeve"
            />
          </div>
          <div className="block align-center gap-12 p24 mx-auto md:max-w-2/3">
            <Title2>Wie zijn we?</Title2>
            {content.map((paragraph) => (
              <Body>{paragraph}</Body>
            ))}
          </div>
        </div>
      </section>
      <section className={SECTION_LIGHTER}>
        <Title2>Onze diensten</Title2>
        <div className="max-w-8xl flex items-center gap-5 mx-auto justify-center flex-wrap sm:pb-25">
          {services.map(({ id, ...rest }) => (
            <Service key={id} id={id} {...rest} />
          ))}
        </div>
      </section>
      <section className={SECTION_DARKER}>
        <div className="flex flex-grow flex-shrink flex-wrap gap-2.5 justify-center">
          {images.map(({ id, ...rest }) => (
            <Image key={id} id={id} {...rest} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  const [services, images, content] = await Promise.all([
    getData(DIENSTENAPI),
    getData(IMAGESAPI),
    getData(CONTENT_INDEXAPI),
  ]);

  return {
    props: {
      images: images.data,
      services: services.data,
      content: content.data,
    },
    revalidate: 3600,
  };
};
