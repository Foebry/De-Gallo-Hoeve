import { Body, Title2 } from "../components/Typography/Typography";
import Image from "../components/Image";
import { nanoid } from "nanoid";
import { ImageProps } from "../components/Image";
import Service, { ServiceProps } from "../components/Service";
import {
  SECTION_CONTENT,
  SECTION_DARKER,
  SECTION_LIGHTER,
} from "../types/styleTypes";

interface IndexProps {
  images: ImageProps[];
  services: ServiceProps[];
}

const index: React.FC<IndexProps> = ({ images, services }) => {
  return (
    <>
      <section className={SECTION_DARKER}>
        <div className={SECTION_CONTENT}>
          <div className="w-95p xs:w-1/2 mx-auto shadow-md">
            <img
              className="w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto"
              src={`${process.env.NEXT_PUBLIC_IMAGES}/intro.jpg`}
              alt="hond duitse herder gallo-hoeve"
            />
          </div>
          <div className="block align-center gap-12 p24 mx-auto md:max-w-2/3">
            <Title2>Wie zijn we?</Title2>
            <Body>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Reprehenderit laborum cupiditate odio suscipit consequuntur facere
              autem, voluptatem minima distinctio odit. Qui minus laborum quam
              facilis dicta quasi sint excepturi omnis asperiores odio? Nobis
              explicabo ipsa non, a perspiciatis quisquam at optio porro.
              Tenetur dignissimos dicta obcaecati dolorum ipsum voluptas porro.
            </Body>
            <Body>
              Tenetur iusto architecto molestiae sint laudantium minus molestias
              ipsam culpa, ex voluptate quibusdam reiciendis sapiente recusandae
              id amet ut dolorem totam ipsa! Animi unde modi in quaerat? At amet
              perferendis hic possimus illo iste repudiandae officiis deserunt
              consequuntur voluptatibus magni, numquam quo aspernatur culpa.
              Inventore ipsum vero dolore magnam dolorum?
            </Body>
            <Body>
              Ex natus facilis provident laboriosam impedit aliquam nesciunt
              consectetur quibusdam doloremque similique velit, soluta quam sed
              inventore cum nulla minus placeat necessitatibus quia accusantium
              quasi dicta? Id iusto et quibusdam expedita iste nulla dignissimos
              corporis, iure debitis! Sed iste aperiam eaque ipsa quasi velit,
              soluta, laudantium voluptatum eligendi possimus quas.
            </Body>
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
          {images.map(({ id }) => (
            <Image key={id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default index;

export const getStaticProps = () => {
  const captions = [
    "Hondenhotel",
    "Groepstrainingen",
    "Privétraining",
    "Contact",
  ];

  const links = ["/hotel", "/training", "/training", "/contact"];

  const images = new Array<ImageProps>(12)
    .fill({ id: "" })
    .map((_) => ({ id: nanoid(5) }));

  const services = new Array<ServiceProps>(4)
    .fill({
      caption: "",
      id: "",
      image: "https://loremflickr.com/200/200/dog",
      text: "",
      alt: "",
      link: "",
    })
    .map((_, index) => ({
      ..._,
      id: nanoid(5),
      caption: captions[index],
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem maiores ipsa, numquam molestias, provident similique, delectus voluptatem vero quaerat distinctio tempora necessitatibus et labore ab nostrum dignissimos in aliquam. Inventore.",
      link: links[index],
    }));

  return {
    props: {
      images,
      services,
    },
  };
};
