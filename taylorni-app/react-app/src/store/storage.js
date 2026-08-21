import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredJSON = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read storage key: ${key}`, error);
    return fallback;
  }
};

export const setStoredJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to persist storage key: ${key}`, error);
  }
};

export const removeStoredValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove storage key: ${key}`, error);
  }
};
