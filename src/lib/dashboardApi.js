export const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

export const NORMAL_RECIPE_LIMIT = 2;

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        cache: "no-store",
        ...options,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
        throw new Error(
            result?.message || `Request failed with status ${response.status}`
        );
    }

    return result;
}

export function getInitial(name = "User") {
    return name.trim().charAt(0).toUpperCase() || "U";
}