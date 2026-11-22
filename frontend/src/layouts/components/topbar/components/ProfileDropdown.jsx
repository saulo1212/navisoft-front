'use client';

import adminAvatar from '@/assets/img/avatar-admin.png';
import { useSession } from '@/lib/session/SessionContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';

const PROFILE_LABELS = {
  primary_admin: 'Primary',
  administrator: 'Administrator',
  secondary_admin: 'Secondary',
  basic_user: 'Basic'
};

const ProfileDropdown = () => {
  const router = useRouter();
  const { account, logout } = useSession();
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };
  return <Dropdown>
            <DropdownToggle as={'a'} type="button" data-bs-toggle="dropdown" className="btn-system bg-transparent d-flex flex-shrink-0 align-items-center justify-content-center no-arrow" aria-label="Abrir menu da conta">
                <Image src={adminAvatar} className="profile-image profile-image-md rounded-circle" alt="" />
            </DropdownToggle>

            <DropdownMenu className="dropdown-menu-animated dropdown-menu-end">
                <div className="notification-header rounded-top mb-2">
                    <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                        <span className="status status-success d-inline-block me-2">
                            <Image src={adminAvatar} className="profile-image rounded-circle" alt="" />
                        </span>
                        <div className="info-card-text">
                            <div className="fs-lg">Minha conta</div>
                        </div>
                    </div>
                </div>
                <hr className="m-0"></hr>
                <DropdownItem as={Link} href="/account/security">
                    <span>Segurança da conta</span>
                </DropdownItem>
                <hr className="m-0"></hr>
                <DropdownItem className="d-flex justify-content-between align-items-center" onClick={handleFullscreen}>
                    <span>Fullscreen</span>
                    <b className="text-muted fs-nano px-2 rounded font-monospace align-self-center border">F11</b>
                </DropdownItem>
                <hr className="m-0"></hr>
                <DropdownItem className="py-3 fw-500 d-flex justify-content-between" onClick={handleLogout}>
                    <span className="text-danger">Sair</span>
                    <span className="d-block text-truncate text-truncate-sm">{PROFILE_LABELS[account?.profile] || account?.profile}</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>;
};
export default ProfileDropdown;
