import React, { useEffect, useState, useCallback } from 'react';
import { startWorkSession, endWorkSession, getWorkSessions } from '../../api/workSessions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { FaCheckCircle } from 'react-icons/fa';
import { GrInProgress } from 'react-icons/gr';
import 'dayjs/locale/es';
import useAppStore from '../../store/useAppStore';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.locale('es');

const SALVADOR_TIMEZONE = 'America/El_Salvador';

const Home = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser] = useState(() => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [workSessions, setWorkSessions] = useState([]);
  const setTitle = useAppStore((state) => state.setTitle);

  const fetchWorkSessions = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const sessions = await getWorkSessions(userId);
      const lastSession = sessions.find(session => session.status !== 'COMPLETED');

      if (lastSession) {
        setActiveSession(lastSession);
      } else {
        setActiveSession(null);
      }

      setWorkSessions(sessions);
    } catch (error) {
      console.error('Error fetching work sessions list:', error);
      setActiveSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTitle('DayLog');
    if (!currentUser) return;
    fetchWorkSessions(currentUser.id);
  }, [setTitle, currentUser, fetchWorkSessions]);

  const calculateWorkDuration = (loginTime, logoutTime) => {
    if (!loginTime) return '0h 0m';

    const login = dayjs.utc(loginTime).tz(SALVADOR_TIMEZONE, true);
    const logout = logoutTime ? dayjs.utc(logoutTime).tz(SALVADOR_TIMEZONE, true) : dayjs();

    const workedDuration = dayjs.duration(logout.diff(login));
    return `${Math.floor(workedDuration.asHours())}h ${workedDuration.minutes()}m`;
  };

  const handleStartSession = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await startWorkSession();
      setActiveSession(response.session);
      setTimeout(() => fetchWorkSessions(currentUser.id), 500);
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
      setTimeout(() => fetchWorkSessions(currentUser.id), 500);
    } catch (error) {
      console.error('Error ending work session:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformDate = (date, isTime = false) => {
    return dayjs.utc(date).tz(SALVADOR_TIMEZONE, true).format(isTime ? 'hh:mm A' : 'DD MMM YYYY');
  };

  return (
    <div className="home-container">
        {currentUser && (
          <h2 className="welcome-message">¡Bienvenido, {currentUser.name}!</h2>
        )}

        <h1>Jornada Laboral</h1>
        <p>Administra tu jornada de trabajo.</p>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="session-actions">
            {activeSession ? (
              <button type="button" className="u-btn u-btn-secondary-red-20" onClick={handleEndSession}>
                Finalizar Jornada
              </button>
            ) : (
              <button className="u-btn u-btn-secondary-green" onClick={handleStartSession}>
                Iniciar Jornada
              </button>
            )}
          </div>
        )}

        <hr className="grey-v1" />
        <h2>Historial de Jornadas Laborales</h2>
        <table className="work-session-table">
          <thead>
            <tr className="u-bg-grey-80 u-text-grey-30">
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
                  <td className="u-pl-2 u-pr-2 u-text-center">
                    {transformDate(session.login_time)}
                  </td>
                  <td className="u-pl-2 u-pr-2 u-text-center">
                    {transformDate(session.login_time, true)}
                  </td>
                  <td className="u-pl-2 u-pr-2 u-text-center">
                    {session.logout_time
                      ? transformDate(session.logout_time, true)
                      : 'En progreso'}
                  </td>
                  <td className="u-pl-2 u-pr-2 u-text-center">
                    {calculateWorkDuration(session.login_time, session.logout_time)}
                  </td>
                  <td className="u-pl-2 u-pr-2 u-text-center">
                    {session.status === 'COMPLETED' ? (
                      <FaCheckCircle className="u-icon-x16 u-text-green" />
                    ) : (
                      <GrInProgress className="u-icon-x16 u-text-cyan-20" />
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
  );
};

export default Home;
