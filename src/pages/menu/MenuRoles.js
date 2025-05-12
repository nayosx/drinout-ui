import React, { useEffect, useState } from 'react';
import { getAllRoles } from '../../api/role';
import { getAllMenuRoles, assignMenuToRole, removeMenuFromRole } from '../../api/menu';
import Toggle from '../../components/Toggle';

export const HomeMenuRoles = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRolesAndMenus = async () => {
      try {
        const [fetchedRoles, fetchedMenus] = await Promise.all([
          getAllRoles(),
          getAllMenuRoles()
        ]);
        setRoles(fetchedRoles);
        setMenus(fetchedMenus);
      } catch (error) {
        console.error('Error fetching roles or menus:', error);
      }
    };

    fetchRolesAndMenus();
  }, []);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleToggle = async (menuId, state) => {
    if (!selectedRole) return;
    try {
      setLoading(true);
      if (state) {
        await assignMenuToRole(menuId, selectedRole);
      } else {
        await removeMenuFromRole(menuId, selectedRole);
      }

      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId
            ? {
                ...menu,
                roles: state
                  ? [...menu.roles, Number(selectedRole)]
                  : menu.roles.filter((roleId) => roleId !== Number(selectedRole))
              }
            : menu
        )
      );
    } catch (error) {
      console.error('Error updating menu roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container u-mt-4 u-mb-8'>
      <div className='row'>
        <div className='col-12'>
          <h1>Menus Roles</h1>
        </div>
      </div>

      <div className='row u-mb-4'>
        <div className='col-6'>
          <label htmlFor='role-select'>Seleccionar Rol:</label>
          <select id='role-select' value={selectedRole} onChange={handleRoleChange} className='form-control'>
            <option value=''>-- Seleccione un rol --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedRole ? (
        <div className='row'>
          <div className='col-12'>
            <p>Seleccione un rol para continuar.</p>
          </div>
        </div>
      ) : (
        <div className='row'>
          <div className='col-12'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Path</th>
                  <th>Show</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id}>
                    <td>{menu.label}</td>
                    <td>{menu.path}</td>
                    <td>
                      <Toggle
                        initial={menu.roles.includes(Number(selectedRole))}
                        onToggle={(state) => handleToggle(menu.id, state)}
                        disabled={loading}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};