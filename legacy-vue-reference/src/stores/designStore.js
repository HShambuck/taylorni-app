import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./auth";
import { useDesignerStore } from "./designerStore";

export const useDesignStore = defineStore("design", () => {
  // State
  const designs = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Utility Function - Save to LocalStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("designs", JSON.stringify(designs.value));
  };

  // Fetch designs from localStorage or JSON file
  const fetchDesigns = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // First check if we have data in localStorage
      const storedDesigns = localStorage.getItem("designs");

      if (storedDesigns) {
        // Use localStorage data if available
        designs.value = JSON.parse(storedDesigns);
      } else {
        // Fetch from the JSON file (could be an API in production)
        try {
          const response = await fetch("/database/products.json", {
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          designs.value = data;

          // Store in localStorage for future use
          saveToLocalStorage();
        } catch (fetchError) {
          console.error("Error fetching designs:", fetchError);
          error.value = "Failed to fetch designs data";
        }
      }
    } catch (err) {
      console.error("Error loading designs:", err);
      error.value = "Failed to load designs";
    } finally {
      isLoading.value = false;
    }
  };

  // Getters
  const getAllDesigns = computed(() => designs.value);

  const getMyDesigns = computed(() => {
    const userStore = useUserStore();
    if (!userStore.isAuthenticated || !userStore.userInfo) return [];

    const designerId = userStore.userInfo.id;
    return designs.value.filter((design) => design.designerId === designerId);
  });

  const getDesignById = computed(() => {
    return (designId) =>
      designs.value.find((design) => design.id === designId) || null;
  });

  const getDesignsByCategory = computed(() => {
    return (category) =>
      designs.value.filter((design) => design.category === category);
  });

  const getDesignsByStatus = computed(() => {
    return (status) =>
      designs.value.filter((design) => design.status === status);
  });

  const getBestSellingDesigns = computed(() => {
    return [...designs.value].sort((a, b) => b.orders - a.orders).slice(0, 5);
  });

  const getTotalSales = computed(() => {
    const myDesigns = getMyDesigns.value;
    return myDesigns.reduce(
      (total, design) => total + design.price * design.orders,
      0
    );
  });

  const getTotalDesignsCount = computed(() => {
    return getMyDesigns.value.length;
  });

  const getActiveDesignsCount = computed(() => {
    return getMyDesigns.value.filter((design) => design.status === "Live")
      .length;
  });

  const getPendingDesignsCount = computed(() => {
    return getMyDesigns.value.filter((design) => design.status === "Pending")
      .length;
  });

  // Get designer name for a design
  const getDesignerNameForDesign = (designId) => {
    const design = getDesignById.value(designId);
    if (!design) return "";

    const designerStore = useDesignerStore();
    return designerStore.getDesignerFullName(design.designerId);
  };

  // Actions
  const addDesign = (designData) => {
    const userStore = useUserStore();
    if (!userStore.isAuthenticated || !userStore.isDesigner) return null;

    const newId = designs.value.length
      ? Math.max(...designs.value.map((d) => d.id)) + 1
      : 1;

    const newDesign = {
      id: newId,
      ...designData,
      designerId: userStore.userInfo.id,
      views: 0,
      orders: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    designs.value.push(newDesign);
    saveToLocalStorage();
    return newDesign;
  };

  const updateDesign = (designId, updatedData) => {
    const index = designs.value.findIndex((d) => d.id === designId);
    const userStore = useUserStore();

    if (index !== -1) {
      // Make sure the user is the owner of this design
      if (
        !userStore.isAuthenticated ||
        designs.value[index].designerId !== userStore.userInfo.id
      ) {
        return null;
      }

      designs.value[index] = {
        ...designs.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      saveToLocalStorage();
      return designs.value[index];
    }

    return null;
  };

  const deleteDesign = (designId) => {
    const index = designs.value.findIndex((d) => d.id === designId);
    const userStore = useUserStore();

    if (index !== -1) {
      // Make sure the user is the owner of this design
      if (
        !userStore.isAuthenticated ||
        designs.value[index].designerId !== userStore.userInfo.id
      ) {
        return false;
      }

      designs.value.splice(index, 1);
      saveToLocalStorage();
      return true;
    }

    return false;
  };

  // Return all functions and state
  return {
    // State
    designs,
    isLoading,
    error,

    // Getters
    getAllDesigns,
    getMyDesigns,
    getDesignById,
    getDesignsByCategory,
    getDesignsByStatus,
    getBestSellingDesigns,
    getTotalSales,
    getTotalDesignsCount,
    getActiveDesignsCount,
    getPendingDesignsCount,
    getDesignerNameForDesign,

    // Actions
    fetchDesigns,
    addDesign,
    updateDesign,
    deleteDesign,
  };
});
