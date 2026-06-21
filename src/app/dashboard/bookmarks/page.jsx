"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookmark, FiEye, FiTrash2 } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function BookmarksPage() {
    const [recipes, setRecipes] = useState([]);
    const [status, setStatus] = useState("loading");

    const loadBookmarks = async () => {
        try {
            setStatus("loading");

            const result = await apiRequest("/api/dashboard/bookmarks");

            setRecipes(result.data || []);
            setStatus("success");
        } catch {
            setRecipes([]);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadBookmarks();
    }, []);

    const handleRemove = async (recipeId) => {
        try {
            await apiRequest(`/api/dashboard/bookmarks/${recipeId}`, {
                method: "DELETE",
            });

            toast.success("Removed from bookmarks");
            loadBookmarks();
        } catch (error) {
            toast.error(error.message || "Could not remove bookmark");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Bookmarks
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Recipes saved for later.
                </h1>

                <p className="recipehub-muted-text mt-3">
                    Bookmark recipes you want to revisit, cook later, or study.
                </p>
            </div>

            {status === "loading" && <div className="skeleton h-80 rounded-[2rem]" />}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">Could not load bookmarks.</h2>
                    <p className="rh-muted mx-auto mt-2 max-w-xl">
                        Please make sure the server is running and optional routes are mounted.
                    </p>

                    <button
                        onClick={loadBookmarks}
                        className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && recipes.length === 0 && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <FiBookmark className="mx-auto text-5xl text-emerald-500" />

                    <h2 className="mt-4 text-2xl font-black">
                        Please bookmark recipes 📌
                    </h2>

                    <p className="rh-muted mx-auto mt-2 max-w-xl">
                        You have not bookmarked any recipes yet. Browse recipes and save the
                        ones you want to cook later.
                    </p>

                    <Link
                        href="/recipes"
                        className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        Browse Recipes
                    </Link>
                </div>
            )}

            {status === "success" && recipes.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="rh-card overflow-hidden rounded-[2rem]">
                            <img
                                src={recipe.recipeImage}
                                alt={recipe.recipeName}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-5">
                                <div className="flex flex-wrap gap-2">
                                    <span className="badge badge-success badge-outline">
                                        {recipe.category}
                                    </span>
                                    <span className="badge badge-warning badge-outline">
                                        {recipe.likesCount || 0} likes
                                    </span>
                                </div>

                                <h2 className="mt-3 line-clamp-2 text-xl font-black">
                                    {recipe.recipeName}
                                </h2>

                                <p className="rh-muted mt-1 text-sm">
                                    By {recipe.authorName || "Unknown Chef"} •{" "}
                                    {recipe.preparationTime}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-2">
                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="btn rh-outline-btn rounded-full"
                                    >
                                        <FiEye />
                                        Details
                                    </Link>

                                    <button
                                        onClick={() => handleRemove(recipe._id)}
                                        className="btn rounded-full border-0 bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <FiTrash2 />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}