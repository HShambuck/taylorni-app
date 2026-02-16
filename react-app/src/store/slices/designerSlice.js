// src/store/slices/designerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signup } from "./authSlice";

const DESIGNERS_KEY = "designers";

const getInitialState = () => {
  const savedDesigners = localStorage.getItem(DESIGNERS_KEY);
  if (savedDesigners) {
    try {
      return { designers: JSON.parse(savedDesigners) };
    } catch (e) {
      console.error("Failed to parse designers from localStorage", e);
    }
  }
  return { designers: [] };
};

const designerSlice = createSlice({
  name: "designers",
  initialState: getInitialState(),
  reducers: {
    fetchDesigners: (state) => {
      const savedDesigners = localStorage.getItem(DESIGNERS_KEY);
      if (savedDesigners) {
        try {
          state.designers = JSON.parse(savedDesigners);
        } catch (e) {
          console.error("Failed to parse designers from localStorage", e);
        }
      }
    },
    addDesigner: (state, action) => {
      const newDesigner = {
        id: Date.now().toString(),
        ...action.payload,
        userType: "designer",
        createdAt: new Date().toISOString(),
      };
      state.designers.push(newDesigner);
      localStorage.setItem(DESIGNERS_KEY, JSON.stringify(state.designers));
    },
    updateDesigner: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.designers.findIndex((designer) => designer.id === id);
      if (index !== -1) {
        state.designers[index] = { ...state.designers[index], ...updates };
        localStorage.setItem(DESIGNERS_KEY, JSON.stringify(state.designers));
      }
    },
    deleteDesigner: (state, action) => {
      state.designers = state.designers.filter(
        (designer) => designer.id !== action.payload
      );
      localStorage.setItem(DESIGNERS_KEY, JSON.stringify(state.designers));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      const { userDetails } = action.payload;
      if (userDetails.userType === "designer") {
        const newDesigner = {
          id: Date.now().toString(),
          ...userDetails,
          userType: "designer",
          createdAt: new Date().toISOString(),
        };
        state.designers.push(newDesigner);
        localStorage.setItem(DESIGNERS_KEY, JSON.stringify(state.designers));
      }
    });
  },
});

export const { fetchDesigners, addDesigner, updateDesigner, deleteDesigner } =
  designerSlice.actions;

// Selectors
export const selectAllDesigners = (state) => state.designers.designers;
export const selectDesignerByEmail = (email) => (state) =>
  state.designers.designers.find((designer) => designer.email === email);
export const selectDesignerById = (id) => (state) =>
  state.designers.designers.find((designer) => designer.id === id);

export default designerSlice.reducer;