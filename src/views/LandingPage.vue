<script setup>
import { ref } from 'vue';
import features from '@/data/landingPage/features';
import steps from '@/data/landingPage/steps'; 
import testimonials from '@/data/landingPage/testimonials';
import heroBg from '@/assets/hero-bg.png';
import aboutSec from '@/assets/about-sec.jpg';

const clientSteps = ref(steps.client);
const designerSteps = ref(steps.designer);

const hero = ref({
  title: 'Your Fashion Way',
  description: 'Track your orders, document measurements, and try on outfits — all in one place.',
  buttonText: 'Get Started',
  image: '/api/placeholder/800/400',
});

const about = ref({
  title: "Revolutionizing Fashion with Technology",
  description: "Taylorni bridges the gap between designers and clients, making custom fashion seamless and transparent. From order tracking and body documentation to a virtual try-on experience, we bring innovation to every step of the fashion process.",
  buttonText: "Learn more",
  image: ""
});
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="min-h-screen bg-cover bg-center relative overflow-hidden" :style="{ backgroundImage: `url(${heroBg})` }">

      <!-- Overlay -->
      <div class="absolute inset-0 bg-linear-to-r from-black/70 to-black-0 z-0"></div>
      
      <!-- Content -->
      <div class="container mx-auto px-20 py-16 flex items-center ">
        <div class="w-1/2 pr-10 z-10 my-auto">
          <h1 class="text-4xl lg:text-7xl font-bold text-purple-300 mb-4">{{ hero.title }}</h1>
          <p class="text-lg lg:text-4xl font-semibold text-white mb-8">
            {{ hero.description }}
          </p>
          <button class="border-none bg-amber-400 hover:bg-amber-300 text-white px-6 py-5 rounded-md font-semibold lg:text-xl">
            {{ hero.buttonText }}
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-20">
        <h2 class="text-3xl font-bold text-amber-500 text-center mb-12 relative">
          About Us
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-amber-500 mt-2"></span>
        </h2>
        
        <div class="flex items-center gap-10">
          <div class="w-1/2">
            <!-- About section image would go here -->
            <img :src="aboutSec" alt="about us" w-full h-full class="rounded-lg shadow-md" />
          </div>
          <div class="w-1/2">
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">{{ about.title }}</h3>
            <p class="text-gray-600 mb-6">
              {{ about.description }}
            </p>
            <button class="btn bg-amber-400 border-none hover:bg-amber-300 text-white px-5 py-2 rounded-md">
              {{ about.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </section>

      <!-- Features Section -->
    <section class="bg-gradient-to-r from-purple-900 to-amber-500 py-16">
      <div class="container mx-auto px-20">
        <h2 class="text-3xl font-bold text-white text-center mb-12 relative">
          Key Features
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-amber-500 mt-2"></span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2 text-center">{{ feature.title }}</h3>
            <p class="text-gray-600 text-center">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-20">
        <h2 class="text-3xl font-bold text-amber-500 text-center mb-4">How It Works</h2>
        <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Our simple process makes custom fashion accessible to everyone
        </p>
        
        <div class="flex flex-col md:flex-row gap-8 mb-12">
          <div class="w-full md:w-1/2">
            <h3 class="text-2xl font-semibold text-purple-800 mb-6">For Clients</h3>
            <div class="space-y-8">
              <div v-for="(step, index) in clientSteps" :key="index" class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center mr-4">
                  <span class="font-bold text-purple-800">{{ index + 1 }}</span>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-800 mb-1">{{ step.title }}</h4>
                  <p class="text-gray-600">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w-full md:w-1/2">
            <h3 class="text-2xl font-semibold text-purple-800 mb-6">For Designers</h3>
            <div class="space-y-8">
              <div v-for="(step, index) in designerSteps" :key="index" class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center mr-4">
                  <span class="font-bold text-purple-800">{{ index + 1 }}</span>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-800 mb-1">{{ step.title }}</h4>
                  <p class="text-gray-600">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-20">
        <h2 class="text-3xl font-bold text-amber-500 text-center mb-12 relative">
          What Our Users Say
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-amber-500 mt-2"></span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                <img :src="`/api/placeholder/${50+index}/${50+index}`" alt="User avatar" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">{{ testimonial.name }}</h4>
                <p class="text-gray-500 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.quote }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="bg-purple-800 py-16 text-white">
      <div class="container mx-auto px-20 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Fashion Experience?</h2>
        <p class="text-gray-200 mb-8 max-w-2xl mx-auto">
          Join thousands of designers and clients who are revolutionizing the custom fashion industry.
        </p>
        <button class="bg-amber-400 hover:bg-amber-300 text-gray-900 px-8 py-3 rounded-md font-semibold text-lg">
          Sign Up for Free
        </button>
      </div>
    </section>

  </main>
</template>