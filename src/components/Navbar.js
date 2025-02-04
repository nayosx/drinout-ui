import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';
import routes from '../routes';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(routes.login);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Sistema de Gestión</h1>
      <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
    </nav>
  );
};

export default Navbar;
