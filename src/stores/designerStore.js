import { defineStore } from "pinia";
import { ref, computed } from "vue";
import defaultDesigners from "@db/designers.json";

export const useDesignerStore = defineStore("designer", () => {
  // State
  const designers = ref(defaultDesigners);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getAllDesigners = computed(() => designers.value);

  const getDesignerById = computed(() => {
    return (designerId) =>
      designers.value.find((designer) => designer.id === designerId) || null;
  });

  const getDesignerByEmail = computed(() => {
    return (email) =>
      designers.value.find((designer) => designer.email === email) || null;
  });

  const getTopDesigners = computed(() => {
    return [...designers.value].sort((a, b) => b.rating - a.rating).slice(0, 3);
  });

  // Actions
  const fetchDesigners = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // In a real app, you would fetch designers from an API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // designers.value = await api.getDesigners();
    } catch (err) {
      console.error("Error fetching designers:", err);
      error.value = "Failed to load designers";
    } finally {
      isLoading.value = false;
    }
  };

  const addDesigner = (designerData) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = Math.max(...designers.value.map((d) => d.id)) + 1;

    const newDesigner = {
      id: newId,
      ...designerData,
      userType: "designer",
      rating: 0,
      ordersCompleted: 0,
      status: "Active",
    };

    designers.value.push(newDesigner);
    return newDesigner;
  };

  const updateDesigner = (designerId, updatedData) => {
    const index = designers.value.findIndex((d) => d.id === designerId);

    if (index !== -1) {
      // Merge the existing designer with updated data
      designers.value[index] = {
        ...designers.value[index],
        ...updatedData,
      };
      return designers.value[index];
    }

    return null;
  };

  const deleteDesigner = (designerId) => {
    const index = designers.value.findIndex((d) => d.id === designerId);

    if (index !== -1) {
      designers.value.splice(index, 1);
      return true;
    }

    return false;
  };

  const getDesignerFullName = (designerId) => {
    const designer = getDesignerById.value(designerId);
    if (designer) {
      return `${designer.firstName} ${designer.lastName}`;
    }
    return "";
  };

  // Helper methods for integration with other stores
  const getDesignersForAuth = () => {
    return designers.value.map((designer) => ({
      id: designer.id,
      firstName: designer.firstName,
      lastName: designer.lastName,
      email: designer.email,
      password: designer.password,
      userType: "designer",
      acceptTerms: designer.acceptTerms || true,
    }));
  };

  // Return all functions and state
  return {
    // State
    designers,
    isLoading,
    error,

    // Getters
    getAllDesigners,
    getDesignerById,
    getDesignerByEmail,
    getTopDesigners,

    // Actions
    fetchDesigners,
    addDesigner,
    updateDesigner,
    deleteDesigner,
    getDesignerFullName,
    getDesignersForAuth,
  };
});
