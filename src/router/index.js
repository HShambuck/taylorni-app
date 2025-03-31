import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/auth";

// Public Views
const LandingPage = () => import("@/views/LandingPage.vue");
const About = () => import("@/views/About.vue");
const Contact = () => import("@/views/Contact.vue");

// Unified Dashboard
const LoginModal = () => import("@/components/ui/LoginModal.vue");
const SignupModal = () => import("@/components/ui/SignupModal.vue");
const Profile = () => import("@/views/Profile.vue");
const EditProfile = () => import("@/views/EditProfile.vue");
const Dashboard = () => import("@/components/Dashboard.vue"); // Unified Client/Designer Dashboard

// Client Views
const ClientOverview = () => import("@/components/client/ClientOverview.vue");
const ClientOrders = () => import("@/components/client/ClientOrders.vue");
const ClientOrderTracking = () =>
  import("@/components/client/OrderTracking.vue");
const ClientMeasurements = () =>
  import("@/components/client/ClientMeasurements.vue");
const ClientMarketplace = () =>
  import("@/components/client/ClientMarketplace.vue");
const ProductDetails = () => import("@/components/client/ProductDetails.vue");
const ShoppingCart = () => import("@/views/client/ShoppingCart.vue");
const CustomOrderForm = () => import("@/components/client/CustomOrderForm.vue");
const VirtualTryOn = () => import("@/components/client/VirtualTryOn.vue");

// Designer Views
const DesignerOverview = () =>
  import("@/components/designer/DesignerOverview.vue");
const DesignerOrders = () => import("@/components/designer/DesignerOrders.vue");
const DesignerClients = () =>
  import("@/components/designer/DesignerClients.vue");
const ManageDesigns = () => import("@/components/designer/ManageDesigns.vue");
const DesignerMarketplace = () =>
  import("@/components/designer/DesignerMarketplace.vue");
const ClientDetails = () => import("@/components/designer/ClientDetails.vue");
const DesignerShopSettings = () =>
  import("@/components/designer/DesignerShopSettings.vue");
const DesignerTryOn = () => import("@/components/designer/DesignerTryOn.vue");

// Fallback View
const NotFound = () => import("@/views/NotFound.vue");

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
  { path: "/login", component: LoginModal },
  { path: "/signup", component: SignupModal },
  // Unified Client Dashboard
  {
    path: "/client",
    component: Dashboard, // Unified Dashboard Component
    children: [
      { path: "", component: ClientOverview },
      { path: "orders", component: ClientOrders },
      { path: "orders/:id", component: ClientOrderTracking, props: true },
      { path: "measurements", component: ClientMeasurements },
      { path: "marketplace", component: ClientMarketplace },
      { path: "product/:id", component: ProductDetails, props: true },
      { path: "cart", component: ShoppingCart },
      { path: "custom-order", component: CustomOrderForm },
      { path: "try-on", component: VirtualTryOn },
      {
        path: "/profile",
        component: Profile,
        meta: { requiresAuth: true }, // Ensure the user is authenticated
      },
      { path: "/profile/edit", name: "EditProfile", component: EditProfile },
    ],
    meta: { showNav: false, showFooter: false },
  },

  // Unified Designer Dashboard
  {
    path: "/designer",
    component: Dashboard, // Unified Dashboard Component
    children: [
      { path: "", component: DesignerOverview },
      { path: "orders", component: DesignerOrders },
      { path: "clients", component: DesignerClients },
      { path: "clients/:id", component: ClientDetails, props: true },
      { path: "designs", component: ManageDesigns },
      { path: "marketplace", component: DesignerMarketplace },
      { path: "settings", component: DesignerShopSettings },
      { path: "try-on", component: DesignerTryOn },
      {
        path: "/profile",
        component: Profile,
        meta: { requiresAuth: true }, // Ensure the user is authenticated
      },
      { path: "/profile/edit", name: "EditProfile", component: EditProfile },
    ],
    meta: { showNav: false, showFooter: false },
  },

  // Fallback 404 Route
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: { showNav: false, showFooter: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next("/login");
  } else {
    // Proceed to the route
    next();
  }
});

export default router;
