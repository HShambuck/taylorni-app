import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cart = ref([]);

  // Add to cart
  const addToCart = (product) => {
    if (existing) {
      existing.quantity++;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    cart.value = cart.value.filter((item) => item.id !== id);
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    const item = cart.value.find((item) => item.id === id);
    if (item) item.quantity = quantity;
  };

  // Get Total Price
  const totalPrice = computed(() =>
    cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
  };
})
