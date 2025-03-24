import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useClientStore } from "./clientStore";
import { useDesignerStore } from "./designerStore";

const USERS_KEY = "users";
const USER_STATE_KEY = "userState";

export const useUserStore = defineStore("user", () => {
  // State
  const userType = ref(null);
  const userInfo = ref(null);
  const isAuthenticated = ref(false);

  // Actions
  const initializeStore = () => {
    // Get clients and designers from their respective stores
    const clientStore = useClientStore();
    const designerStore = useDesignerStore();

    const clients = clientStore.getClientsForAuth();
    const designers = designerStore.getDesignersForAuth();

    // Merge users for authentication
    const initialUsers = [...clients, ...designers];

    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }

    const savedState = localStorage.getItem(USER_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        userType.value = parsedState.userType;
        userInfo.value = parsedState.userInfo;
        isAuthenticated.value = parsedState.isAuthenticated;
      } catch (e) {
        console.error("⚠️ Failed to parse user state from localStorage", e);
      }
    }
  };

  // SIGNUP: Register user and save to localStorage
  const signup = async (userDetails) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const userExists = users.find(
          (user) => user.email === userDetails.email
        );

        if (userExists) {
          reject("⚠️ User with this email already exists!");
        } else {
          // Add user to the appropriate store based on userType
          if (userDetails.userType === "client") {
            const clientStore = useClientStore();
            clientStore.addClient(userDetails);
          } else if (userDetails.userType === "designer") {
            const designerStore = useDesignerStore();
            designerStore.addDesigner(userDetails);
          }

          // Update auth users in localStorage
          users.push(userDetails);
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          resolve("✅ Signup successful! Please log in.");
        }
      } catch (error) {
        console.error("Signup error:", error);
        reject("❌ Failed to sign up. Please try again.");
      }
    });
  };

  // LOGIN: Authenticate user and update store
  const login = async (credentials) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Debugging: Log the user object
          console.log("User found:", user);

          // Update store
          userType.value = user.userType || "client"; // Default to client if undefined
          userInfo.value = {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${user.firstName} ${user.lastName}`
            )}&background=4C1D95&color=FFFFFF`, // Purple-900 background and white text
          };
          isAuthenticated.value = true;

          // Save session to localStorage
          localStorage.setItem(
            USER_STATE_KEY,
            JSON.stringify({
              userType: userType.value,
              userInfo: userInfo.value,
              isAuthenticated: isAuthenticated.value,
            })
          );

          resolve("✅ Login successful!");
        } else {
          reject("⚠️ Invalid email or password!");
        }
      } catch (error) {
        console.error("Login error:", error);
        reject("❌ Failed to log in. Please try again.");
      }
    });
  };

  // LOGOUT: Clear user session
  const logout = () => {
    userType.value = null;
    userInfo.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem(USER_STATE_KEY);
  };

  // Return state and methods
  return {
    // State as refs
    userType,
    userInfo,
    isAuthenticated,

    // Computed
    isClient: computed(() => userType.value === "client"),
    isDesigner: computed(() => userType.value === "designer"),

    // Actions
    initializeStore,
    signup,
    login,
    logout,
  };
});
