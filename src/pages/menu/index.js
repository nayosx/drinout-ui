// src/pages/menu/index.js - Refactorizado para CRUD únicamente
import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Toggle from '../../components/Toggle';
import { Status } from '../../utils/status.util';
import { getAllMenus, createMenu, updateMenu } from '../../api/menu';

export const HomeMenu = () => {
  const [statusMenus, setStatusMenus] = useState(Status.INITIAL);
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMenu, setNewMenu] = useState({
    label: '',
    path: '',
    show_in_sidebar: true,
    order: 0,
  });

  // Cargar menús al montar el componente
  useEffect(() => {
    const loadMenus = async () => {
      setStatusMenus(Status.LOADING);
      try {
        const allMenus = await getAllMenus();
        setMenus(allMenus);
        setStatusMenus(Status.SUCCESS);
      } catch {
        setStatusMenus(Status.ERROR);
      }
    };
    loadMenus();
  }, []);

  const handleOpenModal = () => {
    setNewMenu({ label: '', path: '', show_in_sidebar: true, order: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateMenu = async () => {
    try {
      const created = await createMenu(newMenu);
      handleCloseModal();
      setMenus(prev => [...prev, created]);
    } catch {
      alert('Error al crear el menú');
    }
  };

  const handleToggle = async (menuId, state) => {
    try {
      await updateMenu(menuId, { show_in_sidebar: state });
      setMenus(prev => prev.map(menu => menu.id === menuId ? { ...menu, show_in_sidebar: state } : menu));
    } catch {
      alert('Error al actualizar el estado del menú');
    }
  };

  if (statusMenus === Status.ERROR) {
    return (
      <div className='container u-mt-4 u-mb-8'>
        <div className='row'>
          <div className='col-12'>
            <h1>Error al cargar los menús</h1>
          </div>
        </div>
      </div>
    );
  }

  if (statusMenus === Status.LOADING) {
    return (
      <div className='container u-mt-4 u-mb-8'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='container u-mt-4 u-mb-8'>
      <div className='row'>
        <div className='col-12'>
          <h2>Gestión de Menús</h2>
          <button className='u-btn u-btn-secondary' onClick={handleOpenModal}>Crear Menú</button>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <table className='table'>
            <thead>
              <tr>
                <th>Label</th>
                <th>Path</th>
                <th>Show</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {menus.map(menu => (
                <tr key={menu.id}>
                  <td>{menu.label}</td>
                  <td>{menu.path}</td>
                  <td>
                    <Toggle
                      initial={menu.show_in_sidebar}
                      onToggle={(state) => handleToggle(menu.id, state)}
                    />
                  </td>
                  <td>{menu.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3>Crear Nuevo Menú</h3>
        <input
          type='text'
          placeholder='Label'
          value={newMenu.label}
          onChange={e => setNewMenu({ ...newMenu, label: e.target.value })}
        />
        <input
          type='text'
          placeholder='Path'
          value={newMenu.path}
          onChange={e => setNewMenu({ ...newMenu, path: e.target.value })}
        />
        <div className='u-mb-2'>
          <Toggle
            initial={newMenu.show_in_sidebar}
            onToggle={(state) => setNewMenu({ ...newMenu, show_in_sidebar: state })}
            labels={{ on: 'Mostrar', off: 'Ocultar' }}
          />
        </div>
        <input
          type='number'
          placeholder='Order'
          value={newMenu.order}
          onChange={e => setNewMenu({ ...newMenu, order: Number(e.target.value) })}
        />
        <button onClick={handleCreateMenu}>Crear</button>
        <button onClick={handleCloseModal}>Cancelar</button>
      </Modal>
    </div>
  );
};
