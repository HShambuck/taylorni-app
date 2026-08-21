import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useClientStore = defineStore("client", () => {
  // State
  const clients = ref([]);
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

  // Utility function to save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("clients", JSON.stringify(clients.value));
  };

  // Actions
 const fetchClients = async () => {
   isLoading.value = true;
   error.value = null;

   try {
     const storedClients = localStorage.getItem("clients");

     if (storedClients) {
       clients.value = JSON.parse(storedClients);
     } else if (import.meta.env.DEV) {
       // ONLY in local development, load from static JSON
       const response = await fetch("/database/clients.json");
       if (!response.ok) throw new Error("Failed to fetch clients");

       const data = await response.json();
       clients.value = data;
       saveToLocalStorage();
     } else {
       // In production (e.g. Vercel), initialize empty or fallback data
       clients.value = [];
       saveToLocalStorage();
     }
   } catch (err) {
     console.error("Error loading clients:", err);
     error.value = "Failed to load clients";
   } finally {
     isLoading.value = false;
   }
 };


  const addClient = (clientData) => {
    // Make sure clients are loaded
    if (clients.value.length === 0) {
      fetchClients();
    }

    const newId = clients.value.length
      ? Math.max(...clients.value.map((c) => c.id)) + 1
      : 1;

    const newClient = {
      id: newId,
      ...clientData,
      userType: "client",
      lastOrder: "None",
      totalOrders: 0,
      totalSpent: "GH₵0.00",
      status: "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clients.value.push(newClient);
    saveToLocalStorage();

    console.log("✅ Client added:", newClient);
    return newClient;
  };

  const updateClient = (clientId, updatedData) => {
    const index = clients.value.findIndex((c) => c.id === clientId);

    if (index !== -1) {
      clients.value[index] = {
        ...clients.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      saveToLocalStorage();
      return clients.value[index];
    }

    return null;
  };

  const deleteClient = (clientId) => {
    const index = clients.value.findIndex((c) => c.id === clientId);

    if (index !== -1) {
      clients.value.splice(index, 1);
      saveToLocalStorage();
      return true;
    }

    return false;
  };

  const getClientFullName = (clientId) => {
    const client = getClientById.value(clientId);
    return client ? `${client.firstName} ${client.lastName}` : "";
  };

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
