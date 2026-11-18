import AppLogo from '@/components/AppLogo';
import { useLayoutContext } from '@/context/useLayoutContext';
import { basePath } from '@/helpers';
import NotificationDropdown from '@/layouts/components/topbar/components/NotificationDropdown';
import OrganizationSwitcher from '@/layouts/components/topbar/components/OrganizationSwitcher';
import ProfileDropdown from '@/layouts/components/topbar/components/ProfileDropdown';
import ToggleMobileMenu from '@/layouts/components/topbar/components/ToggleMobileMenu';
import ToggleSidenav from '@/layouts/components/topbar/components/ToggleSidenav';
import VirtualAssistant from '@/layouts/components/topbar/components/VirtualAssistant';
import dynamic from 'next/dynamic';
const MaximizeScreen = dynamic(() => import('@/layouts/components/topbar/components/MaximizeScreen'), {
  ssr: false
});
const ThemeToggler = dynamic(() => import('@/layouts/components/topbar/components/ThemeToggler'), {
  ssr: false
});
const Topbar = () => {
  const {
    customizer
  } = useLayoutContext();
  return <header className="app-header">
      <div className="d-flex flex-grow-1 w-100 me-auto align-items-center">
        <AppLogo />

        <ToggleMobileMenu />

        <ToggleSidenav />

        <form className="app-search" role="search" action="/forum/search" autoComplete="off">
          <input type="text" className="form-control" placeholder="Search for anything" />
        </form>
      </div>

      <button type="button" className="btn btn-system hidden-mobile" onClick={customizer.toggle} aria-label="Open Settings">
        <svg className="sa-icon sa-icon-2x">
          <use href={`${basePath}/icons/sprite.svg#settings`}></use>
        </svg>
      </button>

      <ThemeToggler />

      <VirtualAssistant />

      <MaximizeScreen />

      <OrganizationSwitcher />

      <NotificationDropdown />

      <ProfileDropdown />
    </header>;
};
export default Topbar;