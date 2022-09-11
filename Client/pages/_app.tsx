import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Nav />
      <ToastContainer position="top-right" />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
