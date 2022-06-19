import { Router, useRouter } from "next/router";
import React from "react";
import { Title1 } from "../components/Typography/Typography";

interface Props {
  type: string;
}

const Inschrijving: React.FC<Props> = ({ type }) => {
  return (
    <Title1>
      {type === "group" ? "GROEP" : type === "prive" ? "PRIVE" : ""}
    </Title1>
  );
};

export default Inschrijving;

export const getServerSideProps = (context: any) => {
  return {
    props: {
      type: context.query?.type ?? "",
    },
  };
};
