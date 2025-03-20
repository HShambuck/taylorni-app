<script setup>
import Sidebar from "@/components/Sidebar.vue";
import DashboardNavbar from "@/components/DashboardNavbar.vue";

const clientUser = {
  name: "Aiden Max",
  avatar: "https://via.placeholder.com/40",
};
</script>

<template>
  <div class="flex min-h-screen bg-amber-50">
    <!-- Sidebar -->
    <Sidebar userType="client" />

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 px-6">
      <DashboardNavbar title="Client Dashboard" :user="clientUser"/>
      <div class="p-6">
        <router-view /> <!-- 🚀 Displays the active page -->
      </div>
    </div>
  </div>
</template>