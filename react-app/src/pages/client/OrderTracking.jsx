// src/pages/client/OrderTracking.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo, selectIsAuthenticated } from '@/store/slices/authSlice';

// Video imports - adjust paths as needed
import patternMakingVideo from '@/assets/pattern-making.mp4';
import cuttingVideo from '@/assets/fabric-cutting.mp4';
import sewingVideo from '@/assets/sewing-assembling.mp4';

// Mock API - Replace with actual API calls
const mockAPI = {
  getOrders: async (clientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(`orders_${clientId}`);
        if (saved) {
          resolve(JSON.parse(saved));
        } else {
          resolve([
            {
              id: 1,
              clientId,
              productId: 101,
              designerId: 201,
              status: 'In Progress',
              progress: 'Sewing & Assembly',
              currentStage: 'Sewing Pieces',
              orderDate: '2025-01-10',
              deliveryDate: '2025-02-15',
              totalPrice: 450,
            },
            {
              id: 2,
              clientId,
              productId: 102,
              designerId: 202,
              status: 'In Progress',
              progress: 'Pattern Making',
              currentStage: 'Drafting Patterns',
              orderDate: '2025-01-20',
              deliveryDate: '2025-02-28',
              totalPrice: 650,
            },
          ]);
        }
      }, 300);
    });
  },

  getEnhancedOrder: async (orderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          productDetails: {
            name: 'Custom Kente Suit',
            description: 'Traditional Kente fabric suit with modern cut',
            category: 'Formal Wear',
            price: 450,
          },
          designerDetails: {
            name: 'Kwame Asante',
            specialty: 'Traditional African Attire',
          },
        });
      }, 200);
    });
  },
};

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatCurrency = (amount) => {
  return `₵${parseFloat(amount || 0).toFixed(2)}`;
};

const calculateProgress = (order) => {
  if (!order) return 0;
  const progressStages = [
    'Order Placed',
    'Pattern Making',
    'Fabric Cutting',
    'Sewing & Assembly',
    'Fitting & Adjustments',
    'Final Assembly & Finishing',
    'Packaging & Delivery',
  ];
  const currentIndex = progressStages.indexOf(order.progress);
  if (currentIndex === -1) return 0;
  return Math.round(((currentIndex + 1) / progressStages.length) * 100);
};

// All possible order steps
const ALL_STEPS = [
  {
    id: 1,
    title: 'Order Confirmed',
    description: 'Your custom clothing order has been confirmed',
    stage: 'Order Placed',
    progress: 'Order Placed',
    video: null,
  },
  {
    id: 2,
    title: 'Pattern Making',
    description: 'Creating custom patterns based on your measurements',
    stage: 'Drafting Patterns',
    progress: 'Pattern Making',
    video: patternMakingVideo,
  },
  {
    id: 3,
    title: 'Fabric Cutting',
    description: 'Your fabric is being cut according to measurements',
    stage: 'Cutting Fabric',
    progress: 'Fabric Cutting',
    video: cuttingVideo,
  },
  {
    id: 4,
    title: 'Sewing & Assembly',
    description: 'Your garment is being sewn by our expert tailors',
    stage: 'Sewing Pieces',
    progress: 'Sewing & Assembly',
    video: sewingVideo,
  },
  {
    id: 5,
    title: 'Fitting & Adjustments',
    description: 'Garment ready for final fitting and adjustments',
    stage: 'Final Fitting',
    progress: 'Fitting & Adjustments',
    video: null,
  },
  {
    id: 6,
    title: 'Final Assembly',
    description: 'Final details and finishing touches',
    stage: 'Finishing',
    progress: 'Final Assembly & Finishing',
    video: null,
  },
  {
    id: 7,
    title: 'Ready for Delivery',
    description: 'Your custom garment is ready to be delivered',
    stage: 'Ready for Delivery',
    progress: 'Packaging & Delivery',
    video: null,
  },
];

// Components
const LoadingSpinner = () => (
  <div className="p-6 flex justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="p-6 max-w-md mx-auto">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <svg className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span className="text-red-800">{message}</span>
    </div>
  </div>
);

const StepCircle = ({ step, index, isCompleted, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
      isCompleted ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
    } ${isActive ? 'ring-4 ring-amber-200' : ''}`}
  >
    {isCompleted ? (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <span className="text-sm">{index + 1}</span>
    )}
  </div>
);

// Main Component
const OrderTracking = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // State
  const [order, setOrder] = useState(null);
  const [enhancedOrder, setEnhancedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!userInfo?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch orders
        const orders = await mockAPI.getOrders(userInfo.id);
        const foundOrder = orders.find((o) => o.id.toString() === orderId.toString());

        if (!foundOrder) {
          setError('Order not found');
          setIsLoading(false);
          return;
        }

        setOrder(foundOrder);

        // Fetch enhanced order details
        const enhanced = await mockAPI.getEnhancedOrder(orderId);
        setEnhancedOrder(enhanced);

        // Check access
        const hasAccess = orders.some((o) => o.id.toString() === orderId.toString());
        if (!hasAccess && !isAuthenticated) {
          setError("You don't have permission to view this order");
          navigate('/client/orders');
        }
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, userInfo?.id, isAuthenticated, navigate]);

  // Computed values
  const progressPercentage = useMemo(() => {
    return calculateProgress(order);
  }, [order]);

  const orderSteps = useMemo(() => {
    if (!order) return [];

    const currentProgressIndex = ALL_STEPS.findIndex(
      (step) => step.progress === order.progress
    );

    return ALL_STEPS.map((step, index) => ({
      ...step,
      completed: index <= currentProgressIndex,
      active: index === activeStepIndex,
      time: index <= currentProgressIndex ? '12:00' : '',
      date: index <= currentProgressIndex
        ? new Date(new Date(order.orderDate).getTime() + index * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        : '',
    }));
  }, [order, activeStepIndex]);

  const currentStep = useMemo(() => {
    if (!orderSteps.length) return null;
    return orderSteps[activeStepIndex] || orderSteps[0];
  }, [orderSteps, activeStepIndex]);

  // Set initial active step based on order progress
  useEffect(() => {
    if (order && activeStepIndex === 0) {
      const currentProgressIndex = ALL_STEPS.findIndex(
        (step) => step.progress === order.progress
      );
      if (currentProgressIndex >= 0) {
        setActiveStepIndex(currentProgressIndex);
      }
    }
  }, [order, activeStepIndex]);

  const deliveryTime = '18:00';

  const goBack = () => navigate('/client/orders');

  // Render
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header onBack={goBack} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header onBack={goBack} />
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header onBack={goBack} />
        <ErrorAlert message="Order not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <Header onBack={goBack} />

      {/* Main Content */}
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Order Summary */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-1">
            Track your custom order
          </h1>
          <p className="text-gray-600">Order #ORD{order.id}</p>
        </div>

        {/* Delivery Time Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <div className="text-3xl sm:text-4xl font-bold">{deliveryTime}</div>
              <div className="text-gray-500 text-sm mt-1">
                Estimated time of completion
              </div>
              <div className="font-medium text-gray-700 mt-2">
                {formatDate(order.deliveryDate)}
              </div>
            </div>
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium self-start">
              {progressPercentage}% Complete
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Order Progress</h2>

          {/* Desktop Horizontal Timeline */}
          <div className="hidden md:block relative mb-8">
            {/* Horizontal Line */}
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200" />

            {/* Steps */}
            <div className="flex justify-between relative">
              {orderSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10"
                >
                  <StepCircle
                    step={step}
                    index={index}
                    isCompleted={step.completed}
                    isActive={step.active}
                    onClick={() => setActiveStepIndex(index)}
                  />
                  <div className="w-20 lg:w-24 text-center mt-2">
                    <h3
                      className={`font-medium text-xs lg:text-sm ${
                        step.completed
                          ? step.active
                            ? 'text-amber-600'
                            : 'text-black'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {step.date && (
                      <p className="text-gray-400 text-xs mt-1 hidden lg:block">
                        {formatDate(step.date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="md:hidden relative">
            {/* Vertical Line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200" />

            {/* Steps */}
            {orderSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex mb-6 last:mb-0 relative z-10"
                onClick={() => setActiveStepIndex(index)}
              >
                <div className="mr-4 flex-shrink-0">
                  <StepCircle
                    step={step}
                    index={index}
                    isCompleted={step.completed}
                    isActive={step.active}
                    onClick={() => setActiveStepIndex(index)}
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className={`font-medium ${
                        step.completed
                          ? step.active
                            ? 'text-amber-600'
                            : 'text-black'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {step.time && (
                      <span className="text-gray-500 text-sm flex-shrink-0">
                        {step.time}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{step.description}</p>
                  {step.date && (
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(step.date)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video/Image Preview Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Your Garment Progress</h2>

          {currentStep && (
            <div>
              <div className="overflow-hidden rounded-lg mb-4 bg-gray-100">
                {currentStep.video ? (
                  <video
                    key={currentStep.video}
                    controls
                    className="w-full h-48 sm:h-64 md:h-96 object-contain bg-black"
                  >
                    <source src={currentStep.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : currentStep.image ? (
                  <img
                    src={currentStep.image}
                    alt={currentStep.title}
                    className="w-full h-48 sm:h-64 md:h-96 object-contain"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-96 flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">No media available at this stage</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="font-medium text-center text-purple-900 text-sm sm:text-base">
                {currentStep.title}: {currentStep.description}
              </p>
            </div>
          )}
        </div>

        {/* Order Details Accordion */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">View Order Details</span>
            <svg
              className={`h-5 w-5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {detailsOpen && (
            <div className="p-4 border-t border-gray-200 space-y-3">
              <DetailRow label="Order ID" value={`ORD${order.id}`} />
              <DetailRow label="Order Date" value={formatDate(order.orderDate)} />
              <DetailRow
                label="Status"
                value={order.status}
                valueClass={
                  order.status === 'In Progress'
                    ? 'text-yellow-600'
                    : order.status === 'Completed'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }
              />
              <DetailRow label="Current Stage" value={order.currentStage} />
              <DetailRow label="Estimated Completion" value={formatDate(order.deliveryDate)} />
              <DetailRow label="Total" value={formatCurrency(order.totalPrice)} valueClass="font-bold" />

              {/* Product Details */}
              {enhancedOrder?.productDetails && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-3">Product Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium">{enhancedOrder.productDetails.name}</div>
                    {enhancedOrder.productDetails.description && (
                      <div className="text-sm text-gray-600 mt-1">
                        {enhancedOrder.productDetails.description}
                      </div>
                    )}
                    {enhancedOrder.productDetails.category && (
                      <div className="text-sm text-gray-600">
                        Category: {enhancedOrder.productDetails.category}
                      </div>
                    )}
                    <div className="text-sm font-medium mt-2">
                      {formatCurrency(enhancedOrder.productDetails.price)}
                    </div>
                  </div>
                </div>
              )}

              {/* Designer Details */}
              {enhancedOrder?.designerDetails && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-3">Your Designer</h4>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {enhancedOrder.designerDetails.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <div className="font-medium">
                        {enhancedOrder.designerDetails.name || 'Designer'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {enhancedOrder.designerDetails.specialty || 'Custom Tailor'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Button */}
        <button className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 active:bg-amber-700 transition-colors">
          Contact Your Tailor
        </button>
      </div>
    </div>
  );
};

// Sub-components
const Header = ({ onBack }) => (
  <div className="bg-amber-500 text-white p-4 flex items-center sticky top-0 z-40">
    <button
      onClick={onBack}
      className="mr-3 p-1 hover:bg-amber-600 rounded-full transition-colors"
      aria-label="Go back"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </button>
    <div className="text-lg sm:text-xl font-medium">Order Tracking</div>
  </div>
);

const DetailRow = ({ label, value, valueClass = '' }) => (
  <div className="flex justify-between items-center text-sm sm:text-base">
    <span className="text-gray-600">{label}:</span>
    <span className={valueClass}>{value}</span>
  </div>
);

export default OrderTracking;