// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import clientReducer from "./slices/clientSlice";
import designerReducer from "./slices/designerSlice";
import cartReducer from "./slices/cartSlice";
import { setStoredJSON, removeStoredValue } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

const persistMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState();

  setStoredJSON(STORAGE_KEYS.CLIENTS, state.clients.clients);
  setStoredJSON(STORAGE_KEYS.DESIGNERS, state.designers.designers);
  setStoredJSON(STORAGE_KEYS.CART, {
    items: state.cart.items,
    total: state.cart.total,
  });

  if (state.auth.isAuthenticated && state.auth.userInfo) {
    setStoredJSON(STORAGE_KEYS.AUTH, {
      userType: state.auth.userType,
      userInfo: state.auth.userInfo,
      isAuthenticated: state.auth.isAuthenticated,
    });
  } else {
    removeStoredValue(STORAGE_KEYS.AUTH);
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    designers: designerReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/login", "auth/signup"],
      },
    }).concat(persistMiddleware),
});

export default store;
