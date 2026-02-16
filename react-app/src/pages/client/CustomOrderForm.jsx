// src/pages/client/CustomOrderForm.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserInfo } from '@/store/slices/authSlice';

// Mock API - Replace with actual API calls later
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
              category: 'Male',
              dateRecorded: '2025-01-15',
              chest: 40,
              waist: 32,
              hip: 38,
              shoulder: 18,
              sleeveLength: 25,
              neckCircumference: 15,
              inseam: 32,
              outseam: 42,
            },
            {
              id: 2,
              clientId,
              category: 'Casual',
              dateRecorded: '2025-02-20',
              chest: 41,
              waist: 33,
              hip: 39,
              shoulder: 18.5,
              sleeveLength: 25.5,
            },
          ]);
        }
      }, 300);
    });
  },

  submitCustomOrder: async (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Custom order submitted:', orderData);
        resolve({ success: true, orderId: Date.now() });
      }, 500);
    });
  },
};

// Helper Functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

// Measurement Modal Component
const MeasurementModal = ({ isOpen, onClose, measurement }) => {
  if (!isOpen || !measurement) return null;

  const excludedFields = ['id', 'clientId', 'category', 'designerId', 'dateRecorded'];
  const measurementFields = Object.entries(measurement).filter(
    ([key]) => !excludedFields.includes(key)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-purple-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold">Measurement Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-800 rounded-full transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="font-semibold text-purple-900">{measurement.category}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Date Recorded</p>
              <p className="font-semibold text-purple-900 text-sm">{formatDate(measurement.dateRecorded)}</p>
            </div>
          </div>

          {/* Measurements */}
          <h4 className="font-semibold text-gray-700 mb-3">Measurements</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {measurementFields.map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{formatFieldName(key)}</p>
                <p className="font-semibold text-gray-800">{value} cm</p>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CustomOrderForm = () => {
  const userInfo = useSelector(selectUserInfo);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    referenceImage: null,
    imagePreview: null,
    selectedMeasurementId: null,
  });

  // Fetch measurements
  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!userInfo?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await mockAPI.getMeasurements(userInfo.id);
        setMeasurements(data);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeasurements();
  }, [userInfo?.id]);

  // Get selected measurement
  const selectedMeasurement = useMemo(() => {
    if (!formData.selectedMeasurementId) return null;
    return measurements.find((m) => m.id === parseInt(formData.selectedMeasurementId));
  }, [measurements, formData.selectedMeasurementId]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMeasurementChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      selectedMeasurementId: e.target.value || null,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        referenceImage: file,
        imagePreview: reader.result,
      }));
      setErrors((prev) => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      referenceImage: null,
      imagePreview: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Outfit name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        ...formData,
        clientId: userInfo?.id,
        measurementData: selectedMeasurement,
        submittedAt: new Date().toISOString(),
      };

      await mockAPI.submitCustomOrder(orderData);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        name: '',
        description: '',
        budget: '',
        referenceImage: null,
        imagePreview: null,
        selectedMeasurementId: null,
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 text-sm sm:text-base">
              Your custom order has been submitted successfully!
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              🎨 Request a Custom Design
            </h1>
            <p className="text-purple-100 text-sm sm:text-base">
              Describe your dream outfit, and our designers will bring it to life.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Error Message */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Outfit Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Outfit Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Traditional Wedding Kente"
                className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your outfit in detail - colors, style, fabric preferences, occasion..."
                rows={4}
                className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Budget (₵) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₵</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter your budget"
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                    errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
            </div>

            {/* Measurements Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Your Measurements
              </label>

              {measurements.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={formData.selectedMeasurementId || ''}
                    onChange={handleMeasurementChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">No measurements selected</option>
                    {measurements.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.category} - {formatDate(m.dateRecorded)}
                      </option>
                    ))}
                  </select>

                  {selectedMeasurement && (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center text-purple-900 text-sm font-medium hover:underline"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Measurement Details
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-800 text-sm">
                      You don't have any saved measurements.{' '}
                      <Link to="/client/measurements" className="font-medium underline hover:no-underline">
                        Add measurements
                      </Link>{' '}
                      first for a better fit.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reference Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reference Image (optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">Upload an image for inspiration. Max: 5MB</p>

              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imagePreview}
                    alt="Reference preview"
                    className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-3 sm:py-3.5 text-white font-medium rounded-lg transition-colors text-sm sm:text-base ${
                isSubmitting
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-900 hover:bg-purple-800 active:bg-purple-950'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Submit Custom Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Measurement Modal */}
      <MeasurementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        measurement={selectedMeasurement}
      />
    </div>
  );
};

export default CustomOrderForm;