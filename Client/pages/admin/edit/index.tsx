import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Dashboard from "../../../components/admin/dashboard";
import Diensten from "../../../components/admin/Diensten";
import Intro from "../../../components/admin/Intro";
import Trainingen from "../../../components/admin/Trainngen";
import { useGetContent } from "../../../hooks/useGetContent";
import useMutation from "../../../hooks/useMutation";

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
  };
}

const index = () => {
  const saveContent = useMutation();
  const [content, setContent] = useState<ContentStates>({
    intro: { subtitle: "", content: [], image: "" },
    diensten: { subtitle: "", content: [], image: "" },
    trainingen: { content: [], bullets: [], image: "", subtitle: "" },
  });
  useEffect(() => {
    useGetContent(setContent);
  }, []);

  const handleChange = (e: any) => {
    const name = e.target.dataset.name;
    const subName = e.target.dataset.subname;
    const value = e.target.value;
    console.log(content);
    setContent({
      ...content,
      [name]: { ...content[name as keyof typeof content], [subName]: value },
    });
  };

  const handleSave = async (endpoint: string, key: string) => {
    const payload = content[key as keyof typeof content];
    const { data, error } = await saveContent(endpoint, payload, {
      method: "PUT",
    });
    if (data) {
      toast.success("save succesvol!");
      setContent({ ...content, [key]: data });
    }
    if (error) {
      toast.error(error);
    }
  };

  return (
    <Dashboard>
      <Intro
        handleSave={handleSave}
        content={content.intro}
        setContent={setContent}
        handleChange={handleChange}
        allContent={content}
      />
      <section className="bg-white pb-2 mx-auto md:px-5">
        <Diensten
          handleSave={handleSave}
          content={content.diensten}
          setContent={setContent}
          handleChange={handleChange}
          allContent={content}
        />
        <Trainingen
          handleSave={handleSave}
          content={content.trainingen}
          setContent={setContent}
          handleChange={handleChange}
          allContent={content}
        />
      </section>
    </Dashboard>
  );
};

export default index;
