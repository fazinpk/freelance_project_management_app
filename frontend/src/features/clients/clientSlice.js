import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "../../services/clientService";

const initialState = {
  clients: [],
  total: 0,
  limit: 5,
  offset: 0,
  search: "",
  ordering: "name",
  fetchStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  error: null,
};

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async ({ limit, offset, search, ordering }, { rejectWithValue }) => {
    try {
      const data = await clientService.getClients({
        limit,
        offset,
        search,
        ordering,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await clientService.createClient(clientData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, clientData }, { rejectWithValue }) => {
    try {
      const data = await clientService.updateClient({ id, clientData });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setOrdering(state, action) {
      state.ordering = action.payload;
    },
    setOffset(state, action) {
      state.offset = action.payload;
    },
    resetCreateStatus(state) {
      state.createStatus = "idle";
      state.error = null;
    },
    resetUpdateStatus(state) {
      state.updateStatus = "idle";
      state.error = null;
    },
    resetDeleteStatus(state) {
      state.deleteStatus = "idle";
      state.error = null;
    },
    resetClientState(state) {
      state.clients = [];
      state.total = 0;
      state.offset = 0;
      state.search = "";
      state.ordering = "name";
      state.fetchStatus = "idle";
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.clients = action.payload.results || [];
        state.total = action.payload.count || 0;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(createClient.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.clients.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateClient.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.clients.findIndex(
          (client) => client.id === action.payload.id,
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteClient.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.clients = state.clients.filter(
          (client) => client.id !== action.payload,
        );
        state.total -= 1;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setSearch,
  setOrdering,
  setOffset,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  resetClientState,
} = clientSlice.actions;
export default clientSlice.reducer;
