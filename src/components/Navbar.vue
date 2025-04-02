<script setup>
import { ref } from "vue";
import LoginModal from "@/components/ui/LoginModal.vue";
import SignupModal from "@/components/ui/SignupModal.vue";

const loginModal = ref(null);
const signupModal = ref(null);

const openLogin = () => loginModal.value.openModal();
const openSignup = () => signupModal.value.openModal();
</script>

<template>
  <!-- Navigation Bar -->
  <nav
    class="bg-linear-to-r from-amber-400 to-yellow-600 py-4 px-20 flex justify-between items-center"
  >
    <div class="text-2xl text-white font-bold">TAILORNII</div>

    <div class="flex space-x-20 items-center">
      <div class="space-x-10 text-lg font-semibold menu-horizontal">
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
          class="btn bg-white text-amber-500 px-4 py-1 rounded-full rounded-r-none border-purple-800 hover:bg-gray-100"
           @click="openLogin"
        >
          Sign in
        </button>

        <button
          class="btn bg-purple-800 border-purple-800 text-white rounded-full rounded-l-none hover:bg-purple-900"
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
</template>
