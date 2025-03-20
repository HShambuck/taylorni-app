<script setup>
import { ref } from 'vue';
import aboutBg from '@/assets/about-bg.jpg';
import aboutMish from '@/assets/about-mission.jpg';
import aboutStory from '@/assets/about-story.png';

</script>

<template>
  <main id="about" class="pb-16 bg-white">
    <!-- Hero -->
    <section class="container mx-auto lg:flex items-center justify-center gap-5 py-16 px-20">
      <div class="lg:flex-1">
        <h1 class="text-3xl lg:text-7xl font-bold text-amber-500 text-center lg:text-start mb-12">About Taylorni</h1>
        
        <p class="text-gray-700 text-lg mb-8">
          Taylorni is a digital fashion platform revolutionizing how designers and clients interact. We provide seamless custom orders, ready-made outfits, and virtual try-ons, blending fashion with technology.
        </p>
      </div>
      <div class="lg:flex-1">
        <img :src="aboutBg" alt="About Taylorni" class="w-full h-full rounded-lg shadow-lg" />
      </div>
    </section> 

    <!-- Our Mission Section -->
    <section class="py-16 bg-purple-50">
      <div class="container mx-auto px-20">
        <div class="flex flex-col-reverse lg:flex-row items-center">
          <div class="mb-8 md:mb-0 flex-1">
            <img 
              :src="aboutMish" 
              alt="Fashion workspace" 
              class="rounded-lg shadow-lg w-full"
            />
          </div>
          <div class=" md:pl-12 flex-1 ">
            <h2 class="text-3xl font-bold text-purple-800 mb-6">Our Mission: Helping Millions Grow Better</h2>
            <p class="text-lg text-gray-700 mb-6">
              We aim to empower fashion designers and customers by providing an intuitive digital space where 
              creativity meets convenience. By integrating smart technology with traditional tailoring, we ensure 
              that clients receive quality garments that fit perfectly while enabling designers to manage their 
              businesses efficiently.
            </p>
            <p class="text-lg text-gray-700">
              We believe not just in growing bigger, but in growing better. And growing better means aligning the
              success of your own business with the success of your customers. Win-win!
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Vision Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-20">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-purple-800 mb-6">Our Vision</h2>
          <p class="text-lg text-gray-700">
            To become the leading digital hub for fashion customization, where technology-driven solutions 
            make fashion more accessible, personalized, and sustainable.
          </p>
        </div>
      </div>
    </section>
        
    <!-- Our Story -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-20">
        <div class="flex flex-col lg:flex-row items-center">
          <div class="pb-12 lg:pr-12 flex-1">
            <h2 class="text-3xl font-bold text-purple-800 mb-6">Our Story</h2>
            <p class="text-lg text-gray-700 mb-6">
              Taylorni began as a simple idea between two junior students at <span class="font-bold">Palm University College</span>—combining technology and fashion to make custom design more accessible. With Halifax leading software development and Ruth driving marketing and research, we are building a platform that streamlines the fashion experience for both designers and clients.
            </p>
            <p class="text-lg text-gray-700">
              Though we're a startup still in its early stages, our passion and dedication push us to keep learning, improving, and turning Taylorni into something truly impactful.
            </p>
          </div>
          <div class="flex-1">
            <img 
              :src="aboutStory" 
              alt="Founders" 
              class="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>

     <!-- Values -->
    <section class="mb-12 pt-5">
      <h2 class="text-3xl font-bold text-amber-500 mb-12 text-center">Our Values</h2>
      <!-- innovation -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-20">
        <div class="bg-white border border-amber-200 rounded-lg p-4 text-center">
          <div class="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-800 py-2">Innovation</h4>
          <p class="text-gray-700">Pushing the boundaries of fashion technology.</p>
        </div>

        <!-- customer-centricity -->
        <div class="bg-white border border-amber-200 rounded-lg p-4 text-center">
          <div class="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-800 py-2">Customer-Centricity</h4>
          <p class="text-gray-700">Ensuring an effortless and enjoyable experience for both designers and clients.</p>
        </div>

        <!-- collaboration -->
        <div class="bg-white border border-amber-200 rounded-lg p-4 text-center">
          <div class="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-800 py-2">Collaboration</h4>
          <p class="text-gray-700">Connecting designers, businesses, and fashion enthusiasts in a unified space.</p>
        </div>

        <!-- sustainability -->
        <div class="bg-white border border-amber-200 rounded-lg p-4 text-center">
          <div class="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.565M6 12.5V10a2 2 0 10-4 0v2.5" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-800 py-2">Sustainability</h4>
          <p class="text-gray-700">Promoting ethical and efficient fashion production through digital solutions.</p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-20">
        <h2 class="text-3xl font-bold text-amber-500 mb-12 text-center">Meet The Team</h2>
        
        <div class="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-center">
          <!-- Team Member 1 -->
          <div class="md:w-1/2 max-w-md border  border-amber-200 rounded-lg p-8 text-center">
            <div class="flex justify-center mb-6">
              <div class="w-32 h-32 rounded-full overflow-hidden">
                <!-- <img src="/api/placeholder/128/128" alt="Ruth Asiedua Nyarko" class="w-full h-full object-cover" /> -->
              </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Ruth Asiedua Nyarko</h3>
            <p class="text-amber-500 font-medium uppercase tracking-wider mb-4">GENERAL MANAGER</p>
            <p class="text-gray-700 mb-6">
              The strategic brain of Taylorni, handling marketing, research, and business operations. 
              Her expertise in market analysis and brand development ensures that Taylorni reaches the right 
              audience and meets the industry's demands.
            </p>
            <div class="flex justify-center space-x-4">
              <a href="#" class="text-gray-900 hover:text-purple-800">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" class="text-gray-900 hover:text-purple-800">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Team Member 2 -->
            <div class="md:w-1/2 max-w-md border  border-amber-200 rounded-lg p-8 text-center">
            <div class="flex justify-center mb-6">
              <div class="w-32 h-32 rounded-full overflow-hidden">
                <!-- <img src="/api/placeholder/128/128" alt="Halifax Shambuck Yeboah" class="w-full h-full object-cover" /> -->
              </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Halifax Shambuck Yeboah</h3>
            <p class="text-amber-500 font-medium uppercase tracking-wider mb-4">CHIEF TECHNOLOGY OFFICER</p>
            <p class="text-gray-700 mb-6">
              The tech mastermind behind Taylorni, responsible for programming and software development. 
              With a strong passion for innovation, he ensures the platform is efficient, user-friendly, and future-proof.
            </p>
            <div class="flex justify-center space-x-4">
              <a href="#" class="text-gray-900 hover:text-purple-800">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" class="text-gray-900 hover:text-purple-800">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
        
    <!-- Call to Action -->
    <section class="bg-gradient-to-r from-purple-900 to-amber-500 py-12 mx-20 rounded-xl text-center shadow-lg">
      <h3 class="text-2xl font-bold text-white mb-4">
        Join <span class="italic">Taylorni</span> and experience the future of fashion. 🚀
      </h3>
      <button class="btn btn-lg bg-white border-none text-purple-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300">
        Sign up today!
      </button>
    </section>
  </main>
</template>