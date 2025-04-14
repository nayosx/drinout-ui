import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';

const isAuthenticated = () => !!sessionStorage.getItem('authToken');

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(routes.login.path, { replace: true });
    } else {
      setAuthChecked(true);
    }
  }, [navigate]);

  if (!authChecked) {
    return <div className="protected-route-placeholder" />;
  }

  return children;
};

export default ProtectedRoute;
