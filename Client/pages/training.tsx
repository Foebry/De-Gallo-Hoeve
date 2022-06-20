import { useRouter } from "next/router";
import React from "react";
import Button from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";
import { Body, Caption, Title2 } from "../components/Typography/Typography";
import getData from "../hooks/useApi";
import { KLANT_HONDEN } from "../types/apiTypes";
import { INSCHRIJVING_GROEP, INSCHRIJVING_PRIVE } from "../types/linkTypes";

interface TrainingProps {}

const Trainingen: React.FC<TrainingProps> = () => {
  const router = useRouter();
  return (
    <>
      <section className="bg-grey-900 px-5 py-5">
        <div className="max-w-8xl items-center py-24 mx-auto gap-12 mdl:flex">
          <div className="w-1/2 mx-auto shadow-md mdl:min-w-fit">
            <img
              className="block aspect-3/4 h-auto w-full rounded border-2 border-grey-100"
              src="https://loremflickr.com/400/400/dog"
              alt=""
            />
          </div>
          <div>
            <Title2>Groepstrainingen</Title2>
            <Body>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
              excepturi velit sapiente cum minus recusandae sed quos incidunt
              architecto magnam. Totam fugit ab alias, quos hic nemo. Illo,
              corrupti, similique unde culpa aliquam voluptatem voluptates,
              sapiente veritatis libero doloremque reiciendis. Similique
              voluptatibus voluptatem dolorum incidunt, facere magnam totam
              pariatur placeat iusto eveniet vitae voluptatum dolore quis amet
              dolores necessitatibus provident. Exercitationem dolorem dicta
              quam beatae tenetur? Veritatis, illo rem adipisci temporibus ad ut
              animi tempora laudantium quae dolorem eum aspernatur aliquam
              debitis repellat sed eius aperiam maiores quia sit expedita fuga
              neque. Earum nostrum accusantium voluptatem, delectus dolore ipsa
              laborum.
            </Body>
            <Body>
              Eum voluptates adipisci laborum, asperiores neque sit esse,
              nesciunt eveniet error, id cupiditate molestiae. Distinctio quos
              quia tempore adipisci iusto, ratione itaque modi rerum
              dignissimos. Consectetur expedita accusantium culpa facere
              explicabo, esse suscipit laborum earum beatae! Optio vero,
              incidunt est aliquid, harum veniam amet unde modi adipisci quis
              beatae dolores explicabo cupiditate nihil minima! Temporibus,
              eligendi veritatis vel facere dolorum nam tenetur doloribus magnam
              illum, quibusdam sit vitae voluptas ea beatae culpa natus quas
              nemo repudiandae. Quas debitis repudiandae molestias eum vero
              distinctio enim perspiciatis, blanditiis veritatis repellat
              possimus, dicta aliquam. Quasi laboriosam obcaecati totam incidunt
              eum quas qui autem!
            </Body>
            <Body>
              Culpa, id minima architecto eligendi odio, eaque deserunt porro
              sed qui dicta labore soluta veritatis nesciunt consequatur dolores
              consectetur. Doloremque possimus incidunt voluptatem odio
              praesentium, voluptates dolorem eius porro culpa, nisi corrupti
              non quisquam ex excepturi reiciendis, eaque ducimus facere
              doloribus modi veniam dolorum omnis? Quo dolorem accusantium quas!
              At possimus quos eius, natus ex earum doloremque dignissimos sed
              veritatis error accusantium numquam? Non tenetur molestias illum
              consectetur totam incidunt nostrum, consequuntur voluptatibus est
              nulla rem minus. Delectus, nemo! Voluptate tempore ipsam earum
              nostrum ullam placeat harum error et corrupti ex, mollitia est
              temporibus! Minima consequatur sunt voluptatem accusantium quasi?
            </Body>
            <Caption>Groepslessen gaan door op zondag.</Caption>
            <FormRow className="mt-2">
              <Button
                className="mx-auto"
                label="Ik schrijf me in"
                onClick={() => router.push(INSCHRIJVING_GROEP)}
              />
            </FormRow>
          </div>
        </div>
      </section>
      <section className="bg-grey-500 px-5 py-5">
        <div className="max-w-8xl items-center py-24 mx-auto gap-12 mdl:flex">
          <div>
            <Title2>Privétrainingen</Title2>
            <Body>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Consectetur incidunt amet at ab eveniet optio veritatis quo fugit
              commodi veniam consequatur sed dolores dolore sequi provident
              culpa iusto explicabo laboriosam aut, maiores fugiat. Cupiditate
              id ab deleniti, esse, consequatur ducimus doloremque natus
              excepturi harum minima perferendis quae quibusdam libero dolores
              sit sapiente quis ipsa eaque maiores soluta alias? Saepe porro
              voluptates ullam. Consequatur saepe cumque sequi recusandae quod
              aut tempora fugit ipsa veritatis minus pariatur reiciendis
              consequuntur possimus ratione rerum omnis hic quaerat, molestias
              veniam maxime voluptatem corporis expedita? Dicta nisi ipsam
              libero expedita sequi ratione totam distinctio aliquam possimus.
            </Body>
            <Body>
              Libero eaque quae animi at praesentium recusandae maiores commodi
              dolores ipsam fugiat, aliquam, consequuntur nobis autem vero
              quaerat? Aspernatur laudantium numquam quia assumenda. Eum officia
              exercitationem architecto voluptatum quidem repellat omnis
              quisquam a porro voluptate, nostrum qui eveniet vel quibusdam
              inventore deleniti sit vero natus facere sapiente velit dicta. Ut
              autem, perspiciatis iste culpa enim excepturi veritatis deserunt
              quia dolor maiores adipisci nihil neque, ad libero est aut quidem,
              nulla nam quos et aspernatur at nobis rem quisquam? Incidunt est
              tempore voluptate ipsam voluptas fugit itaque impedit doloribus
              rem, dolorem non harum eveniet quam repellat eius blanditiis.
              Consequatur, tenetur architecto.
            </Body>
            <Body>
              Perspiciatis repellendus sit exercitationem. Laudantium, beatae
              molestiae! Dolorem placeat qui, hic molestiae reprehenderit
              perspiciatis maxime ratione quidem, et minus repellat debitis
              veniam. Dolores exercitationem esse eius nobis culpa porro nam
              possimus omnis recusandae quae enim ipsa officiis, unde voluptates
              obcaecati neque. Vitae doloremque, laborum quod voluptas et
              assumenda temporibus, impedit quibusdam blanditiis totam quo
              veniam! Quod aspernatur ratione accusamus maxime sunt optio
              dolorem magnam vero provident, itaque repellendus recusandae vitae
              velit ipsum ullam earum qui accusantium sit voluptatibus officia.
              Expedita quia consequuntur quas a consectetur saepe voluptatum
              alias unde. Error voluptatibus blanditiis perspiciatis inventore,
              cumque consequuntur iure ab consectetur laudantium.
            </Body>
            <Body>
              Vraag een privétraining aan voor woensdag, vrijdag of zaterdag.
              Voor een privéles vragen we een bijdrage van €23.90
            </Body>
            <FormRow className="mt-2">
              <Button
                className="mx-auto"
                label="Aanvragen"
                onClick={() => router.push(INSCHRIJVING_PRIVE)}
              />
            </FormRow>
          </div>
          <div className="w-1/2 mx-auto mdl:min-w-fit shadow-md my-5 mdl:my-0">
            <img
              className="block w-full aspect-3/4 h-auto mdl:w-full mx-auto rounded border-2 border-grey-100"
              src="https://loremflickr.com/400/400/dog"
              alt=""
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Trainingen;

export const getServerSideProps = async () => {
  const honden = await getData(KLANT_HONDEN, { klantId: 1 });
  console.log(honden);
  return {
    props: {
      honden,
    },
  };
};
