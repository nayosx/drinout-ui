import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import { GrLogout } from "react-icons/gr";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(routes.login);
  };

  return (
    <nav className="u-bg-blue u-text-white-pure u-d-flex u-d-flex-align-center u-pt-1 u-pb-1 u-pl-2 u-pr-2">
      <h1 className="navbar-title">Sistema de Gestión</h1>
      <div className='u-d-flex-spacer'></div>
      <button className="u-btn u-btn--no-width u-btn-primary-red-20 u-pl-1 u-pr-1" onClick={handleLogout}><GrLogout /> Cerrar Sesión</button>
    </nav>
  );
};

export default Navbar;
