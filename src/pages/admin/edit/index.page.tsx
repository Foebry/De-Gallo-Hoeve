import React, { useEffect, useState } from "react";
import Dashboard from "src/components/admin/dashboard";
import Diensten from "src/components/admin/Diensten";
import Intro from "src/components/admin/Intro";
import Trainingen from "src/components/admin/Trainngen";
import Button from "src/components/buttons/Button";
import useMutation from "src/hooks/useMutation";
import { useGetContent } from "src/hooks/useGetContent";

export interface ContentStates {
  intro: {
    subtitle: string;
    content: string[];
    image: string;
  };
  diensten: {
    subtitle: string;
    content: string[];
    image: string;
  };
  trainingen: {
    content: string[];
    bullets: string[];
    image: string;
    subtitle: string;
    price: number;
  };
}

interface Props {}

const Index: React.FC<Props> = ({}) => {
  const saveContent = useMutation();
  const [edit, setEdit] = useState<boolean>(false);
  const getContent = useGetContent();
  const [content, setContent] = useState<ContentStates>({
    intro: { subtitle: "", content: [], image: "" },
    diensten: { subtitle: "", content: [], image: "" },
    trainingen: { content: [], bullets: [], image: "", subtitle: "", price: 0 },
  });
  useEffect(() => {
    (async () => {
      const data = await getContent();
      setContent(data);
    })();
  }, []);

  const handleChange = (e: any) => {
    const name = e.target.dataset.name;
    const subName = e.target.dataset.subname;
    const value = e.target.value;
    setContent({
      ...content,
      [name]: { ...content[name as keyof typeof content], [subName]: value },
    });
  };

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const handleSave = async () => {
    const payload = content;
    setEdit(false);
    setContent(content);
    // const { data, error } = await saveContent("/api/admin/content", payload, {
    //   method: "PUT",
    // });
    // if (data) {
    //   setEdit(false);
    //   toast.success("save successvol");
    //   setContent(data);
    // }
    // if (error) {
    //   toast.error(error);
    // }
  };

  const handleBulletChange = (e: any, index: number) => {
    const trainingen = content.trainingen;
    const bullets = trainingen.bullets;
    const value = e.target.value;
    bullets[index] = value;
    setContent({ ...content, trainingen: { ...trainingen, bullets: bullets } });
  };

  return (
    <Dashboard>
      <div className="px-10 pt-5 flex gap-5 flex-row-reverse">
        <Button label={"edit"} onClick={toggleEdit} />{" "}
        <Button label="save" onClick={() => handleSave()} />
      </div>
      <Intro
        content={content.intro}
        setContent={setContent}
        handleChange={handleChange}
        allContent={content}
        edit={edit}
      />
      <section className="bg-white pb-2 mx-auto md:px-5">
        <Diensten
          content={content.diensten}
          setContent={setContent}
          handleChange={handleChange}
          allContent={content}
          edit={edit}
        />
        <Trainingen
          content={content.trainingen}
          setContent={setContent}
          handleChange={handleChange}
          allContent={content}
          edit={edit}
          handleBulletChange={handleBulletChange}
        />
      </section>
    </Dashboard>
  );
};

export default Index;
