import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Default Designers
const defaultDesigners = [
  {
    id: 1,
    firstName: "Ruth",
    lastName: "Asiedua",
    email: "ranbea@gmail.com",
    password: "123456",
    userType: "designer",
    acceptTerms: true,
    specialization: "Formal Wear",
    rating: 4.9,
    ordersCompleted: 87,
    yearsExperience: 8,
    status: "Active",
  },
  {
    id: 2,
    firstName: "Victoria",
    lastName: "Yeboah",
    email: "maavic@gmail.com",
    password: "123456",
    userType: "designer",
    acceptTerms: true,
    specialization: "Traditional Wear",
    rating: 4.7,
    ordersCompleted: 62,
    yearsExperience: 6,
    status: "Active",
  },
  {
    id: 3,
    firstName: "Beatrice",
    lastName: "Apaloo",
    email: "madambee@gmail.com",
    password: "123456",
    userType: "designer",
    acceptTerms: true,
    specialization: "Casual Wear",
    rating: 4.6,
    ordersCompleted: 45,
    yearsExperience: 5,
    status: "Active",
  },
  {
    id: 4,
    firstName: "Maya",
    lastName: "Adams",
    email: "maya@gmail.com",
    password: "123456",
    userType: "designer",
    acceptTerms: true,
    specialization: "Wedding Dresses",
    rating: 4.8,
    ordersCompleted: 75,
    yearsExperience: 7,
    status: "Active",
  },
  {
    id: 5,
    firstName: "Olivia",
    lastName: "Taylor",
    email: "olivia@gmail.com",
    password: "123456",
    userType: "designer",
    acceptTerms: true,
    specialization: "Children's Wear",
    rating: 4.5,
    ordersCompleted: 38,
    yearsExperience: 4,
    status: "Active",
  },
];

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
