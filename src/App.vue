<script setup>
import { useRoute } from "vue-router";
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
</script>

<template>
   <!-- Conditionally Show Navbar -->
    <Navbar v-if="route.meta.showNav"/>

    <!-- Main Page Content -->
    <router-view />

    <!-- Conditionally Show Footer -->
    <Footer v-if="route.meta.showFooter" />
</template>


