import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://be.vietkitchen.shop/', 
  baseURL: "http://localhost:8080",
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;