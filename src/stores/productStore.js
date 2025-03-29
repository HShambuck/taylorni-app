import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Define the store
export const useProductStore = defineStore("product", () => {
  // State
  const productList = ref([]);
  const selectedProductId = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Fetch products from API
  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Update this URL to your actual API endpoint where the JSON is hosted
      const response = await fetch('/database/products.json');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      productList.value = data;
    } catch (err) {
      console.error("Error fetching products:", err);
      error.value = err.message || "Failed to fetch products";
    } finally {
      isLoading.value = false;
    }
  };

  // Getters
  const getProductById = (id) => {
    return productList.value.find((product) => product.id === id) || null;
  };

  const getProductsByCategory = (category) => {
    return productList.value.filter((product) => product.category === category);
  };


  const featuredProducts = computed(() =>
    productList.value.filter((product) => product.featured)
  );

  // Actions
  const setSelectedProduct = (id) => {
    selectedProductId.value = id;
  };

  // For debugging
  return {
    // State
    products: productList,
    selectedProductId,
    isLoading,
    error,
    // Getters
    getProductById,
    getProductsByCategory,
    featuredProducts,
    // Actions
    fetchProducts,
    setSelectedProduct,
  };
});
