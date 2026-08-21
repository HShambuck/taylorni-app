<script setup>
import { onMounted, ref } from "vue";

const avatarUrl = ref(""); // Stores the generated avatar link
const isLoading = ref(true);

onMounted(() => {
  const iframe = document.createElement("iframe");
  iframe.src = "https://readyplayer.me/avatar?frameApi"; // Ready Player Me Avatar Creator
  iframe.style.width = "100%";
  iframe.style.height = "600px";
  iframe.allow = "camera; microphone"; // Allows access to the camera/mic for customization
  
  iframe.onload = () => {
    isLoading.value = false;
    // Send subscription request to iframe
    iframe.contentWindow.postMessage(
      { target: "readyplayerme", type: "subscribe", eventName: "v1.avatar.exported" },
      "*"
    );
  };
  
  document.getElementById("avatar-container").appendChild(iframe);
  
  // Listen for messages from the iframe
  window.addEventListener("message", (event) => {
    if (event.origin !== "https://readyplayer.me") return;
    if (event.data?.source === "readyplayerme" && event.data?.eventName === "v1.avatar.exported") {
      avatarUrl.value = event.data.data.url;
    }
  });
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="card-title text-3xl text-purple-900">🕶️ Virtual Try-On</h2>
        <p class="text-base-content/70">Customize your avatar and try on our latest collections</p>
        
        <!-- Avatar Creator Container -->
        <div class="mt-6 relative">
          <div class="skeleton h-96 w-full" v-if="isLoading"></div>
          <div id="avatar-container" class="rounded-box overflow-hidden border border-base-300"></div>
        </div>
      </div>
    </div>
    
    <!-- Display Avatar when available -->
    <div v-if="avatarUrl" class="card bg-base-200 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Your Customized Avatar</h2>
        <div class="flex justify-center">
          <div class="avatar">
            <div class="w-64 rounded-box">
              <img :src="avatarUrl" alt="Ready Player Me Avatar" />
            </div>
          </div>
        </div>
        <div class="card-actions justify-center mt-4">
          <button class="btn btn-primary">Try Outfit on Avatar</button>
        </div>
      </div>
    </div>
  </div>
</template>