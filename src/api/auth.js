import axiosInstance from './apiClient';

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    const { access_token } = response.data;

    if (access_token) {
      sessionStorage.setItem('authToken', access_token);
    }

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem('authToken');
  window.location.href = '/login';
};
