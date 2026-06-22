const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const uploadImageToImgbb = async (imageFile) => {
    if (!imageFile) {
        throw new Error("Please select an image");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Image upload failed");
    }

    return result.data.url;
};