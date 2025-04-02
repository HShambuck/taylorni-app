<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useDesignStore } from "@/stores/designStore";
import { useUserStore } from "@/stores/auth";
import { useOrdersStore } from "@/stores/ordersStore";

// Store initialization
const designStore = useDesignStore();
const userStore = useUserStore();
const ordersStore = useOrdersStore();

// Component state
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");
const sortBy = ref("newest");
const priceRange = reactive({ min: "", max: "" });
const showAddEditModal = ref(false);
const currentDesign = ref(null);
const isEditing = ref(false);
const chartPeriod = ref("month");
const currentPage = ref(1);
const itemsPerPage = ref(6);

// Form data for new/edit design
const designForm = reactive({
  name: "",
  description: "",
  price: "",
  category: "",
  tags: [],
  status: "Live",
  stockQuantity: 0,
  images: [],
});

// Fetch designs on component mount
onMounted(async () => {
  await designStore.fetchDesigns();
  await ordersStore.fetchOrders();
});

// Computed properties
const filteredDesigns = computed(() => {
  let results = designStore.getMyDesigns;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (design) =>
        design.name.toLowerCase().includes(query) ||
        design.description.toLowerCase().includes(query) ||
        (design.tags &&
          design.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    results = results.filter(
      (design) => design.category === selectedCategory.value
    );
  }

  // Apply status filter
  if (selectedStatus.value) {
    results = results.filter(
      (design) => design.status === selectedStatus.value
    );
  }

  // Apply price range filter
  if (priceRange.min) {
    results = results.filter(
      (design) => design.price >= Number(priceRange.min)
    );
  }
  if (priceRange.max) {
    results = results.filter(
      (design) => design.price <= Number(priceRange.max)
    );
  }

  // Apply sorting
  return [...results].sort((a, b) => {
    switch (sortBy.value) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "popular":
        return b.orders - a.orders;
      case "highest":
        return b.price - a.price;
      case "lowest":
        return a.price - b.price;
      default:
        return 0;
    }
  });
});

// Paginated designs
const paginatedDesigns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredDesigns.value.slice(start, end);
});

// Total pages for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredDesigns.value.length / itemsPerPage.value);
});

// Dashboard stats
const totalDesigns = computed(() => designStore.getTotalDesignsCount);
const activeDesigns = computed(() => designStore.getActiveDesignsCount);
const pendingDesigns = computed(() => designStore.getPendingDesignsCount);
const totalRevenue = computed(() => {
  const designerOrders = ordersStore.orders.filter(
    (order) => order.designerId === userStore.userInfo?.id
  );
  return designerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
});
const topSellingDesigns = computed(() => designStore.getBestSellingDesigns);

// Action methods
const openAddDesignModal = () => {
  resetForm();
  isEditing.value = false;
  showAddEditModal.value = true;
};

const openEditDesignModal = (design) => {
  isEditing.value = true;
  currentDesign.value = design;
  designForm.status = design.status || "Live"; // Ensure status is set

  // Populate form with design data
  designForm.name = design.name;
  designForm.description = design.description;
  designForm.price = design.price;
  designForm.category = design.category;
  designForm.tags = design.tags || [];
  designForm.status = design.status;
  designForm.stockQuantity = design.stockQuantity || 0;
  designForm.images = design.images || [];

  showAddEditModal.value = true;
};

const resetForm = () => {
  designForm.name = "";
  designForm.description = "";
  designForm.price = "";
  designForm.category = "";
  designForm.tags = [];
  designForm.status = "Live";
  designForm.stockQuantity = 0;
  designForm.images = [];
  currentDesign.value = null;
};

const saveDesign = () => {
  // Validate form
  if (!designForm.name || !designForm.price || !designForm.category) {
    // Handle validation errors
    return;
  }

  const designData = {
    name: designForm.name,
    description: designForm.description,
    price: parseFloat(designForm.price),
    category: designForm.category,
    tags: designForm.tags,
    status: designForm.status,
    stockQuantity: parseInt(designForm.stockQuantity),
    images: designForm.images,
  };

  if (isEditing.value && currentDesign.value) {
    designStore.updateDesign(currentDesign.value.id, designData);
  } else {
    designStore.addDesign(designData);
  }

  showAddEditModal.value = false;
  resetForm();
};

const deleteDesign = (designId) => {
  if (confirm("Are you sure you want to delete this design?")) {
    designStore.deleteDesign(designId);
  }
};

const toggleStatus = (design) => {
  const newStatus = design.status === "Live" ? "Draft" : "Live";
  designStore.updateDesign(design.id, { status: newStatus });
};

// Function to get status class for badge
const getStatusClass = (status) => {
  switch (status) {
    case "Live":
      return "bg-green-500";
    case "Draft":
      return "bg-gray-500";
    case "Pending":
      return "bg-yellow-500";
    case "Out of Stock":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};

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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Category options
const categoryOptions = [
  { value: "formal", label: "Formal Wear" },
  { value: "casual", label: "Casual Wear" },
  { value: "streetwear", label: "Streetwear" },
  { value: "summer", label: "Summer Collection" },
  { value: "winter", label: "Winter Collection" },
  { value: "accessories", label: "Accessories" },
];

// Status options
const statusOptions = [
  { value: "Live", label: "Active" },
  { value: "Draft", label: "Draft" },
  { value: "Pending", label: "Pending Review" },
  { value: "Out of Stock", label: "Out of Stock" },
];

// Mock data for sales chart (would be replaced with actual data in production)
const salesChartData = [
  { month: "Jan", sales: 12 },
  { month: "Feb", sales: 19 },
  { month: "Mar", sales: 15 },
  { month: "Apr", sales: 22 },
  { month: "May", sales: 28 },
  { month: "Jun", sales: 24 },
];

const onFileSelected = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  // Limit to 5 images max
  const remainingSlots = 5 - designForm.images.length;
  const filesToProcess = Math.min(remainingSlots, files.length);

  for (let i = 0; i < filesToProcess; i++) {
    const file = files[i];
    if (!file.type.includes("image/")) continue;

    const reader = new FileReader();
    reader.onload = (e) => {
      designForm.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

// For preview modal
const showPreviewModal = ref(false);
const previewDesign = ref(null);
const selectedImageIndex = ref(0);

const openPreviewModal = (design) => {
  previewDesign.value = design;
  selectedImageIndex.value = 0;
  showPreviewModal.value = true;
};

// For delete modal
const showDeleteModal = ref(false);
const designToDelete = ref(null);

const openDeleteModal = (design) => {
  designToDelete.value = design;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (designToDelete.value) {
    designStore.deleteDesign(designToDelete.value.id);
    showDeleteModal.value = false;
    designToDelete.value = null;
  }
};

// For batch actions
const showImportModal = ref(false);
const selectedDesigns = ref([]);

const toggleSelectDesign = (design) => {
  const index = selectedDesigns.value.indexOf(design.id);
  if (index === -1) {
    selectedDesigns.value.push(design.id);
  } else {
    selectedDesigns.value.splice(index, 1);
  }
};

const selectAllDesigns = () => {
  if (selectedDesigns.value.length === filteredDesigns.value.length) {
    selectedDesigns.value = [];
  } else {
    selectedDesigns.value = filteredDesigns.value.map((design) => design.id);
  }
};

const batchAction = (action) => {
  if (selectedDesigns.value.length === 0) return;

  switch (action) {
    case "activate":
      selectedDesigns.value.forEach((id) => {
        designStore.updateDesign(id, { status: "Live" });
      });
      break;
    case "deactivate":
      selectedDesigns.value.forEach((id) => {
        designStore.updateDesign(id, { status: "Draft" });
      });
      break;
    case "delete":
      if (
        confirm(
          `Are you sure you want to delete ${selectedDesigns.value.length} designs?`
        )
      ) {
        selectedDesigns.value.forEach((id) => {
          designStore.deleteDesign(id);
        });
      }
      break;
  }

  selectedDesigns.value = [];
};

const exportDesigns = () => {
  // Implementation for exporting designs data to CSV
  alert("Export functionality would go here");
};

// Helper functions
const getCategoryLabel = (categoryValue) => {
  const category = categoryOptions.find((opt) => opt.value === categoryValue);
  return category ? category.label : categoryValue;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Main Content -->
      <div class="flex-1 p-6">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-purple-900">
              Design Management
            </h1>
            <p class="text-gray-600">
              Manage your fashion designs and marketplace listings
            </p>
          </div>

          <div class="flex gap-4">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search designs..."
                class="input input-bordered w-80 pr-10"
              />
              <button class="absolute right-3 top-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <div class="flex gap-2">
              <button class="btn bg-white border-gray-300 hover:bg-gray-100">
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
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <span>List</span>
              </button>
              <button class="btn bg-purple-900 text-white hover:bg-purple-800">
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span>Grid</span>
              </button>
            </div>

            <button
              @click="openAddDesignModal"
              class="btn bg-purple-900 text-white hover:bg-purple-800"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add New Design</span>
            </button>
          </div>
        </div>

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Total Designs</h3>
                <p class="text-3xl font-bold">{{ totalDesigns }}</p>
                <p class="flex items-center text-green-500 text-sm mt-1">
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
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  12% this month
                </p>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Active Designs</h3>
                <p class="text-3xl font-bold">{{ activeDesigns }}</p>
                <p class="flex items-center text-green-500 text-sm mt-1">
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
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  8% this week
                </p>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Pending Approval</h3>
                <p class="text-3xl font-bold">{{ pendingDesigns }}</p>
                <p class="flex items-center text-yellow-500 text-sm mt-1">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Awaiting review
                </p>
              </div>
              <div class="bg-yellow-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-yellow-500"
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
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-gray-500 text-sm">Total Earnings</h3>
                <p class="text-3xl font-bold">₵{{ totalRevenue.toFixed(2) }}</p>
                <p class="flex items-center text-green-500 text-sm mt-1">
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
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  8% this month
                </p>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Analytics Section -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Sales Analytics</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Sales Chart -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium">Sales Over Time</h3>
                <div class="flex gap-2">
                  <button
                    :class="[
                      'btn btn-xs',
                      chartPeriod === 'week'
                        ? 'bg-purple-900 text-white'
                        : 'bg-gray-200',
                    ]"
                    @click="chartPeriod = 'week'"
                  >
                    Week
                  </button>
                  <button
                    :class="[
                      'btn btn-xs',
                      chartPeriod === 'month'
                        ? 'bg-purple-900 text-white'
                        : 'bg-gray-200',
                    ]"
                    @click="chartPeriod = 'month'"
                  >
                    Month
                  </button>
                  <button
                    :class="[
                      'btn btn-xs',
                      chartPeriod === 'year'
                        ? 'bg-purple-900 text-white'
                        : 'bg-gray-200',
                    ]"
                    @click="chartPeriod = 'year'"
                  >
                    Year
                  </button>
                </div>
              </div>
              <div class="h-64 flex items-end justify-between">
                <div
                  v-for="(item, index) in salesChartData"
                  :key="index"
                  class="flex flex-col items-center"
                >
                  <div
                    class="w-12 bg-purple-600 rounded-t"
                    :style="{ height: item.sales * 2 + 'px' }"
                  ></div>
                  <span class="text-xs mt-1">{{ item.month }}</span>
                </div>
              </div>
            </div>

            <!-- Top Selling Products -->
            <div>
              <h3 class="font-medium mb-4">Top Selling Products</h3>
              <div class="space-y-3">
                <div
                  v-for="(product, index) in topSellingDesigns"
                  :key="product.id"
                  class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <span class="font-bold text-gray-500 w-6">{{
                    index + 1
                  }}</span>
                  <div class="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      :src="product.image || '/api/placeholder/48/48'"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium">{{ product.name }}</h4>
                    <p class="text-xs text-gray-500">{{ product.category }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">${{ product.price.toFixed(2) }}</p>
                    <p class="text-xs text-gray-500">
                      {{ product.orders }} orders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow p-4 mb-8">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Category</label>
              <select
                v-model="selectedCategory"
                class="select select-bordered w-full"
              >
                <option value="">All Categories</option>
                <option
                  v-for="option in categoryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Status</label>
              <select
                v-model="selectedStatus"
                class="select select-bordered w-full"
              >
                <option value="">All Statuses</option>
                <option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1">Sort By</label>
              <select v-model="sortBy" class="select select-bordered w-full">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="highest">Highest Price</option>
                <option value="lowest">Lowest Price</option>
              </select>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-500 block mb-1"
                >Price Range</label
              >
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  v-model="priceRange.min"
                  placeholder="Min"
                  class="input input-bordered w-full"
                />
                <span>-</span>
                <input
                  type="number"
                  v-model="priceRange.max"
                  placeholder="Max"
                  class="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Design Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="design in paginatedDesigns"
            :key="design.id"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <div class="relative">
              <img
                :src="design.image || '/api/placeholder/400/300'"
                :alt="design.name"
                class="w-full h-48 object-cover object-center"
              />
              <div
                :class="`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(
                  design.status
                )}`"
              >
                {{ design.status }}
              </div>
            </div>

            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium">{{ design.name }}</h3>
                <span class="font-semibold"
                  >₵{{ design.price.toFixed(2) }}</span
                >
              </div>

              <p class="text-gray-600 text-sm mb-2">{{ design.description }}</p>

              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  v-for="tag in design.tags"
                  :key="tag"
                  class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >{{ tag }}</span
                >
              </div>

              <div class="flex flex-wrap items-center text-sm mb-4">
                <span class="flex items-center text-gray-500 mr-4">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {{ design.views || 0 }} views
                </span>
                <span class="flex items-center text-gray-500 mr-4">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {{ design.orders || 0 }} orders
                </span>
                <span class="flex items-center text-gray-500">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  {{ design.stockQuantity || 0 }} in stock
                </span>
              </div>

              <div class="flex gap-2">
                <button
                  @click="openEditDesignModal(design)"
                  class="btn btn-sm flex-1 bg-purple-900 hover:bg-purple-800 text-white"
                >
                  Edit
                </button>
                <button
                  @click="toggleStatus(design)"
                  class="btn btn-sm flex-1"
                  :class="
                    design.status === 'Live'
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  "
                >
                  {{ design.status === "Live" ? "Deactivate" : "Activate" }}
                </button>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-sm btn-ghost">
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
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </label>
                  <ul
                    tabindex="0"
                    class="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a @click.prevent="handleDuplicate">Duplicate</a>
                    </li>
                    <li>
                      <a @click.prevent="handleShare">Share</a>
                    </li>
                    <li>
                      <a
                        @click.prevent="deleteDesign(design.id)"
                        class="text-red-600"
                        >Delete</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state if no designs -->
        <div
          v-if="filteredDesigns.length === 0"
          class="bg-white rounded-lg shadow p-8 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 class="text-lg font-medium mb-2">No designs found</h3>
          <p class="text-gray-500 mb-4">
            You don't have any designs matching your filters.
          </p>
          <button
            @click="openAddDesignModal"
            class="btn bg-purple-900 text-white hover:bg-purple-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
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
            Create New Design
          </button>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-8">
          <nav class="flex items-center space-x-2">
            <button class="btn btn-sm btn-ghost">
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
            <button class="btn btn-sm bg-purple-900 text-white">1</button>
            <button class="btn btn-sm btn-ghost">2</button>
            <button class="btn btn-sm btn-ghost">3</button>
            <span>...</span>
            <button class="btn btn-sm btn-ghost">10</button>
            <button class="btn btn-sm btn-ghost">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add/Edit Design Modal -->
    <div class="modal" :class="{ 'modal-open': showAddEditModal }">
      <div class="modal-box max-w-3xl">
        <h3 class="font-bold text-lg mb-4">
          {{ isEditing ? "Edit Design" : "Add New Design" }}
        </h3>

        <form @submit.prevent="saveDesign" class="space-y-4">
          <!-- Basic Info Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text">Design Name*</span>
              </label>
              <input
                type="text"
                v-model="designForm.name"
                placeholder="Enter design name"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label class="label">
                <span class="label-text">Price*</span>
              </label>
              <div class="input-group">
                <span>₵</span>
                <input
                  type="number"
                  v-model="designForm.price"
                  placeholder="0.00"
                  class="input input-bordered w-full"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label class="label">
                <span class="label-text">Category*</span>
              </label>
              <select
                v-model="designForm.category"
                class="select select-bordered w-full"
                required
              >
                <option value="" disabled selected>Select category</option>
                <option
                  v-for="option in categoryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select
                v-model="designForm.status"
                class="select select-bordered w-full"
              >
                <option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">
                <span class="label-text">Stock Quantity</span>
              </label>
              <input
                type="number"
                v-model="designForm.stockQuantity"
                placeholder="Enter stock quantity"
                class="input input-bordered w-full"
                min="0"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea
              v-model="designForm.description"
              placeholder="Enter design description"
              class="textarea textarea-bordered w-full h-24"
            ></textarea>
          </div>

          <!-- Tags Input -->
          <div>
            <label class="label">
              <span class="label-text">Tags</span>
            </label>
            <div class="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg mb-2">
              <div
                v-for="(tag, index) in designForm.tags"
                :key="index"
                class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <span>{{ tag }}</span>
                <button
                  type="button"
                  @click="designForm.tags.splice(index, 1)"
                  class="text-purple-800 hover:text-purple-900"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Add tag and press Enter"
                class="input input-sm border-none bg-transparent focus:outline-none flex-1 min-w-[150px]"
                @keydown.enter.prevent="
                  designForm.tags.push($event.target.value) &&
                    ($event.target.value = '')
                "
              />
            </div>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="label">
              <span class="label-text">Product Images</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div
                v-for="(image, index) in designForm.images"
                :key="index"
                class="relative h-24 bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  :src="image"
                  :alt="'Product image ' + (index + 1)"
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  @click="designForm.images.splice(index, 1)"
                  class="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Upload button -->
              <label
                class="flex flex-col items-center justify-center h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div
                  class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-400 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p class="text-xs text-gray-500">Upload image</p>
                </div>
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  multiple
                  @change="onFileSelected"
                />
              </label>
            </div>
            <p class="text-xs text-gray-500">
              Upload up to 5 images. First image will be used as the main
              product image.
            </p>
          </div>

          <!-- Advanced Settings (optional section) -->
          <div>
            <div class="collapse collapse-arrow border rounded-lg">
              <input type="checkbox" />
              <div class="collapse-title text-sm font-medium">
                Advanced Settings
              </div>
              <div class="collapse-content">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="label">
                      <span class="label-text">SKU</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter SKU"
                      class="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label class="label">
                      <span class="label-text">Discount (%)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      class="input input-bordered w-full"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label class="label">
                      <span class="label-text">Weight (kg)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      class="input input-bordered w-full"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label class="label">
                      <span class="label-text">Production Time (days)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      class="input input-bordered w-full"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showAddEditModal = false"
              class="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn bg-purple-900 text-white hover:bg-purple-800"
            >
              {{ isEditing ? "Update Design" : "Create Design" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Additional components to complete your design -->

    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'modal-open': showDeleteModal }">
      <div class="modal-box p-6">
        <h3 class="font-bold text-lg mb-4">Confirm Deletion</h3>
        <p>
          Are you sure you want to delete this design? This action cannot be
          undone.
        </p>
        <div class="modal-action">
          <button @click="showDeleteModal = false" class="btn btn-outline">
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="btn bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Batch Actions Dropdown -->
    <div class="dropdown dropdown-end fixed bottom-8 right-8 z-10">
      <label
        tabindex="0"
        class="btn bg-purple-900 text-white hover:bg-purple-800 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
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
        Actions
      </label>
      <ul
        tabindex="0"
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li><a @click.prevent="openAddDesignModal">Add New Design</a></li>
        <li>
          <a @click.prevent="batchAction('activate')">Activate Selected</a>
        </li>
        <li>
          <a @click.prevent="batchAction('deactivate')">Deactivate Selected</a>
        </li>
        <li>
          <a @click.prevent="batchAction('delete')" class="text-red-600"
            >Delete Selected</a
          >
        </li>
        <li><a @click.prevent="exportDesigns">Export Data</a></li>
      </ul>
    </div>

    <!-- Design Preview Modal -->
    <div class="modal" :class="{ 'modal-open': showPreviewModal }">
      <div class="modal-box max-w-4xl p-0">
        <button
          @click="showPreviewModal = false"
          class="btn btn-sm btn-circle absolute right-2 top-2 z-10 bg-white"
        >
          ✕
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Image Gallery -->
          <div class="bg-gray-100 p-4">
            <div class="h-64 md:h-96 mb-2 bg-white rounded-lg overflow-hidden">
              <img
                :src="
                  previewDesign?.images?.[selectedImageIndex] ||
                  '/api/placeholder/600/600'
                "
                :alt="previewDesign?.name"
                class="w-full h-full object-contain"
              />
            </div>

            <div class="grid grid-cols-5 gap-2">
              <div
                v-for="(image, index) in previewDesign?.images || []"
                :key="index"
                @click="selectedImageIndex = index"
                class="h-16 bg-white rounded-md overflow-hidden cursor-pointer"
                :class="{
                  'ring-2 ring-purple-600': selectedImageIndex === index,
                }"
              >
                <img
                  :src="image"
                  :alt="'Product thumbnail'"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-6">
            <div class="mb-4">
              <span
                :class="`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(
                  previewDesign?.status
                )}`"
              >
                {{ previewDesign?.status }}
              </span>
            </div>

            <h2 class="text-2xl font-bold mb-2">{{ previewDesign?.name }}</h2>
            <p class="text-xl text-purple-900 font-semibold mb-4">
              ${{ previewDesign?.price?.toFixed(2) }}
            </p>

            <div class="divider"></div>

            <p class="text-gray-600 mb-4">{{ previewDesign?.description }}</p>

            <div class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="tag in previewDesign?.tags"
                :key="tag"
                class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >{{ tag }}</span
              >
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500">Category</p>
                <p class="font-medium">
                  {{ getCategoryLabel(previewDesign?.category) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Stock</p>
                <p class="font-medium">
                  {{ previewDesign?.stockQuantity || 0 }} available
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Sales</p>
                <p class="font-medium">
                  {{ previewDesign?.orders || 0 }} orders
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Created On</p>
                <p class="font-medium">
                  {{ formatDate(previewDesign?.createdAt) }}
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="openEditDesignModal(previewDesign)"
                class="btn flex-1 bg-purple-900 text-white hover:bg-purple-800"
              >
                Edit
              </button>
              <button
                @click="showPreviewModal = false"
                class="btn flex-1 btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Import Modal -->
    <div class="modal" :class="{ 'modal-open': showImportModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Import Designs</h3>
        <p class="mb-4">Upload a CSV file with your designs data.</p>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 mx-auto text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p class="text-sm text-gray-500 mb-2">
            Drag and drop file here or click to upload
          </p>
          <p class="text-xs text-gray-400">Supported format: CSV</p>
          <input type="file" class="hidden" accept=".csv" />
          <button
            class="btn btn-sm bg-purple-900 text-white hover:bg-purple-800 mt-3"
          >
            Select File
          </button>
        </div>

        <div class="flex justify-between mt-6">
          <a href="#" class="text-purple-900 text-sm hover:underline"
            >Download template</a
          >
          <div>
            <button
              @click="showImportModal = false"
              class="btn btn-sm btn-outline mr-2"
            >
              Cancel
            </button>
            <button
              class="btn btn-sm bg-purple-900 text-white hover:bg-purple-800"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
