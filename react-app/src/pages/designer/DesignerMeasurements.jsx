// src/pages/designer/DesignerMeasurements.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '@/store/slices/authSlice';

// Mock API and data
const mockClients = [
  { id: 1, firstName: 'Jane', lastName: 'Cooper' },
  { id: 2, firstName: 'Alex', lastName: 'Morgan' },
  { id: 3, firstName: 'Sarah', lastName: 'Johnson' },
  { id: 4, firstName: 'Michael', lastName: 'Brown' },
];

const mockMeasurements = [
  {
    id: 1,
    clientId: 1,
    designerId: 1,
    category: 'Female',
    dateRecorded: '2025-01-15',
    bust: 90,
    waist: 70,
    hip: 95,
    shoulderWidth: 40,
  },
  {
    id: 2,
    clientId: 2,
    designerId: 1,
    category: 'Male',
    dateRecorded: '2025-01-20',
    chest: 100,
    waist: 85,
    hip: 95,
    shoulderWidth: 45,
  },
  {
    id: 3,
    clientId: 3,
    designerId: 1,
    category: 'Kids',
    dateRecorded: '2025-02-01',
    height: 120,
    chest: 65,
    waist: 55,
    hips: 68,
  },
];

// Measurement field definitions by category
const MEASUREMENT_FIELDS = {
  Kids: [
    { name: 'height', label: 'Height' },
    { name: 'chest', label: 'Chest' },
    { name: 'waist', label: 'Waist' },
    { name: 'hips', label: 'Hips' },
    { name: 'shoulderWidth', label: 'Shoulder Width' },
    { name: 'armLength', label: 'Arm Length' },
  ],
  Male: [
    { name: 'chest', label: 'Chest' },
    { name: 'waist', label: 'Waist' },
    { name: 'hip', label: 'Hip' },
    { name: 'neckCircumference', label: 'Neck Circumference' },
    { name: 'shoulderWidth', label: 'Shoulder Width' },
    { name: 'sleeveLength', label: 'Sleeve Length' },
    { name: 'bicepCircumference', label: 'Bicep Circumference' },
    { name: 'wristCircumference', label: 'Wrist Circumference' },
    { name: 'crotch', label: 'Crotch' },
    { name: 'thigh', label: 'Thigh' },
    { name: 'knee', label: 'Knee' },
    { name: 'calf', label: 'Calf' },
    { name: 'topLength', label: 'Top Length' },
  ],
  Female: [
    { name: 'bust', label: 'Bust' },
    { name: 'upperBust', label: 'Upper Bust' },
    { name: 'underBust', label: 'Under Bust' },
    { name: 'waist', label: 'Waist' },
    { name: 'hip', label: 'Hip' },
    { name: 'shoulderToWaist', label: 'Shoulder to Waist' },
    { name: 'waistToHip', label: 'Waist to Hip' },
    { name: 'apexToApex', label: 'Apex to Apex' },
    { name: 'shoulderWidth', label: 'Shoulder Width' },
    { name: 'neckCircumference', label: 'Neck Circumference' },
    { name: 'sleeveLength', label: 'Sleeve Length' },
    { name: 'bicepCircumference', label: 'Bicep Circumference' },
    { name: 'wristCircumference', label: 'Wrist Circumference' },
    { name: 'crotch', label: 'Crotch' },
    { name: 'dressLength', label: 'Dress Length' },
  ],
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const getClientName = (clientId, clients) => {
  const client = clients.find((c) => c.id === clientId);
  return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const DesignerMeasurements = () => {
  const userInfo = useSelector(selectUserInfo);
  
  // State
  const [clients] = useState(mockClients);
  const [measurements, setMeasurements] = useState(mockMeasurements);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientFilter, setSelectedClientFilter] = useState('');
  
  // Form state
  const [newMeasurement, setNewMeasurement] = useState({
    clientId: '',
    category: '',
    measurements: {},
  });
  
  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [editingMeasurement, setEditingMeasurement] = useState(null);

  // Get fields for selected category
  const measurementFields = useMemo(() => {
    return MEASUREMENT_FIELDS[newMeasurement.category] || [];
  }, [newMeasurement.category]);

  // Filtered measurements
  const filteredMeasurements = useMemo(() => {
    if (!selectedClientFilter) return measurements;
    return measurements.filter(
      (m) => m.clientId.toString() === selectedClientFilter.toString()
    );
  }, [measurements, selectedClientFilter]);

  // Reset measurement fields when category changes
  useEffect(() => {
    setNewMeasurement((prev) => ({
      ...prev,
      measurements: {},
    }));
  }, [newMeasurement.category]);

  // Handlers
  const handleNewMeasurementChange = (field, value) => {
    if (field === 'clientId' || field === 'category') {
      setNewMeasurement((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewMeasurement((prev) => ({
        ...prev,
        measurements: { ...prev.measurements, [field]: value },
      }));
    }
  };

  const handleSaveMeasurement = async () => {
    if (!newMeasurement.clientId || !newMeasurement.category) {
      alert('Please select a client and category');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newRecord = {
        id: Date.now(),
        clientId: parseInt(newMeasurement.clientId),
        designerId: userInfo?.id || 1,
        category: newMeasurement.category,
        dateRecorded: new Date().toISOString().split('T')[0],
        ...newMeasurement.measurements,
      };

      setMeasurements((prev) => [...prev, newRecord]);
      setNewMeasurement({ clientId: '', category: '', measurements: {} });
      alert('Measurement saved successfully');
    } catch (error) {
      alert(`Error saving measurement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMeasurement = (measurementId) => {
    const measurement = measurements.find((m) => m.id === measurementId);
    if (measurement) {
      setSelectedMeasurement(measurement);
      setShowViewModal(true);
    }
  };

  const handleEditMeasurement = (measurementId) => {
    const measurement = measurements.find((m) => m.id === measurementId);
    if (measurement) {
      setEditingMeasurement({ ...measurement });
      setShowEditModal(true);
    }
  };

  const handleEditFromViewModal = () => {
    if (selectedMeasurement) {
      setEditingMeasurement({ ...selectedMeasurement });
      setShowViewModal(false);
      setShowEditModal(true);
    }
  };

  const handleSaveEditedMeasurement = async () => {
    if (!editingMeasurement) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMeasurements((prev) =>
        prev.map((m) =>
          m.id === editingMeasurement.id ? editingMeasurement : m
        )
      );
      setShowEditModal(false);
      setEditingMeasurement(null);
      alert('Measurement updated successfully');
    } catch (error) {
      alert(`Error updating measurement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    if (!window.confirm('Are you sure you want to delete this measurement?')) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMeasurements((prev) => prev.filter((m) => m.id !== measurementId));
      alert('Measurement deleted successfully');
    } catch (error) {
      alert(`Error deleting measurement: ${error.message}`);
    }
  };

  const handleEditingMeasurementChange = (field, value) => {
    setEditingMeasurement((prev) => ({ ...prev, [field]: value }));
  };

  // Get display fields for a measurement (excluding metadata)
  const getMeasurementDisplayFields = (measurement) => {
    const excludeFields = ['id', 'clientId', 'category', 'designerId', 'dateRecorded'];
    return Object.entries(measurement).filter(
      ([key]) => !excludeFields.includes(key)
    );
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Client Measurements</h1>

      {/* New Measurement Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Record New Measurement</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={newMeasurement.clientId}
              onChange={(e) => handleNewMeasurementChange('clientId', e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled>Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newMeasurement.category}
              onChange={(e) => handleNewMeasurementChange('category', e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled>Select category</option>
              <option value="Kids">Kids</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Dynamic Measurement Fields */}
        {newMeasurement.category && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {measurementFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={newMeasurement.measurements[field.name] || ''}
                  onChange={(e) => handleNewMeasurementChange(field.name, e.target.value)}
                  placeholder={field.label}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSaveMeasurement}
            disabled={isLoading}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Measurement'}
          </button>
        </div>
      </div>

      {/* Saved Measurements */}
      {measurements.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Saved Measurements</h2>

          {/* Filter by Client */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Client
            </label>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="w-full md:w-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="border p-3 text-left text-sm font-medium text-gray-700">Client</th>
                  <th className="border p-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="border p-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeasurements.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="border p-4 text-center text-gray-500">
                      No measurements found
                    </td>
                  </tr>
                ) : (
                  filteredMeasurements.map((measurement) => (
                    <tr key={measurement.id} className="hover:bg-gray-50">
                      <td className="border p-3 text-sm">
                        {formatDate(measurement.dateRecorded)}
                      </td>
                      <td className="border p-3 text-sm">
                        {getClientName(measurement.clientId, clients)}
                      </td>
                      <td className="border p-3 text-sm">{measurement.category}</td>
                      <td className="border p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewMeasurement(measurement.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditMeasurement(measurement.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMeasurement(measurement.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Measurement Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Measurement Details"
      >
        {selectedMeasurement && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="font-medium text-gray-700">Client:</div>
              <div>{getClientName(selectedMeasurement.clientId, clients)}</div>

              <div className="font-medium text-gray-700">Category:</div>
              <div>{selectedMeasurement.category}</div>

              <div className="font-medium text-gray-700">Date Recorded:</div>
              <div>{formatDate(selectedMeasurement.dateRecorded)}</div>
            </div>

            <h4 className="font-semibold mb-2 text-gray-800">Measurements</h4>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg">
              {getMeasurementDisplayFields(selectedMeasurement).map(([key, value]) => (
                <div key={key} className="contents">
                  <div className="font-medium text-gray-700">{formatFieldName(key)}:</div>
                  <div>{value} cm</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
              >
                Close
              </button>
              <button
                onClick={handleEditFromViewModal}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Edit Measurement Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Measurement"
      >
        {editingMeasurement && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  value={editingMeasurement.clientId}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingMeasurement.category}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  <option value="Kids">Kids</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {(MEASUREMENT_FIELDS[editingMeasurement.category] || []).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={editingMeasurement[field.name] || ''}
                    onChange={(e) => handleEditingMeasurementChange(field.name, e.target.value)}
                    placeholder={field.label}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedMeasurement}
                disabled={isLoading}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DesignerMeasurements;