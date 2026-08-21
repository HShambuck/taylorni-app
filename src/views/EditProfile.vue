<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import EditProfileForm from "@/components/profile/EditProfileForm.vue";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload.vue";
import ChangePassword from "@/components/profile/ChangePassword.vue";
import SocialLinks from "@/components/profile/SocialLinks.vue";

const userStore = useUserStore();
const router = useRouter();
const activeTab = ref("profile");
const isLoading = ref(true);
const successMessage = ref("");
const errorMessage = ref("");

// Check if user is authenticated
onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push("/login");
    return;
  }
  isLoading.value = false;
});

// Handle success messages from child components
const handleSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = "";
  }, 3000);
};

// Handle error messages from child components
const handleError = (message) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = "";
  }, 5000);
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="loading loading-spinner loading-lg text-amber-500"></div>
    </div>
    
    <div v-else>
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-purple-800">✏️ Edit Profile</h1>
        <p class="text-base-content/70">Update your personal information and preferences</p>
      </div>
      
      <!-- Success and Error Messages -->
      <div v-if="successMessage" class="alert alert-success mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ successMessage }}</span>
      </div>
      
      <div v-if="errorMessage" class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ errorMessage }}</span>
      </div>
      
      <!-- Tab Navigation -->
      <div class="tabs tabs-boxed mb-6 bg-base-200">
        <a 
          @click="activeTab = 'profile'" 
          :class="['tab', activeTab === 'profile' ? 'tab-active bg-amber-500 text-white' : '']"
        >
          Profile
        </a>
        <a 
          @click="activeTab = 'picture'" 
          :class="['tab', activeTab === 'picture' ? 'tab-active bg-amber-500 text-white' : '']"
        >
          Picture
        </a>
        <a 
          @click="activeTab = 'password'" 
          :class="['tab', activeTab === 'password' ? 'tab-active bg-amber-500 text-white' : '']"
        >
          Password
        </a>
        <a 
          @click="activeTab = 'social'" 
          :class="['tab', activeTab === 'social' ? 'tab-active bg-amber-500 text-white' : '']"
        >
          Social Links
        </a>
      </div>
      
      <!-- Tab Content -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <EditProfileForm 
            v-if="activeTab === 'profile'" 
            @success="handleSuccess"
            @error="handleError"
          />
          
          <ProfilePictureUpload 
            v-if="activeTab === 'picture'"
            @success="handleSuccess"
            @error="handleError"
          />
          
          <ChangePassword 
            v-if="activeTab === 'password'"
            @success="handleSuccess"
            @error="handleError"
          />
          
          <SocialLinks 
            v-if="activeTab === 'social'"
            @success="handleSuccess"
            @error="handleError"
          />
        </div>
      </div>
    </div>
  </div>
</template>