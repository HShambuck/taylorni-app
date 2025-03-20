<script setup>
import { ref } from "vue";

const measurements = ref({
  height: "",
  weight: "",
  chest: "",
  waist: "",
  hips: "",
  sleeveLength: "",
  inseam: "",
});

const saveMeasurements = () => {
  alert("Measurements saved successfully!");
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-purple-900">📏 Body Measurements</h1>
      <p class="text-gray-600 mt-1">Enter your measurements for perfect fitting clothes</p>
    </div>

    <!-- Stats Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="stat bg-white text-gray-900 shadow-sm rounded-lg">
        <div class="stat-figure text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="stat-title">Profile</div>
        <div class="stat-value text-amber-500">Sizing</div>
        <div class="stat-desc">Used for accurate fitting</div>
      </div>
      
      <div class="stat bg-white text-gray-900 shadow-sm rounded-lg">
        <div class="stat-figure text-purple-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-title">Accuracy</div>
        <div class="stat-value text-purple-900">100%</div>
        <div class="stat-desc">For perfect measurements</div>
      </div>
      
      <div class="stat bg-white text-gray-900 shadow-sm rounded-lg">
        <div class="stat-figure text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-title">Last Updated</div>
        <div class="stat-value text-green-600">Today</div>
        <div class="stat-desc">Keep your measurements current</div>
      </div>
    </div>

    <!-- Measurement Form -->
    <div class="card bg-white text-gray-900 shadow-md">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">Enter Your Measurements</h2>
        
        <form @submit.prevent="saveMeasurements" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Height (cm)</span>
            </label>
            <input 
              v-model="measurements.height" 
              type="number" 
              placeholder="Enter height" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Weight (kg)</span>
            </label>
            <input 
              v-model="measurements.weight" 
              type="number" 
              placeholder="Enter weight" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Chest (cm)</span>
            </label>
            <input 
              v-model="measurements.chest" 
              type="number" 
              placeholder="Enter chest measurement" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Waist (cm)</span>
            </label>
            <input 
              v-model="measurements.waist" 
              type="number" 
              placeholder="Enter waist measurement" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Hips (cm)</span>
            </label>
            <input 
              v-model="measurements.hips" 
              type="number" 
              placeholder="Enter hip measurement" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Sleeve Length (cm)</span>
            </label>
            <input 
              v-model="measurements.sleeveLength" 
              type="number" 
              placeholder="Enter sleeve length" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control md:col-span-2">
            <label class="label">
              <span class="label-text font-medium">Inseam (cm)</span>
            </label>
            <input 
              v-model="measurements.inseam" 
              type="number" 
              placeholder="Enter inseam measurement" 
              class="input input-bordered w-full focus:border-amber-500" 
              required 
            />
          </div>
          
          <div class="form-control mt-4 md:col-span-2">
            <button type="submit" class="btn bg-amber-500 border-none hover:bg-amber-600 text-white">
              ✅ Save Measurements
            </button>
          </div>
        </form>
        
        <!-- Helper Info -->
        <div class="alert alert-info bg-purple-800 text-white shadow-sm border-purple-800 mt-6">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Make sure to measure yourself accurately for the best fitting clothes. Need help? Check our measurement guide.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>