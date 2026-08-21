<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClientStore } from "@/stores/clientStore";
import { useOrdersStore } from "@/stores/ordersStore";
import { useUserStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const clientStore = useClientStore();
const ordersStore = useOrdersStore();
const userStore = useUserStore();

// Client ID from route params
const clientId = computed(() => route.params.id);

// Initialize data
onMounted(async () => {
  if (clientStore.clients.length === 0) {
    await clientStore.fetchClients();
  }

  if (ordersStore.orders.length === 0) {
    await ordersStore.fetchOrders();
  }

  // Reset active tab
  activeTab.value = "overview";
});

// Client info
const client = computed(() => {
  const clientData = clientStore.getClientById(clientId.value);
  return clientData;
});

// Designer info
const designerId = computed(() => userStore.userInfo?.id);

// Client orders
const clientOrders = computed(() => {
  if (!clientId.value || !designerId.value) return [];

  return ordersStore.orders
    .filter(
      (order) =>
        order.clientId === clientId.value &&
        order.designerId === designerId.value
    )
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
});

// Active/inactive status
const clientStatus = computed(() => {
  if (!clientOrders.value.length) return "Inactive";
  return clientOrders.value.some((order) => order.status === "In Progress")
    ? "Active"
    : "Inactive";
});

// Client spending statistics
const clientStats = computed(() => {
  if (!clientOrders.value.length) return null;

  const totalSpent = clientOrders.value.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const averageOrderValue = totalSpent / clientOrders.value.length;

  // Get orders in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentOrders = clientOrders.value.filter(
    (order) => new Date(order.orderDate) >= thirtyDaysAgo
  );

  const recentSpending = recentOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  // First and latest order dates
  const firstOrder = [...clientOrders.value].sort(
    (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
  )[0];

  const latestOrder = [...clientOrders.value].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  )[0];

  return {
    totalSpent: ordersStore.formatCurrency(totalSpent),
    averageOrderValue: ordersStore.formatCurrency(averageOrderValue),
    totalOrders: clientOrders.value.length,
    recentSpending: ordersStore.formatCurrency(recentSpending),
    recentOrders: recentOrders.length,
    firstOrderDate: firstOrder ? firstOrder.orderDate : "N/A",
    latestOrderDate: latestOrder ? latestOrder.orderDate : "N/A",
    clientSince: firstOrder
      ? new Date(firstOrder.orderDate).toLocaleDateString()
      : "N/A",
  };
});

// UI state
const activeTab = ref("overview");
const isEditingContact = ref(false);
const isEditingPreferences = ref(false);

// Form data for editing
const contactForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  address: "",
  company: "",
});

const preferencesForm = ref({
  preferredContactMethod: "",
  designPreferences: "",
  colorPreferences: "",
  styleNotes: "",
  communicationFrequency: "",
});

// Initialize form data when editing
function editContact() {
  contactForm.value = {
    firstName: client.value.firstName || "",
    lastName: client.value.lastName || "",
    email: client.value.email || "",
    phone: client.value.phone || "",
    location: client.value.location || "",
    address: client.value.address || "",
    company: client.value.company || "",
  };
  isEditingContact.value = true;
}

function editPreferences() {
  preferencesForm.value = {
    preferredContactMethod: client.value.preferredContactMethod || "email",
    designPreferences: client.value.designPreferences || "",
    colorPreferences: client.value.colorPreferences || "",
    styleNotes: client.value.styleNotes || "",
    communicationFrequency: client.value.communicationFrequency || "weekly",
  };
  isEditingPreferences.value = true;
}

// Save changes
function saveContact() {
  // In a real app, you would update the client in the store and API
  console.log("Saving contact info:", contactForm.value);
  // clientStore.updateClient(clientId.value, contactForm.value);
  isEditingContact.value = false;
}

function savePreferences() {
  // In a real app, you would update the client in the store and API
  console.log("Saving preferences:", preferencesForm.value);
  // clientStore.updateClientPreferences(clientId.value, preferencesForm.value);
  isEditingPreferences.value = false;
}

// Cancel editing
function cancelContactEdit() {
  isEditingContact.value = false;
}

function cancelPreferencesEdit() {
  isEditingPreferences.value = false;
}

// Navigation
function goBack() {
  router.push("/designer/clients");
}

function viewOrder(orderId) {
  router.push(`/designer/orders/${orderId}`);
}

// Stats
const activityMonths = computed(() => {
  if (!clientOrders.value.length) return [];

  // Get the last 6 months
  const months = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.unshift(
      date.toLocaleString("default", { month: "short", year: "numeric" })
    );
  }

  // Count orders per month
  const ordersByMonth = months.map((month) => {
    const [monthName, yearStr] = month.split(" ");
    const year = parseInt(yearStr);
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

    const count = clientOrders.value.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year
      );
    }).length;

    return { month, count };
  });

  return ordersByMonth;
});

// Get badge class based on status
function getBadgeClass(status) {
  switch (status) {
    case "Active":
      return "badge-success";
    case "Inactive":
      return "badge-error";
    case "Completed":
      return "badge-success";
    case "In Progress":
      return "badge-warning";
    case "Pending":
      return "badge-info";
    case "Cancelled":
      return "badge-error";
    default:
      return "badge-secondary";
  }
}

// Actions
function messageClient() {
  console.log(`Message client with ID: ${clientId.value}`);
  // Open messaging interface or redirect to messaging page
  // router.push(`/designer/messages?client=${clientId.value}`);
}

function callClient() {
  if (client.value && client.value.phone) {
    window.location.href = `tel:${client.value.phone}`;
  } else {
    console.log(`No phone number available for client`);
  }
}

function emailClient() {
  if (client.value && client.value.email) {
    window.location.href = `mailto:${client.value.email}`;
  } else {
    console.log(`No email available for client`);
  }
}

function createOrder() {
  router.push(`/designer/orders/new?client=${clientId.value}`);
}
</script>

<template>
  <div v-if="client" class="bg-gray-50 min-h-screen">
    <!-- Client Details Header -->
    <div class="p-6 bg-white shadow-sm">
      <div class="flex items-center mb-4">
        <button @click="goBack" class="btn btn-ghost btn-sm mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Client Details</h1>
      </div>

      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div class="flex items-center mb-4 md:mb-0">
          <div class="avatar mr-4">
            <div
              class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center"
            >
              <span class="text-2xl font-bold text-purple-900"
                >{{ client.firstName?.charAt(0)
                }}{{ client.lastName?.charAt(0) }}</span
              >
            </div>
          </div>
          <div>
            <h2 class="text-xl font-bold">
              {{ client.firstName }} {{ client.lastName }}
            </h2>
            <div class="flex items-center mt-1">
              <div :class="`badge ${getBadgeClass(clientStatus)} mr-2`">
                {{ clientStatus }}
              </div>
              <span class="text-gray-500 text-sm"
                >Client since {{ clientStats?.clientSince || "N/A" }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-sm" @click="messageClient">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Message
          </button>
          <button class="btn btn-sm" @click="callClient">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call
          </button>
          <button class="btn btn-sm" @click="emailClient">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </button>
          <button
            class="btn btn-primary btn-sm bg-purple-900 hover:bg-purple-800 text-white"
            @click="createOrder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Order
          </button>
        </div>
      </div>
    </div>

    <!-- Client Stats -->
    <div class="p-6" v-if="clientStats">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-500 text-sm">Total Spent</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ clientStats.totalSpent }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-gray-500 text-sm"
              >{{ clientStats.recentSpending }} in last 30 days</span
            >
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-500 text-sm">Total Orders</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ clientStats.totalOrders }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-gray-500 text-sm"
              >{{ clientStats.recentOrders }} in last 30 days</span
            >
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-500 text-sm">Average Order</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ clientStats.averageOrderValue }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-purple-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-gray-500 text-sm">Client average per order</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-500 text-sm">Latest Order</p>
              <p class="text-xl font-bold text-gray-800">
                {{ clientStats.latestOrderDate }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-orange-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-gray-500 text-sm"
              >First order: {{ clientStats.firstOrderDate }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="p-6 pt-3">
      <div class="tabs-bordered w-full">
        <button
          class="tab tab-lg"
          :class="{ 'tab-active': activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          Overview
        </button>
        <button
          class="tab tab-lg"
          :class="{ 'tab-active': activeTab === 'orders' }"
          @click="activeTab = 'orders'"
        >
          Orders
        </button>
        <button
          class="tab tab-lg"
          :class="{ 'tab-active': activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          Activity
        </button>
        <button
          class="tab tab-lg"
          :class="{ 'tab-active': activeTab === 'notes' }"
          @click="activeTab = 'notes'"
        >
          Notes
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="p-6 pt-0">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- Contact Information Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Contact Information</h3>
            <button
              v-if="!isEditingContact"
              class="btn btn-sm btn-ghost"
              @click="editContact"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit
            </button>
          </div>

          <!-- View Mode -->
          <div
            v-if="!isEditingContact"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="font-medium">
                {{ client.firstName }} {{ client.lastName }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{{ client.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">{{ client.phone || "Not provided" }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Location</p>
              <p class="font-medium">{{ client.location || "Not provided" }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Address</p>
              <p class="font-medium">{{ client.address || "Not provided" }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Company</p>
              <p class="font-medium">{{ client.company || "Not provided" }}</p>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">First Name</span>
              </label>
              <input
                type="text"
                v-model="contactForm.firstName"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Last Name</span>
              </label>
              <input
                type="text"
                v-model="contactForm.lastName"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                v-model="contactForm.email"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Phone</span>
              </label>
              <input
                type="tel"
                v-model="contactForm.phone"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Location</span>
              </label>
              <input
                type="text"
                v-model="contactForm.location"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Company</span>
              </label>
              <input
                type="text"
                v-model="contactForm.company"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text">Address</span>
              </label>
              <textarea
                v-model="contactForm.address"
                class="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <div class="md:col-span-2 flex justify-end gap-2 mt-4">
              <button class="btn btn-sm" @click="cancelContactEdit">
                Cancel
              </button>
              <button
                class="btn btn-sm btn-primary bg-purple-900 hover:bg-purple-800 text-white"
                @click="saveContact"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Preferences & Notes</h3>
            <button
              v-if="!isEditingPreferences"
              class="btn btn-sm btn-ghost"
              @click="editPreferences"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit
            </button>
          </div>

          <!-- View Mode -->
          <div
            v-if="!isEditingPreferences"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <p class="text-sm text-gray-500">Preferred Contact Method</p>
              <p class="font-medium">
                {{ client.preferredContactMethod || "Email" }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Communication Frequency</p>
              <p class="font-medium">
                {{ client.communicationFrequency || "As needed" }}
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Design Preferences</p>
              <p class="font-medium">
                {{ client.designPreferences || "No preferences specified" }}
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Color Preferences</p>
              <p class="font-medium">
                {{ client.colorPreferences || "No preferences specified" }}
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Style Notes</p>
              <p class="font-medium">
                {{ client.styleNotes || "No notes specified" }}
              </p>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Preferred Contact Method</span>
              </label>
              <select
                v-model="preferencesForm.preferredContactMethod"
                class="select select-bordered w-full"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text Message</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Communication Frequency</span>
              </label>
              <select
                v-model="preferencesForm.communicationFrequency"
                class="select select-bordered w-full"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="asneeded">As needed</option>
              </select>
            </div>
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text">Design Preferences</span>
              </label>
              <textarea
                v-model="preferencesForm.designPreferences"
                class="textarea textarea-bordered w-full"
              ></textarea>
            </div>
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text">Color Preferences</span>
              </label>
              <textarea
                v-model="preferencesForm.colorPreferences"
                class="textarea textarea-bordered w-full"
              ></textarea>
            </div>
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text">Style Notes</span>
              </label>
              <textarea
                v-model="preferencesForm.styleNotes"
                class="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <div class="md:col-span-2 flex justify-end gap-2 mt-4">
              <button class="btn btn-sm" @click="cancelPreferencesEdit">
                Cancel
              </button>
              <button
                class="btn btn-sm btn-primary bg-purple-900 hover:bg-purple-800 text-white"
                @click="savePreferences"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Tab (continued) -->
      `
      <div v-if="activeTab === 'orders'" class="bg-white rounded-lg shadow-sm">
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-semibold">Order History</h3>
          <button
            class="btn btn-sm btn-primary bg-purple-900 hover:bg-purple-800 text-white"
            @click="createOrder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Order
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in clientOrders" :key="order.id" class="hover">
                <td>{{ order.id }}</td>
                <td>{{ order.orderDate }}</td>
                <td>{{ order.service }}</td>
                <td>{{ ordersStore.formatCurrency(order.totalPrice) }}</td>
                <td>
                  <div :class="`badge ${getBadgeClass(order.status)}`">
                    {{ order.status }}
                  </div>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-ghost"
                    @click="viewOrder(order.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="clientOrders.length === 0">
                <td colspan="6" class="text-center py-4 text-gray-500">
                  No orders found for this client
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'activity'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Activity Summary</h3>

          <!-- Monthly Activity Chart -->
          <div class="h-64 mb-6">
            <div class="flex h-full items-end space-x-2">
              <div
                v-for="(item, index) in activityMonths"
                :key="index"
                class="flex-1 flex flex-col items-center"
              >
                <div
                  class="w-full bg-purple-100 rounded-t-md"
                  :style="{ height: `${Math.max(5, item.count * 25)}px` }"
                >
                  <div
                    class="bg-purple-900 h-full rounded-t-md"
                    :style="{ width: '100%' }"
                  ></div>
                </div>
                <div
                  class="text-xs mt-2 text-gray-600 w-full text-center overflow-hidden whitespace-nowrap overflow-ellipsis"
                >
                  {{ item.month }}
                </div>
                <div class="text-xs font-semibold mt-1">{{ item.count }}</div>
              </div>
            </div>
          </div>

          <!-- Recent Activity Timeline -->
          <h4 class="font-medium text-gray-700 mb-4">Recent Client Activity</h4>
          <div class="space-y-4">
            <div
              v-for="(order, index) in clientOrders.slice(0, 5)"
              :key="index"
              class="flex"
            >
              <div class="mr-4 flex flex-col items-center">
                <div class="w-3 h-3 bg-purple-900 rounded-full"></div>
                <div
                  class="w-0.5 h-full bg-gray-200"
                  v-if="index < clientOrders.slice(0, 5).length - 1"
                ></div>
              </div>
              <div class="flex-1 pb-4">
                <div class="flex items-center justify-between">
                  <p class="font-medium">{{ order.service || "New Order" }}</p>
                  <span class="text-sm text-gray-500">{{
                    order.orderDate
                  }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  {{
                    order.status === "Completed"
                      ? "Completed order"
                      : order.status === "In Progress"
                      ? "Order in progress"
                      : "Order created"
                  }}
                  • {{ ordersStore.formatCurrency(order.totalPrice) }}
                </p>
                <button
                  class="text-sm text-purple-900 mt-2 hover:underline"
                  @click="viewOrder(order.id)"
                >
                  View Order
                </button>
              </div>
            </div>
            <div
              v-if="clientOrders.length === 0"
              class="text-center py-8 text-gray-500"
            >
              No activity found for this client
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Tab -->
      <div
        v-if="activeTab === 'notes'"
        class="bg-white rounded-lg shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Client Notes</h3>
          <button
            class="btn btn-sm btn-primary bg-purple-900 hover:bg-purple-800 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Note
          </button>
        </div>

        <div class="space-y-4">
          <!-- Note items would be populated here -->
          <div class="p-4 border border-gray-200 rounded-md">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">Initial Client Briefing</h4>
                <p class="text-sm text-gray-500">
                  Added by You • April 2, 2025
                </p>
              </div>
              <div class="flex">
                <button class="btn btn-sm btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button class="btn btn-sm btn-ghost text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-gray-700 mt-2">
              Client prefers minimalist designs with a focus on typography. They
              mentioned their brand colors (purple and teal) should be
              incorporated subtly. Follow-up needed on logo requirements.
            </p>
          </div>

          <div class="p-4 border border-gray-200 rounded-md">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">Project Timeline Discussion</h4>
                <p class="text-sm text-gray-500">
                  Added by You • April 1, 2025
                </p>
              </div>
              <div class="flex">
                <button class="btn btn-sm btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button class="btn btn-sm btn-ghost text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-gray-700 mt-2">
              Client needs all deliverables by end of month. They're flexible on
              pricing but want high-quality work. Weekly check-ins scheduled for
              Wednesdays at 10am.
            </p>
          </div>

          <!-- Empty state -->
          <div
            v-if="false"
            class="flex flex-col items-center justify-center py-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-gray-500">
              No notes have been added for this client
            </p>
            <button
              class="btn btn-sm btn-primary bg-purple-900 hover:bg-purple-800 text-white mt-4"
            >
              Add First Note
            </button>
          </div>
        </div>
      </div>
      <!-- Empty State - If client not found -->
      <div
        v-else
        class="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50"
      >
        <div class="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Client Not Found</h2>
          <p class="text-gray-600 mb-6">
            The client you're looking for doesn't exist or you may not have
            access to view this client.
          </p>
          <button
            @click="goBack"
            class="btn btn-primary bg-purple-900 hover:bg-purple-800 text-white"
          >
            Return to Clients
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
