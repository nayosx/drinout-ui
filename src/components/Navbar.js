import React from 'react';
import { FiMenu } from 'react-icons/fi';
import useSidebarStore from '../store/useSidebarStore';
import useNavbarStore from '../store/useNavbarStore';

const Navbar = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const title = useNavbarStore((state) => state.title);

  return (
    <nav className="l-panel__navbar navbar">
      <button className="menu-button" onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>
      <h1 className="navbar-title">{title}</h1>
    </nav>
  );
};

export default Navbar;
