// lib/api.ts
import axios from "axios";
import { authClient } from "./auth-client";

const api = axios.create({
    baseURL: "https://cukkr-backend-dev.fire.my.id/api",
});

api.interceptors.request.use(async (config) => {
    const cookies = authClient.getCookie();

    if (cookies) {
        config.headers.Cookie = cookies;
    }

    return config;
});

export default api;