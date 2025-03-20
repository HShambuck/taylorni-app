<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  userType: { type: String, required: true } // Accept "client" or "designer"
});

const route = useRoute();

// Define menu items dynamically
const menuItems = computed(() => {
  if (props.userType === 'client') {
    return [
      { name: 'Overview', path: '/client', icon: 'home' },
      { name: 'Orders', path: '/client/orders', icon: 'shopping-bag' },
      { name: 'Measurements', path: '/client/measurements', icon: 'ruler' },
      { name: 'Marketplace', path: '/client/marketplace', icon: 'storefront' },
      { name: 'Shopping Cart', path: '/client/cart', icon: 'cart' },
      { name: 'Custom Orders', path: '/client/my-custom-orders', icon: 'clipboard' },
      { name: 'Place Custom Order', path: '/client/custom-order', icon: 'plus-circle' },
      { name: 'Virtual Try-On', path: '/client/try-on', icon: 'eye' },
      { name: 'Profile', path: '/client/profile', icon: 'user' }
    ];
  } else {
    return [
      { name: 'Overview', path: '/designer', icon: 'home' },
      { name: 'Orders', path: '/designer/orders', icon: 'shopping-bag' },
      { name: 'Clients', path: '/designer/clients', icon: 'users' },
      { name: 'Manage Designs', path: '/designer/designs', icon: 'paint-brush' },
      { name: 'Marketplace', path: '/designer/marketplace', icon: 'storefront' },
      { name: 'Analytics', path: '/designer/analytics', icon: 'chart-bar' },
      { name: 'Profile', path: '/designer/profile', icon: 'user' }
    ];
  }
});
</script>

<template>
  <aside class="fixed top-0 left-0 h-[90%] w-64 bg-white ml-6 mt-6 rounded-lg shadow-md p-4 lg:block hidden">
    <!-- Logo -->
    <div class="flex items-center mb-8">
      <div class="bg-amber-500 rounded-full p-2 mr-2">
        <div class="w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      <span class="text-2xl font-semibold text-gray-700">Taylorni</span>
    </div>

    <!-- Navigation -->
    <nav class="space-y-2">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center p-3 rounded-lg transition-colors"
        :class="{ 'bg-amber-500 text-white': route.path === item.path, 'text-gray-600 hover:bg-amber-100': route.path !== item.path }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <use :href="'#' + item.icon"></use>
        </svg>
        <span class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>
