<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cartStore";

import eveningGown from "@/assets/evening-gown.jpg";
import denimJacket from "@/assets/denim.jpeg";
import kenteDress from "@/assets/kente.webp";
import formalSuit from "@/assets/suit.jpg";

const cartStore = useCartStore();

const products = ref([
  { id: 1, name: "Elegant Evening Gown", price: 450, category: "Dresses", image: eveningGown },
  { id: 2, name: "Casual Denim Jacket", price: 300, category: "Jackets", image: denimJacket },
  { id: 3, name: "Traditional Kente Dress", price: 600, category: "Dresses", image: kenteDress },
  { id: 4, name: "Formal Suit", price: 750, category: "Suits", image: formalSuit },
]);

const searchQuery = ref("");
const selectedCategory = ref("All");
const sortOption = ref("price-low");

// Computed: Min & Max Price
const minPrice = computed(() =>
  products.value.length ? Math.min(...products.value.map((p) => p.price)) : 0
);
const maxPrice = computed(() =>
  products.value.length ? Math.max(...products.value.map((p) => p.price)) : 0
);

// Computed: Filtered Products
const filteredProducts = computed(() => {
  let filtered = products.value.slice(); // Copy the array

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Category filter
  if (selectedCategory.value !== "All") {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }

  // Sorting (create new sorted array)
  return filtered.slice().sort((a, b) =>
    sortOption.value === "price-low" ? a.price - b.price : b.price - a.price
  );
});
</script>

<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-purple-900">🛍️ Marketplace</h1>
      <p class="text-lg text-gray-600 mt-1">Explore ready-made outfits or request a custom design.</p>
    </div>

    <!-- Filters & Search -->
    <div class="card bg-base-100 shadow-md mb-6">
      <div class="card-body p-4">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="form-control w-full md:w-1/3">
            <div class="input-group">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search for outfits..."
                class="input input-bordered w-full focus:outline-none"
              />
              <button class="btn btn-square bg-amber-500 border-none hover:bg-amber-600">
                🔍
              </button>
            </div>
          </div>

          <div class="form-control w-full md:w-auto">
            <select v-model="selectedCategory" class="select select-bordered w-full">
              <option value="All">All Categories</option>
              <option value="Dresses">Dresses</option>
              <option value="Jackets">Jackets</option>
              <option value="Suits">Suits</option>
            </select>
          </div>

          <div class="form-control w-full md:w-auto">
            <select v-model="sortOption" class="select select-bordered w-full">
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-title">Total Products</div>
        <div class="stat-value text-amber-500">{{ products.length }}</div>
        <div class="stat-desc">Available for purchase</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-title">Products in Cart</div>
        <div class="stat-value text-purple-900">{{ cartStore.totalItems }}</div>
        <div class="stat-desc">Ready for checkout</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-title">Price Range</div>
        <div class="stat-value text-green-600">
          ₵{{ minPrice }} - ₵{{ maxPrice }}
        </div>
        <div class="stat-desc">Min and max prices</div>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <figure>
          <router-link :to="`/client/product/${product.id}`">
            <img :src="product.image" :alt="product.name" class="w-full h-56 object-cover" />
          </router-link>
        </figure>

        <div class="card-body p-4">
          <h2 class="card-title">
            <router-link :to="`/client/product/${product.id}`" class="hover:text-amber-500 transition">
              {{ product.name }}
            </router-link>
          </h2>
          <div class="badge badge-outline">{{ product.category }}</div>
          <p class="text-gray-600 text-lg font-medium">₵{{ product.price }}</p>

          <div class="card-actions justify-between mt-3">
            <button @click="cartStore.addToCart(product)" class="btn btn-primary bg-amber-500 border-none hover:bg-amber-600">
              🛒 Add to Cart
            </button>
            <router-link to="/client/try-on" class="btn bg-purple-800 text-white border-none hover:bg-purple-900">
              🕶️ Try On
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- No Products Found Message -->
    <div v-if="filteredProducts.length === 0" class="alert alert-warning shadow-lg mt-6">
      <span>No products found. Try adjusting your filters.</span>
    </div>

    <!-- Custom Order Section -->
    <div class="card bg-base-100 shadow-md mt-10">
      <div class="card-body items-center text-center">
        <h2 class="card-title text-2xl">🛠️ Can't find what you need?</h2>
        <p class="text-lg text-gray-600">Submit a request for a custom outfit!</p>
        <div class="card-actions mt-2">
          <router-link to="/client/custom-order">
            <button class="btn bg-purple-800 border-none hover:bg-purple-900 text-white">
              ✨ Request Custom Design
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
