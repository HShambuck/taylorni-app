<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/auth.js"; // Import the store
import Sidebar from "@/components/Sidebar.vue";
import DashboardNavbar from "@/components/DashboardNavbar.vue";

// Initialize Store
const userStore = useUserStore();

// Reactive User State
const userType = computed(() => userStore.userType);
const userInfo = computed(() => userStore.userInfo);
const isAuthenticated = computed(() => userStore.isAuthenticated);

// Dashboard Title
const dashboardTitle = computed(() => 
  userType.value === "client" ? "Client Dashboard" : "Designer Dashboard"
);

// Sidebar State
const sidebarState = ref({
  isExpanded: false,
  isPinned: false,
});

// Handle Sidebar State Changes
const handleSidebarStateChange = (newState) => {
  sidebarState.value = newState;
};

// Re-initialize store on page refresh
onMounted(() => {
  userStore.initializeStore();
});
</script>

<template>
  <div v-if="isAuthenticated" class="flex min-h-screen bg-amber-50">
    <!-- Sidebar -->
    <Sidebar 
      :userType="userType" 
      @sidebar-state-change="handleSidebarStateChange" 
    />

    <!-- Main Content -->
    <div 
      class="flex-1 transition-all duration-300"
      :class="[
        (sidebarState.isExpanded && sidebarState.isPinned) ? 'lg:ml-64' : 'lg:ml-0'
      ]"
    >
      <DashboardNavbar :title="dashboardTitle" :user="userInfo" />

      <div class="p-6">
        <router-view /> <!-- 🚀 Displays the active page -->
      </div>
    </div>
  </div>

  <!-- Show Login Prompt if Not Authenticated -->
  <div v-else class="flex justify-center items-center h-screen bg-gray-100">
    <p class="text-2xl font-semibold text-gray-600">🚀 Please log in to access the dashboard.</p>
  </div>
</template>
