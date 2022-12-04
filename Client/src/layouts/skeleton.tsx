import React, { ReactNode } from "react";
import Footer from "../components/Footer";
import { Nav } from "../components/Nav";

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
