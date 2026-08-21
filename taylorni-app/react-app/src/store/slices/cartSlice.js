// src/store/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    hydrateCart: (state, action) => {
      if (!action.payload) {
        return;
      }
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
    },
    initializeCart: () => {},
    transferGuestCart: (state) => {
      state.total = calculateTotal(state.items);
    },
    addItem: (state, action) => {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }

      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== itemId);
      } else {
        const index = state.items.findIndex((item) => item.id === itemId);
        if (index !== -1) {
          state.items[index].quantity = quantity;
        }
      }

      state.total = calculateTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const {
  hydrateCart,
  initializeCart,
  transferGuestCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;