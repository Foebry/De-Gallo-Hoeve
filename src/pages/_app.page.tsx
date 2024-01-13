import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import ModalProvider from 'src/context/ModalContext';
import { ErrorBoundary } from 'react-error-boundary';
import { FallBack } from 'src/pages/error.page';
import useMutation from 'src/hooks/useMutation';
import { useRouter } from 'next/router';
import AxiosProvider from 'src/context/AxiosContext';
import AppProvider from 'src/context/app/AppContext';
import logger from 'src/utils/logger';

function MyApp({ Component, pageProps }: AppProps) {
  const logError = useMutation<{}>('/api/logError');
  const router = useRouter();

  const errorHandler = (error: any, errorInfo: any) => {
    const page = router.route;
    handleError(page, error, errorInfo);
  };
  const handleError = async (page: string, error: any, errorInfo: any) => {
    try {
      if (process.env.NODE_ENV === 'production') await logError('/', { page, error, errorInfo });
      else logger.error({ error, errorInfo });
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') logger.error({ error: err });
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>
      <AxiosProvider>
        <AppProvider>
          <ModalProvider>
            <ErrorBoundary FallbackComponent={FallBack} onError={errorHandler}>
              <ToastContainer position="top-right" />
              <Component {...pageProps} />
            </ErrorBoundary>
          </ModalProvider>
        </AppProvider>
      </AxiosProvider>
    </>
  );
}

export default MyApp;
