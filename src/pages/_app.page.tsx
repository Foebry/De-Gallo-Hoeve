import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "../context/appContext";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppProvider>
        <ToastContainer position="top-right" />
        <Component {...pageProps} />
      </AppProvider>
    </>
  );
}

export default MyApp;
