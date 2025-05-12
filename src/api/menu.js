import axiosInstance from './apiClient'

export const getRoleMenus = async () => {
  try {
    const response = await axiosInstance.get('/menus')
    return response.data
  } catch (error) {
    console.error('Error fetching role menus:', error)
    throw error
  }
}

export const getAllMenus = async () => {
  try {
    const response = await axiosInstance.get('/menus/all')
    return response.data
  } catch (error) {
    console.error('Error fetching all menus:', error)
    throw error
  }
}

export const getAllMenuRoles = async () => {
  try {
    const response = await axiosInstance.get('/menus/allwithroles')
    return response.data
  } catch (error) {
    console.error('Error fetching all menus with roles:', error)
    throw error
  }
}

export const getMenu = async (menuId) => {
  try {
    const response = await axiosInstance.get(`/menus/${menuId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching menu ${menuId}:`, error)
    throw error
  }
}

export const createMenu = async (menuData) => {
  try {
    const response = await axiosInstance.post(
      '/menus',
      menuData,
      { headers: { 'Content-Type': 'application/json' } }
    )
    return response.data
  } catch (error) {
    console.error('Error creating menu:', error)
    throw error
  }
}

export const updateMenu = async (menuId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/menus/${menuId}`,
      updateData,
      { headers: { 'Content-Type': 'application/json' } }
    )
    return response.data
  } catch (error) {
    console.error(`Error updating menu ${menuId}:`, error)
    throw error
  }
}

export const deleteMenu = async (menuId) => {
  try {
    const response = await axiosInstance.delete(`/menus/${menuId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting menu ${menuId}:`, error)
    throw error
  }
}

export const assignMenuToRole = async (menuId, roleId) => {
  const { data } = await axiosInstance.post(
    `/menus/${menuId}/roles`,
    { role_id: roleId }
  )
  return data
}

export const removeMenuFromRole = async (menuId, roleId) => {
  const { data } = await axiosInstance.delete(
    `/menus/${menuId}/roles/${roleId}`
  )
  return data
}
