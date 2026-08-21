import { createAsyncThunk } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "./storageKeys";
import { getStoredJSON } from "./storage";
import { hydrateAuth } from "./slices/authSlice";
import { hydrateCart } from "./slices/cartSlice";
import { hydrateClients } from "./slices/clientSlice";
import { hydrateDesigners } from "./slices/designerSlice";

export const hydrateAppData = createAsyncThunk(
  "app/hydrate",
  async (_, { dispatch }) => {
    const [auth, cart, guestCart, clients, designers] = await Promise.all([
      getStoredJSON(STORAGE_KEYS.AUTH, null),
      getStoredJSON(STORAGE_KEYS.CART, null),
      getStoredJSON(STORAGE_KEYS.GUEST_CART, null),
      getStoredJSON(STORAGE_KEYS.CLIENTS, []),
      getStoredJSON(STORAGE_KEYS.DESIGNERS, []),
    ]);

    if (auth) {
      dispatch(hydrateAuth(auth));
    }

    if (cart || guestCart) {
      dispatch(hydrateCart(cart || guestCart));
    }

    dispatch(hydrateClients(clients));
    dispatch(hydrateDesigners(designers));
    return true;
  }
);
