import axios from 'axios';
import { tokenKeyName } from '../constants/const.ts';

const axiosInstance = axios.create({
    baseURL: "https://localhost:7035", 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(tokenKeyName);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error) 
);

export default axiosInstance;