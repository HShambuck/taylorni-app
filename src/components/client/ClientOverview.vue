<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useUserStore } from "@/stores/auth";
import { useOrdersStore } from "@/stores/ordersStore";
import { useMeasurementsStore } from "@/stores/measurementsStore";
import { useRouter } from "vue-router";
import Chart from 'chart.js/auto';

const router = useRouter();
const authStore = useUserStore();
const ordersStore = useOrdersStore();
const measurementsStore = useMeasurementsStore();

// Reactive Refs for Dynamic Data
const user = ref("");
const stats = ref({
  activeOrders: 0,
  savedMeasurements: 0,
  lastTryOn: "N/A",
  wishlistCount: 0,
});

const recentOrders = ref([]);
const purchaseChartRef = ref(null);
const chartInstance = ref(null); // Store chart instance for cleanup
const isLoading = ref(true);

// Computed properties for dashboard stats
const clientOrders = computed(() => {
  if (!authStore.isAuthenticated || !authStore.userInfo?.id) return [];
  return ordersStore.getOrdersByClientId(authStore.userInfo.id) || [];
});

const activeOrders = computed(() => {
  return clientOrders.value.filter(order => order.status === "In Progress").length;
});

const clientMeasurements = computed(() => {
  if (!authStore.isAuthenticated || !authStore.userInfo?.id) return [];
  return measurementsStore.getMeasurementsByClientId(authStore.userInfo.id) || [];
});

const latestMeasurement = computed(() => {
  return measurementsStore.getLatestMeasurementByClientId(authStore.userInfo?.id);
});

// Format date utility function
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Prepare recent orders data
const prepareRecentOrders = async () => {
  // Get up to 5 most recent orders
  const orders = [...clientOrders.value]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);
  
  // Enhance orders with product details
  const enhancedOrders = await Promise.all(
    orders.map(async (order) => {
      const enhancedOrder = await ordersStore.getEnhancedOrder(order.id);
      return {
        id: order.id,
        item: enhancedOrder.productDetails?.name || "Custom Product",
        date: formatDate(order.orderDate),
        status: order.status,
        amount: ordersStore.formatCurrency(order.totalPrice)
      };
    })
  );
  
  recentOrders.value = enhancedOrders;
};

// Initialize chart with order data
const initializeChart = async () => {
  // Destroy previous chart instance if it exists to prevent duplicates
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  // Wait for the DOM to be updated
  await nextTick();
  
  // Ensure the chart element exists in the DOM
  if (!purchaseChartRef.value) {
    console.error("Chart reference element not found");
    return;
  }
  
  // Get canvas context
  const ctx = purchaseChartRef.value.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context from canvas");
    return;
  }
  
  // Group orders by month
  const last6Months = [];
  const today = new Date();
  
  // Create array of last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    last6Months.push(d.toLocaleString('default', { month: 'short' }));
  }
  
  // Count orders per month
  const orderCounts = Array(6).fill(0);
  const customOrderCounts = Array(6).fill(0);
  
  clientOrders.value.forEach(order => {
    const orderDate = new Date(order.orderDate);
    const monthDiff = today.getMonth() - orderDate.getMonth() + 
                    (today.getFullYear() - orderDate.getFullYear()) * 12;
    
    if (monthDiff >= 0 && monthDiff < 6) {
      orderCounts[5 - monthDiff]++;
      
      // Assume custom orders have specific product IDs or flags
      if (order.isCustom) {
        customOrderCounts[5 - monthDiff]++;
      }
    }
  });
  
  // Create chart instance
  try {
    chartInstance.value = new Chart(ctx, {
      type: "line",
      data: {
        labels: last6Months,
        datasets: [
          {
            label: "Orders",
            data: orderCounts,
            borderColor: "#F59E0B",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#F59E0B",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
            fill: true,
          },
          {
            label: "Custom Orders",
            data: customOrderCounts,
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#10B981",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            padding: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { drawBorder: false, borderDash: [5, 5] },
            ticks: { precision: 0 },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
    console.log("Chart successfully created:", chartInstance.value);
  } catch (error) {
    console.error("Error creating chart:", error);
  }
};

// Calculate statistics for dashboard
const loadStatistics = () => {
  // Calculate total completed orders
  const completedOrders = clientOrders.value.filter(
    order => order.status === "Completed"
  ).length;
  
  // Calculate total orders
  const totalOrders = clientOrders.value.length;
  
  // Set statistics values
  stats.value = {
    activeOrders: activeOrders.value,
    savedMeasurements: clientMeasurements.value.length,
    lastTryOn: latestMeasurement.value 
      ? formatDate(latestMeasurement.value.dateRecorded)
      : "Not available",
    wishlistCount: authStore.userInfo?.wishlist?.length || 0,
    completedOrders,
    totalOrders
  };
};

// Fetch all necessary data
const fetchData = async () => {
  isLoading.value = true;
  try {
    // Check authentication
    if (!authStore.isAuthenticated) {
      router.push("/login");
      return;
    }
    
    // Set user name
    user.value = `${authStore.userInfo.firstName} ${authStore.userInfo.lastName}`;
    
    // Fetch orders and measurements if not already loaded
    if (ordersStore.orders.length === 0) {
      await ordersStore.fetchOrders();
    }
    
    if (measurementsStore.measurements.length === 0) {
      await measurementsStore.fetchMeasurements();
    }
    
    // Prepare dashboard data
    await prepareRecentOrders();
    loadStatistics();
    
    // Initialize chart after DOM is fully rendered
    await nextTick();
    setTimeout(() => {
    initializeChart();
  }, 100);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Clean up chart when component is unmounted
const onBeforeUnmount = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
};

onMounted(() => {
  fetchData();
  
  // Add event listener for window resize to redraw chart
  window.addEventListener('resize', () => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });
});

// Clean up
onBeforeUnmount();
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
    </div>
    
    <div v-else>
      <h1 class="text-3xl font-bold text-purple-900 mb-6">Welcome back, {{ authStore.userInfo.firstName }}!</h1>
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  
        <!-- Active Orders -->
        <div class="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div class="bg-amber-500 p-4 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-medium text-gray-600">Active Orders</h2>
            <p class="text-2xl text-purple-900 font-bold mt-1">{{ stats.activeOrders }} in progress</p>
          </div>
        </div>
        
        <!-- Saved Measurements -->
        <div class="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div class="bg-emerald-400 p-4 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-medium text-gray-600">Saved Measurements</h2>
            <p class="text-2xl text-purple-900 font-bold mt-1">{{ stats.savedMeasurements }} profiles</p>
          </div>
        </div>
        
        <!-- Virtual Try-On -->
        <div class="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div class="bg-sky-400 p-4 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-medium text-gray-600">Last Measurement</h2>
            <p class="text-2xl text-purple-900 font-bold mt-1">{{ stats.lastTryOn }}</p>
          </div>
        </div>
      </div>
  
      <!-- Recent Orders Section -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-800">Recent Orders</h2>
            <p class="text-gray-600">Here's a quick look at your latest purchases.</p>
          </div>
          <router-link to="/client/orders" class="text-amber-600 hover:text-amber-700 font-medium flex items-center">
            View All 
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
        
        <div v-if="recentOrders.length === 0" class="py-8 text-center text-gray-500">
          You don't have any orders yet. Start shopping to see your order history.
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left border-b">
                <th class="pb-3 text-gray-600">Item</th>
                <th class="pb-3 text-gray-600">Date</th>
                <th class="pb-3 text-gray-600">Amount</th>
                <th class="pb-3 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="border-b">
                <td class="py-4 text-gray-800 font-medium">{{ order.item }}</td>
                <td class="py-4 text-gray-600">{{ order.date }}</td>
                <td class="py-4 text-gray-800 font-medium">{{ order.amount }}</td>
                <td class="py-4">
                  <span class="px-3 py-1 text-sm font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': order.status === 'Completed',
                      'bg-amber-100 text-amber-800': order.status === 'In Progress'
                    }">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Activity and Trends Charts -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left chart - Purchase Activity -->
        <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Purchase Activity</h2>
          <div v-if="clientOrders.length === 0" class="flex justify-center items-center h-64 text-gray-500">
            No order data available to display
          </div>
          <div v-else class="w-full h-64 relative">
            <canvas ref="purchaseChartRef" id="purchaseChart"></canvas>
          </div>
        </div>
        
        <!-- Right - Quick Stats -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          
          <!-- Stats Grid -->
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Wishlist Items</span>
                <span class="font-medium">{{ stats.wishlistCount }} items</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-amber-500 h-2 rounded-full" 
                  :style="`width: ${Math.min(stats.wishlistCount * 10, 100)}%`"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Orders Completed</span>
                <span class="font-medium">{{ stats.completedOrders }} orders</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-emerald-500 h-2 rounded-full" 
                  :style="`width: ${stats.totalOrders ? (stats.completedOrders / stats.totalOrders) * 100 : 0}%`"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Measurement Accuracy</span>
                <span class="font-medium">{{ stats.savedMeasurements ? '98%' : 'N/A' }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-sky-500 h-2 rounded-full" 
                  :style="`width: ${stats.savedMeasurements ? 98 : 0}%`"></div>
              </div>
            </div>
            
            <div class="mt-6">
              <h3 class="font-medium text-gray-800 mb-2">Popular Categories</h3>
              <div class="flex flex-wrap gap-2">
                <span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">Suits</span>
                <span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded">Casual</span>
                <span class="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded">Kente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>