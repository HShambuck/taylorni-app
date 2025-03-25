import { defineStore } from "pinia";
import { ref, computed } from "vue";
import products from "@db/products.js"; // Import your data

// Define the store
export const useProductStore = defineStore("product", () => {
  // State
  const productList = ref(products); // Make products reactive
  const selectedProductId = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getProductById = (id) => {
    return productList.value.find((product) => product.id === id) || null;
  };

  const getProductsByCategory = computed(() => {
    return (category) =>
      productList.value.filter((product) => product.category === category);
  });

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
    setSelectedProduct,
  };
});
