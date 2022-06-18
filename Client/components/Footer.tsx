import { Title1, Title2, Title3, FootNote } from "./Typography/Typography";

const Footer = () => {
  return (
    <footer className="pt-20 pb-12 w-80p mx-auto relative">
      <Title1>Contacteer ons</Title1>
      <Title2>Hondenhotel de Gallo-hoeve</Title2>
      <Title3>Fakestraat 00 0000 Fakegemeente</Title3>
      <Title3>
        <a href="tel:+32400000000">+32400 00 00 00</a>
      </Title3>
      <Title3>
        <a href="mailto:info@gallohoeve.be">info@gallohoeve.be</a>
      </Title3>
      <Title3>Openingsuren</Title3>
      <ul className="w-11/12 mt-18 mx-auto mb-30 3xs:w-76">
        <li className="flex justify-between my-2.5 mx-0">
          <p>Maandag</p>
          <p className="text-right">10:00 - 18:00</p>
        </li>
        <li className="flex justify-between my-2.5 mx-0">
          <p>Dinsdag</p>
          <p className="text-right">10:00 - 18:00</p>
        </li>
        <li className="flex justify-between my-2.5 mx-0">
          <p>Woensdag</p>
          <p className="text-right">12:30 - 18:00</p>
        </li>
        <li className="flex justify-between my-2.5 mx-0">
          <p>Donderdag</p>
          <p className="text-right">10:00 - 18:00</p>
        </li>
        <li className="flex justify-between my-2.5 mx-0">
          <p>Vrijdag</p>
          <p className="text-right">10:00 - 18:00</p>
        </li>
        <li className="flex justify-between my-2.5 mx-0">
          <p>Zaterdag</p>
          <p className="text-right">10:00 - 14:00</p>
        </li>
        <li className="flex justify-between my-2.5 mx-0">
          <p>Zondag</p>
          <p className="text-right">10:00 - 14:00</p>
        </li>
      </ul>
      <FootNote>&copy; Copyright 2022. All rights reserved.</FootNote>
    </footer>
  );
};

export default Footer;
