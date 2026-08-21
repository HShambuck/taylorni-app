<template>
  <nav class="bg-amber-50 border-b border-gray-200 shadow-md w-full">
    <div class="px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-purple-900">{{ title }}</h1>

      <div class="flex items-center">
        <!-- Search -->
        <div class="relative mr-4 hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            class="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
          />
          <div class="absolute right-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Search icon for mobile -->
        <div class="md:hidden mr-3 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 hover:text-purple-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Notifications -->
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 hover:text-purple-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div v-if="notifications > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {{ notifications }}
          </div>
          
          <!-- Notifications dropdown -->
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div class="p-3 border-b border-gray-200">
              <h3 class="font-semibold text-gray-700">Notifications</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div v-if="notifications === 0" class="p-4 text-center text-gray-500">
                No new notifications
              </div>
              <div v-else class="divide-y divide-gray-100">
                <div class="p-3 hover:bg-gray-50 cursor-pointer">
                  <p class="text-sm font-medium text-gray-800">New order placed</p>
                  <p class="text-xs text-gray-500 mt-1">Customer ordered custom shirt design</p>
                  <p class="text-xs text-gray-400 mt-2">10 minutes ago</p>
                </div>
                <div class="p-3 hover:bg-gray-50 cursor-pointer">
                  <p class="text-sm font-medium text-gray-800">Measurement updated</p>
                  <p class="text-xs text-gray-500 mt-1">A client updated their measurements</p>
                  <p class="text-xs text-gray-400 mt-2">2 hours ago</p>
                </div>
                <div class="p-3 hover:bg-gray-50 cursor-pointer">
                  <p class="text-sm font-medium text-gray-800">Order status change</p>
                  <p class="text-xs text-gray-500 mt-1">Order #12345 is now ready for delivery</p>
                  <p class="text-xs text-gray-400 mt-2">Yesterday</p>
                </div>
              </div>
            </div>
            <div class="p-2 border-t border-gray-200">
              <button class="w-full text-center text-purple-600 text-sm py-1 hover:bg-purple-50 rounded">
                View all notifications
              </button>
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative ml-5" ref="dropdownRef">
          <div @click="toggleDropdown" class="flex items-center cursor-pointer">
            <div class="h-10 w-10 rounded-full bg-amber-100 overflow-hidden mr-2 border-2 border-transparent hover:border-purple-900 transition-all">
              <!-- Dynamic Avatar -->
              <img :src="userInfo.avatar" :alt="userInfo.fullName" class="w-full h-full object-cover">
            </div>
            <!-- Dynamic User Name -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Dropdown Menu -->
          <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
            <!-- Link to Profile Page -->
            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-900">Profile</router-link>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-900">Settings</a>
            <a href="#" @click="logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useUserStore } from "@/stores/auth"; // Import the user store

// Props
defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});

// Use the user store
const userStore = useUserStore();

// Fetch user info from the store
const userInfo = computed(() => userStore.userInfo);

// Dropdown state
const isOpen = ref(false);
const dropdownRef = ref(null);
const notifications = ref(3);
const showNotifications = ref(false);

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (showNotifications.value) {
    showNotifications.value = false;
  }
};

// Toggle notifications
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (isOpen.value) {
    isOpen.value = false;
  }
};

// Logout function
const logout = () => {
  userStore.logout();
  // Redirect to login page or home page after logout
  window.location.href = "/"; // Adjust the route as needed
};

// Close dropdowns when clicking outside
onClickOutside(dropdownRef, () => {
  isOpen.value = false;
  showNotifications.value = false;
});
</script>