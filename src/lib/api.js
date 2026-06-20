const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiEndpoint = (path) => {
  return `${API_URL}${path}`;
};

export const fetcher = async (path) => {
  const response = await fetch(apiEndpoint(path), {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
};