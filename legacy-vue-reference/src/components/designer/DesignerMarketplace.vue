<template>
  <!-- Main Content -->
  <main class="flex-1 p-4 md:p-6 bg-base-200">
    <div class="container mx-auto">
      <!-- Header with Search and User Profile -->
      <header class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl md:text-3xl font-bold text-purple-800">Designer Dashboard</h1>
        <div class="flex items-center gap-3">
          <div class="relative">
            <input type="text" placeholder="Search..." class="input input-bordered w-full max-w-xs" />
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div class="indicator">
            <span class="indicator-item badge badge-secondary">2</span>
            <button class="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white">
                <span>User</span>
              </div>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Welcome Banner -->
      <div class="card bg-base-100 shadow-md mb-6">
        <div class="card-body flex flex-col md:flex-row justify-between items-center md:items-start">
          <div>
            <h2 class="card-title text-xl md:text-2xl">Welcome back, Emily Parker!</h2>
            <p class="text-gray-600">Here's what's happening with your designs today.</p>
          </div>
          <div class="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
            <button class="btn bg-purple-800 hover:bg-purple-900 text-white border-none gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add New Design
            </button>
            <button class="btn btn-outline gap-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:border-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
              Manage Shop
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Orders -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4 flex flex-row justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Total Orders</h3>
              <p class="text-3xl font-bold">{{ stats.totalOrders }}</p>
              <div class="text-success text-sm flex items-center mt-1">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clip-rule="evenodd"></path>
                </svg>
                {{ stats.totalOrdersGrowth }} this month
              </div>
            </div>
            <div class="rounded-full bg-blue-100 p-3">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4 flex flex-row justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Pending Orders</h3>
              <p class="text-3xl font-bold">{{ stats.pendingOrders }}</p>
              <div class="text-error text-sm flex items-center mt-1">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clip-rule="evenodd"></path>
                </svg>
                {{ stats.pendingOrdersGrowth }} this week
              </div>
            </div>
            <div class="rounded-full bg-yellow-100 p-3">
              <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Completed Orders -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4 flex flex-row justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Completed Orders</h3>
              <p class="text-3xl font-bold">{{ stats.completedOrders }}</p>
              <div class="text-success text-sm flex items-center mt-1">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clip-rule="evenodd"></path>
                </svg>
                {{ stats.completedOrdersGrowth }} this month
              </div>
            </div>
            <div class="rounded-full bg-green-100 p-3">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Earnings -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4 flex flex-row justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Total Earnings</h3>
              <p class="text-3xl font-bold">{{ stats.totalEarnings }}</p>
              <div class="text-success text-sm flex items-center mt-1">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clip-rule="evenodd"></path>
                </svg>
                {{ stats.earningsGrowth }} this month
              </div>
            </div>
            <div class="rounded-full bg-purple-100 p-3">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table and Popular Designs -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Recent Orders -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Recent Orders</h2>
              <a href="#" class="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                View All
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <div class="overflow-x-auto">
              <table class="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in filteredOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.client }}</td>
                    <td>{{ order.date }}</td>
                    <td>
                      <div :class="`badge ${getStatusBadgeClass(order.status)}`">
                        {{ order.status }}
                      </div>
                    </td>
                    <td>{{ order.amount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Most Popular Designs -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Most Popular Designs</h2>
              <a href="#" class="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                View All
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <div class="space-y-4">
              <div v-for="design in popularDesigns" :key="design.name" class="flex items-center gap-4 p-2 hover:bg-base-200 rounded-lg">
                <div class="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                  {{ design.name }}
                </div>
                <div class="flex-1">
                  <h3 class="font-medium">{{ design.name }}</h3>
                  <p class="text-sm text-gray-500">{{ design.orders }} orders</p>
                </div>
                <div class="text-right">
                  <p class="font-bold">{{ design.price }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs for additional Marketplace features -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <div role="tablist" class="tabs tabs-bordered">
            <a 
              role="tab" 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'listings' }"
              @click="setActiveTab('listings')"
            >
              My Listings
            </a>
            <a 
              role="tab" 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'orders' }"
              @click="setActiveTab('orders')"
            >
              Orders & Clients
            </a>
            <a 
              role="tab" 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'analytics' }"
              @click="setActiveTab('analytics')"
            >
              Analytics
            </a>
            <a 
              role="tab" 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'payments' }"
              @click="setActiveTab('payments')"
            >
              Payments
            </a>
            <a 
              role="tab" 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'settings' }"
              @click="setActiveTab('settings')"
            >
              Settings
            </a>
          </div>
          
          <!-- My Listings Tab Content -->
          <div v-if="activeTab === 'listings'" class="py-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h3 class="text-lg font-medium">Active Listings ({{ filteredListings.length }})</h3>
              <div class="flex gap-2 mt-2 md:mt-0">
                <div class="join">
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': listingFilter === 'all' }"
                    @click="listingFilter = 'all'"
                  >
                    All
                  </button>
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': listingFilter === 'active' }"
                    @click="listingFilter = 'active'"
                  >
                    Active
                  </button>
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': listingFilter === 'draft' }"
                    @click="listingFilter = 'draft'"
                  >
                    Draft
                  </button>
                </div>
                <select v-model="sortOption" class="select select-sm select-bordered">
                  <option value="newest">Sort by: Newest</option>
                  <option value="popular">Sort by: Popular</option>
                  <option value="price">Sort by: Price</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="listing in filteredListings" :key="listing.id" class="card bg-base-100 border hover:shadow-md transition-shadow">
                <figure class="px-4 pt-4">
                  <div class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    {{ listing.name }}
                  </div>
                </figure>
                <div class="card-body p-4">
                  <h2 class="card-title text-base">{{ listing.name }}</h2>
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-bold">{{ listing.price }}</span>
                    <span class="badge badge-ghost">{{ listing.orders }} orders</span>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <button class="btn btn-sm btn-outline border-purple-800 text-purple-800 hover:bg-purple-800 hover:border-purple-800">Edit</button>
                    <button class="btn btn-sm btn-ghost">
                      {{ listing.status === 'active' ? 'Unpublish' : 'Publish' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-center mt-6">
              <div class="join">
                <button class="join-item btn">«</button>
                <button class="join-item btn btn-active bg-purple-800 border-purple-800 hover:bg-purple-900">1</button>
                <button class="join-item btn">2</button>
                <button class="join-item btn">3</button>
                <button class="join-item btn">»</button>
              </div>
            </div>
          </div>
          
          <!-- Orders & Clients Tab Content -->
          <div v-if="activeTab === 'orders'" class="py-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h3 class="text-lg font-medium">All Orders</h3>
              <div class="flex gap-2 mt-2 md:mt-0">
                <div class="join">
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': orderFilter === 'all' }"
                    @click="orderFilter = 'all'"
                  >
                    All
                  </button>
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': orderFilter === 'pending' }"
                    @click="orderFilter = 'pending'"
                  >
                    Pending
                  </button>
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': orderFilter === 'completed' }"
                    @click="orderFilter = 'completed'"
                  >
                    Completed
                  </button>
                  <button 
                    class="btn btn-sm join-item" 
                    :class="{ 'btn-active': orderFilter === 'canceled' }"
                    @click="orderFilter = 'canceled'"
                  >
                    Canceled
                  </button>
                </div>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Client</th>
                    <th>Design</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in filteredOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.client }}</td>
                    <td>{{ order.design || 'Custom Design' }}</td>
                    <td>{{ order.date }}</td>
                    <td>
                      <div :class="`badge ${getStatusBadgeClass(order.status)}`">
                        {{ order.status }}
                      </div>
                    </td>
                    <td>{{ order.amount }}</td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-xs btn-ghost">View</button>
                        <button class="btn btn-xs btn-ghost">Message</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="flex justify-between items-center mt-6">
              <p class="text-sm text-gray-500">Showing 1-10 of {{ filteredOrders.length }} orders</p>
              <div class="join">
                <button class="join-item btn btn-sm">«</button>
                <button class="join-item btn btn-sm btn-active bg-purple-800 border-purple-800 hover:bg-purple-900">1</button>
                <button class="join-item btn btn-sm">2</button>
                <button class="join-item btn btn-sm">3</button>
                <button class="join-item btn btn-sm">»</button>
              </div>
            </div>
          </div>
          
          <!-- Analytics Tab Content -->
          <div v-if="activeTab === 'analytics'" class="py-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h3 class="text-lg font-medium">Performance Analytics</h3>
              <select class="select select-bordered select-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>All time</option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body">
                  <h3 class="card-title text-base">Sales Trend</h3>
                  <div class="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p class="text-gray-500">Sales chart visualization would appear here</p>
                  </div>
                </div>
              </div>
              
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body">
                  <h3 class="card-title text-base">Design Popularity</h3>
                  <div class="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p class="text-gray-500">Popularity chart visualization would appear here</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6">
              <h3 class="text-lg font-medium mb-4">Top Performing Designs</h3>
              <div class="overflow-x-auto">
                <table class="table w-full">
                  <thead>
                    <tr>
                      <th>Design</th>
                      <th>Views</th>
                      <th>Orders</th>
                      <th>Conversion Rate</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(design, index) in topDesigns" :key="index">
                      <td>{{ design.name }}</td>
                      <td>{{ design.views }}</td>
                      <td>{{ design.orders }}</td>
                      <td>{{ design.conversionRate }}</td>
                      <td>{{ design.revenue }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <!-- Payments Tab Content -->
          <div v-if="activeTab === 'payments'" class="py-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 class="text-lg font-medium">Payment Summary</h3>
                <p class="text-sm text-gray-500">Current balance: $3,254.87</p>
              </div>
              <button class="btn btn-sm bg-purple-800 text-white hover:bg-purple-900 border-none">
                Withdraw Funds
              </button>
            </div>
            
            <div class="card bg-base-100 shadow-sm mb-6">
              <div class="card-body">
                <h3 class="card-title text-base">Earnings Overview</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div class="stat">
                    <div class="stat-title">This Month</div>
                    <div class="stat-value text-2xl">$1,254.32</div>
                    <div class="stat-desc text-success">↗︎ 8% more than last month</div>
                  </div>
                  <div class="stat">
                    <div class="stat-title">Pending</div>
                    <div class="stat-value text-2xl">$854.65</div>
                    <div class="stat-desc">Processing payments</div>
                  </div>
                  <div class="stat">
                    <div class="stat-title">Available</div>
                    <div class="stat-value text-2xl">$2,400.22</div>
                    <div class="stat-desc">Ready to withdraw</div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 class="text-lg font-medium mb-4">Recent Transactions</h3>
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transaction in transactions" :key="transaction.id">
                    <td>{{ transaction.date }}</td>
                    <td>{{ transaction.id }}</td>
                    <td>{{ transaction.type }}</td>
                    <td :class="transaction.type === 'Sale' ? 'text-success' : 'text-error'">
                      {{ transaction.type === 'Sale' ? '+' : '-' }}{{ transaction.amount }}
                    </td>
                    <td>
                      <div :class="`badge ${getTransactionBadgeClass(transaction.status)}`">
                        {{ transaction.status }} 
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Settings Tab Content -->
          <div v-if="activeTab === 'settings'" class="py-4">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Left column - Designer Profile -->
              <div class="w-full md:w-1/3">
                <div class="card bg-base-100 shadow-sm">
                  <div class="card-body">
                    <h3 class="card-title text-base">Designer Profile</h3>
                    <div class="flex flex-col items-center mt-4">
                      <div class="avatar">
                        <div class="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white text-xl">
                          EP
                        </div>
                      </div>
                      <button class="btn btn-sm mt-2 btn-outline border-purple-800 text-purple-800 hover:bg-purple-800 hover:border-purple-800">
                        Change Photo
                      </button>
                      
                      <div class="w-full mt-6 space-y-3">
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Designer Name</span>
                          </label>
                          <input type="text" v-model="designerName" class="input input-bordered" />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Brand Name</span>
                          </label>
                          <input type="text" v-model="brandName" class="input input-bordered" />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Email</span>
                          </label>
                          <input type="email" v-model="email" class="input input-bordered" />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Phone</span>
                          </label>
                          <input type="tel" v-model="phone" class="input input-bordered" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right column - Various settings -->
              <div class="w-full md:w-2/3">
                                <div class="card bg-base-100 shadow-sm mb-6">
                  <div class="card-body">
                    <h3 class="card-title text-base">Store Information</h3>
                    <div class="space-y-3 mt-2">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Store Description</span>
                        </label>
                        <textarea v-model="storeDescription" class="textarea textarea-bordered h-24"></textarea>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Location</span>
                          </label>
                          <input type="text" v-model="location" class="input input-bordered" />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Website</span>
                          </label>
                          <input type="url" v-model="website" class="input input-bordered" />
                        </div>
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Specialties (comma separated)</span>
                        </label>
                        <input type="text" v-model="specialties" class="input input-bordered" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="card bg-base-100 shadow-sm mb-6">
                  <div class="card-body">
                    <h3 class="card-title text-base">Notification Preferences</h3>
                    <div class="space-y-4 mt-2">
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-4">
                          <input type="checkbox" v-model="emailNotifications.newOrders" class="toggle toggle-primary toggle-sm" />
                          <span class="label-text">Email notifications for new orders</span>
                        </label>
                      </div>
                      
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-4">
                          <input type="checkbox" v-model="emailNotifications.newMessages" class="toggle toggle-primary toggle-sm" />
                          <span class="label-text">Email notifications for new messages</span>
                        </label>
                      </div>
                      
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-4">
                          <input type="checkbox" v-model="smsNotifications.urgentUpdates" class="toggle toggle-primary toggle-sm" />
                          <span class="label-text">SMS notifications for urgent order updates</span>
                        </label>
                      </div>
                      
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-4">
                          <input type="checkbox" v-model="emailNotifications.weeklySummary" class="toggle toggle-primary toggle-sm" />
                          <span class="label-text">Weekly sales summary emails</span>
                        </label>
                      </div>
                      
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-4">
                          <input type="checkbox" v-model="emailNotifications.promotionalEmails" class="toggle toggle-primary toggle-sm" />
                          <span class="label-text">Promotional and marketing emails</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="card bg-base-100 shadow-sm">
                  <div class="card-body">
                    <h3 class="card-title text-base">Security Settings</h3>
                    <div class="space-y-3 mt-2">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Change Password</span>
                        </label>
                        <div class="flex flex-col space-y-2">
                          <input type="password" placeholder="Current Password" class="input input-bordered" />
                          <input type="password" placeholder="New Password" class="input input-bordered" />
                          <input type="password" placeholder="Confirm New Password" class="input input-bordered" />
                        </div>
                      </div>
                      
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-4">
                          <input type="checkbox" v-model="twoFactorAuth" class="toggle toggle-primary toggle-sm" />
                          <span class="label-text">Enable two-factor authentication</span>
                        </label>
                      </div>
                      
                      <div class="form-control mt-4">
                        <button class="btn bg-purple-800 hover:bg-purple-900 text-white border-none">Save Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';

// Reactive state
const activeTab = ref('listings');
const listingFilter = ref('all');
const orderFilter = ref('all');
const sortOption = ref('newest');

// Sample data
const stats = ref({
  totalOrders: 248,
  totalOrdersGrowth: '+12.5%',
  pendingOrders: 18,
  pendingOrdersGrowth: '+5.2%',
  completedOrders: 230,
  completedOrdersGrowth: '+15.3%',
  totalEarnings: '$12,845.65',
  earningsGrowth: '+8.1%'
});

const orders = ref([
  { id: 'ORD-9385', client: 'John Smith', date: 'Mar 15, 2025', status: 'completed', amount: '$125.00' },
  { id: 'ORD-9384', client: 'Sarah Jones', date: 'Mar 14, 2025', status: 'pending', amount: '$78.50' },
  { id: 'ORD-9383', client: 'Michael Brown', date: 'Mar 12, 2025', status: 'processing', amount: '$245.99' },
  { id: 'ORD-9382', client: 'Linda Davis', date: 'Mar 10, 2025', status: 'completed', amount: '$189.00' },
  { id: 'ORD-9381', client: 'Robert Wilson', date: 'Mar 08, 2025', status: 'canceled', amount: '$56.75' }
]);

const popularDesigns = ref([
  { name: 'Minimalist Dress', orders: 48, price: '$89.99' },
  { name: 'Urban Jacket', orders: 36, price: '$149.99' },
  { name: 'Summer Collection', orders: 29, price: '$79.99' },
  { name: 'Casual Pants', orders: 27, price: '$65.99' }
]);

const activeListings = ref([
  { id: 1, name: 'Minimalist Dress', price: '$89.99', orders: 48, status: 'active' },
  { id: 2, name: 'Urban Jacket', price: '$149.99', orders: 36, status: 'active' },
  { id: 3, name: 'Summer Collection', price: '$79.99', orders: 29, status: 'active' },
  { id: 4, name: 'Casual Pants', price: '$65.99', orders: 27, status: 'active' },
  { id: 5, name: 'Evening Gown', price: '$199.99', orders: 12, status: 'active' },
  { id: 6, name: 'Winter Coat', price: '$179.99', orders: 0, status: 'draft' }
]);

const transactions = ref([
  { date: 'Mar 15, 2025', id: 'TRX-38291', type: 'Sale', amount: '$125.00', status: 'completed' },
  { date: 'Mar 14, 2025', id: 'TRX-38290', type: 'Sale', amount: '$78.50', status: 'pending' },
  { date: 'Mar 12, 2025', id: 'TRX-38289', type: 'Sale', amount: '$245.99', status: 'completed' },
  { date: 'Mar 10, 2025', id: 'TRX-38288', type: 'Withdrawal', amount: '$500.00', status: 'completed' },
  { date: 'Mar 08, 2025', id: 'TRX-38287', type: 'Sale', amount: '$189.00', status: 'completed' }
]);

const topDesigns = ref([
  { name: 'Minimalist Dress', views: 1245, orders: 48, conversionRate: '3.85%', revenue: '$4,319.52' },
  { name: 'Urban Jacket', views: 987, orders: 36, conversionRate: '3.65%', revenue: '$5,399.64' },
  { name: 'Summer Collection', views: 1542, orders: 29, conversionRate: '1.88%', revenue: '$2,319.71' },
  { name: 'Casual Pants', views: 876, orders: 27, conversionRate: '3.08%', revenue: '$1,781.73' },
  { name: 'Evening Gown', views: 654, orders: 12, conversionRate: '1.83%', revenue: '$2,399.88' }
]);

// Additional state for settings
const designerName = ref('Emily Parker');
const brandName = ref("Emily's Designs");
const email = ref('emily.parker@email.com');
const phone = ref('(555) 123-4567');
const storeDescription = ref('Fashion designer specializing in modern and minimalist clothing designs with a focus on sustainable materials and ethical production.');
const location = ref('New York, NY');
const website = ref('https://emilysdesigns.com');
const specialties = ref('Modern Fashion, Sustainable Clothing, Minimalist Design');
const emailNotifications = ref({
  newOrders: true,
  newMessages: true,
  weeklySummary: true,
  promotionalEmails: true
});
const smsNotifications = ref({
  urgentUpdates: true
});
const twoFactorAuth = ref(false);

// Computed properties
const filteredListings = computed(() => {
  if (listingFilter.value === 'all') {
    return activeListings.value;
  }
  return activeListings.value.filter(listing => listing.status === listingFilter.value);
});

const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') {
    return orders.value;
  }
  return orders.value.filter(order => order.status === orderFilter.value);
});

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'pending':
    case 'processing':
      return 'badge-warning';
    case 'canceled':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
};

const getTransactionBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'failed':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
};
</script>