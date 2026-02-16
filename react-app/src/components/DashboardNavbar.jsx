// src/components/DashboardNavbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUserInfo, selectUserType } from "@/store/slices/authSlice";

// Icons components
const SearchIcon = ({ className }) => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const BellIcon = ({ className }) => (
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
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const DashboardNavbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from store
  const userInfo = useSelector(selectUserInfo);
  const userType = useSelector(selectUserType);

  // Determine base path based on user type
  const basePath = userType === "designer" ? "/designer" : "/client";

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (showNotifications) {
      setShowNotifications(false);
    }
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Notification items data
  const notificationItems = [
    {
      id: 1,
      title: "New order placed",
      description: "Customer ordered custom shirt design",
      time: "10 minutes ago",
    },
    {
      id: 2,
      title: "Measurement updated",
      description: "A client updated their measurements",
      time: "2 hours ago",
    },
    {
      id: 3,
      title: "Order status change",
      description: "Order #12345 is now ready for delivery",
      time: "Yesterday",
    },
  ];

  return (
    <nav className="bg-amber-50 border-b border-gray-200 shadow-md w-full">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-900">{title}</h1>

        <div className="flex items-center">
          {/* Search - Desktop */}
          <div className="relative mr-4 hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
            />
            <div className="absolute right-3 top-2.5">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Search icon - Mobile */}
          <div className="md:hidden mr-3 cursor-pointer">
            <SearchIcon className="h-6 w-6 text-gray-600 hover:text-purple-900 transition-colors" />
          </div>

          {/* Notifications */}
          <div
            className="relative cursor-pointer"
            onClick={toggleNotifications}
            ref={notificationRef}
          >
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-purple-900 transition-colors" />

            {/* Notification Badge */}
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications}
              </div>
            )}

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notificationItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {item.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button className="w-full text-center text-purple-600 text-sm py-1 hover:bg-purple-50 rounded">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative ml-5" ref={dropdownRef}>
            <div
              onClick={toggleDropdown}
              className="flex items-center cursor-pointer"
            >
              <div className="h-10 w-10 rounded-full bg-amber-100 overflow-hidden mr-2 border-2 border-transparent hover:border-purple-900 transition-all">
                <img
                  src={userInfo?.avatar}
                  alt={userInfo?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDownIcon className="h-5 w-5 text-gray-600" />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <Link
                  to={`${basePath}/profile`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-900"
                >
                  Profile
                </Link>
                <Link
                  to={`${basePath}/settings`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-900"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;