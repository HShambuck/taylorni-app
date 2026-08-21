<script setup>
import { ref, computed, defineExpose } from "vue";
import { useUserStore } from "@/stores/auth"; // Adjust path as needed
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

// Reactive form state
const signupForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: "client", // Default value
  acceptTerms: false,
});

// Modal reference
const signupModal = ref(null);

// Computed property to validate form
const formValid = computed(() => {
  return (
    signupForm.value.firstName &&
    signupForm.value.lastName &&
    signupForm.value.email &&
    signupForm.value.password &&
    signupForm.value.password === signupForm.value.confirmPassword &&
    signupForm.value.password.length >= 6 &&
    signupForm.value.acceptTerms
  );
});

// Modal functions
const openModal = () => {
  signupModal.value?.showModal();
};

const closeModal = () => {
  signupModal.value?.close();
};

// Form submission
const submitSignup = async () => {
  console.log("Submit button clicked"); // Debug Log

  if (!formValid.value) {
    alert("Please fill in all required fields correctly.");
    return;
  }

  const userDetails = {
    firstName: signupForm.value.firstName,
    lastName: signupForm.value.lastName,
    email: signupForm.value.email,
    password: signupForm.value.password,
    userType: signupForm.value.userType,
  };

  try {
    await userStore.signup(userDetails);
    closeModal();
    switchToSignIn(); // This will emit the "switch-to-signin" event
    // Optional: Add a success message here
  } catch (error) {
    alert(error);
  }
};

// Reset form
const resetForm = () => {
  signupForm.value = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client",
    acceptTerms: false,
  };
};

// Emit event to switch to sign-in modal
const emit = defineEmits(["switch-to-signin"]);
const switchToSignIn = () => {
  emit("switch-to-signin");
};

// Expose modal controls to parent
defineExpose({ openModal, closeModal });
</script>

<template>
  <div>    
    <!-- Sign Up Modal Dialog -->
    <dialog ref="signupModal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-purple-900">Create Account</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Sign Up Form -->
        <form @submit.prevent="submitSignup" class="space-y-4">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-gray-700 text-sm font-medium mb-1">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="signupForm.firstName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label for="lastName" class="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="signupForm.lastName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
          
          <!-- Email -->
          <div>
            <label for="email" class="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="signupForm.email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          
          <!-- Password -->
          <div>
            <label for="password" class="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="signupForm.password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
          </div>
          
          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="signupForm.confirmPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          
          <!-- User Type Selection -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">I am a:</label>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div 
                @click="signupForm.userType = 'designer'"
                :class="[
                  'border rounded-md p-3 flex items-center cursor-pointer',
                  signupForm.userType === 'designer' 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <div class="mr-2">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" 
                    :class="signupForm.userType === 'designer' ? 'border-amber-500' : 'border-gray-400'"
                  >
                    <div v-if="signupForm.userType === 'designer'" class="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <span>Designer</span>
              </div>
              <div 
                @click="signupForm.userType = 'client'"
                :class="[
                  'border rounded-md p-3 flex items-center cursor-pointer',
                  signupForm.userType === 'client' 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <div class="mr-2">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" 
                    :class="signupForm.userType === 'client' ? 'border-amber-500' : 'border-gray-400'"
                  >
                    <div v-if="signupForm.userType === 'client'" class="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <span>Client</span>
              </div>
            </div>
          </div>
          
          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input 
                id="terms" 
                type="checkbox" 
                v-model="signupForm.acceptTerms"
                class="w-4 h-4 border border-gray-300 rounded focus:ring-amber-500"
                required
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-600">
                I agree to the <a href="#" class="text-amber-500 hover:underline">Terms of Service</a> and 
                <a href="#" class="text-amber-500 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full py-3 px-4 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition duration-200"
            :disabled="!formValid"
          >
            Create Account
          </button>
          
          <!-- Sign In Link -->
          <div class="text-center mt-4">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <a href="#" @click.prevent="switchToSignIn" class="text-amber-500 hover:underline">Sign in</a>
            </p>
          </div>
        </form>
        
        <!-- Social Login Options -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-3">
            <a href="#" class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </a>
            <a href="#" class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#3B5998" d="M46.105 0H1.895A1.895 1.895 0 0 0 0 1.895v44.21A1.895 1.895 0 0 0 1.895 48h23.785V29.414h-6.263v-7.355h6.263v-5.406c0-6.304 3.85-9.743 9.452-9.743 2.7 0 5.015.2 5.69.29v6.61h-3.9c-3.057 0-3.656 1.447-3.656 3.571v4.678h7.307l-.955 7.355h-6.352V48h12.839A1.895 1.895 0 0 0 48 46.105V1.895A1.895 1.895 0 0 0 46.105 0z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

