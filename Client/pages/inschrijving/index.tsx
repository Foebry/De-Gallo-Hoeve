import { useRouter } from "next/router";
import React from "react";
import Button from "../../components/buttons/Button";
import FormRow from "../../components/form/FormRow";
import { Title2 } from "../../components/Typography/Typography";
import { INSCHRIJVING_GROEP, INSCHRIJVING_PRIVE } from "../../types/linkTypes";
import { SECTION_DARKER } from "../../types/styleTypes";
import { Body } from "../../components/Typography/Typography";

const Index = () => {
  const router = useRouter();
  return (
    <section className={SECTION_DARKER}>
      <div className="w-full justify-between mx-auto md:flex md:w-3/4">
        <div className="md:w-5/12">
          <Title2>Prive training</Title2>
          <div className="xs:w-3/4 mx-auto mb-2">
            <img
              src="https://loremflickr.com/400/400/dogs"
              alt=""
              className="block w-full aspect-square"
            />
          </div>
          <div>
            <Body>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              animi voluptatum molestiae nemo corrupti, ullam cum eos deleniti
              itaque adipisci autem asperiores officia dolores est perspiciatis
              libero nam quod sit necessitatibus similique, a architecto
              exercitationem. In quis tenetur quas tempora magni fuga, adipisci
              amet officiis sed quaerat at est neque dolor tempore eius totam
              aspernatur corporis excepturi asperiores temporibus ipsum esse?
              Cum iure modi quas est optio, aliquid ducimus! Assumenda, officia
              delectus voluptates exercitationem incidunt unde sunt similique
              molestiae eos. Soluta facilis commodi animi, praesentium molestiae
              consequatur, doloribus ipsam dolorem nostrum maiores suscipit
              dolores, vitae blanditiis quae assumenda labore sit
            </Body>
          </div>
          <FormRow className="mt-2">
            <Button
              label="ik schrijf me in"
              className="mx-auto"
              onClick={() => router.push(INSCHRIJVING_PRIVE)}
            />
          </FormRow>
        </div>
        <div className="md:w-5/12">
          <Title2>Groepstraining</Title2>
          <div className="xs:w-3/4 mx-auto mb-2">
            <img
              src="https://loremflickr.com/400/400/dogs"
              alt=""
              className="block w-full aspect-square"
            />
          </div>
          <div>
            <Body>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              animi voluptatum molestiae nemo corrupti, ullam cum eos deleniti
              itaque adipisci autem asperiores officia dolores est perspiciatis
              libero nam quod sit necessitatibus similique, a architecto
              exercitationem. In quis tenetur quas tempora magni fuga, adipisci
              amet officiis sed quaerat at est neque dolor tempore eius totam
              aspernatur corporis excepturi asperiores temporibus ipsum esse?
              Cum iure modi quas est optio, aliquid ducimus! Assumenda, officia
              delectus voluptates exercitationem incidunt unde sunt similique
              molestiae eos. Soluta facilis commodi animi, praesentium molestiae
              consequatur, doloribus ipsam dolorem nostrum maiores suscipit
              dolores, vitae blanditiis quae assumenda labore sit
            </Body>
          </div>
          <FormRow className="mt-2">
            <Button
              label="Ik schrijf me in"
              className="mx-auto"
              onClick={() => router.push(INSCHRIJVING_GROEP)}
            />
          </FormRow>
        </div>
      </div>
    </section>
  );
};

export default Index;
