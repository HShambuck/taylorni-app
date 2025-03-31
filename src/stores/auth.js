import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useClientStore } from "./clientStore";
import { useDesignerStore } from "./designerStore";
import { useCartStore } from "./cartStore";

const USERS_KEY = "users";
const USER_STATE_KEY = "userState";

export const useUserStore = defineStore("user", () => {
  // State
  const userType = ref(null);
  const userInfo = ref(null);
  const isAuthenticated = ref(false);

  // Actions
  const initializeStore = () => {
    // Restore session if available
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

    // Initialize client and designer stores
    const clientStore = useClientStore();
    const designerStore = useDesignerStore();

    // Only fetch data if not already loaded
    if (!clientStore.clients.length) {
      clientStore.fetchClients();
    }

    if (!designerStore.designers.length) {
      designerStore.fetchDesigners();
    }
  };

  // SIGNUP: Register user and save to appropriate store
  const signup = async (userDetails) => {
    return new Promise((resolve, reject) => {
      try {
        const clientStore = useClientStore();
        const designerStore = useDesignerStore();

        // Check if email already exists in either store
        const clientWithEmail = clientStore.getClientByEmail(userDetails.email);
        const designerWithEmail = designerStore.getDesignerByEmail(
          userDetails.email
        );

        if (clientWithEmail || designerWithEmail) {
          reject("⚠️ User with this email already exists!");
          return;
        }

        // Add the user to the appropriate store based on userType
        if (userDetails.userType === "client") {
          clientStore.addClient(userDetails);
        } else if (userDetails.userType === "designer") {
          designerStore.addDesigner(userDetails);
        } else {
          reject("❌ Invalid user type specified!");
          return;
        }

        resolve("✅ Signup successful! Please log in.");
      } catch (error) {
        console.error("Signup error:", error);
        reject("❌ Failed to sign up. Please try again.");
      }
    });
  };

  // LOGIN: Authenticate user using both client and designer stores
  const login = async (credentials) => {
    return new Promise((resolve, reject) => {
      try {
        const clientStore = useClientStore();
        const designerStore = useDesignerStore();
        const cartStore = useCartStore();

        // Check for user in client store first
        const client = clientStore.getClientByEmail(credentials.email);

        // Then check designer store if not found
        const designer = !client
          ? designerStore.getDesignerByEmail(credentials.email)
          : null;

        const user = client || designer;

        // Verify credentials and authenticate
        if (user && user.password === credentials.password) {
          // Update store with user information
          userType.value = user.userType;
          userInfo.value = {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${user.firstName} ${user.lastName}`
            )}&background=4C1D95&color=FFFFFF`,
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

          // Transfer cart items from guest to user
          cartStore.transferGuestCart();

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

    // Reinitialize cart for guest
    const cartStore = useCartStore();
    cartStore.initializeCart();
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
