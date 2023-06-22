import { Router, useRouter } from 'next/router';

const useOnPageChange = (currentPathName: string, handler: () => any) => {
  const router = useRouter();
  if (router.pathname === currentPathName) {
    Router.events.on('routeChangeStart', () => {
      handler();
    });
  }
};

export const onPageChange = useOnPageChange;
