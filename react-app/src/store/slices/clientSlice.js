// src/store/slices/clientSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signup } from "./authSlice";

const CLIENTS_KEY = "clients";

const getInitialState = () => {
  const savedClients = localStorage.getItem(CLIENTS_KEY);
  if (savedClients) {
    try {
      return { clients: JSON.parse(savedClients) };
    } catch (e) {
      console.error("Failed to parse clients from localStorage", e);
    }
  }
  return { clients: [] };
};

const clientSlice = createSlice({
  name: "clients",
  initialState: getInitialState(),
  reducers: {
    fetchClients: (state) => {
      const savedClients = localStorage.getItem(CLIENTS_KEY);
      if (savedClients) {
        try {
          state.clients = JSON.parse(savedClients);
        } catch (e) {
          console.error("Failed to parse clients from localStorage", e);
        }
      }
    },
    addClient: (state, action) => {
      const newClient = {
        id: Date.now().toString(),
        ...action.payload,
        userType: "client",
        createdAt: new Date().toISOString(),
      };
      state.clients.push(newClient);
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(state.clients));
    },
    updateClient: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.clients.findIndex((client) => client.id === id);
      if (index !== -1) {
        state.clients[index] = { ...state.clients[index], ...updates };
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(state.clients));
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(
        (client) => client.id !== action.payload
      );
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(state.clients));
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
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(state.clients));
      }
    });
  },
});

export const { fetchClients, addClient, updateClient, deleteClient } =
  clientSlice.actions;

// Selectors
export const selectAllClients = (state) => state.clients.clients;
export const selectClientByEmail = (email) => (state) =>
  state.clients.clients.find((client) => client.email === email);
export const selectClientById = (id) => (state) =>
  state.clients.clients.find((client) => client.id === id);

export default clientSlice.reducer;