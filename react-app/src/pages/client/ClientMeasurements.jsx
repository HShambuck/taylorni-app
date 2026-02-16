// src/pages/client/ClientMeasurements.jsx
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/store/slices/authSlice";

// Mock API for measurements
const mockAPI = {
  getMeasurements: async (clientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(`measurements_${clientId}`);
        if (saved) {
          resolve(JSON.parse(saved));
        } else {
          resolve([
            {
              id: 1,
              clientId,
              category: "Male",
              dateRecorded: "2025-01-15",
              chest: 40,
              waist: 32,
              hip: 38,
              shoulderWidth: 18,
              sleeveLength: 25,
              neckCircumference: 15.5,
            },
            {
              id: 2,
              clientId,
              category: "Male",
              dateRecorded: "2024-12-01",
              chest: 39,
              waist: 33,
              hip: 37,
              shoulderWidth: 17.5,
              sleeveLength: 24.5,
              neckCircumference: 15,
            },
          ]);
        }
      }, 500);
    });
  },

  saveMeasurement: async (clientId, measurement) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(`measurements_${clientId}`);
        const measurements = saved ? JSON.parse(saved) : [];
        const newMeasurement = {
          ...measurement,
          id: Date.now(),
          clientId,
          dateRecorded: new Date().toISOString().split("T")[0],
        };
        measurements.push(newMeasurement);
        localStorage.setItem(`measurements_${clientId}`, JSON.stringify(measurements));
        resolve(newMeasurement);
      }, 300);
    });
  },

  updateMeasurement: async (clientId, measurementId, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(`measurements_${clientId}`);
        const measurements = saved ? JSON.parse(saved) : [];
        const index = measurements.findIndex((m) => m.id === measurementId);
        if (index !== -1) {
          measurements[index] = { ...measurements[index], ...updates };
          localStorage.setItem(`measurements_${clientId}`, JSON.stringify(measurements));
          resolve(measurements[index]);
        }
        resolve(null);
      }, 300);
    });
  },

  deleteMeasurement: async (clientId, measurementId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(`measurements_${clientId}`);
        const measurements = saved ? JSON.parse(saved) : [];
        const filtered = measurements.filter((m) => m.id !== measurementId);
        localStorage.setItem(`measurements_${clientId}`, JSON.stringify(filtered));
        resolve(true);
      }, 300);
    });
  },
};

// Measurement fields by category
const measurementFieldsByCategory = {
  Kids: [
    { name: "height", label: "Height" },
    { name: "chest", label: "Chest" },
    { name: "waist", label: "Waist" },
    { name: "hips", label: "Hips" },
    { name: "shoulderWidth", label: "Shoulder Width" },
    { name: "armLength", label: "Arm Length" },
  ],
  Male: [
    { name: "chest", label: "Chest" },
    { name: "waist", label: "Waist" },
    { name: "hip", label: "Hip" },
    { name: "neckCircumference", label: "Neck Circumference" },
    { name: "shoulderWidth", label: "Shoulder Width" },
    { name: "sleeveLength", label: "Sleeve Length" },
    { name: "bicepCircumference", label: "Bicep Circumference" },
    { name: "wristCircumference", label: "Wrist Circumference" },
    { name: "crotch", label: "Crotch" },
    { name: "thigh", label: "Thigh" },
    { name: "knee", label: "Knee" },
    { name: "calf", label: "Calf" },
    { name: "topLength", label: "Top Length" },
  ],
  Female: [
    { name: "bust", label: "Bust" },
    { name: "upperBust", label: "Upper Bust" },
    { name: "underBust", label: "Under Bust" },
    { name: "waist", label: "Waist" },
    { name: "hip", label: "Hip" },
    { name: "shoulderToWaist", label: "Shoulder to Waist" },
    { name: "waistToHip", label: "Waist to Hip" },
    { name: "apexToApex", label: "Apex to Apex" },
    { name: "shoulderWidth", label: "Shoulder Width" },
    { name: "neckCircumference", label: "Neck Circumference" },
    { name: "sleeveLength", label: "Sleeve Length" },
    { name: "bicepCircumference", label: "Bicep Circumference" },
    { name: "wristCircumference", label: "Wrist Circumference" },
    { name: "crotch", label: "Crotch" },
    { name: "dressLength", label: "Dress Length" },
  ],
};

// Format field name helper
const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

// Format date helper
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Main Component
const ClientMeasurements = () => {
  const userInfo = useSelector(selectUserInfo);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [measurements, setMeasurements] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // New measurement form state
  const [newMeasurement, setNewMeasurement] = useState({
    category: "",
    measurements: {},
  });

  // Fetch measurements on mount
  useEffect(() => {
    const fetchMeasurements = async () => {
      setIsLoading(true);
      try {
        const data = await mockAPI.getMeasurements(userInfo?.id);
        setMeasurements(data);
      } catch (error) {
        console.error("Error fetching measurements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchMeasurements();
    }
  }, [userInfo?.id]);

  // Get fields for selected category
  const measurementFields = useMemo(() => {
    return measurementFieldsByCategory[newMeasurement.category] || [];
  }, [newMeasurement.category]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setNewMeasurement({
      category,
      measurements: {},
    });
  };

  // Handle measurement value change
  const handleMeasurementChange = (fieldName, value) => {
    setNewMeasurement((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [fieldName]: value,
      },
    }));
  };

  // Save new measurement
  const handleSaveMeasurement = async () => {
    if (!newMeasurement.category) {
      alert("Please select a category");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await mockAPI.saveMeasurement(userInfo?.id, {
        category: newMeasurement.category,
        ...newMeasurement.measurements,
      });

      setMeasurements((prev) => [...prev, saved]);
      setNewMeasurement({ category: "", measurements: {} });
      alert("Measurement saved successfully!");
    } catch (error) {
      alert("Error saving measurement: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // View measurement details
  const handleViewMeasurement = (measurement) => {
    setSelectedMeasurement(measurement);
    setShowViewModal(true);
  };

  // Edit measurement
  const handleEditMeasurement = (measurement) => {
    setSelectedMeasurement({ ...measurement });
    setShowEditModal(true);
  };

  // Save edited measurement
  const handleSaveEdit = async () => {
    if (!selectedMeasurement) return;

    setIsSaving(true);
    try {
      await mockAPI.updateMeasurement(
        userInfo?.id,
        selectedMeasurement.id,
        selectedMeasurement
      );

      setMeasurements((prev) =>
        prev.map((m) =>
          m.id === selectedMeasurement.id ? selectedMeasurement : m
        )
      );

      setShowEditModal(false);
      alert("Measurement updated successfully!");
    } catch (error) {
      alert("Error updating measurement: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete measurement
  const handleDeleteMeasurement = async (measurementId) => {
    if (!confirm("Are you sure you want to delete this measurement?")) return;

    try {
      await mockAPI.deleteMeasurement(userInfo?.id, measurementId);
      setMeasurements((prev) => prev.filter((m) => m.id !== measurementId));
      alert("Measurement deleted successfully!");
    } catch (error) {
      alert("Error deleting measurement: " + error.message);
    }
  };

  // Update selected measurement field
  const handleEditFieldChange = (fieldName, value) => {
    setSelectedMeasurement((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">
          📏 My Measurements
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your body measurements for perfect fits
        </p>
      </div>

      {/* New Measurement Form */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-purple-900 mb-4">
          Record New Measurement
        </h2>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={newMeasurement.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Dynamic Measurement Fields */}
        {newMeasurement.category && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {measurementFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMeasurement.measurements[field.name] || ""}
                    onChange={(e) =>
                      handleMeasurementChange(field.name, parseFloat(e.target.value) || "")
                    }
                    placeholder={field.label}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveMeasurement}
                disabled={isSaving}
                className="px-6 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Save Measurement"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Saved Measurements */}
      {measurements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-900 mb-4">
            My Saved Measurements
          </h2>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(measurement.dateRecorded)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded">
                        {measurement.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewMeasurement(measurement)}
                          className="text-purple-800 hover:text-purple-900 font-medium text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditMeasurement(measurement)}
                          className="text-amber-500 hover:text-amber-600 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeasurement(measurement.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {measurements.map((measurement) => (
              <div
                key={measurement.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded">
                    {measurement.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(measurement.dateRecorded)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleViewMeasurement(measurement)}
                    className="text-purple-800 hover:text-purple-900 font-medium text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditMeasurement(measurement)}
                    className="text-amber-500 hover:text-amber-600 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMeasurement(measurement.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {measurements.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">No measurements saved yet</p>
          <p className="text-sm text-gray-400">
            Record your first measurement above to get started
          </p>
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Measurement Details"
      >
        {selectedMeasurement && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-medium">{selectedMeasurement.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date Recorded</span>
                <p className="font-medium">
                  {formatDate(selectedMeasurement.dateRecorded)}
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-gray-800 mb-3">Measurements</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(selectedMeasurement)
                .filter(
                  ([key]) =>
                    !["id", "clientId", "category", "designerId", "dateRecorded"].includes(key)
                )
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-500">{formatFieldName(key)}</span>
                    <p className="font-medium">{value} cm</p>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditMeasurement(selectedMeasurement);
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Measurement"
      >
        {selectedMeasurement && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={selectedMeasurement.category}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {(measurementFieldsByCategory[selectedMeasurement.category] || []).map(
                (field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedMeasurement[field.name] || ""}
                      onChange={(e) =>
                        handleEditFieldChange(field.name, parseFloat(e.target.value) || "")
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientMeasurements;