import React, { useEffect, useRef } from 'react';
import useSidebarStore from '../store/useSidebarStore';
import { IoClose } from 'react-icons/io5';
import routes from '../routes';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const sidebarRef = useRef(null);

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

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div ref={sidebarRef} className="l-panel__sidebar u-bg-white sidebar u-p-all-none">
        
        <nav className="sidebar-menu">
          <ul>
            <li className='u-text-right'>
              <button 
                type='button' 
                className="close-btn u-mr-1" 
                onClick={() => toggleSidebar(false)}>
                <IoClose size={24} />
              </button>
            </li>
            <li>
              <a className='u-btn u-btn--large u-btn--text-left' href={routes.home}>
                Inicio
              </a>
            </li>
            <li>
              <a className='u-btn u-btn--large u-btn--text-left' href={routes.transaction.list}>
                Transacciones
              </a>
            </li>
            <li>
              <a className='u-btn u-btn--large u-btn--text-left' href={routes.transaction.add}>
                Agregar pago
              </a>
            </li>
            <li>
              <a className='u-btn u-btn--large u-btn--text-left' href={routes.me}>
                Mis datos
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
