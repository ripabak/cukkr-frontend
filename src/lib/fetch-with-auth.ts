// Function to fetch with authentication

import { authClient } from "@/src/lib/auth-client";

interface FetchOptions extends RequestInit {
    withAuth?: boolean;
}

export async function fetchWithAuth(
    url: string,
    options: FetchOptions = {
        withAuth: true
    }
) {
    const { withAuth, headers, ...rest } = options;

    let finalHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (withAuth) {
        const cookies = authClient.getCookie();

        finalHeaders = {
            ...finalHeaders,
            Cookie: cookies,
        };
    }

    const res = await fetch(url, {
        ...rest,
        headers: finalHeaders,
        credentials: "omit", // penting biar ga bentrok
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
}