<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const isLoading = ref(false);

// Form data
const profileForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  bio: ""
});

// Emits
const emit = defineEmits(['success', 'error']);

// Load current user data
onMounted(() => {
  if (userStore.userInfo) {
    profileForm.value.firstName = userStore.userInfo.firstName || "";
    profileForm.value.lastName = userStore.userInfo.lastName || "";
    profileForm.value.email = userStore.userInfo.email || "";
    profileForm.value.phone = userStore.userInfo.phone || "";
    profileForm.value.address = userStore.userInfo.address || "";
    profileForm.value.bio = userStore.userInfo.bio || "";
  }
});

// Save profile changes
const saveProfile = async () => {
  isLoading.value = true;
  
  try {
    // Create updated user info object
    const updatedInfo = {
      ...userStore.userInfo,
      firstName: profileForm.value.firstName,
      lastName: profileForm.value.lastName,
      fullName: `${profileForm.value.firstName} ${profileForm.value.lastName}`,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
      address: profileForm.value.address,
      bio: profileForm.value.bio,
      // Update avatar with new name
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${profileForm.value.firstName} ${profileForm.value.lastName}`
      )}`
    };
    
    // In a real app, you'd call an API here
    // For now, we'll just update the store
    userStore.userInfo = updatedInfo;
    
    // Update localStorage to persist changes
    localStorage.setItem(
      "userState",
      JSON.stringify({
        userType: userStore.userType,
        userInfo: userStore.userInfo,
        isAuthenticated: userStore.isAuthenticated
      })
    );
    
    emit('success', 'Profile updated successfully!');
  } catch (error) {
    emit('error', 'Failed to update profile. Please try again.');
    console.error('Error updating profile:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <h3 class="text-xl font-bold mb-4">Edit Profile Information</h3>
    
    <form @submit.prevent="saveProfile" class="space-y-4">
      <!-- Name Fields (2-column layout) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            v-model="profileForm.firstName" 
            class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            v-model="profileForm.lastName" 
            class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
            required
          />
        </div>
      </div>
      
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          type="email" 
          v-model="profileForm.email" 
          class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
          required
        />
        <p class="text-xs text-gray-500 mt-1">This email will be used for communications and login</p>
      </div>
      
      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input 
          type="tel" 
          v-model="profileForm.phone" 
          class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
          placeholder="Optional"
        />
      </div>
      
      <!-- Address -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea 
          v-model="profileForm.address" 
          rows="2"
          class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
          placeholder="Optional"
        ></textarea>
      </div>
      
      <!-- Bio -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea 
          v-model="profileForm.bio" 
          rows="4"
          class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>
      
      <!-- Save Button -->
      <div class="flex justify-end">
        <button 
          type="submit" 
          class="btn bg-amber-500 hover:bg-amber-600 text-white" 
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Save Changes</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>