import { Body, Title2 } from "../components/Typography/Typography";
import Image from "../components/Image";
import { nanoid } from "nanoid";
import { ImageProps } from "../components/Image";
import Service, { ServiceProps } from "../components/Service";

interface IndexProps {
  images: ImageProps[];
  services: ServiceProps[];
}

const index: React.FC<IndexProps> = ({ images, services }) => {
  return (
    <>
      <section className="bg-grey-400 px-5 py-5">
        <div className="max-w-8xl flex items-center py-24 mx-auto gap-12">
          <div className="min-w-fit shadow-md">
            <img
              className="block aspect-3/4 h-auto w-full rounded border-2 border-grey-100"
              src="../images/intro.jpg"
              alt="hond duitse herder gallo-hoeve"
            />
          </div>
          <div>
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
      <section className="px-5 py-5">
        <Title2>Onze diensten</Title2>
        <div className="flex gap-5 mx-auto justify-center flex-wrap mb-20">
          {services.map(({ id, ...rest }) => (
            <Service key={id} id={id} {...rest} />
          ))}
        </div>
      </section>
      <section className="bg-grey-400 px-5 py-5">
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

  const links = ["/hotel", "/trainingen", "/trainingen", "/contact"];

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
