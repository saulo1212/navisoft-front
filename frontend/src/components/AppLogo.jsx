import Link from 'next/link';
import { basePath } from '@/helpers';
const AppLogo = () => {
  return <Link href="/dashboards/control-center" className="app-logo flex-shrink-0" data-prefix="v5.2.0">
      <img className="custom-logo" src={`${basePath}/navisoft-logo.png`} alt="Navisoft" style={{
      height: '2rem',
      width: 'auto',
      minWidth: 0,
      objectFit: 'contain',
      objectPosition: 'left center'
    }} />
    </Link>;
};
export default AppLogo;
