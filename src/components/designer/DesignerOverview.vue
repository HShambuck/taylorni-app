<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const designerName = ref("Emily Parker");
const router = useRouter();

const goToOrderDetails = (orderId) => {
  router.push(`/designer/orders/${orderId}`);
};

const goToProductDetails = (productId) => {
  router.push(`/designer/products/${productId}`);
};

defineProps({
  designerName: {
    type: String,
    default: "Ruth Asiedua",
  },
});


const formattedEarnings = computed(() => `${metrics.value.totalEarnings.toLocaleString()}`);

// Metrics data
const metrics = ref({
  totalOrders: 156,
  pendingOrders: 12,
  completedOrders: 143,
  totalEarnings: 8750,
});

// Recent orders data
const recentOrders = ref([
  {
    id: "1234",
    client: "Jane Doe",
    date: "2025-03-15",
    status: "Pending",
    amount: 50.0,
  },
  {
    id: "1235",
    client: "John Smith",
    date: "2025-03-14",
    status: "Completed",
    amount: 80.0,
  },
  {
    id: "1236",
    client: "Alice Johnson",
    date: "2025-03-13",
    status: "Canceled",
    amount: 65.0,
  },
  {
    id: "1237",
    client: "Robert Brown",
    date: "2025-03-12",
    status: "Completed",
    amount: 120.0,
  },
  {
    id: "1238",
    client: "Emma Wilson",
    date: "2025-03-11",
    status: "Pending",
    amount: 95.0,
  },
]);

// formatDate
const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  return isNaN(parsedDate)
    ? "Invalid Date"
    : parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};


// Popular designs data
const popularDesigns = ref([
  {
    id: "d1",
    name: "Elegant Evening Gown",
    orders: 24,
    earnings: 1200.0,
    image: "/images/design1.jpg",
  },
  {
    id: "d2",
    name: "Casual Summer Dress",
    orders: 18,
    earnings: 950.0,
    image: "/images/design2.jpg",
  },
  {
    id: "d3",
    name: "Classic Tuxedo",
    orders: 15,
    earnings: 1100.0,
    image: "/images/design3.jpg",
  },
]);

// Client messages data
const clientMessages = ref([
  {
    id: "m1",
    clientId: "c1",
    clientName: "Sophia Williams",
    text: "Hey! Can you make some adjustments to my order?",
    timeAgo: "2h ago",
    unread: true,
    avatar: "/images/client1.jpg",
  },
  {
    id: "m2",
    clientId: "c2",
    clientName: "Michael Johnson",
    text: "Just received my outfit. It looks amazing!",
    timeAgo: "5h ago",
    unread: false,
    avatar: "/images/client2.jpg",
  },
  {
    id: "m3",
    clientId: "c3",
    clientName: "Emma Davis",
    text: "I’d like to place a custom order. Can we discuss?",
    timeAgo: "1d ago",
    unread: true,
    avatar: "/images/client3.jpg",
  },
]);

// Get status class
const getStatusClass = (status) => {
  const baseClass = "px-2 py-1 rounded-full";
  switch (status) {
    case "Pending":
      return `text-yellow-600 bg-yellow-100 ${baseClass}`;
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
  <div class="p-6 min-h-screen">
    <!-- 1️⃣ Header (Welcome & Quick Actions) -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Orders -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Orders</p>
            <h3 class="text-2xl font-bold mt-2">{{ metrics.totalOrders }}</h3>
            <div class="flex items-center mt-2">
              <span class="text-green-500 flex items-center text-sm">
                <i class="fas fa-arrow-up mr-1"></i> 12%
              </span>
              <span class="text-gray-500 text-sm ml-1">this month</span>
            </div>
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
            <div class="flex items-center mt-2">
              <span class="text-red-500 flex items-center text-sm">
                <i class="fas fa-arrow-up mr-1"></i> 5%
              </span>
              <span class="text-gray-500 text-sm ml-1">this week</span>
            </div>
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
            <div class="flex items-center mt-2">
              <span class="text-green-500 flex items-center text-sm">
                <i class="fas fa-arrow-up mr-1"></i> 18%
              </span>
              <span class="text-gray-500 text-sm ml-1">this month</span>
            </div>
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
            <div class="flex items-center mt-2">
              <span class="text-green-500 flex items-center text-sm">
                <i class="fas fa-arrow-up mr-1"></i> 8%
              </span>
              <span class="text-gray-500 text-sm ml-1">this month</span>
            </div>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <i class="fas fa-dollar-sign text-purple-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area - Two Column Layout for larger screens -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column (2/3 width) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 3️⃣ Recent Orders Table -->
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
                  <td>{{ order.client }}</td>
                  <td>{{ formatDate(order.date) }}</td>
                  <td>
                    <span :class="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="text-right">${{ order.amount.toFixed(2) }}</td>
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

        <!-- 6️⃣ Quick Access Links -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <router-link
              to="/designer/orders"
              class="flex flex-col items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
            >
              <div class="bg-purple-100 p-3 rounded-full mb-3">
                <i class="fas fa-clipboard-list text-purple-900 text-xl"></i>
              </div>
              <span class="text-gray-700 font-medium">Manage Orders</span>
            </router-link>

            <router-link
              to="/designer/marketplace"
              class="flex flex-col items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
            >
              <div class="bg-purple-100 p-3 rounded-full mb-3">
                <i class="fas fa-store text-purple-900 text-xl"></i>
              </div>
              <span class="text-gray-700 font-medium">View Marketplace</span>
            </router-link>

            <router-link
              to="/designer/sketches"
              class="flex flex-col items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
            >
              <div class="bg-purple-100 p-3 rounded-full mb-3">
                <i class="fas fa-pencil-alt text-purple-900 text-xl"></i>
              </div>
              <span class="text-gray-700 font-medium">Upload Sketch</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Right Column (1/3 width) -->
      <div class="space-y-6">
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
              to="/designer/clients"
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
      </div>
    </div>
  </div>
</template>
