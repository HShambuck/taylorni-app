<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';

// Route and Stores
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

// Reactive State
const selectedImage = ref('');
const selectedSize = ref('');
const selectedColor = ref('');
const quantity = ref(1);

// Safe Product Access
const product = computed(() => {
  const foundProduct = productStore.getProductById(Number(route.params.id));
  return foundProduct || {
    id: null,
    name: 'Unknown Product',
    description: '',
    price: 0,
    images: [],
    availableSizes: [],
    availableColors: [],
    reviews: 0,
    rating: 0
  };
});

// Lifecycle Hooks
onMounted(() => {
  if (product.value.images?.length) {
    selectedImage.value = product.value.images[0];
  }
  if (product.value.availableSizes?.length) {
    selectedSize.value = product.value.availableSizes[0];
  }
  if (product.value.availableColors?.length) {
    selectedColor.value = product.value.availableColors[0];
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
  if (!product.value.id) return;

  const cartItem = {
    ...product.value,
    selectedSize: selectedSize.value,
    selectedColor: selectedColor.value,
    quantity: quantity.value
  };
  cartStore.addToCart(cartItem);
}

function buyNow() {
  addToCart();
  router.push('/checkout');
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
    empty: emptyStars
  };
}
</script>


<template>
  <div class="bg-white min-h-screen">
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
            @click="selectedImage = image"
            class="cursor-pointer border rounded-md overflow-hidden"
            :class="selectedImage === image ? 'border-purple-800 border-2' : 'border-gray-200'"
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
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
        
        <div class="flex items-center mb-4">
          <div class="flex items-center mr-4">
            <template v-for="i in getStarRating(product.rating).full" :key="`full-${i}`">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </template>
            <template v-for="i in getStarRating(product.rating).half" :key="`half-${i}`">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </template>
            <template v-for="i in getStarRating(product.rating).empty" :key="`empty-${i}`">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </template>
            <span class="ml-2 text-gray-600">({{ product.reviews }} reviews)</span>
          </div>
        </div>
        
        <div class="mb-4">
          <span class="text-2xl font-bold text-purple-800">₵{{ product.price.toFixed(2) }}</span>
          <p class="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
        </div>
        
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Description</h3>
          <p class="text-gray-700">{{ product.description }}</p>
        </div>
        
        <!-- Size Selection -->
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Size</h3>
          <div class="flex space-x-2">
            <button 
              v-for="size in product.availableSizes" 
              :key="size"
              @click="selectedSize = size"
              class="px-4 py-2 border rounded-md transition-colors"
              :class="selectedSize === size 
                ? 'bg-purple-800 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'"
            >
              {{ size }}
            </button>
          </div>
        </div>
        
        <!-- Color Selection -->
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Color</h3>
          <div class="flex space-x-2">
            <button 
              v-for="color in product.availableColors" 
              :key="color"
              @click="selectedColor = color"
              class="w-8 h-8 rounded-full border-2 transition-all"
              :style="{ backgroundColor: color }"
              :class="selectedColor === color 
                ? 'border-purple-800 scale-110' 
                : 'border-transparent hover:border-gray-300'"
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
        <div class="mt-8 border-t pt-4">
          <div class="flex items-center">
            <img 
              :src="product.designer.avatar" 
              :alt="product.designer.name" 
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h4 class="font-semibold text-gray-800">{{ product.designer.name }}</h4>
              <p class="text-sm text-gray-600">{{ product.designer.bio }}</p>
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
            :class="activeTab === 'details' 
              ? 'text-purple-800 border-b-2 border-purple-800' 
              : 'text-gray-500 hover:text-gray-700'"
          >
            Product Details
          </button>
          <button 
            @click="activeTab = 'reviews'"
            class="py-3 font-semibold"
            :class="activeTab === 'reviews' 
              ? 'text-purple-800 border-b-2 border-purple-800' 
              : 'text-gray-500 hover:text-gray-700'"
          >
            Reviews ({{ product.reviews }})
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
                <li v-for="instruction in product.careInstructions" :key="instruction">
                  {{ instruction }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div v-else-if="activeTab === 'reviews'">
          <h3 class="text-xl font-semibold mb-4">Customer Reviews</h3>
          <div v-for="review in product.reviewList" :key="review.id" class="border-b pb-4 mb-4">
            <div class="flex items-center mb-2">
              <img 
                :src="review.user.avatar" 
                :alt="review.user.name" 
                class="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h4 class="font-semibold">{{ review.user.name }}</h4>
                <div class="flex items-center">
                  <template v-for="i in review.rating" :key="`review-star-${i}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </template>
                </div>
              </div>
            </div>
            <p class="text-gray-700 mb-2">{{ review.comment }}</p>
            <p class="text-sm text-gray-500">{{ review.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
