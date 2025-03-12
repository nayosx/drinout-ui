import React, { useEffect, useRef } from 'react';
import useSidebarStore from '../store/useSidebarStore';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import routes from '../routes';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(routes.login);
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div ref={sidebarRef} className="l-panel__sidebar u-bg-white">
        <button className="close-btn" onClick={() => toggleSidebar(false)}>
          <IoClose size={24} />
        </button>
        <nav className="sidebar-menu">
          <ul>
            <li><a href={routes.home}>Inicio</a></li>
            <li><a href={routes.home}>Inicio</a></li>
            <li><a href={routes.transactions}>Transacciones</a></li>
            <li><a href={routes.profile}>Mi Perfil</a></li>
            <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
