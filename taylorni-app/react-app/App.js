import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store from "./src/store";
import { hydrateAppData } from "./src/store/persistence";
import { initializeStore, selectAuth } from "./src/store/slices/authSlice";
import AppNavigator from "./src/navigation/AppNavigator";

function AppContent() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    dispatch(hydrateAppData());
    dispatch(initializeStore());
  }, [dispatch]);

  if (!auth.initialized) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#475569" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F6F1",
    alignItems: "center",
    justifyContent: "center",
  },
});
