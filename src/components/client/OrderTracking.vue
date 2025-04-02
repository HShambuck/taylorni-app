<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrdersStore } from "@/stores/ordersStore";
import { useUserStore } from "@/stores/auth";

import patternMakingVideo from "@/assets/pattern-making.mp4";
import cuttingVideo from "@/assets/fabric-cutting.mp4";
import sewingVideo from "@/assets/sewing-assembling.mp4";


// Initialize stores
const ordersStore = useOrdersStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// Get order ID from route params
const orderId = route.params.id;

// State
const order = ref(null);
const isLoading = ref(true);
const error = ref(null);
const enhancedOrder = ref(null);
const activeStepIndex = ref(0);

// Fetch order and related details
onMounted(async () => {
  console.log("Order ID from route:", orderId); // Check if ID is correct
  try {
    isLoading.value = true;

    // Make sure orders are loaded
    if (ordersStore.orders.length === 0) {
      console.log("Fetching orders...");
      await ordersStore.fetchOrders();
    }

    // Get basic order
    console.log("All orders:", ordersStore.orders); // Check what orders are available
    const foundOrder = ordersStore.getOrderById(orderId);
    console.log("Found order:", foundOrder); // Check if order was found

    if (!foundOrder) {
      console.error("Order not found");
      error.value = "Order not found";
      isLoading.value = false;
      return;
    }

    order.value = foundOrder;

    // Get enhanced order with all details
    enhancedOrder.value = await ordersStore.getEnhancedOrder(orderId);

    // Check if user has access to this order
    if (userStore.isAuthenticated) {
      const userOrders = await ordersStore.getCurrentUserOrders();
      const hasAccess = userOrders.some(
        (o) => o.id.toString() === orderId.toString()
      );

      if (!hasAccess && !userStore.isAdmin) {
        error.value = "You don't have permission to view this order";
        router.push("/client/orders");
      }
    }

    isLoading.value = false;
  } catch (err) {
    console.error("Error loading order:", err);
    error.value = "Failed to load order details. Please try again.";
    isLoading.value = false;
  }
});

// Computed properties
const progressPercentage = computed(() => {
  if (!order.value) return 0;
  return ordersStore.calculateProgress(order.value);
});

// Get all the progress steps
const orderSteps = computed(() => {
  if (!order.value) return [];

  // Define all possible steps in order
  const allSteps = [
    {
      id: 1,
      title: "Order confirmed",
      description: "Your custom clothing order has been confirmed",
      stage: "Order Placed",
      progress: "Order Placed",
      image: null,
      video: null
    },
    {
      id: 2,
      title: "Pattern Making",
      description: "Creating custom patterns based on your measurements",
      stage: "Drafting Patterns",
      progress: "Pattern Making",
      image: null,
      video: patternMakingVideo
    },
    {
      id: 3,
      title: "Fabric Cutting",
      description: "Your fabric is being cut according to measurements",
      stage: "Cutting Fabric",
      progress: "Fabric Cutting",
      image: null,
      video: cuttingVideo
    },
    {
      id: 4,
      title: "Sewing & Assembly",
      description: "Your garment is being sewn by our expert tailors",
      stage: "Sewing Pieces",
      progress: "Sewing & Assembly",
      image: null,
      video: sewingVideo
    },
    {
      id: 5,
      title: "Fitting & Adjustments",
      description: "Garment ready for final fitting and adjustments",
      stage: "Final Fitting",
      progress: "Fitting & Adjustments",
      image: null,
      video: null
    },
    {
      id: 6,
      title: "Final Assembly & Finishing",
      description: "Final details and finishing touches",
      stage: "Finishing",
      progress: "Final Assembly & Finishing",
      image: null,
      video: null
    },
    {
      id: 7,
      title: "Packaging & Delivery",
      description: "Your custom garment is ready to be delivered",
      stage: "Ready for Delivery",
      progress: "Packaging & Delivery",
      image: null,
      video: null
    },
  ];

  // Find the current step index
  const currentProgressIndex = allSteps.findIndex(
    (step) => step.progress === order.value.progress
  );
  
  // Set active step index to current progress
  if (activeStepIndex.value === 0 && currentProgressIndex >= 0) {
    activeStepIndex.value = currentProgressIndex;
  }

  // Mark steps as completed based on current progress
  return allSteps.map((step, index) => ({
    ...step,
    completed: index <= currentProgressIndex,
    active: index === activeStepIndex.value,
    // Add dates and times (would come from order history in a real app)
    time: index <= currentProgressIndex ? "12:00" : "",
    date:
      index <= currentProgressIndex
        ? new Date(
            new Date(order.value.orderDate).getTime() +
              index * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0]
        : "",
  }));
});

// Get the current active step
const currentStep = computed(() => {
  if (!orderSteps.value.length) return null;
  return orderSteps.value[activeStepIndex.value] || orderSteps.value[0];
});

// Calculate estimated completion time
const deliveryTime = computed(() => {
  if (!order.value?.deliveryDate) return "";
  return "18:00"; // This would be from the actual order data in a real app
});

// Format functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Go back function
const goBack = () => {
  router.push("/client/orders");
};

// Set active step function
const setActiveStep = (index) => {
  activeStepIndex.value = index;
};
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Header with Back Button -->
    <div class="bg-amber-500 text-white p-4 flex items-center">
      <button @click="goBack" class="mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <div class="text-xl font-medium">Order Tracking</div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-6 flex justify-center">
      <div class="loading loading-spinner loading-lg text-purple-900"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-6 max-w-md mx-auto">
      <div class="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="order && !isLoading && !error" class="p-6 max-w-6xl mx-auto">
      <!-- Order Summary -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-purple-900 mb-1">
          Track your custom order
        </h1>
        <p class="text-gray-600">Order #ORD{{ order.id }}</p>
      </div>

      <!-- Delivery Time Card -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-4xl font-bold">{{ deliveryTime }}</div>
            <div class="text-gray-500 text-sm mt-1">
              Estimated time of completion
            </div>
            <div class="font-medium text-gray-700 mt-2">
              {{ formatDate(order.deliveryDate) }}
            </div>
          </div>
          <div
            class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ progressPercentage }}% Complete
          </div>
        </div>
      </div>

      <!-- Progress Timeline - Horizontal on desktop, vertical on mobile -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">Order progress</h2>

        <!-- Desktop Horizontal Timeline -->
        <div class="hidden md:block relative mb-8">
          <!-- Horizontal Line -->
          <div class="absolute left-0 right-0 top-5 h-0.5 bg-gray-200"></div>
          
          <!-- Steps -->
          <div class="flex justify-between relative">
            <div 
              v-for="(step, index) in orderSteps" 
              :key="step.id"
              class="flex flex-col items-center relative z-10 cursor-pointer"
              @click="setActiveStep(index)"
            >
              <!-- Status Circle -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                :class="{
                  'bg-amber-500 text-white': step.completed,
                  'bg-gray-200 text-gray-400': !step.completed,
                  'ring-4 ring-amber-200': step.active
                }"
              >
                <svg
                  v-if="step.completed"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span v-else class="text-sm">{{ index + 1 }}</span>
              </div>
              
              <!-- Step Info -->
              <div class="w-24 text-center">
                <h3
                  class="font-medium text-sm"
                  :class="{
                    'text-black': step.completed,
                    'text-gray-500': !step.completed,
                    'text-amber-600': step.active
                  }"
                >
                  {{ step.title }}
                </h3>
                <p v-if="step.date" class="text-gray-400 text-xs mt-1">
                  {{ formatDate(step.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Vertical Timeline -->
        <div class="md:hidden relative">
          <!-- Vertical Line -->
          <div class="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"></div>

          <!-- Steps -->
          <div
            v-for="(step, index) in orderSteps"
            :key="step.id"
            class="flex mb-8 relative z-10 cursor-pointer"
            @click="setActiveStep(index)"
          >
            <!-- Status Circle -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              :class="{
                'bg-amber-500 text-white': step.completed,
                'bg-gray-200 text-gray-400': !step.completed,
                'ring-4 ring-amber-200': step.active
              }"
            >
              <svg
                v-if="step.completed"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span v-else class="text-sm">{{ index + 1 }}</span>
            </div>

            <!-- Step Info -->
            <div class="flex-grow">
              <div class="flex justify-between">
                <h3
                  class="font-medium"
                  :class="{
                    'text-black': step.completed,
                    'text-gray-500': !step.completed,
                    'text-amber-600': step.active
                  }"
                >
                  {{ step.title }}
                </h3>
                <span v-if="step.time" class="text-gray-500 text-sm">{{
                  step.time
                }}</span>
              </div>
              <p class="text-gray-500 text-sm mt-1">{{ step.description }}</p>
              <p v-if="step.date" class="text-gray-400 text-xs mt-1">
                {{ formatDate(step.date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Image/Video Preview Section (Canvas) -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">Your Garment Progress</h2>
        
        <div v-if="currentStep">
          <div class="overflow-hidden rounded-lg mb-4 bg-gray-100">
            <!-- Video player if available -->
            <video 
              v-if="currentStep.video" 
              :src="currentStep.video"
              controls 
              class="w-full h-64 md:h-96 object-contain"
            >
              <source :src="currentStep.video" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            
            <!-- Image if no video -->
            <img 
              v-else-if="currentStep.image" 
              :src="currentStep.image" 
              :alt="currentStep.title" 
              class="w-full h-64 md:h-96 object-contain"
            />
            
            <!-- Placeholder if no image/video -->
            <div v-else class="w-full h-64 md:h-96 flex items-center justify-center bg-gray-200">
              <p class="text-gray-500">No image available at this stage</p>
            </div>
          </div>
          
          <p class="font-medium text-center text-purple-900">
            {{ currentStep.title }}: {{ currentStep.description }}
          </p>
        </div>
      </div>

      <!-- Order Details Toggle -->
      <div class="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <details class="w-full">
          <summary class="cursor-pointer p-4 flex justify-between items-center">
            <span class="font-medium">View Order Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div class="p-4 border-t border-gray-200">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Order ID:</span>
              <span>ORD{{ order.id }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Order Date:</span>
              <span>{{ formatDate(order.orderDate) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Status:</span>
              <span
                :class="{
                  'text-yellow-600': order.status === 'In Progress',
                  'text-green-600': order.status === 'Completed',
                  'text-blue-600': order.status === 'Shipped',
                }"
                >{{ order.status }}</span
              >
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Current Stage:</span>
              <span>{{ order.currentStage }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Estimated Completion:</span>
              <span>{{ formatDate(order.deliveryDate) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Total:</span>
              <span class="font-bold">{{
                ordersStore.formatCurrency(order.totalPrice)
              }}</span>
            </div>

            <!-- Product Details (if available) -->
            <div v-if="enhancedOrder?.productDetails" class="mt-4">
              <h4 class="font-medium mb-2">Product Details</h4>
              <div class="bg-gray-50 p-3 rounded mb-2">
                <div class="font-medium">
                  {{ enhancedOrder.productDetails.name }}
                </div>
                <div
                  v-if="enhancedOrder.productDetails.description"
                  class="text-sm text-gray-600"
                >
                  {{ enhancedOrder.productDetails.description }}
                </div>
                <div
                  v-if="enhancedOrder.productDetails.category"
                  class="text-sm text-gray-600"
                >
                  Category: {{ enhancedOrder.productDetails.category }}
                </div>
                <div class="text-sm font-medium mt-1">
                  {{
                    ordersStore.formatCurrency(
                      enhancedOrder.productDetails.price
                    )
                  }}
                </div>
              </div>
            </div>

            <!-- Designer Details (if available) -->
            <div v-if="enhancedOrder?.designerDetails" class="mt-4">
              <h4 class="font-medium mb-2">Your Designer</h4>
              <div class="bg-gray-50 p-3 rounded mb-2 flex items-center">
                <div
                  class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white mr-3"
                >
                  {{ enhancedOrder.designerDetails.name?.charAt(0) || "D" }}
                </div>
                <div>
                  <div class="font-medium">
                    {{ enhancedOrder.designerDetails.name || "Designer" }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{
                      enhancedOrder.designerDetails.specialty || "Custom Tailor"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>

      <!-- Contact Support Button -->
      <div class="mt-6">
        <button
          class="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition"
        >
          Contact Your Tailor
        </button>
      </div>
    </div>
  </div>
</template>