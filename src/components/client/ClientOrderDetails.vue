<script setup>
import { ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Simulated order data (Replace with API call later)
const orders = ref({
  "ORD1234": {
    id: "ORD1234",
    status: "In Progress",
    date: "March 1, 2025",
    total: "$120",
    items: [
      { name: "Custom Suit", price: "$80", image: "/images/custom-suit.jpg" },
      { name: "Tailored Shirt", price: "$40", image: "/images/tailored-shirt.jpg" },
    ],
    trackingSteps: ["Order Placed", "Processing", "Fabric Cutting", "Sewing"],
    currentStep: 2, // Index of current progress
    estimatedDelivery: "March 15, 2025",
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, Accra, Ghana"
  },
  "ORD5678": {
    id: "ORD5678",
    status: "Shipped",
    date: "February 28, 2025",
    total: "$95",
    items: [{ name: "Casual Blazer", price: "$95", image: "/images/casual-blazer.jpg" }],
    trackingSteps: ["Order Placed", "Processing", "Shipped"],
    currentStep: 2,
    estimatedDelivery: "March 5, 2025",
    paymentMethod: "PayPal",
    shippingAddress: "456 Oak Ave, Kumasi, Ghana"
  },
});

// Get order details based on the ID in the route
const order = orders.value[route.params.id] || null;

// Status badge colors
const statusColors = {
  "In Progress": "badge-warning",
  "Shipped": "badge-info",
  "Completed": "badge-success",
  "Cancelled": "badge-error"
};

if (!order) {
  router.push("/dashboard/orders"); // Redirect if order is not found
}
</script>

<template>
  <div v-if="order" class="p-6">
    <!-- Header with back button -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">📦 Order Details</h1>
      <button
        @click="router.push('/dashboard/orders')"
        class="btn btn-outline btn-sm"
      >
        🔙 Back to Orders
      </button>
    </div>

    <!-- Order Summary Card -->
    <div class="card bg-base-100 shadow-md mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row justify-between">
          <div>
            <h2 class="card-title text-xl">Order #{{ order.id }}</h2>
            <div class="flex items-center mt-2">
              <div class="badge" :class="statusColors[order.status]">{{ order.status }}</div>
              <span class="mx-2">•</span>
              <span class="text-gray-600">{{ order.date }}</span>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="stat px-0">
              <div class="stat-title">Total Amount</div>
              <div class="stat-value text-amber-500">{{ order.total }}</div>
              <div class="stat-desc">Est. Delivery: {{ order.estimatedDelivery }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Progress Tracking -->
    <div class="card bg-base-100 shadow-md mb-6">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">📊 Order Progress</h2>
        
        <div class="overflow-x-auto">
          <ul class="steps steps-horizontal w-full">
            <li 
              v-for="(step, index) in order.trackingSteps" 
              :key="step"
              class="step" 
              :class="{ 'step-primary': index <= order.currentStep }"
            >
              {{ step }}
            </li>
          </ul>
        </div>
        
        <div class="alert alert-success shadow-sm mt-4" v-if="order.status === 'Shipped'">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your order is on its way! Expected delivery on {{ order.estimatedDelivery }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div class="card bg-base-100 shadow-md mb-6">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">🛍️ Order Items</h2>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th>Details</th>
                <th class="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.items" :key="index">
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img :src="item.image" :alt="item.name" />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ item.name }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-ghost badge-sm">Custom Tailored</span>
                </td>
                <td class="text-right font-semibold">{{ item.price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-right font-bold">Total:</td>
                <td class="text-right font-bold">{{ order.total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Shipping Information -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">📋 Order Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-700">Shipping Address</h3>
            <p class="mt-1">{{ order.shippingAddress }}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-700">Payment Method</h3>
            <p class="mt-1">{{ order.paymentMethod }}</p>
          </div>
        </div>
        
        <div class="card-actions justify-end mt-6">
          <button class="btn bg-purple-800 border-none hover:bg-purple-900">
            📱 Track Shipment
          </button>
          <button class="btn btn-outline">
            ❓ Need Help?
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="p-6">
    <div class="alert alert-error shadow-md">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Order not found. Redirecting to orders page...</span>
      </div>
    </div>
  </div>
</template>