import axiosInstance from './apiClient'

export const getAllTransactionCategories = async () => {
  try {
    const response = await axiosInstance.get('/transaction-categories')
    return response.data
  } catch (error) {
    console.error('Error fetching transaction categories:', error)
    throw error
  }
}

export const getTransactionCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/transaction-categories/${categoryId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching transaction category ${categoryId}:`, error)
    throw error
  }
}

export const createTransactionCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/transaction-categories', categoryData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating transaction category:', error)
    throw error
  }
}

export const updateTransactionCategory = async (categoryId, updateData) => {
  try {
    const response = await axiosInstance.put(`/transaction-categories/${categoryId}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error updating transaction category ${categoryId}:`, error)
    throw error
  }
}

export const deleteTransactionCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/transaction-categories/${categoryId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting transaction category ${categoryId}:`, error)
    throw error
  }
}
