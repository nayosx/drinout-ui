import axiosInstance from './apiClient';

export const getPaymentTypes = async () => {
  try {
    const response = await axiosInstance.get('/payment_types');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment types:', error);
    throw error;
  }
};
