import React, { ReactNode } from "react";
import Footer from "../Footer";
import { Nav } from "../Nav";

interface Props {
  children: ReactNode;
}

const skeleton: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
};

export default skeleton;
