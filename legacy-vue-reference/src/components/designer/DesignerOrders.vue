<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/auth";
import { useOrdersStore } from "@/stores/ordersStore";
import { useClientStore } from "@/stores/clientStore";

const router = useRouter();
const userStore = useUserStore();
const ordersStore = useOrdersStore();
const clientStore = useClientStore();

// Loading state
const isLoading = ref(true);
const error = ref(null);

// Filter states
const filters = reactive({
  search: "",
  status: "",
  timeRange: "all",
  orderType: "",
});

// Pagination
const itemsPerPage = 10;
const currentPage = ref(1);

// Modal states
const showOrderModal = ref(false);
const showStatusModal = ref(false);
const showCancelModal = ref(false);
const showMessageModal = ref(false);

// Selected order and form inputs
const selectedOrder = ref({});
const newStatus = ref("");
const statusNotes = ref("");
const cancelReason = ref("");
const messageSubject = ref("");
const messageContent = ref("");

// Default timeline for new orders
const defaultTimeline = [
  {
    title: "Order confirmed",
    completed: true,
    date: "N/A",
    description: "Your custom clothing order has been confirmed",
  },
  {
    title: "Pattern Making",
    completed: false,
    date: null,
    description: "Creating custom patterns based on your measurements",
  },
  {
    title: "Fabric Cutting",
    completed: false,
    date: null,
    description: "Your fabric is being cut according to measurements",
  },
  {
    title: "Sewing & Assembly",
    completed: false,
    date: null,
    description: "Your garment is being sewn by our expert tailors",
  },
  {
    title: "Fitting & Adjustments",
    completed: false,
    date: null,
    description: "Garment ready for final fitting and adjustments",
  },
  {
    title: "Final Assembly & Finishing",
    completed: false,
    date: null,
    description: "Final details and finishing touches",
  },
  {
    title: "Packaging & Delivery",
    completed: false,
    date: null,
    description: "Your custom garment is ready to be delivered",
  },
];

// Function to get orders for the current designer/user
const getDesignerOrders = () => {
  if (!userStore.isAuthenticated || !userStore.isDesigner) {
    return [];
  }

  const userId = userStore.userInfo?.id;
  if (!userId) return [];

  return ordersStore.orders.filter((order) => order.designerId === userId);
};

// Add this to your computed properties
const getClientName = computed(() => {
  return (clientId) => {
    return clientStore.getClientFullName(clientId) || `Client #${clientId}`;
  };
});

// Order statistics
const orderStats = computed(() => {
  const designerOrders = getDesignerOrders();

  const totalOrders = designerOrders.length;
  const pendingOrders = designerOrders.filter(
    (order) => order.status === "Pending" || order.status === "In Progress"
  ).length;
  const completedOrders = designerOrders.filter(
    (order) => order.status === "Completed"
  ).length;
  const totalRevenue = designerOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
  };
});

// Computed to get filtered orders based on all filters
const filteredOrders = computed(() => {
  let result = getDesignerOrders();

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((order) => {
      return (
        (order.id && order.id.toString().includes(filters.search)) ||
        (getClientName(order.clientId) &&
          getClientName(order.clientId).toLowerCase().includes(searchLower)) ||
        (order.productName &&
          order.productName.toLowerCase().includes(searchLower))
      );
    });
  }

  // Apply status filter
  if (filters.status) {
    result = result.filter((order) => order.status === filters.status);
  }

  // Apply order type filter
  if (filters.orderType) {
    result = result.filter((order) => order.orderType === filters.orderType);
  }

  // Apply time range filter
  if (filters.timeRange !== "all") {
    const today = new Date();
    const startDate = new Date();

    switch (filters.timeRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(today.getMonth() - 3);
        break;
    }

    result = result.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= today;
    });
  }

  // Sort by newest first
  return result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
});

// Computed properties for pagination
const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage)
);

const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredOrders.value.slice(startIndex, endIndex);
});

const paginationStart = computed(() =>
  filteredOrders.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage + 1
);

const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredOrders.value.length)
);

// Available statuses based on current status
const availableStatuses = computed(() => {
  const statusFlow = {
    Pending: ["In Progress", "Canceled"],
    "In Progress": ["Ready to Ship", "Completed", "Canceled"],
    "Ready to Ship": ["Shipped", "Completed", "Canceled"],
    Shipped: ["Delivered", "Completed", "Canceled"],
    Delivered: ["Completed", "Canceled"],
    Completed: [],
    Canceled: [],
  };

  return statusFlow[selectedOrder.value.status] || [];
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Order status and actions methods
const canUpdateStatus = (order) => {
  return order.status !== "Completed" && order.status !== "Canceled";
};

const getStatusClass = (status) => {
  const classes = {
    Pending: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs",
    "Order confirmed":
      "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs",
    "Pattern Making":
      "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs",
    "Fabric Cutting":
      "bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs",
    "Sewing & Assembly":
      "bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs",
    "Fitting & Adjustments":
      "bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs",
    "Final Assembly & Finishing":
      "bg-lime-100 text-lime-800 px-2 py-1 rounded-full text-xs",
    "Packaging & Delivery":
      "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs",
    Completed: "bg-green-500 text-white px-2 py-1 rounded-full text-xs",
    Canceled: "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs",
  };

  return (
    classes[status] ||
    "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
  );
};

// Modal control methods
const viewOrderDetails = (order) => {
  selectedOrder.value = { ...order };
  showOrderModal.value = true;
};

const showUpdateStatusModal = (order) => {
  selectedOrder.value = { ...order };
  newStatus.value = "";
  statusNotes.value = "";
  showStatusModal.value = true;
};

const showCancelOrderModal = (order) => {
  selectedOrder.value = { ...order };
  cancelReason.value = "";
  showCancelModal.value = true;
};

const showMessageClientModal = (order) => {
  selectedOrder.value = { ...order };
  messageSubject.value = `Update on your order #${order.id}`;
  messageContent.value = "";
  showMessageModal.value = true;
};

// Order actions
const updateOrderStatus = async () => {
  if (!newStatus.value) return;

  try {
    const updatedOrder = {
      ...selectedOrder.value,
      status: newStatus.value,
      timeline: updateOrderTimeline(
        selectedOrder.value,
        newStatus.value,
        statusNotes.value
      ),
    };

    await ordersStore.updateOrder(updatedOrder.id, updatedOrder);

    // Close modals and refresh
    showStatusModal.value = false;
    showOrderModal.value = false;

    // Show success notification
    alert(`Order status updated to ${newStatus.value}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update order status");
  }
};

const cancelOrder = async () => {
  if (!cancelReason.value) {
    alert("Please provide a reason for cancellation");
    return;
  }

  try {
    const updatedOrder = {
      ...selectedOrder.value,
      status: "Canceled",
      cancellationReason: cancelReason.value,
      cancellationDate: new Date().toISOString(),
      timeline: [
        ...(selectedOrder.value.timeline || defaultTimeline),
        {
          title: "Order Canceled",
          completed: true,
          date: new Date().toISOString(),
          notes: cancelReason.value,
        },
      ],
    };

    await ordersStore.updateOrder(updatedOrder.id, updatedOrder);

    // Close modals
    showCancelModal.value = false;
    showOrderModal.value = false;

    // Show success notification
    alert("Order has been canceled");
  } catch (error) {
    console.error("Error canceling order:", error);
    alert("Failed to cancel order");
  }
};

const sendClientMessage = async () => {
  if (!messageSubject.value || !messageContent.value) {
    alert("Please fill out both subject and message content");
    return;
  }

  try {
    // Since you don't have a messages store, we'll simulate message sending
    // In a real app, you would integrate with your messaging system
    const message = {
      id: Date.now().toString(),
      clientId: selectedOrder.value.clientId,
      orderId: selectedOrder.value.id,
      subject: messageSubject.value,
      content: messageContent.value,
      sentAt: new Date().toISOString(),
      sentBy: userStore.userInfo?.id,
      read: false,
    };

    console.log("Sending message to client:", message);

    // Here you would normally save the message
    // await messagesStore.sendMessage(message);

    // Close modal
    showMessageModal.value = false;

    // Show success notification
    alert("Message sent to client");
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message");
  }
};

// Helper for updating the order timeline
const updateOrderTimeline = (order, newStatus, notes) => {
  // Status to timeline mapping
  const statusToTimelineTitle = {
    Pending: "Order Placed",
    "In Progress": "In Production",
    "Ready to Ship": "Ready to Ship",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Completed: "Completed",
    Canceled: "Order Canceled",
  };

  // Get current timeline or use default
  const timeline = order.timeline || [...defaultTimeline];

  // Find the corresponding timeline entry for the new status
  const timelineIndex = timeline.findIndex(
    (t) => t.title === statusToTimelineTitle[newStatus]
  );

  if (timelineIndex !== -1) {
    // Update the found timeline entry
    timeline[timelineIndex] = {
      ...timeline[timelineIndex],
      completed: true,
      date: new Date().toISOString(),
      notes: notes || undefined,
    };

    // Mark all previous steps as completed too
    for (let i = 0; i < timelineIndex; i++) {
      timeline[i].completed = true;
      if (!timeline[i].date) {
        timeline[i].date = new Date().toISOString();
      }
    }
  } else if (newStatus === "Canceled") {
    // Add a cancellation entry
    timeline.push({
      title: "Order Canceled",
      completed: true,
      date: new Date().toISOString(),
      notes: notes || undefined,
    });
  }

  return timeline;
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value) => {
  return Number(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

// Export data to CSV
const exportOrdersToCSV = () => {
  const orders = filteredOrders.value;
  if (orders.length === 0) {
    alert("No orders to export");
    return;
  }

  // Define CSV headers
  const headers = [
    "Order ID",
    "Client",
    "Product",
    "Type",
    "Date",
    "Status",
    "Amount",
  ];

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...orders.map((order) =>
      [
        order.id,
        `"${getClientName(order.clientId)}"`,
        `"${order.productName || "Custom Order"}"`,
        order.orderType === "marketplace" ? "Marketplace" : "Custom",
        formatDate(order.orderDate),
        order.status,
        formatCurrency(order.totalPrice),
      ].join(",")
    ),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute(
    "download",
    `orders-export-${new Date().toISOString().slice(0, 10)}.csv`
  );
  a.click();
};

// Check auth state
const checkAuthState = () => {
  if (!userStore.isAuthenticated) {
    error.value = "You must be logged in to view this page";
    router.push("/login");
    return false;
  }

  if (!userStore.isDesigner) {
    error.value = "This page is only accessible to designers";
    router.push("/dashboard");
    return false;
  }

  return true;
};

// Reset current page when filters change
watch(
  [
    () => filters.search,
    () => filters.status,
    () => filters.timeRange,
    () => filters.orderType,
  ],
  () => {
    currentPage.value = 1;
  }
);

// Lifecycle hooks
onMounted(async () => {
  try {
    // Initialize auth store if needed
    if (!userStore.isAuthenticated) {
      userStore.initializeStore();
    }

    // Check if user is authenticated and is a designer
    if (!checkAuthState()) {
      isLoading.value = false;
      return;
    }

    // Fetch orders data if not already loaded
    if (ordersStore.orders.length === 0) {
      await ordersStore.fetchOrders();
    }

    isLoading.value = false;
  } catch (error) {
    console.error("Error loading orders:", error);
    error.value = "Failed to load orders data";
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"
      ></div>
    </div>

    <template v-else>
      <!-- 1. Page Header & Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Orders Management</h1>
            <p class="text-gray-600 mt-1">
              View and manage all your customer orders
            </p>
          </div>

          <div class="flex gap-3">
            <button
              class="btn btn-outline border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
              @click="exportOrdersToCSV"
            >
              <i class="fas fa-download mr-2"></i> Export Orders
            </button>
          </div>
        </div>

        <!-- Filters & Search -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filters.search"
              class="w-full pl-10 p-2.5 border border-gray-300 rounded-lg"
              placeholder="Search orders..."
            />
          </div>

          <div>
            <select
              v-model="filters.status"
              class="w-full p-2.5 border border-gray-300 rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <div>
            <select
              v-model="filters.timeRange"
              class="w-full p-2.5 border border-gray-300 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>

          <div>
            <select
              v-model="filters.orderType"
              class="w-full p-2.5 border border-gray-300 rounded-lg"
            >
              <option value="">All Order Types</option>
              <option value="marketplace">Marketplace</option>
              <option value="custom">Custom Order</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. Order Summary (Stats Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Total Orders</p>
              <h3 class="text-2xl font-bold mt-2">
                {{ orderStats.totalOrders }}
              </h3>
            </div>
            <div class="bg-indigo-100 p-3 rounded-full">
              <i class="fas fa-shopping-bag text-indigo-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Pending Orders</p>
              <h3 class="text-2xl font-bold mt-2">
                {{ orderStats.pendingOrders }}
              </h3>
            </div>
            <div class="bg-yellow-100 p-3 rounded-full">
              <i class="fas fa-clock text-yellow-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Completed Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Completed Orders</p>
              <h3 class="text-2xl font-bold mt-2">
                {{ orderStats.completedOrders }}
              </h3>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Revenue from Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Total Revenue</p>
              <h3 class="text-2xl font-bold mt-2">
                ₵{{ formatCurrency(orderStats.totalRevenue) }}
              </h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-dollar-sign text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Orders Table -->
      <div class="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="bg-gray-50 px-6 py-3 text-left">#</th>
                <th class="bg-gray-50 px-6 py-3 text-left">Client</th>
                <th class="bg-gray-50 px-6 py-3 text-left">Product</th>
                <th class="bg-gray-50 px-6 py-3 text-left">Type</th>
                <th class="bg-gray-50 px-6 py-3 text-left">Date</th>
                <th class="bg-gray-50 px-6 py-3 text-left">Status</th>
                <th class="bg-gray-50 px-6 py-3 text-right">Amount</th>
                <th class="bg-gray-50 px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                  No orders found matching your filters.
                </td>
              </tr>
              <tr
                v-for="order in paginatedOrders"
                :key="order.id"
                class="hover:bg-gray-50 border-b"
              >
                <td class="px-6 py-4 font-medium">#{{ order.id }}</td>
                <td class="px-6 py-4">{{ getClientName(order.clientId) }}</td>
                <td class="px-6 py-4">
                  {{ order.productName || "Custom Order" }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'px-2 py-1 rounded-full text-xs': true,
                      'bg-blue-100 text-blue-700':
                        order.orderType === 'marketplace',
                      'bg-purple-100 text-purple-700':
                        order.orderType === 'custom',
                    }"
                  >
                    {{
                      order.orderType === "marketplace"
                        ? "Marketplace"
                        : "Custom"
                    }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ formatDate(order.orderDate) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  ₵{{ formatCurrency(order.totalPrice) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center space-x-2">
                    <button
                      @click="viewOrderDetails(order)"
                      class="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="canUpdateStatus(order)"
                      @click="showUpdateStatusModal(order)"
                      class="text-purple-600 hover:text-purple-800"
                      title="Update Status"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      v-if="
                        order.status !== 'Canceled' &&
                        order.status !== 'Completed'
                      "
                      @click="showCancelOrderModal(order)"
                      class="text-red-600 hover:text-red-800"
                      title="Cancel Order"
                    >
                      <i class="fas fa-times-circle"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ paginationStart }}</span> to
              <span class="font-medium">{{ paginationEnd }}</span> of
              <span class="font-medium">{{ filteredOrders.length }}</span>
              orders
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              class="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="{
                'opacity-50 cursor-not-allowed': currentPage === totalPages,
              }"
              class="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Order Details Modal -->
      <div
        v-if="showOrderModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h2 class="text-xl font-bold text-gray-800">
              Order #{{ selectedOrder.id }} Details
            </h2>
            <button
              @click="showOrderModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6">
            <!-- Order Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 class="text-lg font-semibold mb-4">Order Information</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span :class="getStatusClass(selectedOrder.status)">{{
                      selectedOrder.status
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Order Date:</span>
                    <span>{{ formatDate(selectedOrder.orderDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Order Type:</span>
                    <span>{{
                      selectedOrder.orderType === "marketplace"
                        ? "Marketplace"
                        : "Custom"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Amount:</span>
                    <span class="font-semibold"
                      >₵{{ formatCurrency(selectedOrder.totalPrice) }}</span
                    >
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-4">Client Information</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span>{{ getClientName(selectedOrder.clientId) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span>{{
                      selectedOrder.clientEmail || "Not available"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phone:</span>
                    <span>{{
                      selectedOrder.clientPhone || "Not available"
                    }}</span>
                  </div>
                  <div class="flex justify-between items-start">
                    <span class="text-gray-600">Shipping Address:</span>
                    <span class="text-right">{{
                      selectedOrder.shippingAddress || "Not available"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Details -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Product Details</h3>
              <div class="border rounded-lg overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                  <div class="md:col-span-1">
                    <img
                      :src="
                        selectedOrder.productImage || '/images/placeholder.jpg'
                      "
                      :alt="selectedOrder.productName"
                      class="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div class="md:col-span-3">
                    <h4 class="font-medium">
                      {{ selectedOrder.productName || "Custom Design Order" }}
                    </h4>
                    <p class="text-gray-600 text-sm mt-2">
                      {{
                        selectedOrder.productDescription ||
                        "Custom design based on client specifications"
                      }}
                    </p>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <span class="text-gray-500 text-sm">Quantity:</span>
                        <span class="ml-2">{{
                          selectedOrder.quantity || 1
                        }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500 text-sm">Price:</span>
                        <span class="ml-2"
                          >₵{{
                            formatCurrency(
                              selectedOrder.totalPrice /
                                (selectedOrder.quantity || 1)
                            )
                          }}
                          each</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Notes -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Order Notes</h3>
              <div class="border rounded-lg p-4 bg-gray-50">
                <p v-if="selectedOrder.notes">{{ selectedOrder.notes }}</p>
                <p v-else class="text-gray-500">
                  No notes available for this order.
                </p>
              </div>
            </div>

            <!-- Order Timeline -->
            <!-- In your order details modal, replace the timeline section with: -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Order Progress</h3>

              <!-- Desktop Horizontal Timeline -->
              <div class="hidden md:block relative mb-8">
                <!-- Horizontal Line -->
                <div
                  class="absolute left-0 right-0 top-5 h-0.5 bg-gray-200"
                ></div>

                <!-- Steps -->
                <div class="flex justify-between relative">
                  <div
                    v-for="(step, index) in selectedOrder.timeline ||
                    defaultTimeline"
                    :key="index"
                    class="flex flex-col items-center relative z-10"
                  >
                    <!-- Status Circle -->
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      :class="{
                        'bg-amber-500 text-white': step.completed,
                        'bg-gray-200 text-gray-400': !step.completed,
                        'ring-4 ring-amber-200': step.active,
                      }"
                    >
                      <svg
                        v-if="step.completed"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span v-else class="text-sm">{{ index + 1 }}</span>
                    </div>

                    <!-- Step Info -->
                    <div class="w-24 text-center">
                      <h3
                        class="font-medium text-sm"
                        :class="{
                          'text-black': step.completed,
                          'text-gray-500': !step.completed,
                          'text-amber-600': step.active,
                        }"
                      >
                        {{ step.title }}
                      </h3>
                      <p v-if="step.date" class="text-gray-400 text-xs mt-1">
                        {{ formatDate(step.date) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile Vertical Timeline -->
              <div class="md:hidden relative">
                <!-- Vertical Line -->
                <div
                  class="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"
                ></div>

                <!-- Steps -->
                <div
                  v-for="(step, index) in selectedOrder.timeline ||
                  defaultTimeline"
                  :key="index"
                  class="flex mb-8 relative z-10"
                >
                  <!-- Status Circle -->
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                    :class="{
                      'bg-amber-500 text-white': step.completed,
                      'bg-gray-200 text-gray-400': !step.completed,
                      'ring-4 ring-amber-200': step.active,
                    }"
                  >
                    <svg
                      v-if="step.completed"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span v-else class="text-sm">{{ index + 1 }}</span>
                  </div>

                  <!-- Step Info -->
                  <div class="flex-grow">
                    <div class="flex justify-between">
                      <h3
                        class="font-medium"
                        :class="{
                          'text-black': step.completed,
                          'text-gray-500': !step.completed,
                          'text-amber-600': step.active,
                        }"
                      >
                        {{ step.title }}
                      </h3>
                      <span v-if="step.time" class="text-gray-500 text-sm">{{
                        step.time
                      }}</span>
                    </div>
                    <p class="text-gray-500 text-sm mt-1">
                      {{ step.description }}
                    </p>
                    <p v-if="step.date" class="text-gray-400 text-xs mt-1">
                      {{ formatDate(step.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap justify-end gap-4 mt-6 border-t pt-6">
              <button
                v-if="
                  selectedOrder.status !== 'Completed' &&
                  selectedOrder.status !== 'Canceled'
                "
                @click="showUpdateStatusModal(selectedOrder)"
                class="btn bg-purple-900 hover:bg-purple-800 text-white"
              >
                Update Status
              </button>
              <button
                @click="showMessageClientModal(selectedOrder)"
                class="btn bg-blue-600 hover:bg-blue-500 text-white"
              >
                Message Client
              </button>
              <button
                v-if="
                  selectedOrder.status !== 'Canceled' &&
                  selectedOrder.status !== 'Completed'
                "
                @click="showCancelOrderModal(selectedOrder)"
                class="btn bg-red-600 hover:bg-red-500 text-white"
              >
                Cancel Order
              </button>
              <button @click="showOrderModal = false" class="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Update Status Modal -->
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h2 class="text-lg font-bold text-gray-800">Update Order Status</h2>
            <button
              @click="showStatusModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Current Status</label>
              <div
                :class="getStatusClass(selectedOrder.status)"
                class="inline-block"
              >
                {{ selectedOrder.status }}
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">New Status</label>
              <select
                v-model="newStatus"
                class="w-full p-2.5 border border-gray-300 rounded-lg"
              >
                <option value="Order confirmed">Order confirmed</option>
                <option value="Pattern Making">Pattern Making</option>
                <option value="Fabric Cutting">Fabric Cutting</option>
                <option value="Sewing & Assembly">Sewing & Assembly</option>
                <option value="Fitting & Adjustments">
                  Fitting & Adjustments
                </option>
                <option value="Final Assembly & Finishing">
                  Final Assembly & Finishing
                </option>
                <option value="Packaging & Delivery">
                  Packaging & Delivery
                </option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2"
                >Status Notes (Optional)</label
              >
              <textarea
                v-model="statusNotes"
                class="w-full p-2.5 border border-gray-300 rounded-lg"
                placeholder="Add any notes about this status change..."
                rows="3"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4 mt-6">
              <button @click="showStatusModal = false" class="btn btn-outline">
                Cancel
              </button>
              <button
                @click="updateOrderStatus"
                class="btn bg-purple-900 hover:bg-purple-800 text-white"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Cancel Order Modal -->
      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h2 class="text-lg font-bold text-gray-800">Cancel Order</h2>
            <button
              @click="showCancelModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6">
            <div class="mb-4">
              <p class="text-gray-700">
                Are you sure you want to cancel order #{{ selectedOrder.id }}?
              </p>
              <p class="text-gray-500 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2"
                >Reason for Cancellation</label
              >
              <textarea
                v-model="cancelReason"
                class="w-full p-2.5 border border-gray-300 rounded-lg"
                placeholder="Please provide a reason for cancellation..."
                rows="3"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4 mt-6">
              <button @click="showCancelModal = false" class="btn btn-outline">
                No, Keep Order
              </button>
              <button
                @click="cancelOrder"
                class="btn bg-red-600 hover:bg-red-500 text-white"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Message Client Modal -->
      <div
        v-if="showMessageModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h2 class="text-lg font-bold text-gray-800">Message Client</h2>
            <button
              @click="showMessageModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">To</label>
              <div class="p-2.5 border border-gray-200 rounded-lg bg-gray-50">
                {{ getClientName(selectedOrder.clientId) }}
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Subject</label>
              <input
                v-model="messageSubject"
                class="w-full p-2.5 border border-gray-300 rounded-lg"
                placeholder="Enter message subject..."
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Message</label>
              <textarea
                v-model="messageContent"
                class="w-full p-2.5 border border-gray-300 rounded-lg"
                placeholder="Type your message here..."
                rows="5"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4 mt-6">
              <button @click="showMessageModal = false" class="btn btn-outline">
                Cancel
              </button>
              <button
                @click="sendClientMessage"
                class="btn bg-blue-600 hover:bg-blue-500 text-white"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
