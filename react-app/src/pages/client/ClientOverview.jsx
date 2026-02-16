// src/pages/client/ClientOverview.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserInfo } from "@/store/slices/authSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock API functions (structure for future backend)
const mockAPI = {
  getOrders: async (userId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            clientId: userId,
            productName: "Custom Kente Suit",
            orderDate: "2025-01-15",
            status: "In Progress",
            totalPrice: 450.0,
            isCustom: true,
          },
          {
            id: 2,
            clientId: userId,
            productName: "Casual Denim Jacket",
            orderDate: "2025-01-10",
            status: "Completed",
            totalPrice: 120.0,
            isCustom: false,
          },
          {
            id: 3,
            clientId: userId,
            productName: "Traditional Dress",
            orderDate: "2024-12-20",
            status: "Completed",
            totalPrice: 350.0,
            isCustom: true,
          },
          {
            id: 4,
            clientId: userId,
            productName: "Business Suit",
            orderDate: "2024-12-05",
            status: "In Progress",
            totalPrice: 500.0,
            isCustom: false,
          },
          {
            id: 5,
            clientId: userId,
            productName: "Evening Gown",
            orderDate: "2024-11-15",
            status: "Completed",
            totalPrice: 600.0,
            isCustom: true,
          },
        ]);
      }, 500);
    });
  },

  getMeasurements: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            clientId: userId,
            category: "Male",
            dateRecorded: "2025-01-01",
            chest: 40,
            waist: 32,
          },
          {
            id: 2,
            clientId: userId,
            category: "Formal",
            dateRecorded: "2024-12-15",
            chest: 40,
            waist: 32,
          },
        ]);
      }, 300);
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

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, bgColor, iconColor }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start">
      <div className={`${bgColor} p-3 sm:p-4 rounded-lg mr-3 sm:mr-4`}>
        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm sm:text-lg font-medium text-gray-600 truncate">
          {title}
        </h2>
        <p className="text-xl sm:text-2xl text-purple-900 font-bold mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Icons
const ShoppingBagIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const RulerIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const ClientOverview = () => {
  const userInfo = useSelector(selectUserInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const chartRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, measurementsData] = await Promise.all([
          mockAPI.getOrders(userInfo?.id),
          mockAPI.getMeasurements(userInfo?.id),
        ]);

        setOrders(ordersData);
        setMeasurements(measurementsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchData();
    }
  }, [userInfo?.id]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status === "In Progress").length;
    const completedOrders = orders.filter((o) => o.status === "Completed").length;
    const latestMeasurement = measurements.length > 0
      ? measurements.sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded))[0]
      : null;

    return {
      activeOrders,
      savedMeasurements: measurements.length,
      lastMeasurement: latestMeasurement
        ? formatDate(latestMeasurement.dateRecorded)
        : "Not available",
      completedOrders,
      totalOrders: orders.length,
      wishlistCount: 0, // Mock value
    };
  }, [orders, measurements]);

  // Recent orders (last 5)
  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        item: order.productName,
        date: formatDate(order.orderDate),
        status: order.status,
        amount: formatCurrency(order.totalPrice),
      }));
  }, [orders]);

  // Chart data
  const chartData = useMemo(() => {
    // Get last 6 months
    const last6Months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      last6Months.push(d.toLocaleString("default", { month: "short" }));
    }

    // Count orders per month
    const orderCounts = Array(6).fill(0);
    const customOrderCounts = Array(6).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const monthDiff =
        today.getMonth() -
        orderDate.getMonth() +
        (today.getFullYear() - orderDate.getFullYear()) * 12;

      if (monthDiff >= 0 && monthDiff < 6) {
        orderCounts[5 - monthDiff]++;
        if (order.isCustom) {
          customOrderCounts[5 - monthDiff]++;
        }
      }
    });

    return {
      labels: last6Months,
      datasets: [
        {
          label: "Orders",
          data: orderCounts,
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#F59E0B",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
          fill: true,
        },
        {
          label: "Custom Orders",
          data: customOrderCounts,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#10B981",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
          fill: true,
        },
      ],
    };
  }, [orders]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        padding: 10,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg p-6 sm:p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {userInfo?.firstName}! 👋
        </h1>
        <p className="text-purple-100 text-sm sm:text-base">
          Here's what's happening with your fashion journey
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          icon={ShoppingBagIcon}
          title="Active Orders"
          value={stats.activeOrders}
          subtitle="in progress"
          bgColor="bg-amber-500"
          iconColor="text-white"
        />
        <StatCard
          icon={RulerIcon}
          title="Saved Measurements"
          value={stats.savedMeasurements}
          subtitle="profiles"
          bgColor="bg-emerald-400"
          iconColor="text-white"
        />
        <StatCard
          icon={EyeIcon}
          title="Last Measurement"
          value={stats.lastMeasurement}
          bgColor="bg-sky-400"
          iconColor="text-white"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Recent Orders
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your latest purchases and requests
              </p>
            </div>
            <Link
              to="/client/orders"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors text-sm sm:text-base"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link
                to="/client/marketplace"
                className="btn bg-purple-900 text-white hover:bg-purple-800 border-none"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 px-2 sm:px-0 text-xs sm:text-sm text-gray-600 font-medium">
                      Item
                    </th>
                    <th className="pb-3 px-2 text-xs sm:text-sm text-gray-600 font-medium">
                      Date
                    </th>
                    <th className="pb-3 px-2 text-xs sm:text-sm text-gray-600 font-medium">
                      Amount
                    </th>
                    <th className="pb-3 px-2 text-xs sm:text-sm text-gray-600 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 sm:py-4 px-2 sm:px-0">
                        <div className="text-sm sm:text-base text-gray-800 font-medium">
                          {order.item}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2">
                        <div className="text-xs sm:text-sm text-gray-600">
                          {order.date}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2">
                        <div className="text-sm sm:text-base text-gray-800 font-medium">
                          {order.amount}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2">
                        <span
                          className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Purchase Activity Chart */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            Purchase Activity
          </h2>
          {orders.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No order data available
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80">
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            Quick Stats
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Wishlist */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span className="text-gray-600">Wishlist Items</span>
                <span className="font-medium">
                  {stats.wishlistCount} items
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(stats.wishlistCount * 10, 100)}%` }}
                />
              </div>
            </div>

            {/* Orders Completed */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span className="text-gray-600">Orders Completed</span>
                <span className="font-medium">{stats.completedOrders} orders</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      stats.totalOrders
                        ? (stats.completedOrders / stats.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Measurement Accuracy */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span className="text-gray-600">Measurement Accuracy</span>
                <span className="font-medium">
                  {stats.savedMeasurements ? "98%" : "N/A"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.savedMeasurements ? 98 : 0}%` }}
                />
              </div>
            </div>

            {/* Popular Categories */}
            <div className="pt-4 border-t">
              <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                Popular Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">
                  Suits
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded">
                  Casual
                </span>
                <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded">
                  Kente
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/client/marketplace"
          className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
        >
          <div className="text-3xl sm:text-4xl mb-2">🛍️</div>
          <div className="font-semibold text-sm sm:text-base group-hover:underline">
            Browse Marketplace
          </div>
        </Link>

        <Link
          to="/client/custom-order"
          className="bg-gradient-to-r from-amber-500 to-amber-400 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
        >
          <div className="text-3xl sm:text-4xl mb-2">✨</div>
          <div className="font-semibold text-sm sm:text-base group-hover:underline">
            Custom Order
          </div>
        </Link>

        <Link
          to="/client/measurements"
          className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
        >
          <div className="text-3xl sm:text-4xl mb-2">📏</div>
          <div className="font-semibold text-sm sm:text-base group-hover:underline">
            My Measurements
          </div>
        </Link>

        <Link
          to="/client/try-on"
          className="bg-gradient-to-r from-sky-500 to-sky-400 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
        >
          <div className="text-3xl sm:text-4xl mb-2">👔</div>
          <div className="font-semibold text-sm sm:text-base group-hover:underline">
            Virtual Try-On
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ClientOverview;