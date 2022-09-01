import "../styles/globals.css";
import react from "react";
import type { AppProps } from "next/app";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import AppProvider from "../context/appContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppProvider>
        <Nav />
        <ToastContainer position="top-right" />
        <Component {...pageProps} />
        <Footer />
      </AppProvider>
    </>
  );
}

export default MyApp;
