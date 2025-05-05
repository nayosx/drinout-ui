import axiosInstance from './apiClient'

export const getAllRoles = async () => {
  try {
    const response = await axiosInstance.get('/roles')
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

export const getRole = async (roleId) => {
  try {
    const response = await axiosInstance.get(`/roles/${roleId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching role ${roleId}:`, error)
    throw error
  }
}

export const createRole = async (roleData) => {
  try {
    const response = await axiosInstance.post('/roles', roleData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

export const updateRole = async (roleId, updateData) => {
  try {
    const response = await axiosInstance.put(`/roles/${roleId}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error updating role ${roleId}:`, error)
    throw error
  }
}

export const deleteRole = async (roleId) => {
  try {
    const response = await axiosInstance.delete(`/roles/${roleId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting role ${roleId}:`, error)
    throw error
  }
}

export const getRoleUsers = async (roleId) => {
  try {
    const response = await axiosInstance.get(`/roles/${roleId}/users`)
    return response.data
  } catch (error) {
    console.error(`Error fetching users for role ${roleId}:`, error)
    throw error
  }
}
