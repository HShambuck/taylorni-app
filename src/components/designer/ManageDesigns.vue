<script setup>
import { ref } from 'vue';

// Sample design data
const designs = ref([
  {
    id: 1,
    name: 'Elegant Evening Gown',
    description: 'A stunning floor-length gown perfect for formal events and galas',
    price: 1200.00,
    status: 'Live',
    image: '/api/placeholder/400/300',
    views: 342,
    orders: 24,
    category: 'formal'
  },
  {
    id: 2,
    name: 'Casual Summer Dress',
    description: 'Light and breezy summer dress with floral patterns',
    price: 950.00,
    status: 'Live',
    image: '/api/placeholder/400/300',
    views: 256,
    orders: 18,
    category: 'casual'
  },
  {
    id: 3,
    name: 'Business Suit',
    description: 'Professional tailored suit for business meetings and formal work environments',
    price: 1450.00,
    status: 'Live',
    image: '/api/placeholder/400/300',
    views: 189,
    orders: 12,
    category: 'formal'
  },
  {
    id: 4,
    name: 'Winter Coat',
    description: 'Warm and stylish winter coat with fur-lined hood',
    price: 1100.00,
    status: 'Draft',
    image: '/api/placeholder/400/300',
    views: 87,
    orders: 0,
    category: 'winter'
  },
  {
    id: 5,
    name: 'Streetwear Collection',
    description: 'Urban-inspired casual wear for everyday style',
    price: 850.00,
    status: 'Pending',
    image: '/api/placeholder/400/300',
    views: 134,
    orders: 0,
    category: 'streetwear'
  },
  {
    id: 6,
    name: 'Summer Beachwear',
    description: 'Lightweight and colorful beachwear for tropical vacations',
    price: 750.00,
    status: 'Out of Stock',
    image: '/api/placeholder/400/300',
    views: 276,
    orders: 32,
    category: 'summer'
  }
]);

// Function to get status class for badge
const getStatusClass = (status) => {
  switch (status) {
    case 'Live':
      return 'bg-green-500';
    case 'Draft':
      return 'bg-gray-500';
    case 'Pending':
      return 'bg-yellow-500';
    case 'Out of Stock':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Sidebar -->
    <div class="flex">
      <!-- Main Content -->
      <div class="flex-1 p-6">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-purple-900">Design Management</h1>
            <p class="text-gray-600">Manage your fashion designs and collections</p>
          </div>
          
          <div class="flex gap-4">
            <div class="relative">
              <input type="text" placeholder="Search designs..." class="input input-bordered w-80 pr-10" />
              <button class="absolute right-3 top-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <div class="flex gap-2">
              <button class="btn bg-white border-gray-300 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>List</span>
              </button>
              <button class="btn bg-purple-900 text-white hover:bg-purple-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Grid</span>
              </button>
            </div>
            
            <button class="btn bg-purple-900 text-white hover:bg-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Design</span>
            </button>
          </div>
        </div>

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Total Designs</h3>
                <p class="text-3xl font-bold">156</p>
                <p class="flex items-center text-green-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  12% this month
                </p>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Active Designs</h3>
                <p class="text-3xl font-bold">98</p>
                <p class="flex items-center text-green-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  8% this week
                </p>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Pending Approval</h3>
                <p class="text-3xl font-bold">12</p>
                <p class="flex items-center text-red-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  5% this week
                </p>
              </div>
              <div class="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Total Earnings</h3>
                <p class="text-3xl font-bold">$8,750</p>
                <p class="flex items-center text-green-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  8% this month
                </p>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow p-4 mb-8">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Category</label>
              <select class="select select-bordered w-full">
                <option value="">All Categories</option>
                <option value="casual">Casual Wear</option>
                <option value="formal">Formal Wear</option>
                <option value="streetwear">Streetwear</option>
                <option value="summer">Summer Collection</option>
                <option value="winter">Winter Collection</option>
              </select>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Status</label>
              <select class="select select-bordered w-full">
                <option value="">All Statuses</option>
                <option value="live">Live</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Sort By</label>
              <select class="select select-bordered w-full">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="highest">Highest Price</option>
                <option value="lowest">Lowest Price</option>
              </select>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Price Range</label>
              <div class="flex items-center gap-2">
                <input type="number" placeholder="Min" class="input input-bordered w-full" />
                <span>-</span>
                <input type="number" placeholder="Max" class="input input-bordered w-full" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Design Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="design in designs" :key="design.id" class="bg-white rounded-lg shadow overflow-hidden">
            <div class="relative">
              <img :src="design.image" :alt="design.name" class="w-full h-48 object-cover object-center" />
              <div :class="`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(design.status)}`">
                {{ design.status }}
              </div>
            </div>
            
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium">{{ design.name }}</h3>
                <span class="font-semibold">${{ design.price.toFixed(2) }}</span>
              </div>
              
              <p class="text-gray-600 text-sm mb-4">{{ design.description }}</p>
              
              <div class="flex items-center text-sm mb-4">
                <span class="flex items-center text-gray-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ design.views }} views
                </span>
                <span class="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {{ design.orders }} orders
                </span>
              </div>
              
              <div class="flex gap-2">
                <button class="btn btn-sm flex-1 bg-purple-900 hover:bg-purple-800 text-white">Edit</button>
                <button class="btn btn-sm flex-1 bg-white hover:bg-gray-100 border border-gray-300">Preview</button>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-sm btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </label>
                  <ul tabindex="0" class="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Duplicate</a></li>
                    <li><a>Share</a></li>
                    <li><a class="text-red-600">Delete</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center">
          <p class="text-gray-500">Showing 1-9 of 156 designs</p>
          <div class="flex gap-1">
            <button class="btn btn-sm bg-white hover:bg-gray-100 border border-gray-300">Previous</button>
            <button class="btn btn-sm bg-purple-900 hover:bg-purple-800 text-white">1</button>
            <button class="btn btn-sm bg-white hover:bg-gray-100 border border-gray-300">2</button>
            <button class="btn btn-sm bg-white hover:bg-gray-100 border border-gray-300">3</button>
            <button class="btn btn-sm bg-white hover:bg-gray-100 border border-gray-300">...</button>
            <button class="btn btn-sm bg-white hover:bg-gray-100 border border-gray-300">17</button>
            <button class="btn btn-sm bg-white hover:bg-gray-100 border border-gray-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

