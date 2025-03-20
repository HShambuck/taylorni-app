<script setup>
import { ref, computed } from 'vue';

// Sample marketplace data
const designs = ref([
  {
    id: 1,
    name: 'Elegant Evening Gown',
    description: 'A stunning floor-length gown perfect for formal events and galas',
    price: 1200.00,
    designerId: 1,
    designerName: 'Emma Wilson',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.8,
    reviews: 24,
    tags: ['Formal', 'Evening Wear', 'Customizable'],
    category: 'formal',
    featured: true,
    bestSeller: true
  },
  {
    id: 2,
    name: 'Casual Summer Dress',
    description: 'Light and breezy summer dress with floral patterns',
    price: 950.00,
    designerId: 2,
    designerName: 'Sophia Chen',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.6,
    reviews: 18,
    tags: ['Casual', 'Summer', 'Floral'],
    category: 'casual',
    featured: true,
    bestSeller: false
  },
  {
    id: 3,
    name: 'Business Suit',
    description: 'Professional tailored suit for business meetings and formal work environments',
    price: 1450.00,
    designerId: 3,
    designerName: 'James Mitchell',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.9,
    reviews: 12,
    tags: ['Business', 'Formal', 'Tailored'],
    category: 'formal',
    featured: false,
    bestSeller: true
  },
  {
    id: 4,
    name: 'Winter Coat',
    description: 'Warm and stylish winter coat with fur-lined hood',
    price: 1100.00,
    designerId: 1,
    designerName: 'Emma Wilson',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.7,
    reviews: 9,
    tags: ['Winter', 'Outerwear', 'Warm'],
    category: 'winter',
    featured: false,
    bestSeller: false
  },
  {
    id: 5,
    name: 'Streetwear Collection',
    description: 'Urban-inspired casual wear for everyday style',
    price: 850.00,
    designerId: 4,
    designerName: 'Marcus Zhang',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.5,
    reviews: 15,
    tags: ['Urban', 'Casual', 'Trendy'],
    category: 'streetwear',
    featured: true,
    bestSeller: false
  },
  {
    id: 6,
    name: 'Summer Beachwear',
    description: 'Lightweight and colorful beachwear for tropical vacations',
    price: 750.00,
    designerId: 2,
    designerName: 'Sophia Chen',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.7,
    reviews: 32,
    tags: ['Beach', 'Summer', 'Vacation'],
    category: 'summer',
    featured: false,
    bestSeller: true
  },
  {
    id: 7,
    name: 'Traditional Wedding Attire',
    description: 'Exquisite handcrafted wedding outfit with cultural details',
    price: 2200.00,
    designerId: 5,
    designerName: 'Priya Sharma',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 5.0,
    reviews: 28,
    tags: ['Wedding', 'Traditional', 'Luxury'],
    category: 'bridal',
    featured: true,
    bestSeller: true
  },
  {
    id: 8,
    name: 'Minimalist Evening Dress',
    description: 'Elegant simplicity meets modern design in this sleek evening dress',
    price: 980.00,
    designerId: 6,
    designerName: 'Alex Rivera',
    image: '/api/placeholder/400/300',
    gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.7,
    reviews: 14,
    tags: ['Evening Wear', 'Minimalist', 'Modern'],
    category: 'formal',
    featured: false,
    bestSeller: false
  }
]);

// Sample designers data
const designers = ref([
  {
    id: 1,
    name: 'Emma Wilson',
    bio: 'Award-winning fashion designer specializing in elegant evening wear and winter collections.',
    avatar: '/api/placeholder/100/100',
    rating: 4.8,
    reviews: 42,
    followers: 1256,
    specialties: ['Evening Wear', 'Winter Collection', 'Formal Attire']
  },
  {
    id: 2,
    name: 'Sophia Chen',
    bio: 'Creating breezy, wearable summer collections with sustainable materials.',
    avatar: '/api/placeholder/100/100',
    rating: 4.7,
    reviews: 38,
    followers: 985,
    specialties: ['Summer Wear', 'Sustainable Fashion', 'Casual']
  },
  {
    id: 3,
    name: 'James Mitchell',
    bio: 'Master tailor with 15 years of experience crafting perfect suits and formal wear.',
    avatar: '/api/placeholder/100/100',
    rating: 4.9,
    reviews: 56,
    followers: 782,
    specialties: ['Suits', 'Formal Wear', 'Tailored']
  },
  {
    id: 4,
    name: 'Marcus Zhang',
    bio: 'Urban streetwear designer pushing boundaries between comfort and style.',
    avatar: '/api/placeholder/100/100',
    rating: 4.6,
    reviews: 29,
    followers: 2340,
    specialties: ['Streetwear', 'Urban Fashion', 'Modern']
  },
  {
    id: 5,
    name: 'Priya Sharma',
    bio: 'Blending traditional craftsmanship with contemporary designs for bridal and cultural wear.',
    avatar: '/api/placeholder/100/100',
    rating: 5.0,
    reviews: 47,
    followers: 1856,
    specialties: ['Bridal', 'Traditional', 'Cultural Fusion']
  },
  {
    id: 6,
    name: 'Alex Rivera',
    bio: 'Minimalist designer focusing on timeless pieces with clean lines and perfect fit.',
    avatar: '/api/placeholder/100/100',
    rating: 4.7,
    reviews: 31,
    followers: 943,
    specialties: ['Minimalist', 'Modern', 'Evening Wear']
  }
]);

// Filter states
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedPriceRange = ref({ min: null, max: null });
const sortBy = ref('featured');
const minRating = ref(0);

// Computed filtered designs
const filteredDesigns = computed(() => {
  return designs.value.filter(design => {
    // Search filter
    if (searchQuery.value && !design.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
        !design.description.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        !design.designerName.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory.value && design.category !== selectedCategory.value) {
      return false;
    }
    
    // Price range filter
    if (selectedPriceRange.value.min && design.price < selectedPriceRange.value.min) {
      return false;
    }
    if (selectedPriceRange.value.max && design.price > selectedPriceRange.value.max) {
      return false;
    }
    
    // Rating filter
    if (design.rating < minRating.value) {
      return false;
    }
    
    return true;
  });
});

// Computed sorted designs
const sortedDesigns = computed(() => {
  const designs = [...filteredDesigns.value];
  
  switch (sortBy.value) {
    case 'featured':
      return designs.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    case 'bestSellers':
      return designs.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    case 'newest':
      return designs.sort((a, b) => b.id - a.id);
    case 'priceHigh':
      return designs.sort((a, b) => b.price - a.price);
    case 'priceLow':
      return designs.sort((a, b) => a.price - b.price);
    case 'rating':
      return designs.sort((a, b) => b.rating - a.rating);
    default:
      return designs;
  }
});

// Featured designs for the hero section
const featuredDesigns = computed(() => {
  return designs.value.filter(design => design.featured).slice(0, 3);
});

// Handle category selection
const setCategory = (category) => {
  selectedCategory.value = category === selectedCategory.value ? '' : category;
};

// Reset all filters
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedPriceRange.value = { min: null, max: null };
  sortBy.value = 'featured';
  minRating.value = 0;
};

// Generate star rating display
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-purple-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl font-bold mb-4">Discover Unique Fashion Designs</h1>
            <p class="text-lg mb-6">Connect directly with top designers for custom and ready-to-wear fashion that expresses your unique style.</p>
            <div class="flex space-x-4">
              <button class="btn bg-white text-purple-900 hover:bg-gray-100 border-none">Explore Collections</button>
              <button class="btn btn-outline text-white hover:bg-purple-800">Find Designers</button>
            </div>
          </div>
          
          <div class="md:w-1/2 grid grid-cols-2 gap-4">
            <div v-for="(design, index) in featuredDesigns" :key="design.id" 
                 :class="{'col-span-2': index === 0, 'col-span-1': index > 0}">
              <div class="relative rounded-lg overflow-hidden shadow-lg h-48">
                <img :src="design.image" :alt="design.name" class="w-full h-full object-cover" />
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p class="text-white font-semibold">{{ design.name }}</p>
                  <p class="text-white text-sm opacity-80">by {{ design.designerName }}</p>
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
              !selectedCategory ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            All Designs
          </button>
          <button 
            @click="setCategory('formal')" 
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]', 
              selectedCategory === 'formal' ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            Formal Wear
          </button>
          <button 
            @click="setCategory('casual')" 
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]', 
              selectedCategory === 'casual' ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            Casual Wear
          </button>
          <button 
            @click="setCategory('streetwear')" 
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]', 
              selectedCategory === 'streetwear' ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            Streetwear
          </button>
          <button 
            @click="setCategory('bridal')" 
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]', 
              selectedCategory === 'bridal' ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            Bridal
          </button>
          <button 
            @click="setCategory('summer')" 
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]', 
              selectedCategory === 'summer' ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            Summer
          </button>
          <button 
            @click="setCategory('winter')" 
            :class="[
              'btn btn-sm whitespace-nowrap min-w-[100px]', 
              selectedCategory === 'winter' ? 'bg-purple-900 text-white hover:bg-purple-800' : 'bg-white hover:bg-gray-100'
            ]"
          >
            Winter
          </button>
        </div>
      </div>
    </section>
    
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-1/4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              <button @click="resetFilters" class="text-purple-900 text-sm hover:underline">Reset all filters</button>
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
                  <input type="radio" v-model="minRating" :value="4.5" class="radio radio-sm radio-purple-900" />
                  <span class="ml-2 flex items-center">
                    <span class="flex">
                      <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span class="ml-1">4.5 & up</span>
                  </span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="minRating" :value="4" class="radio radio-sm radio-purple-900" />
                  <span class="ml-2 flex items-center">
                    <span class="flex">
                      <svg v-for="i in 4" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span class="ml-1">4.0 & up</span>
                  </span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="minRating" :value="0" class="radio radio-sm radio-purple-900" />
                  <span class="ml-2">Show all</span>
                </label>
              </div>
            </div>
            
            <!-- Featured Designers -->
            <div>
              <h4 class="font-medium text-gray-700 mb-3">Featured Designers</h4>
              <div class="space-y-3">
                <div v-for="designer in designers.slice(0, 4)" :key="designer.id" class="flex items-center">
                  <div class="avatar mr-3">
                    <div class="w-8 h-8 rounded-full">
                      <img :src="designer.avatar" :alt="designer.name" />
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium">{{ designer.name }}</p>
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="text-xs ml-1">{{ designer.rating }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button class="text-purple-900 text-sm mt-4 hover:underline">View all designers</button>
            </div>
          </div>
        </aside>
        
        <!-- Design Listings -->
        <section class="lg:w-3/4">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-800">
                {{ sortedDesigns.length }} {{ sortedDesigns.length === 1 ? 'Design' : 'Designs' }}
                <span v-if="selectedCategory"> in {{ selectedCategory }}</span>
              </h2>
              
              <div class="flex items-center mt-3 sm:mt-0">
                <label class="mr-2 text-sm text-gray-700">Sort by:</label>
                <select v-model="sortBy" class="select select-bordered select-sm">
                  <option value="featured">Featured</option>
                  <option value="bestSellers">Best Sellers</option>
                  <option value="newest">Newest</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            <!-- Design Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="design in sortedDesigns" :key="design.id" class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                <div class="relative">
                  <img :src="design.image" :alt="design.name" class="w-full h-48 object-cover object-center" />
                  <button class="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  <div v-if="design.bestSeller" class="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Best Seller
                  </div>
                </div>
                
                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-800 truncate">{{ design.name }}</h3>
                    <span class="text-purple-900 font-bold">${{ design.price.toFixed(2) }}</span>
                  </div>
                  
                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <div class="flex">
                        <template v-for="i in getStarRating(design.rating).full" :key="`full-${i}`">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </template>
                        <template v-for="i in getStarRating(design.rating).half" :key="`half-${i}`">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </template>
                        <template v-for="i in getStarRating(design.rating).empty" :key="`empty-${i}`">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </template>
                      </div>
                      <span class="text-sm text-gray-600 ml-1">{{ design.rating }} ({{ design.reviews }})</span>
                    </div>
                  </div>
                  
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ design.description }}</p>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">by <span class="text-purple-900">{{ design.designerName }}</span></span>
                    
                    <div class="flex space-x-2">
                      <button class="btn btn-sm btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                      <button class="btn btn-sm bg-purple-900 hover:bg-purple-800 text-white border-none">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-center mt-8">
              <div class="join">
                <button class="join-item btn btn-sm bg-white hover:bg-gray-100">&laquo;</button>
                <button class="join-item btn btn-sm bg-purple-900 hover:bg-purple-800 text-white">1</button>
                <button class="join-item btn btn-sm bg-white hover:bg-gray-100">2</button>
                <button class="join-item btn btn-sm bg-white hover:bg-gray-100">3</button>
                <button class="join-item btn btn-sm bg-white hover:bg-gray-100">4</button>
                <button class="join-item btn btn-sm bg-white hover:bg-gray-100">&raquo;</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>