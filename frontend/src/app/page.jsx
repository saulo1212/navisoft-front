'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboards/control-center');
  }, [router]);

  return <main className="p-4"><Link href="/dashboards/control-center">Acessar o Navisoft</Link></main>;
}
