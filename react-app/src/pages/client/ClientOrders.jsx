// src/pages/client/ClientOrders.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/store/slices/authSlice";

// Mock API for orders
const mockAPI = {
  getOrders: async (clientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            clientId,
            productName: "Custom Kente Suit",
            orderDate: "2025-01-15",
            deliveryDate: "2025-02-15",
            status: "In Progress",
            progress: "Fabric cutting complete",
            totalPrice: 450.0,
          },
          {
            id: 2,
            clientId,
            productName: "Evening Gown",
            orderDate: "2025-01-10",
            deliveryDate: "2025-01-25",
            status: "Shipped",
            progress: "On the way",
            totalPrice: 600.0,
          },
          {
            id: 3,
            clientId,
            productName: "Casual Denim Jacket",
            orderDate: "2024-12-20",
            deliveryDate: "2025-01-05",
            status: "Completed",
            progress: "Delivered",
            totalPrice: 280.0,
          },
          {
            id: 4,
            clientId,
            productName: "Traditional Agbada",
            orderDate: "2024-12-15",
            deliveryDate: "2025-01-10",
            status: "Completed",
            progress: "Delivered",
            totalPrice: 550.0,
          },
          {
            id: 5,
            clientId,
            productName: "Business Suit",
            orderDate: "2024-11-28",
            deliveryDate: "2024-12-20",
            status: "Cancelled",
            progress: "Order cancelled",
            totalPrice: 500.0,
          },
        ]);
      }, 500);
    });
  },
};

// Format currency
const formatCurrency = (amount) => {
  return `₵${parseFloat(amount || 0).toFixed(2)}`;
};

// Format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Calculate progress percentage
const calculateProgress = (order) => {
  switch (order.status) {
    case "Completed":
      return 100;
    case "Shipped":
      return 75;
    case "In Progress":
      return 50;
    case "Pending":
      return 25;
    case "Cancelled":
      return 0;
    default:
      return 0;
  }
};

// Status badge colors
const statusColors = {
  "In Progress": "bg-amber-100 text-amber-800",
  Shipped: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Pending: "bg-gray-100 text-gray-800",
};

// Stat Card Component
const StatCard = ({ icon, title, value, subtitle, iconBg, valueColor }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <div className="flex items-center">
      <div className={`${iconBg} p-3 rounded-lg mr-4`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-xl sm:text-2xl font-bold ${valueColor}`}>{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  </div>
);

// Main Component
const ClientOrders = () => {
  const userInfo = useSelector(selectUserInfo);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await mockAPI.getOrders(userInfo?.id);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchOrders();
    }
  }, [userInfo?.id]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "All" && order.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !order.id.toString().includes(query) &&
          !order.productName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Order stats
  const orderStats = useMemo(() => {
    return {
      all: orders.length,
      active: orders.filter((o) => o.status === "In Progress").length,
      totalSpent: orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + o.totalPrice, 0),
    };
  }, [orders]);

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
          📦 My Orders
        </h1>
        <p className="text-gray-600 mt-1">Track and manage your purchases</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
          title="Total Orders"
          value={orderStats.all}
          subtitle="All time purchases"
          iconBg="bg-amber-100"
          valueColor="text-amber-600"
        />
        <StatCard
          icon={
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
          title="Active Orders"
          value={orderStats.active}
          subtitle="Currently in progress"
          iconBg="bg-purple-100"
          valueColor="text-purple-600"
        />
        <StatCard
          icon={
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Total Spent"
          value={formatCurrency(orderStats.totalSpent)}
          subtitle="Lifetime value"
          iconBg="bg-green-100"
          valueColor="text-green-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Shop Now Button */}
          <Link
            to="/client/marketplace"
            className="px-6 py-2 bg-purple-900 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors text-center whitespace-nowrap"
          >
            🛍️ Shop Now
          </Link>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No orders found</p>
            <Link
              to="/client/marketplace"
              className="text-purple-900 font-medium hover:underline"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Est. Delivery
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">
                          ORD{order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.productName}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all"
                              style={{ width: `${calculateProgress(order)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {calculateProgress(order)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.progress}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(order.deliveryDate)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/client/orders/${order.id}`}
                          className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">
                        ORD{order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.productName}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${calculateProgress(order)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {calculateProgress(order)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>{" "}
                      <span className="font-semibold">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                    <Link
                      to={`/client/orders/${order.id}`}
                      className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientOrders;