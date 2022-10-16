import { nanoid } from "nanoid";
import React, { useState } from "react";
import { ContentStates } from "../../pages/admin/edit";
import { CONTENTPRIVETRAINING } from "../../types/apiTypes";
import Button from "../buttons/Button";
import { Body } from "../Typography/Typography";
import { Edit, EditStates } from "./Intro";
import Image from "next/image";
import { BiEdit } from "react-icons/bi";
import { GiCheckMark } from "react-icons/gi";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

interface Props {
  content: {
    subtitle: string;
    content: string[];
    image: string;
    bullets: string[];
    price: number;
  };
  setContent: React.Dispatch<React.SetStateAction<ContentStates>>;
  handleChange: (e: any) => void;
  allContent: ContentStates;
  edit: boolean;
  handleBulletChange: (e: any, index: number) => void;
}

const Trainngen: React.FC<Props> = ({
  content,
  handleChange,
  setContent,
  allContent,
  edit,
  handleBulletChange,
}) => {
  const handleDeleteBullet = (index: number, bullets: string[]) => {
    const newBullets = bullets.filter((_, idx) => idx !== index);
    setContent({
      ...allContent,
      trainingen: { ...allContent.trainingen, bullets: newBullets },
    });
  };

  const handleAddBullet = () => {
    const trainingen = allContent.trainingen;
    const bullets = trainingen.bullets;
    setContent({
      ...allContent,
      trainingen: { ...trainingen, bullets: [...bullets, "Nieuw item"] },
    });
  };
  return (
    <div className="mb-24 mx-auto">
      <div className="relative max-w-md mx-auto bg-green-200 text-center text-2xl py-8 text-gray-50 rounded-t-lg">
        {edit ? (
          <div className="flex justify-center w-fit mx-auto border-4 rounded border-gray-50">
            <input
              data-name="trainingen"
              data-subName="subtitle"
              value={content.subtitle}
              className="text-gray-50 bg-green-200 text-2xl text-center outline-none"
              onChange={handleChange}
            />
          </div>
        ) : (
          <div>{content.subtitle}</div>
        )}
        <div
          className={`${
            edit ? "block" : "hidden"
          } absolute -right-3 -top-3 cursor-pointer text-green-200`}
        ></div>
      </div>
      <div className="mb-5 mx-auto max-w-md">
        <Image src={content.image} width="448" height="262" />
      </div>
      <div className="relative">
        {edit ? (
          <div className="flex justify-center max-w-md mx-auto">
            <textarea
              data-name="trainingen"
              data-subName="content"
              value={content.content.map((paragraph) => paragraph).join("\n\n")}
              className="w-full px-2 min-h-s text-base mx-auto border-2 border-green-200 rounded outline-none"
              onChange={(e: any) => {
                const name = e.target.dataset.name;
                const subName = e.target.dataset.subname;
                const value = e.target.value;
                setContent({
                  ...allContent,
                  [name]: {
                    ...allContent[name as keyof typeof allContent],
                    [subName]: value.split("\n\n"),
                  },
                });
              }}
            />
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {content.content.map((paragraph) => (
              <Body key={nanoid(5)} className="max-w-7xl px-2 md:mx-auto">
                {paragraph}
              </Body>
            ))}
          </div>
        )}
      </div>
      <div className="max-w-md mx-auto">
        {edit ? (
          <ul className="pl-5 md:pl-20 mt-10">
            {content.bullets.map((bullet, index, bullets) => (
              <div key={`bullet ${index}`} className="flex gap-10 items-end">
                <div className="flex gap-2">
                  <GiCheckMark />
                  <input
                    className="border border-green-200 rounded outline-none"
                    value={bullet}
                    data-index={index}
                    onChange={(e) => handleBulletChange(e, index)}
                  />
                </div>
                <IoMdRemoveCircleOutline
                  className="text-red-700 cursor-pointer"
                  onClick={() => handleDeleteBullet(index, bullets)}
                />
              </div>
            ))}
            <div className="flex gap-10 items-end">
              <div className="flex gap-2">
                <GiCheckMark />
                <div>
                  <span className="mr-2">€</span>
                  <input
                    className="max-w-5xs border border-green-200 rounded outline-none"
                    value={content.price}
                    data-name="trainingen"
                    data-subName="price"
                    onChange={handleChange}
                  />
                  <span>excl.btw</span>
                </div>
              </div>
            </div>
            <div className="mx-auto text-center">
              <IoMdAddCircleOutline
                className="ml-24 text-green-200 text-2xl cursor-pointer mt-2"
                onClick={handleAddBullet}
              />
            </div>
          </ul>
        ) : (
          <ul className="pl-5 md:pl-20 mt-10">
            {content.bullets.map((bullet) => (
              <Body key={nanoid(5)} className="flex gap-2">
                <GiCheckMark />
                {bullet}
              </Body>
            ))}
            <div className="flex items-start">
              <GiCheckMark />
              <span className="mx-2">€</span>
              <Body className="flex gap-2">{content.price}</Body>
              <span className="ml-2">excl. btw</span>
            </div>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Trainngen;
