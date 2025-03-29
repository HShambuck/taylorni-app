<script setup>
import { ref, computed } from "vue";

const orders = ref([
  { 
    id: "ORD1234", 
    status: "In Progress", 
    date: "March 1, 2025", 
    total: "$120",
    items: 2,
    estimatedDelivery: "March 15, 2025"
  },
  { 
    id: "ORD5678", 
    status: "Shipped", 
    date: "February 28, 2025", 
    total: "$95",
    items: 1,
    estimatedDelivery: "March 5, 2025"
  },
  { 
    id: "ORD9101", 
    status: "Completed", 
    date: "February 20, 2025", 
    total: "$150",
    items: 3,
    estimatedDelivery: "February 28, 2025"
  },
]);

const statusColors = {
  "In Progress": "badge-warning",
  "Shipped": "badge-info",
  "Completed": "badge-success",
  "Cancelled": "badge-error"
};

// Filter options
const statusFilter = ref("All");
const searchQuery = ref("");

// Computed filtered orders
const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  // Apply status filter
  if (statusFilter.value !== "All") {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order => 
      order.id.toLowerCase().includes(query) || 
      order.date.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Get counts for stats
const getTotalSpent = () => {
  return orders.value.reduce((total, order) => {
    return total + parseFloat(order.total.replace('$', ''));
  }, 0).toFixed(2);
};
</script>

<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-purple-900">📦 My Orders</h1>
      <p class="text-gray-600 mt-1">Track and manage your purchases</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="stat bg-white text-gray-900 shadow-md rounded-lg">
        <div class="stat-figure text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <div class="stat-title text-gray-800">Total Orders</div>
        <div class="stat-value text-amber-500">{{ orders.length }}</div>
        <div class="stat-desc text-gray-800">All time purchases</div>
      </div>
      
      <div class="stat bg-white text-gray-900 shadow-md rounded-lg">
        <div class="stat-figure text-purple-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="stat-title text-gray-800">Active Orders</div>
        <div class="stat-value text-purple-900">{{ orders.filter(o => o.status !== 'Completed').length }}</div>
        <div class="stat-desc text-gray-800">Currently in progress</div>
      </div>
      
      <div class="stat bg-white text-gray-900 shadow-md rounded-lg">
        <div class="stat-figure text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-title text-gray-800">Total Spent</div>
        <div class="stat-value text-green-600">${{ getTotalSpent() }}</div>
        <div class="stat-desc text-gray-800">Lifetime value</div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="card bg-white text-gray-900 shadow-md mb-6">
      <div class="card-body p-4">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <!-- Search -->
          <div class="form-control w-full md:w-1/2">
            <div class="input-group">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search orders..."
                class="input input-bordered w-full"
              />
              <button class="btn btn-square bg-amber-500 border-none hover:bg-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="form-control w-full md:w-auto">
            <select v-model="statusFilter" class="select select-bordered w-full">
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <!-- New Order Button -->
          <router-link to="/dashboard/marketplace" class="btn bg-purple-900 border-none hover:bg-purple-900 text-white w-full md:w-auto">
            🛍️ Shop Now
          </router-link>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card bg-white text-gray-900 shadow-md overflow-hidden">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="text-gray-900">Order ID</th>
                <th class="text-gray-900">Status</th>
                <th class="text-gray-900">Date</th>
                <th class="text-gray-900">Items</th>
                <th class="text-gray-900">Est. Delivery</th>
                <th class="text-right text-gray-900">Total</th>
                <th class="text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id" class="hover">
                <td>
                  <div class="font-bold">{{ order.id }}</div>
                </td>
                <td>
                  <div class="badge" :class="statusColors[order.status]">{{ order.status }}</div>
                </td>
                <td>{{ order.date }}</td>
                <td>{{ order.items }} item(s)</td>
                <td>{{ order.estimatedDelivery }}</td>
                <td class="text-right font-semibold">{{ order.total }}</td>
                <td>
                  <div class="flex gap-2">
                    <router-link :to="`/client/orders/id`" class="btn btn-sm bg-amber-500 border-none hover:bg-amber-600">
                      View
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="p-8 text-center">
          <div class="alert alert-info shadow-sm">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No orders found. Try adjusting your filters or make your first purchase!</span>
            </div>
          </div>
          <router-link to="/dashboard/marketplace" class="btn bg-purple-900 border-none hover:bg-purple-900 mt-4">
            Browse Marketplace
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>