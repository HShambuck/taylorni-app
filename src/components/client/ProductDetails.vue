<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/productStore";
import { useDesignerStore } from "@/stores/designerStore";

const route = useRoute();
const productStore = useProductStore();
const designerStore = useDesignerStore();

// Reactive State
const selectedImage = ref("");
const selectedSize = ref("");
const selectedColor = ref("");
const quantity = ref(1);
const activeTab = ref("details");
const isLoading = ref(true);
const product = ref(null);

// Fetch product data when component mounts
onMounted(async () => {
  try {
    console.log("Fetching product with ID:", route.params.id);
    await productStore.fetchProducts();
    await designerStore.fetchDesigners();

    console.log("All products:", productStore.products);
    const foundProduct = productStore.getProductById(route.params.id);
    console.log("Found product:", foundProduct);

    // Add this line to inspect the image property
    console.log('Product image property:', foundProduct.image);

    if (foundProduct) {
      // Use product's image URLs or fallback to placeholders
      const productImages = foundProduct.images || [];

      // If no images are available, create an array of placeholder image URLs
      const displayImages =
        productImages.length > 0
          ? productImages
          : Array(5).fill(`${foundProduct.image}`); // Replace with your actual placeholder path

      product.value = {
        ...foundProduct,
        designerDetails: designerStore.getDesignerById(foundProduct.designerId),
        images: displayImages,
      };

      selectedImage.value = product.value.images[0] || "";
      selectedSize.value = product.value.availableSizes?.[0] || "";

      // Only set selectedColor if colors are available
      if (
        product.value.availableColors &&
        product.value.availableColors.length > 0
      ) {
        selectedColor.value = product.value.availableColors[0];
      }
    }
  } catch (error) {
    console.error("Error loading product:", error);
  } finally {
    isLoading.value = false;
  }
});

// Methods
function increaseQuantity() {
  if (quantity.value < 10) quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--;
}

function addToCart() {
  console.log("Added to cart:", {
    ...product.value,
    selectedSize: selectedSize.value,
    selectedColor: selectedColor.value,
    quantity: quantity.value,
  });
}

function buyNow() {
  addToCart();
  console.log("Navigating to checkout");
}

function selectImage(image) {
  selectedImage.value = image;
}

// Utility Function for Star Rating
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
  };
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <div class="loading loading-spinner loading-lg"></div>
  </div>

  <div v-else-if="product" class="bg-white min-h-screen">
    <div class="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <!-- Product Image Gallery -->
      <div>
        <div class="mb-4">
          <img
            :src="selectedImage"
            :alt="product.name"
            class="w-full h-[500px] object-cover rounded-lg shadow-md"
          />
        </div>

        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(image, index) in product.images"
            :key="index"
            @click="selectImage(image)"
            class="cursor-pointer border rounded-md overflow-hidden"
            :class="
              selectedImage === image
                ? 'border-purple-800 border-2'
                : 'border-gray-200'
            "
          >
            <img
              :src="image"
              :alt="`Product image ${index + 1}`"
              class="w-full h-20 object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ product.name }}
        </h1>

        <div class="flex items-center mb-4">
          <div class="flex items-center mr-4">
            <template
              v-for="i in getStarRating(product.rating).full"
              :key="`full-${i}`"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-yellow-400"
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
                class="h-5 w-5 text-yellow-400"
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
                class="h-5 w-5 text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </template>
            <span class="ml-2 text-gray-600"
              >({{ product.reviews || 0 }} reviews)</span
            >
          </div>
        </div>

        <div class="mb-4">
          <span class="text-2xl font-bold text-purple-800"
            >₵{{ product.price.toFixed(2) }}</span
          >
          <p class="text-sm text-gray-500 mt-1">
            Tax included. Shipping calculated at checkout.
          </p>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-2">Description</h3>
          <p class="text-gray-700">{{ product.description }}</p>
        </div>

        <!-- Size Selection -->
        <div v-if="product.availableSizes" class="mb-6">
          <h3 class="font-semibold mb-2">Size</h3>
          <div class="flex space-x-2">
            <button
              v-for="size in product.availableSizes"
              :key="size"
              @click="selectedSize = size"
              class="px-4 py-2 border rounded-md transition-colors"
              :class="
                selectedSize === size
                  ? 'bg-purple-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              "
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Color Selection -->
        <div
          v-if="product.availableColors && product.availableColors.length > 0"
          class="mb-6"
        >
          <h3 class="font-semibold mb-2">Color</h3>
          <div class="flex space-x-2">
            <button
              v-for="color in product.availableColors"
              :key="color"
              @click="selectedColor = color"
              class="w-8 h-8 rounded-full border-2 transition-all"
              :style="{ backgroundColor: color }"
              :class="
                selectedColor === color
                  ? 'border-purple-800 scale-110'
                  : 'border-transparent hover:border-gray-300'
              "
            ></button>
          </div>
        </div>

        <!-- Quantity -->
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Quantity</h3>
          <div class="flex items-center space-x-4">
            <button
              @click="decreaseQuantity"
              class="w-10 h-10 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              -
            </button>
            <span class="text-xl font-semibold">{{ quantity }}</span>
            <button
              @click="increaseQuantity"
              class="w-10 h-10 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4">
          <button
            @click="addToCart"
            class="flex-1 bg-purple-800 text-white py-3 rounded-md hover:bg-purple-900 transition-colors"
          >
            Add to Cart
          </button>
          <button
            @click="buyNow"
            class="flex-1 border border-purple-800 text-purple-800 py-3 rounded-md hover:bg-purple-50 transition-colors"
          >
            Buy Now
          </button>
        </div>

        <!-- Designer Info -->
        <div v-if="product.designerDetails" class="mt-8 border-t pt-4">
          <div class="flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center"
            >
              <span class="text-lg font-semibold">
                {{ product.designerDetails.firstName?.charAt(0) || "D"
                }}{{ product.designerDetails.lastName?.charAt(0) || "S" }}
              </span>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">
                {{ product.designerDetails.firstName }}
                {{ product.designerDetails.lastName }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ product.designerDetails.specialty || "Fashion Designer" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Tabs -->
    <div class="container mx-auto px-4 mt-8">
      <div class="border-b">
        <nav class="flex space-x-6">
          <button
            @click="activeTab = 'details'"
            class="py-3 font-semibold"
            :class="
              activeTab === 'details'
                ? 'text-purple-800 border-b-2 border-purple-800'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            Product Details
          </button>
          <button
            @click="activeTab = 'reviews'"
            class="py-3 font-semibold"
            :class="
              activeTab === 'reviews'
                ? 'text-purple-800 border-b-2 border-purple-800'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            Reviews ({{ product.reviews || 0 }})
          </button>
        </nav>
      </div>

      <div class="mt-6">
        <div v-if="activeTab === 'details'">
          <h3 class="text-xl font-semibold mb-4">Product Details</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium mb-2">Materials</h4>
              <ul class="list-disc list-inside text-gray-700">
                <li v-for="material in product.materials" :key="material">
                  {{ material }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">Care Instructions</h4>
              <ul class="list-disc list-inside text-gray-700">
                <li
                  v-for="instruction in product.careInstructions"
                  :key="instruction"
                >
                  {{ instruction }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'reviews'">
          <h3 class="text-xl font-semibold mb-4">Customer Reviews</h3>
          <div v-if="product.reviewList && product.reviewList.length > 0">
            <div
              v-for="review in product.reviewList"
              :key="review.id"
              class="border-b pb-4 mb-4"
            >
              <div class="flex items-center mb-2">
                <div
                  class="w-10 h-10 rounded-full bg-gray-300 mr-4 flex items-center justify-center"
                >
                  <span class="text-sm font-semibold">
                    {{ review.user?.name?.charAt(0) || "U" }}
                  </span>
                </div>
                <div>
                  <h4 class="font-semibold">
                    {{ review.user?.name || "Anonymous" }}
                  </h4>
                  <div class="flex items-center">
                    <template
                      v-for="i in review.rating"
                      :key="`review-star-${i}`"
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
                  </div>
                </div>
              </div>
              <p class="text-gray-700 mb-2">{{ review.comment }}</p>
              <p class="text-sm text-gray-500">{{ review.date }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-screen">
    <div class="text-center">
      <h2 class="text-2xl font-semibold mb-4">Product not found</h2>
      <p class="text-gray-600 mb-6">
        The product you're looking for doesn't exist or may have been removed.
      </p>
      <button
        @click="$router.push('/client/marketplace')"
        class="btn bg-purple-800 text-white hover:bg-purple-900"
      >
        Back to Marketplace
      </button>
    </div>
  </div>
</template>
