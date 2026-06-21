"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";
import { useAuth } from "@/providers/AuthProvider";

export default function BookmarkButton({ recipeId }) {
    const { user } = useAuth();
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!recipeId || !user) return;

        apiRequest(`/api/bookmarks/${recipeId}/check`)
            .then((result) => {
                setBookmarked(Boolean(result.bookmarked));
            })
            .catch(() => {
                setBookmarked(false);
            });
    }, [recipeId, user]);

    const handleToggleBookmark = async () => {
        if (!user) {
            toast.error("Please login to bookmark recipes");
            return;
        }

        try {
            setLoading(true);

            const result = await apiRequest(`/api/bookmarks/${recipeId}/toggle`, {
                method: "PATCH",
            });

            setBookmarked(Boolean(result.bookmarked));
            toast.success(result.message || "Bookmark updated");
        } catch (error) {
            toast.error(error.message || "Could not update bookmark");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleBookmark}
            disabled={loading}
            className={`btn h-13 w-full rounded-2xl font-black ${bookmarked
                    ? "border-0 bg-indigo-600 text-white hover:bg-indigo-800"
                    : "rh-outline-btn"
                }`}
        >
            {loading ? (
                <span className="loading loading-spinner loading-sm" />
            ) : (
                <FiBookmark />
            )}
            {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
    );
}