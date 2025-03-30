import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useOrdersStore = defineStore("orders", () => {
  // State
  const orders = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getAllOrders = computed(() => orders.value);

  const getOrderById = computed(() => {
    return (orderId) =>
      orders.value.find(
        (order) => order.id.toString() === orderId.toString()
      ) || null;
  });

  const getOrdersByStatus = computed(() => {
    return (status) => orders.value.filter((order) => order.status === status);
  });

  // Helper function to dynamically import stores
  const getStoreInstance = (storeName) => {
    switch (storeName) {
      case "user":
        return import("./auth").then((module) => module.useUserStore());
      case "client":
        return import("./clientStore").then((module) =>
          module.useClientStore()
        );
      case "designer":
        return import("./designerStore").then((module) =>
          module.useDesignerStore()
        );
      case "product":
        return import("./productStore").then((module) =>
          module.useProductStore()
        );
      case "measurement":
        return import("./measurementsStore").then((module) =>
          module.useMeasurementsStore()
        );
      default:
        throw new Error(`Unknown store: ${storeName}`);
    }
  };

  // Dynamically get user store on demand
  const getUserStore = async () => {
    return await getStoreInstance("user");
  };

  // Get orders for current logged-in user based on user type
  const getCurrentUserOrders = computed(() => {
    // This getter needs to be used within an async context
    return async () => {
      const userStore = await getUserStore();
      if (!userStore.isAuthenticated) return [];

      if (userStore.isClient) {
        return orders.value.filter(
          (order) => order.clientId === userStore.userInfo.id
        );
      } else if (userStore.isDesigner) {
        return orders.value.filter(
          (order) => order.designerId === userStore.userInfo.id
        );
      }
      return [];
    };
  });

  // Get orders by client ID
  const getOrdersByClientId = computed(() => {
    return (clientId) =>
      orders.value.filter(
        (order) => order.clientId.toString() === clientId.toString()
      );
  });

  // Get orders by designer ID
  const getOrdersByDesignerId = computed(() => {
    return (designerId) =>
      orders.value.filter(
        (order) => order.designerId.toString() === designerId.toString()
      );
  });

  // Calculate progress percentage for any order
  const calculateProgress = (order) => {
    // Map progress stages to percentage values
    const progressMap = {
      "Pattern Making": 20,
      "Fabric Cutting": 40,
      "Sewing & Assembly": 60,
      "Fitting & Adjustments": 80,
      "Final Assembly & Finishing": 90,
      "Packaging & Delivery": 100,
    };

    return progressMap[order.progress] || 0;
  };

  // Actions
  const fetchOrders = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Fetch orders from orders.json
      const response = await fetch("/database/orders.json");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      orders.value = await response.json();
      return orders.value;
    } catch (err) {
      console.error("Error fetching orders:", err);
      error.value = "Failed to load orders";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createOrder = async (orderData) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Get current user information dynamically
      const userStore = await getUserStore();
      let clientId = orderData.clientId;

      // If creating order as logged in client, use current user ID
      if (userStore.isClient) {
        clientId = userStore.userInfo.id;
      }

      // Check if client has measurements, if required
      if (orderData.requiresMeasurements) {
        const measurementStore = await getStoreInstance("measurement");
        const clientMeasurements =
          measurementStore.getMeasurementsByClientId(clientId);

        if (clientMeasurements.length === 0) {
          throw new Error("Client measurements are required for this order");
        }

        // Add measurements reference to order if available
        const latestMeasurement =
          measurementStore.getLatestMeasurementByClientId(clientId);
        if (latestMeasurement) {
          orderData.measurementId = latestMeasurement.id;
        }
      }

      // Generate new ID (get max ID from current orders and add 1)
      const newId = Math.max(0, ...orders.value.map((order) => order.id)) + 1;

      // Format order date
      const currentDate = new Date();
      const orderDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Calculate delivery date (30 days from now by default)
      const deliveryDate = new Date(currentDate);
      deliveryDate.setDate(deliveryDate.getDate() + 30);
      const formattedDeliveryDate = deliveryDate.toISOString().split("T")[0];

      // Create new order
      const newOrder = {
        id: newId,
        clientId: clientId,
        designerId: orderData.designerId,
        productId: orderData.productId,
        measurementId: orderData.measurementId || null, // Reference to measurement if available
        orderDate: orderDate,
        status: "In Progress",
        progress: "Pattern Making",
        currentStage: "Drafting Patterns",
        deliveryDate: orderData.deliveryDate || formattedDeliveryDate,
        totalPrice: parseFloat(orderData.totalPrice || 0),
        paymentStatus: "Paid",
      };

      // Add to orders array
      orders.value.push(newOrder);

      // Save updated orders to orders.json
      await saveOrdersToJson();

      return newOrder;
    } catch (err) {
      console.error("Error creating order:", err);
      error.value = "Failed to create order";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Find the order
      const orderIndex = orders.value.findIndex(
        (order) => order.id.toString() === orderId.toString()
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update the status
      orders.value[orderIndex].status = status;

      // Save updated orders to orders.json
      await saveOrdersToJson();

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error updating order status:", err);
      error.value = "Failed to update order status";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderProgress = async (orderId, progress, currentStage) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Find the order
      const orderIndex = orders.value.findIndex(
        (order) => order.id.toString() === orderId.toString()
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update progress and stage
      orders.value[orderIndex].progress = progress;
      orders.value[orderIndex].currentStage = currentStage;

      // Update status if progress is "Packaging & Delivery"
      if (progress === "Packaging & Delivery") {
        orders.value[orderIndex].status = "Completed";
      }

      // Save updated orders to orders.json
      await saveOrdersToJson();

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error updating order progress:", err);
      error.value = "Failed to update order progress";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to assign designer to order
  const assignDesignerToOrder = async (orderId, designerId) => {
    isLoading.value = true;
    error.value = null;

    try {
      const orderIndex = orders.value.findIndex(
        (order) => order.id.toString() === orderId.toString()
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update designer ID
      orders.value[orderIndex].designerId = designerId;

      // Save updated orders to orders.json
      await saveOrdersToJson();

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error assigning designer:", err);
      error.value = "Failed to assign designer to order";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to update measurement reference
  const updateOrderMeasurement = async (orderId, measurementId) => {
    isLoading.value = true;
    error.value = null;

    try {
      const orderIndex = orders.value.findIndex(
        (order) => order.id.toString() === orderId.toString()
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update measurement ID
      orders.value[orderIndex].measurementId = measurementId;

      // Save updated orders to orders.json
      await saveOrdersToJson();

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error updating order measurement:", err);
      error.value = "Failed to update order measurement";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to get complete order with client, designer, product and measurement details
  const getEnhancedOrder = async (orderId) => {
    const order = getOrderById.value(orderId);
    if (!order) return null;

    try {
      // Dynamically import required stores
      const [clientStore, designerStore, productsStore, measurementsStore] =
        await Promise.all([
          getStoreInstance("client"),
          getStoreInstance("designer"),
          getStoreInstance("product"),
          getStoreInstance("measurement"),
        ]);

      // Get client, designer, product, and measurement details
      const client = clientStore.getClientById(order.clientId);
      const designer = designerStore.getDesignerById(order.designerId);
      const product = productsStore.getProductById(order.productId);

      // Get measurement if available
      let measurement = null;
      if (order.measurementId) {
        measurement = measurementsStore.getMeasurementById(order.measurementId);
      } else {
        // Try to get latest measurement for this client if no specific measurement is linked
        measurement = measurementsStore.getLatestMeasurementByClientId(
          order.clientId
        );
      }

      return {
        ...order,
        clientDetails: client,
        designerDetails: designer,
        productDetails: product,
        measurementDetails: measurement,
      };
    } catch (error) {
      console.error("Error enhancing order:", error);
      return order;
    }
  };

  // Function to update delivery date
  const updateDeliveryDate = async (orderId, deliveryDate) => {
    isLoading.value = true;
    error.value = null;

    try {
      const orderIndex = orders.value.findIndex(
        (order) => order.id.toString() === orderId.toString()
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update delivery date
      orders.value[orderIndex].deliveryDate = deliveryDate;

      // Save updated orders to orders.json
      await saveOrdersToJson();

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error updating delivery date:", err);
      error.value = "Failed to update delivery date";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Helper function to save orders to orders.json
  const saveOrdersToJson = async () => {
    try {
      const response = await fetch("/database/orders.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orders.value),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error saving orders to JSON:", err);
      throw new Error("Failed to save orders to database");
    }
  };

  // Utility functions
  const formatCurrency = (amount) => {
    if (typeof amount === "string" && amount.startsWith("$")) {
      return amount;
    }
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Return all functions and state
  return {
    // State
    orders,
    isLoading,
    error,

    // Getters
    getAllOrders,
    getOrderById,
    getOrdersByStatus,
    getCurrentUserOrders,
    getOrdersByClientId,
    getOrdersByDesignerId,

    // Actions
    fetchOrders,
    createOrder,
    updateOrderStatus,
    updateOrderProgress,
    assignDesignerToOrder,
    updateOrderMeasurement,
    getEnhancedOrder,
    updateDeliveryDate,

    // Utility functions
    calculateProgress,
    formatCurrency,
    formatDate,
  };
});
