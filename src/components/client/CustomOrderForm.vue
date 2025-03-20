<script setup>
import { ref } from "vue";

const customOrder = ref({
  name: "",
  description: "",
  budget: "",
  referenceImage: null,
});

const submitOrder = () => {
  alert(`Custom order submitted: ${customOrder.value.name}`);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    customOrder.value.referenceImage = URL.createObjectURL(file);
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl text-purple-900">🎨 Request a Custom Design</h2>
        <p class="text-base-content/70">Describe your dream outfit, and our designers will bring it to life.</p>
        
        <form @submit.prevent="submitOrder" class="mt-6 space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Outfit Name</span>
            </label>
            <input v-model="customOrder.name" type="text" placeholder="Enter outfit name" 
                   class="input input-bordered w-full" required />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Description</span>
            </label>
            <textarea v-model="customOrder.description" placeholder="Describe your outfit in detail" 
                      class="textarea textarea-bordered" rows="4" required></textarea>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Budget (₵)</span>
            </label>
            <input v-model="customOrder.budget" type="number" placeholder="Enter your budget" 
                   class="input input-bordered w-full" required />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Reference Image (optional)</span>
            </label>
            <input type="file" @change="handleFileUpload" class="file-input file-input-bordered w-full" />
            
            <div v-if="customOrder.referenceImage" class="mt-4">
              <div class="avatar">
                <div class="w-32 h-32 rounded-lg">
                  <img :src="customOrder.referenceImage" alt="Preview" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-control mt-6">
            <button type="submit" class="btn bg-purple-900 text-white">
              <span class="mr-1">✨</span> Submit Custom Order
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>