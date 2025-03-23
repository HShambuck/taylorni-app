<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const isLoading = ref(false);

// Password form data
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

// Display options
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation
const validationErrors = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

// Emits
const emit = defineEmits(['success', 'error']);

// Toggle password visibility
const togglePasswordVisibility = (field) => {
  if (field === 'current') showCurrentPassword.value = !showCurrentPassword.value;
  if (field === 'new') showNewPassword.value = !showNewPassword.value;
  if (field === 'confirm') showConfirmPassword.value = !showConfirmPassword.value;
};

// Validate form
const validateForm = () => {
  let isValid = true;
  validationErrors.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
  
  // Validate current password
  if (!passwordForm.value.currentPassword) {
    validationErrors.value.currentPassword = "Current password is required";
    isValid = false;
  }
  
  // Validate new password
  if (!passwordForm.value.newPassword) {
    validationErrors.value.newPassword = "New password is required";
    isValid = false;
  } else if (passwordForm.value.newPassword.length < 6) {
    validationErrors.value.newPassword = "Password must be at least 6 characters";
    isValid = false;
  }
  
  // Validate confirm password
  if (!passwordForm.value.confirmPassword) {
    validationErrors.value.confirmPassword = "Please confirm your new password";
    isValid = false;
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    validationErrors.value.confirmPassword = "Passwords do not match";
    isValid = false;
  }
  
  return isValid;
};

// Change password
const changePassword = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  
  try {
    // In a real app, you'd verify the current password with the server
    // and update to the new password
    
    // For demo purposes, we'll simulate the process with localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userEmail = userStore.userInfo.email;
    
    const userIndex = users.findIndex(user => user.email === userEmail);
    
    if (userIndex === -1) {
      emit('error', 'User not found. Please try logging in again.');
      return;
    }
    
    // Check if current password matches
    if (users[userIndex].password !== passwordForm.value.currentPassword) {
      validationErrors.value.currentPassword = "Current password is incorrect";
      isLoading.value = false;
      return;
    }
    
    // Update password
    users[userIndex].password = passwordForm.value.newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    
    // Reset form
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    
    emit('success', 'Password changed successfully!');
  } catch (error) {
    emit('error', 'Failed to change password. Please try again.');
    console.error('Error changing password:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <h3 class="text-xl font-bold mb-4">Change Password</h3>
    
    <form @submit.prevent="changePassword" class="space-y-4 max-w-md mx-auto">
      <!-- Current Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <div class="relative">
          <input 
            :type="showCurrentPassword ? 'text' : 'password'" 
            v-model="passwordForm.currentPassword" 
            class="w-full px-3 py-2 border rounded-md focus:ring-amber-500 pr-10"
          />
          <button 
            type="button"
            @click="togglePasswordVisibility('current')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="validationErrors.currentPassword" class="text-red-500 text-xs mt-1">
          {{ validationErrors.currentPassword }}
        </p>
      </div>
      
      <!-- New Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <div class="relative">
          <input 
            :type="showNewPassword ? 'text' : 'password'" 
            v-model="passwordForm.newPassword" 
            class="w-full px-3 py-2 border rounded-md focus:ring-amber-500 pr-10"
          />
          <button 
            type="button"
            @click="togglePasswordVisibility('new')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="validationErrors.newPassword" class="text-red-500 text-xs mt-1">
          {{ validationErrors.newPassword }}
        </p>
        <p v-else class="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
      </div>
      
      <!-- Confirm New Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <div class="relative">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="passwordForm.confirmPassword" 
            class="w-full px-3 py-2 border rounded-md focus:ring-amber-500 pr-10"
          />
          <button 
            type="button"
            @click="togglePasswordVisibility('confirm')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="validationErrors.confirmPassword" class="text-red-500 text-xs mt-1">
          {{ validationErrors.confirmPassword }}
        </p>
      </div>
      
      <!-- Password Strength Indicator (Optional) -->
      <div v-if="passwordForm.newPassword">
        <label class="block text-sm font-medium text-gray-700 mb-1">Password Strength</label>
        <div class="h-2 bg-gray-200 rounded">
          <div 
            class="h-full rounded" 
            :class="{
              'bg-red-500': passwordForm.newPassword.length < 6,
              'bg-yellow-500': passwordForm.newPassword.length >= 6 && passwordForm.newPassword.length < 8,
              'bg-green-500': passwordForm.newPassword.length >= 8
            }"
            :style="{ width: `${Math.min(100, passwordForm.newPassword.length * 12.5)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ 
            passwordForm.newPassword.length < 6 ? 'Weak' : 
            passwordForm.newPassword.length < 8 ? 'Moderate' : 'Strong'
          }}
        </p>
      </div>
      
      <!-- Save Button -->
      <div class="flex justify-center mt-6">
        <button 
          type="submit" 
          class="btn bg-amber-500 hover:bg-amber-600 text-white" 
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Change Password</span>
          <span v-else>Processing...</span>
        </button>
      </div>
    </form>
  </div>
</template>