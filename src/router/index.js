import { createRouter, createWebHistory } from "vue-router";

// Public Views
import LandingPage from "@/views/LandingPage.vue";
import About from "@/views/About.vue";
import Contact from "@/views/Contact.vue";

// Client Views
import ClientDashboard from "@/views/client/ClientDashboard.vue";
import ClientOrders from "@/components/client/ClientOrders.vue";
import ClientOrderDetails from "@/components/client/ClientOrderDetails.vue";
import ClientMeasurements from "@/components/client/ClientMeasurements.vue";
import ClientMarketplace from "@/components/client/ClientMarketplace.vue";
import ProductDetails from "@/components/client/ProductDetails.vue";
import ShoppingCart from "../views/client/ShoppingCart.vue";
import CustomOrderForm from "../components/client/CustomOrderForm.vue";
import ClientCustomOrders from "@/views/client/ClientCustomOrders.vue";
import VirtualTryOn from "@/components/client/VirtualTryOn.vue";
import ClientProfile from "@/components/client/ClientProfile.vue";

// Designer Views
import DesignerDashboard from "@/views/designer/DesignerDashboard.vue";
import DesignerCustomOrders from "@/views/designer/DesignerCustomOrders.vue";
import DesignerShop from "../views/designer/DesignerShop.vue";
import DesignerOrderMgt from "@/views/designer/DesignerOrderMgt.vue";
import DesignerClients from "@/components/designer/DesignerClients.vue";
import ManageDesigns from "@/components/designer/ManageDesigns.vue";
import DesignerMarketplace from "@/components/designer/DesignerMarketplace.vue";
import ClientDetails from "@/components/designer/ClientDetails.vue";
import DesignerOrderDetails from "@/components/designer/DesignerOrderDetails.vue";
import DesignerOrders from "@/components/designer/DesignerOrders.vue";
import DesignerProducts from "@/components/designer/DesignerProducts.vue";
import DesignerProfile from "@/components/designer/DesignerProfile.vue";
import DesignerShopSettings from "@/components/designer/DesignerShopSettings.vue";
import DesignerTryOn from "@/components/designer/DesignerTryOn.vue";



const routes = [
  // Public Routes
  {
    path: "/",
    component: LandingPage,
    meta: { showNav: true, showFooter: true },
  },
  {
    path: "/about",
    component: About,
    meta: { showNav: true, showFooter: true },
  },
  {
    path: "/contact",
    component: Contact,
    meta: { showNav: true, showFooter: true },
  },

  // Client Routes
  {
    path: "/client",
    component: ClientDashboard,
    children: [
      {
        path: "",
        component: () => import("@/components/client/ClientOverview.vue"),
      },
      { path: "orders", component: ClientOrders },
      { path: "orders/:id", component: ClientOrderDetails },
      { path: "measurements", component: ClientMeasurements },
      { path: "marketplace", component: ClientMarketplace },
      { path: "product/:id", component: ProductDetails, props: true },
      { path: "cart", component: ShoppingCart },
      { path: "custom-order", component: CustomOrderForm },
      { path: "my-custom-orders", component: ClientCustomOrders },
      { path: "try-on", component: VirtualTryOn },
      { path: "profile", component: ClientProfile },
    ],
    meta: { showNav: false, showFooter: false },
  },

  // Designer Routes
  {
    path: "/designer",
    component: DesignerDashboard,
    children: [
      {
        path: "",
        component: () => import("@/components/designer/DesignerOverview.vue"),
      }, 
      {path: "orders", component: DesignerOrders},
      {path: "clients", component: DesignerClients},
      {path: "clients/:id", component: ClientDetails, props: true},
      {path: "designs", component: ManageDesigns},
      {path: "marketplace", component: DesignerMarketplace},
    ],
    meta: { showNav: false, showFooter: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
