import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="l-panel">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <div className="l-panel__content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
