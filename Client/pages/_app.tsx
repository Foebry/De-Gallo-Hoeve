import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import AppProvider from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppProvider>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </AppProvider>
    </>
  );
}

export default MyApp;
