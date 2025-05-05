import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader'
import Toggle from '../../components/Toggle'
import Modal from '../../components/Modal'
import { Status } from '../../utils/status.util'
import { getAllMenus, createMenu, assignMenuToRole, removeMenuFromRole } from '../../api/menu'
import { getAllRoles } from '../../api/role'

export const HomeMenu = () => {
    const [statusMenus, setStatusMenus] = useState(Status.INITIAL)
    const [menus, setMenus] = useState([])
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newMenu, setNewMenu] = useState({ label: '', path: '', show_in_sidebar: true, order: 0 })

    const fetchData = () => {
        setStatusMenus(Status.LOADING)
        Promise.all([getAllMenus(), getAllRoles()])
            .then(([menusData, rolesData]) => {
                setMenus(menusData)
                setRoles(rolesData)
                setStatusMenus(Status.SUCCESS)
            })
            .catch(() => {
                setStatusMenus(Status.ERROR)
            })
    }

    useEffect(() => { fetchData() }, [])

    const handleOpenModal = () => {
        setNewMenu({ label: '', path: '', show_in_sidebar: true, order: 0 })
        setIsModalOpen(true)
    }
    const handleCloseModal = () => setIsModalOpen(false)

    const handleCreateMenu = async () => {
        try {
            const created = await createMenu({ ...newMenu })
            handleCloseModal()
            if (selectedRole) {
                await assignMenuToRole(created.id, selectedRole)
            }
            fetchData()
        } catch (err) {
            console.error('Error creating menu:', err)
            alert('Error al crear el menú')
        }
    }

    const handleToggle = async (menuId, state) => {
        try {
            if (state) {
                await assignMenuToRole(menuId, selectedRole)
            } else {
                await removeMenuFromRole(menuId, selectedRole)
            }
            fetchData()
        } catch (err) {
            console.error('Error updating menu assignment:', err)
            alert('Error al actualizar asignación')
        }
    }

    if (statusMenus === Status.ERROR) {
        return (
            <div className='container u-mt-4 u-mb-8'>
                <div className='row'>
                    <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
                        <h1>Error al cargar los menus</h1>
                    </div>
                </div>
            </div>
        )
    }

    if (statusMenus === Status.LOADING) {
        return (
            <div className='container u-mt-4 u-mb-8'>
                <div className='row'>
                    <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
                        <Loader />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='container u-mt-4 u-mb-8'>
            <div className='row'>
                <div className='col-12 col-md-10 u-d-flex u-d-flex-justify-start u-d-flex-align-center'>
                    <h2>Menus por roles</h2>
                </div>
            </div>
            <div className='row u-mt-4'>
                <div className='col-4 u-text-left'>
                    <div className="form-group">
                        <label htmlFor="role-select">Seleccione un rol:</label>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={e => setSelectedRole(e.target.value)}
                            className="form-control"
                        >
                            <option value="">-- Seleccione un rol --</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='col-8 u-text-right'>
                    <button
                        className='u-btn u-btn-secondary u-mb-2 u-ml-auto'
                        onClick={handleOpenModal}
                    >
                        Crear Menu
                    </button>
                </div>

                <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
                    {selectedRole && (
                        <table className="table u-mb-4">
                            <thead>
                                <tr>
                                    <th>Label</th>
                                    <th>Path</th>
                                    <th>Show</th>
                                    <th>Order</th>
                                    <th>Actions</th>
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
                                                onToggle={state => handleToggle(menu.id, state)}
                                            />
                                        </td>
                                        <td>{menu.order}</td>
                                        <td>
                                            <button className="u-btn u-btn--small u-btn-primary u-mr-2">Editar</button>
                                            <button className="u-btn u-btn--small u-btn-danger">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} showCloseButton={false}>
                <h3 className='u-mb-1'>Crear Nuevo Menú</h3>
                <input
                    className='u-w-100 u-mb-2'
                    type='text'
                    placeholder='Label'
                    value={newMenu.label}
                    onChange={e => setNewMenu({ ...newMenu, label: e.target.value })}
                />
                <input
                    className='u-w-100 u-mb-2'
                    type='text'
                    placeholder='Path'
                    value={newMenu.path}
                    onChange={e => setNewMenu({ ...newMenu, path: e.target.value })}
                />
                <div className='u-mb-2'>
                    <label>
                        <input
                            type='checkbox'
                            checked={newMenu.show_in_sidebar}
                            onChange={e => setNewMenu({ ...newMenu, show_in_sidebar: e.target.checked })}
                        /> Mostrar en Sidebar
                    </label>
                </div>
                <input
                    className='u-w-100 u-mb-2'
                    type='number'
                    placeholder='Order'
                    value={newMenu.order}
                    onChange={e => setNewMenu({ ...newMenu, order: Number(e.target.value) })}
                />
                <div className='u-d-flex u-d-flex-justify-center u-d-flex-gap-2'>
                    <button className='u-btn u-btn-grey-30' onClick={handleCloseModal}>
                        Cancelar
                    </button>
                    <button className='u-btn u-btn-secondary-green' onClick={handleCreateMenu}>
                        Crear
                    </button>
                </div>
            </Modal>
        </div>
    )
}
