<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const product = ref(null);

// Get product ID from route params
const productId = ref(route.params.id);

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) fetchProductDetails(newId);
});

// Fetch product data on mount
onMounted(() => {
  if (productId.value) {
    fetchProductDetails(productId.value);
  } else {
    router.push('/marketplace'); // Redirect if no productId
  }
});

// Function to fetch product data
const fetchProductDetails = (id) => {
  product.value = productStore.getProductById(id);
  if (!product.value) {
    console.warn(`Product with ID ${id} not found!`);
  }
};

// Go back to the marketplace
const goBack = () => {
  router.push('/marketplace');
};

// Example function for adding to cart (Simulate store interaction)
const addToCart = () => {
  if (product.value) {
    productStore.addToCart(product.value);
    console.log(`Added ${product.value.name} to cart`);
  }
};
</script>

<template>
  <section class="p-4 md:p-8">
    <div v-if="product" class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-semibold mb-4">{{ product.name }}</h1>
      <img :src="product.image" alt="Product Image" class="w-full h-64 object-cover rounded-md" />
      
      <p class="text-gray-600 mt-4">{{ product.description }}</p>
      
      <div class="mt-4">
        <span class="font-semibold">Price:</span> ${{ product.price }}
      </div>
      
      <button 
        class="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        @click="addToCart"
      >
        Add to Cart
      </button>
    </div>
    
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-semibold">Product not found!</h2>
      <p class="text-gray-500 mt-2">Please try again.</p>
      <button 
        class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        @click="goBack"
      >
        Go Back
      </button>
    </div>
  </section>
</template>

<style scoped>
button {
  transition: background-color 0.2s ease-in-out;
}
</style>
