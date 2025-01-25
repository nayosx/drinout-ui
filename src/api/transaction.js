import axiosInstance from './apiClient';


export const getTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment types:', error);
      throw error;
    }
};

export const createTransaction = async (transactionData) => {
    try {
      const response = await axiosInstance.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
      const response = await axiosInstance.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
};

export const deleteTransaction = async (id) => {
    try {
      await axiosInstance.delete(`/transactions/${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
};
  