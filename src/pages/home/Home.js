import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { startWorkSession, endWorkSession, getWorkSessionLastest, getWorkSessions } from '../../api/workSessions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { FaCheckCircle } from 'react-icons/fa';
import { GrInProgress } from 'react-icons/gr';
import 'dayjs/locale/es';

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
  const [workSessions, setWorkSessions] = useState([]);

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
    fetchWorkSessions();
  }, []);

  const fetchWorkSessions = async () => {
    try {
      const sessions = await getWorkSessions();
      setWorkSessions(sessions);
    } catch (error) {
      console.error('Error fetching work sessions list:', error);
    }
  };

  const calculateWorkDuration = (loginTime, logoutTime) => {
    if (!loginTime) return '0h 0m';

    const login = dayjs.utc(loginTime).tz(SALVADOR_TIMEZONE, true);
    const logout = logoutTime ? dayjs.utc(logoutTime).tz(SALVADOR_TIMEZONE, true) : dayjs();

    const workedDuration = dayjs.duration(logout.diff(login));
    const workedHours = Math.floor(workedDuration.asHours());
    const workedMinutes = workedDuration.minutes();

    return `${workedHours}h ${workedMinutes}m`;
  };

  const handleStartSession = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await startWorkSession();
      setActiveSession(response.session);
      calculateWorkDuration(response.session.login_time, null);
      fetchWorkSessions();
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
      fetchWorkSessions();
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

        <hr className='grey-v1' />
        <h2>Historial de Jornadas Laborales</h2>
        <table className="work-session-table">
          <thead>
            <tr className='u-bg-grey-80 u-text-grey-30'>
              <th>Fecha</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Tiempo Laborado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {workSessions.length > 0 ? (
              workSessions.map((session, index) => (
                <tr key={session.id} className={index % 2 !== 0 ? 'u-bg-grey-30' : ''}>
                  <td className='u-pl-2 u-pr-2 u-text-center'>{dayjs.utc(session.login_time).tz(SALVADOR_TIMEZONE, true).format('DD MMM YYYY')}</td>
                  <td className='u-pl-2 u-pr-2 u-text-center'>{dayjs.utc(session.login_time).tz(SALVADOR_TIMEZONE, true).format('hh:mm A')}</td>
                  <td className='u-pl-2 u-pr-2 u-text-center'>{session.logout_time ? dayjs.utc(session.logout_time).tz(SALVADOR_TIMEZONE, true).format('hh:mm A') : 'En progreso'}</td>
                  <td className='u-pl-2 u-pr-2 u-text-center'>{calculateWorkDuration(session.login_time, session.logout_time)}</td>
                  <td className='u-pl-2 u-pr-2 u-text-center'>
                    {session.status === 'COMPLETED' ? (
                      <FaCheckCircle className='u-icon-x16 u-text-green' />
                    ) : (
                      <GrInProgress className='u-icon-x16 u-text-cyan-20' />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay registros de jornadas laborales.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
