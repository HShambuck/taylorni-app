// src/store/slices/clientSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signup } from "./authSlice";

const clientSlice = createSlice({
  name: "clients",
  initialState: { clients: [] },
  reducers: {
    hydrateClients: (state, action) => {
      state.clients = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchClients: () => {},
    addClient: (state, action) => {
      const newClient = {
        id: Date.now().toString(),
        ...action.payload,
        userType: "client",
        createdAt: new Date().toISOString(),
      };
      state.clients.push(newClient);
    },
    updateClient: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.clients.findIndex((client) => client.id === id);
      if (index !== -1) {
        state.clients[index] = { ...state.clients[index], ...updates };
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(
        (client) => client.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      const { userDetails } = action.payload;
      if (userDetails.userType === "client") {
        const newClient = {
          id: Date.now().toString(),
          ...userDetails,
          userType: "client",
          createdAt: new Date().toISOString(),
        };
        state.clients.push(newClient);
      }
    });
  },
});

export const {
  hydrateClients,
  fetchClients,
  addClient,
  updateClient,
  deleteClient,
} = clientSlice.actions;

export const selectAllClients = (state) => state.clients.clients;
export const selectClientByEmail = (email) => (state) =>
  state.clients.clients.find((client) => client.email === email);
export const selectClientById = (id) => (state) =>
  state.clients.clients.find((client) => client.id === id);

export default clientSlice.reducer;