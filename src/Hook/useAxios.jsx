import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';

// Create an axios instance with base settings
const axiosInstance = axios.create({
    baseURL: 'https://lenden-server-seven.vercel.app',
    withCredentials: true // This ensures cookies are sent with every request
});

const useAxios = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.interceptors.response.use(response => {
            return response;
        }, error => {
            console.log('api error', error.status)
            if (error.status === 401 || error.status === 403) {
                logout()
                    .then(() => {
                        navigate('/auth/login')
                    })
                    .catch(err => console.log(err))
            }
            return Promise.reject(error);
        })
    }, []);

    return axiosInstance;
};

export default useAxios;
