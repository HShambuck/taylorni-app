import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Merge client data from both sources
const defaultClients = [
  {
    id: 1,
    firstName: "Oscar",
    lastName: "Essuon",
    email: "oscar@gmail.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Accra, Ghana",
    lastOrder: "Mar 10, 2025",
    totalOrders: 3,
    totalSpent: "$580.00",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Brightmore",
    lastName: "Quansah",
    email: "more@gmail.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Kumasi, Ghana",
    lastOrder: "Mar 5, 2025",
    totalOrders: 2,
    totalSpent: "$420.00",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Alex",
    lastName: "Apedo",
    email: "alex@gmail.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Tema, Ghana",
    lastOrder: "Feb 28, 2025",
    totalOrders: 5,
    totalSpent: "$950.00",
    status: "Active",
  },
  {
    id: 4,
    firstName: "Gifty",
    lastName: "Adankai",
    email: "gifty@gmail.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Takoradi, Ghana",
    lastOrder: "Mar 15, 2025",
    totalOrders: 1,
    totalSpent: "$150.00",
    status: "New",
  },
  {
    id: 5,
    firstName: "Nancy",
    lastName: "Love",
    email: "nlat@gmail.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Cape Coast, Ghana",
    lastOrder: "Mar 12, 2025",
    totalOrders: 4,
    totalSpent: "$720.00",
    status: "Active",
  },
  // Adding clients from the client store (with slight modifications to match schema)
  {
    id: 6,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "New York, USA",
    lastOrder: "Mar 15, 2025",
    totalOrders: 8,
    totalSpent: "$1,200.00",
    status: "Active",
  },
  {
    id: 7,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Los Angeles, USA",
    lastOrder: "Mar 14, 2025",
    totalOrders: 12,
    totalSpent: "$2,450.00",
    status: "Active",
  },
  {
    id: 8,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.j@example.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "London, UK",
    lastOrder: "Mar 13, 2025",
    totalOrders: 3,
    totalSpent: "$650.00",
    status: "New",
  },
  {
    id: 9,
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert.w@example.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Chicago, USA",
    lastOrder: "Mar 10, 2025",
    totalOrders: 6,
    totalSpent: "$980.00",
    status: "Active",
  },
  {
    id: 10,
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.d@example.com",
    password: "123456",
    userType: "client",
    acceptTerms: true,
    location: "Toronto, Canada",
    lastOrder: "Mar 5, 2025",
    totalOrders: 2,
    totalSpent: "$350.00",
    status: "New",
  },
];

export const useClientStore = defineStore("client", () => {
  // State
  const clients = ref(defaultClients);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getAllClients = computed(() => clients.value);

  const getClientById = computed(() => {
    return (clientId) =>
      clients.value.find((client) => client.id === clientId) || null;
  });

  const getClientByEmail = computed(() => {
    return (email) =>
      clients.value.find((client) => client.email === email) || null;
  });

  const getActiveClients = computed(() => {
    return clients.value.filter((client) => client.status === "Active");
  });

  const getNewClients = computed(() => {
    return clients.value.filter((client) => client.status === "New");
  });

  // Actions
  const fetchClients = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // In a real app, you would fetch clients from an API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // clients.value = await api.getClients();
    } catch (err) {
      console.error("Error fetching clients:", err);
      error.value = "Failed to load clients";
    } finally {
      isLoading.value = false;
    }
  };

  const addClient = (clientData) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = Math.max(...clients.value.map((c) => c.id)) + 1;

    const newClient = {
      id: newId,
      ...clientData,
      userType: "client",
      totalOrders: 0,
      totalSpent: "$0.00",
      status: "New",
    };

    clients.value.push(newClient);
    return newClient;
  };

  const updateClient = (clientId, updatedData) => {
    const index = clients.value.findIndex((c) => c.id === clientId);

    if (index !== -1) {
      // Merge the existing client with updated data
      clients.value[index] = {
        ...clients.value[index],
        ...updatedData,
      };
      return clients.value[index];
    }

    return null;
  };

  const deleteClient = (clientId) => {
    const index = clients.value.findIndex((c) => c.id === clientId);

    if (index !== -1) {
      clients.value.splice(index, 1);
      return true;
    }

    return false;
  };

  const getClientFullName = (clientId) => {
    const client = getClientById.value(clientId);
    if (client) {
      return `${client.firstName} ${client.lastName}`;
    }
    return "";
  };

  // Helper methods for integration with other stores
  const getClientsForAuth = () => {
    return clients.value.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      password: client.password,
      userType: "client",
      acceptTerms: client.acceptTerms || true,
    }));
  };

  // Return all functions and state
  return {
    // State
    clients,
    isLoading,
    error,

    // Getters
    getAllClients,
    getClientById,
    getClientByEmail,
    getActiveClients,
    getNewClients,

    // Actions
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    getClientFullName,
    getClientsForAuth,
  };
});
