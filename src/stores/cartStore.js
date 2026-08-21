import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useUserStore } from "./auth";

export const useCartStore = defineStore("cart", () => {
  const userStore = useUserStore();
  const cart = ref([]);

  // Initialize the cart from localStorage when the store is created
  const initializeCart = () => {
    if (userStore.isAuthenticated && userStore.userInfo) {
      const userId = userStore.userInfo.id;
      const savedCart = localStorage.getItem(`cart_${userId}`);

      if (savedCart) {
        try {
          cart.value = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
          cart.value = [];
        }
      }
    } else {
      // For non-authenticated users, use a generic cart
      const guestCart = localStorage.getItem("cart_guest");
      if (guestCart) {
        try {
          cart.value = JSON.parse(guestCart);
        } catch (e) {
          console.error("Failed to parse guest cart from localStorage", e);
          cart.value = [];
        }
      }
    }
  };

  // Save cart to localStorage
  const saveCart = () => {
    if (userStore.isAuthenticated && userStore.userInfo) {
      const userId = userStore.userInfo.id;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart.value));
    } else {
      localStorage.setItem("cart_guest", JSON.stringify(cart.value));
    }
  };

  // Watch for changes in cart and authentication state
  watch(
    cart,
    () => {
      saveCart();
    },
    { deep: true }
  );

  // Watch for changes in authentication state
  watch(
    () => userStore.isAuthenticated,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        initializeCart();
      }
    }
  );

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
    saveCart();
  };

  // Remove from cart
  const removeFromCart = (id) => {
    cart.value = cart.value.filter((item) => item.id !== id);
    saveCart();
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    const item = cart.value.find((item) => item.id === id);
    if (item) {
      item.quantity = quantity;
      saveCart();
    }
  };

  // Get Total Price
  const totalPrice = computed(() =>
    cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  // Get Total Items
  const totalItems = computed(() =>
    cart.value.reduce((total, item) => total + item.quantity, 0)
  );

  // Clear cart
  const clearCart = () => {
    cart.value = [];
    saveCart();
  };

  // Transfer guest cart to user cart upon login
  const transferGuestCart = () => {
    if (userStore.isAuthenticated && userStore.userInfo) {
      const userId = userStore.userInfo.id;
      const guestCart = localStorage.getItem("cart_guest");

      if (guestCart) {
        try {
          const parsedGuestCart = JSON.parse(guestCart);

          // Merge guest cart with user cart if it exists
          const userCart = localStorage.getItem(`cart_${userId}`);
          if (userCart) {
            const parsedUserCart = JSON.parse(userCart);

            // Merge items, increasing quantity for duplicates
            parsedGuestCart.forEach((guestItem) => {
              const existingItem = parsedUserCart.find(
                (item) => item.id === guestItem.id
              );
              if (existingItem) {
                existingItem.quantity += guestItem.quantity;
              } else {
                parsedUserCart.push(guestItem);
              }
            });

            cart.value = parsedUserCart;
          } else {
            cart.value = parsedGuestCart;
          }

          // Clear guest cart
          localStorage.removeItem("cart_guest");
          saveCart();
        } catch (e) {
          console.error("Failed to transfer guest cart", e);
        }
      }
    }
  };

  // Initialize the cart when the store is created
  initializeCart();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
    initializeCart,
    transferGuestCart,
  };
});
