const Header = () => {
  return (
    <header className="relative">
      <h1 className="absolute left-5p top-5p text-gray-100 text-8vmin 2xs:left-auto 2xs:right-13p 2xs:top-25p 2xs:text-5vmax">
        De Gallo-hoeve
      </h1>
      <div>
        <img
          className="block w-full object-fill aspect-3x xs:aspect-6x"
          src="https://loremflickr.com/1400/320/dog"
          alt=""
        />
      </div>
    </header>
  );
};

export default Header;
