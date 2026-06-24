import { axiosPublic, axiosPrivate } from './axios';

const AUTH_BASE = '/auth';

const login = async (credentials) => {
  const response = await axiosPublic.post(`${AUTH_BASE}/token/`, credentials);
  return response.data;
};

const refreshToken = async (payload) => {
  const response = await axiosPublic.post(`${AUTH_BASE}/token/refresh/`, payload);
  return response.data;
};

const register = async (payload) => {
  const response = await axiosPublic.post(`${AUTH_BASE}/register/`, payload);
  return response.data;
};

const getMe = async () => {
  const response = await axiosPrivate.get(`${AUTH_BASE}/me/`);
  return response.data;
};

const authApi = {
  login,
  refreshToken,
  register,
  getMe
};

export default authApi;
