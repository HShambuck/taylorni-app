// src/components/Dashboard.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeStore,
  selectIsAuthenticated,
  selectUserType,
  selectUserInfo,
} from "@/store/slices/authSlice";
import { initializeCart } from "@/store/slices/cartSlice";
import Sidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);
  const userInfo = useSelector(selectUserInfo);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  // Dashboard Title (memoized for performance)
  const dashboardTitle = useMemo(() => {
    return userType === "client" ? "Client Dashboard" : "Designer Dashboard";
  }, [userType]);

  // Memoized callback to prevent infinite loops
  const handleSidebarStateChange = useCallback((newState) => {
    setSidebarExpanded((prev) => {
      if (prev !== newState.isExpanded) return newState.isExpanded;
      return prev;
    });
    setSidebarPinned((prev) => {
      if (prev !== newState.isPinned) return newState.isPinned;
      return prev;
    });
  }, []);

  // Initialize stores
  useEffect(() => {
    dispatch(initializeStore());
    dispatch(initializeCart());
  }, [dispatch]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-2xl font-semibold text-gray-600">
          🚀 Please log in to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Sidebar */}
      <Sidebar
        userType={userType}
        onSidebarStateChange={handleSidebarStateChange}
      />

      {/* Main Content */}
      <div
        className={`
          flex-1 transition-all duration-300
          ${sidebarExpanded && sidebarPinned ? "lg:ml-64" : "lg:ml-0"}
        `}
      >
        <DashboardNavbar title={dashboardTitle} user={userInfo} />

        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;