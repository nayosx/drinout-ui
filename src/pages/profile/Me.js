import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../api/user';
import './Me.scss';

const Me = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUser();
  }, []); // El efecto se ejecutará una sola vez

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="me-container">
      <h1>Bienvenido, {user.name || 'Usuario'}</h1>
      <p>Este es tu perfil.</p>
    </div>
  );
};

export default Me;
