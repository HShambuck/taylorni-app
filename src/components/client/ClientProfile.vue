<script setup>
import { ref } from "vue";
const user = ref({
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+233 55 123 4567",
  profilePic: "/images/default-avatar.png",
  address: "Madina, Accra, Ghana",
});
const measurements = ref({
  height: "175 cm",
  chest: "95 cm",
  waist: "80 cm",
  hips: "98 cm",
});
const orders = ref([
  { id: 1, item: "Custom Kente Suit", date: "March 5, 2025", status: "Delivered" },
  { id: 2, item: "Casual Denim Jacket", date: "March 2, 2025", status: "Processing" },
]);
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-purple-800">⚙️ Profile</h1>
      <p class="text-base-content/70">Manage your personal information, measurements, and orders</p>
    </div>
    
    <!-- Profile Card -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div class="avatar">
            <div class="w-24 h-24 rounded-full ring ring-primary ring-offset-2">
              <img :src="user.profilePic" alt="Profile Picture" />
            </div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold">{{ user.name }}</h2>
            <p class="text-base-content/70">{{ user.email }}</p>
            <p class="text-base-content/70">{{ user.phone }}</p>
            <p class="text-base-content/70">{{ user.address }}</p>
            <button class="btn bg-purple-900 text-white btn-sm mt-3">
              <span class="mr-1">✏️</span> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Measurements -->
    <div class="card bg-base-200 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title text-xl">📏 Saved Measurements</h2>
        <p class="text-base-content/70 text-sm">These measurements are used for custom orders</p>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div v-for="(value, key) in measurements" :key="key" class="stat bg-base-100 rounded-box shadow-sm">
            <div class="stat-title capitalize">{{ key }}</div>
            <div class="stat-value text-lg">{{ value }}</div>
          </div>
        </div>
        
        <div class="card-actions justify-end mt-4">
          <button class="btn bg-purple-900 text-white btn-sm">
            <span class="mr-1">✏️</span> Update Measurements
          </button>
        </div>
      </div>
    </div>
    
    <!-- Order History -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="card-title text-xl">📦 Order History</h2>
        <p class="text-base-content/70 text-sm">View your past and ongoing orders</p>
        
        <div class="overflow-x-auto mt-4">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="font-medium">{{ order.item }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <div class="badge" 
                       :class="{
                         'badge-success': order.status === 'Delivered',
                         'badge-warning': order.status === 'Processing'
                       }">
                    {{ order.status }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Security -->
    <div class="card bg-base-200 shadow-lg">
      <div class="card-body">
        <h2 class="card-title text-xl">🔒 Security</h2>
        <p class="text-base-content/70 text-sm">Manage your password and security settings</p>
        
        <div class="card-actions justify-end mt-4">
          <button class="btn btn-error btn-sm">
            <span class="mr-1">🔑</span> Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>