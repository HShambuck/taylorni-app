// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const USER_STATE_KEY = "userState";

// Helper function to get initial state from localStorage
const getInitialState = () => {
  const savedState = localStorage.getItem(USER_STATE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error("⚠️ Failed to parse user state from localStorage", e);
    }
  }
  return {
    userType: null,
    userInfo: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Async thunks
export const initializeStore = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    // Dispatch actions to fetch clients and designers
    dispatch({ type: "clients/fetchClients" });
    dispatch({ type: "designers/fetchDesigners" });
    return null;
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (userDetails, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const { clients } = state.clients;
      const { designers } = state.designers;

      // Check if email already exists
      const clientWithEmail = clients.find(
        (c) => c.email === userDetails.email
      );
      const designerWithEmail = designers.find(
        (d) => d.email === userDetails.email
      );

      if (clientWithEmail || designerWithEmail) {
        return rejectWithValue("User with this email already exists!");
      }

      return { userDetails };
    } catch (error) {
      return rejectWithValue("Failed to sign up. Please try again.");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const { clients } = state.clients;
      const { designers } = state.designers;

      // Check for user in client store first
      const client = clients.find((c) => c.email === credentials.email);

      // Then check designer store if not found
      const designer = !client
        ? designers.find((d) => d.email === credentials.email)
        : null;

      const user = client || designer;

      if (!user) {
        return rejectWithValue("No account found with this email!");
      }

      // Verify credentials
      if (user.password === credentials.password) {
        const userState = {
          userType: user.userType,
          userInfo: {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${user.firstName} ${user.lastName}`
            )}&background=4C1D95&color=FFFFFF`,
            phone: user.phone || null,
            address: user.address || null,
            // Include designer-specific fields if applicable
            ...(user.userType === "designer" && {
              shopName: user.shopName,
              bio: user.bio,
              specialties: user.specialties,
            }),
          },
          isAuthenticated: true,
        };

        // Save to localStorage
        localStorage.setItem(USER_STATE_KEY, JSON.stringify(userState));

        // Transfer cart items from guest to user
        dispatch({ type: "cart/transferGuestCart" });

        return userState;
      } else {
        return rejectWithValue("Invalid password!");
      }
    } catch (error) {
      return rejectWithValue("Failed to log in. Please try again.");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const { userInfo, userType } = state.auth;

      const updatedInfo = {
        ...userInfo,
        ...profileData,
        fullName: `${profileData.firstName || userInfo.firstName} ${
          profileData.lastName || userInfo.lastName
        }`,
      };

      // Update in respective store
      if (userType === "client") {
        dispatch({
          type: "clients/updateClient",
          payload: { id: userInfo.id, updates: profileData },
        });
      } else if (userType === "designer") {
        dispatch({
          type: "designers/updateDesigner",
          payload: { id: userInfo.id, updates: profileData },
        });
      }

      return updatedInfo;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (avatarUrl, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { userInfo } = state.auth;

      return { ...userInfo, avatar: avatarUrl };
    } catch (error) {
      return rejectWithValue("Failed to update avatar");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { currentPassword, newPassword },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const { userInfo, userType } = state.auth;
      const { clients } = state.clients;
      const { designers } = state.designers;

      // Get user from respective store
      let user;
      if (userType === "client") {
        user = clients?.find((c) => c.email === userInfo.email);
      } else {
        user = designers?.find((d) => d.email === userInfo.email);
      }

      if (!user) {
        return rejectWithValue("User not found");
      }

      if (user.password !== currentPassword) {
        return rejectWithValue("Current password is incorrect");
      }

      // Update password in respective store
      if (userType === "client") {
        dispatch({
          type: "clients/updateClient",
          payload: { id: userInfo.id, updates: { password: newPassword } },
        });
      } else {
        dispatch({
          type: "designers/updateDesigner",
          payload: { id: userInfo.id, updates: { password: newPassword } },
        });
      }

      return { success: true };
    } catch (error) {
      return rejectWithValue("Failed to change password");
    }
  }
);

export const updateSocialLinks = createAsyncThunk(
  "auth/updateSocialLinks",
  async (socialLinks, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const { userInfo, userType } = state.auth;

      const updatedInfo = {
        ...userInfo,
        socialLinks,
      };

      // Update in respective store
      if (userType === "client") {
        dispatch({
          type: "clients/updateClient",
          payload: { id: userInfo.id, updates: { socialLinks } },
        });
      } else {
        dispatch({
          type: "designers/updateDesigner",
          payload: { id: userInfo.id, updates: { socialLinks } },
        });
      }

      return updatedInfo;
    } catch (error) {
      return rejectWithValue("Failed to update social links");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.userType = null;
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(USER_STATE_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize
      .addCase(initializeStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeStore.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeStore.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userType = action.payload.userType;
        state.userInfo = action.payload.userInfo;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        const newState = {
          userType: state.userType,
          userInfo: state.userInfo,
          isAuthenticated: state.isAuthenticated,
        };
        localStorage.setItem(USER_STATE_KEY, JSON.stringify(newState));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        const newState = {
          userType: state.userType,
          userInfo: state.userInfo,
          isAuthenticated: state.isAuthenticated,
        };
        localStorage.setItem(USER_STATE_KEY, JSON.stringify(newState));
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Social Links
      .addCase(updateSocialLinks.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        const newState = {
          userType: state.userType,
          userInfo: state.userInfo,
          isAuthenticated: state.isAuthenticated,
        };
        localStorage.setItem(USER_STATE_KEY, JSON.stringify(newState));
      });
  },
});

export const { logout, clearError, setError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserInfo = (state) => state.auth.userInfo;
export const selectUserType = (state) => state.auth.userType;
export const selectIsClient = (state) => state.auth.userType === "client";
export const selectIsDesigner = (state) => state.auth.userType === "designer";
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthInitialized = (state) => state.auth.initialized;

export default authSlice.reducer;