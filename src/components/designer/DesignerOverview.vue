<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/auth";
import { useOrdersStore } from "@/stores/ordersStore";
import { useDesignerStore } from "@/stores/designerStore";
import Chart from 'chart.js/auto';

const router = useRouter();
const userStore = useUserStore();
const ordersStore = useOrdersStore();
const designerStore = useDesignerStore();

// State variables
const isLoading = ref(true);
const recentOrders = ref([]);
const clientMessages = ref([]);
const popularDesigns = ref([]);
const earningsChartInstance = ref(null);
const monthlyEarningsData = ref([]);
const monthlyOrdersData = ref([]);
const chartInitialized = ref(false);

// Get current designer info
const designerName = computed(() => {
  return userStore.userInfo ? userStore.userInfo.fullName : "Designer";
});

// Metrics computed based on orders data
const metrics = computed(() => {
  if (!recentOrders.value.length) return { 
    totalOrders: 0, 
    pendingOrders: 0, 
    completedOrders: 0, 
    totalEarnings: 0,
    activeListings: 0,
    avgRating: 0
  };
  
  const allDesignerOrders = ordersStore.getOrdersByDesignerId(userStore.userInfo.id);
  const totalOrders = allDesignerOrders.length;
  const pendingOrders = allDesignerOrders.filter(order => order.status === 'Pending' || order.status === 'In Progress').length;
  const completedOrders = allDesignerOrders.filter(order => order.status === 'Completed').length;
  
  const totalEarnings = allDesignerOrders.reduce((sum, order) => {
    return sum + (order.totalPrice || 0);
  }, 0);

  const activeListings = designerStore.activeListingsCount || 0;
  
  const ratings = allDesignerOrders
    .filter(order => order.rating)
    .map(order => order.rating);
  
  const avgRating = ratings.length 
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) 
    : 0;

  return { 
    totalOrders, 
    pendingOrders, 
    completedOrders, 
    totalEarnings,
    activeListings,
    avgRating
  };
});

// Format earnings for display
const formattedEarnings = computed(() => `${metrics.value.totalEarnings.toLocaleString()}`);

// Initialize data
onMounted(async () => {
  if (!userStore.isAuthenticated || !userStore.isDesigner) {
    router.push('/login');
    return;
  }
  
  try {
    if (!ordersStore.orders.length) {
      await ordersStore.fetchOrders();
    }
    
    const designerId = userStore.userInfo.id;
    const allDesignerOrders = ordersStore.getOrdersByDesignerId(designerId);
    
    recentOrders.value = [...allDesignerOrders]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);
    
    const productCounts = {};
    const productEarnings = {};
    
    allDesignerOrders.forEach(order => {
      if (!productCounts[order.productId]) {
        productCounts[order.productId] = 0;
        productEarnings[order.productId] = 0;
      }
      productCounts[order.productId]++;
      productEarnings[order.productId] += (order.totalPrice || 0);
    });
    
    const productIds = Object.keys(productCounts);
    const productsStore = await import('@/stores/productStore').then(module => module.useProductStore());
    
    popularDesigns.value = productIds
      .map(id => {
        const product = productsStore.getProductById(parseInt(id));
        if (!product) return null;
        
        return {
          id: product.id,
          name: product.name,
          orders: productCounts[id],
          earnings: productEarnings[id],
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3);
    
    prepareMonthlyData(allDesignerOrders);
    
    isLoading.value = false;
    await nextTick();
    
    // Initialize chart with retry logic
    const initSuccess = initEarningsChart();
    if (!initSuccess) {
      setTimeout(() => {
        initEarningsChart();
      }, 100);
    }
    
    clientMessages.value = [
      {
        id: 1, 
        clientId: 101, 
        clientName: "Jane Cooper", 
        avatar: "/images/avatars/avatar-1.jpg", 
        text: "When can I expect to see the first draft?", 
        timeAgo: "2h ago", 
        unread: true
      },
      {
        id: 2, 
        clientId: 102, 
        clientName: "Alex Morgan", 
        avatar: "/images/avatars/avatar-2.jpg", 
        text: "The design looks great! Just a few tweaks needed.", 
        timeAgo: "5h ago", 
        unread: false
      },
      {
        id: 3, 
        clientId: 103, 
        clientName: "Sarah Johnson", 
        avatar: "/images/avatars/avatar-3.jpg", 
        text: "I'm interested in commissioning a custom piece.", 
        timeAgo: "1d ago", 
        unread: true
      }
    ];
    
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
});

// Clean up chart on unmount
onUnmounted(() => {
  if (earningsChartInstance.value) {
    earningsChartInstance.value.destroy();
  }
});

// Prepare data for earnings chart
const prepareMonthlyData = (orders) => {
  const months = [];
  const earnings = [];
  const orderCounts = [];
  
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    months.push(monthName);
    
    earnings.push(0);
    orderCounts.push(0);
  }
  
  orders.forEach(order => {
    const orderDate = new Date(order.orderDate);
    const monthDiff = (today.getMonth() + 12 * today.getFullYear()) - 
                     (orderDate.getMonth() + 12 * orderDate.getFullYear());
    
    if (monthDiff >= 0 && monthDiff < 6) {
      earnings[5 - monthDiff] += (order.totalPrice || 0);
      orderCounts[5 - monthDiff]++;
    }
  });
  
  monthlyEarningsData.value = { months, earnings, orderCounts };
};

// Initialize earnings chart using Chart.js
const initEarningsChart = () => {
  const ctx = document.getElementById('earningsChart');
  if (!ctx) {
    console.warn('Canvas element not found - will retry');
    return false;
  }

  if (earningsChartInstance.value) {
    earningsChartInstance.value.destroy();
    earningsChartInstance.value = null;
  }

  try {
    earningsChartInstance.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthlyEarningsData.value.months,
        datasets: [
          {
            label: 'Earnings ($)',
            data: monthlyEarningsData.value.earnings,
            backgroundColor: 'rgba(88, 28, 135, 0.7)',
            borderColor: 'rgb(88, 28, 135)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Orders',
            data: monthlyEarningsData.value.orderCounts,
            type: 'line',
            borderColor: '#10B981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#10B981',
            pointRadius: 4,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            position: 'left',
            title: {
              display: true,
              text: 'Earnings ($)'
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: 'Orders'
            }
          }
        }
      }
    });
    chartInitialized.value = true;
    return true;
  } catch (error) {
    console.error('Error initializing chart:', error);
    return false;
  }
};

// Navigation functions
const goToOrderDetails = (orderId) => {
  router.push(`/designer/orders/${orderId}`);
};

const goToProductDetails = (productId) => {
  router.push(`/designer/products/${productId}`);
};

const goToClientMessages = (clientId) => {
  router.push(`/designer/messages/${clientId}`);
};

// Format date to readable format
const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  return isNaN(parsedDate)
    ? "Invalid Date"
    : parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

// Get status class for order status
const getStatusClass = (status) => {
  const baseClass = "px-2 py-1 rounded-full";
  switch (status) {
    case "Pending":
      return `text-yellow-600 bg-yellow-100 ${baseClass}`;
    case "In Progress":
      return `text-blue-600 bg-blue-100 ${baseClass}`;
    case "Completed":
      return `text-green-600 bg-green-100 ${baseClass}`;
    case "Canceled":
      return `text-red-600 bg-red-100 ${baseClass}`;
    default:
      return `text-gray-600 bg-gray-100 ${baseClass}`;
  }
};
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
    </div>
    
    <template v-else>
      <!-- 1️⃣ Header (Welcome & Quick Actions) -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Welcome back, {{ designerName }}!
            </h1>
            <p class="text-gray-600 mt-1">
              Here's what's happening with your designs today.
            </p>
          </div>
          <div class="flex gap-3">
            <router-link
              to="/designer/products/new"
              class="btn bg-purple-900 hover:bg-purple-800 text-white border-none"
            >
              <i class="fas fa-plus mr-2"></i> Add New Design
            </router-link>
            <router-link
              to="/designer/shop"
              class="btn btn-outline border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
            >
              <i class="fas fa-store mr-2"></i> Manage Shop
            </router-link>
          </div>
        </div>
      </div>

      <!-- 2️⃣ Key Metrics Summary (Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Total Orders</p>
              <h3 class="text-2xl font-bold mt-2">{{ metrics.totalOrders }}</h3>
            </div>
            <div class="bg-indigo-100 p-3 rounded-full">
              <i class="fas fa-shopping-bag text-indigo-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Pending Orders</p>
              <h3 class="text-2xl font-bold mt-2">{{ metrics.pendingOrders }}</h3>
            </div>
            <div class="bg-yellow-100 p-3 rounded-full">
              <i class="fas fa-clock text-yellow-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Completed Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Completed Orders</p>
              <h3 class="text-2xl font-bold mt-2">
                {{ metrics.completedOrders }}
              </h3>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Total Earnings -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Total Earnings</p>
              <h3 class="text-2xl font-bold mt-2">
                ${{ formattedEarnings }}
              </h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-dollar-sign text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Active Listings -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Active Listings</p>
              <h3 class="text-2xl font-bold mt-2">
                {{ metrics.activeListings }}
              </h3>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="fas fa-tags text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Avg. Rating -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Avg. Rating</p>
              <h3 class="text-2xl font-bold mt-2 flex items-center">
                {{ metrics.avgRating }}
                <i class="fas fa-star text-yellow-400 ml-1 text-lg"></i>
              </h3>
            </div>
            <div class="bg-yellow-100 p-3 rounded-full">
              <i class="fas fa-star text-yellow-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area - Three Column Layout for larger screens -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column (8/12 width) -->
        <div class="lg:col-span-8 space-y-6">
          <!-- 3️⃣ Earnings Chart -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Earnings Summary</h2>
            <div class="h-72">
              <canvas id="earningsChart"></canvas>
            </div>
          </div>

          <!-- Recent Orders Table -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="flex justify-between items-center p-6 border-b">
              <h2 class="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <router-link
                to="/designer/orders"
                class="text-purple-900 hover:text-purple-700 text-sm font-medium"
              >
                View All <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th class="bg-gray-50">Order ID</th>
                    <th class="bg-gray-50">Client</th>
                    <th class="bg-gray-50">Date</th>
                    <th class="bg-gray-50">Status</th>
                    <th class="bg-gray-50 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="order in recentOrders"
                    :key="order.id"
                    class="hover:bg-gray-50 cursor-pointer"
                    @click="goToOrderDetails(order.id)"
                  >
                    <td class="font-medium">#{{ order.id }}</td>
                    <td>{{ order.clientName || 'Client #' + order.clientId }}</td>
                    <td>{{ formatDate(order.orderDate) }}</td>
                    <td>
                      <span :class="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="text-right">${{ (order.totalPrice || 0).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="p-4 text-center border-t"
              v-if="recentOrders.length === 0"
            >
              <p class="text-gray-500">No recent orders found.</p>
            </div>
          </div>
        </div>

        <!-- Right Column (4/12 width) -->
        <div class="lg:col-span-4 space-y-6">
          <!-- 4️⃣ Most Popular Designs -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="flex justify-between items-center p-6 border-b">
              <h2 class="text-lg font-semibold text-gray-800">
                Most Popular Designs
              </h2>
              <router-link
                to="/designer/products"
                class="text-purple-900 hover:text-purple-700 text-sm font-medium"
              >
                View All <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </router-link>
            </div>
            <div class="p-6 space-y-4">
              <div
                v-for="design in popularDesigns"
                :key="design.id"
                class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                @click="goToProductDetails(design.id)"
              >
                <img
                  :src="design.image"
                  :alt="design.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex-grow">
                  <h3 class="font-medium text-gray-800">{{ design.name }}</h3>
                  <div class="flex justify-between mt-1">
                    <span class="text-sm text-gray-500"
                      >{{ design.orders }} orders</span
                    >
                    <span class="text-sm font-medium"
                      >${{ design.earnings.toFixed(2) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              class="p-4 text-center border-t"
              v-if="popularDesigns.length === 0"
            >
              <p class="text-gray-500">No popular designs yet.</p>
            </div>
          </div>

          <!-- 5️⃣ Recent Client Interactions -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="flex justify-between items-center p-6 border-b">
              <h2 class="text-lg font-semibold text-gray-800">Recent Messages</h2>
              <router-link
                to="/designer/messages"
                class="text-purple-900 hover:text-purple-700 text-sm font-medium"
              >
                View All <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </router-link>
            </div>
            <div class="divide-y">
              <div
                v-for="message in clientMessages"
                :key="message.id"
                class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                @click="goToClientMessages(message.clientId)"
              >
                <div class="flex items-start gap-3">
                  <div class="relative">
                    <img
                      :src="message.avatar"
                      :alt="message.clientName"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      v-if="message.unread"
                      class="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"
                    ></span>
                  </div>
                  <div class="flex-grow">
                    <div class="flex justify-between">
                      <h3 class="font-medium text-gray-800">
                        {{ message.clientName }}
                      </h3>
                      <span class="text-xs text-gray-500">{{
                        message.timeAgo
                      }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ message.text }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="p-4 text-center border-t"
              v-if="clientMessages.length === 0"
            >
              <p class="text-gray-500">No recent messages.</p>
            </div>
          </div>

          <!-- 6️⃣ Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div class="grid grid-cols-1 gap-4">
              <router-link
                to="/designer/products/new"
                class="flex items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
              >
                <div class="bg-purple-100 p-3 rounded-full mr-4">
                  <i class="fas fa-plus text-purple-900 text-xl"></i>
                </div>
                <div>
                  <span class="text-gray-700 font-medium block">Add New Product</span>
                  <span class="text-gray-500 text-sm">Upload a new design to your shop</span>
                </div>
              </router-link>

              <router-link
                to="/designer/orders/custom/new"
                class="flex items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
              >
                <div class="bg-purple-100 p-3 rounded-full mr-4">
                  <i class="fas fa-paint-brush text-purple-900 text-xl"></i>
                </div>
                <div>
                  <span class="text-gray-700 font-medium block">Create Custom Order</span>
                  <span class="text-gray-500 text-sm">Set up a custom request for a client</span>
                </div>
              </router-link>

              <router-link
                to="/designer/portfolio"
                class="flex items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
              >
                <div class="bg-purple-100 p-3 rounded-full mr-4">
                  <i class="fas fa-id-card text-purple-900 text-xl"></i>
                </div>
                <div>
                  <span class="text-gray-700 font-medium block">Update Portfolio</span>
                  <span class="text-gray-500 text-sm">Refresh your work showcase</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>