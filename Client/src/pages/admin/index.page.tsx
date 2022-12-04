import React from "react";
import Dashboard from "src/layouts/dashboard";
import { Title1 } from "src/components/Typography/Typography";

interface Props {}

const index: React.FC<Props> = ({}) => {
  return (
    <Dashboard>
      <Title1>Hi</Title1>
    </Dashboard>
  );
};

export default index;
