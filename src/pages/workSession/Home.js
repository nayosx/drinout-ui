import React, { useEffect, useState, useCallback } from 'react';
import {
  startWorkSession,
  forceEndWorkSession,
  getWorkSessions,
  endWorkSession,
  getWorkSessionLastest,
} from '../../api/workSessions';
import { createTask } from '../../api/task';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { GrInProgress } from 'react-icons/gr';
import 'dayjs/locale/es';
import useAppStore from '../../store/useAppStore';
import { HiDotsVertical } from 'react-icons/hi';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

dayjs.extend(duration);
dayjs.locale('es');

const HomeWorkSession = () => {
  const [latestSession, setLatestSession] = useState(null);
  const [latestSessionLoading, setLatestSessionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser] = useState(() => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [workSessions, setWorkSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [quillContent, setQuillContent] = useState('');
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const setTitle = useAppStore((state) => state.setTitle);

  const fetchLatestSession = useCallback(async () => {
    if (!currentUser) return;
    setLatestSessionLoading(true);
    try {
      const data = await getWorkSessionLastest();
      if (data.session && data.session.status !== 'COMPLETED') {
        setLatestSession(data.session);
      } else {
        setLatestSession(null);
      }
    } catch {
      setLatestSession(null);
    } finally {
      setLatestSessionLoading(false);
    }
  }, [currentUser]);

  const fetchWorkSessions = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const sessions = await getWorkSessions(userId);
      setWorkSessions(sessions);
    } catch {
      setWorkSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTitle('DayLog');
    if (!currentUser) return;
    fetchWorkSessions(currentUser.id);
    fetchLatestSession();
  }, [setTitle, currentUser, fetchWorkSessions, fetchLatestSession]);

  const calculateWorkDuration = (loginTime, logoutTime) => {
    if (!loginTime) return '0h 0m';
    const login = dayjs(loginTime);
    const logout = logoutTime ? dayjs(logoutTime) : dayjs();
    const workedDuration = dayjs.duration(logout.diff(login));
    return `${Math.floor(workedDuration.asHours())}h ${workedDuration.minutes()}m`;
  };

  const transformDate = (date, isTime = false) =>
    dayjs(date).format(isTime ? 'hh:mm A' : 'DD MMM YYYY');

  const handleStartSession = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await startWorkSession();
      setLatestSession(response.session);
      setTimeout(() => fetchWorkSessions(currentUser.id), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    setLoading(true);
    try {
      await endWorkSession();
      setLatestSession(null);
      setTimeout(() => fetchWorkSessions(currentUser.id), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleForceEndSession = async (comments) => {
    setLoading(true);
    try {
      await forceEndWorkSession(currentUser.id, comments);
      setLatestSession(null);
      setTimeout(() => fetchWorkSessions(currentUser.id), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSubmit = () => {
    handleForceEndSession(comment);
    handleCloseModal();
  };

  const handlePending = async () => {
    setIsSavingTask(true);
    try {
      await createTask({
        user_id: currentUser.id,
        description: quillContent,
        work_session_id: latestSession.id,
      });
      setIsConfirmModalOpen(false);
      setShowEditor(false);
      setQuillContent('');
      handleEndSession();
    } catch {
      setSaveError(true);
    } finally {
      setIsSavingTask(false);
    }
  };

  return (
    <div className='container u-mt-4 u-mb-8'>
      {loading ? (
        <div className='row'>
          <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <div className='row'>
            <div className='col-12'>
              {currentUser && <h2 className='welcome-message u-mb-2'>¡Bienvenido, {currentUser.name}!</h2>}
            </div>
          </div>

          <div className='row'>
            <div className='col-12 col-md-10 u-d-flex u-d-flex-justify-start u-d-flex-align-center'>
              <h2>Historial de Jornadas Laborales</h2>
            </div>
            <div className='col-12 col-md-2'>
              {latestSessionLoading || loading ? (
                <button className='u-btn u-btn--large' disabled>
                  Consultando estado de su sesión...
                </button>
              ) : latestSession ? (
                <button
                  type='button'
                  className='u-btn u-btn--large u-btn-secondary-red-20'
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  Finalizar Jornada
                </button>
              ) : (
                <button className='u-btn u-btn--large u-btn-secondary-green' onClick={handleStartSession}>
                  Iniciar Jornada
                </button>
              )}
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <hr className='grey-v1' />
            </div>
          </div>

          <div className='row'>
            <div className='col-12 col-md-6 col-lg-4'>
              {workSessions.length ? (
                workSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`u-card u-card--shadow-sm u-d-flex u-d-flex-justify-between u-d-flex-align-center u-mb-1 ${
                      session.status === 'COMPLETED' ? 'u-bg-grey-20' : 'u-bg-hover-blue'
                    }`}
                  >
                    <div className='u-d-flex u-d-flex-column u-d-flex-gap-2 u-w-100'>
                      <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-4'>
                        <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-2 u-d-flex-column u-d-flex-justify-between u-w-100'>
                          <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-2 u-d-flex-row u-d-flex-justify-start u-w-100'>
                            <strong>Fecha:</strong> {transformDate(session.login_time)}
                          </div>
                          <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-2 u-d-flex-row u-d-flex-justify-start u-w-100'>
                            <strong>Inicio:</strong> {transformDate(session.login_time, true)}
                          </div>
                        </div>
                        <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-2 u-d-flex-column u-d-flex-justify-between u-w-100'>
                          <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-2 u-d-flex-row u-d-flex-justify-start u-w-100'>
                            <strong>Fecha:</strong>{' '}
                            {session.logout_time ? (
                              transformDate(session.logout_time)
                            ) : (
                              <GrInProgress className='u-icon-x12 u-text-cyan-20' />
                            )}
                          </div>
                          <div className='u-d-flex u-d-flex-align-center u-d-flex-gap-2 u-d-flex-row u-d-flex-justify-start u-w-100'>
                            <strong className='u-mr-2'>Fin:</strong>{' '}
                            {session.logout_time ? (
                              transformDate(session.logout_time, true)
                            ) : (
                              <GrInProgress className='u-icon-x12 u-text-cyan-20' />
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <strong>Tiempo Laborado:</strong>{' '}
                        {calculateWorkDuration(session.login_time, session.logout_time)}
                      </div>
                      {session.comments && (
                        <div>
                          <strong>Comentario:</strong> {session.comments}
                        </div>
                      )}
                    </div>
                    {session.status !== 'COMPLETED' && (
                      <button
                        className='u-btn u-btn-secondary-blue u-btn--x32 u-btn--circle'
                        onClick={handleOpenModal}
                      >
                        <HiDotsVertical />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No hay registros de jornadas laborales.</p>
              )}
            </div>
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} showCloseButton={false}>
        <h3 className='u-mb-1'>Comentario para finalización de jornada</h3>
        <textarea
          className='u-w-100 u-mb-2'
          rows='4'
          placeholder='Escribe tu comentario...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className='u-d-flex u-d-flex-justify-center u-d-flex-gap-2'>
          <button className='u-btn u-btn-grey-30' onClick={handleCloseModal}>
            Cancelar
          </button>
          <button className='u-btn u-btn-secondary-green' onClick={handleSubmit}>
            Enviar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setShowEditor(false);
          setQuillContent('');
          setSaveError(false);
        }}
        showCloseButton={false}
      >
        {!showEditor ? (
          <>
            <h3 className='u-mb-2 u-text-center'>¿Haz dejado pendientes?</h3>
            <div className='u-d-flex u-d-flex-justify-center u-d-flex-gap-4 u-mt-4'>
              <button
                className='u-btn u-btn-grey-30'
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  handleEndSession();
                }}
              >
                No
              </button>
              <button className='u-btn u-btn-secondary-green' onClick={() => setShowEditor(true)}>
                Sí
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className='u-mb-2'>Describe los pendientes</h3>
            {isSavingTask ? (
              <div className='u-d-flex u-d-flex-justify-center u-mt-4'>
                <Loader />
              </div>
            ) : (
              <>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  <ReactQuill value={quillContent} onChange={setQuillContent} theme='snow' />
                </div>
                {!saveError ? (
                  <div className='u-d-flex u-d-flex-justify-center u-d-flex-gap-4 u-mt-4'>
                    <button
                      className='u-btn u-btn-grey-30'
                      onClick={() => {
                        setShowEditor(false);
                        setQuillContent('');
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className='u-btn u-btn-secondary-green'
                      onClick={ () => handlePending()}
                    >
                      Ok
                    </button>
                  </div>
                ) : (
                  <div className='u-d-flex u-d-flex-column u-d-flex-align-center u-mt-4'>
                    <p className='u-mb-2 u-text-center u-text-danger'>
                      Ocurrió un error al guardar la tarea. ¿Deseas reintentar?
                    </p>
                    <div className='u-d-flex u-d-flex-justify-center u-d-flex-gap-4'>
                      <button
                        className='u-btn u-btn-grey-30'
                        onClick={() => {
                          setShowEditor(false);
                          setQuillContent('');
                          setSaveError(false);
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        className='u-btn u-btn-secondary-green'
                        onClick={() => setSaveError(false)}
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default HomeWorkSession;
