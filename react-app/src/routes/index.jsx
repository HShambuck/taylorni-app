// src/routes/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import PublicLayout from "@/components/layouts/PublicLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/utils/ProtectedRoute";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loading loading-spinner loading-lg text-amber-500"></div>
  </div>
);

// Public Pages (lazy loaded)
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Profile Pages
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));

// Client Pages (lazy loaded)
const ClientOverview = lazy(() => import("@/pages/client/ClientOverview"));
const ClientOrders = lazy(() => import("@/pages/client/ClientOrders"));
const OrderTracking = lazy(() => import("@/pages/client/OrderTracking"));
const ClientMeasurements = lazy(() => import("@/pages/client/ClientMeasurements"));
const ClientMarketplace = lazy(() => import("@/pages/client/ClientMarketplace"));
const ProductDetails = lazy(() => import("@/pages/client/ProductDetails"));
const ShoppingCart = lazy(() => import("@/pages/client/ShoppingCart"));
const CustomOrderForm = lazy(() => import("@/pages/client/CustomOrderForm"));
const VirtualTryOn = lazy(() => import("@/pages/client/VirtualTryOn"));

// Designer Pages (lazy loaded)
const DesignerOverview = lazy(() => import("@/pages/designer/DesignerOverview"));
const DesignerOrders = lazy(() => import("@/pages/designer/DesignerOrders"));
const DesignerClients = lazy(() => import("@/pages/designer/DesignerClients"));
const ClientDetails = lazy(() => import("@/pages/designer/ClientDetails"));
const ManageDesigns = lazy(() => import("@/pages/designer/ManageDesigns"));
const DesignerMeasurements = lazy(() => import("@/pages/designer/DesignerMeasurements"));
const DesignerShopSettings = lazy(() => import("@/pages/designer/DesignerShopSettings"));
const DesignerTryOn = lazy(() => import("@/pages/designer/DesignerTryOn"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Client Dashboard Routes */}
        <Route
          path="/client"
          element={
            <DashboardLayout />
          }
        // element={
        //   <ProtectedRoute>
        //     <DashboardLayout />
        //   </ProtectedRoute>
        // }
        >
          <Route index element={<ClientOverview />} />
          <Route path="orders" element={<ClientOrders />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="measurements" element={<ClientMeasurements />} />
          <Route path="marketplace" element={<ClientMarketplace />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="custom-order" element={<CustomOrderForm />} />
          <Route path="try-on" element={<VirtualTryOn />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Designer Dashboard Routes */}
        <Route
          path="/designer"
          element={
            <DashboardLayout />
            // <ProtectedRoute>
            //   <DashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<DesignerOverview />} />
          <Route path="orders" element={<DesignerOrders />} />
          <Route path="clients" element={<DesignerClients />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="designs" element={<ManageDesigns />} />
          <Route path="measurements" element={<DesignerMeasurements />} />
          <Route path="settings" element={<DesignerShopSettings />} />
          <Route path="try-on" element={<DesignerTryOn />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;