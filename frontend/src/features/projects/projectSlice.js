import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

const initialState = {
  projects: [],
  total: 0,
  limit: 5,
  offset: 0,
  search: '',
  ordering: 'title',
  selectedClient: '',
  fetchStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ limit, offset, search, ordering, client }, { rejectWithValue }) => {
    try {
      const data = await projectService.getProjects({ limit, offset, search, ordering, client });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const data = await projectService.createProject(projectData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const data = await projectService.updateProject({ id, projectData });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setClientFilter(state, action) {
      state.selectedClient = action.payload;
    },
    setOffset(state, action) {
      state.offset = action.payload;
    },
    resetCreateStatus(state) {
      state.createStatus = 'idle';
      state.error = null;
    },
    resetUpdateStatus(state) {
      state.updateStatus = 'idle';
      state.error = null;
    },
    resetDeleteStatus(state) {
      state.deleteStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.projects = action.payload.results || [];
        state.total = action.payload.count || 0;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createProject.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.projects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProject.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.projects.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.projects = state.projects.filter((project) => project.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setSearch, setClientFilter, setOffset, resetCreateStatus, resetUpdateStatus, resetDeleteStatus } =
  projectSlice.actions;

export default projectSlice.reducer;
