"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit3,
    FiEye,
    FiRefreshCw,
    FiSearch,
    FiStar,
    FiTrash2,
} from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

const LIMIT = 10;

export default function ManageRecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [featuredFilter, setFeaturedFilter] = useState("");
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("loading");

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: LIMIT,
        totalPages: 1,
    });

    const loadRecipes = useCallback(async () => {
        try {
            setStatus("loading");

            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", String(LIMIT));

            if (search.trim()) {
                params.set("search", search.trim());
            }

            if (statusFilter) {
                params.set("status", statusFilter);
            }

            if (featuredFilter) {
                params.set("featured", featuredFilter);
            }

            const result = await apiRequest(`/api/admin/recipes?${params.toString()}`);

            setRecipes(result.data || []);
            setPagination(
                result.pagination || {
                    total: result.data?.length || 0,
                    page,
                    limit: LIMIT,
                    totalPages: 1,
                }
            );

            setStatus("success");
        } catch (error) {
            setRecipes([]);
            setPagination({
                total: 0,
                page: 1,
                limit: LIMIT,
                totalPages: 1,
            });
            setStatus("error");
        }
    }, [page, search, statusFilter, featuredFilter]);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const handleSearch = () => {
        setPage(1);
    };

    const handleReset = () => {
        setSearch("");
        setStatusFilter("");
        setFeaturedFilter("");
        setPage(1);
    };

    const handleFeature = async (recipe) => {
        try {
            const result = await apiRequest(`/api/admin/recipes/${recipe._id}/feature`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isFeatured: !recipe.isFeatured,
                }),
            });

            toast.success(
                result.message ||
                (recipe.isFeatured
                    ? "Recipe removed from featured"
                    : "Recipe added to featured")
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

            if (recipes.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                loadRecipes();
            }
        } catch (error) {
            toast.error(error.message || "Could not delete recipe");
        }
    };

    const canGoPrev = page > 1;
    const canGoNext = page < pagination.totalPages;

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
                <div className="grid gap-3 xl:grid-cols-[1fr_170px_170px_auto_auto]">
                    <label className="input input-bordered flex items-center gap-2 rounded-full">
                        <FiSearch className="shrink-0 opacity-60" />

                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search by recipe, author, email, or category"
                            className="grow"
                        />
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) => {
                            setStatusFilter(event.target.value);
                            setPage(1);
                        }}
                        className="select select-bordered rounded-full"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="removed">Removed</option>
                    </select>

                    <select
                        value={featuredFilter}
                        onChange={(event) => {
                            setFeaturedFilter(event.target.value);
                            setPage(1);
                        }}
                        className="select select-bordered rounded-full"
                    >
                        <option value="">All Recipes</option>
                        <option value="true">Featured</option>
                        <option value="false">Normal</option>
                    </select>

                    <button
                        type="button"
                        onClick={handleSearch}
                        className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw />
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn rounded-full border border-base-300 bg-base-100 px-8 font-black hover:bg-base-200"
                    >
                        Reset
                    </button>
                </div>

                {status === "success" && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold opacity-70">
                        <span>
                            Showing page {pagination.page || page} of{" "}
                            {pagination.totalPages || 1}
                        </span>

                        <span>Total recipes: {pagination.total || 0}</span>
                    </div>
                )}
            </div>

            {status === "loading" && <div className="skeleton h-96 rounded-[2rem]" />}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">Recipes could not load.</h2>

                    <p className="rh-muted mt-2">
                        Make sure your admin routes and deployed server are working.
                    </p>

                    <button onClick={loadRecipes} className="btn mt-5 rounded-full">
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && (
                <div className="rh-card overflow-hidden rounded-[2rem]">
                    <div className="overflow-x-auto">
                        <table className="table min-w-[1180px] table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-[330px]">Recipe</th>
                                    <th className="w-[250px]">Author</th>
                                    <th className="w-[140px]">Category</th>
                                    <th className="w-[90px]">Likes</th>
                                    <th className="w-[120px]">Featured</th>
                                    <th className="w-[110px]">Status</th>
                                    <th className="w-[160px] text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recipes.map((recipe) => (
                                    <tr key={recipe._id} className="align-middle">
                                        <td className="w-[330px]">
                                            <div className="flex min-w-0 items-center gap-4">
                                                <img
                                                    src={recipe.recipeImage}
                                                    alt={recipe.recipeName}
                                                    referrerPolicy="no-referrer"
                                                    className="size-16 shrink-0 rounded-2xl object-cover"
                                                />

                                                <div className="min-w-0">
                                                    <p className="line-clamp-2 max-w-[220px] text-base font-black leading-5">
                                                        {recipe.recipeName}
                                                    </p>

                                                    <p className="mt-1 max-w-[220px] truncate text-xs font-semibold opacity-60">
                                                        {recipe.cuisineType || "Cuisine"} •{" "}
                                                        {recipe.difficultyLevel || "Difficulty"}
                                                    </p>

                                                    <p className="mt-1 text-xs font-bold opacity-50">
                                                        {recipe.preparationTime || "No time added"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="w-[250px]">
                                            <div className="min-w-0">
                                                <p className="max-w-[210px] truncate text-base font-black">
                                                    {recipe.authorName || "Unknown Author"}
                                                </p>

                                                <p className="mt-1 max-w-[210px] truncate text-xs font-semibold opacity-60">
                                                    {recipe.authorEmail || "No email"}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="w-[140px]">
                                            <span className="inline-flex max-w-[115px] items-center rounded-full border border-emerald-300 px-4 py-2 text-xs font-black text-emerald-700">
                                                <span className="truncate">{recipe.category}</span>
                                            </span>
                                        </td>

                                        <td className="w-[90px] text-base font-black">
                                            {recipe.likesCount || 0}
                                        </td>

                                        <td className="w-[120px]">
                                            {recipe.isFeatured ? (
                                                <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-base-200 px-4 py-2 text-xs font-black">
                                                    Normal
                                                </span>
                                            )}
                                        </td>

                                        <td className="w-[110px]">
                                            <span className="rounded-full border border-base-300 px-4 py-2 text-xs font-black">
                                                {recipe.status || "active"}
                                            </span>
                                        </td>

                                        <td className="w-[160px]">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/recipes/${recipe._id}`}
                                                    className="btn btn-sm size-10 rounded-full p-0"
                                                    title="View recipe"
                                                >
                                                    <FiEye />
                                                </Link>

                                                <Link
                                                    href={`/admin-dashboard/manage-recipes/${recipe._id}/edit`}
                                                    className="btn btn-sm size-10 rounded-full border-0 bg-blue-500 p-0 text-white hover:bg-blue-600"
                                                    title="Edit recipe"
                                                >
                                                    <FiEdit3 />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleFeature(recipe)}
                                                    className={`btn btn-sm size-10 rounded-full border-0 p-0 text-white ${recipe.isFeatured
                                                            ? "bg-slate-900 hover:bg-slate-800"
                                                            : "bg-amber-500 hover:bg-amber-600"
                                                        }`}
                                                    title={
                                                        recipe.isFeatured
                                                            ? "Remove from featured"
                                                            : "Make featured"
                                                    }
                                                >
                                                    <FiStar />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(recipe._id)}
                                                    className="btn btn-sm size-10 rounded-full border-0 bg-red-500 p-0 text-white hover:bg-red-600"
                                                    title="Delete recipe"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {recipes.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center">
                                            <h2 className="text-2xl font-black">No recipes found.</h2>

                                            <p className="rh-muted mt-2">
                                                Try changing your search or filters.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-base-300/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-bold opacity-70">
                            Page {pagination.page || page} of {pagination.totalPages || 1} •{" "}
                            {pagination.total || 0} total recipes
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={!canGoPrev}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                className="btn rounded-full disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiChevronLeft />
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={!canGoNext}
                                onClick={() =>
                                    setPage((current) =>
                                        Math.min(pagination.totalPages || 1, current + 1)
                                    )
                                }
                                className="btn rounded-full disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}