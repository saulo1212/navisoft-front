import Link from 'next/link';
import autoscaleLogo from '@/assets/img/autoscale-original.webp';
const AppLogo = () => {
  return <Link href="/dashboards/control-center" className="app-logo flex-shrink-0" data-prefix="v5.2.0">
      <img className="custom-logo autoscale-logo" src={autoscaleLogo.src} alt="Autoscale" />
    </Link>;
};
export default AppLogo;
