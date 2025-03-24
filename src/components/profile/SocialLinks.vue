<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const isLoading = ref(false);

// Form data for social links
const socialLinks = ref({
  linkedin: "",
  twitter: "",
  facebook: "",
  instagram: "",
  github: "",
  website: "",
});

// Emits
const emit = defineEmits(["success", "error"]);

// Load current user social data
onMounted(() => {
  if (userStore.userInfo && userStore.userInfo.socialLinks) {
    // If social links already exist in user info, load them
    socialLinks.value = {
      ...socialLinks.value,
      ...userStore.userInfo.socialLinks,
    };
  }
});

// Save social links
const saveSocialLinks = async () => {
  isLoading.value = true;

  try {
    // Create updated user info object
    const updatedInfo = {
      ...userStore.userInfo,
      socialLinks: {
        linkedin: socialLinks.value.linkedin,
        twitter: socialLinks.value.twitter,
        facebook: socialLinks.value.facebook,
        instagram: socialLinks.value.instagram,
        github: socialLinks.value.github,
        website: socialLinks.value.website,
      },
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
        isAuthenticated: userStore.isAuthenticated,
      })
    );

    emit("success", "Social links updated successfully!");
  } catch (error) {
    emit("error", "Failed to update social links. Please try again.");
    console.error("Error updating social links:", error);
  } finally {
    isLoading.value = false;
  }
};

// Helper function to validate URLs
const isValidUrl = (url) => {
  if (!url) return true; // Empty is valid (optional field)

  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
</script>

<template>
  <div>
    <h3 class="text-xl font-bold mb-4 text-purple-800">Social Media Links</h3>
    <p class="text-base-content/70 mb-4">
      Connect your social profiles to share across the platform
    </p>

    <form @submit.prevent="saveSocialLinks" class="space-y-4">
      <!-- LinkedIn -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <span class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
              />
            </svg>
            LinkedIn
          </span>
        </label>
        <div class="flex">
          <span
            class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md"
          >
            linkedin.com/in/
          </span>
          <input
            type="text"
            v-model="socialLinks.linkedin"
            class="flex-1 px-3 py-2 border rounded-r-md focus:ring-amber-500"
            placeholder="username"
          />
        </div>
      </div>

      <!-- Twitter/X -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <span class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            Twitter / X
          </span>
        </label>
        <div class="flex">
          <span
            class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md"
          >
            twitter.com/
          </span>
          <input
            type="text"
            v-model="socialLinks.twitter"
            class="flex-1 px-3 py-2 border rounded-r-md focus:ring-amber-500"
            placeholder="username"
          />
        </div>
      </div>

      <!-- WhatsApp -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <span class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
            WhatsApp
          </span>
        </label>
        <div class="flex">
          <span
            class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md"
          >
            +
          </span>
          <input
            type="text"
            v-model="socialLinks.whatsapp"
            class="flex-1 px-3 py-2 border rounded-r-md focus:ring-green-500"
            placeholder="1234567890"
          />
        </div>
      </div>

      <!-- Instagram -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <span class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-pink-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
              />
            </svg>
            Instagram
          </span>
        </label>
        <div class="flex">
          <span
            class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md"
          >
            instagram.com/
          </span>
          <input
            type="text"
            v-model="socialLinks.instagram"
            class="flex-1 px-3 py-2 border rounded-r-md focus:ring-amber-500"
            placeholder="username"
          />
        </div>
      </div>

      <!-- Facebook -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <span class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-blue-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook
          </span>
        </label>
        <div class="flex">
          <span
            class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md"
          >
            facebook.com/
          </span>
          <input
            type="text"
            v-model="socialLinks.facebook"
            class="flex-1 px-3 py-2 border rounded-r-md focus:ring-amber-500"
            placeholder="username"
          />
        </div>
      </div>

      <!-- Website -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <span class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            Personal Website
          </span>
        </label>
        <input
          type="url"
          v-model="socialLinks.website"
          class="w-full px-3 py-2 border rounded-md focus:ring-amber-500"
          placeholder="https://yourwebsite.com"
        />
        <p class="text-xs text-gray-500 mt-1">
          Include the full URL including https://
        </p>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn bg-amber-500 hover:bg-amber-600 text-white"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Save Social Links</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>
