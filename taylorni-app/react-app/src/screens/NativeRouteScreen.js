import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import {
  selectAuth,
  selectIsAuthenticated,
  selectUserType,
} from "../store/slices/authSlice";
import { selectCartCount } from "../store/slices/cartSlice";
import { getPageBlueprint } from "./pageBlueprints";
import useBackendStatus from "../hooks/useBackendStatus";

const GROUP_COLORS = {
  Public: { bg: "#FEF3C7", accent: "#B45309", text: "#7C2D12" },
  Client: { bg: "#DBEAFE", accent: "#1D4ED8", text: "#1E3A8A" },
  Designer: { bg: "#EDE9FE", accent: "#7C3AED", text: "#4C1D95" },
  Account: { bg: "#DCFCE7", accent: "#15803D", text: "#14532D" },
  System: { bg: "#F1F5F9", accent: "#334155", text: "#0F172A" },
};

const hashValue = (key) =>
  key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

const metricSetForRoute = (routeName, authState, cartCount) => {
  const seed = hashValue(routeName);
  const baseline = (seed % 17) + 3;

  if (routeName.includes("Order")) {
    return [
      { label: "Open Orders", value: String((baseline % 9) + 2) },
      { label: "In Progress", value: String((baseline % 7) + 1) },
      { label: "Completed", value: String((baseline % 11) + 6) },
    ];
  }

  if (routeName.includes("Product") || routeName.includes("Marketplace")) {
    return [
      { label: "Live Listings", value: String((baseline % 13) + 8) },
      { label: "Views Today", value: String((baseline % 41) + 40) },
      { label: "Cart Items", value: String(cartCount) },
    ];
  }

  if (routeName.includes("Measurement")) {
    return [
      { label: "Profiles", value: String((baseline % 5) + 2) },
      { label: "Updated", value: `${(baseline % 10) + 1}d ago` },
      { label: "Fit Score", value: `${90 + (baseline % 8)}%` },
    ];
  }

  if (routeName.includes("Message")) {
    return [
      { label: "Unread", value: String((baseline % 8) + 1) },
      { label: "Response Avg", value: `${(baseline % 4) + 1}h` },
      { label: "Threads", value: String((baseline % 12) + 4) },
    ];
  }

  if (routeName.includes("Settings") || routeName.includes("Profile")) {
    return [
      { label: "User", value: authState.userInfo?.firstName || "Guest" },
      { label: "Role", value: authState.userType || "Public" },
      { label: "Status", value: authState.isAuthenticated ? "Active" : "Guest" },
    ];
  }

  return [
    { label: "Mode", value: routeName },
    { label: "Signed In", value: authState.isAuthenticated ? "Yes" : "No" },
    { label: "Cart", value: String(cartCount) },
  ];
};

const backendTone = (status) => {
  if (status.loading) {
    return { text: "Checking backend...", color: "#64748B" };
  }
  return status.online
    ? { text: "Backend online", color: "#15803D" }
    : { text: "Backend unreachable", color: "#B91C1C" };
};

const FormPreview = ({ routeName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [enabled, setEnabled] = useState(true);

  if (routeName === "Login") {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  if (
    routeName.includes("OrderNew") ||
    routeName.includes("ProductNew") ||
    routeName === "CustomOrderForm"
  ) {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Create Entry</Text>
        <TextInput style={styles.input} placeholder="Title" />
        <TextInput style={styles.input} placeholder="Price / Budget" />
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Details"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Save Draft</Text>
        </Pressable>
      </View>
    );
  }

  if (routeName.includes("Settings")) {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Preferences</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Push notifications</Text>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Order alerts</Text>
          <Switch value={!enabled} onValueChange={() => setEnabled((v) => !v)} />
        </View>
      </View>
    );
  }

  return null;
};

export default function NativeRouteScreen({ routeMeta }) {
  const { width } = useWindowDimensions();
  const auth = useSelector(selectAuth);
  const cartCount = useSelector(selectCartCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);
  const backend = useBackendStatus();
  const blueprint = useMemo(() => getPageBlueprint(routeMeta), [routeMeta]);
  const theme = GROUP_COLORS[routeMeta.group] || GROUP_COLORS.System;
  const metrics = useMemo(
    () => metricSetForRoute(routeMeta.name, auth, cartCount),
    [routeMeta.name, auth, cartCount]
  );
  const tone = backendTone(backend);
  const isCompact = width < 600;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: isCompact ? 14 : 24 },
      ]}
    >
      <View style={[styles.hero, { backgroundColor: theme.bg }]}>
        <Text style={[styles.heroBadge, { color: theme.accent }]}>
          {routeMeta.group} Route
        </Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>{routeMeta.title}</Text>
        <Text style={styles.heroSummary}>{blueprint.summary}</Text>
        <Text style={[styles.backendStatus, { color: tone.color }]}>
          {tone.text} • {backend.url}
        </Text>
        <Text style={styles.contextLine}>
          Session: {isAuthenticated ? "Authenticated" : "Guest"} • Role:{" "}
          {userType || "Public"}
        </Text>
      </View>

      <View style={styles.metricGrid}>
        {metrics.map((item) => (
          <View
            key={`${routeMeta.name}-${item.label}`}
            style={[styles.metricCard, isCompact && styles.metricCardCompact]}
          >
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={styles.metricValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Highlights</Text>
        {blueprint.highlights.map((highlight) => (
          <Text key={highlight} style={styles.bulletItem}>
            • {highlight}
          </Text>
        ))}
      </View>

      {blueprint.actions.length > 0 ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Quick Actions</Text>
          <View style={styles.actionWrap}>
            {blueprint.actions.map((action) => (
              <Pressable key={action} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>{action}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <FormPreview routeName={routeMeta.name} />

      {(routeMeta.name.includes("Messages") || routeMeta.name.includes("Thread")) && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Conversation Preview</Text>
          <View style={styles.messageRow}>
            <Text style={styles.messageSender}>Client</Text>
            <Text style={styles.messageText}>Can we adjust sleeve length by 1 inch?</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.messageSender}>You</Text>
            <Text style={styles.messageText}>Yes, I will apply it in the next update.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },
  content: {
    paddingVertical: 16,
    gap: 12,
  },
  hero: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  heroBadge: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroSummary: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 8,
  },
  backendStatus: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  contextLine: {
    fontSize: 13,
    color: "#475569",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  metricCard: {
    width: "31.8%",
    minWidth: 98,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 12,
  },
  metricCardCompact: {
    width: "100%",
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  panel: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 14,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 5,
  },
  actionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: "#1E293B",
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: "#0F172A",
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: "#334155",
  },
  messageRow: {
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 3,
  },
  messageText: {
    fontSize: 14,
    color: "#0F172A",
  },
});
