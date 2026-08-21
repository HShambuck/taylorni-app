<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useClientStore } from '@/stores/clientStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { useUserStore } from '@/stores/auth';

const router = useRouter();
const clientStore = useClientStore();
const ordersStore = useOrdersStore();
const userStore = useUserStore();

// Initialize data
onMounted(async () => {
  if (clientStore.clients.length === 0) {
    await clientStore.fetchClients();
  }
  
  if (ordersStore.orders.length === 0) {
    await ordersStore.fetchOrders();
  }
  
  // Reset filters and pagination
  currentPage.value = 1;
  searchQuery.value = '';
  statusFilter.value = '';
});

// Router
function viewClient(id) {
  router.push(`/designer/clients/${id}`);
}

// Computed data for client stats
const clientStats = computed(() => {
  // Get current designer ID
  const designerId = userStore.userInfo?.id;
  if (!designerId) return defaultStats.value;
  
  const designerOrders = ordersStore.getOrdersByDesignerId(designerId);
  
  // Get unique client IDs from orders
  const uniqueClientIds = [...new Set(designerOrders.map(order => order.clientId))];
  
  // Get clients who ordered more than once
  const clientOrderCounts = designerOrders.reduce((acc, order) => {
    acc[order.clientId] = (acc[order.clientId] || 0) + 1;
    return acc;
  }, {});
  
  const repeatClientIds = Object.keys(clientOrderCounts).filter(
    clientId => clientOrderCounts[clientId] > 1
  );
  
  // Get active clients (with in-progress orders)
  const activeOrders = designerOrders.filter(order => order.status === 'In Progress');
  const activeClientIds = [...new Set(activeOrders.map(order => order.clientId))];
  
  // Get new clients (ordered in the last month)
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const newOrders = designerOrders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= lastMonth;
  });
  
  const newClientIds = [...new Set(newOrders.map(order => order.clientId))];
  
  return [
    {
      title: 'Total Clients',
      value: uniqueClientIds.length,
      iconBg: 'purple-100',
      iconColor: 'text-purple-900',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      growth: uniqueClientIds.length > 0 ? `${Math.round((newClientIds.length / uniqueClientIds.length) * 100)}% this month` : '0% this month'
    },
    {
      title: 'Active Clients',
      value: activeClientIds.length,
      iconBg: 'green-100',
      iconColor: 'text-green-600',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      growth: activeClientIds.length > 0 ? `${Math.round((activeClientIds.length / uniqueClientIds.length) * 100)}% of total` : '0% of total'
    },
    {
      title: 'New Clients',
      value: newClientIds.length,
      iconBg: 'blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      growth: `${newClientIds.length} this month`
    },
    {
      title: 'Repeat Clients',
      value: repeatClientIds.length,
      iconBg: 'purple-100',
      iconColor: 'text-purple-900',
      iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      growth: repeatClientIds.length > 0 ? `${Math.round((repeatClientIds.length / uniqueClientIds.length) * 100)}% of total` : '0% of total'
    }
  ];
});

// Default stats for when we don't have data yet
const defaultStats = ref([
  {
    title: 'Total Clients',
    value: 0,
    iconBg: 'purple-100',
    iconColor: 'text-purple-900',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    growth: '0% this month'
  },
  {
    title: 'Active Clients',
    value: 0,
    iconBg: 'green-100',
    iconColor: 'text-green-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    growth: '0% of total'
  },
  {
    title: 'New Clients',
    value: 0,
    iconBg: 'blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    growth: '0 this month'
  },
  {
    title: 'Repeat Clients',
    value: 0,
    iconBg: 'purple-100',
    iconColor: 'text-purple-900',
    iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    growth: '0% of total'
  }
]);

// Filtering and sorting
const searchQuery = ref('');
const statusFilter = ref('');
const selectAll = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;

// Get designer's clients from orders
const designerClients = computed(() => {
  const designerId = userStore.userInfo?.id;
  if (!designerId || !ordersStore.orders.length) return [];
  
  // Get all orders for this designer
  const designerOrders = ordersStore.getOrdersByDesignerId(designerId);
  
  // Get unique client IDs
  const clientIds = [...new Set(designerOrders.map(order => order.clientId))];
  
  // Get client details for each ID
  const clients = clientIds.map(clientId => {
    const client = clientStore.getClientById(clientId);
    if (!client) return null;
    
    // Get all orders for this client with this designer
    const clientOrders = designerOrders.filter(order => order.clientId === clientId);
    
    // Get latest order date
    const latestOrder = clientOrders.reduce((latest, order) => {
      return !latest || new Date(order.orderDate) > new Date(latest.orderDate) ? order : latest;
    }, null);
    
    // Calculate total spent
    const totalSpent = clientOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    // Determine if client is active (has at least one active order)
    const isActive = clientOrders.some(order => order.status === 'In Progress');
    
    return {
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      location: client.location || 'N/A',
      phone: client.phone || 'N/A',
      lastOrder: latestOrder ? latestOrder.orderDate : 'N/A',
      totalOrders: clientOrders.length,
      totalSpent: ordersStore.formatCurrency(totalSpent),
      status: isActive ? 'Active' : 'Inactive',
      selected: false
    };
  }).filter(Boolean); // Remove null entries
  
  return clients;
});

// Computed properties
const filteredClients = computed(() => {
  let result = designerClients.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(client => 
      client.name.toLowerCase().includes(query) || 
      client.email.toLowerCase().includes(query) ||
      client.location.toLowerCase().includes(query) ||
      (client.phone && client.phone.toLowerCase().includes(query))
    );
  }
  
  if (statusFilter.value) {
    result = result.filter(client => client.status === statusFilter.value);
  }
  
  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalClients = computed(() => {
  let result = designerClients.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(client => 
      client.name.toLowerCase().includes(query) || 
      client.email.toLowerCase().includes(query) ||
      client.location.toLowerCase().includes(query) ||
      (client.phone && client.phone.toLowerCase().includes(query))
    );
  }
  
  if (statusFilter.value) {
    result = result.filter(client => client.status === statusFilter.value);
  }
  
  return result.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalClients.value / itemsPerPage);
});

const paginationStart = computed(() => {
  return totalClients.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, totalClients.value);
});

// Methods
function getBadgeClass(status) {
  switch (status) {
    case 'Active': return 'badge-success';
    case 'Inactive': return 'badge-error';
    case 'New': return 'badge-warning';
    default: return 'badge-info';
  }
}

function toggleSelectAll() {
  designerClients.value.forEach(client => {
    if (
      !searchQuery.value ||
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) {
      client.selected = selectAll.value;
    }
  });
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page) {
  currentPage.value = page;
}

function messageClient(id) {
  console.log(`Message client with ID: ${id}`);
  // Open messaging interface or redirect to messaging page
  // router.push(`/designer/messages?client=${id}`);
}

function callClient(id) {
  const client = designerClients.value.find(c => c.id === id);
  if (client && client.phone) {
    window.location.href = `tel:${client.phone}`;
  } else {
    console.log(`No phone number available for client with ID: ${id}`);
  }
}

function emailClient(id) {
  const client = designerClients.value.find(c => c.id === id);
  if (client && client.email) {
    window.location.href = `mailto:${client.email}`;
  } else {
    console.log(`No email available for client with ID: ${id}`);
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Client Page Header -->
    <div class="p-6 bg-white shadow-sm">
      <h1 class="text-2xl font-bold text-gray-800">Clients</h1>
      <p class="text-gray-600">Manage your client relationships and track client information</p>
    </div>

    <!-- Client Statistics -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in clientStats" :key="stat.title" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-500 text-sm">{{ stat.title }}</p>
              <p class="text-3xl font-bold text-gray-800">{{ stat.value }}</p>
            </div>
            <div :class="['p-3', 'rounded-full', stat.iconBg]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="stat.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath" />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-green-500 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {{ stat.growth }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Search and Filter -->
    <div class="p-6 pt-0">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <h2 class="text-lg font-semibold mb-4 md:mb-0">Client List</h2>
          <div class="flex flex-col md:flex-row w-full md:w-auto gap-4">
            <div class="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search clients..." 
                class="input input-bordered w-full pl-10" 
                v-model="searchQuery"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div class="flex gap-2">
              <select class="select select-bordered w-full md:w-auto" v-model="statusFilter">
                <option value="">All Clients</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="New">New</option>
              </select>
              <button class="btn bg-purple-900 hover:bg-purple-800 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Table -->
    <div class="p-6 pt-0">
      <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th class="bg-gray-50">
                <label>
                  <input type="checkbox" class="checkbox checkbox-sm" v-model="selectAll" @change="toggleSelectAll" />
                </label>
              </th>
              <th class="bg-gray-50">Client</th>
              <th class="bg-gray-50">Email</th>
              <th class="bg-gray-50">Last Order</th>
              <th class="bg-gray-50">Total Orders</th>
              <th class="bg-gray-50">Total Spent</th>
              <th class="bg-gray-50">Status</th>
              <th class="bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredClients.length === 0">
              <td colspan="8" class="text-center py-8">
                <div class="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p class="text-gray-500">No clients found</p>
                  <p class="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
            <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
              <td>
                <label>
                  <input type="checkbox" class="checkbox checkbox-sm" v-model="client.selected" />
                </label>
              </td>
              <td>
                <div class="flex items-center space-x-3">
                  <div class="avatar">
                    <div class="mask mask-squircle w-10 h-10 bg-purple-100 flex items-center justify-center">
                      <span class="text-purple-900 font-bold">{{ client.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ client.name }}</div>
                    <div class="text-sm opacity-50">{{ client.location }}</div>
                  </div>
                </div>
              </td>
              <td>{{ client.email }}</td>
              <td>{{ client.lastOrder }}</td>
              <td>{{ client.totalOrders }}</td>
              <td>{{ client.totalSpent }}</td>
              <td>
                <div :class="`badge ${getBadgeClass(client.status)} gap-2`">{{ client.status }}</div>
              </td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-ghost" @click="viewClient(client.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="btn btn-sm btn-ghost" @click="messageClient(client.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button class="btn btn-sm btn-ghost" @click="callClient(client.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center p-4">
          <div class="text-sm text-gray-500">
            <span v-if="totalClients > 0">
              Showing {{ paginationStart }}-{{ paginationEnd }} of {{ totalClients }} clients
            </span>
            <span v-else>
              No clients found
            </span>
          </div>
          <div class="join" v-if="totalPages > 1">
            <button class="join-item btn btn-sm" @click="prevPage" :disabled="currentPage === 1">«</button>
            <button 
              v-for="page in totalPages" 
              :key="page" 
              class="join-item btn btn-sm" 
              :class="{ 'bg-purple-900 text-white': currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button class="join-item btn btn-sm" @click="nextPage" :disabled="currentPage === totalPages">»</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>