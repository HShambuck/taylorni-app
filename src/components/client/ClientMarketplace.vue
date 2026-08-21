<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { useDesignerStore } from "@/stores/designerStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const productStore = useProductStore();
const designerStore = useDesignerStore();
const cartStore = useCartStore();

// Loading state
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(12); // preferred page
const itemsPerPageOptions = ref([6, 9, 12, 24]); // Options for items per page

// Fetch data on component mount
onMounted(async () => {
  try {
    await Promise.all([
      designerStore.fetchDesigners(),
      productStore.fetchProducts(), // Ensures product data is fetched
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false; // End loading
  }
});

// Get all designers
const designers = computed(() => designerStore.getAllDesigners);

// Get top designers for featured section
const topDesigners = computed(() => designerStore.getTopDesigners);

// Enhanced product list with full designer details
const enhancedProducts = computed(() => {
  return productStore.products.map((product) => {
    const designer = designerStore.getDesignerById(product.designerId) || {}; // Fallback to empty object
    return {
      ...product,
      designerDetails: designer,
      designerFullName:
        `${designer.firstName || ""} ${designer.lastName || ""}`.trim() ||
        product.designerName,
    };
  });
});

// Paginated products (add with your other computed properties)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedProducts.value.slice(start, end);
});

// Total pages calculation
const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage.value);
});

// Visible pages for pagination display (smart page windowing)
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  
  if (total <= 6) {
    // Show all pages if 6 or less
    for (let i = 2; i < total; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (current <= 4) {
    // Near start - show early pages
    for (let i = 2; i <= 5; i++) {
      pages.push(i);
    }
    pages.push('...');
    return pages;
  }

  if (current >= total - 3) {
    // Near end - show later pages
    pages.push('...');
    for (let i = total - 4; i < total; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Middle range - show pages around current
  pages.push('...');
  pages.push(current - 1);
  pages.push(current);
  pages.push(current + 1);
  pages.push('...');
  return pages;
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Filter states
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedPriceRange = ref({ min: 0, max: 10000 }); // Set meaningful default
const selectedDesigner = ref(null);
const sortBy = ref("featured");
const minRating = ref(0);

// Computed filtered products
const filteredProducts = computed(() => {
  return enhancedProducts.value.filter((product) => {
    // Search filter
    if (
      searchQuery.value &&
      ![product.name, product.description, product.designerFullName].some(
        (field) =>
          field?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    ) {
      return false;
    }

    // Category filter
    if (selectedCategory.value && product.category !== selectedCategory.value) {
      return false;
    }

    // Price range filter
    if (
      selectedPriceRange.value.min !== null &&
      product.price < selectedPriceRange.value.min
    ) {
      return false;
    }
    if (
      selectedPriceRange.value.max !== null &&
      product.price > selectedPriceRange.value.max
    ) {
      return false;
    }

    // Rating filter
    if (product.rating < minRating.value) {
      return false;
    }

    // Designer filter
    if (
      selectedDesigner.value &&
      product.designerId !== selectedDesigner.value
    ) {
      return false;
    }

    return true;
  });
});

// Computed sorted products
const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]; // Shallow copy to retain reactivity

  switch (sortBy.value) {
    case "featured":
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    case "bestSellers":
      return sorted.sort(
        (a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0)
      );
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    case "priceHigh":
      return sorted.sort((a, b) => b.price - a.price);
    case "priceLow":
      return sorted.sort((a, b) => a.price - b.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
});

// Featured products for the hero section
const featuredProducts = computed(() => {
  return sortedProducts.value.filter((product) => product.featured).slice(0, 3);
});

// Computed: Min & Max Price
const minPrice = computed(() =>
  enhancedProducts.value.length
    ? Math.min(...enhancedProducts.value.map((p) => p.price))
    : 0
);
const maxPrice = computed(() =>
  enhancedProducts.value.length
    ? Math.max(...enhancedProducts.value.map((p) => p.price))
    : 0
);

// Handle category selection
const setCategory = (category) => {
  selectedCategory.value = category === selectedCategory.value ? "" : category;
};

// Handle designer selection
const setDesigner = (designerId) => {
  selectedDesigner.value =
    designerId === selectedDesigner.value ? null : designerId;
};

// Reset all filters
const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "";
  selectedDesigner.value = null;
  selectedPriceRange.value = { min: 0, max: 10000 };
  sortBy.value = "featured";
  minRating.value = 0;
  currentPage.value = 1;
};

// Generate star rating display
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
  };
};

// Navigate to product details
function goToProductDetails(id) {
  router.push(`/client/product/${id}`);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-purple-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl font-bold mb-4">Shop Unique Fashion Designs</h1>
            <p class="text-lg mb-6">
              Find the perfect outfit for any occasion or request a custom
              design that expresses your unique style.
            </p>
            <div class="flex space-x-4">
              <button
                class="btn bg-white text-purple-900 hover:bg-gray-100 border-none"
              >
                Explore Collections
              </button>
              <button class="btn btn-outline text-white hover:bg-purple-800">
                Request Custom
              </button>
            </div>
          </div>

          <div class="md:w-1/2 grid grid-cols-2 gap-4">
            <div
              v-for="(product, index) in featuredProducts"
              :key="product.id"
              :class="{ 'col-span-2': index === 0, 'col-span-1': index > 0 }"
            >
              <div class="relative rounded-lg overflow-hidden shadow-lg h-48">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                >
                  <p class="text-white font-semibold">{{ product.name }}</p>
                  <p class="text-white text-sm opacity-80">
                    by {{ product.designerName }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Tabs -->
    <section class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex overflow-x-auto py-4 space-x-4 no-scrollbar">
          <button
            @click="setCategory('')"
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]',
              !selectedCategory
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-white hover:bg-gray-100',
            ]"
          >
            All Products
          </button>
          <button
            @click="setCategory('Dresses')"
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]',
              selectedCategory === 'Dresses'
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-white hover:bg-gray-100',
            ]"
          >
            Dresses
          </button>
          <button
            @click="setCategory('Jackets')"
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]',
              selectedCategory === 'Jackets'
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-white hover:bg-gray-100',
            ]"
          >
            Jackets
          </button>
          <button
            @click="setCategory('Suits')"
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]',
              selectedCategory === 'Suits'
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-white hover:bg-gray-100',
            ]"
          >
            Suits
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Cards -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="stat bg-white shadow rounded-lg">
          <div class="stat-title">Total Products</div>
          <div class="stat-value text-purple-900">
            {{ sortedProducts.length }}
          </div>
          <div class="stat-desc">Available for purchase</div>
        </div>

        <div class="stat bg-white shadow rounded-lg">
          <div class="stat-title">Products in Cart</div>
          <div class="stat-value text-purple-900">
            {{ cartStore.totalItems || 0 }}
          </div>
          <div class="stat-desc">Ready for checkout</div>
        </div>

        <div class="stat bg-white shadow rounded-lg">
          <div class="stat-title">Price Range</div>
          <div class="stat-value text-purple-900">
            ₵{{ minPrice }} - ₵{{ maxPrice }}
          </div>
          <div class="stat-desc">Min and max prices</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-1/4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              <button
                @click="resetFilters"
                class="text-purple-900 text-sm hover:underline"
              >
                Reset all filters
              </button>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Price Range</h4>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="selectedPriceRange.min"
                  type="number"
                  placeholder="Min"
                  class="input input-bordered input-sm w-full"
                />
                <span>-</span>
                <input
                  v-model.number="selectedPriceRange.max"
                  type="number"
                  placeholder="Max"
                  class="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Rating</h4>
              <div class="space-y-2">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="minRating"
                    :value="4.5"
                    class="radio radio-sm radio-purple-900"
                  />
                  <span class="ml-2 flex items-center">
                    <span class="flex">
                      <svg
                        v-for="i in 5"
                        :key="i"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    </span>
                    <span class="ml-1">4.5 & up</span>
                  </span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="minRating"
                    :value="4"
                    class="radio radio-sm radio-purple-900"
                  />
                  <span class="ml-2 flex items-center">
                    <span class="flex">
                      <svg
                        v-for="i in 4"
                        :key="i"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    </span>
                    <span class="ml-1">4.0 & up</span>
                  </span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="minRating"
                    :value="0"
                    class="radio radio-sm radio-purple-900"
                  />
                  <span class="ml-2">Show all</span>
                </label>
              </div>
            </div>

            <!-- Featured Designers -->
            <!-- Featured Designers -->
            <div>
              <h4 class="font-medium text-gray-700 mb-3">Featured Designers</h4>
              <div class="space-y-3">
                <div
                  v-for="designer in topDesigners"
                  :key="designer.id"
                  class="flex items-center cursor-pointer"
                  @click="setDesigner(designer.id)"
                  :class="{ 'bg-gray-100': selectedDesigner === designer.id }"
                >
                  <div class="avatar mr-3">
                    <div
                      class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium"
                        >{{ designer.firstName.charAt(0)
                        }}{{ designer.lastName.charAt(0) }}</span
                      >
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium">
                      {{ designer.firstName }} {{ designer.lastName }}
                    </p>
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      <span class="text-xs ml-1"
                        >{{ designer.rating }} ({{
                          designer.ordersCompleted
                        }})</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="text-purple-900 text-sm mt-4 hover:underline"
                @click="selectedDesigner = null"
                v-if="selectedDesigner"
              >
                Clear designer filter
              </button>
              <button
                class="text-purple-900 text-sm mt-4 hover:underline"
                @click="router.push('/designers')"
              >
                View all designers
              </button>
            </div>
          </div>
        </aside>

        <!-- Product Listings -->
        <section class="lg:w-3/4">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
            >
              <h2 class="text-xl font-semibold text-gray-800">
                {{ sortedProducts.length }}
                {{ sortedProducts.length === 1 ? "Product" : "Products" }}
                <span v-if="selectedCategory"> in {{ selectedCategory }}</span>
              </h2>

              <div class="flex items-center mt-3 sm:mt-0">
                <label class="mr-2 text-sm text-gray-700">Sort by:</label>
                <select
                  v-model="sortBy"
                  class="select select-bordered select-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="bestSellers">Best Sellers</option>
                  <option value="newest">Newest</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <!-- Product Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md"
              >
                <div class="relative">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-48 object-cover object-center"
                  />
                  <button
                    class="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500 hover:text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>

                  <div
                    v-if="product.bestSeller"
                    class="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Best Seller
                  </div>
                </div>

                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-800 truncate">
                      {{ product.name }}
                    </h3>
                    <span class="text-purple-900 font-bold"
                      >₵{{ product.price.toFixed(2) }}</span
                    >
                  </div>

                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <div class="flex">
                        <template
                          v-for="i in getStarRating(product.rating).full"
                          :key="`full-${i}`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </template>
                        <template
                          v-for="i in getStarRating(product.rating).half"
                          :key="`half-${i}`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </template>
                        <template
                          v-for="i in getStarRating(product.rating).empty"
                          :key="`empty-${i}`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-gray-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </template>
                      </div>
                      <span class="text-sm text-gray-600 ml-1"
                        >{{ product.rating }} ({{ product.reviews }})</span
                      >
                    </div>
                  </div>

                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{ product.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500"
                      >by
                      <span class="text-purple-900">{{
                        product.designerName
                      }}</span></span
                    >

                    <div class="flex space-x-2">
                      <button
                        class="btn btn-sm btn-ghost"
                        @click="cartStore.addToCart(product)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="goToProductDetails(product.id)"
                        class="btn btn-sm bg-purple-900 hover:bg-purple-800 text-white border-none"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Products Found Message -->
            <div
              v-if="sortedProducts.length === 0"
              class="alert alert-warning shadow-lg mt-6"
            >
              <span>No products found. Try adjusting your filters.</span>
            </div>

            <!-- Add this above pagination for items per page selection -->
            <div
              class="flex flex-col sm:flex-row items-center justify-between mb-4"
            >
              <div class="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                  Math.min(currentPage * itemsPerPage, sortedProducts.length)
                }}
                of {{ sortedProducts.length }} products
              </div>

              <div class="flex items-center">
                <label class="mr-2 text-sm text-gray-700"
                  >Items per page:</label
                >
                <select
                  v-model="itemsPerPage"
                  class="select select-bordered select-sm"
                  @change="currentPage = 1"
                >
                  <option v-for="option in itemsPerPageOptions" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Updated Pagination -->
            <div class="flex justify-center mt-8">
              <div class="btn-group">
                <button
                  class="btn btn-sm"
                  :disabled="currentPage === 1"
                  @click="prevPage"
                >
                  «
                </button>

                <!-- Always show first page -->
                <button
                  class="btn btn-sm"
                  :class="{ 'bg-purple-900 text-white': currentPage === 1 }"
                  @click="goToPage(1)"
                >
                  1
                </button>

                <!-- Show dynamic page range -->
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page === '...'"
                    class="btn btn-sm btn-disabled"
                    disabled
                  >
                    ...
                  </button>
                  <button
                    v-else
                    class="btn btn-sm"
                    :class="{
                      'bg-purple-900 text-white': currentPage === page,
                    }"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                </template>

                <!-- Always show last page if not already shown -->
                <button
                  v-if="totalPages > 6 && currentPage < totalPages - 3"
                  class="btn btn-sm"
                  :class="{
                    'bg-purple-900 text-white': currentPage === totalPages,
                  }"
                  @click="goToPage(totalPages)"
                >
                  {{ totalPages }}
                </button>

                <button
                  class="btn btn-sm"
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
