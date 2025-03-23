import { defineStore } from "pinia";
import { ref } from "vue";

const USERS_KEY = "users";
const USER_STATE_KEY = "userState";

// Default Clients
const defaultClients = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    password: "password123",
    userType: "client",
    acceptTerms: true,
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    password: "password456",
    userType: "client",
    acceptTerms: true,
  },
  {
    id: 3,
    firstName: "Chloe",
    lastName: "Brown",
    email: "chloe@example.com",
    password: "password789",
    userType: "client",
    acceptTerms: true,
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Lee",
    email: "david@example.com",
    password: "password101",
    userType: "client",
    acceptTerms: true,
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Williams",
    email: "emma@example.com",
    password: "password202",
    userType: "client",
    acceptTerms: true,
  },
];

// Default Designers
const defaultDesigners = [
  {
    id: 1,
    firstName: "Zayn",
    lastName: "Malik",
    email: "zayn@example.com",
    password: "designer123",
    userType: "designer",
    acceptTerms: true,
  },
  {
    id: 2,
    firstName: "Liam",
    lastName: "Payne",
    email: "liam@example.com",
    password: "designer456",
    userType: "designer",
    acceptTerms: true,
  },
  {
    id: 3,
    firstName: "Noah",
    lastName: "Wilson",
    email: "noah@example.com",
    password: "designer789",
    userType: "designer",
    acceptTerms: true,
  },
  {
    id: 4,
    firstName: "Maya",
    lastName: "Adams",
    email: "maya@example.com",
    password: "designer101",
    userType: "designer",
    acceptTerms: true,
  },
  {
    id: 5,
    firstName: "Olivia",
    lastName: "Taylor",
    email: "olivia@example.com",
    password: "designer202",
    userType: "designer",
    acceptTerms: true,
  },
];

// Merge Default Users
const initialUsers = [...defaultClients, ...defaultDesigners];

export const useUserStore = defineStore("user", {
  state: () => ({
    userType: null,
    userInfo: null,
    isAuthenticated: false,
  }),

  actions: {
    // Initialize Store with Default Users
    initializeStore() {
      if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      }
      const savedState = localStorage.getItem(USER_STATE_KEY);
      if (savedState) {
        try {
          const { userType, userInfo, isAuthenticated } =
            JSON.parse(savedState);
          this.userType = userType;
          this.userInfo = userInfo;
          this.isAuthenticated = isAuthenticated;
        } catch (e) {
          console.error("⚠️ Failed to parse user state from localStorage", e);
        }
      }
    },

    // SIGNUP: Register user and save to localStorage
    async signup(userDetails) {
      return new Promise((resolve, reject) => {
        try {
          const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
          const userExists = users.find(
            (user) => user.email === userDetails.email
          );

          if (userExists) {
            reject("⚠️ User with this email already exists!");
          } else {
            users.push(userDetails);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            resolve("✅ Signup successful! Please log in.");
          }
        } catch (error) {
          reject("❌ Failed to sign up. Please try again.");
        }
      });
    },

    // LOGIN: Authenticate user and update store
    async login(credentials) {
  return new Promise((resolve, reject) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      const user = users.find(
        (u) =>
          u.email === credentials.email &&
          u.password === credentials.password
      );

      if (user) {
        // Debugging: Log the user object
        console.log("User found:", user);

        // Update store
        this.userType = user.userType || "client"; // Default to client if undefined
        this.userInfo = {
          fullName: `${user.firstName} ${user.lastName}`, 
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${user.firstName} ${user.lastName}`
          )}`,
        };
        this.isAuthenticated = true;

        // Save session to localStorage
        localStorage.setItem(USER_STATE_KEY, JSON.stringify(this.$state));
        resolve("✅ Login successful!");
      } else {
        reject("⚠️ Invalid email or password!");
      }
    } catch (error) {
      reject("❌ Failed to log in. Please try again.");
    }
  });
},

    // LOGOUT: Clear user session
    logout() {
      this.userType = null;
      this.userInfo = null;
      this.isAuthenticated = false;
      localStorage.removeItem(USER_STATE_KEY);
    },
  },
});
