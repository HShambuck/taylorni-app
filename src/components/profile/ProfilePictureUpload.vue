<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const isLoading = ref(false);
const previewImage = ref(null);
const fileInput = ref(null);

// Emits
const emit = defineEmits(['success', 'error']);

// Initialize preview with current avatar
previewImage.value = userStore.userInfo?.avatar || null;

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.match('image.*')) {
    emit('error', 'Please select an image file (JPEG, PNG, etc.)');
    return;
  }
  
  // Create image preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Save profile picture
const saveProfilePicture = async () => {
  isLoading.value = true;
  
  try {
    // In a real app, you'd upload the file to a server here
    // For demo purposes, we'll just update the store with the preview image
    if (previewImage.value && previewImage.value !== userStore.userInfo.avatar) {
      const updatedInfo = {
        ...userStore.userInfo,
        avatar: previewImage.value
      };
      
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
      
      emit('success', 'Profile picture updated successfully!');
    } else {
      emit('error', 'No new image selected or same image provided');
    }
  } catch (error) {
    emit('error', 'Failed to update profile picture. Please try again.');
    console.error('Error updating profile picture:', error);
  } finally {
    isLoading.value = false;
  }
};

// Reset to default avatar
const resetToDefault = () => {
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${userStore.userInfo.firstName} ${userStore.userInfo.lastName}`
  )}`;
  
  previewImage.value = defaultAvatar;
};
</script>

<template>
  <div>
    <h3 class="text-xl font-bold mb-4">Update Profile Picture</h3>
    
    <div class="flex flex-col items-center mb-6">
      <!-- Profile Picture Preview -->
      <div class="avatar mb-4">
        <div class="w-40 h-40 rounded-full ring ring-primary ring-offset-2">
          <img :src="previewImage" :alt="userStore.userInfo?.fullName" v-if="previewImage" />
          <div class="bg-gray-200 flex items-center justify-center" v-else>
            <span class="text-gray-400">No Image</span>
          </div>
        </div>
      </div>
      
      <!-- Upload Controls -->
      <div class="flex gap-2 mb-4">
        <button 
          @click="triggerFileInput"
          class="btn btn-primary"
        >
          Select Image
        </button>
        
        <button 
          @click="resetToDefault"
          class="btn btn-outline"
        >
          Reset to Default
        </button>
      </div>
      
      <!-- Hidden File Input -->
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileChange" 
        accept="image/*" 
        class="hidden"
      />
      
      <p class="text-sm text-gray-500 text-center max-w-md">
        Upload a clear photo of yourself. Recommended size: 300x300 pixels or larger.
        Supported formats: JPEG, PNG.
      </p>
    </div>
    
    <!-- Save Button -->
    <div class="flex justify-center">
      <button 
        @click="saveProfilePicture"
        class="btn bg-amber-500 hover:bg-amber-600 text-white" 
        :class="{ 'loading': isLoading }"
        :disabled="isLoading || !previewImage"
      >
        <span v-if="!isLoading">Save Profile Picture</span>
        <span v-else>Saving...</span>
      </button>
    </div>
  </div>
</template>