const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const getLocalAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getLocalRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const setAuthTokens = ({ access, refresh }) => {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

const updateAccessToken = (access) => {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
};

const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const authService = {
  getLocalAccessToken,
  getLocalRefreshToken,
  setAuthTokens,
  updateAccessToken,
  clearAuthTokens
};

export default authService;
