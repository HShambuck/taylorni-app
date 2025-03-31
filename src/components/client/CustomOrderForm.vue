<script setup>
import { ref, computed, onMounted } from "vue";
import { useMeasurementsStore } from "@/stores/measurementsStore";
import { useUserStore } from "@/stores/auth";

// Initialize stores
const measurementsStore = useMeasurementsStore();
const userStore = useUserStore();

// Component state
const customOrder = ref({
  name: "",
  description: "",
  budget: "",
  referenceImage: null,
  selectedMeasurementId: null,
});

const showMeasurementDetails = ref(false);
const selectedMeasurementForDisplay = ref(null);

// Fetch client measurements
onMounted(async () => {
  await measurementsStore.fetchMeasurements();
});

// Get current client's measurements
const clientMeasurements = computed(() => {
  return measurementsStore.getMeasurementsByClientId(userStore.userInfo.id);
});

// Format date helper function
const formatDate = (dateString) => {
  return measurementsStore.formatDate(dateString);
};

// Format field name (convert camelCase to Title Case with spaces)
const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

// Handle file upload for reference image
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    customOrder.value.referenceImage = URL.createObjectURL(file);
  }
};

// View measurement details
const viewMeasurementDetails = (measurementId) => {
  const measurement = measurementsStore.getMeasurementById(measurementId);
  if (measurement) {
    selectedMeasurementForDisplay.value = measurement;
    showMeasurementDetails.value = true;
  }
};

// Submit order with measurements
const submitOrder = () => {
  // Get the selected measurement if any
  const selectedMeasurement = customOrder.value.selectedMeasurementId 
    ? measurementsStore.getMeasurementById(customOrder.value.selectedMeasurementId) 
    : null;
  
  // Prepare order data with measurements
  const orderData = {
    ...customOrder.value,
    measurementData: selectedMeasurement || null
  };
  
  // Log for debugging
  console.log("Submitting order with data:", orderData);
  
  // Show confirmation to user
  alert(`Custom order "${customOrder.value.name}" submitted with ${selectedMeasurement ? 'selected measurements' : 'no measurements'}`);
  
  // Here you would typically send this data to your backend
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
          
          <!-- Measurements Selection Section -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Select Your Measurements</span>
            </label>
            
            <div v-if="clientMeasurements.length > 0">
              <select 
                v-model="customOrder.selectedMeasurementId" 
                class="select select-bordered w-full"
              >
                <option :value="null">No measurements selected</option>
                <option 
                  v-for="measurement in clientMeasurements" 
                  :key="measurement.id" 
                  :value="measurement.id"
                >
                  {{ measurement.category }} - {{ formatDate(measurement.dateRecorded) }}
                </option>
              </select>
              
              <div class="mt-2">
                <button 
                  type="button" 
                  @click="viewMeasurementDetails(customOrder.selectedMeasurementId)" 
                  class="btn btn-sm bg-purple-900 text-white hover:bg-purple-800"
                  :disabled="!customOrder.selectedMeasurementId"
                >
                  View Measurement Details
                </button>
              </div>
            </div>
            <div v-else class="alert alert-warning mt-2">
              <span>You don't have any saved measurements. <a href="/my-measurements" class="underline">Add measurements</a> first.</span>
            </div>
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
            <button type="submit" class="btn bg-purple-900 text-white hover:bg-purple-800">
              <span class="mr-1">✨</span> Submit Custom Order
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Measurement Details Modal -->
    <div v-if="showMeasurementDetails" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-full overflow-y-auto">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl font-semibold">Measurement Details</h3>
          <button @click="showMeasurementDetails = false" class="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        
        <div v-if="selectedMeasurementForDisplay">
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div class="font-medium">Category:</div>
            <div>{{ selectedMeasurementForDisplay.category }}</div>
            
            <div class="font-medium">Date Recorded:</div>
            <div>{{ formatDate(selectedMeasurementForDisplay.dateRecorded) }}</div>
          </div>
          
          <h4 class="font-semibold mb-2">Measurements</h4>
          <div class="grid grid-cols-2 gap-2">
            <template v-for="(value, key) in selectedMeasurementForDisplay" :key="key">
              <div v-if="!['id', 'clientId', 'category', 'designerId', 'dateRecorded'].includes(key)" class="font-medium">
                {{ formatFieldName(key) }}:
              </div>
              <div v-if="!['id', 'clientId', 'category', 'designerId', 'dateRecorded'].includes(key)">
                {{ value }} cm
              </div>
            </template>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showMeasurementDetails = false" class="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-900">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>