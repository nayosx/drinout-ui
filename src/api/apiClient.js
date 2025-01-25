import axios from "axios";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");

    if (token && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        sessionStorage.removeItem("authToken");
        history.push("/");
      } else if (status >= 500) {
        console.error("Error del servidor:", error.response.data?.message || "Problema en el servidor");
      }
    } else {
      console.error("Error sin respuesta del servidor:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
