import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDesignerStore = defineStore("designer", () => {
  // State
  const designers = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Utility Function - Save to LocalStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("designers", JSON.stringify(designers.value));
  };

  // Fetch designers from localStorage or JSON file
  const fetchDesigners = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // First check if we have data in localStorage
      const storedDesigners = localStorage.getItem("designers");

      if (storedDesigners) {
        // Use localStorage data if available
        designers.value = JSON.parse(storedDesigners);
      } else {
        // Otherwise fetch from the JSON file
        try {
          const response = await fetch("/database/designers.json", {
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          designers.value = data;

          // Store in localStorage for future use
          saveToLocalStorage();
        } catch (fetchError) {
          saveToLocalStorage();
        }
      }
    } catch (err) {
      console.error("Error loading designers:", err);
      error.value = "Failed to load designers";
    } finally {
      isLoading.value = false;
    }
  };

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
  const addDesigner = (designerData) => {
    // Make sure designers are loaded
    if (designers.value.length === 0) {
      fetchDesigners();
    }

    const newId = designers.value.length
      ? Math.max(...designers.value.map((d) => d.id)) + 1
      : 1;

    const newDesigner = {
      id: newId,
      ...designerData,
      userType: "designer",
      rating: 0,
      ordersCompleted: 0,
      status: "New", // Default new designer status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      details: {
        bio: designerData.bio || "",
        location: designerData.location || "",
        socials: designerData.socials || { instagram: "", facebook: "" },
      },
      specialization: designerData.specialization || [],
    };

    designers.value.push(newDesigner);
    saveToLocalStorage(); // Persist data
    return newDesigner;
  };

  const updateDesigner = (designerId, updatedData) => {
    const index = designers.value.findIndex((d) => d.id === designerId);

    if (index !== -1) {
      designers.value[index] = {
        ...designers.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      saveToLocalStorage(); // Persist data
      return designers.value[index];
    }

    return null;
  };

  const deleteDesigner = (designerId) => {
    const index = designers.value.findIndex((d) => d.id === designerId);

    if (index !== -1) {
      designers.value.splice(index, 1);
      saveToLocalStorage(); // Persist data
      return true;
    }

    return false;
  };

  const getDesignerFullName = (designerId) => {
    const designer = getDesignerById.value(designerId);
    return designer ? `${designer.firstName} ${designer.lastName}` : "";
  };

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
