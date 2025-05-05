import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { getAllTasks } from '../../api/task';
import Loader from '../../components/Loader';
import { changeDateFormat } from '../../utils/date.util';
import './Home.scss';

const HomeTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='container u-mt-4 u-mb-8'>
      <h2 className='u-mb-4'>Pendientes Registrados</h2>

      {loading ? (
        <div className='u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
          <Loader />
        </div>
      ) : tasks.length ? (
        tasks.map((task) => (
          <div key={task.id} className='u-card u-card--shadow-sm u-bg-white u-mb-2'>
            <div className='u-mb-1'>
              <strong>Usuario:</strong> {task.user_name}
            </div>
            <div className='u-mb-1'>
              <strong>Descripción:</strong>
              <div
                className='u-mt-1 format-pendings'
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }}
              />
            </div>
            <div className='u-text-muted u-text-right u-text-grey-60'>
              <small>Creado: { changeDateFormat(task.created_at)}</small>
            </div>
          </div>
        ))
      ) : (
        <p>No hay tareas registradas.</p>
      )}
    </div>
  );
};

export default HomeTask;
