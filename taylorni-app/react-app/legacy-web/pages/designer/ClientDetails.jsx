// src/pages/designer/ClientDetails.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '@/store/slices/authSlice';

// Mock API
const mockAPI = {
  getClient: async (clientId) => {
    const clients = {
      101: { id: 101, firstName: 'Jane', lastName: 'Cooper', email: 'jane@example.com', phone: '+233 24 123 4567', location: 'Accra, Ghana', address: '123 Main St, Accra', company: 'Cooper Designs', preferredContactMethod: 'email', communicationFrequency: 'weekly', designPreferences: 'Modern, minimalist designs with clean lines', colorPreferences: 'Earth tones, navy blue, white', styleNotes: 'Prefers fitted silhouettes, no loud patterns' },
      102: { id: 102, firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com', phone: '+233 20 987 6543', location: 'Kumasi, Ghana', address: '456 Oak Ave, Kumasi', company: '', preferredContactMethod: 'phone', communicationFrequency: 'biweekly', designPreferences: 'Traditional African prints', colorPreferences: 'Vibrant colors, gold accents', styleNotes: 'Loves bold patterns' },
      103: { id: 103, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '+233 27 555 1234', location: 'Takoradi, Ghana', address: '789 Beach Rd, Takoradi', company: 'Johnson Inc', preferredContactMethod: 'email', communicationFrequency: 'monthly', designPreferences: '', colorPreferences: '', styleNotes: '' },
    };
    return new Promise((resolve) => setTimeout(() => resolve(clients[clientId] || null), 300));
  },

  getClientOrders: async (clientId, designerId) => {
    const orders = [
      { id: 1, clientId: 101, designerId: 1, orderDate: '2025-01-15', status: 'Completed', totalPrice: 450, service: 'Traditional Kente' },
      { id: 2, clientId: 101, designerId: 1, orderDate: '2025-02-01', status: 'Completed', totalPrice: 280, service: 'Ankara Dress' },
      { id: 3, clientId: 101, designerId: 1, orderDate: '2025-02-15', status: 'In Progress', totalPrice: 380, service: 'Custom Suit' },
      { id: 4, clientId: 102, designerId: 1, orderDate: '2025-01-20', status: 'In Progress', totalPrice: 320, service: 'Wedding Outfit' },
      { id: 5, clientId: 103, designerId: 1, orderDate: '2025-02-05', status: 'Pending', totalPrice: 550, service: 'Formal Attire' },
    ];
    return new Promise((resolve) => setTimeout(() => resolve(orders.filter((o) => o.clientId === parseInt(clientId) && o.designerId === designerId)), 200));
  },
};

// Helpers
const formatCurrency = (value) => `₵${Number(value || 0).toFixed(2)}`;

const getBadgeClass = (status) => {
  const classes = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Completed: 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Pending: 'bg-blue-100 text-blue-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return `${classes[status] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs font-medium`;
};

// Stat Card
const StatCard = ({ title, value, subtext, icon, bgColor, iconColor }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-xs sm:text-sm">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        <svg className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    </div>
    <div className="mt-2">
      <span className="text-gray-500 text-xs sm:text-sm">{subtext}</span>
    </div>
  </div>
);

// Tab Button
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm sm:text-base border-b-2 transition-colors ${
      active ? 'border-purple-900 text-purple-900' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

// Main Component
const ClientDetails = () => {
  const { id: clientId } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [contactForm, setContactForm] = useState({});
  const [preferencesForm, setPreferencesForm] = useState({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientData, ordersData] = await Promise.all([
          mockAPI.getClient(clientId),
          mockAPI.getClientOrders(clientId, userInfo?.id || 1),
        ]);
        setClient(clientData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId, userInfo?.id]);

  // Computed
  const clientStatus = useMemo(() => {
    if (!orders.length) return 'Inactive';
    return orders.some((o) => o.status === 'In Progress') ? 'Active' : 'Inactive';
  }, [orders]);

  const clientStats = useMemo(() => {
    if (!orders.length) return null;

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const avgOrderValue = totalSpent / orders.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = orders.filter((o) => new Date(o.orderDate) >= thirtyDaysAgo);
    const recentSpending = recentOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const sortedOrders = [...orders].sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    const firstOrder = sortedOrders[0];
    const latestOrder = sortedOrders[sortedOrders.length - 1];

    return {
      totalSpent: formatCurrency(totalSpent),
      avgOrderValue: formatCurrency(avgOrderValue),
      totalOrders: orders.length,
      recentSpending: formatCurrency(recentSpending),
      recentOrders: recentOrders.length,
      firstOrderDate: firstOrder?.orderDate || 'N/A',
      latestOrderDate: latestOrder?.orderDate || 'N/A',
      clientSince: firstOrder ? new Date(firstOrder.orderDate).toLocaleDateString() : 'N/A',
    };
  }, [orders]);

  const activityMonths = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    return months.map((m) => ({
      ...m,
      count: orders.filter((o) => {
        const d = new Date(o.orderDate);
        return d.getMonth() === m.monthIndex && d.getFullYear() === m.year;
      }).length,
    }));
  }, [orders]);

  // Handlers
  const goBack = () => navigate('/designer/clients');
  const viewOrder = (orderId) => navigate(`/designer/orders/${orderId}`);
  const createOrder = () => navigate(`/designer/orders/new?client=${clientId}`);
  const messageClient = () => console.log(`Message client: ${clientId}`);
  const callClient = () => client?.phone && (window.location.href = `tel:${client.phone}`);
  const emailClient = () => client?.email && (window.location.href = `mailto:${client.email}`);

  const editContact = () => {
    setContactForm({
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      email: client.email || '',
      phone: client.phone || '',
      location: client.location || '',
      address: client.address || '',
      company: client.company || '',
    });
    setIsEditingContact(true);
  };

  const editPreferences = () => {
    setPreferencesForm({
      preferredContactMethod: client.preferredContactMethod || 'email',
      designPreferences: client.designPreferences || '',
      colorPreferences: client.colorPreferences || '',
      styleNotes: client.styleNotes || '',
      communicationFrequency: client.communicationFrequency || 'weekly',
    });
    setIsEditingPreferences(true);
  };

  const saveContact = () => {
    console.log('Saving contact:', contactForm);
    setClient((prev) => ({ ...prev, ...contactForm }));
    setIsEditingContact(false);
  };

  const savePreferences = () => {
    console.log('Saving preferences:', preferencesForm);
    setClient((prev) => ({ ...prev, ...preferencesForm }));
    setIsEditingPreferences(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-6">The client you're looking for doesn't exist.</p>
          <button onClick={goBack} className="px-6 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium">
            Return to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-white shadow-sm">
        <div className="flex items-center mb-4">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg mr-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Client Details</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <span className="text-xl sm:text-2xl font-bold text-purple-900">
                {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{client.firstName} {client.lastName}</h2>
              <div className="flex items-center mt-1 flex-wrap gap-2">
                <span className={getBadgeClass(clientStatus)}>{clientStatus}</span>
                <span className="text-gray-500 text-sm">Client since {clientStats?.clientSince || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={messageClient} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message
            </button>
            <button onClick={callClient} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </button>
            <button onClick={emailClient} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
            <button onClick={createOrder} className="px-3 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {clientStats && (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Spent" value={clientStats.totalSpent} subtext={`${clientStats.recentSpending} in last 30 days`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" bgColor="bg-green-100" iconColor="text-green-600" />
            <StatCard title="Total Orders" value={clientStats.totalOrders} subtext={`${clientStats.recentOrders} in last 30 days`} icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" bgColor="bg-blue-100" iconColor="text-blue-600" />
            <StatCard title="Average Order" value={clientStats.avgOrderValue} subtext="Client average per order" icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" bgColor="bg-purple-100" iconColor="text-purple-900" />
            <StatCard title="Latest Order" value={clientStats.latestOrderDate} subtext={`First order: ${clientStats.firstOrderDate}`} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" bgColor="bg-orange-100" iconColor="text-orange-600" />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-2">
        <div className="flex gap-2 overflow-x-auto border-b">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>Orders</TabButton>
          <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>Activity</TabButton>
          <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>Notes</TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                {!isEditingContact && (
                  <button onClick={editContact} className="text-purple-900 hover:text-purple-700 text-sm flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {!isEditingContact ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{client.firstName} {client.lastName}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{client.email}</p></div>
                  <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{client.phone || 'Not provided'}</p></div>
                  <div><p className="text-sm text-gray-500">Location</p><p className="font-medium">{client.location || 'Not provided'}</p></div>
                  <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{client.address || 'Not provided'}</p></div>
                  <div><p className="text-sm text-gray-500">Company</p><p className="font-medium">{client.company || 'Not provided'}</p></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" value={contactForm.firstName} onChange={(e) => setContactForm((p) => ({ ...p, firstName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" value={contactForm.lastName} onChange={(e) => setContactForm((p) => ({ ...p, lastName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={contactForm.location} onChange={(e) => setContactForm((p) => ({ ...p, location: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" value={contactForm.company} onChange={(e) => setContactForm((p) => ({ ...p, company: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea value={contactForm.address} onChange={(e) => setContactForm((p) => ({ ...p, address: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                    <button onClick={() => setIsEditingContact(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={saveContact} className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg">Save</button>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Preferences & Notes</h3>
                {!isEditingPreferences && (
                  <button onClick={editPreferences} className="text-purple-900 hover:text-purple-700 text-sm flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {!isEditingPreferences ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Preferred Contact</p><p className="font-medium capitalize">{client.preferredContactMethod || 'Email'}</p></div>
                  <div><p className="text-sm text-gray-500">Communication Frequency</p><p className="font-medium capitalize">{client.communicationFrequency || 'As needed'}</p></div>
                  <div className="md:col-span-2"><p className="text-sm text-gray-500">Design Preferences</p><p className="font-medium">{client.designPreferences || 'No preferences specified'}</p></div>
                  <div className="md:col-span-2"><p className="text-sm text-gray-500">Color Preferences</p><p className="font-medium">{client.colorPreferences || 'No preferences specified'}</p></div>
                  <div className="md:col-span-2"><p className="text-sm text-gray-500">Style Notes</p><p className="font-medium">{client.styleNotes || 'No notes specified'}</p></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                    <select value={preferencesForm.preferredContactMethod} onChange={(e) => setPreferencesForm((p) => ({ ...p, preferredContactMethod: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text Message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Communication Frequency</label>
                    <select value={preferencesForm.communicationFrequency} onChange={(e) => setPreferencesForm((p) => ({ ...p, communicationFrequency: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="asneeded">As needed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Design Preferences</label>
                    <textarea value={preferencesForm.designPreferences} onChange={(e) => setPreferencesForm((p) => ({ ...p, designPreferences: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Preferences</label>
                    <textarea value={preferencesForm.colorPreferences} onChange={(e) => setPreferencesForm((p) => ({ ...p, colorPreferences: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Style Notes</label>
                    <textarea value={preferencesForm.styleNotes} onChange={(e) => setPreferencesForm((p) => ({ ...p, styleNotes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                    <button onClick={() => setIsEditingPreferences(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={savePreferences} className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg">Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Order History</h3>
              <button onClick={createOrder} className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-sm flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Order
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No orders found</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{order.id}</td>
                        <td className="px-4 py-3">{order.orderDate}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">{order.service}</td>
                        <td className="px-4 py-3">{formatCurrency(order.totalPrice)}</td>
                        <td className="px-4 py-3"><span className={getBadgeClass(order.status)}>{order.status}</span></td>
                        <td className="px-4 py-3">
                          <button onClick={() => viewOrder(order.id)} className="p-2 hover:bg-gray-100 rounded">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
            <div className="h-48 sm:h-64 mb-6">
              <div className="flex h-full items-end gap-2">
                {activityMonths.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-purple-100 rounded-t" style={{ height: `${Math.max(20, item.count * 40)}px` }}>
                      <div className="bg-purple-900 h-full rounded-t w-full" />
                    </div>
                    <div className="text-xs mt-2 text-gray-600 text-center truncate w-full">{item.month}</div>
                    <div className="text-xs font-semibold">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            <h4 className="font-medium text-gray-700 mb-4">Recent Activity</h4>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order, i) => (
                <div key={order.id} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-900 rounded-full" />
                    {i < 4 && <div className="w-0.5 h-full bg-gray-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{order.service || 'New Order'}</p>
                      <span className="text-sm text-gray-500">{order.orderDate}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.status === 'Completed' ? 'Completed order' : order.status === 'In Progress' ? 'Order in progress' : 'Order created'} • {formatCurrency(order.totalPrice)}
                    </p>
                    <button onClick={() => viewOrder(order.id)} className="text-sm text-purple-900 mt-2 hover:underline">View Order</button>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-center py-8 text-gray-500">No activity found</p>}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Client Notes</h3>
              <button className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-sm flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Note
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Initial Client Briefing</h4>
                    <p className="text-sm text-gray-500">Added by You • April 2, 2025</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-red-500"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">Client prefers minimalist designs with a focus on typography. They mentioned their brand colors should be incorporated subtly.</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Project Timeline Discussion</h4>
                    <p className="text-sm text-gray-500">Added by You • April 1, 2025</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-red-500"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">Client needs all deliverables by end of month. Weekly check-ins scheduled for Wednesdays at 10am.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;