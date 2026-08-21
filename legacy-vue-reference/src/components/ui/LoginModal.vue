<script setup>
import { ref, computed, defineExpose } from "vue";
import { useUserStore } from "@/stores/auth";
import { useRouter } from 'vue-router';

// References
const loginModal = ref(null);
const userStore = useUserStore();
const router = useRouter();
const loginError = ref('');
const isLoading = ref(false);

// Form data
const loginForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});

// Open and Close Modal
const openModal = () => loginModal.value.showModal();
const closeModal = () => loginModal.value.close();

// Form validation
const formValid = computed(() => {
  return (
    loginForm.value.email && 
    loginForm.value.password && 
    loginForm.value.password.length >= 6
  );
});

// Submit function
const submitLogin = async () => {
  if (!formValid.value) return;

  isLoading.value = true;
  loginError.value = "";

  try {
    // Call the store login action
    await userStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    // Save to localStorage if "remember me" is checked
    if (loginForm.value.rememberMe) {
      localStorage.setItem(
        "userState",
        JSON.stringify({
          userType: userStore.userType,
          userInfo: userStore.userInfo,
          isAuthenticated: userStore.isAuthenticated,
        })
      );
    }

    // Navigate to appropriate dashboard
    if (userStore.userType === "designer") {
      router.push("/designer");
    } else {
      router.push("/client");
    }

    closeModal();
  } catch (error) {
    loginError.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// Forgot password handler
const forgotPassword = () => {
  console.log("Forgot password requested for:", loginForm.value.email);
};

// Expose modal controls to parent
defineExpose({ openModal, closeModal });
</script>

<template>
  <dialog ref="loginModal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-purple-900">Sign In</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitLogin" class="space-y-4">
        <div v-if="loginError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{{ loginError }}</p>
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">Email</label>
          <input type="email" v-model="loginForm.email" class="w-full px-3 py-2 border rounded-md focus:ring-amber-500" required />
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <input type="password" v-model="loginForm.password" class="w-full px-3 py-2 border rounded-md focus:ring-amber-500" required />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" type="checkbox" v-model="loginForm.rememberMe" class="w-4 h-4 border rounded focus:ring-amber-500" />
            <label for="remember-me" class="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" @click.prevent="forgotPassword" class="text-sm text-amber-500 hover:underline">Forgot password?</a>
        </div>

        <button type="submit" class="w-full py-3 px-4 bg-amber-500 text-white rounded-md hover:bg-amber-600" 
          :disabled="!formValid || isLoading">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account? <a href="#" class="text-amber-500 hover:underline" @click="closeModal">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  </dialog>
</template>