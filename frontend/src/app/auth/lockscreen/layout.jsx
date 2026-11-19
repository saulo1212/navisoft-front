import { redirect } from 'next/navigation';
import { templateDemosEnabled } from '@/lib/navigation/access';

export default function Layout({ children }) {
  if (!templateDemosEnabled) redirect('/auth/login');
  return children;
}
