<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

// Props (Title Can Be Dynamic)
defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});

const isOpen = ref(false);
const dropdownRef = ref(null);
const notifications = ref(3);
const showNotifications = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});
</script>

<template>
  <nav class="sticky top-0 z-30 bg-amber-50 border-b border-gray-200 shadow-md">
    <div class="px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-purple-900">{{ title }}</h1>

      <div class="flex items-center">
        <!-- Search -->
        <div class="relative mr-4">
          <input
            type="text"
            placeholder="Search..."
            class="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
          />
          <div class="absolute right-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Notifications -->
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 hover:text-purple-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div v-if="notifications > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {{ notifications }}
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="dropdownRef">
          <div @click="toggleDropdown" class="flex items-center cursor-pointer">
            <div class="h-10 w-10 rounded-full bg-amber-100 overflow-hidden mr-2 ml-5 border-2 border-transparent hover:border-purple-900 transition-all">
              <img src="https://via.placeholder.com/40" alt="User Avatar">
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Dropdown Menu -->
          <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-900">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-900">Settings</a>
            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
