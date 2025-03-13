import React from 'react';
import { FiMenu } from 'react-icons/fi';
import useSidebarStore from '../store/useSidebarStore';
import useNavbarStore from '../store/useNavbarStore';
import { FiLogOut } from "react-icons/fi";
import { logout } from '../api/auth';

const Navbar = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const title = useNavbarStore((state) => state.title);

  return (
    <nav className="l-panel__navbar navbar u-bg-blue-v2 u-text-white u-d-flex u-d-flex-gap-3 u-pt-1 u-pb-1 u-pr-2 u-pl-2">
      <button className="menu-button u-text-white" onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>
      <h1 className="navbar-title">{title}</h1>
      <div className='u-d-flex-spacer'></div>
      <button
        type='button'
        className='u-btn u-btn--no-width u-btn-danger'
        onClick={logout}>
        <FiLogOut />
      </button>
    </nav>
  );
};

export default Navbar;
