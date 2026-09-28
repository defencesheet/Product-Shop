const API_URL = "http://localhost:5000/api";

let accessToken = localStorage.getItem("accessToken");

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token) {
    accessToken = token;

    if (token) {
        localStorage.setItem("accessToken", token);
    } else {
        localStorage.removeItem("accessToken");
    }
}

async function request(path, options = {}, retry = true) {
    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include"
    });

    if (response.status === 401 && retry && path !== "/auth/refresh-token") {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            return request(path, options, false);
        }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || "Request failed");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export async function refreshAccessToken() {
    try {
        const data = await request("/auth/refresh-token", {
            method: "POST"
        }, false);

        setAccessToken(data.accessToken);
        return true;
    } catch {
        setAccessToken(null);
        return false;
    }
}

export function registerUser(payload) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export async function loginUser(payload) {
    const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    setAccessToken(data.accessToken);
    return data;
}

export async function logoutUser() {
    try {
        return await request("/auth/logout", {
            method: "POST"
        });
    } finally {
        setAccessToken(null);
    }
}

export function getMe() {
    return request("/auth/me");
}

export function getProducts() {
    return request("/products?page=1&limit=100");
}

export function createProduct(payload) {
    return request("/products", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateProduct(id, payload) {
    return request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function deleteProduct(id) {
    return request(`/products/${id}`, {
        method: "DELETE"
    });
}
