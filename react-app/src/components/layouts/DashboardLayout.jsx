// src/components/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Dashboard from "@/components/Dashboard";

const DashboardLayout = () => {
  // Dashboard component already handles Sidebar and DashboardNavbar
  // It uses <Outlet /> to render child routes
  return <Dashboard />;
};

export default DashboardLayout;