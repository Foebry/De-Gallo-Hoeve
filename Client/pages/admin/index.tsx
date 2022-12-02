import React from "react";
import Dashboard from "@components/admin/dashboard";
import { Title1 } from "@components/Typography/Typography";

interface Props {}

const index: React.FC<Props> = ({}) => {
  return (
    <Dashboard>
      <Title1>Hi</Title1>
    </Dashboard>
  );
};

export default index;
