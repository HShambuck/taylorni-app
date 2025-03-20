<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clients, findClientById } from '@/stores/clientStore';

const route = useRoute();
const router = useRouter();

// Client details state
const client = ref({
  id: 0,
  name: '',
  email: '',
  phone: '+1 (555) 123-4567',
  location: '',
  joinedDate: 'Jan 15, 2025',
  totalOrders: 0,
  totalSpent: '$0.00',
  preferredPayment: 'Credit Card',
  status: '',
  avatarUrl: '/api/placeholder/80/80'
});

function fetchClientData(id) {
  const clientData = findClientById(id);
  
  if (clientData) {
    client.value = {
      ...clientData,
      phone: '+1 (555) 123-4567',
      joinedDate: 'Jan 15, 2025',
      preferredPayment: 'Credit Card',
      avatarUrl: '/api/placeholder/80/80'
    };
  } else {
    // Handle client not found
    console.error('Client not found');
    router.push('/clients');
  }
}


// Messages state
const messages = ref([
  {
    id: 1,
    sender: 'client',
    message: 'Hi, I was wondering if my order will be ready by next week?',
    timestamp: 'Mar 15, 2025 10:23 AM'
  },
  {
    id: 2,
    sender: 'designer',
    message: 'Yes, your order is on track to be completed by Wednesday!',
    timestamp: 'Mar 15, 2025 11:05 AM'
  },
  {
    id: 3,
    sender: 'client',
    message: 'Great! Also, could you use a slightly darker shade of blue than in the sketch?',
    timestamp: 'Mar 15, 2025 11:10 AM'
  },
  {
    id: 4,
    sender: 'designer',
    message: `Absolutely, I can adjust that. I'll use the navy blue we discussed previously.`,
    timestamp: 'Mar 15, 2025 11:45 AM'
  }
]);

const newMessage = ref('');

// Orders state
const orders = ref([
  {
    id: '#1234',
    date: 'Mar 15, 2025',
    status: 'Pending',
    amount: '$50.00',
    items: 'Elegant Evening Gown',
    preview: '/api/placeholder/60/40'
  },
  {
    id: '#1165',
    date: 'Feb 28, 2025',
    status: 'Completed',
    amount: '$120.00',
    items: 'Business Suit (Custom)',
    preview: '/api/placeholder/60/40'
  },
  {
    id: '#1089',
    date: 'Jan 15, 2025',
    status: 'Completed',
    amount: '$85.00',
    items: 'Casual Summer Dress',
    preview: '/api/placeholder/60/40'
  },
  {
    id: '#1042',
    date: 'Dec 10, 2024',
    status: 'Completed',
    amount: '$65.00',
    items: 'Winter Jacket',
    preview: '/api/placeholder/60/40'
  }
]);

// Client preferences state
const preferences = ref({
  favoriteColors: ['Navy Blue', 'Emerald Green', 'Black'],
  favoriteStyles: ['Business Casual', 'Evening Wear'],
  fabricPreferences: ['Silk', 'Cotton', 'Linen'],
  measurements: {
    bust: '36 inches',
    waist: '28 inches',
    hips: '38 inches',
    shoulder: '16 inches',
    inseam: '32 inches',
    height: '5\'7"'
  },
  fittingNotes: 'Prefers slightly looser fit around the waist. Typically needs adjustments on sleeve length (shorter than standard).'
});

// Analytics state
const analytics = ref({
  orderFrequency: 'Monthly',
  avgOrderValue: '$80.00',
  preferredCategories: [
    { name: 'Evening Wear', percentage: 45 },
    { name: 'Business Attire', percentage: 30 },
    { name: 'Casual Wear', percentage: 25 }
  ],
  orderHistory: [
    { month: 'Jan', orders: 1 },
    { month: 'Feb', orders: 1 },
    { month: 'Mar', orders: 2 }
  ]
});

// Client notes state
const clientNotes = ref([
  {
    id: 1,
    date: 'Mar 14, 2025',
    note: 'Client mentioned upcoming anniversary in April - potential for special order'  
  },
  {
    id: 2,
    date: 'Feb 25, 2025',
    note: 'Discussed launching a small business collection together in Summer 2025'
  }
]);

const newNote = ref('');

// Active tab state
const activeTab = ref('profile');

onMounted(() => {
  const clientId = route.params.id;
  fetchClientData(clientId);
});

// Methods
function sendMessage() {
  if (!newMessage.value.trim()) return;
  
  messages.value.push({
    id: messages.value.length + 1,
    sender: 'designer',
    message: newMessage.value,
    timestamp: new Date().toLocaleString()
  });
  
  newMessage.value = '';
}

function addNote() {
  if (!newNote.value.trim()) return;
  
  clientNotes.value.push({
    id: clientNotes.value.length + 1,
    date: new Date().toLocaleDateString(),
    note: newNote.value
  });
  
  newNote.value = '';
}

function getStatusClass(status) {
  switch (status) {
    case 'Completed':
      return 'badge-success';
    case 'Pending':
      return 'badge-warning';
    case 'Canceled':
      return 'badge-error';
    default:
      return 'badge-info';
  }
}

function goBack() {
  router.push('/clients');
}

function viewOrderDetails(orderId) {
  console.log(`View order details: ${orderId}`);
  // Navigate to order details in a real app
}

function messageClient() {
  activeTab.value = 'messages';
  // Focus on message input
  setTimeout(() => {
    document.getElementById('messageInput')?.focus();
  }, 100);
}

function addClientNote() {
  // Focus on note input
  setTimeout(() => {
    document.getElementById('noteInput')?.focus();
  }, 100);
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Back Button and Header -->
    <div class="p-6 bg-white shadow-sm">
      <div class="flex items-center mb-4">
        <button class="btn btn-sm btn-ghost mr-2" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Clients
        </button>
      </div>
      <h1 class="text-2xl font-bold text-gray-800">Client Details</h1>
      <p class="text-gray-600">View and manage individual client information</p>
    </div>
    
    <!-- Client Profile Section -->
    <div class="p-6">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row">
          <!-- Avatar and Basic Info -->
          <div class="flex items-center mb-6 md:mb-0 md:mr-10">
            <div class="avatar">
              <div class="w-20 h-20 rounded-full">
                <img :src="client.avatarUrl" alt="Client avatar" />
              </div>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-bold">{{ client.name }}</h2>
              <div class="badge mt-1" :class="getStatusClass(client.status)">{{ client.status }}</div>
              <p class="text-gray-600 mt-1">{{ client.location }}</p>
            </div>
          </div>
          
          <!-- Client Stats -->
          <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{{ client.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">{{ client.phone }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Joined</p>
              <p class="font-medium">{{ client.joinedDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Orders</p>
              <p class="font-medium">{{ client.totalOrders }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Spent</p>
              <p class="font-medium">{{ client.totalSpent }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Payment Method</p>
              <p class="font-medium">{{ client.preferredPayment }}</p>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex flex-col sm:flex-row md:flex-col justify-start gap-2 mt-6 md:mt-0">
            <button class="btn bg-purple-900 hover:bg-purple-800 text-white" @click="messageClient">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message
            </button>
            <button class="btn btn-outline" @click="addClientNote">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs Section -->
    <div class="p-6 pt-0">
      <div class="tabs tabs-boxed bg-white p-2 rounded-lg">
        <a 
          class="tab" 
          :class="{ 'tab-active bg-purple-900 text-white': activeTab === 'profile' }"
          @click="activeTab = 'profile'"
        >
          Profile & Orders
        </a>
        <a 
          class="tab" 
          :class="{ 'tab-active bg-purple-900 text-white': activeTab === 'messages' }"
          @click="activeTab = 'messages'"
        >
          Messages
        </a>
        <a 
          class="tab" 
          :class="{ 'tab-active bg-purple-900 text-white': activeTab === 'preferences' }"
          @click="activeTab = 'preferences'"
        >
          Preferences
        </a>
        <a 
          class="tab" 
          :class="{ 'tab-active bg-purple-900 text-white': activeTab === 'analytics' }"
          @click="activeTab = 'analytics'"
        >
          Analytics
        </a>
      </div>
    </div>
    
    <!-- Tab Content -->
    <div class="p-6 pt-0">
      <!-- Profile & Orders Tab -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <!-- Client Notes Section -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Client Notes</h3>
          
          <div class="flex mb-4">
            <input
              id="noteInput"
              type="text"
              v-model="newNote"
              placeholder="Add a note about this client..."
              class="input input-bordered flex-grow mr-2"
              @keyup.enter="addNote"
            />
            <button class="btn bg-purple-900 hover:bg-purple-800 text-white" @click="addNote">Add Note</button>
          </div>
          
          <div class="overflow-y-auto max-h-48 space-y-2">
            <div v-for="note in clientNotes" :key="note.id" class="p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between">
                <span class="text-sm font-medium">{{ note.date }}</span>
                <button class="btn btn-ghost btn-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="mt-1">{{ note.note }}</p>
            </div>
            <div v-if="clientNotes.length === 0" class="text-gray-500 text-center p-4">
              No notes yet. Add one above.
            </div>
          </div>
        </div>
        
        <!-- Order History Section -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6 pb-3 border-b">
            <h3 class="text-lg font-semibold">Order History</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th class="bg-gray-50">Order ID</th>
                  <th class="bg-gray-50">Items</th>
                  <th class="bg-gray-50">Date</th>
                  <th class="bg-gray-50">Amount</th>
                  <th class="bg-gray-50">Status</th>
                  <th class="bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                  <td>{{ order.id }}</td>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="w-12 h-8">
                          <img :src="order.preview" alt="Order preview" />
                        </div>
                      </div>
                      <div>
                        {{ order.items }}
                      </div>
                    </div>
                  </td>
                  <td>{{ order.date }}</td>
                  <td>{{ order.amount }}</td>
                  <td>
                    <div :class="`badge ${getStatusClass(order.status)}`">{{ order.status }}</div>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-ghost" @click="viewOrderDetails(order.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Messages Tab -->
      <div v-if="activeTab === 'messages'" class="bg-white rounded-lg shadow-sm">
        <div class="p-6 pb-3 border-b">
          <h3 class="text-lg font-semibold">Messages</h3>
        </div>
        
        <div class="p-6">
          <div class="chat-container h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            <div v-for="msg in messages" :key="msg.id" class="mb-4">
              <div :class="`chat ${msg.sender === 'designer' ? 'chat-end' : 'chat-start'}`">
                <div :class="`chat-bubble ${msg.sender === 'designer' ? 'bg-purple-900 text-white' : 'bg-gray-200'}`">
                  {{ msg.message }}
                </div>
                <div class="chat-footer opacity-50 text-xs mt-1">
                  {{ msg.timestamp }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex">
            <input
              id="messageInput"
              type="text"
              v-model="newMessage"
              placeholder="Type a message..."
              class="input input-bordered flex-grow mr-2"
              @keyup.enter="sendMessage"
            />
            <button class="btn bg-purple-900 hover:bg-purple-800 text-white" @click="sendMessage">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          <div class="flex flex-wrap gap-2 mt-4">
            <button class="btn btn-sm btn-outline">Thanks for your order!</button>
            <button class="btn btn-sm btn-outline">Your order is ready!</button>
            <button class="btn btn-sm btn-outline">Need more information</button>
            <button class="btn btn-sm btn-outline">Schedule a fitting</button>
          </div>
        </div>
      </div>
      
      <!-- Preferences Tab -->
      <div v-if="activeTab === 'preferences'" class="space-y-6">
        <!-- Style Preferences -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Style Preferences</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Favorite Colors</h4>
              <div class="flex flex-wrap gap-2">
                <div v-for="color in preferences.favoriteColors" :key="color" class="badge badge-outline">
                  {{ color }}
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Favorite Styles</h4>
              <div class="flex flex-wrap gap-2">
                <div v-for="style in preferences.favoriteStyles" :key="style" class="badge badge-outline">
                  {{ style }}
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Fabric Preferences</h4>
              <div class="flex flex-wrap gap-2">
                <div v-for="fabric in preferences.fabricPreferences" :key="fabric" class="badge badge-outline">
                  {{ fabric }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Measurements -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Measurements & Fitting</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div v-for="(value, key) in preferences.measurements" :key="key" class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 capitalize">{{ key }}</p>
              <p class="font-medium">{{ value }}</p>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-700 mb-2">Fitting Notes</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p>{{ preferences.fittingNotes }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <!-- Basic Analytics -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Client Insights</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">Order Frequency</p>
              <p class="text-xl font-bold">{{ analytics.orderFrequency }}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">Average Order Value</p>
              <p class="text-xl font-bold">{{ analytics.avgOrderValue }}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">Total Lifetime Value</p>
              <p class="text-xl font-bold">{{ client.totalSpent }}</p>
            </div>
          </div>
        </div>
        
        <!-- Preferred Categories -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Preferred Categories</h3>
          
          <div v-for="category in analytics.preferredCategories" :key="category.name" class="mb-3">
            <div class="flex justify-between mb-1">
              <span class="font-medium">{{ category.name }}</span>
              <span>{{ category.percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-purple-900 h-2 rounded-full" 
                :style="`width: ${category.percentage}%`"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Order History Chart -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Order History</h3>
          
          <div class="flex justify-around h-40">
            <div v-for="month in analytics.orderHistory" :key="month.name" class="flex flex-col items-center justify-end">
              <div 
                class="w-12 bg-purple-900 rounded-t-lg" 
                :style="`height: ${month.orders * 30}px`"
              ></div>
              <p class="mt-2">{{ month.month }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>