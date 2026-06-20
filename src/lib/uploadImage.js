export const uploadImageToImgbb = async (imageFile) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is missing");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error("Image upload failed");
    }

    return result.data.url;
};