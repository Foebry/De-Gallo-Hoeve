import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from '../context/appContext';
import Head from 'next/head';
import TrainingDayProvider from 'src/context/TrainingDayContext';
import Modal from 'src/components/Modal';
import ModalProvider from 'src/context/ModalContext';
import FeedbackProvider from 'src/context/FeedbackContext';
import { ErrorBoundary } from 'react-error-boundary';
import { FallBack } from 'src/pages/error.page';
import useMutation from 'src/hooks/useMutation';
import { useRouter } from 'next/router';
import VacationProvider from 'src/context/VacationContext';
import BannerProvider from 'src/context/BannerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [shouldShowBanner, setShouldShowBanner] = useState<boolean>(false);
  const logError = useMutation();
  const router = useRouter();

  const errorHandler = (error: any, errorInfo: any) => {
    const page = router.route;
    handleError(page, error, errorInfo);
  };
  const handleError = async (page: string, error: any, errorInfo: any) => {
    try {
      if (process.env.NODE_ENV === 'production')
        await logError('/api/logError', { page, error, errorInfo });
      else console.log(error, errorInfo);
    } catch (e: any) {
      if (process.env.NODE_ENV !== 'production') console.log(e);
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>
      <BannerProvider>
        <FeedbackProvider>
          <ModalProvider>
            <ErrorBoundary FallbackComponent={FallBack} onError={errorHandler}>
              <TrainingDayProvider>
                <VacationProvider>
                  <AppProvider>
                    <Modal />
                    <ToastContainer position="top-right" />
                    <Component {...pageProps} />
                  </AppProvider>
                </VacationProvider>
              </TrainingDayProvider>
            </ErrorBoundary>
          </ModalProvider>
        </FeedbackProvider>
      </BannerProvider>
    </>
  );
}

export default MyApp;
