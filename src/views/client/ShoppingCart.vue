<script setup>
import { useCartStore } from "@/stores/cartStore";
import { ref, computed } from 'vue';

const cartStore = useCartStore();
const isCheckingOut = ref(false);

const handleCheckout = () => {
  isCheckingOut.value = true;
  // Simulate checkout process
  setTimeout(() => {
    cartStore.clearCart();
    isCheckingOut.value = false;
  }, 2000);
};

const updateQuantity = (item, newQuantity) => {
  if (newQuantity < 1) return;
  item.quantity = newQuantity;
};
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-purple-900">Your Shopping Cart</h1>
      <router-link to="/dashboard/marketplace" class="flex items-center text-purple-900 hover:text-purple-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Continue Shopping
      </router-link>
    </div>

    <div v-if="cartStore.cart.length > 0" class="bg-white rounded-lg shadow-lg">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr class="bg-gray-50 text-gray-700">
              <th class="py-4 px-6 text-left">Product</th>
              <th class="py-4 px-6 text-center">Quantity</th>
              <th class="py-4 px-6 text-center">Price</th>
              <th class="py-4 px-6 text-center">Total</th>
              <th class="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartStore.cart" :key="item.id" class="border-t border-gray-100">
              <td class="py-4 px-6">
                <div class="flex items-center">
                  <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                    <img :src="item.image" :alt="item.name" class="h-full w-full object-cover object-center">
                  </div>
                  <div>
                    <h3 class="text-base font-medium text-gray-900">{{ item.name }}</h3>
                    <p v-if="item.size" class="text-sm text-gray-500">Size: {{ item.size }}</p>
                    <p v-if="item.color" class="text-sm text-gray-500">Color: {{ item.color }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center">
                  <button @click="updateQuantity(item, item.quantity - 1)" 
                    class="btn btn-sm btn-circle btn-ghost text-purple-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    class="w-12 mx-2 text-center border border-gray-200 rounded"
                    min="1"
                    @change="item.quantity = item.quantity < 1 ? 1 : item.quantity"
                  />
                  <button @click="updateQuantity(item, item.quantity + 1)" 
                    class="btn btn-sm btn-circle btn-ghost text-purple-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="py-4 px-6 text-center">₵{{ item.price.toFixed(2) }}</td>
              <td class="py-4 px-6 text-center font-medium">₵{{ (item.quantity * item.price).toFixed(2) }}</td>
              <td class="py-4 px-6 text-center">
                <button @click="cartStore.removeFromCart(item.id)" 
                  class="btn btn-sm btn-outline btn-error">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border-t border-gray-200 p-6">
        <div class="flex justify-between text-base font-medium text-gray-900 mb-2">
          <p>Subtotal:</p>
          <p>₵{{ cartStore.totalPrice.toFixed(2) }}</p>
        </div>
        <div class="flex justify-between text-base font-medium text-gray-900 mb-2">
          <p>Shipping:</p>
          <p>₵{{ (cartStore.cart.length > 0 ? 10 : 0).toFixed(2) }}</p>
        </div>
        <div class="flex justify-between text-base font-bold text-gray-900 mb-4">
          <p>Total:</p>
          <p>₵{{ (cartStore.totalPrice + (cartStore.cart.length > 0 ? 10 : 0)).toFixed(2) }}</p>
        </div>
        <div class="flex justify-between items-center">
          <button @click="cartStore.clearCart()" 
            class="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400">
            Clear Cart
          </button>
          <button @click="handleCheckout" 
            class="btn bg-purple-900 hover:bg-purple-800 text-white border-none"
            :class="{ 'loading': isCheckingOut }"
            :disabled="isCheckingOut">
            {{ isCheckingOut ? 'Processing...' : 'Proceed to Checkout' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg p-16 text-center">
      <div class="flex justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
      <router-link to="/dashboard/marketplace" 
        class="btn bg-purple-900 hover:bg-purple-800 text-white border-none px-8">
        Browse Products
      </router-link>
    </div>
  </div>
</template>