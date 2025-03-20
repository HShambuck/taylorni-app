<script setup>
import { ref } from "vue";
const customOrders = ref([
  {
    id: "CUST001",
    name: "Elegant Evening Gown",
    status: "In Progress",
    expectedDelivery: "March 25, 2025",
    designer: "Ruth Asiedua Nyarko",
  },
  {
    id: "CUST002",
    name: "Casual Hoodie & Joggers",
    status: "Pending",
    expectedDelivery: "TBD",
    designer: "Not Assigned",
  },
]);

const getStatusColor = (status) => {
  return status === "Completed"
    ? "badge-success"
    : status === "In Progress"
    ? "badge-info"
    : "badge-warning";
};
</script>

<template>
  <div class="bg-base-100 rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-purple-900">📋 My Custom Orders</h2>
        <p class="text-sm text-base-content/70 mt-1">Track the progress of your custom fashion requests</p>
      </div>
      <button class="btn bg-purple-900 text-white btn-sm">+ New Order</button>
    </div>
    
    <div v-if="customOrders.length > 0" class="overflow-x-auto">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-0">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Outfit Name</th>
                <th>Designer</th>
                <th>Status</th>
                <th>Expected Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in customOrders" :key="order.id">
                <td>
                  <div class="font-medium">{{ order.id }}</div>
                </td>
                <td>{{ order.name }}</td>
                <td>{{ order.designer }}</td>
                <td>
                  <div class="badge" :class="getStatusColor(order.status)">
                    {{ order.status }}
                  </div>
                </td>
                <td>{{ order.expectedDelivery }}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-ghost btn-xs">View</button>
                    <button class="btn btn-ghost btn-xs">Edit</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div v-else class="card bg-base-100 shadow-lg p-12 text-center">
      <div class="text-5xl mb-4">📦</div>
      <h3 class="text-xl font-bold">No custom orders yet</h3>
      <p class="text-base-content/70 mt-2">Create your first custom order to get started</p>
      <button class="btn btn-primary mt-4">Create Custom Order</button>
    </div>
  </div>
</template>