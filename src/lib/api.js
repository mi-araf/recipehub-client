export const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export const apiEndpoint = (path = "") => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
};

export const fetcher = async (path, options = {}) => {
    const response = await fetch(apiEndpoint(path), {
        cache: "no-store",
        credentials: "include",
        ...options,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
        throw new Error(
            result?.message || `Request failed with status ${response.status}`
        );
    }

    return result;
};