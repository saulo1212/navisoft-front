import { Suspense } from 'react';
import { staticDetailParams } from '@/lib/navigation/detailRoutes';

export function generateStaticParams() {
  return staticDetailParams('uid');
}

export default function DetailLayout({ children }) {
  return <Suspense>{children}</Suspense>;
}
