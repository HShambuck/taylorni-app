<script setup>
import { ref, computed, watch } from 'vue';

// State variables
const searchQuery = ref('');
const statusFilter = ref('');
const sortBy = ref('date-desc');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isOrderDetailsOpen = ref(false);
const selectedOrder = ref(null);
const originalOrder = ref(null);

// Sample orders data
const orders = ref([
  {
    id: '10234',
    clientName: 'John Doe',
    clientEmail: 'john.doe@example.com',
    clientPhone: '(555) 123-4567',
    orderType: 'Custom Suit',
    amount: 120,
    balanceDue: 0,
    paymentMethod: 'Credit Card',
    date: '2025-03-18',
    status: 'pending',
    items: [
      { name: 'Custom Suit', description: 'Navy Blue, Slim Fit', quantity: 1, price: 120 }
    ],
    measurements: {
      chest: '42"',
      waist: '34"',
      hips: '42"',
      inseam: '32"',
      shoulders: '18"',
      sleeves: '25"'
    },
    notes: 'Client requested extra fast delivery'
  },
  {
    id: '10235',
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@example.com',
    clientPhone: '(555) 987-6543',
    orderType: 'Dress',
    amount: 80,
    balanceDue: 0,
    paymentMethod: 'PayPal',
    date: '2025-03-17',
    status: 'in-progress',
    items: [
      { name: 'Evening Dress', description: 'Red, Size 6', quantity: 1, price: 80 }
    ],
    notes: ''
  },
  {
    id: '10236',
    clientName: 'Robert Johnson',
    clientEmail: 'robert@example.com',
    clientPhone: '(555) 456-7890',
    orderType: 'Shirt Set',
    amount: 150,
    balanceDue: 50,
    paymentMethod: 'Bank Transfer',
    date: '2025-03-16',
    status: 'completed',
    items: [
      { name: 'Dress Shirt', description: 'White, Size L', quantity: 2, price: 75 }
    ],
    notes: 'Client very satisfied with quality'
  }
]);

// Computed properties for order counts
const totalOrders = computed(() => orders.value.length);
const pendingOrders = computed(() => orders.value.filter(order => order.status === 'pending').length);
const inProgressOrders = computed(() => orders.value.filter(order => order.status === 'in-progress').length);
const completedOrders = computed(() => orders.value.filter(order => order.status === 'completed').length);
const canceledOrders = computed(() => orders.value.filter(order => order.status === 'canceled').length);

// Filter and sort orders
const filteredOrders = computed(() => {
  let result = [...orders.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.clientName.toLowerCase().includes(query) ||
      order.orderType.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(order => order.status === statusFilter.value);
  }

  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return result;
});

// Pagination
const totalOrdersCount = computed(() => filteredOrders.value.length);
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredOrders.value.slice(start, start + itemsPerPage.value);
});

// Reset pagination when filters change
watch([searchQuery, statusFilter, sortBy], () => {
  currentPage.value = 1;
});

// Methods
const formatStatus = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'canceled': return 'Canceled';
    default: return status;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatMeasurement = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1);
};

const openOrderDetails = (order) => {
  selectedOrder.value = JSON.parse(JSON.stringify(order));
  originalOrder.value = order;
  isOrderDetailsOpen.value = true;
};

const closeOrderDetails = () => {
  isOrderDetailsOpen.value = false;
  selectedOrder.value = null;
  originalOrder.value = null;
};

const updateOrder = () => {
  const index = orders.value.findIndex(o => o.id === selectedOrder.value.id);
  if (index !== -1) {
    Object.assign(orders.value[index], selectedOrder.value);
    alert('Order updated successfully!');
    closeOrderDetails();
  }
};
</script>


<template>
  <div class="p-6 min-h-screen">
    <!-- Page Header -->
    <div class="bg-white shadow-sm p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Orders</h1>
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
    
    <!-- Order Summary Cards -->
    <div class="pt-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
      
      <!-- Orders Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6">
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
          
          <!-- Filters -->
          <div class="flex flex-wrap gap-3">
            <select 
              class="select select-bordered border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900" 
              v-model="statusFilter"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
            
            <select 
              class="select select-bordered border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900" 
              v-model="sortBy"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="amount-asc">Amount (Low-High)</option>
            </select>
          </div>
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
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.clientName }}</td>
                <td>{{ order.orderType }}</td>
                <td>${{ order.amount }}</td>
                <td>
                  <span 
                    :class="{
                      'badge': true,
                      'badge-warning': order.status === 'pending',
                      'badge-info': order.status === 'in-progress',
                      'badge-success': order.status === 'completed',
                      'badge-error': order.status === 'canceled'
                    }"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td>{{ formatDate(order.date) }}</td>
                <td>
                  <button 
                    class="btn btn-sm btn-ghost"
                    @click="openOrderDetails(order)"
                  >
                    <i class="fas fa-eye text-purple-900"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="text-center py-8 text-gray-500">
                  No orders found matching your criteria
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-500">
            Showing {{ currentPage * itemsPerPage - itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalOrdersCount) }} of {{ totalOrdersCount }} orders
          </p>
          <div class="join">
            <button class="join-item btn" :disabled="currentPage === 1" @click="currentPage--">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="join-item btn">{{ currentPage }}</button>
            <button class="join-item btn" :disabled="currentPage * itemsPerPage >= totalOrdersCount" @click="currentPage++">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order Details Drawer -->
    <div class="drawer drawer-end" :class="{'drawer-open': isOrderDetailsOpen}">
      <input id="order-details-drawer" type="checkbox" class="drawer-toggle" v-model="isOrderDetailsOpen" />
      <div class="drawer-content">
        <!-- Page content here -->
      </div> 
      <div class="drawer-side">
        <label for="order-details-drawer" class="drawer-overlay"></label>
        <div class="p-4 w-full max-w-lg bg-white min-h-full">
          <div v-if="selectedOrder" class="h-full flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-center pb-4 border-b">
              <h3 class="font-bold text-lg">Order #{{ selectedOrder.id }}</h3>
              <button class="btn btn-sm btn-circle btn-ghost" @click="closeOrderDetails">✕</button>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto py-4">
              <!-- Client Information -->
              <div class="mb-6">
                <h4 class="text-sm uppercase text-gray-500 font-semibold mb-3">Client Information</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="mb-2"><strong>Name:</strong> {{ selectedOrder.clientName }}</p>
                  <p class="mb-2"><strong>Email:</strong> {{ selectedOrder.clientEmail }}</p>
                  <p><strong>Phone:</strong> {{ selectedOrder.clientPhone }}</p>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="mb-6">
                <h4 class="text-sm uppercase text-gray-500 font-semibold mb-3">Order Items</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div v-for="(item, index) in selectedOrder.items" :key="index" class="mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                    <div class="flex justify-between">
                      <p class="font-medium">{{ item.name }}</p>
                      <p>${{ item.price }}</p>
                    </div>
                    <p class="text-sm text-gray-600">{{ item.description }}</p>
                    <p class="text-sm">Quantity: {{ item.quantity }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Measurements (if applicable) -->
              <div class="mb-6" v-if="selectedOrder.measurements">
                <h4 class="text-sm uppercase text-gray-500 font-semibold mb-3">Measurements</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-2 gap-3">
                    <p v-for="(value, key) in selectedOrder.measurements" :key="key">
                      <strong>{{ formatMeasurement(key) }}:</strong> {{ value }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Payment Details -->
              <div class="mb-6">
                <h4 class="text-sm uppercase text-gray-500 font-semibold mb-3">Payment Details</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="mb-2"><strong>Total Amount:</strong> ${{ selectedOrder.amount }}</p>
                  <p class="mb-2"><strong>Payment Method:</strong> {{ selectedOrder.paymentMethod }}</p>
                  <p><strong>Balance Due:</strong> ${{ selectedOrder.balanceDue }}</p>
                </div>
              </div>
              
              <!-- Notes/Comments -->
              <div class="mb-6">
                <h4 class="text-sm uppercase text-gray-500 font-semibold mb-3">Notes & Comments</h4>
                <textarea 
                  class="textarea textarea-bordered w-full h-32" 
                  placeholder="Add remarks or special instructions"
                  v-model="selectedOrder.notes"
                ></textarea>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="pt-4 border-t">
              <h4 class="text-sm uppercase text-gray-500 font-semibold mb-3">Status Update</h4>
              <div class="flex items-center space-x-4">
                <select 
                  class="select select-bordered border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-900 w-full" 
                  v-model="selectedOrder.status"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              
              <div class="flex justify-end mt-4 space-x-3">
                <button class="btn btn-outline border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white" @click="closeOrderDetails">
                  Cancel
                </button>
                <button class="btn bg-purple-900 hover:bg-purple-800 text-white border-none" @click="updateOrder">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


