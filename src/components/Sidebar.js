import React, { useEffect, useRef } from 'react';
import useSidebarStore from '../store/useSidebarStore';
import { IoClose } from 'react-icons/io5';
import routes from '../routes';

const SHOW_ALL_MENUS = process.env.REACT_APP_SHOW_ALL_MENUS === 'true';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const sidebarRef = useRef(null);

  const storedMenu = JSON.parse(sessionStorage.getItem("menu")) || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const isRouteAllowed = (path) => {
    if (SHOW_ALL_MENUS) return true;
    return storedMenu.some((menuItem) => menuItem.path === path);
  };

  const renderMenuItems = (routesObj) => {
    return Object.entries(routesObj).map(([key, value]) => {
      if (
        typeof value === 'object' &&
        'path' in value &&
        'label' in value &&
        value.showInSidebar &&
        isRouteAllowed(value.path)
      ) {
        return (
          <li key={key}>
            <a
              className="u-btn u-btn--large u-btn--text-left"
              href={value.path}
            >
              {value.label}
            </a>
          </li>
        );
      } else if (typeof value === 'object') {
        return renderMenuItems(value);
      } else {
        return null;
      }
    });
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div
        ref={sidebarRef}
        className="l-panel__sidebar u-bg-white sidebar u-p-all-none"
      >
        <nav className="sidebar-menu">
          <ul>
            <li className="u-text-right">
              <button
                type="button"
                className="close-btn u-mr-1"
                onClick={() => toggleSidebar(false)}
              >
                <IoClose size={24} />
              </button>
            </li>
            {renderMenuItems(routes)}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;