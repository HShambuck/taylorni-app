// src/pages/designer/DesignerOverview.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo, selectIsAuthenticated } from '@/store/slices/authSlice';
import Chart from 'chart.js/auto';

// Mock API
const mockAPI = {
  getDesignerOrders: async (designerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, clientId: 101, productId: 1, orderDate: '2025-01-15', status: 'Completed', totalPrice: 450, rating: 5 },
          { id: 2, clientId: 102, productId: 2, orderDate: '2025-01-20', status: 'In Progress', totalPrice: 320, rating: null },
          { id: 3, clientId: 103, productId: 1, orderDate: '2025-01-25', status: 'Pending', totalPrice: 450, rating: null },
          { id: 4, clientId: 101, productId: 3, orderDate: '2025-02-01', status: 'Completed', totalPrice: 280, rating: 4 },
          { id: 5, clientId: 104, productId: 2, orderDate: '2025-02-05', status: 'In Progress', totalPrice: 320, rating: null },
        ]);
      }, 300);
    });
  },

  getProducts: async (designerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Traditional Kente Cloth', price: 450, image: '/images/kente-1.jpg' },
          { id: 2, name: 'Modern African Dress', price: 320, image: '/images/dress-1.jpg' },
          { id: 3, name: 'Ankara Shirt', price: 280, image: '/images/shirt-1.jpg' },
        ]);
      }, 200);
    });
  },

  getClientName: (clientId) => {
    const clients = {
      101: 'Jane Cooper',
      102: 'Alex Morgan',
      103: 'Sarah Johnson',
      104: 'Michael Brown',
    };
    return clients[clientId] || `Client #${clientId}`;
  },
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

const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Canceled: 'bg-red-100 text-red-800',
  };
  return `${classes[status] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs`;
};

// Metric Card Component
const MetricCard = ({ title, value, icon, bgColor, iconColor }) => (
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

// Main Component
const DesignerOverview = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularDesigns, setPopularDesigns] = useState([]);
  const [clientMessages] = useState([
    { id: 1, clientId: 101, clientName: 'Jane Cooper', avatar: '/images/avatars/avatar-1.jpg', text: 'When can I expect to see the first draft?', timeAgo: '2h ago', unread: true },
    { id: 2, clientId: 102, clientName: 'Alex Morgan', avatar: '/images/avatars/avatar-2.jpg', text: 'The design looks great! Just a few tweaks needed.', timeAgo: '5h ago', unread: false },
    { id: 3, clientId: 103, clientName: 'Sarah Johnson', avatar: '/images/avatars/avatar-3.jpg', text: "I'm interested in commissioning a custom piece.", timeAgo: '1d ago', unread: true },
  ]);

  // Calculate metrics
  const metrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'Pending' || o.status === 'In Progress').length,
    completedOrders: orders.filter((o) => o.status === 'Completed').length,
    totalEarnings: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    activeListings: products.length,
    avgRating: (() => {
      const ratings = orders.filter((o) => o.rating).map((o) => o.rating);
      return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '0';
    })(),
  };

  // Initialize chart
  const initChart = (monthlyData) => {
    if (!chartRef.current || !monthlyData) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: monthlyData.months,
        datasets: [
          {
            label: 'Earnings (₵)',
            data: monthlyData.earnings,
            backgroundColor: 'rgba(88, 28, 135, 0.7)',
            borderColor: 'rgb(88, 28, 135)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: 'Orders',
            data: monthlyData.orderCounts,
            type: 'line',
            borderColor: '#10B981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#10B981',
            pointRadius: 4,
            tension: 0.4,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            position: 'left',
            title: { display: true, text: 'Earnings (₵)' },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Orders' },
          },
        },
      },
    });
  };

  // Prepare monthly data for chart
  const prepareMonthlyData = (ordersData) => {
    const months = [];
    const earnings = [];
    const orderCounts = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'short' }));
      earnings.push(0);
      orderCounts.push(0);
    }

    ordersData.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const monthDiff =
        today.getMonth() + 12 * today.getFullYear() -
        (orderDate.getMonth() + 12 * orderDate.getFullYear());

      if (monthDiff >= 0 && monthDiff < 6) {
        earnings[5 - monthDiff] += order.totalPrice || 0;
        orderCounts[5 - monthDiff]++;
      }
    });

    return { months, earnings, orderCounts };
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const [ordersData, productsData] = await Promise.all([
          mockAPI.getDesignerOrders(userInfo?.id),
          mockAPI.getProducts(userInfo?.id),
        ]);

        setOrders(ordersData);
        setProducts(productsData);

        // Recent orders
        const recent = [...ordersData]
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5);
        setRecentOrders(recent);

        // Popular designs
        const productCounts = {};
        const productEarnings = {};

        ordersData.forEach((order) => {
          if (!productCounts[order.productId]) {
            productCounts[order.productId] = 0;
            productEarnings[order.productId] = 0;
          }
          productCounts[order.productId]++;
          productEarnings[order.productId] += order.totalPrice || 0;
        });

        const popular = Object.keys(productCounts)
          .map((id) => {
            const product = productsData.find((p) => p.id === parseInt(id));
            if (!product) return null;
            return {
              ...product,
              orders: productCounts[id],
              earnings: productEarnings[id],
            };
          })
          .filter(Boolean)
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 3);

        setPopularDesigns(popular);

        // Init chart
        const monthlyData = prepareMonthlyData(ordersData);
        setTimeout(() => initChart(monthlyData), 100);

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [isAuthenticated, navigate, userInfo?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Welcome back, {userInfo?.fullName || 'Designer'}!
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Here's what's happening with your designs today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/designer/products/new"
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium text-center transition-colors"
            >
              + Add New Design
            </Link>
            <Link
              to="/designer/shop"
              className="px-4 py-2 border border-purple-900 text-purple-900 hover:bg-purple-50 rounded-lg font-medium text-center transition-colors"
            >
              Manage Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6">
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          bgColor="bg-indigo-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <MetricCard
          title="Pending"
          value={metrics.pendingOrders}
          bgColor="bg-yellow-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          title="Completed"
          value={metrics.completedOrders}
          bgColor="bg-green-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          title="Earnings"
          value={`₵${metrics.totalEarnings.toLocaleString()}`}
          bgColor="bg-purple-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          title="Listings"
          value={metrics.activeListings}
          bgColor="bg-blue-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
        />
        <MetricCard
          title="Rating"
          value={
            <span className="flex items-center">
              {metrics.avgRating}
              <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </span>
          }
          bgColor="bg-yellow-100"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Earnings Summary</h2>
            <div className="h-64 sm:h-72">
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link to="/designer/orders" className="text-purple-900 hover:text-purple-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent orders</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => navigate(`/designer/orders/${order.id}`)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 sm:px-6 py-4 font-medium">#{order.id}</td>
                        <td className="px-4 sm:px-6 py-4">{mockAPI.getClientName(order.clientId)}</td>
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">{formatDate(order.orderDate)}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={getStatusClass(order.status)}>{order.status}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">₵{(order.totalPrice || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Popular Designs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Popular Designs</h2>
              <Link to="/designer/products" className="text-purple-900 hover:text-purple-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {popularDesigns.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No designs yet</p>
              ) : (
                popularDesigns.map((design) => (
                  <div
                    key={design.id}
                    onClick={() => navigate(`/designer/products/${design.id}`)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={design.image}
                      alt={design.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{design.name}</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">{design.orders} orders</span>
                        <span className="text-sm font-medium">₵{design.earnings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Recent Messages</h2>
              <Link to="/designer/messages" className="text-purple-900 hover:text-purple-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="divide-y">
              {clientMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => navigate(`/designer/messages/${message.clientId}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={message.avatar}
                        alt={message.clientName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.target.src = '/images/placeholder-avatar.jpg'; }}
                      />
                      {message.unread && (
                        <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800 truncate">{message.clientName}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">{message.timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/designer/products/new"
                className="flex items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
              >
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-5 h-5 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-700 font-medium block">Add New Product</span>
                  <span className="text-gray-500 text-sm">Upload a new design</span>
                </div>
              </Link>

              <Link
                to="/designer/orders/custom/new"
                className="flex items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
              >
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-5 h-5 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-700 font-medium block">Create Custom Order</span>
                  <span className="text-gray-500 text-sm">Set up a custom request</span>
                </div>
              </Link>

              <Link
                to="/designer/portfolio"
                className="flex items-center p-4 border rounded-lg hover:border-purple-900 hover:shadow-md transition-all"
              >
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-5 h-5 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-700 font-medium block">Update Portfolio</span>
                  <span className="text-gray-500 text-sm">Refresh your showcase</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerOverview;