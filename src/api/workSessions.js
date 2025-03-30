import axiosInstance from './apiClient';

export const getWorkSessions = async (userId = null) => {
  try {
    const params = userId ? { user_id: userId } : {};
    const response = await axiosInstance.get('/work_sessions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching work sessions:', error);
    throw error;
  }
};

export const getWorkSessionLastest = async () => {
  try {
    const response = await axiosInstance.get('/work_sessions/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching work sessions:', error);
    throw error;
  }
};

export const startWorkSession = async () => {
  try {
    const response = await axiosInstance.post('/work_sessions/start');
    return response.data;
  } catch (error) {
    console.error('Error starting work session:', error);
    throw error;
  }
};

export const endWorkSession = async () => {
  try {
    const response = await axiosInstance.post('/work_sessions/end');
    return response.data;
  } catch (error) {
    console.error('Error ending work session:', error);
    throw error;
  }
};

  

export const forceEndWorkSession = async (userId, comments) => {
  try {
    const response = await axiosInstance.post('/work_sessions/force_end', {
      user_id: userId,
      comments: comments
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error forcing end of work session:', error);
    throw error;
  }
};


export const getWorkSessionsReport = async (startDate, endDate, downloadCsv = false) => {
  try {
    const params = {
      start_date: startDate,
      end_date: endDate,
      download_csv: downloadCsv
    };

    const response = await axiosInstance.get('/work_sessions/report', {
      params,
      responseType: downloadCsv ? 'blob' : 'json'
    });

    if (downloadCsv) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${startDate}_a_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    }

    return response.data;

  } catch (error) {
    console.error('Error fetching work sessions report:', error);
    throw error;
  }
};
