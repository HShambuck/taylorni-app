<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// Sample order data - in a real app, you would fetch this based on the order ID
const route = useRoute();
const orderId = route.params.id || "ORD1234";

const order = ref({
  id: orderId,
  customerName: "Alex Johnson",
  status: "In Progress",
  date: "March 1, 2025",
  total: "$350",
  items: [
    { 
      name: "Custom Tailored Suit", 
      fabric: "Italian Wool", 
      color: "Navy Blue",
      price: "$350" 
    }
  ],
  estimatedDelivery: "March 20, 2025",
  deliveryTime: "18:15",
  currentStep: 3,
  steps: [
    {
      id: 1,
      title: "Order confirmed",
      description: "Your custom clothing order has been confirmed",
      time: "17:35",
      completed: true,
      date: "March 1, 2025"
    },
    {
      id: 2,
      title: "Fabric selected",
      description: "Materials have been selected and prepared",
      time: "17:41",
      completed: true,
      date: "March 2, 2025"
    },
    {
      id: 3,
      title: "Measurements taken",
      description: "Your measurements have been recorded",
      time: "10:25",
      completed: true,
      date: "March 3, 2025"
    },
    {
      id: 4,
      title: "Cutting in progress",
      description: "Your fabric is being cut according to measurements",
      time: "",
      completed: false,
      date: ""
    },
    {
      id: 5,
      title: "Sewing in progress",
      description: "Your garment is being sewn by our expert tailors",
      time: "",
      completed: false,
      date: ""
    },
    {
      id: 6,
      title: "Final fitting",
      description: "Garment ready for final fitting and adjustments",
      time: "",
      completed: false,
      date: ""
    },
    {
      id: 7,
      title: "Ready for delivery",
      description: "Your custom garment is ready to be delivered",
      time: "",
      completed: false,
      date: ""
    }
  ]
});

// Determine the progress percentage
const progressPercentage = ref(Math.round((order.value.currentStep / order.value.steps.length) * 100));

// Get the estimated completion date
const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Go back function
const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Header with Back Button -->
    <div class="bg-amber-500 text-white p-4 flex items-center">
      <button @click="goBack" class="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div class="text-xl font-medium">Custom Tailoring</div>
    </div>

    <!-- Main Content -->
    <div class="p-6 max-w-md mx-auto">
      <!-- Order Summary -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-purple-900 mb-1">Track your custom order</h1>
        <p class="text-gray-600">Order #{{ order.id }}</p>
      </div>

      <!-- Delivery Time Card -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-4xl font-bold">{{ order.deliveryTime }}</div>
            <div class="text-gray-500 text-sm mt-1">Estimated time of completion</div>
          </div>
          <div class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
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
              :class="step.completed ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'"
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

      <!-- Order Details Toggle -->
      <div class="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <details class="w-full">
          <summary class="cursor-pointer p-4 flex justify-between items-center">
            <span class="font-medium">View Order Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          
          <div class="p-4 border-t border-gray-200">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Customer:</span>
              <span>{{ order.customerName }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Order Date:</span>
              <span>{{ order.date }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Estimated Completion:</span>
              <span>{{ order.estimatedDelivery }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Total:</span>
              <span class="font-bold">{{ order.total }}</span>
            </div>
            
            <!-- Items -->
            <div class="mt-4">
              <h4 class="font-medium mb-2">Items</h4>
              <div v-for="(item, index) in order.items" :key="index" class="bg-gray-50 p-3 rounded mb-2">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-600">Fabric: {{ item.fabric }}</div>
                <div class="text-sm text-gray-600">Color: {{ item.color }}</div>
                <div class="text-sm font-medium mt-1">{{ item.price }}</div>
              </div>
            </div>
          </div>
        </details>
      </div>

      <!-- Contact Support Button -->
      <div class="mt-6">
        <button class="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition">
          Contact Your Tailor
        </button>
      </div>
    </div>
  </div>
</template>