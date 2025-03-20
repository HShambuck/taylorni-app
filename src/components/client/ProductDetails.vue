<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cartStore";

import eveningGown from "@/assets/evening-gown.jpg";
import denimJacket from "@/assets/denim.jpeg";
import kenteDress from "@/assets/kente.webp";
import formalSuit from "@/assets/suit.jpg";

// Accept `id` as a prop from the route
const props = defineProps({
  id: String, // Comes as a string from the route
});

const cartStore = useCartStore();

// Dummy product data (replace with API later)
const products = ref([
  { id: 1, name: "Elegant Evening Gown", price: 450, category: "Dresses", description: "A beautiful evening gown for special occasions.", image: eveningGown },
  { id: 2, name: "Casual Denim Jacket", price: 300, category: "Jackets", description: "A stylish denim jacket for everyday wear.", image: denimJacket },
  { id: 3, name: "Traditional Kente Dress", price: 600, category: "Dresses", description: "Authentic Kente dress for cultural events.", image: kenteDress },
  { id: 4, name: "Formal Suit", price: 750, category: "Suits", description: "Perfect for weddings and business meetings.", image: formalSuit },
]);

// Find product by ID from the props
const product = computed(() => products.value.find((p) => p.id === parseInt(props.id))); // Convert `id` from string to number

// Function to add to cart
const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value);
    alert(`✅ "${product.value.name}" added to cart!`);
  }
};
</script>


<template>
  <div class="container mx-auto p-4">
    <div v-if="product">
      <div class="card lg:card-side bg-base-100 shadow-xl">
        <figure class="lg:w-1/2">
          <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body lg:w-1/2">
          <h2 class="card-title text-3xl text-purple-800">{{ product.name }}</h2>
          <div class="badge badge-accent bg-amber-500 text-white border-noneaa">{{ product.category }}</div>
          <p class="text-base-content/70 mt-4">{{ product.description }}</p>
          
          <div class="stat px-0">
            <div class="stat-title">Price</div>
            <div class="stat-value text-purple-800">₵{{ product.price }}</div>
          </div>
          
          <div class="card-actions justify-start mt-4 gap-2">
            <button @click="addToCart" class="btn bg-purple-800 text-white">
              <span class="mr-1">🛒</span> Add to Cart
            </button>
            <router-link to="/dashboard/cart" class="btn bg-amber-500 text-white">
              <span class="mr-1">⚡</span> Buy Now
            </router-link>
          </div>
          
          <router-link to="/dashboard/marketplace" class="link link-primary mt-6 inline-block">
            ← Back to Marketplace
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Product not found -->
    <div v-else class="text-center py-16">
      <div class="alert alert-error shadow-lg max-w-md mx-auto">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Product not found! 😢</span>
        </div>
      </div>
      <router-link to="/dashboard/marketplace" class="btn btn-primary mt-4">
        ← Back to Marketplace
      </router-link>
    </div>
  </div>
</template>