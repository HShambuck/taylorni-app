<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMeasurementsStore } from '@/stores/measurementsStore';
import { useUserStore } from '@/stores/auth';

// Initialize stores
const measurementsStore = useMeasurementsStore();
const userStore = useUserStore();

// Component state
const newMeasurement = ref({
  category: '',
  measurements: {}
});

const showMeasurementModal = ref(false);
const showEditModal = ref(false);
const selectedMeasurement = ref(null);
const editingMeasurement = ref(null);
const measurementValues = ref({});

// Computed properties
const isLoading = computed(() => measurementsStore.isLoading);

const clientMeasurements = computed(() => {
  // Only show the current client's measurements
  return measurementsStore.getMeasurementsByClientId(userStore.userInfo.id);
});

// Dynamic field definitions based on category
const measurementFields = computed(() => {
  return getFieldsForCategory(newMeasurement.value.category);
});

// Methods
function getFieldsForCategory(category) {
  switch (category) {
    case 'Kids':
      return [
        { name: 'height', label: 'Height' },
        { name: 'chest', label: 'Chest' },
        { name: 'waist', label: 'Waist' },
        { name: 'hips', label: 'Hips' },
        { name: 'shoulderWidth', label: 'Shoulder Width' },
        { name: 'armLength', label: 'Arm Length' }
      ];
    case 'Male':
      return [
        { name: 'chest', label: 'Chest' },
        { name: 'waist', label: 'Waist' },
        { name: 'hip', label: 'Hip' },
        { name: 'neckCircumference', label: 'Neck Circumference' },
        { name: 'shoulderWidth', label: 'Shoulder Width' },
        { name: 'sleeveLength', label: 'Sleeve Length' },
        { name: 'bicepCircumference', label: 'Bicep Circumference' },
        { name: 'wristCircumference', label: 'Wrist Circumference' },
        { name: 'crotch', label: 'Crotch' },
        { name: 'thigh', label: 'Thigh' },
        { name: 'knee', label: 'Knee' },
        { name: 'calf', label: 'Calf' },
        { name: 'topLength', label: 'Top Length' }
      ];
    case 'Female':
      return [
        { name: 'bust', label: 'Bust' },
        { name: 'upperBust', label: 'Upper Bust' },
        { name: 'underBust', label: 'Under Bust' },
        { name: 'waist', label: 'Waist' },
        { name: 'hip', label: 'Hip' },
        { name: 'shoulderToWaist', label: 'Shoulder to Waist' },
        { name: 'waistToHip', label: 'Waist to Hip' },
        { name: 'apexToApex', label: 'Apex to Apex' },
        { name: 'shoulderWidth', label: 'Shoulder Width' },
        { name: 'neckCircumference', label: 'Neck Circumference' },
        { name: 'sleeveLength', label: 'Sleeve Length' },
        { name: 'bicepCircumference', label: 'Bicep Circumference' },
        { name: 'wristCircumference', label: 'Wrist Circumference' },
        { name: 'crotch', label: 'Crotch' },
        { name: 'dressLength', label: 'Dress Length' }
      ];
    default:
      return [];
  }
}

function formatDate(dateString) {
  return measurementsStore.formatDate(dateString);
}

function formatFieldName(key) {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

async function saveMeasurement() {
  if (!newMeasurement.value.category) {
    alert('Please select a category');
    return;
  }
  
  try {
    await measurementsStore.createMeasurement({
      clientId: userStore.userInfo.id, // Use the current client's ID
      category: newMeasurement.value.category,
      ...newMeasurement.value.measurements
    });
    
    // Reset form
    newMeasurement.value = {
      category: '',
      measurements: {}
    };
    
    alert('Measurement saved successfully');
  } catch (error) {
    alert(`Error saving measurement: ${error.message}`);
  }
}

async function viewMeasurement(measurementId) {
  const measurement = measurementsStore.getMeasurementById(measurementId);
  if (measurement) {
    selectedMeasurement.value = measurement;
    measurementValues.value = { ...measurement };
    showMeasurementModal.value = true;
  }
}

async function editMeasurement(measurementId) {
  const measurement = measurementsStore.getMeasurementById(measurementId);
  if (measurement) {
    editingMeasurement.value = { ...measurement };
    showEditModal.value = true;
  }
}

function editMeasurementFromModal() {
  if (selectedMeasurement.value) {
    editingMeasurement.value = { ...selectedMeasurement.value };
    showMeasurementModal.value = false;
    showEditModal.value = true;
  }
}

async function saveEditedMeasurement() {
  if (!editingMeasurement.value) return;
  
  try {
    const { id, clientId, category, dateRecorded, designerId, ...measurementData } = editingMeasurement.value;
    
    await measurementsStore.updateMeasurement(id, measurementData);
    
    showEditModal.value = false;
    alert('Measurement updated successfully');
  } catch (error) {
    alert(`Error updating measurement: ${error.message}`);
  }
}

async function deleteMeasurement(measurementId) {
  if (confirm('Are you sure you want to delete this measurement?')) {
    try {
      await measurementsStore.deleteMeasurement(measurementId);
      alert('Measurement deleted successfully');
    } catch (error) {
      alert(`Error deleting measurement: ${error.message}`);
    }
  }
}

// Fetch data on component mount
onMounted(async () => {
  // Fetch measurements
  await measurementsStore.fetchMeasurements();
});

// Reset measurement fields when category changes
watch(() => newMeasurement.value.category, () => {
  newMeasurement.value.measurements = {};
});
</script>

<template>
  <div class="client-measurement-page">
    <h1 class="text-2xl text-purple-900 font-bold mb-6">My Measurements</h1>
    
    <!-- New Measurement Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl text-purple-900 font-semibold mb-4">Record New Measurement</h2>
      
      <div class="mb-4">
        <!-- Category Selection -->
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select v-model="newMeasurement.category" class="w-full p-2 border rounded">
            <option value="" disabled>Select category</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
      </div>
      
      <!-- Dynamic Measurement Fields based on category -->
      <div v-if="newMeasurement.category" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div v-for="field in measurementFields" :key="field.name">
          <label class="block text-sm font-medium mb-1">{{ field.label }}</label>
          <input 
            type="number" 
            v-model="newMeasurement.measurements[field.name]" 
            class="w-full p-2 border rounded"
            :placeholder="field.label"
          />
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="saveMeasurement" 
          class="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Saving...' : 'Save Measurement' }}
        </button>
      </div>
    </div>
    
    <!-- Saved Measurements -->
    <div v-if="clientMeasurements.length > 0" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl text-purple-900 font-semibold mb-4">My Saved Measurements</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Date</th>
              <th class="border p-2 text-left">Category</th>
              <th class="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="measurement in clientMeasurements" :key="measurement.id" class="hover:bg-gray-50">
              <td class="border p-2">{{ formatDate(measurement.dateRecorded) }}</td>
              <td class="border p-2">{{ measurement.category }}</td>
              <td class="border p-2">
                <button @click="viewMeasurement(measurement.id)" class="text-purple-800 hover:text-purple-900 mr-2">
                  View
                </button>
                <button @click="editMeasurement(measurement.id)" class="text-amber-500 hover:text-amber-600 mr-2">
                  Edit
                </button>
                <button @click="deleteMeasurement(measurement.id)" class="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Measurement Details Modal -->
    <div v-if="showMeasurementModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-full overflow-y-auto">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl font-semibold">Measurement Details</h3>
          <button @click="showMeasurementModal = false" class="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        
        <div v-if="selectedMeasurement">
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div class="font-medium">Category:</div>
            <div>{{ selectedMeasurement.category }}</div>
            
            <div class="font-medium">Date Recorded:</div>
            <div>{{ formatDate(selectedMeasurement.dateRecorded) }}</div>
          </div>
          
          <h4 class="font-semibold mb-2">Measurements</h4>
          <div class="grid grid-cols-2 gap-2">
            <template v-for="(value, key) in measurementValues" :key="key">
              <div v-if="!['id', 'clientId', 'category', 'designerId', 'dateRecorded'].includes(key)" class="font-medium">
                {{ formatFieldName(key) }}:
              </div>
              <div v-if="!['id', 'clientId', 'category', 'designerId', 'dateRecorded'].includes(key)">
                {{ value }} cm
              </div>
            </template>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showMeasurementModal = false" class="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-900 mr-2">
              Close
            </button>
            <button @click="editMeasurementFromModal" class="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Measurement Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-full overflow-y-auto">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl font-semibold">Edit Measurement</h3>
          <button @click="showEditModal = false" class="text-amber-500 hover:text-amber-600">
            Close
          </button>
        </div>
        
        <div v-if="editingMeasurement">
          <div class="mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <select v-model="editingMeasurement.category" class="w-full p-2 border rounded" disabled>
                <option value="Kids">Kids</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <template v-for="field in getFieldsForCategory(editingMeasurement.category)" :key="field.name">
              <div>
                <label class="block text-sm font-medium mb-1">{{ field.label }}</label>
                <input 
                  type="number" 
                  v-model="editingMeasurement[field.name]" 
                  class="w-full p-2 border rounded"
                  :placeholder="field.label"
                />
              </div>
            </template>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showEditModal = false" class="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-900 mr-2">
              Cancel
            </button>
            <button @click="saveEditedMeasurement" class="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
