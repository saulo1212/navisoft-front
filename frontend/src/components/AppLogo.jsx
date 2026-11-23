import Image from 'next/image';
import Link from 'next/link';
import autoscaleLogo from '@/assets/img/autoscale-light.png';

const AppLogo = () => (
  <Link href="/dashboards/control-center" className="app-logo autoscale-app-logo flex-shrink-0">
    <Image className="custom-logo autoscale-logo" src={autoscaleLogo} alt="Autoscale" unoptimized />
    <span className="autoscale-version">v5.2.0</span>
  </Link>
);

export default AppLogo;
