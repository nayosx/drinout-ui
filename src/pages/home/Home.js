import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { startWorkSession, endWorkSession, getWorkSessionLastest } from '../../api/workSessions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/es';
import './Home.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.locale('es');

const SALVADOR_TIMEZONE = 'America/El_Salvador';

const Home = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [workDuration, setWorkDuration] = useState('');

  useEffect(() => {
    const fetchUser = () => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    };

    const fetchWorkSession = async () => {
      setLoading(true);
      try {
        const response = await getWorkSessionLastest();

        if (response.session !== null && response.session.status !== 'COMPLETED') {
          setActiveSession(response.session);
          calculateWorkDuration(response.session.login_time, response.session.logout_time);
        } else {
          setActiveSession(null);
          setWorkDuration('');
        }
      } catch (error) {
        console.error('Error fetching work sessions:', error);
        setActiveSession(null);
        setWorkDuration('');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchWorkSession();
  }, []);

  const calculateWorkDuration = (loginTime, logoutTime) => {
    if (!loginTime) return;

    const login = dayjs.utc(loginTime).tz(SALVADOR_TIMEZONE, true);
    const logout = logoutTime ? dayjs.utc(logoutTime).tz(SALVADOR_TIMEZONE, true) : dayjs();

    const formattedDate = login.format('DD MMM YYYY');
    const workedDuration = dayjs.duration(logout.diff(login));
    const workedHours = Math.floor(workedDuration.asHours());
    const workedMinutes = workedDuration.minutes();

    setWorkDuration(`Fecha: ${formattedDate} | Tiempo trabajado: ${workedHours}h ${workedMinutes}m`);
  };

  const handleStartSession = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await startWorkSession();
      setActiveSession(response.session);
      calculateWorkDuration(response.session.login_time, null);
    } catch (error) {
      console.error('Error starting work session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    setLoading(true);
    try {
      await endWorkSession();
      setActiveSession(null);
      setWorkDuration('');
    } catch (error) {
      console.error('Error ending work session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="home-container">
        {currentUser && (
          <h2 className="welcome-message">¡Bienvenido, {currentUser.name}!</h2>
        )}

        <h1>Jornada Laboral</h1>
        <p>Administra tu jornada de trabajo.</p>

        {workDuration && <p className="work-duration">{workDuration}</p>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="session-actions">
            {activeSession ? (
              <button type="button" className="u-btn u-btn-secondary" onClick={handleEndSession}>
                Finalizar Jornada
              </button>
            ) : (
              <button className="u-btn u-btn-secondary-green" onClick={handleStartSession}>
                Iniciar Jornada
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
