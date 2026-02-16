// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import clientReducer from "./slices/clientSlice";
import designerReducer from "./slices/designerSlice";
import cartReducer from "./slices/cartSlice";

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
    }),
});

export default store;