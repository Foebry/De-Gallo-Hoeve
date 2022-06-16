import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import AppProvider from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppProvider>
        <Header />
        <Nav />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </AppProvider>
    </>
  );
}

export default MyApp;
