// lib/api.ts
import axios from "axios";
import { Platform } from "react-native";
import { authClient } from "./auth-client";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ENV_API_URL,
});

api.interceptors.request.use(async (config) => {
  if (Platform.OS === "web") {
    config.withCredentials = true;
  } else {
    const cookies = authClient.getCookie();
    if (cookies) {
      config.headers.Cookie = cookies;
    }
    config.withCredentials = false;
  }

  return config;
});

export default api;
