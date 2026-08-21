import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMeasurementsStore = defineStore("measurements", () => {
  // State
  const measurements = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getAllMeasurements = computed(() => measurements.value);

  const getMeasurementById = computed(() => {
    return (measurementId) =>
      measurements.value.find(
        (measurement) => measurement.id.toString() === measurementId.toString()
      ) || null;
  });

  const getMeasurementsByClientId = computed(() => {
    return (clientId) =>
      measurements.value.filter(
        (measurement) => measurement.clientId.toString() === clientId.toString()
      );
  });

  const getLatestMeasurementByClientId = computed(() => {
    return (clientId) => {
      const clientMeasurements = measurements.value.filter(
        (measurement) => measurement.clientId.toString() === clientId.toString()
      );

      if (clientMeasurements.length === 0) return null;

      // Sort by date and return the most recent
      return clientMeasurements.sort(
        (a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded)
      )[0];
    };
  });

  const getMeasurementsByDesignerId = computed(() => {
    return (designerId) =>
      measurements.value.filter(
        (measurement) =>
          measurement.designerId.toString() === designerId.toString()
      );
  });

  const getMeasurementsByCategory = computed(() => {
    return (category) =>
      measurements.value.filter(
        (measurement) => measurement.category === category
      );
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
      default:
        throw new Error(`Unknown store: ${storeName}`);
    }
  };

  // Dynamically get user store on demand
  const getUserStore = async () => {
    return await getStoreInstance("user");
  };

  // Get measurements for current logged-in user
  const getCurrentUserMeasurements = computed(() => {
    // This getter needs to be used within an async context
    return async () => {
      const userStore = await getUserStore();
      if (!userStore.isAuthenticated) return [];

      if (userStore.isClient) {
        return measurements.value.filter(
          (measurement) => measurement.clientId === userStore.userInfo.id
        );
      } else if (userStore.isDesigner) {
        return measurements.value.filter(
          (measurement) => measurement.designerId === userStore.userInfo.id
        );
      }
      return [];
    };
  });

  // Actions
  const fetchMeasurements = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Fetch measurements from measurements.json
      const response = await fetch("/database/measurements.json");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      measurements.value = await response.json();
      return measurements.value;
    } catch (err) {
      console.error("Error fetching measurements:", err);
      error.value = "Failed to load measurements";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createMeasurement = async (measurementData) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Get current user information dynamically
      const userStore = await getUserStore();
      let designerId = measurementData.designerId;

      // If creating measurement as logged in designer, use current user ID
      if (userStore.isDesigner) {
        designerId = userStore.userInfo.id;
      }

      // Generate new ID (get max ID from current measurements and add 1)
      const newId = Math.max(0, ...measurements.value.map((m) => m.id)) + 1;

      // Format date
      const currentDate = new Date();
      const dateRecorded = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Create new measurement
      const newMeasurement = {
        id: newId,
        clientId: measurementData.clientId,
        category: measurementData.category,
        dateRecorded: dateRecorded,
        designerId: designerId,
        ...measurementData.measurements, // Spread all measurements
      };

      // Add to measurements array
      measurements.value.push(newMeasurement);

      // Save updated measurements to measurements.json
      await saveMeasurementsToJson();

      return newMeasurement;
    } catch (err) {
      console.error("Error creating measurement:", err);
      error.value = "Failed to create measurement";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateMeasurement = async (measurementId, updatedData) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Find the measurement
      const measurementIndex = measurements.value.findIndex(
        (measurement) => measurement.id.toString() === measurementId.toString()
      );

      if (measurementIndex === -1) {
        throw new Error(`Measurement ${measurementId} not found`);
      }

      // Update the measurement with new data
      measurements.value[measurementIndex] = {
        ...measurements.value[measurementIndex],
        ...updatedData,
        dateRecorded: new Date().toISOString().split("T")[0], // Update date recorded
      };

      // Save updated measurements to measurements.json
      await saveMeasurementsToJson();

      return measurements.value[measurementIndex];
    } catch (err) {
      console.error("Error updating measurement:", err);
      error.value = "Failed to update measurement";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteMeasurement = async (measurementId) => {
    isLoading.value = true;
    error.value = null;

    try {
      const measurementIndex = measurements.value.findIndex(
        (measurement) => measurement.id.toString() === measurementId.toString()
      );

      if (measurementIndex === -1) {
        throw new Error(`Measurement ${measurementId} not found`);
      }

      // Remove measurement
      measurements.value.splice(measurementIndex, 1);

      // Save updated measurements to measurements.json
      await saveMeasurementsToJson();

      return true;
    } catch (err) {
      console.error("Error deleting measurement:", err);
      error.value = "Failed to delete measurement";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get enhanced measurement with client and designer details
  const getEnhancedMeasurement = async (measurementId) => {
    const measurement = getMeasurementById.value(measurementId);
    if (!measurement) return null;

    try {
      // Dynamically import required stores
      const [clientStore, designerStore] = await Promise.all([
        getStoreInstance("client"),
        getStoreInstance("designer"),
      ]);

      // Get client and designer details
      const client = clientStore.getClientById(measurement.clientId);
      const designer = designerStore.getDesignerById(measurement.designerId);

      return {
        ...measurement,
        clientDetails: client,
        designerDetails: designer,
      };
    } catch (error) {
      console.error("Error enhancing measurement:", error);
      return measurement;
    }
  };

  // Helper function to save measurements to measurements.json
  const saveMeasurementsToJson = async () => {
    try {
      const response = await fetch("/database/measurements.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(measurements.value),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error saving measurements to JSON:", err);
      throw new Error("Failed to save measurements to database");
    }
  };

  // Format date utility
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Return all functions and state
  return {
    // State
    measurements,
    isLoading,
    error,

    // Getters
    getAllMeasurements,
    getMeasurementById,
    getMeasurementsByClientId,
    getLatestMeasurementByClientId,
    getMeasurementsByDesignerId,
    getMeasurementsByCategory,
    getCurrentUserMeasurements,

    // Actions
    fetchMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getEnhancedMeasurement,

    // Utilities
    formatDate,
  };
});
