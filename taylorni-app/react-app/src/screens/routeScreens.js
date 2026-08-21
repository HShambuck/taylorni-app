import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PublicAboutScreen,
  PublicContactScreen,
  PublicLandingScreen,
  PublicLoginScreen,
} from "./publicScreens";
import africanPrintImage from "../assets/African-print.png";
import africanPrintAltImage from "../assets/African-print-alt.jpg";
import suitImage from "../assets/suit.jpg";
import eveningGownImage from "../assets/evening-gown.jpg";
import kenteImage from "../assets/Kente.webp";
import denimImage from "../assets/denim.jpeg";

const COLORS = {
  bg: "#0A0A0A",
  panel: "#1A1A1A",
  panelAlt: "#141414",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#FFFFFF",
  subtext: "rgba(255, 255, 255, 0.72)",
  muted: "rgba(255, 255, 255, 0.45)",
  primary: "#FFD700",
  amber: "#FFD700",
  green: "#FFD700",
  blue: "#FFD700",
};

const MARKETPLACE_PRODUCTS = [
  {
    id: "p-001",
    title: "Modern Ankara Dress",
    designer: "Ada Studio",
    price: 220,
    rating: 4.8,
    category: "Traditional",
    tag: "Best Seller",
    icon: "hanger",
    image: kenteImage,
  },
  {
    id: "p-002",
    title: "Classic Business Suit",
    designer: "Halifax Tailors",
    price: 380,
    rating: 4.9,
    category: "Formal",
    tag: "Premium",
    icon: "tshirt-crew-outline",
    image: suitImage,
  },
  {
    id: "p-003",
    title: "Casual Linen Set",
    designer: "Sima Brew",
    price: 145,
    rating: 4.6,
    category: "Casual",
    tag: "New",
    icon: "shoe-formal",
    image: denimImage,
  },
  {
    id: "p-004",
    title: "Kente Occasion Gown",
    designer: "Pistis Ghana",
    price: 410,
    rating: 4.9,
    category: "Traditional",
    tag: "Limited",
    icon: "face-woman-outline",
    image: eveningGownImage,
  },
  {
    id: "p-005",
    title: "Wedding Kaftan Set",
    designer: "Taylorni House",
    price: 520,
    rating: 5.0,
    category: "Wedding",
    tag: "Luxury",
    icon: "diamond-stone",
    image: eveningGownImage,
  },
  {
    id: "p-006",
    title: "Weekend Smart Shirt",
    designer: "Nyarko Atelier",
    price: 98,
    rating: 4.5,
    category: "Casual",
    tag: "Value",
    icon: "hanger",
    image: denimImage,
  },
];

const ACTION_ROUTE_MAP = {
  "View Orders": "ClientOrders",
  "Open Marketplace": "ClientMarketplace",
  "Virtual Try-On": "VirtualTryOn",
  "Track Selected": "OrderTracking",
  "New Custom Order": "CustomOrderForm",
  "Message Designer": "DesignerMessages",
  "Request Update": "ClientOrders",
  "Save Measurements": "ClientOverview",
  "Create New Profile": "ClientMeasurements",
  "Open Product": "ProductDetails",
  "Add Filter": "ClientMarketplace",
  "Add to Cart": "ShoppingCart",
  "Save Item": "ShoppingCart",
  Checkout: "ClientOverview",
  "Continue Shopping": "ClientMarketplace",
  "Submit Request": "ClientOrders",
  "Manage Orders": "DesignerOrders",
  "Add Product": "DesignerProductNew",
  "Open Messages": "DesignerMessages",
  "Create New Order": "DesignerOrderNew",
  "Open Order Board": "DesignerOrders",
  "Update Status": "DesignerOrders",
  "Message Client": "DesignerMessages",
  "Create Order": "DesignerOrders",
  "Create Custom Order": "DesignerOrders",
  "Request Deposit": "DesignerOrderDetails",
  "Open Client": "ClientDetails",
  "Start Thread": "DesignerMessageThread",
  "Open Measurements": "DesignerMeasurements",
  "Create Design": "ManageDesigns",
  "Publish Selected": "DesignerProducts",
  "Update Stock": "DesignerProducts",
  "Edit Product": "DesignerProductNew",
  "Disable Listing": "DesignerProducts",
  "Publish Product": "DesignerProducts",
  "Add Entry": "DesignerMeasurements",
  "Approve Changes": "DesignerClients",
  Send: "DesignerMessageThread",
  "Attach File": "DesignerMessageThread",
  "Add Project": "DesignerPortfolio",
  "Reorder Gallery": "DesignerPortfolio",
  "Save Profile": "Profile",
  "Go to Landing": "Home",
  "Open Dashboard": "ClientOverview",
};

const resolveActionRoute = (action, currentRouteName) => {
  if (action === "Save Settings") {
    return currentRouteName === "DesignerShopSettings" ? "DesignerOverview" : "Settings";
  }
  if (action === "Save Draft") {
    return currentRouteName.startsWith("Designer") ? "DesignerOrders" : "ClientOrders";
  }
  if (action === "Start Session" || action === "Switch Outfit" || action === "Save Snapshot") {
    return currentRouteName;
  }
  return ACTION_ROUTE_MAP[action] || currentRouteName;
};

const useActionPress = (currentRouteName) => {
  const navigation = useNavigation();

  return (action) => {
    const route = resolveActionRoute(action, currentRouteName);
    if (!route) {
      return;
    }
    navigation.navigate(route);
  };
};

const Screen = ({
  title,
  subtitle,
  children,
  accent = COLORS.primary,
  printSource = africanPrintImage,
}) => (
  <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.hero}>
      <Image source={printSource} style={styles.fabricTop} resizeMode="cover" />
      <Text style={[styles.heroTag, { color: accent }]}>{title}</Text>
      <Text style={styles.heroSub}>{subtitle}</Text>
    </View>
    {children}
  </ScrollView>
);

const Section = ({ title, children }) => (
  <View style={styles.panel}>
    <Image source={africanPrintImage} style={styles.fabricLeft} resizeMode="cover" />
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const StatGrid = ({ items }) => {
  const { width } = useWindowDimensions();
  const columns = width < 600 ? 1 : width < 900 ? 2 : 3;
  const cardWidth = columns === 1 ? "100%" : columns === 2 ? "48.5%" : "31.8%";

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={[styles.statCard, { width: cardWidth }]}>
          <Image source={africanPrintImage} style={styles.fabricTopThin} resizeMode="cover" />
          <Text style={styles.statLabel}>{item.label}</Text>
          <Text style={styles.statValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const ActionRow = ({ actions, onActionPress }) => {
  const { width } = useWindowDimensions();
  const stackActions = width < 520;

  return (
    <View style={styles.actions}>
      {actions.map((action) => (
        <Pressable
          key={action}
          style={[styles.actionBtn, stackActions && styles.actionBtnStacked]}
          onPress={() => onActionPress?.(action)}
          accessibilityRole="button"
          accessibilityLabel={action}
        >
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const ListRows = ({ rows }) => (
  <View style={styles.list}>
    {rows.map((row) => (
      <View key={row.title} style={styles.row}>
        <Image source={africanPrintImage} style={styles.fabricTopThin} resizeMode="cover" />
        <View style={styles.rowMain}>
          <Text style={styles.rowTitle}>{row.title}</Text>
          {row.subtitle ? <Text style={styles.rowSub}>{row.subtitle}</Text> : null}
        </View>
        {row.trailing ? <Text style={styles.rowTrailing}>{row.trailing}</Text> : null}
      </View>
    ))}
  </View>
);

const OverviewTemplate = ({ title, subtitle, stats, rows, actions, accent, onActionPress }) => (
  <Screen title={title} subtitle={subtitle} accent={accent}>
    <StatGrid items={stats} />
    <Section title="Recent Activity">
      <ListRows rows={rows} />
    </Section>
    <Section title="Quick Actions">
      <ActionRow actions={actions} onActionPress={onActionPress} />
    </Section>
  </Screen>
);

const ListTemplate = ({ title, subtitle, filters, rows, actions, accent, onActionPress }) => (
  <Screen title={title} subtitle={subtitle} accent={accent}>
    <Section title="Filters">
      <View style={styles.tags}>
        {filters.map((filter) => (
          <View key={filter} style={styles.tag}>
            <Text style={styles.tagText}>{filter}</Text>
          </View>
        ))}
      </View>
    </Section>
    <Section title="Items">
      <ListRows rows={rows} />
    </Section>
    <ActionRow actions={actions} onActionPress={onActionPress} />
  </Screen>
);

const DetailTemplate = ({ title, subtitle, facts, timeline, actions, accent, onActionPress }) => (
  <Screen title={title} subtitle={subtitle} accent={accent}>
    <Section title="Details">
      <StatGrid items={facts} />
    </Section>
    <Section title="Timeline">
      <ListRows rows={timeline} />
    </Section>
    <ActionRow actions={actions} onActionPress={onActionPress} />
  </Screen>
);

const MarketplaceTemplate = ({ title, subtitle, accent, onActionPress }) => {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Traditional", "Formal", "Casual", "Wedding"];
  const cardWidth = width < 360 ? "100%" : "48.5%";

  const filteredProducts = MARKETPLACE_PRODUCTS.filter((product) => {
    const categoryMatch = category === "All" || product.category === category;
    const queryMatch =
      product.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      product.designer.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && queryMatch;
  });

  return (
    <Screen
      title={title}
      subtitle={subtitle}
      accent={accent}
      printSource={africanPrintAltImage}
    >
      <View style={styles.marketPanel}>
        <Image source={africanPrintAltImage} style={styles.fabricTop} resizeMode="cover" />
        <View style={styles.marketSearchRow}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products or designers"
            placeholderTextColor={COLORS.muted}
            style={styles.marketSearchInput}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.marketCategoryRow}
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            style={[styles.marketCategoryChip, category === item && styles.marketCategoryChipActive]}
          >
            <Text style={[styles.marketCategoryText, category === item && styles.marketCategoryTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.marketPromoCard}>
        <Image source={africanPrintAltImage} style={styles.marketPromoPrint} resizeMode="cover" />
        <View style={styles.marketPromoContent}>
          <View>
            <Text style={styles.marketPromoTitle}>Today&apos;s Spotlight</Text>
            <Text style={styles.marketPromoSub}>20% off selected traditional pieces</Text>
          </View>
          <Pressable style={styles.marketPromoBtn} onPress={() => onActionPress?.("Open Product")}>
            <Text style={styles.marketPromoBtnText}>Shop Now</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.marketGrid}>
        {filteredProducts.map((product) => (
          <View key={product.id} style={[styles.marketCard, { width: cardWidth }]}>
            <Image source={product.image} style={styles.marketImage} resizeMode="cover" />
            <View style={styles.marketImageOverlay} />
            <View style={styles.marketBadge}>
              <Text style={styles.marketBadgeText}>{product.tag}</Text>
            </View>
            <View style={styles.marketIconWrap}>
              <MaterialCommunityIcons name={product.icon} size={24} color={COLORS.primary} />
            </View>

            <View style={styles.marketBody}>
              <Text style={styles.marketTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.marketDesigner}>{product.designer}</Text>
              <View style={styles.marketMetaRow}>
                <Text style={styles.marketPrice}>${product.price}</Text>
                <Text style={styles.marketRating}>
                  <MaterialCommunityIcons name="star" size={12} color={COLORS.primary} /> {product.rating}
                </Text>
              </View>
              <View style={styles.marketActionRow}>
                <Pressable style={styles.marketGhostBtn} onPress={() => onActionPress?.("Add to Cart")}>
                  <MaterialCommunityIcons name="cart-outline" size={16} color={COLORS.primary} />
                </Pressable>
                <Pressable style={styles.marketPrimaryBtn} onPress={() => onActionPress?.("Open Product")}>
                  <Text style={styles.marketPrimaryBtnText}>View</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.marketFooterActions}>
        <Pressable style={styles.marketFooterBtnPrimary} onPress={() => onActionPress?.("Open Product")}>
          <MaterialCommunityIcons name="shopping-outline" size={16} color={COLORS.bg} />
          <Text style={styles.marketFooterBtnPrimaryText}>Open Product</Text>
        </Pressable>
        <Pressable style={styles.marketFooterBtnSecondary} onPress={() => onActionPress?.("Add Filter")}>
          <MaterialCommunityIcons name="filter-variant" size={16} color={COLORS.primary} />
          <Text style={styles.marketFooterBtnSecondaryText}>Add Filter</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

const FormTemplate = ({ title, subtitle, fields, actions, accent, onActionPress }) => {
  const [values, setValues] = useState({});

  return (
    <Screen title={title} subtitle={subtitle} accent={accent}>
      <Section title="Form">
        {fields.map((field) => (
          <View key={field} style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{field}</Text>
            <TextInput
              value={values[field] || ""}
              onChangeText={(text) => setValues((prev) => ({ ...prev, [field]: text }))}
              placeholder={`Enter ${field.toLowerCase()}`}
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
          </View>
        ))}
      </Section>
      <ActionRow actions={actions} onActionPress={onActionPress} />
    </Screen>
  );
};

const MessageTemplate = ({ title, subtitle, threads, accent, onActionPress }) => (
  <Screen title={title} subtitle={subtitle} accent={accent}>
    <Section title="Conversations">
      <ListRows rows={threads} />
    </Section>
    <Section title="Composer">
      <TextInput
        multiline
        placeholder="Type a message..."
        placeholderTextColor={COLORS.muted}
        style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
      />
      <ActionRow actions={["Send", "Attach File"]} onActionPress={onActionPress} />
    </Section>
  </Screen>
);

const TryOnTemplate = ({ title, subtitle, accent, onActionPress }) => (
  <Screen title={title} subtitle={subtitle} accent={accent}>
    <Section title="Preview Canvas">
      <View style={styles.previewArea}>
        <Text style={styles.previewText}>3D/AR Preview Area</Text>
      </View>
      <ActionRow
        actions={["Start Session", "Switch Outfit", "Save Snapshot"]}
        onActionPress={onActionPress}
      />
    </Section>
    <Section title="Fit Notes">
      <ListRows
        rows={[
          { title: "Shoulder fit", trailing: "Good" },
          { title: "Waist fit", trailing: "Adjust +1" },
          { title: "Length fit", trailing: "Good" },
        ]}
      />
    </Section>
  </Screen>
);

const LandingScreen = () => (
  <Screen
    title="Taylorni Landing"
    subtitle="Track orders, measurements, marketplace, and designer collaboration."
    accent={COLORS.amber}
  >
    <Section title="Core Features">
      <StatGrid
        items={[
          { label: "Orders", value: "Live tracking" },
          { label: "Measurements", value: "Stored profiles" },
          { label: "Marketplace", value: "Design catalog" },
        ]}
      />
    </Section>
    <Section title="How It Works">
      <ListRows
        rows={[
          { title: "1. Create account", subtitle: "Join as client or designer" },
          { title: "2. Place or receive orders", subtitle: "Custom and ready-made" },
          { title: "3. Track production", subtitle: "Status and communication" },
        ]}
      />
    </Section>
    <ActionRow actions={["Get Started", "Learn More", "Contact Team"]} />
  </Screen>
);

const AboutScreen = () => (
  <Screen
    title="About Taylorni"
    subtitle="A digital fashion workflow connecting designers and clients."
    accent={COLORS.primary}
  >
    <Section title="Mission">
      <Text style={styles.paragraph}>
        Make custom fashion easier through one mobile-first workflow for orders,
        fitting, communication, and delivery.
      </Text>
    </Section>
    <Section title="Values">
      <ListRows
        rows={[
          { title: "Innovation", subtitle: "Fashion + technology" },
          { title: "Collaboration", subtitle: "Designer-client in sync" },
          { title: "Sustainability", subtitle: "Efficient production flow" },
        ]}
      />
    </Section>
  </Screen>
);

const ContactScreen = () => (
  <Screen
    title="Contact"
    subtitle="Support channels and direct communication with the team."
    accent={COLORS.green}
  >
    <Section title="Reach Us">
      <ListRows
        rows={[
          { title: "Email", trailing: "support@taylorni.app" },
          { title: "Phone", trailing: "+233 000 000 000" },
          { title: "Business", trailing: "Partnership requests" },
        ]}
      />
    </Section>
    <Section title="Send Message">
      <TextInput placeholder="Subject" style={styles.input} placeholderTextColor={COLORS.muted} />
      <TextInput
        multiline
        placeholder="How can we help?"
        style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]}
        placeholderTextColor={COLORS.muted}
      />
      <ActionRow actions={["Submit"]} />
    </Section>
  </Screen>
);

const LoginScreen = () => (
  <Screen title="Login" subtitle="Sign in to your account." accent={COLORS.blue}>
    <Section title="Credentials">
      <TextInput placeholder="Email" style={styles.input} placeholderTextColor={COLORS.muted} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        placeholderTextColor={COLORS.muted}
      />
      <ActionRow actions={["Sign In", "Create Account"]} />
    </Section>
  </Screen>
);

const ProfileScreen = ({ onActionPress }) => (
  <Screen title="Profile" subtitle="Manage account profile details." accent={COLORS.primary}>
    <Section title="Personal Info">
      <TextInput placeholder="First Name" style={styles.input} placeholderTextColor={COLORS.muted} />
      <TextInput placeholder="Last Name" style={styles.input} placeholderTextColor={COLORS.muted} />
      <TextInput placeholder="Email" style={styles.input} placeholderTextColor={COLORS.muted} />
      <ActionRow actions={["Save Profile"]} onActionPress={onActionPress} />
    </Section>
  </Screen>
);

const SettingsScreen = ({ onActionPress }) => {
  const [push, setPush] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <Screen title="Settings" subtitle="Preferences, notifications, and security." accent={COLORS.green}>
      <Section title="Preferences">
        <View style={styles.switchRow}>
          <Text style={styles.rowTitle}>Push Notifications</Text>
          <Switch value={push} onValueChange={setPush} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.rowTitle}>Dark Theme</Text>
          <Switch value={dark} onValueChange={setDark} />
        </View>
      </Section>
      <ActionRow actions={["Save Settings"]} onActionPress={onActionPress} />
    </Screen>
  );
};

const NotFoundScreen = ({ onActionPress }) => (
  <Screen title="Not Found" subtitle="This route is not available." accent={COLORS.primary}>
    <Section title="Navigation">
      <ActionRow actions={["Go to Landing", "Open Dashboard"]} onActionPress={onActionPress} />
    </Section>
  </Screen>
);

export const SCREEN_COMPONENTS = {
  Home: PublicLandingScreen,
  Landing: PublicLandingScreen,
  About: PublicAboutScreen,
  Contact: PublicContactScreen,
  Login: PublicLoginScreen,

  ClientOverview: () => {
    const onActionPress = useActionPress("ClientOverview");
    return (
      <OverviewTemplate
      title="Client Overview"
      subtitle="Dashboard for orders, measurements, and quick actions."
      accent={COLORS.blue}
      stats={[
        { label: "Active Orders", value: "3" },
        { label: "Saved Profiles", value: "2" },
        { label: "Cart Items", value: "4" },
      ]}
      rows={[
        { title: "Custom Kente Suit", subtitle: "In progress", trailing: "Due 3d" },
        { title: "Denim Jacket", subtitle: "Completed", trailing: "Delivered" },
      ]}
      actions={["View Orders", "Open Marketplace", "Virtual Try-On"]}
      onActionPress={onActionPress}
    />
    );
  },
  ClientOrders: () => {
    const onActionPress = useActionPress("ClientOrders");
    return (
      <ListTemplate
      title="Client Orders"
      subtitle="All order records and statuses."
      accent={COLORS.blue}
      filters={["All", "In Progress", "Completed", "Canceled"]}
      rows={[
        { title: "Order #C-1001", subtitle: "Custom dress", trailing: "In progress" },
        { title: "Order #C-0998", subtitle: "Formal suit", trailing: "Completed" },
      ]}
      actions={["Track Selected", "New Custom Order"]}
      onActionPress={onActionPress}
    />
    );
  },
  OrderTracking: () => {
    const onActionPress = useActionPress("OrderTracking");
    return (
      <DetailTemplate
      title="Order Tracking"
      subtitle="Progress milestones and updates."
      accent={COLORS.blue}
      facts={[
        { label: "Order", value: "#C-1001" },
        { label: "Status", value: "In Progress" },
        { label: "ETA", value: "3 Days" },
      ]}
      timeline={[
        { title: "Measurement confirmed", subtitle: "Completed" },
        { title: "Cutting", subtitle: "Completed" },
        { title: "Sewing", subtitle: "In progress" },
      ]}
      actions={["Message Designer", "Request Update"]}
      onActionPress={onActionPress}
    />
    );
  },
  ClientMeasurements: () => {
    const onActionPress = useActionPress("ClientMeasurements");
    return (
      <FormTemplate
      title="Client Measurements"
      subtitle="Capture and update body measurements."
      accent={COLORS.blue}
      fields={["Chest", "Waist", "Hip", "Shoulder", "Length"]}
      actions={["Save Measurements", "Create New Profile"]}
      onActionPress={onActionPress}
    />
    );
  },
  ClientMarketplace: () => {
    const onActionPress = useActionPress("ClientMarketplace");
    return (
      <MarketplaceTemplate
        title="Client Marketplace"
        subtitle="Browse designer products."
        accent={COLORS.blue}
        onActionPress={onActionPress}
      />
    );
  },
  ProductDetails: () => {
    const onActionPress = useActionPress("ProductDetails");
    return (
      <DetailTemplate
      title="Product Details"
      subtitle="Inspect item specs before buying."
      accent={COLORS.blue}
      facts={[
        { label: "Price", value: "$380" },
        { label: "Fabric", value: "Cotton blend" },
        { label: "Lead Time", value: "5 days" },
      ]}
      timeline={[
        { title: "Designer", subtitle: "Halifax Tailors" },
        { title: "Care", subtitle: "Dry clean recommended" },
      ]}
      actions={["Add to Cart", "Save Item"]}
      onActionPress={onActionPress}
    />
    );
  },
  ShoppingCart: () => {
    const onActionPress = useActionPress("ShoppingCart");
    return (
      <ListTemplate
      title="Shopping Cart"
      subtitle="Review selected products before checkout."
      accent={COLORS.blue}
      filters={["In Cart", "Saved for Later"]}
      rows={[
        { title: "Business Suit", subtitle: "Qty 1", trailing: "$380" },
        { title: "Ankara Shirt", subtitle: "Qty 2", trailing: "$160" },
      ]}
      actions={["Checkout", "Continue Shopping"]}
      onActionPress={onActionPress}
    />
    );
  },
  CustomOrderForm: () => {
    const onActionPress = useActionPress("CustomOrderForm");
    return (
      <FormTemplate
      title="Custom Order Form"
      subtitle="Submit a custom tailoring request."
      accent={COLORS.blue}
      fields={["Order Title", "Budget", "Deadline", "Design Notes"]}
      actions={["Submit Request", "Save Draft"]}
      onActionPress={onActionPress}
    />
    );
  },
  VirtualTryOn: () => {
    const onActionPress = useActionPress("VirtualTryOn");
    return (
      <TryOnTemplate
      title="Virtual Try-On"
      subtitle="Preview outfits and fit simulations."
      accent={COLORS.blue}
      onActionPress={onActionPress}
    />
    );
  },

  DesignerOverview: () => {
    const onActionPress = useActionPress("DesignerOverview");
    return (
      <OverviewTemplate
      title="Designer Overview"
      subtitle="Orders, clients, and revenue in one dashboard."
      accent={COLORS.primary}
      stats={[
        { label: "Open Orders", value: "7" },
        { label: "Monthly Revenue", value: "$3,240" },
        { label: "Active Listings", value: "12" },
      ]}
      rows={[
        { title: "Order #D-2301", subtitle: "Client: Jane Cooper", trailing: "Pending" },
        { title: "Order #D-2297", subtitle: "Client: Alex Morgan", trailing: "In progress" },
      ]}
      actions={["Manage Orders", "Add Product", "Open Messages"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerOrders: () => {
    const onActionPress = useActionPress("DesignerOrders");
    return (
      <ListTemplate
      title="Designer Orders"
      subtitle="All assigned and created orders."
      accent={COLORS.primary}
      filters={["All", "Pending", "In Progress", "Completed"]}
      rows={[
        { title: "Order #D-2301", subtitle: "Custom Kente Suit", trailing: "Pending" },
        { title: "Order #D-2300", subtitle: "Evening Gown", trailing: "In progress" },
      ]}
      actions={["Create New Order", "Open Order Board"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerOrderDetails: () => {
    const onActionPress = useActionPress("DesignerOrderDetails");
    return (
      <DetailTemplate
      title="Designer Order Details"
      subtitle="Materials, tasks, and client requirements."
      accent={COLORS.primary}
      facts={[
        { label: "Order", value: "#D-2301" },
        { label: "Client", value: "Jane Cooper" },
        { label: "Value", value: "$450" },
      ]}
      timeline={[
        { title: "Fabric selected", subtitle: "Done" },
        { title: "Pattern drafting", subtitle: "Done" },
        { title: "Assembly", subtitle: "In progress" },
      ]}
      actions={["Update Status", "Message Client"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerOrderNew: () => {
    const onActionPress = useActionPress("DesignerOrderNew");
    return (
      <FormTemplate
      title="Designer New Order"
      subtitle="Create a new order entry."
      accent={COLORS.primary}
      fields={["Client", "Product", "Amount", "Deadline"]}
      actions={["Create Order", "Save Draft"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerCustomOrderNew: () => {
    const onActionPress = useActionPress("DesignerCustomOrderNew");
    return (
      <FormTemplate
      title="Designer Custom Order"
      subtitle="Create a custom production request."
      accent={COLORS.primary}
      fields={["Client", "Design Brief", "Measurement Profile", "Quoted Price"]}
      actions={["Create Custom Order", "Request Deposit"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerClients: () => {
    const onActionPress = useActionPress("DesignerClients");
    return (
      <ListTemplate
      title="Designer Clients"
      subtitle="Client directory and order history."
      accent={COLORS.primary}
      filters={["All", "Active", "Top Clients"]}
      rows={[
        { title: "Jane Cooper", subtitle: "5 completed orders", trailing: "Active" },
        { title: "Alex Morgan", subtitle: "2 active orders", trailing: "Active" },
      ]}
      actions={["Open Client", "Start Thread"]}
      onActionPress={onActionPress}
    />
    );
  },
  ClientDetails: () => {
    const onActionPress = useActionPress("ClientDetails");
    return (
      <DetailTemplate
      title="Client Details"
      subtitle="Profile, measurements, and order behavior."
      accent={COLORS.primary}
      facts={[
        { label: "Client", value: "Jane Cooper" },
        { label: "Completed Orders", value: "5" },
        { label: "Open Orders", value: "1" },
      ]}
      timeline={[
        { title: "Last measurement update", subtitle: "2026-02-10" },
        { title: "Latest order", subtitle: "Custom suit in progress" },
      ]}
      actions={["Open Measurements", "Create New Order"]}
      onActionPress={onActionPress}
    />
    );
  },
  ManageDesigns: () => {
    const onActionPress = useActionPress("ManageDesigns");
    return (
      <ListTemplate
      title="Manage Designs"
      subtitle="Publish and maintain design catalog."
      accent={COLORS.primary}
      filters={["Published", "Draft", "Archived"]}
      rows={[
        { title: "Ankara Collection 2026", subtitle: "8 products", trailing: "Published" },
        { title: "Formal Capsule", subtitle: "3 products", trailing: "Draft" },
      ]}
      actions={["Create Design", "Publish Selected"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerProducts: () => {
    const onActionPress = useActionPress("DesignerProducts");
    return (
      <ListTemplate
      title="Designer Products"
      subtitle="Product listings and performance."
      accent={COLORS.primary}
      filters={["All", "Top sellers", "Low stock"]}
      rows={[
        { title: "Modern African Dress", subtitle: "27 sales", trailing: "$320" },
        { title: "Traditional Kente Cloth", subtitle: "14 sales", trailing: "$450" },
      ]}
      actions={["Add Product", "Update Stock"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerProductDetails: () => {
    const onActionPress = useActionPress("DesignerProductDetails");
    return (
      <DetailTemplate
      title="Designer Product Details"
      subtitle="Edit listing content and pricing."
      accent={COLORS.primary}
      facts={[
        { label: "Product", value: "Modern African Dress" },
        { label: "Price", value: "$320" },
        { label: "Stock", value: "19" },
      ]}
      timeline={[
        { title: "Last updated", subtitle: "2026-02-18" },
        { title: "Views this week", subtitle: "146" },
      ]}
      actions={["Edit Product", "Disable Listing"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerProductNew: () => {
    const onActionPress = useActionPress("DesignerProductNew");
    return (
      <FormTemplate
      title="Designer New Product"
      subtitle="Create a fresh product listing."
      accent={COLORS.primary}
      fields={["Name", "Price", "Category", "Stock", "Description"]}
      actions={["Publish Product", "Save Draft"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerMeasurements: () => {
    const onActionPress = useActionPress("DesignerMeasurements");
    return (
      <ListTemplate
      title="Designer Measurements"
      subtitle="Client measurement records and updates."
      accent={COLORS.primary}
      filters={["All Clients", "Recent", "Needs Review"]}
      rows={[
        { title: "Jane Cooper profile", subtitle: "Updated 2 days ago", trailing: "Reviewed" },
        { title: "Alex Morgan profile", subtitle: "Updated today", trailing: "Pending" },
      ]}
      actions={["Add Entry", "Approve Changes"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerShopSettings: () => {
    const onActionPress = useActionPress("DesignerShopSettings");
    return (
      <FormTemplate
      title="Designer Shop Settings"
      subtitle="Shop profile, payout, and shipping setup."
      accent={COLORS.primary}
      fields={["Shop Name", "Location", "Payout Account", "Shipping Zones"]}
      actions={["Save Settings"]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerTryOn: () => {
    const onActionPress = useActionPress("DesignerTryOn");
    return (
      <TryOnTemplate
      title="Designer Try-On"
      subtitle="Prepare style previews for client approvals."
      accent={COLORS.primary}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerMessages: () => {
    const onActionPress = useActionPress("DesignerMessages");
    return (
      <MessageTemplate
      title="Designer Messages"
      subtitle="Client communication inbox."
      accent={COLORS.primary}
      threads={[
        { title: "Jane Cooper", subtitle: "Can we adjust sleeve length?", trailing: "2m" },
        { title: "Alex Morgan", subtitle: "Approved. Start production.", trailing: "1h" },
      ]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerMessageThread: () => {
    const onActionPress = useActionPress("DesignerMessageThread");
    return (
      <MessageTemplate
      title="Message Thread"
      subtitle="Conversation details and replies."
      accent={COLORS.primary}
      threads={[
        { title: "Client", subtitle: "Please switch to darker fabric", trailing: "10:05" },
        { title: "You", subtitle: "Confirmed. Updating now.", trailing: "10:12" },
      ]}
      onActionPress={onActionPress}
    />
    );
  },
  DesignerPortfolio: () => {
    const onActionPress = useActionPress("DesignerPortfolio");
    return (
      <ListTemplate
      title="Designer Portfolio"
      subtitle="Featured works and showcase management."
      accent={COLORS.primary}
      filters={["Featured", "Recent", "Archived"]}
      rows={[
        { title: "Kente Wedding Set", subtitle: "Engagement high", trailing: "Featured" },
        { title: "Executive Suits", subtitle: "Corporate collection", trailing: "Recent" },
      ]}
      actions={["Add Project", "Reorder Gallery"]}
      onActionPress={onActionPress}
    />
    );
  },

  Profile: () => {
    const onActionPress = useActionPress("Profile");
    return <ProfileScreen onActionPress={onActionPress} />;
  },
  Settings: () => {
    const onActionPress = useActionPress("Settings");
    return <SettingsScreen onActionPress={onActionPress} />;
  },
  NotFound: () => {
    const onActionPress = useActionPress("NotFound");
    return <NotFoundScreen onActionPress={onActionPress} />;
  },
};

export const getScreenByRouteName = (routeName) =>
  SCREEN_COMPONENTS[routeName] || SCREEN_COMPONENTS.NotFound;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 14,
    gap: 12,
  },
  hero: {
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    paddingTop: 16,
    position: "relative",
    overflow: "hidden",
  },
  heroTag: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: COLORS.subtext,
  },
  panel: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    paddingLeft: 14,
    position: "relative",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subtext,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    minWidth: 96,
    borderRadius: 10,
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    paddingTop: 12,
    position: "relative",
    overflow: "hidden",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBtn: {
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  actionBtnStacked: {
    width: "100%",
    alignItems: "center",
  },
  actionText: {
    color: COLORS.bg,
    fontWeight: "600",
    fontSize: 13,
  },
  list: {
    gap: 8,
  },
  row: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: COLORS.panelAlt,
    position: "relative",
    overflow: "hidden",
  },
  rowMain: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  rowSub: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.subtext,
  },
  rowTrailing: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 215, 0, 0.14)",
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  marketPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    overflow: "hidden",
  },
  marketSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.panelAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  marketSearchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 0,
  },
  marketCategoryRow: {
    paddingVertical: 6,
    gap: 8,
  },
  marketCategoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panelAlt,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  marketCategoryChipActive: {
    backgroundColor: "rgba(255, 215, 0, 0.16)",
    borderColor: "rgba(255, 215, 0, 0.35)",
  },
  marketCategoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.subtext,
  },
  marketCategoryTextActive: {
    color: COLORS.primary,
  },
  marketPromoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  marketPromoPrint: {
    width: "100%",
    height: 4,
  },
  marketPromoContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 12,
  },
  marketPromoTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  marketPromoSub: {
    marginTop: 2,
    color: COLORS.subtext,
    fontSize: 12,
  },
  marketPromoBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  marketPromoBtnText: {
    color: COLORS.bg,
    fontSize: 12,
    fontWeight: "700",
  },
  marketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  marketCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  marketImage: {
    width: "100%",
    height: 110,
  },
  marketImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.55)",
  },
  marketBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(10, 10, 10, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  marketBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  marketIconWrap: {
    position: "absolute",
    right: 10,
    top: 74,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(10, 10, 10, 0.78)",
  },
  marketBody: {
    padding: 10,
    paddingTop: 12,
  },
  marketTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  marketDesigner: {
    marginTop: 2,
    color: COLORS.subtext,
    fontSize: 11,
  },
  marketMetaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  marketPrice: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  marketRating: {
    color: COLORS.subtext,
    fontSize: 11,
    fontWeight: "600",
  },
  marketActionRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  marketGhostBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.4)",
    backgroundColor: "rgba(255, 215, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  marketPrimaryBtn: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  marketPrimaryBtnText: {
    color: COLORS.bg,
    fontSize: 12,
    fontWeight: "700",
  },
  marketFooterActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  marketFooterBtnPrimary: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  marketFooterBtnPrimaryText: {
    color: COLORS.bg,
    fontSize: 13,
    fontWeight: "700",
  },
  marketFooterBtnSecondary: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.45)",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  marketFooterBtnSecondaryText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  fieldWrap: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.panelAlt,
    color: COLORS.text,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  previewArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 12,
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.panelAlt,
    marginBottom: 10,
  },
  previewText: {
    color: COLORS.muted,
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: COLORS.panelAlt,
  },
  fabricTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  fabricTopThin: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  fabricLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
});
