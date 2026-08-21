// src/pages/designer/ManageDesigns.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '@/store/slices/authSlice';

// Mock data
const mockDesigns = [
  {
    id: 1,
    name: 'Traditional Kente Cloth',
    description: 'Authentic handwoven Kente cloth with traditional patterns',
    price: 450,
    category: 'formal',
    tags: ['traditional', 'kente', 'handwoven'],
    status: 'Live',
    stockQuantity: 15,
    views: 245,
    orders: 12,
    image: '/images/kente-1.jpg',
    images: ['/images/kente-1.jpg', '/images/kente-2.jpg'],
    createdAt: '2025-01-15',
  },
  {
    id: 2,
    name: 'Modern African Dress',
    description: 'Contemporary African dress with vibrant Ankara prints',
    price: 320,
    category: 'casual',
    tags: ['modern', 'ankara', 'dress'],
    status: 'Live',
    stockQuantity: 8,
    views: 189,
    orders: 8,
    image: '/images/dress-1.jpg',
    images: ['/images/dress-1.jpg'],
    createdAt: '2025-01-20',
  },
  {
    id: 3,
    name: 'Ankara Shirt',
    description: 'Stylish Ankara print shirt for casual occasions',
    price: 280,
    category: 'casual',
    tags: ['ankara', 'shirt', 'casual'],
    status: 'Draft',
    stockQuantity: 20,
    views: 156,
    orders: 5,
    image: '/images/shirt-1.jpg',
    images: ['/images/shirt-1.jpg'],
    createdAt: '2025-02-01',
  },
  {
    id: 4,
    name: 'Summer Kaftan',
    description: 'Light and breezy kaftan perfect for summer',
    price: 180,
    category: 'summer',
    tags: ['kaftan', 'summer', 'light'],
    status: 'Live',
    stockQuantity: 0,
    views: 98,
    orders: 3,
    image: '/images/kaftan-1.jpg',
    images: ['/images/kaftan-1.jpg'],
    createdAt: '2025-02-10',
  },
  {
    id: 5,
    name: 'Evening Gown',
    description: 'Elegant evening gown with intricate beadwork',
    price: 650,
    category: 'formal',
    tags: ['evening', 'gown', 'beadwork'],
    status: 'Pending',
    stockQuantity: 5,
    views: 312,
    orders: 7,
    image: '/images/gown-1.jpg',
    images: ['/images/gown-1.jpg'],
    createdAt: '2025-02-15',
  },
  {
    id: 6,
    name: 'Winter Coat Collection',
    description: 'Warm winter coat with African-inspired patterns',
    price: 520,
    category: 'winter',
    tags: ['winter', 'coat', 'warm'],
    status: 'Draft',
    stockQuantity: 12,
    views: 67,
    orders: 0,
    image: '/images/coat-1.jpg',
    images: ['/images/coat-1.jpg'],
    createdAt: '2025-02-20',
  },
];

const mockOrders = [
  { id: 1, designerId: 1, totalPrice: 450 },
  { id: 2, designerId: 1, totalPrice: 320 },
  { id: 3, designerId: 1, totalPrice: 280 },
  { id: 4, designerId: 1, totalPrice: 650 },
];

// Category and status options
const CATEGORY_OPTIONS = [
  { value: 'formal', label: 'Formal Wear' },
  { value: 'casual', label: 'Casual Wear' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'summer', label: 'Summer Collection' },
  { value: 'winter', label: 'Winter Collection' },
  { value: 'accessories', label: 'Accessories' },
];

const STATUS_OPTIONS = [
  { value: 'Live', label: 'Active' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Pending', label: 'Pending Review' },
  { value: 'Out of Stock', label: 'Out of Stock' },
];

const SALES_CHART_DATA = [
  { month: 'Jan', sales: 12 },
  { month: 'Feb', sales: 19 },
  { month: 'Mar', sales: 15 },
  { month: 'Apr', sales: 22 },
  { month: 'May', sales: 28 },
  { month: 'Jun', sales: 24 },
];

// Helper functions
const getStatusClass = (status) => {
  const classes = {
    Live: 'bg-green-500',
    Draft: 'bg-gray-500',
    Pending: 'bg-yellow-500',
    'Out of Stock': 'bg-red-500',
  };
  return classes[status] || 'bg-blue-500';
};

const getCategoryLabel = (categoryValue) => {
  const category = CATEGORY_OPTIONS.find((opt) => opt.value === categoryValue);
  return category ? category.label : categoryValue;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-3xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-bold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
              ×
            </button>
          </div>
        )}
        <div className={title ? '' : 'relative'}>
          {!title && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100"
            >
              ×
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, growth, icon, iconBgColor, iconColor }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <p className="flex items-center text-green-500 text-sm mt-1">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {growth}
        </p>
      </div>
      <div className={`${iconBgColor} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);

// Design Card Component
const DesignCard = ({ design, onEdit, onToggleStatus, onDelete, onPreview }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative">
        <img
          src={design.image || '/api/placeholder/400/300'}
          alt={design.name}
          className="w-full h-48 object-cover object-center"
          onError={(e) => { e.target.src = '/api/placeholder/400/300'; }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(design.status)}`}>
          {design.status}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{design.name}</h3>
          <span className="font-semibold">₵{design.price.toFixed(2)}</span>
        </div>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{design.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {design.tags?.map((tag) => (
            <span key={tag} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center text-sm mb-4 gap-4">
          <span className="flex items-center text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {design.views || 0} views
          </span>
          <span className="flex items-center text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {design.orders || 0} orders
          </span>
          <span className="flex items-center text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {design.stockQuantity || 0} in stock
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(design)}
            className="btn btn-sm flex-1 bg-purple-900 hover:bg-purple-800 text-white px-3 py-1.5 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onToggleStatus(design)}
            className={`btn btn-sm flex-1 px-3 py-1.5 rounded text-sm ${
              design.status === 'Live'
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {design.status === 'Live' ? 'Deactivate' : 'Activate'}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn btn-sm btn-ghost p-2 hover:bg-gray-100 rounded"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => { onPreview(design); setShowDropdown(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Share
                </button>
                <button
                  onClick={() => { onDelete(design); setShowDropdown(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ManageDesigns = () => {
  const userInfo = useSelector(selectUserInfo);

  // State
  const [designs, setDesigns] = useState(mockDesigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [chartPeriod, setChartPeriod] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Current design being edited/viewed
  const [currentDesign, setCurrentDesign] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [designToDelete, setDesignToDelete] = useState(null);
  const [previewDesign, setPreviewDesign] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Batch selection
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  // Form state
  const [designForm, setDesignForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: [],
    status: 'Live',
    stockQuantity: 0,
    images: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Computed values
  const filteredDesigns = useMemo(() => {
    let results = [...designs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (design) =>
          design.name.toLowerCase().includes(query) ||
          design.description.toLowerCase().includes(query) ||
          design.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter((design) => design.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      results = results.filter((design) => design.status === selectedStatus);
    }

    // Price range filter
    if (priceRange.min) {
      results = results.filter((design) => design.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      results = results.filter((design) => design.price <= Number(priceRange.max));
    }

    // Sorting
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.orders || 0) - (a.orders || 0);
        case 'highest':
          return b.price - a.price;
        case 'lowest':
          return a.price - b.price;
        default:
          return 0;
      }
    });
  }, [designs, searchQuery, selectedCategory, selectedStatus, sortBy, priceRange]);

  const paginatedDesigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDesigns.slice(start, start + itemsPerPage);
  }, [filteredDesigns, currentPage]);

  const totalPages = Math.ceil(filteredDesigns.length / itemsPerPage);

  // Stats
  const totalDesigns = designs.length;
  const activeDesigns = designs.filter((d) => d.status === 'Live').length;
  const pendingDesigns = designs.filter((d) => d.status === 'Pending').length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const topSellingDesigns = [...designs].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 4);

  // Form handlers
  const resetForm = () => {
    setDesignForm({
      name: '',
      description: '',
      price: '',
      category: '',
      tags: [],
      status: 'Live',
      stockQuantity: 0,
      images: [],
    });
    setCurrentDesign(null);
    setTagInput('');
  };

  const openAddDesignModal = () => {
    resetForm();
    setIsEditing(false);
    setShowAddEditModal(true);
  };

  const openEditDesignModal = (design) => {
    setIsEditing(true);
    setCurrentDesign(design);
    setDesignForm({
      name: design.name,
      description: design.description,
      price: design.price,
      category: design.category,
      tags: design.tags || [],
      status: design.status || 'Live',
      stockQuantity: design.stockQuantity || 0,
      images: design.images || [],
    });
    setShowAddEditModal(true);
  };

  const handleFormChange = (field, value) => {
    setDesignForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!designForm.tags.includes(tagInput.trim())) {
        setDesignForm((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setDesignForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - designForm.images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.includes('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setDesignForm((prev) => ({
          ...prev,
          images: [...prev.images, event.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setDesignForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const saveDesign = (e) => {
    e.preventDefault();

    if (!designForm.name || !designForm.price || !designForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    const designData = {
      name: designForm.name,
      description: designForm.description,
      price: parseFloat(designForm.price),
      category: designForm.category,
      tags: designForm.tags,
      status: designForm.status,
      stockQuantity: parseInt(designForm.stockQuantity) || 0,
      images: designForm.images,
      image: designForm.images[0] || null,
    };

    if (isEditing && currentDesign) {
      setDesigns((prev) =>
        prev.map((d) => (d.id === currentDesign.id ? { ...d, ...designData } : d))
      );
    } else {
      const newDesign = {
        ...designData,
        id: Date.now(),
        views: 0,
        orders: 0,
        createdAt: new Date().toISOString(),
      };
      setDesigns((prev) => [newDesign, ...prev]);
    }

    setShowAddEditModal(false);
    resetForm();
  };

  const toggleStatus = (design) => {
    const newStatus = design.status === 'Live' ? 'Draft' : 'Live';
    setDesigns((prev) =>
      prev.map((d) => (d.id === design.id ? { ...d, status: newStatus } : d))
    );
  };

  const openDeleteModal = (design) => {
    setDesignToDelete(design);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (designToDelete) {
      setDesigns((prev) => prev.filter((d) => d.id !== designToDelete.id));
      setShowDeleteModal(false);
      setDesignToDelete(null);
    }
  };

  const openPreviewModal = (design) => {
    setPreviewDesign(design);
    setSelectedImageIndex(0);
    setShowPreviewModal(true);
  };

  // Batch actions
  const handleBatchAction = (action) => {
    if (selectedDesigns.length === 0) return;

    switch (action) {
      case 'activate':
        setDesigns((prev) =>
          prev.map((d) =>
            selectedDesigns.includes(d.id) ? { ...d, status: 'Live' } : d
          )
        );
        break;
      case 'deactivate':
        setDesigns((prev) =>
          prev.map((d) =>
            selectedDesigns.includes(d.id) ? { ...d, status: 'Draft' } : d
          )
        );
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedDesigns.length} designs?`)) {
          setDesigns((prev) => prev.filter((d) => !selectedDesigns.includes(d.id)));
        }
        break;
    }

    setSelectedDesigns([]);
    setShowActionsDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-900">Design Management</h1>
            <p className="text-gray-600">Manage your fashion designs and marketplace listings</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs..."
                className="pl-4 pr-10 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-sm">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'grid' ? 'bg-purple-900 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-sm">Grid</span>
              </button>
            </div>

            {/* Add New Design */}
            <button
              onClick={openAddDesignModal}
              className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Design</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Designs"
            value={totalDesigns}
            growth="12% this month"
            iconBgColor="bg-purple-100"
            icon={
              <svg className="h-6 w-6 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            title="Active Designs"
            value={activeDesigns}
            growth="8% this week"
            iconBgColor="bg-green-100"
            icon={
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Pending Approval"
            value={pendingDesigns}
            growth="Awaiting review"
            iconBgColor="bg-yellow-100"
            icon={
              <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Earnings"
            value={`₵${totalRevenue.toFixed(2)}`}
            growth="8% this month"
            iconBgColor="bg-purple-100"
            icon={
              <svg className="h-6 w-6 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Sales Analytics Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Sales Over Time</h3>
                <div className="flex gap-1">
                  {['week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-2 py-1 text-xs rounded ${
                        chartPeriod === period
                          ? 'bg-purple-900 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {SALES_CHART_DATA.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-purple-600 rounded-t"
                      style={{ height: `${item.sales * 8}px` }}
                    />
                    <span className="text-xs mt-1 text-gray-600">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div>
              <h3 className="font-medium mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                {topSellingDesigns.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="font-bold text-gray-500 w-6">{index + 1}</span>
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={product.image || '/api/placeholder/48/48'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/api/placeholder/48/48'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">{getCategoryLabel(product.category)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₵{product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{product.orders || 0} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-500 block mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-500 block mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-500 block mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="highest">Highest Price</option>
                <option value="lowest">Lowest Price</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-500 block mb-1">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                  placeholder="Min"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                  placeholder="Max"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Design Grid */}
        {paginatedDesigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onEdit={openEditDesignModal}
                onToggleStatus={toggleStatus}
                onDelete={openDeleteModal}
                onPreview={openPreviewModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
            <svg
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No designs found</h3>
            <p className="text-gray-500 mb-4">
              You don't have any designs matching your filters.
            </p>
            <button
              onClick={openAddDesignModal}
              className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 inline-flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Design
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-purple-900 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && <span>...</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-purple-900 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Floating Actions Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <div className="relative">
          <button
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 shadow-lg flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Actions
          </button>
          {showActionsDropdown && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg py-1">
              <button
                onClick={() => { openAddDesignModal(); setShowActionsDropdown(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Add New Design
              </button>
              <button
                onClick={() => handleBatchAction('activate')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBatchAction('deactivate')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Deactivate Selected
              </button>
              <button
                onClick={() => handleBatchAction('delete')}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Selected
              </button>
              <button
                onClick={() => { alert('Export functionality would go here'); setShowActionsDropdown(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Design Modal */}
      <Modal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={isEditing ? 'Edit Design' : 'Add New Design'}
      >
        <form onSubmit={saveDesign} className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Design Name*
              </label>
              <input
                type="text"
                value={designForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter design name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-lg text-gray-600">
                  ₵
                </span>
                <input
                  type="number"
                  value={designForm.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                value={designForm.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="" disabled>Select category</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={designForm.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={designForm.stockQuantity}
                onChange={(e) => handleFormChange('stockQuantity', e.target.value)}
                placeholder="Enter stock quantity"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={designForm.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Enter design description"
              rows={3}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg mb-2 min-h-[40px]">
              {designForm.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-purple-800 hover:text-purple-900"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter"
                className="flex-1 min-w-[150px] bg-transparent border-none focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {designForm.images.map((image, index) => (
                <div key={index} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {designForm.images.length < 5 && (
                <label className="flex flex-col items-center justify-center h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-xs text-gray-500">Upload image</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload up to 5 images. First image will be used as the main product image.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddEditModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800"
            >
              {isEditing ? 'Update Design' : 'Create Design'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this design? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        maxWidth="max-w-4xl"
      >
        {previewDesign && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="bg-gray-100 p-4">
              <div className="h-64 md:h-96 mb-2 bg-white rounded-lg overflow-hidden">
                <img
                  src={previewDesign.images?.[selectedImageIndex] || previewDesign.image || '/api/placeholder/600/600'}
                  alt={previewDesign.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/api/placeholder/600/600'; }}
                />
              </div>

              {previewDesign.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {previewDesign.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-16 bg-white rounded-md overflow-hidden cursor-pointer ${
                        selectedImageIndex === index ? 'ring-2 ring-purple-600' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6">
              <div className="mb-4">
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(previewDesign.status)}`}>
                  {previewDesign.status}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-2">{previewDesign.name}</h2>
              <p className="text-xl text-purple-900 font-semibold mb-4">
                ₵{previewDesign.price?.toFixed(2)}
              </p>

              <hr className="my-4" />

              <p className="text-gray-600 mb-4">{previewDesign.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {previewDesign.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{getCategoryLabel(previewDesign.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-medium">{previewDesign.stockQuantity || 0} available</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className="font-medium">{previewDesign.orders || 0} orders</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-medium">{formatDate(previewDesign.createdAt)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    openEditDesignModal(previewDesign);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Designs"
        maxWidth="max-w-md"
      >
        <div className="p-6">
          <p className="mb-4 text-gray-600">Upload a CSV file with your designs data.</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <svg className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop file here or click to upload
            </p>
            <p className="text-xs text-gray-400">Supported format: CSV</p>
            <button className="mt-3 px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 text-sm">
              Select File
            </button>
          </div>

          <div className="flex justify-between">
            <button className="text-purple-900 text-sm hover:underline">
              Download template
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 text-sm">
                Import
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageDesigns;