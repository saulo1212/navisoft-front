'use client';

import { ToastContainer } from 'react-toastify';
import { LayoutProvider } from '@/context/useLayoutContext';
import { SessionProvider } from '@/lib/session/SessionContext';
import dynamic from 'next/dynamic';
const WavesInitializer = dynamic(() => import('./client-wrappers/WaveClient'), {
  ssr: false
});
const AppWrapper = ({
  children
}) => {
  return <LayoutProvider>
      <SessionProvider>
        <WavesInitializer />
        {children}
        <ToastContainer theme="colored" />
      </SessionProvider>
    </LayoutProvider>;
};
export default AppWrapper;