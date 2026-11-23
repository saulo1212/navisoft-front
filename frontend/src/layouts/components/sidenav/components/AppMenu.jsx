'use client';

import { basePath } from '@/helpers';
import { scrollToElement } from '@/helpers/layout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';

function findActiveUrl(items, pathname) {
  let activeUrl = '';
  for (const item of items) {
    const url = item.children ? findActiveUrl(item.children, pathname) : item.url;
    if (url && url.length > activeUrl.length && (pathname === url || pathname.startsWith(`${url}/`))) {
      activeUrl = url;
    }
  }
  return activeUrl;
}

const MenuItemWithChildren = ({
  item,
  activeUrl,
  pathname,
  openMenuKey,
  setOpenMenuKey,
  level = 0,
  openKeys
}) => {
  const isTopLevel = level === 0;
  const [localOpen, setLocalOpen] = useState(false);
  const [didAutoOpen, setDidAutoOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(null);
  const isChildActive = children => children.some(child => child.url === activeUrl || child.children && isChildActive(child.children));
  const isActive = isChildActive(item.children || []);
  const isOpen = manualOpen !== null ? manualOpen : openKeys?.has(item.key) ? true : isTopLevel ? openMenuKey === item.key : localOpen;
  useEffect(() => {
    if (isTopLevel && isActive && !didAutoOpen) {
      setOpenMenuKey(item.key);
      setDidAutoOpen(true);
    }
    if (!isTopLevel && isActive && !didAutoOpen) {
      setLocalOpen(true);
      setDidAutoOpen(true);
    }
  }, [isActive, isTopLevel, item.key, setOpenMenuKey, didAutoOpen]);
  const toggleOpen = () => {
    setManualOpen(prev => !(prev ?? isOpen));
    if (isTopLevel) {
      setOpenMenuKey(manualOpen ? null : item.key);
    } else {
      setLocalOpen(!isOpen);
    }
  };
  return <li className={`nav-item has-ul ${isActive && !isOpen ? 'active' : ''}`}>
      <a onClick={toggleOpen} aria-expanded={isOpen} role="button">
        {item.icon && <svg className="sa-icon">
            <use href={basePath + item.icon}></use>
          </svg>}
        <span className="nav-link-text">{item.label}</span>
        <div className="ms-auto">
          {item.badge && <span className={`badge me-4 ${item.badge.variant}`}>{item.badge.text}</span>}
          <span className="collapse-sign" aria-hidden="true">
            <i className={`sa ${isOpen ? 'sa-chevron-up' : 'sa-chevron-down'}`}></i>
          </span>
        </div>
      </a>
      <Collapse in={isOpen}>
        <div>
          <ul className="d-flex">
            {(item.children || []).map((child, index) => child.children ? <MenuItemWithChildren key={`${child.key}-child-${index}`} item={child} activeUrl={activeUrl} pathname={pathname} openMenuKey={openMenuKey} setOpenMenuKey={setOpenMenuKey} level={level + 1} /> : <MenuItem key={`${child.key}-leaf-${index}`} item={child} activeUrl={activeUrl} pathname={pathname} />)}
          </ul>
        </div>
      </Collapse>
    </li>;
};
const MenuItem = ({
  item,
  activeUrl,
  pathname
}) => {
  const isActive = item.url === activeUrl;
  const ariaCurrent = isActive ? (item.url === pathname ? 'page' : 'location') : undefined;
  return <li className={`${isActive ? 'active' : ''}`}>
      <Link target={item.target} href={item.url ?? '/'} className={`${isActive ? 'active' : ''}`} aria-current={ariaCurrent}>
        {item.icon && <svg className="sa-icon">
            <use href={basePath + item.icon}></use>
          </svg>}
        <span className="nav-link-text">{item.label}</span>
        {item.badge && <span className={`badge badge-end ms-auto ${item.badge.variant}`}>{item.badge.text}</span>}
      </Link>
    </li>;
};
const AppMenu = ({
  menuItems,
  openKeys
}) => {
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  const activeUrl = findActiveUrl(menuItems, pathname);
  const [openMenuKey, setOpenMenuKey] = useState(null);
  const scrollToActiveLink = () => {
    const activeItem = document.querySelector('#sidenav li:has(> a[aria-current])') ?? document.querySelector('#sidenav li.active');
    if (activeItem) {
      const simpleBarContent = document.querySelector('#sidenav .simplebar-content-wrapper');
      if (simpleBarContent) {
        const offset = activeItem.offsetTop - window.innerHeight * 0.4;
        scrollToElement(simpleBarContent, offset, 500);
      }
    }
  };
  useEffect(() => {
    setTimeout(() => scrollToActiveLink(), 100);
  }, []);
  return <ul className="nav-menu">
      {menuItems.map((item, index) => item.isTitle ? <li className="nav-title" key={`${item.key}-title-${index}`}>
            <span>{item.label}</span>
          </li> : item.children ? <MenuItemWithChildren key={`${item.key}-group-${index}`} item={item} activeUrl={activeUrl} pathname={pathname} openMenuKey={openMenuKey} setOpenMenuKey={setOpenMenuKey} openKeys={openKeys} /> : <MenuItem key={`${item.key}-item-${index}`} item={item} activeUrl={activeUrl} pathname={pathname} />)}
    </ul>;
};
export default AppMenu;
