// src/pages/designer/DesignerClients.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '@/store/slices/authSlice';

// Mock API
const mockAPI = {
  getClients: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 101, firstName: 'Jane', lastName: 'Cooper', email: 'jane@example.com', phone: '+233 24 123 4567', location: 'Accra, Ghana' },
          { id: 102, firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com', phone: '+233 20 987 6543', location: 'Kumasi, Ghana' },
          { id: 103, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '+233 27 555 1234', location: 'Takoradi, Ghana' },
          { id: 104, firstName: 'Michael', lastName: 'Brown', email: 'michael@example.com', phone: '+233 24 777 8888', location: 'Accra, Ghana' },
          { id: 105, firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', phone: '+233 20 111 2222', location: 'Cape Coast, Ghana' },
        ]);
      }, 300);
    });
  },

  getOrders: async (designerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, clientId: 101, designerId, orderDate: '2025-01-15', status: 'Completed', totalPrice: 450 },
          { id: 2, clientId: 102, designerId, orderDate: '2025-01-20', status: 'In Progress', totalPrice: 320 },
          { id: 3, clientId: 101, designerId, orderDate: '2025-02-01', status: 'Completed', totalPrice: 280 },
          { id: 4, clientId: 103, designerId, orderDate: '2025-02-05', status: 'Pending', totalPrice: 550 },
          { id: 5, clientId: 104, designerId, orderDate: '2025-02-10', status: 'In Progress', totalPrice: 420 },
          { id: 6, clientId: 101, designerId, orderDate: '2025-02-15', status: 'In Progress', totalPrice: 380 },
          { id: 7, clientId: 105, designerId, orderDate: '2025-02-20', status: 'Pending', totalPrice: 290 },
        ]);
      }, 200);
    });
  },
};

// Helper functions
const formatCurrency = (value) => `₵${Number(value || 0).toFixed(2)}`;

const getBadgeClass = (status) => {
  const classes = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    New: 'bg-yellow-100 text-yellow-800',
  };
  return `${classes[status] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs font-medium`;
};

// Stat Card Component
const StatCard = ({ title, value, icon, bgColor, iconColor, growth }) => (
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
      <span className="text-green-500 text-xs sm:text-sm flex items-center">
        <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {growth}
      </span>
    </div>
  </div>
);

// Main Component
const DesignerClients = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedClients, setSelectedClients] = useState({});

  const itemsPerPage = 5;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, ordersData] = await Promise.all([
          mockAPI.getClients(),
          mockAPI.getOrders(userInfo?.id),
        ]);
        setClients(clientsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userInfo?.id]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Process clients with order data
  const designerClients = useMemo(() => {
    const designerOrders = orders.filter((o) => o.designerId === userInfo?.id);
    const clientIds = [...new Set(designerOrders.map((o) => o.clientId))];

    return clientIds.map((clientId) => {
      const client = clients.find((c) => c.id === clientId);
      if (!client) return null;

      const clientOrders = designerOrders.filter((o) => o.clientId === clientId);
      const latestOrder = clientOrders.reduce((latest, order) =>
        !latest || new Date(order.orderDate) > new Date(latest.orderDate) ? order : latest, null
      );
      const totalSpent = clientOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const isActive = clientOrders.some((o) => o.status === 'In Progress');

      return {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        location: client.location || 'N/A',
        phone: client.phone || 'N/A',
        lastOrder: latestOrder?.orderDate || 'N/A',
        totalOrders: clientOrders.length,
        totalSpent: formatCurrency(totalSpent),
        status: isActive ? 'Active' : 'Inactive',
      };
    }).filter(Boolean);
  }, [clients, orders, userInfo?.id]);

  // Client stats
  const clientStats = useMemo(() => {
    const designerOrders = orders.filter((o) => o.designerId === userInfo?.id);
    const uniqueClientIds = [...new Set(designerOrders.map((o) => o.clientId))];

    const clientOrderCounts = designerOrders.reduce((acc, o) => {
      acc[o.clientId] = (acc[o.clientId] || 0) + 1;
      return acc;
    }, {});

    const repeatClientIds = Object.keys(clientOrderCounts).filter((id) => clientOrderCounts[id] > 1);
    const activeClientIds = [...new Set(designerOrders.filter((o) => o.status === 'In Progress').map((o) => o.clientId))];

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const newClientIds = [...new Set(
      designerOrders.filter((o) => new Date(o.orderDate) >= lastMonth).map((o) => o.clientId)
    )];

    return [
      {
        title: 'Total Clients',
        value: uniqueClientIds.length,
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-900',
        growth: uniqueClientIds.length > 0 ? `${Math.round((newClientIds.length / uniqueClientIds.length) * 100)}% this month` : '0%',
      },
      {
        title: 'Active Clients',
        value: activeClientIds.length,
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        growth: uniqueClientIds.length > 0 ? `${Math.round((activeClientIds.length / uniqueClientIds.length) * 100)}% of total` : '0%',
      },
      {
        title: 'New Clients',
        value: newClientIds.length,
        icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        growth: `${newClientIds.length} this month`,
      },
      {
        title: 'Repeat Clients',
        value: repeatClientIds.length,
        icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-900',
        growth: uniqueClientIds.length > 0 ? `${Math.round((repeatClientIds.length / uniqueClientIds.length) * 100)}% of total` : '0%',
      },
    ];
  }, [orders, userInfo?.id]);

  // Filtered and paginated clients
  const filteredClients = useMemo(() => {
    let result = designerClients;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [designerClients, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const viewClient = (id) => navigate(`/designer/clients/${id}`);
  const messageClient = (id) => console.log(`Message client: ${id}`);
  const callClient = (client) => client.phone && (window.location.href = `tel:${client.phone}`);
  const emailClient = (client) => client.email && (window.location.href = `mailto:${client.email}`);

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelected = {};
    if (newSelectAll) {
      paginatedClients.forEach((c) => { newSelected[c.id] = true; });
    }
    setSelectedClients(newSelected);
  };

  const toggleSelectClient = (id) => {
    setSelectedClients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Clients</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage your client relationships and track client information</p>
      </div>

      {/* Stats */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {clientStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-lg font-semibold">Client List</h2>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <div className="relative flex-1 sm:w-64">
                <svg className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Clients</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Add Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Last Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-gray-500">No clients found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedClients[client.id] || false}
                          onChange={() => toggleSelectClient(client.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-900 font-bold text-sm">{client.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{client.name}</div>
                            <div className="text-sm text-gray-500 truncate">{client.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm">{client.email}</td>
                      <td className="px-4 py-4 hidden lg:table-cell text-sm">{client.lastOrder}</td>
                      <td className="px-4 py-4 hidden sm:table-cell text-sm">{client.totalOrders}</td>
                      <td className="px-4 py-4 hidden lg:table-cell text-sm font-medium">{client.totalSpent}</td>
                      <td className="px-4 py-4">
                        <span className={getBadgeClass(client.status)}>{client.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => viewClient(client.id)} className="p-2 hover:bg-gray-100 rounded" title="View">
                            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button onClick={() => emailClient(client)} className="p-2 hover:bg-gray-100 rounded" title="Email">
                            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button onClick={() => callClient(client)} className="p-2 hover:bg-gray-100 rounded" title="Call">
                            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-4">
            <div className="text-sm text-gray-500">
              {filteredClients.length > 0 ? (
                <>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients</>
              ) : (
                'No clients found'
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  «
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-purple-900 text-white' : 'hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerClients;