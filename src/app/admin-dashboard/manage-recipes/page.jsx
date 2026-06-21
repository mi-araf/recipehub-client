"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FiEdit3,
    FiEye,
    FiRefreshCw,
    FiSearch,
    FiStar,
    FiTrash2,
} from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function ManageRecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("loading");

    const loadRecipes = async () => {
        try {
            setStatus("loading");

            const query = search ? `?search=${encodeURIComponent(search)}` : "";
            const result = await apiRequest(`/api/admin/recipes${query}`);

            setRecipes(result.data || []);
            setStatus("success");
        } catch {
            setRecipes([]);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    const handleFeature = async (recipe) => {
        try {
            await apiRequest(`/api/admin/recipes/${recipe._id}/feature`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isFeatured: !recipe.isFeatured,
                }),
            });

            toast.success(
                recipe.isFeatured
                    ? "Recipe removed from featured"
                    : "Recipe added to featured"
            );

            loadRecipes();
        } catch (error) {
            toast.error(error.message || "Could not update featured status");
        }
    };

    const handleDelete = async (recipeId) => {
        const confirmed = window.confirm("Delete this recipe permanently?");

        if (!confirmed) return;

        try {
            await apiRequest(`/api/admin/recipes/${recipeId}`, {
                method: "DELETE",
            });

            toast.success("Recipe deleted successfully");
            loadRecipes();
        } catch (error) {
            toast.error(error.message || "Could not delete recipe");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Manage Recipes
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Moderate every recipe.
                </h1>

                <p className="recipehub-muted-text mt-3">
                    View, edit, delete, and feature recipes from all users.
                </p>
            </div>

            <div className="rh-card rounded-[2rem] p-5">
                <div className="flex flex-col gap-3 md:flex-row">
                    <label className="input input-bordered flex flex-1 items-center gap-2 rounded-full">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by recipe, author, email, or category"
                            className="grow"
                        />
                    </label>

                    <button
                        onClick={loadRecipes}
                        className="btn rounded-full border-0 bg-emerald-600 px-8 text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw />
                        Search
                    </button>
                </div>
            </div>

            {status === "loading" && <div className="skeleton h-96 rounded-[2rem]" />}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">Recipes could not load.</h2>
                    <p className="rh-muted mt-2">
                        Make sure your admin server routes are mounted.
                    </p>

                    <button onClick={loadRecipes} className="btn mt-5 rounded-full">
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && (
                <div className="rh-card overflow-hidden rounded-[2rem]">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="text-sm">
                                    <th>Recipe</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Likes</th>
                                    <th>Featured</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recipes.map((recipe) => (
                                    <tr key={recipe._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={recipe.recipeImage}
                                                    alt={recipe.recipeName}
                                                    className="size-14 rounded-2xl object-cover"
                                                />

                                                <div>
                                                    <p className="font-black">{recipe.recipeName}</p>
                                                    <p className="text-xs opacity-60">
                                                        {recipe.cuisineType} • {recipe.difficultyLevel}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <p className="font-bold">{recipe.authorName}</p>
                                            <p className="text-xs opacity-60">{recipe.authorEmail}</p>
                                        </td>

                                        <td>
                                            <span className="badge badge-success badge-outline font-bold">
                                                {recipe.category}
                                            </span>
                                        </td>

                                        <td className="font-black">{recipe.likesCount || 0}</td>

                                        <td>
                                            {recipe.isFeatured ? (
                                                <span className="badge badge-warning font-bold">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="badge badge-ghost font-bold">
                                                    Normal
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <span className="badge badge-outline font-bold">
                                                {recipe.status || "active"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/recipes/${recipe._id}`}
                                                    className="btn btn-sm rounded-full"
                                                >
                                                    <FiEye />
                                                </Link>

                                                <Link
                                                    href={`/admin-dashboard/manage-recipes/${recipe._id}/edit`}
                                                    className="btn btn-sm rounded-full border-0 bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    <FiEdit3 />
                                                </Link>

                                                <button
                                                    onClick={() => handleFeature(recipe)}
                                                    className={`btn btn-sm rounded-full border-0 text-white ${recipe.isFeatured
                                                            ? "bg-slate-900 hover:bg-slate-800"
                                                            : "bg-amber-500 hover:bg-amber-600"
                                                        }`}
                                                >
                                                    <FiStar />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(recipe._id)}
                                                    className="btn btn-sm rounded-full border-0 bg-red-500 text-white hover:bg-red-600"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {recipes.length === 0 && (
                            <div className="p-10 text-center">
                                <h2 className="text-2xl font-black">No recipes found.</h2>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}