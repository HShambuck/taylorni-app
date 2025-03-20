<script setup>
import { ref, onMounted } from "vue";
// import Chart from 'chart.js/auto';

const user = ref("Halifax"); // Replace with dynamic user data later
const stats = ref({
  activeOrders: 2,
  savedMeasurements: 3,
  lastTryOn: "5 days ago",
  wishlistCount: 5
});

const recentOrders = ref([
  { id: 1, item: "Casual Denim Jacket", date: "March 5, 2025", status: "Processing", amount: 300 },
  { id: 2, item: "Custom Kente Suit", date: "March 2, 2025", status: "Delivered", amount: 750 },
]);

const purchaseChartRef = ref(null);

onMounted(() => {
  if (purchaseChartRef.value) {
    new Chart(purchaseChartRef.value.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Orders",
            data: [2, 3, 1, 4, 2, 3],
            borderColor: "#F59E0B",
            backgroundColor: "#F59E0B",
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#F59E0B",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
          },
          {
            label: "Custom Orders",
            data: [1, 2, 0, 2, 1, 2],
            borderColor: "#10B981",
            backgroundColor: "#10B981",
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#10B981",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
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
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-purple-900 mb-6">Welcome back, {{ user }}!</h1>
    
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
          <h2 class="text-lg font-medium text-gray-600">Virtual Try-On</h2>
          <p class="text-2xl text-purple-900 font-bold mt-1">Last Used: {{ stats.lastTryOn }}</p>
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
        <router-link to="/dashboard/orders" class="text-amber-600 hover:text-amber-700 font-medium flex items-center">
          View All 
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
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
              <td class="py-4 text-gray-800 font-medium">₵{{ order.amount }}</td>
              <td class="py-4">
                <span class="px-3 py-1 text-sm font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                    'bg-amber-100 text-amber-800': order.status === 'Processing'
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
        <div class="w-full h-64">
          <canvas id="purchaseChart"></canvas>
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
              <span class="font-medium">5 items</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-amber-500 h-2 rounded-full" style="width: 75%"></div>
            </div>
          </div>
          
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">Orders Completed</span>
              <span class="font-medium">12 orders</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full" style="width: 90%"></div>
            </div>
          </div>
          
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">Measurement Accuracy</span>
              <span class="font-medium">98%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-sky-500 h-2 rounded-full" style="width: 98%"></div>
            </div>
          </div>
          
          <div class="mt-6">
            <h3 class="font-medium text-gray-800 mb-2">Popular Categories</h3>
            <div class="flex space-x-2">
              <span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">Suits</span>
              <span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded">Casual</span>
              <span class="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded">Kente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

