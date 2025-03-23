<template>
  <div @mouseleave="handleMouseLeave" class="h-full">
    <!-- Mobile hamburger menu button -->
    <div v-if="!isLargeScreen" class="fixed top-4 left-4 z-50">
      <button 
        @click="toggleMobileMenu" 
        class="bg-amber-500 rounded-full p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
        >
          <path
            d="M3 12h18M3 6h18M3 18h18"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-if="!isOpen"
          />
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-else
          />
        </svg>
      </button>
    </div>
    
    <!-- Hover trigger area on the left side of the screen (desktop only) -->
    <div 
      v-if="!isPinned && !isExpanded && isLargeScreen"
      @mouseenter="handleMouseEnter"
      class="fixed top-0 left-0 w-4 h-full z-30 cursor-pointer"
    ></div>
    
    <!-- Overlay for mobile -->
    <div
      v-if="isOpen && !isLargeScreen"
      @click="closeSidebar"
      class="fixed inset-0 z-30 transition-opacity duration-300"
      style="background-color: rgba(0, 0, 0, 0.5);"
    ></div>
    
    <!-- Sidebar -->
    <aside
      @mouseenter="handleMouseEnter"
      class="fixed top-0 left-0 h-full z-40 bg-white rounded-r-lg shadow-md transition-all duration-300 overflow-y-auto"
      :class="[
        isLargeScreen 
          ? (isExpanded ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden') 
          : (isOpen ? 'translate-x-0 w-64 p-4' : '-translate-x-full w-64 p-4')
      ]"
    >
      <!-- Logo and Pin button -->
      <div class="flex items-center mb-8 justify-between">
        <div class="flex items-center">
          <div class="bg-amber-500 rounded-full p-2 mr-2">
            <div class="w-8 h-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
              >
                <path
                  d="M3 6h18M3 12h18M3 18h12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <span class="text-2xl font-semibold text-gray-700">Taylorni</span>
        </div>
        
        <!-- Pin button (desktop only) -->
        <button 
          v-if="isLargeScreen"
          @click="togglePin" 
          class="text-gray-500 hover:text-gray-700 p-1"
          title="Pin sidebar"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            :class="{ 'text-amber-500': isPinned }"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" 
              v-if="isPinned"
            />
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 10h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z" 
              v-else
            />
          </svg>
        </button>
        
        <!-- Close button (only for mobile) -->
        <button 
          v-if="!isLargeScreen"
          @click="closeSidebar" 
          class="text-gray-500 hover:text-gray-700"
        >
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
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center p-3 rounded-lg transition-colors group"
          :class="[
            route.path === item.path 
              ? 'bg-amber-500 text-white' 
              : 'text-gray-600 hover:bg-amber-100'
          ]"
          @click="mobileMenuClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <use :href="'#' + item.icon"></use>
          </svg>
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/auth";

const emit = defineEmits(['sidebar-state-change']);

const route = useRoute();
const userStore = useUserStore();

const isOpen = ref(false);
const isExpanded = ref(false);
const isLargeScreen = ref(false);
const isPinned = ref(false);
const hoverTimeout = ref(null);

// Fetch userType from the store
const userType = computed(() => userStore.userType);

// Watch for sidebar state changes and emit them
watch([isExpanded, isPinned], ([newExpanded, newPinned]) => {
  emit('sidebar-state-change', {
    isExpanded: newExpanded,
    isPinned: newPinned
  });
});

// Toggle mobile menu
const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value;
};

// Handle mouse enter to show sidebar (desktop only)
const handleMouseEnter = () => {
  if (isLargeScreen.value && !isPinned.value) {
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value);
      hoverTimeout.value = null;
    }
    isExpanded.value = true;
  }
};

// Handle mouse leave to hide sidebar (desktop only, with delay)
const handleMouseLeave = () => {
  if (isLargeScreen.value && !isPinned.value && isExpanded.value) {
    hoverTimeout.value = setTimeout(() => {
      isExpanded.value = false;
    }, 300);
  }
};

// Toggle pin state (desktop only)
const togglePin = () => {
  isPinned.value = !isPinned.value;
  if (isPinned.value) {
    isExpanded.value = true;
  }
  localStorage.setItem('sidebarPinned', String(isPinned.value));
};

// Close sidebar
const closeSidebar = () => {
  if (isLargeScreen.value) {
    if (!isPinned.value) {
      isExpanded.value = false;
    }
  } else {
    isOpen.value = false;
  }
};

// On mobile, clicking a menu item should close the sidebar
const mobileMenuClick = () => {
  if (!isLargeScreen.value) {
    closeSidebar();
  }
};

// Close sidebar when pressing escape key
const handleEscKey = (e) => {
  if (e.key === 'Escape') {
    if (isLargeScreen.value) {
      if (isPinned.value) {
        isPinned.value = false;
        localStorage.setItem('sidebarPinned', 'false');
      }
      isExpanded.value = false;
    } else {
      isOpen.value = false;
    }
  }
};

// Watch for resize events to handle responsive behavior
const handleResize = () => {
  const newIsLargeScreen = window.innerWidth >= 1024; // lg breakpoint
  if (newIsLargeScreen !== isLargeScreen.value) {
    isLargeScreen.value = newIsLargeScreen;
    if (newIsLargeScreen) {
      isOpen.value = false;
      if (isPinned.value) {
        isExpanded.value = true;
      } else {
        isExpanded.value = false;
      }
    } else {
      isExpanded.value = false;
      isOpen.value = false;
    }
  }
};

onMounted(() => {
  handleResize();
  const savedPinState = localStorage.getItem('sidebarPinned');
  if (savedPinState === 'true') {
    isPinned.value = true;
    if (isLargeScreen.value) {
      isExpanded.value = true;
    }
  } else {
    isPinned.value = false;
    isExpanded.value = false;
  }
  window.addEventListener('resize', handleResize);
  document.addEventListener('keydown', handleEscKey);
  emit('sidebar-state-change', {
    isExpanded: isExpanded.value,
    isPinned: isPinned.value
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('keydown', handleEscKey);
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
  }
});

// Define menu items dynamically
const menuItems = computed(() => {
  if (userType.value === "client") {
    return [
      { name: "Overview", path: "/client", icon: "home" },
      { name: "Orders", path: "/client/orders", icon: "shopping-bag" },
      { name: "Measurements", path: "/client/measurements", icon: "ruler" },
      { name: "Marketplace", path: "/client/marketplace", icon: "storefront" },
      { name: "Shopping Cart", path: "/client/cart", icon: "cart" },
      {
        name: "Custom Orders",
        path: "/client/my-custom-orders",
        icon: "clipboard",
      },
      {
        name: "Place Custom Order",
        path: "/client/custom-order",
        icon: "plus-circle",
      },
      { name: "Virtual Try-On", path: "/client/try-on", icon: "eye" },
      { name: "Profile", path: "/client/profile", icon: "user" },
    ];
  } else if (userType.value === "designer") {
    return [
      { name: "Overview", path: "/designer", icon: "home" },
      { name: "Orders", path: "/designer/orders", icon: "shopping-bag" },
      { name: "Clients", path: "/designer/clients", icon: "users" },
      {
        name: "Manage Designs",
        path: "/designer/designs",
        icon: "paint-brush",
      },
      {
        name: "Marketplace",
        path: "/designer/marketplace",
        icon: "storefront",
      },
      { name: "Analytics", path: "/designer/analytics", icon: "chart-bar" },
      { name: "Profile", path: "/designer/profile", icon: "user" },
    ];
  }
  return [];
});
</script>