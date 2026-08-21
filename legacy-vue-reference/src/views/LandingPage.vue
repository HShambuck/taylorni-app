<script setup>
import { ref, onMounted } from 'vue';
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

// Animation visibility states
const isHeroVisible = ref(false);
const isAboutVisible = ref(false);
const visibleFeatures = ref([]);
const visibleClientSteps = ref([]);
const visibleDesignerSteps = ref([]);
const visibleTestimonials = ref([]);
const isCTAVisible = ref(false);

// Intersection Observer setup
onMounted(() => {
  // Set hero as visible immediately
  setTimeout(() => {
    isHeroVisible.value = true;
  }, 200);
  
  // Create observers for each section
  createObserver('.about-section', () => { isAboutVisible.value = true; });
  
  // Features observer
  createObserver('.features-container', () => {
    const interval = setInterval(() => {
      if (visibleFeatures.value.length < features.length) {
        visibleFeatures.value.push(visibleFeatures.value.length);
      } else {
        clearInterval(interval);
      }
    }, 150);
  });
  
  // Client steps observer
  createObserver('.client-steps', () => {
    const interval = setInterval(() => {
      if (visibleClientSteps.value.length < clientSteps.value.length) {
        visibleClientSteps.value.push(visibleClientSteps.value.length);
      } else {
        clearInterval(interval);
      }
    }, 200);
  });
  
  // Designer steps observer
  createObserver('.designer-steps', () => {
    const interval = setInterval(() => {
      if (visibleDesignerSteps.value.length < designerSteps.value.length) {
        visibleDesignerSteps.value.push(visibleDesignerSteps.value.length);
      } else {
        clearInterval(interval);
      }
    }, 200);
  });
  
  // Testimonials observer
  createObserver('.testimonials-container', () => {
    const interval = setInterval(() => {
      if (visibleTestimonials.value.length < testimonials.length) {
        visibleTestimonials.value.push(visibleTestimonials.value.length);
      } else {
        clearInterval(interval);
      }
    }, 150);
  });
  
  // CTA observer
  createObserver('.cta-section', () => { isCTAVisible.value = true; });
});

// Helper function to create observers
function createObserver(selector, callback) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(element);
}
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="min-h-screen bg-cover bg-center relative overflow-hidden" :style="{ backgroundImage: `url(${heroBg})` }">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-linear-to-r from-black/70 to-black-0 z-0"></div>
      
      <!-- Content -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-16 flex items-center min-h-screen">
        <div class="w-full md:w-3/4 lg:w-1/2 z-10 my-auto">
          <h1 
            class="text-3xl sm:text-4xl lg:text-7xl font-bold text-purple-300 mb-4 transition-all duration-1000"
            :class="isHeroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'"
          >
            {{ hero.title }}
          </h1>
          <p 
            class="text-lg sm:text-xl lg:text-4xl font-semibold text-white mb-8 transition-all duration-1000 delay-300"
            :class="isHeroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'"
          >
            {{ hero.description }}
          </p>
          <button 
            class="border-none bg-amber-400 hover:bg-amber-300 text-white px-4 sm:px-6 py-3 sm:py-5 rounded-md font-semibold text-base sm:text-lg lg:text-xl transition-all duration-500 delay-600 hover:scale-105"
            :class="isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          >
            {{ hero.buttonText }}
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white py-12 md:py-16 about-section">
      <div class="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 
          class="text-2xl sm:text-3xl font-bold text-amber-500 text-center mb-8 md:mb-12 relative transition-all duration-700"
          :class="isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        >
          About Us
          <span 
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-amber-500 mt-2 transition-all duration-1000 delay-300"
            :class="isAboutVisible ? 'w-24' : 'w-0'"
          ></span>
        </h2>
        
        <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          <div 
            class="w-full lg:w-1/2 transition-all duration-1000 delay-300"
            :class="isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'"
          >
            <img :src="aboutSec" alt="about us" class="w-full h-full rounded-lg shadow-md" />
          </div>
          <div 
            class="w-full lg:w-1/2 transition-all duration-1000 delay-500"
            :class="isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'"
          >
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 mt-4 lg:mt-0">{{ about.title }}</h3>
            <p class="text-gray-600 mb-6">
              {{ about.description }}
            </p>
            <router-link to="/about" class="btn bg-amber-400 border-none hover:bg-amber-300 text-white px-4 py-2 rounded-md hover:scale-105 transition duration-300 inline-block">
              {{ about.buttonText }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gradient-to-r from-purple-900 to-amber-500 py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-8 md:mb-12 relative">
          Key Features
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 sm:w-24 bg-amber-500 mt-2"></span>
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 features-container">
          <div 
            v-for="(feature, index) in features" 
            :key="index" 
            class="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all duration-700"
            :class="visibleFeatures.includes(index) 
              ? 'opacity-100 transform translate-y-0 hover:shadow-lg hover:-translate-y-2' 
              : 'opacity-0 transform translate-y-16'"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-amber-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">{{ feature.title }}</h3>
            <p class="text-gray-600 text-center text-sm sm:text-base">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="bg-white py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 class="text-2xl sm:text-3xl font-bold text-amber-500 text-center mb-2 sm:mb-4">How It Works</h2>
        <p class="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Our simple process makes custom fashion accessible to everyone
        </p>
        
        <div class="flex flex-col lg:flex-row gap-8 mb-8 md:mb-12">
          <div class="w-full lg:w-1/2 client-steps">
            <h3 class="text-xl sm:text-2xl font-semibold text-purple-800 mb-4 md:mb-6">For Clients</h3>
            <div class="space-y-4 sm:space-y-8">
              <div 
                v-for="(step, index) in clientSteps" 
                :key="index" 
                class="flex items-start transition-all duration-700"
                :class="visibleClientSteps.includes(index) 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-16'"
                :style="{ transitionDelay: `${index * 200}ms` }"
              >
                <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center mr-3 sm:mr-4">
                  <span class="font-bold text-purple-800 text-sm sm:text-base">{{ index + 1 }}</span>
                </div>
                <div>
                  <h4 class="text-base sm:text-lg font-medium text-gray-800 mb-1">{{ step.title }}</h4>
                  <p class="text-gray-600 text-sm sm:text-base">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w-full lg:w-1/2 designer-steps mt-8 lg:mt-0">
            <h3 class="text-xl sm:text-2xl font-semibold text-purple-800 mb-4 md:mb-6">For Designers</h3>
            <div class="space-y-4 sm:space-y-8">
              <div 
                v-for="(step, index) in designerSteps" 
                :key="index" 
                class="flex items-start transition-all duration-700"
                :class="visibleDesignerSteps.includes(index) 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-16'"
                :style="{ transitionDelay: `${index * 200}ms` }"
              >
                <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center mr-3 sm:mr-4">
                  <span class="font-bold text-purple-800 text-sm sm:text-base">{{ index + 1 }}</span>
                </div>
                <div>
                  <h4 class="text-base sm:text-lg font-medium text-gray-800 mb-1">{{ step.title }}</h4>
                  <p class="text-gray-600 text-sm sm:text-base">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-gray-100 py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 class="text-2xl sm:text-3xl font-bold text-amber-500 text-center mb-8 md:mb-12 relative">
          What Our Users Say
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 sm:w-24 bg-amber-500 mt-2"></span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 testimonials-container">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="index" 
            class="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all duration-700"
            :class="visibleTestimonials.includes(index) 
              ? 'opacity-100 transform translate-y-0 hover:shadow-lg hover:-translate-y-2' 
              : 'opacity-0 transform translate-y-16'"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full overflow-hidden mr-3 sm:mr-4">
                <img :src="`/api/placeholder/${50+index}/${50+index}`" alt="User avatar" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-semibold text-gray-800 text-sm sm:text-base">{{ testimonial.name }}</h4>
                <p class="text-gray-500 text-xs sm:text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic text-sm sm:text-base">"{{ testimonial.quote }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="bg-purple-800 py-12 md:py-16 text-white cta-section">
      <div class="container mx-auto px-4 sm:px-6 lg:px-20 text-center">
        <h2 
          class="text-2xl sm:text-3xl font-bold mb-4 transition-all duration-700"
          :class="isCTAVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          Ready to Transform Your Fashion Experience?
        </h2>
        <p 
          class="text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto transition-all duration-700 delay-300 text-sm sm:text-base"
          :class="isCTAVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          Join thousands of designers and clients who are revolutionizing the custom fashion industry.
        </p>
        <button 
          class="bg-amber-400 hover:bg-amber-300 text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold text-base sm:text-lg transition-all duration-700 delay-600 hover:scale-110"
          :class="isCTAVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          Sign Up for Free
        </button>
      </div>
    </section>

  </main>
</template>