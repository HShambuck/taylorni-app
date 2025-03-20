<script setup>
import Sidebar from "@/components/Sidebar.vue";
import DashboardNavbar from "@/components/DashboardNavbar.vue";

const designerUser = {
  name: "Ella Styles",
  avatar: "https://via.placeholder.com/40",
};
</script>

<template>
  <div class="flex min-h-screen bg-amber-50">
    <!-- Sidebar -->
    <Sidebar userType="designer" />

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 px-6">
      <DashboardNavbar title="Designer Dashboard" :user="designerUser"/>
      <div class="p-6">
        <router-view /> <!-- 🚀 Displays the active page -->
      </div>
    </div>
  </div>
</template>