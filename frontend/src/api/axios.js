import axios from 'axios';
import authService from '../services/authService';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const refreshEndpoint = '/auth/token/refresh/';

export const axiosPublic = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const axiosPrivate = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setupInterceptors = (store) => {
  axiosPrivate.interceptors.request.use(
    (config) => {
      const accessToken = authService.getLocalAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes(refreshEndpoint)
      ) {
        originalRequest._retry = true;

        const refreshToken = authService.getLocalRefreshToken();

        if (!refreshToken) {
          return Promise.reject(error);
        }

        try {
          const response = await axiosPublic.post(refreshEndpoint, {
            refresh: refreshToken
          });

          const { access } = response.data;
          authService.updateAccessToken(access);
          store.dispatch({
            type: 'auth/setAccessToken',
            payload: access
          });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }

          return axiosPrivate(originalRequest);
        } catch (refreshError) {
          store.dispatch({ type: 'auth/logout' });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
