// src/store/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "cart";
const GUEST_CART_KEY = "guestCart";

const getInitialState = () => {
  const savedCart = localStorage.getItem(CART_KEY);
  const guestCart = localStorage.getItem(GUEST_CART_KEY);

  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    }
  } else if (guestCart) {
    try {
      return JSON.parse(guestCart);
    } catch (e) {
      console.error("Failed to parse guest cart from localStorage", e);
    }
  }

  return {
    items: [],
    total: 0,
  };
};

const saveToLocalStorage = (state) => {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify({ items: state.items, total: state.total })
  );
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    initializeCart: (state) => {
      const savedCart = localStorage.getItem(CART_KEY);
      const guestCart = localStorage.getItem(GUEST_CART_KEY);

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          state.items = parsedCart.items || [];
          state.total = parsedCart.total || 0;
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      } else if (guestCart) {
        try {
          const parsedGuestCart = JSON.parse(guestCart);
          state.items = parsedGuestCart.items || [];
          state.total = parsedGuestCart.total || 0;
        } catch (e) {
          console.error("Failed to parse guest cart from localStorage", e);
        }
      }
    },
    transferGuestCart: (state) => {
      const guestCart = localStorage.getItem(GUEST_CART_KEY);

      if (guestCart) {
        try {
          const parsedGuestCart = JSON.parse(guestCart);
          state.items = [...state.items, ...(parsedGuestCart.items || [])];
          state.total = calculateTotal(state.items);

          saveToLocalStorage(state);
          localStorage.removeItem(GUEST_CART_KEY);
        } catch (e) {
          console.error("Failed to transfer guest cart", e);
        }
      }
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
      saveToLocalStorage(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      saveToLocalStorage(state);
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
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem(CART_KEY);
    },
  },
});

export const {
  initializeCart,
  transferGuestCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;