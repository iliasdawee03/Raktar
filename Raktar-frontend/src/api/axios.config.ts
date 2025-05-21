import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7035',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor a token hozzáadásához
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor a hibák kezelésére
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            // Ha lejárt a token vagy nincs megfelelő jogosultság
            console.error('Authorization error:', error);
            // Opcionális: átirányítás a login oldalra
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;