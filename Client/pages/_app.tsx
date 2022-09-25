import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Nav />
      <ToastContainer position="top-right" />
      <Component {...pageProps} />
      <Footer />
    </AppProvider>
  );
}

export default MyApp;
