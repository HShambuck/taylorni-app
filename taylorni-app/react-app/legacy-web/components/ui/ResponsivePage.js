import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const getBreakpoint = (width) => {
  if (width >= 1200) return "xl";
  if (width >= 900) return "lg";
  if (width >= 600) return "md";
  return "sm";
};

export default function ResponsivePage({ title, subtitle, children }) {
  const { width } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  const isSmall = breakpoint === "sm";
  const horizontalPadding = isSmall ? 16 : breakpoint === "md" ? 24 : 32;
  const maxContentWidth = breakpoint === "xl" ? 1200 : breakpoint === "lg" ? 980 : 760;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: horizontalPadding },
      ]}
    >
      <View style={[styles.content, { maxWidth: maxContentWidth }]}>
        <Text style={[styles.title, isSmall && styles.titleSmall]}>{title}</Text>
        <Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
          {subtitle}
        </Text>
        {children}
      </View>
    </ScrollView>
  );
}

export function ResponsiveCards({ items }) {
  const { width } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  const columns = breakpoint === "xl" ? 3 : breakpoint === "lg" ? 2 : 1;
  const cardWidth = columns === 1 ? "100%" : columns === 2 ? "48.5%" : "31.8%";

  return (
    <View style={styles.cardGrid}>
      {items.map((item) => (
        <View key={item.label} style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.cardLabel}>{item.label}</Text>
          <Text style={styles.cardValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },
  scrollContent: {
    paddingVertical: 18,
    alignItems: "center",
  },
  content: {
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
  },
  titleSmall: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 16,
    color: "#334155",
    marginTop: 6,
    marginBottom: 18,
  },
  subtitleSmall: {
    fontSize: 15,
  },
  cardGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 14,
    minHeight: 95,
  },
  cardLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 18,
    color: "#0F172A",
    fontWeight: "600",
  },
});
