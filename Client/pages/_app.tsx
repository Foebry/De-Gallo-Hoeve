import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import { AppContext, ModalContextInterface } from "../context/appContext";
import { useState } from "react";
import Modal from "../components/Modal";

function MyApp({ Component, pageProps }: AppProps) {
  const [modal, setModal] = useState<ModalContextInterface>({
    active: false,
    message: "",
    type: "success",
  });
  return (
    <>
      <AppContext.Provider value={{ modal, setModal }}>
        <Header />
        <Nav />
        <main className="relative">
          {modal?.active && <Modal type={modal.type} message={modal.message} />}
          <Component {...pageProps} />
        </main>
        <Footer />
      </AppContext.Provider>
    </>
  );
}

export default MyApp;
