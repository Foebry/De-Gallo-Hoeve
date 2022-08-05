import Image from "next/image";

const Header = () => {
  return (
    <header>
      <div className="relative">
        <h1 className="absolute left-5p top-5p text-gray-100 text-8vmin 2xs:left-auto 2xs:right-13p 2xs:top-25p 2xs:text-5vmax z-10">
          De Gallo-Hoeve
        </h1>
        <Image
          src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656347618/De-Gallo-Hoeve/images/pexels-pixabay-159557_ccxjbf.jpg"
          width={2500}
          height={800}
          objectFit="cover"
          alt=""
        />
      </div>
    </header>
  );
};

export default Header;
