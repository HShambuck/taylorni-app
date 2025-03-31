<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useOrdersStore } from '@/stores/ordersStore';
import { useMeasurementsStore } from '@/stores/measurementsStore';
import { useClientStore } from '@/stores/clientStore';
import { useUserStore } from '@/stores/auth'; // Import user store

// Initialize stores
const ordersStore = useOrdersStore();
const measurementsStore = useMeasurementsStore();
const clientStore = useClientStore();
const userStore = useUserStore(); // User store for authentication

// State variables
const searchQuery = ref('');
const statusFilter = ref('');
const sortBy = ref('date-desc');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isOrderDetailsOpen = ref(false);
const selectedOrder = ref(null);
const originalOrder = ref(null);
const isLoading = ref(true);
const isChatOpen = ref(false);
const chatMessage = ref('');
const dateRangeFilter = ref({ start: null, end: null });
const clientFilter = ref('');
const showRevenueInsights = ref(false);

// Current designer ID
const currentDesignerId = computed(() => userStore.userInfo?.id || null);

// Fetch orders data on component mount
onMounted(async () => {
  isLoading.value = true;
  try {
    // First ensure we have the current designer ID
    if (!currentDesignerId.value) {
      throw new Error('No designer logged in');
    }
    
    await ordersStore.fetchOrders();
    await measurementsStore.fetchMeasurements();
    await clientStore.fetchClients();
    
    // Filter orders to only show those for the current designer
    const designerOrders = ordersStore.getOrdersByDesignerId(currentDesignerId.value);
    if (!designerOrders || designerOrders.length === 0) {
      console.log('No orders found for this designer');
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoading.value = false;
  }
});

// Get orders from store - filtered for current designer
const orders = computed(() => {
  if (!currentDesignerId.value) return [];
  return ordersStore.getOrdersByDesignerId(currentDesignerId.value);
});

// Computed properties for order counts - now based on designer's orders
const totalOrders = computed(() => orders.value.length);
const pendingOrders = computed(() => 
  orders.value.filter(order => order.status === 'pending').length
);
const inProgressOrders = computed(() => 
  orders.value.filter(order => order.status === 'in-progress').length
);
const completedOrders = computed(() => 
  orders.value.filter(order => order.status === 'completed').length
);
const canceledOrders = computed(() => 
  orders.value.filter(order => order.status === 'canceled').length
);

// Revenue insights - now based on designer's orders
const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => {
    return sum + (getOrderAmount(order) || 0);
  }, 0);
});

const paidRevenue = computed(() => {
  return orders.value
    .filter(order => order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + (getOrderAmount(order) || 0), 0);
});

const pendingRevenue = computed(() => {
  return orders.value
    .filter(order => order.paymentStatus !== 'Paid')
    .reduce((sum, order) => sum + (getOrderAmount(order) || 0), 0);
});

const monthlyRevenue = computed(() => {
  const lastSixMonths = {};
  const today = new Date();
  
  // Initialize last 6 months with 0 revenue
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
    lastSixMonths[monthKey] = 0;
  }
  
  // Sum revenue by month for designer's orders
  orders.value.forEach(order => {
    const orderDate = new Date(getOrderDate(order));
    if (orderDate) {
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
      if (lastSixMonths[monthKey] !== undefined) {
        lastSixMonths[monthKey] += getOrderAmount(order) || 0;
      }
    }
  });
  
  // Format for display
  return Object.entries(lastSixMonths).map(([key, value]) => {
    const [year, month] = key.split('-');
    return {
      month: new Date(year, month - 1).toLocaleString('default', { month: 'short' }),
      revenue: value
    };
  });
});

// Rest of your component remains the same...
// [Keep all other computed properties, methods, and template code]
</script>

<template>
  <div class="p-6 min-h-screen">
    <!-- Page Header -->
    <div class="bg-white shadow-sm p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Designer Orders</h1>
          <p class="text-gray-600 mt-1">Manage and track all your client orders</p>
        </div>
        <div class="flex space-x-3">
          <button class="btn bg-purple-900 hover:bg-purple-800 text-white border-none">
            <i class="fas fa-plus mr-2"></i> Create Order
          </button>
          <button class="btn btn-outline border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white">
            <i class="fas fa-download mr-2"></i> Export Orders
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
    </div>
    
    <div v-else class="pt-6">
      <!-- Order Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <!-- Total Orders -->
        <div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div class="h-10 w-10 rounded-lg bg-purple-900 flex items-center justify-center mr-3">
            <i class="fas fa-shopping-bag text-white"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Orders</p>
            <p class="text-xl font-bold">{{ totalOrders }}</p>
          </div>
        </div>
        
        <!-- Pending Orders -->
        <div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div class="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center mr-3">
            <i class="fas fa-clock text-white"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">Pending Orders</p>
            <p class="text-xl font-bold">{{ pendingOrders }}</p>
          </div>
        </div>
        
        <!-- In-Progress Orders -->
        <div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div class="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3">
            <i class="fas fa-spinner text-white"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">In-Progress</p>
            <p class="text-xl font-bold">{{ inProgressOrders }}</p>
          </div>
        </div>
        
        <!-- Completed Orders -->
        <div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div class="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center mr-3">
            <i class="fas fa-check text-white"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">Completed</p>
            <p class="text-xl font-bold">{{ completedOrders }}</p>
          </div>
        </div>
        
        <!-- Canceled Orders -->
        <div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div class="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center mr-3">
            <i class="fas fa-times text-white"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">Canceled</p>
            <p class="text-xl font-bold">{{ canceledOrders }}</p>
          </div>
        </div>
      </div>
      
      <!-- Revenue Insights Section (Collapsible) -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center mb-4 cursor-pointer" @click="showRevenueInsights = !showRevenueInsights">
          <h2 class="text-lg font-bold text-gray-800">Revenue Insights</h2>
          <i :class="['fas', showRevenueInsights ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        
        <div v-if="showRevenueInsights" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Revenue Cards -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg mb-2">Total Revenue</h3>
            <p class="text-2xl font-bold text-purple-900">{{ formatCurrency(totalRevenue) }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg mb-2">Paid Revenue</h3>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(paidRevenue) }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg mb-2">Pending Payments</h3>
            <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(pendingRevenue) }}</p>
          </div>
          
          <!-- Monthly Revenue Chart -->
          <div class="col-span-1 md:col-span-3 bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg mb-4">Monthly Revenue Trends</h3>
            <div class="h-64 flex items-end justify-between">
              <div v-for="(month, index) in monthlyRevenue" :key="index" class="flex flex-col items-center w-full">
                <div 
                  class="bg-purple-600 w-full rounded-t-md" 
                  :style="{ height: `${(month.revenue / (Math.max(...monthlyRevenue.map(m => m.revenue)) || 1)) * 180}px` }"
                ></div>
                <p class="text-xs mt-2">{{ month.month }}</p>
                <p class="text-xs font-semibold">{{ formatCurrency(month.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Orders Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex flex-col md:flex-row justify-between items-start mb-6">
          <!-- Search Bar -->
          <div class="relative w-full md:w-64 mb-4 md:mb-0">
            <input 
              type="text" 
              placeholder="Search orders..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-transparent"
              v-model="searchQuery"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          
          <!-- Advanced Filters Button (Dropdown) -->
          <div class="dropdown dropdown-end w-full md:w-auto mb-4 md:mb-0">
            <label tabindex="0" class="btn btn-outline border-gray-300 w-full md:w-auto">
              <i class="fas fa-filter mr-2"></i> Advanced Filters
            </label>
            <div tabindex="0" class="dropdown-content z-10 menu p-4 shadow bg-white rounded-lg w-96">
              <div class="mb-4">
                <label class="text-sm font-medium block mb-2">Order Status</label>
                <select 
                  class="select select-bordered w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900" 
                  v-model="statusFilter"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="text-sm font-medium block mb-2">Client</label>
                <select 
                  class="select select-bordered w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900" 
                  v-model="clientFilter"
                >
                  <option value="">All Clients</option>
                  <option v-for="client in clientsList" :key="client.id" :value="client.name">
                    {{ client.name }}
                  </option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="text-sm font-medium block mb-2">Date Range</label>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs">From</label>
                    <input 
                      type="date" 
                      class="input input-bordered w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900"
                      v-model="dateRangeFilter.start"
                    />
                  </div>
                  <div>
                    <label class="text-xs">To</label>
                    <input 
                      type="date" 
                      class="input input-bordered w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900"
                      v-model="dateRangeFilter.end"
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex justify-between">
                <button 
                  class="btn btn-sm btn-outline border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
                  @click="resetFilters"
                >
                  Reset Filters
                </button>
                <button 
                  class="btn btn-sm bg-purple-900 hover:bg-purple-800 text-white border-none"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          <!-- Sort Option -->
          <select 
            class="select select-bordered border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900 w-full md:w-auto ml-0 md:ml-3 mb-4 md:mb-0" 
            v-model="sortBy"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High-Low)</option>
            <option value="amount-asc">Amount (Low-High)</option>
          </select>
        </div>
        
        <!-- Orders Table -->
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Order Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
                <td>#{{ order.id }}</td>
                <td>{{ getClientName(order) }}</td>
                <td>{{ getOrderType(order) }}</td>
                <td>{{ formatCurrency(getOrderAmount(order)) }}</td>
                <td>
                  <span 
                    :class="{
                      'badge': true,
                      'py-2 px-3': true,
                      'badge-warning': order.status === 'pending',
                      'badge-info': order.status === 'in-progress' || order.status === 'In Progress',
                      'badge-success': order.status === 'completed',
                      'badge-error': order.status === 'canceled',
                      'bg-purple-500 text-white': order.status === 'modification-required'
                    }"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td>{{ formatDate(getOrderDate(order)) }}</td>
                <td>
                  <div class="flex space-x-2">
                                        <button 
                      class="btn btn-sm btn-ghost"
                      @click="openOrderDetails(order)"
                      title="View Details"
                    >
                      <i class="fas fa-eye text-purple-900"></i>
                    </button>
                    <div class="dropdown dropdown-end">
                      <label tabindex="0" class="btn btn-sm btn-ghost">
                        <i class="fas fa-ellipsis-v text-gray-500"></i>
                      </label>
                      <ul tabindex="0" class="dropdown-content z-10 menu p-2 shadow bg-white rounded-lg w-40">
                        <li><a @click="openOrderDetails(order)"><i class="fas fa-eye mr-2"></i> View</a></li>
                        <li><a @click="startChat(order)"><i class="fas fa-comment mr-2"></i> Message</a></li>
                        <li v-if="order.status !== 'completed'">
                          <a @click="updateOrderStatus(order, 'completed')">
                            <i class="fas fa-check mr-2"></i> Complete
                          </a>
                        </li>
                        <li v-if="order.status !== 'canceled'">
                          <a @click="updateOrderStatus(order, 'canceled')" class="text-red-500">
                            <i class="fas fa-times mr-2"></i> Cancel
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr> 
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
         <div class="flex justify-center mt-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-sm btn-outline border-gray-300 text-gray-500 hover:bg-gray-100" :class="{ 'cursor-not-allowed': currentPage === 1 }">
            Previous
          </button>
          <span class="mx-2 text-sm">Page {{ currentPage }} of {{ Math.ceil(totalOrdersCount / itemsPerPage) }}</span>
          <button @click="nextPage" :disabled="currentPage === Math.ceil(totalOrdersCount / itemsPerPage)" class="btn btn-sm btn-outline border-gray-300 text-gray-500 hover:bg-gray-100" :class="{ 'cursor-not-allowed': currentPage === Math.ceil(totalOrdersCount / itemsPerPage) }">
            Next
          </button> 
        </div>
      </div>
    </div>
  </div>
</template>