const page = (summary, highlights, actions = []) => ({
  summary,
  highlights,
  actions,
});

export const PAGE_BLUEPRINTS = {
  Landing: page(
    "Discover designers, track orders, and manage your fashion experience in one mobile app.",
    ["Tailoring made easy", "Track every order stage", "Manage fittings on the go"],
    ["Browse Marketplace", "Start Custom Order"]
  ),
  About: page(
    "Taylorni connects clients and designers through a practical digital workflow.",
    ["Built for custom fashion", "Designer and client collaboration", "Transparent delivery flow"],
    ["Read Mission", "Meet Team"]
  ),
  Contact: page(
    "Reach support, track issue status, and contact the right team quickly.",
    ["Phone and email support", "Issue tracking", "Business partnerships"],
    ["Call Support", "Send Message"]
  ),
  Login: page(
    "Secure sign-in for clients and designers with role-based app access.",
    ["JWT-based backend auth", "Client and designer roles", "Persistent mobile sessions"],
    ["Sign In", "Create Account"]
  ),
  ClientOverview: page(
    "Your client dashboard with orders, fittings, and shopping insights.",
    ["Order progress", "Measurement profile", "Quick reorder options"],
    ["View Orders", "Open Marketplace"]
  ),
  ClientOrders: page(
    "Review all current and completed orders with status and timeline.",
    ["Pending and active jobs", "Delivery milestones", "Payment state overview"],
    ["Track Active Order", "Filter by Status"]
  ),
  OrderTracking: page(
    "Follow each production step from measurement confirmation to delivery.",
    ["Milestone updates", "Estimated completion", "Designer notes"],
    ["View Timeline", "Message Designer"]
  ),
  ClientMeasurements: page(
    "Store and update your latest body measurements for accurate tailoring.",
    ["Saved profiles", "Recent updates", "Measurement history"],
    ["Update Measurements", "Compare Profiles"]
  ),
  ClientMarketplace: page(
    "Browse ready-to-wear and custom-ready catalog items from designers.",
    ["Featured products", "Category filters", "Saved favorites"],
    ["Open Product", "Go to Cart"]
  ),
  ProductDetails: page(
    "Inspect fabric, pricing, and fit details before checkout.",
    ["Fabric specs", "Size recommendations", "Designer notes"],
    ["Add to Cart", "Save Product"]
  ),
  ShoppingCart: page(
    "Review selected products and proceed to checkout confidently.",
    ["Cart totals", "Quantity updates", "Delivery estimate"],
    ["Proceed to Checkout", "Continue Shopping"]
  ),
  CustomOrderForm: page(
    "Create a detailed custom order request with your preferred style choices.",
    ["Design references", "Fabric preferences", "Measurement links"],
    ["Submit Request", "Save Draft"]
  ),
  VirtualTryOn: page(
    "Preview outfit options in a guided virtual try-on flow.",
    ["Front and side preview", "Color variants", "Fit adjustments"],
    ["Start Try-On", "Save Snapshot"]
  ),
  DesignerOverview: page(
    "Designer control center for orders, clients, and catalog operations.",
    ["Revenue snapshot", "Open workload", "Client activity"],
    ["Manage Orders", "Add Product"]
  ),
  DesignerOrders: page(
    "Handle all incoming and active orders with fulfillment priorities.",
    ["Queue prioritization", "Due date visibility", "Status updates"],
    ["Create New Order", "Open Queue"]
  ),
  DesignerOrderDetails: page(
    "See material notes, fit requirements, and progress actions for an order.",
    ["Technical specs", "Client revisions", "Production checklist"],
    ["Update Stage", "Notify Client"]
  ),
  DesignerOrderNew: page(
    "Create a new order manually with client and product details.",
    ["Client assignment", "Price setup", "Deadline planning"],
    ["Create Order", "Assign Fitter"]
  ),
  DesignerCustomOrderNew: page(
    "Capture custom client preferences and generate a new production ticket.",
    ["Body profile link", "Design brief", "Fabric allocation"],
    ["Save Custom Order", "Request Deposit"]
  ),
  DesignerClients: page(
    "Manage your client list, order history, and communication threads.",
    ["Client segmentation", "Lifetime value", "Active conversations"],
    ["Open Client", "Start Message"]
  ),
  ClientDetails: page(
    "Deep view into one client profile, order habits, and measurements.",
    ["Profile overview", "Recent orders", "Alteration history"],
    ["Open Measurements", "Create Draft Order"]
  ),
  ManageDesigns: page(
    "Maintain your design catalog and visibility settings.",
    ["Publish state", "Price and stock", "Season collections"],
    ["New Design", "Archive Design"]
  ),
  DesignerProducts: page(
    "Control listed products and monitor conversion performance.",
    ["Top products", "Views vs sales", "Listing health"],
    ["Add Product", "Update Listing"]
  ),
  DesignerProductDetails: page(
    "Edit one product's details, media, and pricing.",
    ["Gallery and specs", "Variants and stock", "Pricing adjustments"],
    ["Edit Product", "Disable Listing"]
  ),
  DesignerProductNew: page(
    "Create a new product listing with media and variants.",
    ["Name and category", "Price and stock", "Preview before publish"],
    ["Publish Product", "Save Draft"]
  ),
  DesignerMeasurements: page(
    "Review client measurement profiles and historical changes.",
    ["Profile versions", "Alteration notes", "Measurement conflicts"],
    ["Add Measurement", "Approve Update"]
  ),
  DesignerShopSettings: page(
    "Configure business profile, shipping, and payment preferences.",
    ["Business identity", "Payout settings", "Shipping zones"],
    ["Save Settings", "Update Shop Profile"]
  ),
  DesignerTryOn: page(
    "Prepare style previews and fit simulation for client approvals.",
    ["Style overlays", "Fit checks", "Client preview sharing"],
    ["Generate Preview", "Share Link"]
  ),
  DesignerMessages: page(
    "Manage all client conversations and unread updates in one inbox.",
    ["Unread threads", "Priority clients", "Delivery confirmations"],
    ["Open Inbox", "Compose Message"]
  ),
  DesignerMessageThread: page(
    "Work within one client thread for approvals and production notes.",
    ["Timeline messages", "Attachment support", "Quick replies"],
    ["Send Update", "Attach Design"]
  ),
  DesignerPortfolio: page(
    "Showcase your best works and keep your public portfolio fresh.",
    ["Featured projects", "Engagement metrics", "Theme customization"],
    ["Add Project", "Reorder Gallery"]
  ),
  Profile: page(
    "Manage personal profile details visible to your account context.",
    ["Avatar and bio", "Contact details", "Social links"],
    ["Save Profile", "Change Avatar"]
  ),
  Settings: page(
    "Control app preferences, notifications, and security settings.",
    ["Push notifications", "Theme and language", "Password options"],
    ["Save Preferences", "Security Review"]
  ),
  NotFound: page(
    "The selected page route is unavailable in this version of the app.",
    ["Route mismatch", "Navigation fallback", "Quick recovery"],
    ["Go to Landing", "Open Dashboard"]
  ),
};

export const getPageBlueprint = (route) =>
  PAGE_BLUEPRINTS[route.name] ||
  page(
    `Native view for ${route.title}.`,
    ["Mobile-first layout", "Redux-ready state", "Expo Go compatible"],
    ["Back", "Home"]
  );
