import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from '../context/appContext';
import Head from 'next/head';
import TrainingDayProvider from 'src/context/TrainingDayContext';
import Modal from 'src/components/Modal';
import ModalProvider from 'src/context/ModalContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>
      <ModalProvider>
        <TrainingDayProvider>
          <AppProvider>
            <Modal />
            <ToastContainer position="top-right" />
            <Component {...pageProps} />
          </AppProvider>
        </TrainingDayProvider>
      </ModalProvider>
    </>
  );
}

export default MyApp;
