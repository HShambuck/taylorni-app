import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROUTES } from "./routeConfig";
import { getScreenByRouteName } from "../screens/routeScreens";
import { OnboardingScreen } from "../screens/publicScreens";
import { selectUserType } from "../store/slices/authSlice";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const ONBOARDING_KEY = "@taylorni_has_launched_v2";

const THEME = {
  headerBg: "#0A0A0A",
  headerText: "#FFD700",
  drawerBg: "#141414",
  drawerActive: "#FFD700",
  drawerText: "#FFD700",
  groupTitle: "#FFD700",
  drawerBorder: "rgba(255, 255, 255, 0.12)",
  menuBg: "rgba(255, 215, 0, 0.14)",
  sceneBg: "#0A0A0A",
};

const MAIN_SECTION = {
  routeNames: ["Home", "About", "Contact", "Login"],
};

const CLIENT_SECTION = {
  routeNames: [
    "ClientOverview",
    "ClientOrders",
    "ClientMarketplace",
    "ClientMeasurements",
    "VirtualTryOn",
  ],
};

const DESIGNER_SECTION = {
  routeNames: [
    "DesignerOverview",
    "DesignerOrders",
    "DesignerProducts",
    "DesignerClients",
    "DesignerMessages",
    "DesignerPortfolio",
  ],
};

const ACCOUNT_SECTION = {
  routeNames: ["Profile", "Settings"],
};

const DRAWER_ICON_BY_ROUTE = {
  Home: "home-outline",
  About: "information-circle-outline",
  Contact: "chatbubbles-outline",
  Login: "log-in-outline",
  ClientOverview: "grid-outline",
  ClientOrders: "receipt-outline",
  ClientMarketplace: "bag-handle-outline",
  ClientMeasurements: "resize-outline",
  VirtualTryOn: "body-outline",
  DesignerOverview: "analytics-outline",
  DesignerOrders: "clipboard-outline",
  DesignerProducts: "pricetags-outline",
  DesignerClients: "people-outline",
  DesignerMessages: "mail-outline",
  DesignerPortfolio: "images-outline",
  Profile: "person-outline",
  Settings: "settings-outline",
};

const ROUTE_TITLE_OVERRIDES = {
  ClientOverview: "Overview",
  ClientOrders: "Orders",
  ClientMarketplace: "Marketplace",
  ClientMeasurements: "Measurements",
  VirtualTryOn: "Virtual Try-On",
  DesignerOverview: "Overview",
  DesignerOrders: "Orders",
  DesignerProducts: "Products",
  DesignerClients: "Clients",
  DesignerMessages: "Messages",
  DesignerPortfolio: "Portfolio",
};

function buildPageComponent(route) {
  return getScreenByRouteName(route.name);
}

const routeComponents = Object.fromEntries(
  ROUTES.map((route) => [route.name, buildPageComponent(route)])
);

function DrawerToggleButton() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.menuButton}
      accessibilityRole="button"
      accessibilityLabel="Toggle navigation menu"
    >
      <Ionicons name="menu" size={24} color={THEME.headerText} />
    </Pressable>
  );
}

function getDrawerRouteNames(role) {
  const workspaceRoutes =
    role === "designer" ? DESIGNER_SECTION.routeNames : CLIENT_SECTION.routeNames;
  return [...MAIN_SECTION.routeNames, ...workspaceRoutes, ...ACCOUNT_SECTION.routeNames];
}

function getRouteTitle(route) {
  return ROUTE_TITLE_OVERRIDES[route.name] || route.title;
}

function CustomDrawerContent(props) {
  const userType = useSelector(selectUserType);
  const effectiveRole = userType === "designer" ? "designer" : "client";
  const routeByName = new Map(ROUTES.map((route) => [route.name, route]));
  const drawerRoutes = getDrawerRouteNames(effectiveRole)
    .map((name) => routeByName.get(name))
    .filter(Boolean);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerList}>
        {drawerRoutes.map((route) => (
          <DrawerItem
            key={route.name}
            label={getRouteTitle(route)}
            onPress={() => props.navigation.navigate(route.name)}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={({ color, size }) => (
              <Ionicons
                name={DRAWER_ICON_BY_ROUTE[route.name] || "ellipse-outline"}
                color={color}
                size={size || 20}
              />
            )}
            activeTintColor={THEME.drawerActive}
            inactiveTintColor={THEME.drawerText}
            activeBackgroundColor={THEME.menuBg}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTabletOrLarger = width >= 768;
  const drawerWidth = isDesktop ? 340 : isTabletOrLarger ? 300 : 286;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: isTabletOrLarger ? "permanent" : "front",
        drawerStyle: { width: drawerWidth, backgroundColor: THEME.drawerBg },
        headerStyle: {
          backgroundColor: THEME.headerBg,
          borderBottomWidth: 1,
          borderBottomColor: THEME.drawerBorder,
        },
        headerTitleStyle: {
          color: THEME.headerText,
          fontWeight: "700",
        },
        headerTintColor: THEME.headerText,
        headerLeft: isTabletOrLarger ? undefined : () => <DrawerToggleButton />,
        sceneStyle: { backgroundColor: THEME.sceneBg },
      }}
    >
      {ROUTES.map((route) => (
        <Drawer.Screen
          key={route.name}
          name={route.name}
          component={routeComponents[route.name]}
          options={{
            title: getRouteTitle(route),
            drawerLabel: getRouteTitle(route),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadInitialRoute = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!mounted) {
          return;
        }
        setInitialRoute(hasLaunched === "true" ? "Landing" : "Onboarding");
      } catch {
        if (mounted) {
          setInitialRoute("Landing");
        }
      }
    };

    loadInitialRoute();
    return () => {
      mounted = false;
    };
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.headerText} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Landing" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: THEME.sceneBg,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerContent: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  drawerList: {
    gap: 2,
    paddingTop: 8,
  },
  drawerItem: {
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  drawerItemLabel: {
    color: THEME.drawerText,
    fontSize: 14,
  },
  menuButton: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: THEME.menuBg,
  },
});
