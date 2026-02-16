// src/pages/designer/DesignerOrders.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo, selectIsAuthenticated } from '@/store/slices/authSlice';

// Mock API
const mockAPI = {
  getDesignerOrders: async (designerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, clientId: 101, productId: 1, productName: 'Traditional Kente Cloth', productImage: '/images/kente-1.jpg', orderType: 'marketplace', orderDate: '2025-01-15', status: 'Completed', totalPrice: 450, quantity: 1 },
          { id: 2, clientId: 102, productId: 2, productName: 'Modern African Dress', productImage: '/images/dress-1.jpg', orderType: 'custom', orderDate: '2025-01-20', status: 'In Progress', totalPrice: 320, quantity: 1 },
          { id: 3, clientId: 103, productId: 1, productName: 'Traditional Kente Cloth', productImage: '/images/kente-1.jpg', orderType: 'marketplace', orderDate: '2025-01-25', status: 'Pending', totalPrice: 450, quantity: 2 },
          { id: 4, clientId: 101, productId: 3, productName: 'Ankara Shirt', productImage: '/images/shirt-1.jpg', orderType: 'marketplace', orderDate: '2025-02-01', status: 'Completed', totalPrice: 280, quantity: 1 },
          { id: 5, clientId: 104, productId: 2, productName: 'Custom Wedding Outfit', productImage: '/images/wedding-1.jpg', orderType: 'custom', orderDate: '2025-02-05', status: 'In Progress', totalPrice: 850, quantity: 1 },
          { id: 6, clientId: 105, productId: 4, productName: 'Casual African Print', productImage: '/images/casual-1.jpg', orderType: 'marketplace', orderDate: '2025-02-08', status: 'Pending', totalPrice: 180, quantity: 3 },
          { id: 7, clientId: 102, productId: 5, productName: 'Formal Agbada', productImage: '/images/agbada-1.jpg', orderType: 'custom', orderDate: '2025-02-10', status: 'Canceled', totalPrice: 650, quantity: 1 },
        ]);
      }, 300);
    });
  },

  getClientName: (clientId) => {
    const clients = {
      101: 'Jane Cooper',
      102: 'Alex Morgan',
      103: 'Sarah Johnson',
      104: 'Michael Brown',
      105: 'Emily Davis',
    };
    return clients[clientId] || `Client #${clientId}`;
  },

  updateOrder: async (orderId, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Order updated:', orderId, updates);
        resolve({ success: true });
      }, 300);
    });
  },
};

// Default timeline
const DEFAULT_TIMELINE = [
  { title: 'Order confirmed', completed: true, date: null, description: 'Your custom clothing order has been confirmed' },
  { title: 'Pattern Making', completed: false, date: null, description: 'Creating custom patterns based on your measurements' },
  { title: 'Fabric Cutting', completed: false, date: null, description: 'Your fabric is being cut according to measurements' },
  { title: 'Sewing & Assembly', completed: false, date: null, description: 'Your garment is being sewn by our expert tailors' },
  { title: 'Fitting & Adjustments', completed: false, date: null, description: 'Garment ready for final fitting and adjustments' },
  { title: 'Final Assembly & Finishing', completed: false, date: null, description: 'Final details and finishing touches' },
  { title: 'Packaging & Delivery', completed: false, date: null, description: 'Your custom garment is ready to be delivered' },
];

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (value) => {
  return Number(value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Canceled: 'bg-red-100 text-red-800',
    'Order confirmed': 'bg-blue-100 text-blue-800',
    'Pattern Making': 'bg-purple-100 text-purple-800',
    'Fabric Cutting': 'bg-indigo-100 text-indigo-800',
    'Sewing & Assembly': 'bg-teal-100 text-teal-800',
    'Fitting & Adjustments': 'bg-amber-100 text-amber-800',
    'Final Assembly & Finishing': 'bg-lime-100 text-lime-800',
    'Packaging & Delivery': 'bg-green-100 text-green-800',
  };
  return `${classes[status] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs font-medium`;
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
        <h3 className="text-xl sm:text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`${bgColor} p-2 sm:p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);

// Timeline Component
const OrderTimeline = ({ timeline }) => {
  const steps = timeline || DEFAULT_TIMELINE;

  return (
    <div>
      {/* Desktop Timeline */}
      <div className="hidden md:block relative mb-8">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200" />
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.completed ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.completed ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <div className="w-20 text-center">
                <h3 className={`font-medium text-xs ${step.completed ? 'text-black' : 'text-gray-500'}`}>
                  {step.title}
                </h3>
                {step.date && (
                  <p className="text-gray-400 text-xs mt-1">{formatDate(step.date)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden relative">
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200" />
        {steps.map((step, index) => (
          <div key={index} className="flex mb-6 relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                step.completed ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step.completed ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            <div className="flex-grow">
              <h3 className={`font-medium ${step.completed ? 'text-black' : 'text-gray-500'}`}>
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{step.description}</p>
              {step.date && (
                <p className="text-gray-400 text-xs mt-1">{formatDate(step.date)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const DesignerOrders = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    timeRange: 'all',
    orderType: '',
  });

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const itemsPerPage = 10;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const data = await mockAPI.getDesignerOrders(userInfo?.id);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, userInfo?.id]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Order statistics
  const orderStats = useMemo(() => {
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'Pending' || o.status === 'In Progress').length,
      completedOrders: orders.filter((o) => o.status === 'Completed').length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((order) =>
        order.id.toString().includes(filters.search) ||
        mockAPI.getClientName(order.clientId).toLowerCase().includes(searchLower) ||
        (order.productName && order.productName.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter((order) => order.status === filters.status);
    }

    // Order type filter
    if (filters.orderType) {
      result = result.filter((order) => order.orderType === filters.orderType);
    }

    // Time range filter
    if (filters.timeRange !== 'all') {
      const today = new Date();
      const startDate = new Date();

      switch (filters.timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(today.getMonth() - 3);
          break;
        default:
          break;
      }

      result = result.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= today;
      });
    }

    // Sort by newest first
    return result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orders, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginationStart = filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const paginationEnd = Math.min(currentPage * itemsPerPage, filteredOrders.length);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const canUpdateStatus = (order) => {
    return order.status !== 'Completed' && order.status !== 'Canceled';
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setStatusNotes('');
    setShowStatusModal(true);
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const openMessageModal = (order) => {
    setSelectedOrder(order);
    setMessageSubject(`Update on your order #${order.id}`);
    setMessageContent('');
    setShowMessageModal(true);
  };

  const updateOrderStatus = async () => {
    if (!newStatus) return;

    try {
      await mockAPI.updateOrder(selectedOrder.id, { status: newStatus, notes: statusNotes });

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );

      setShowStatusModal(false);
      setShowOrderModal(false);
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const cancelOrder = async () => {
    if (!cancelReason) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      await mockAPI.updateOrder(selectedOrder.id, {
        status: 'Canceled',
        cancellationReason: cancelReason,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 'Canceled' } : o))
      );

      setShowCancelModal(false);
      setShowOrderModal(false);
      alert('Order has been canceled');
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order');
    }
  };

  const sendClientMessage = async () => {
    if (!messageSubject || !messageContent) {
      alert('Please fill out both subject and message content');
      return;
    }

    try {
      console.log('Sending message:', { subject: messageSubject, content: messageContent });
      setShowMessageModal(false);
      alert('Message sent to client');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const exportOrdersToCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders to export');
      return;
    }

    const headers = ['Order ID', 'Client', 'Product', 'Type', 'Date', 'Status', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map((order) =>
        [
          order.id,
          `"${mockAPI.getClientName(order.clientId)}"`,
          `"${order.productName || 'Custom Order'}"`,
          order.orderType === 'marketplace' ? 'Marketplace' : 'Custom',
          formatDate(order.orderDate),
          order.status,
          formatCurrency(order.totalPrice),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Orders Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage all your customer orders</p>
          </div>
          <button
            onClick={exportOrdersToCSV}
            className="px-4 py-2 border border-purple-900 text-purple-900 rounded-lg hover:bg-purple-50 font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Orders
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>

          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>

          <select
            value={filters.orderType}
            onChange={(e) => handleFilterChange('orderType', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Order Types</option>
            <option value="marketplace">Marketplace</option>
            <option value="custom">Custom Order</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          title="Total Orders"
          value={orderStats.totalOrders}
          bgColor="bg-indigo-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatCard
          title="Pending"
          value={orderStats.pendingOrders}
          bgColor="bg-yellow-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Completed"
          value={orderStats.completedOrders}
          bgColor="bg-green-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Revenue"
          value={`₵${formatCurrency(orderStats.totalRevenue)}`}
          bgColor="bg-purple-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Product</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Type</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-4 sm:px-6 py-4">{mockAPI.getClientName(order.clientId)}</td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <span className="truncate max-w-[150px] block">{order.productName || 'Custom Order'}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${order.orderType === 'marketplace' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {order.orderType === 'marketplace' ? 'Marketplace' : 'Custom'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">{formatDate(order.orderDate)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={getStatusClass(order.status)}>{order.status}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">₵{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {canUpdateStatus(order) && (
                          <button
                            onClick={() => openStatusModal(order)}
                            className="text-purple-600 hover:text-purple-800 p-1"
                            title="Update Status"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {canUpdateStatus(order) && (
                          <button
                            onClick={() => openCancelModal(order)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Cancel Order"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{paginationStart}</span> to{' '}
            <span className="font-medium">{paginationEnd}</span> of{' '}
            <span className="font-medium">{filteredOrders.length}</span> orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Order #${selectedOrder?.id} Details`}
        size="xl"
      >
        {selectedOrder && (
          <div className="p-6">
            {/* Order & Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={getStatusClass(selectedOrder.status)}>{selectedOrder.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDate(selectedOrder.orderDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Type:</span>
                    <span>{selectedOrder.orderType === 'marketplace' ? 'Marketplace' : 'Custom'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">₵{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Client Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{mockAPI.getClientName(selectedOrder.clientId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedOrder.clientEmail || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedOrder.clientPhone || 'Not available'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <img
                    src={selectedOrder.productImage || '/images/placeholder.jpg'}
                    alt={selectedOrder.productName}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                  <div>
                    <h4 className="font-medium">{selectedOrder.productName || 'Custom Design Order'}</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedOrder.productDescription || 'Custom design based on client specifications'}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span><span className="text-gray-500">Quantity:</span> {selectedOrder.quantity || 1}</span>
                      <span><span className="text-gray-500">Price:</span> ₵{formatCurrency(selectedOrder.totalPrice / (selectedOrder.quantity || 1))} each</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
              <OrderTimeline timeline={selectedOrder.timeline} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t">
              {canUpdateStatus(selectedOrder) && (
                <button
                  onClick={() => openStatusModal(selectedOrder)}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium transition-colors"
                >
                  Update Status
                </button>
              )}
              <button
                onClick={() => openMessageModal(selectedOrder)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Message Client
              </button>
              {canUpdateStatus(selectedOrder) && (
                <button
                  onClick={() => openCancelModal(selectedOrder)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel Order
                </button>
              )}
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
        size="md"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Status</label>
            <span className={getStatusClass(selectedOrder?.status)}>{selectedOrder?.status}</span>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select new status</option>
              <option value="Order confirmed">Order confirmed</option>
              <option value="Pattern Making">Pattern Making</option>
              <option value="Fabric Cutting">Fabric Cutting</option>
              <option value="Sewing & Assembly">Sewing & Assembly</option>
              <option value="Fitting & Adjustments">Fitting & Adjustments</option>
              <option value="Final Assembly & Finishing">Final Assembly & Finishing</option>
              <option value="Packaging & Delivery">Packaging & Delivery</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status Notes (Optional)</label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="Add any notes about this status change..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={updateOrderStatus}
              disabled={!newStatus}
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        size="md"
      >
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700">Are you sure you want to cancel order #{selectedOrder?.id}?</p>
            <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reason for Cancellation</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              No, Keep Order
            </button>
            <button
              onClick={cancelOrder}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium"
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </Modal>

      {/* Message Client Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Message Client"
        size="md"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">To</label>
            <div className="px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
              {mockAPI.getClientName(selectedOrder?.clientId)}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="Enter message subject..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowMessageModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={sendClientMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
            >
              Send Message
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DesignerOrders;