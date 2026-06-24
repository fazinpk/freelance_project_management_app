import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

const initialState = {
  tasks: [],
  total: 0,
  limit: 5,
  offset: 0,
  search: '',
  status: '',
  priority: '',
  ordering: 'title',
  fetchStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  error: null
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ limit, offset, search, status, priority, ordering }, { rejectWithValue }) => {
    try {
      const data = await taskService.getTasks({ limit, offset, search, status, priority, ordering });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const data = await taskService.createTask(taskData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const data = await taskService.updateTask({ id, taskData });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setStatusFilter(state, action) {
      state.status = action.payload;
    },
    setPriorityFilter(state, action) {
      state.priority = action.payload;
    },
    setOrdering(state, action) {
      state.ordering = action.payload;
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.tasks = action.payload.results || [];
        state.total = action.payload.count || 0;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createTask.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateTask.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export const {
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setOrdering,
  setOffset,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus
} = taskSlice.actions;

export default taskSlice.reducer;
