import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://be.vietkitchen.shop/', 
  timeout: 10000, // Timeout 10 giây
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