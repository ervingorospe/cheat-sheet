import AsyncStorage from "@react-native-async-storage/async-storage";

const REMEMBER_ME_KEY = "remember_me";

export async function setRememberMe(value: boolean): Promise<void> {
  await AsyncStorage.setItem(REMEMBER_ME_KEY, value ? "true" : "false");
}

export async function getRememberMe(): Promise<boolean> {
  const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);
  return value !== "false"; // default true — covers first-ever launch and every OAuth login, which has no checkbox
}