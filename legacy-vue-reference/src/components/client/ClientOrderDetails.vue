<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrdersStore } from "@/stores/ordersStore";

const route = useRoute();
const router = useRouter();
const orderId = route.params.id;
const ordersStore = useOrdersStore();
const isLoading = ref(true);

// Get order from store
const order = ref(null);

// Status color mapping
const statusColors = {
  "In Progress": "bg-amber-500",
  "Shipped": "bg-blue-500",
  "Completed": "bg-green-500",
  "Cancelled": "bg-red-500"
};

// Calculate progress percentage using the store's utility function
const progressPercentage = computed(() => {
  if (!order.value) return 0;
  return ordersStore.calculateProgress(order.value);
});

// Go back function
const goBack = () => {
  router.push('/dashboard/orders');
};

// Fetch order data when component mounts
onMounted(async () => {
  try {
    // Optional: Fetch all orders first if needed
    // await ordersStore.fetchOrders();
    
    // Get the specific order
    order.value = ordersStore.getOrderById(orderId);
    
    if (!order.value) {
      console.error('Order not found');
      // Redirect to orders list
      router.push('/dashboard/orders');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Back Button -->
    <div class="bg-purple-900 text-white p-4 flex items-center">
      <button @click="goBack" class="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div class="text-xl font-medium">Order Details</div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
    </div>

    <!-- Error State - Order Not Found -->
    <div v-else-if="!order" class="p-6 max-w-4xl mx-auto">
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>Order not found. The order may have been deleted or you may not have permission to view it.</p>
      </div>
      <button @click="goBack" class="btn bg-purple-900 border-none hover:bg-purple-800 text-white">
        Return to Orders
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="p-6 max-w-4xl mx-auto">
      <!-- Order Summary Section -->
      <div class="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Order #{{ order.id }}</h1>
          <p class="text-gray-600">Placed on {{ ordersStore.formatDate(order.date) }}</p>
        </div>
        <div class="mt-4 md:mt-0">
          <span class="px-4 py-2 rounded-full text-white font-medium" :class="statusColors[order.status]">
            {{ order.status }}
          </span>
        </div>
      </div>

      <!-- Order Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Customer Information -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">Customer</h2>
          <div class="space-y-3">
            <p class="font-medium">{{ order.customerName }}</p>
            <p class="text-gray-600">{{ order.customerEmail }}</p>
            <p class="text-gray-600">{{ order.customerPhone }}</p>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">Payment</h2>
          <div class="space-y-3">
            <p class="font-medium">Method: {{ order.paymentMethod }}</p>
            <p class="text-gray-600">Total: {{ order.total }}</p>
            <p class="text-gray-600">Status: <span class="text-green-600 font-medium">Paid</span></p>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">Items</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Item</th>
                <th class="text-left py-3 px-4">Details</th>
                <th class="text-center py-3 px-4">Quantity</th>
                <th class="text-right py-3 px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.items" :key="index" class="border-b">
                <td class="py-3 px-4">
                  <p class="font-medium">{{ item.name }}</p>
                </td>
                <td class="py-3 px-4">
                  <p>Fabric: {{ item.fabric }}</p>
                  <p>Color: {{ item.color }}</p>
                </td>
                <td class="text-center py-3 px-4">{{ item.quantity }}</td>
                <td class="text-right py-3 px-4 font-medium">{{ item.price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right py-3 px-4 font-bold">Total:</td>
                <td class="text-right py-3 px-4 font-bold">{{ order.total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Measurements -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">Measurements</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(value, key) in order.measurements" :key="key" class="bg-gray-50 p-3 rounded">
            <p class="text-gray-600 capitalize">{{ key }}</p>
            <p class="font-medium">{{ value }}</p>
          </div>
        </div>
      </div>

      <!-- Order Tracking Section -->
      <div class="bg-green-50 rounded-xl shadow-sm p-6 mb-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-green-800 mb-2">Track your custom order</h2>
          <p class="text-gray-600">Estimated completion: {{ order.estimatedDelivery }}</p>
        </div>

        <!-- Delivery Time Card -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-4xl font-bold">{{ order.deliveryTime }}</div>
              <div class="text-gray-500 text-sm mt-1">Estimated time of completion</div>
            </div>
            <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ progressPercentage }}% Complete
            </div>
          </div>
        </div>

        <!-- Progress Timeline -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Order progress</h2>
          
          <div class="relative">
            <!-- Vertical Line -->
            <div class="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            <!-- Steps -->
            <div v-for="(step, index) in order.steps" :key="step.id" class="flex mb-8 relative z-10">
              <!-- Status Circle -->
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                :class="step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'"
              >
                <svg v-if="step.completed" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else class="text-sm">{{ index + 1 }}</span>
              </div>
              
              <!-- Step Info -->
              <div class="flex-grow">
                <div class="flex justify-between">
                  <h3 class="font-medium" :class="step.completed ? 'text-black' : 'text-gray-500'">
                    {{ step.title }}
                  </h3>
                  <span v-if="step.time" class="text-gray-500 text-sm">{{ step.time }}</span>
                </div>
                <p class="text-gray-500 text-sm mt-1">{{ step.description }}</p>
                <p v-if="step.date" class="text-gray-400 text-xs mt-1">{{ step.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col md:flex-row gap-4">
        <button class="btn bg-purple-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-800 transition flex-1">
          Contact Your Tailor
        </button>
        <button class="btn bg-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-600 transition flex-1">
          Request Changes
        </button>
      </div>
    </div>
  </div>
</template>