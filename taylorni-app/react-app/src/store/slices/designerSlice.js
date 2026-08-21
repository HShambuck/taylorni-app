// src/store/slices/designerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signup } from "./authSlice";

const designerSlice = createSlice({
  name: "designers",
  initialState: { designers: [] },
  reducers: {
    hydrateDesigners: (state, action) => {
      state.designers = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchDesigners: () => {},
    addDesigner: (state, action) => {
      const newDesigner = {
        id: Date.now().toString(),
        ...action.payload,
        userType: "designer",
        createdAt: new Date().toISOString(),
      };
      state.designers.push(newDesigner);
    },
    updateDesigner: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.designers.findIndex((designer) => designer.id === id);
      if (index !== -1) {
        state.designers[index] = { ...state.designers[index], ...updates };
      }
    },
    deleteDesigner: (state, action) => {
      state.designers = state.designers.filter(
        (designer) => designer.id !== action.payload
      );
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
      }
    });
  },
});

export const {
  hydrateDesigners,
  fetchDesigners,
  addDesigner,
  updateDesigner,
  deleteDesigner,
} = designerSlice.actions;

export const selectAllDesigners = (state) => state.designers.designers;
export const selectDesignerByEmail = (email) => (state) =>
  state.designers.designers.find((designer) => designer.email === email);
export const selectDesignerById = (id) => (state) =>
  state.designers.designers.find((designer) => designer.id === id);

export default designerSlice.reducer;