<script setup>
import { ref } from "vue";
import LoginModal from "@/components/ui/LoginModal.vue";
import SignupModal from "@/components/ui/SignupModal.vue";
const loginModal = ref(null);
const signupModal = ref(null);
const openLogin = () => loginModal.value.openModal();
const openSignup = () => signupModal.value.openModal();
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
  <!-- Navigation Bar -->
  <nav
    class="bg-gradient-to-r from-amber-400 to-yellow-600 py-4 px-4 md:px-20 flex justify-between items-center"
  >
    <div class="text-2xl text-white font-bold">TAILORNII</div>
    
    <!-- Mobile Menu Button (visible only on small screens) -->
    <button @click="toggleMobileMenu" class="md:hidden text-white">
      <!-- Hamburger icon when closed -->
      <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <!-- X icon when open -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <!-- Desktop Menu (hidden on small screens) -->
    <div class="hidden md:flex space-x-8 md:space-x-20 items-center">
      <div class="space-x-4 md:space-x-10 text-lg font-semibold menu-horizontal">
        <router-link to="/" class="text-white hover:text-gray-200"
          >Home</router-link
        >
        <router-link to="/about" class="text-white hover:text-gray-200"
          >About</router-link
        >
        <router-link to="/contact" class="text-white hover:text-gray-200"
          >Contact</router-link
        >
      </div>
      <div>
        <button
          class="btn bg-white text-amber-500 px-3 py-1 rounded-full rounded-r-none border-purple-800 hover:bg-gray-100"
          @click="openLogin"
        >
          Sign in
        </button>
        <button
          class="btn bg-purple-800 border-purple-800 text-white px-3 py-1 rounded-full rounded-l-none hover:bg-purple-900"
          @click="openSignup"
        >
          Sign up
        </button>
        <!-- Modals -->
        <LoginModal ref="loginModal" />
        <SignupModal ref="signupModal" />
      </div>
    </div>
  </nav>
  
  <!-- Mobile Menu (slides down when hamburger is clicked) -->
  <div v-if="mobileMenuOpen" class="md:hidden bg-amber-400 text-white p-4 transition-all duration-300 ease-in-out">
    <div class="flex flex-col space-y-4">
      <router-link to="/" class="text-white hover:text-gray-200 font-semibold py-2"
        >Home</router-link
      >
      <router-link to="/about" class="text-white hover:text-gray-200 font-semibold py-2"
        >About</router-link
      >
      <router-link to="/contact" class="text-white hover:text-gray-200 font-semibold py-2"
        >Contact</router-link
      >
      <div class="flex pt-2">
        <button
          class="btn bg-white text-amber-500 px-4 py-1 rounded-full rounded-r-none border-purple-800 hover:bg-gray-100"
          @click="openLogin"
        >
          Sign in
        </button>
        <button
          class="btn bg-purple-800 border-purple-800 text-white px-4 py-1 rounded-full rounded-l-none hover:bg-purple-900"
          @click="openSignup"
        >
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>