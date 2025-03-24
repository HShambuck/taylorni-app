// src/stores/ordersStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useProductsStore } from "./productsStore";
import { useClientStore } from "./clientStore";
import { useDesignerStore } from "./designerStore";
import { useUserStore } from "./userStore";

export const useOrdersStore = defineStore("orders", () => {
  // State
  const orders = ref([
    {
      id: "ORD1234",
      clientId: "client1", // Link to client store
      designerId: "designer1", // Link to designer store
      customerName: "Alex Johnson",
      customerEmail: "alex@example.com",
      customerPhone: "+1 (555) 123-4567",
      status: "In Progress",
      date: "March 1, 2025",
      total: "$350.00",
      paymentMethod: "Credit Card (•••• 4532)",
      items: [
        {
          id: 1,
          name: "Custom Tailored Suit",
          fabric: "Italian Wool",
          color: "Navy Blue",
          quantity: 1,
          price: "$350.00",
        },
      ],
      measurements: {
        chest: "42 inches",
        waist: "36 inches",
        inseam: "32 inches",
        shoulders: "18 inches",
        sleeve: "25 inches",
      },
      estimatedDelivery: "March 20, 2025",
      deliveryTime: "18:15",
      currentStep: 3,
      steps: [
        {
          id: 1,
          title: "Order confirmed",
          description: "Your custom clothing order has been confirmed",
          time: "17:35",
          completed: true,
          date: "March 1, 2025",
        },
        {
          id: 2,
          title: "Fabric selected",
          description: "Materials have been selected and prepared",
          time: "17:41",
          completed: true,
          date: "March 2, 2025",
        },
        {
          id: 3,
          title: "Measurements taken",
          description: "Your measurements have been recorded",
          time: "10:25",
          completed: true,
          date: "March 3, 2025",
        },
        {
          id: 4,
          title: "Cutting in progress",
          description: "Your fabric is being cut according to measurements",
          time: "",
          completed: false,
          date: "",
        },
        {
          id: 5,
          title: "Sewing in progress",
          description: "Your garment is being sewn by our expert tailors",
          time: "",
          completed: false,
          date: "",
        },
        {
          id: 6,
          title: "Final fitting",
          description: "Garment ready for final fitting and adjustments",
          time: "",
          completed: false,
          date: "",
        },
        {
          id: 7,
          title: "Ready for delivery",
          description: "Your custom garment is ready to be delivered",
          time: "",
          completed: false,
          date: "",
        },
      ],
    },
    {
      id: "ORD5678",
      clientId: "client2",
      designerId: "designer2",
      customerName: "Sarah Williams",
      customerEmail: "sarah@example.com",
      customerPhone: "+1 (555) 987-6543",
      status: "Shipped",
      date: "February 28, 2025",
      total: "$225.00",
      paymentMethod: "PayPal",
      items: [
        {
          id: 2,
          name: "Custom Blouse",
          fabric: "Silk",
          color: "Burgundy",
          quantity: 1,
          price: "$225.00",
        },
      ],
      measurements: {
        bust: "36 inches",
        waist: "28 inches",
        hips: "38 inches",
        shoulders: "16 inches",
        sleeve: "22 inches",
      },
      estimatedDelivery: "March 5, 2025",
      deliveryTime: "14:30",
      currentStep: 6,
      steps: [
        {
          id: 1,
          title: "Order confirmed",
          description: "Your custom clothing order has been confirmed",
          time: "09:15",
          completed: true,
          date: "February 28, 2025",
        },
        {
          id: 2,
          title: "Fabric selected",
          description: "Materials have been selected and prepared",
          time: "14:22",
          completed: true,
          date: "February 28, 2025",
        },
        {
          id: 3,
          title: "Measurements taken",
          description: "Your measurements have been recorded",
          time: "16:40",
          completed: true,
          date: "February 28, 2025",
        },
        {
          id: 4,
          title: "Cutting in progress",
          description: "Your fabric is being cut according to measurements",
          time: "10:15",
          completed: true,
          date: "March 1, 2025",
        },
        {
          id: 5,
          title: "Sewing in progress",
          description: "Your garment is being sewn by our expert tailors",
          time: "15:30",
          completed: true,
          date: "March 2, 2025",
        },
        {
          id: 6,
          title: "Final fitting",
          description: "Garment ready for final fitting and adjustments",
          time: "11:45",
          completed: true,
          date: "March 3, 2025",
        },
        {
          id: 7,
          title: "Ready for delivery",
          description: "Your custom garment is ready to be delivered",
          time: "",
          completed: false,
          date: "",
        },
      ],
    },
    {
      id: "ORD9101",
      clientId: "client3",
      designerId: "designer1",
      customerName: "Michael Chen",
      customerEmail: "michael@example.com",
      customerPhone: "+1 (555) 456-7890",
      status: "Completed",
      date: "February 20, 2025",
      total: "$150.00",
      paymentMethod: "Credit Card (•••• 7890)",
      items: [
        {
          id: 3,
          name: "Custom Dress Shirt",
          fabric: "Egyptian Cotton",
          color: "White",
          quantity: 1,
          price: "$150.00",
        },
      ],
      measurements: {
        neck: "16 inches",
        chest: "40 inches",
        waist: "34 inches",
        shoulders: "17.5 inches",
        sleeve: "24 inches",
      },
      estimatedDelivery: "February 28, 2025",
      deliveryTime: "12:00",
      currentStep: 7,
      steps: [
        {
          id: 1,
          title: "Order confirmed",
          description: "Your custom clothing order has been confirmed",
          time: "14:20",
          completed: true,
          date: "February 20, 2025",
        },
        {
          id: 2,
          title: "Fabric selected",
          description: "Materials have been selected and prepared",
          time: "16:05",
          completed: true,
          date: "February 20, 2025",
        },
        {
          id: 3,
          title: "Measurements taken",
          description: "Your measurements have been recorded",
          time: "09:30",
          completed: true,
          date: "February 21, 2025",
        },
        {
          id: 4,
          title: "Cutting in progress",
          description: "Your fabric is being cut according to measurements",
          time: "13:45",
          completed: true,
          date: "February 22, 2025",
        },
        {
          id: 5,
          title: "Sewing in progress",
          description: "Your garment is being sewn by our expert tailors",
          time: "11:20",
          completed: true,
          date: "February 23, 2025",
        },
        {
          id: 6,
          title: "Final fitting",
          description: "Garment ready for final fitting and adjustments",
          time: "16:30",
          completed: true,
          date: "February 25, 2025",
        },
        {
          id: 7,
          title: "Ready for delivery",
          description: "Your custom garment is ready for delivery",
          time: "10:15",
          completed: true,
          date: "February 27, 2025",
        },
      ],
    },
  ]);

  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getAllOrders = computed(() => orders.value);

  const getOrderById = computed(() => {
    return (orderId) =>
      orders.value.find((order) => order.id === orderId) || null;
  });

  const getOrdersByStatus = computed(() => {
    return (status) => orders.value.filter((order) => order.status === status);
  });

  // Get orders for current logged-in user based on user type
  const getCurrentUserOrders = computed(() => {
    const userStore = useUserStore();
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
  });

  // Get orders by client ID
  const getOrdersByClientId = computed(() => {
    return (clientId) =>
      orders.value.filter((order) => order.clientId === clientId);
  });

  // Get orders by designer ID
  const getOrdersByDesignerId = computed(() => {
    return (designerId) =>
      orders.value.filter((order) => order.designerId === designerId);
  });

  // Calculate progress percentage for any order
  const calculateProgress = (order) => {
    return Math.round((order.currentStep / order.steps.length) * 100);
  };

  // Actions
  const fetchOrders = async () => {
    // In a real app, this would be an API call
    isLoading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, you would fetch orders from the API here
    } catch (err) {
      console.error("Error fetching orders:", err);
      error.value = "Failed to load orders";
    } finally {
      isLoading.value = false;
    }
  };

  const createOrder = async (orderData) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate a new order ID
      const newOrderId = `ORD${Math.floor(1000 + Math.random() * 9000)}`;

      // Get current user information
      const userStore = useUserStore();
      let clientId = orderData.clientId;

      // If creating order as logged in client, use current user ID
      if (userStore.isClient) {
        clientId = userStore.userInfo.id;
      }

      // Create new order with default steps and current step 1
      const newOrder = {
        id: newOrderId,
        clientId,
        designerId: orderData.designerId,
        customerName:
          orderData.customerName ||
          (userStore.isClient ? userStore.userInfo.fullName : ""),
        customerEmail:
          orderData.customerEmail ||
          (userStore.isClient ? userStore.userInfo.email : ""),
        customerPhone: orderData.customerPhone || "",
        status: "New",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        currentStep: 1,
        total: formatCurrency(orderData.total),
        paymentMethod: orderData.paymentMethod,
        items: orderData.items || [],
        measurements: orderData.measurements || {},
        estimatedDelivery:
          orderData.estimatedDelivery || calculateEstimatedDelivery(),
        deliveryTime: orderData.deliveryTime || "12:00",
        steps: [
          {
            id: 1,
            title: "Order confirmed",
            description: "Your custom clothing order has been confirmed",
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            completed: true,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
          {
            id: 2,
            title: "Fabric selected",
            description: "Materials have been selected and prepared",
            time: "",
            completed: false,
            date: "",
          },
          {
            id: 3,
            title: "Measurements taken",
            description: "Your measurements have been recorded",
            time: "",
            completed: false,
            date: "",
          },
          {
            id: 4,
            title: "Cutting in progress",
            description: "Your fabric is being cut according to measurements",
            time: "",
            completed: false,
            date: "",
          },
          {
            id: 5,
            title: "Sewing in progress",
            description: "Your garment is being sewn by our expert tailors",
            time: "",
            completed: false,
            date: "",
          },
          {
            id: 6,
            title: "Final fitting",
            description: "Garment ready for final fitting and adjustments",
            time: "",
            completed: false,
            date: "",
          },
          {
            id: 7,
            title: "Ready for delivery",
            description: "Your custom garment is ready to be delivered",
            time: "",
            completed: false,
            date: "",
          },
        ],
      };

      // Add to orders array
      orders.value.push(newOrder);

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
        (order) => order.id === orderId
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update the status
      orders.value[orderIndex].status = status;

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error updating order status:", err);
      error.value = "Failed to update order status";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderStep = async (orderId, stepNumber) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Find the order
      const orderIndex = orders.value.findIndex(
        (order) => order.id === orderId
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      const order = orders.value[orderIndex];

      // Ensure step is valid
      if (stepNumber < 1 || stepNumber > order.steps.length) {
        throw new Error(`Invalid step number: ${stepNumber}`);
      }

      // Update current step
      order.currentStep = stepNumber;

      // Mark all steps up to and including the current step as completed
      for (let i = 0; i < order.steps.length; i++) {
        if (i < stepNumber) {
          order.steps[i].completed = true;

          // If the step doesn't have a date/time, add one
          if (!order.steps[i].date) {
            order.steps[i].date = new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            order.steps[i].time = new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } else {
          order.steps[i].completed = false;
        }
      }

      // Update status based on step
      if (stepNumber === order.steps.length) {
        order.status = "Completed";
      } else if (stepNumber > 1) {
        order.status = "In Progress";
      }

      return order;
    } catch (err) {
      console.error("Error updating order step:", err);
      error.value = "Failed to update order step";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to integrate products with orders
  const getOrderWithProductDetails = (orderId) => {
    const productsStore = useProductsStore();
    const order = getOrderById.value(orderId);

    if (!order) return null;

    // Enhance order items with full product details where possible
    const enhancedItems = order.items.map((item) => {
      const product = productsStore.getProductById(item.id);

      if (product) {
        return {
          ...item,
          productDetails: product,
        };
      }

      return item;
    });

    return {
      ...order,
      items: enhancedItems,
    };
  };

  // Function to get complete order with client and designer details
  const getEnhancedOrder = (orderId) => {
    const clientStore = useClientStore();
    const designerStore = useDesignerStore();
    const productsStore = useProductsStore();

    const order = getOrderById.value(orderId);
    if (!order) return null;

    // Get client and designer details
    const client = clientStore.getClientById(order.clientId);
    const designer = designerStore.getDesignerById(order.designerId);

    // Enhance order items with product details
    const enhancedItems = order.items.map((item) => {
      const product = productsStore.getProductById(item.id);
      return product ? { ...item, productDetails: product } : item;
    });

    return {
      ...order,
      items: enhancedItems,
      clientDetails: client,
      designerDetails: designer,
    };
  };

  // Utility functions
  const calculateEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14); // 2 weeks from now

    return deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (typeof amount === "string" && amount.startsWith("$")) {
      // Already formatted
      return amount;
    }

    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to assign designer to order
  const assignDesignerToOrder = async (orderId, designerId) => {
    isLoading.value = true;
    error.value = null;

    try {
      const orderIndex = orders.value.findIndex(
        (order) => order.id === orderId
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update designer ID
      orders.value[orderIndex].designerId = designerId;

      // If this is the first assignment, update status
      if (orders.value[orderIndex].status === "New") {
        orders.value[orderIndex].status = "Assigned";
      }

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error assigning designer:", err);
      error.value = "Failed to assign designer to order";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to update measurements
  const updateOrderMeasurements = async (orderId, measurements) => {
    isLoading.value = true;
    error.value = null;

    try {
      const orderIndex = orders.value.findIndex(
        (order) => order.id === orderId
      );

      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update measurements
      orders.value[orderIndex].measurements = {
        ...orders.value[orderIndex].measurements,
        ...measurements,
      };

      // If we're at step 2, move to step 3 (measurements taken)
      if (orders.value[orderIndex].currentStep === 2) {
        await updateOrderStep(orderId, 3);
      }

      return orders.value[orderIndex];
    } catch (err) {
      console.error("Error updating measurements:", err);
      error.value = "Failed to update measurements";
      throw err;
    } finally {
      isLoading.value = false;
    }
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
    updateOrderStep,
    getOrderWithProductDetails,
    getEnhancedOrder,
    assignDesignerToOrder,
    updateOrderMeasurements,

    // Utility functions
    calculateProgress,
    formatCurrency,
    formatDate,
  };
});
