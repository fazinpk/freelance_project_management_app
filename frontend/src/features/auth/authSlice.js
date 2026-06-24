import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import authService from '../../services/authService';

const initialState = {
  user: null,
  accessToken: authService.getLocalAccessToken(),
  refreshToken: authService.getLocalRefreshToken(),
  status: 'idle',
  error: null
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const authResponse = await authApi.login(credentials);
      authService.setAuthTokens(authResponse);
      const user = await authApi.getMe();
      return {
        user,
        accessToken: authResponse.access,
        refreshToken: authResponse.refresh
      };
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data || error.message;
      return rejectWithValue(message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      return response;
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data || error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getMe();
      return user;
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data || error.message;
      return rejectWithValue(message);
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = authService.getLocalRefreshToken();
      if (!refresh) {
        throw new Error('Refresh token not available');
      }
      const response = await authApi.refreshToken({ refresh });
      authService.updateAccessToken(response.access);
      return response.access;
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data || error.message;
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      authService.clearAuthTokens();
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(registerAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        authService.clearAuthTokens();
      });
  }
});

export const { logout, setAccessToken, clearError } = authSlice.actions;
export default authSlice.reducer;
