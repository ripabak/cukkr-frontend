// lib/api.ts
import axios from "axios";
import { authClient } from "./auth-client";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ENV_API_URL,
});

api.interceptors.request.use(async (config) => {
    const cookies = authClient.getCookie();

    if (cookies) {
        config.headers.Cookie = cookies;
    }

    return config;
});

export default api;