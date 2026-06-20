"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FiArrowRight,
    FiClock,
    FiFilter,
    FiHeart,
    FiRefreshCw,
} from "react-icons/fi";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Soup", "Dessert"];

export default function BrowseRecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
    });
    const [status, setStatus] = useState("loading");

    const loadRecipes = async (page = 1, categoriesValue = selectedCategories) => {
        try {
            setStatus("loading");

            const params = new URLSearchParams({
                page: String(page),
                limit: "9",
            });

            if (categoriesValue.length > 0) {
                params.set("categories", categoriesValue.join(","));
            }

            const response = await fetch(`${API_URL}/api/recipes?${params.toString()}`, {
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to load recipes");
            }

            setRecipes(result.data || []);
            setPagination(result.pagination || { page: 1, totalPages: 1, total: 0 });
            setStatus("success");
        } catch (error) {
            console.error("Browse recipes error:", error);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadRecipes(1, []);
    }, []);

    const handleCategoryToggle = (category) => {
        const nextCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((item) => item !== category)
            : [...selectedCategories, category];

        setSelectedCategories(nextCategories);
        loadRecipes(1, nextCategories);
    };

    const handleReset = () => {
        setSelectedCategories([]);
        loadRecipes(1, []);
    };

    return (
        <section className="rh-section py-10 lg:py-14">
            <div className="rh-home-card rounded-3xl px-6 py-12 sm:px-10">
                <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
                    <div>
                        <p className="rh-eyebrow mb-3 text-sm font-black uppercase tracking-widest">
                            Browse recipes
                        </p>

                        <h1 className="rh-title max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                            Explore recipes from the community.
                        </h1>

                        <p className="rh-muted mt-5 max-w-xl text-lg leading-8">
                            Discover dishes by category, cuisine, difficulty, time, likes, and
                            creator. Every card leads to full recipe details.
                        </p>
                    </div>

                    <div className="rh-card rounded-3xl p-5">
                        <div className="mb-4 flex items-center gap-2 font-black">
                            <FiFilter className="text-emerald-600" size={19} />
                            Filter by category
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const active = selectedCategories.includes(category);

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => handleCategoryToggle(category)}
                                        className={`rounded-full px-4 py-2 text-sm font-black transition ${active
                                                ? "bg-emerald-600 text-white"
                                                : "rh-outline-btn hover:text-emerald-700"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-stone-950 transition hover:bg-amber-500"
                            >
                                <FiRefreshCw className="inline" size={15} /> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {status === "loading" && (
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="rh-card rounded-3xl p-4">
                            <div className="skeleton h-64 rounded-3xl" />
                            <div className="mt-5 space-y-3 p-3">
                                <div className="skeleton h-5 w-28" />
                                <div className="skeleton h-8 w-full" />
                                <div className="skeleton h-5 w-44" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {status === "error" && (
                <div className="rh-card mt-10 rounded-3xl p-10 text-center">
                    <h2 className="rh-title text-2xl font-black">
                        Recipes could not be loaded.
                    </h2>
                    <p className="rh-muted mt-3">
                        Check if your server is running on port 5000.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length === 0 && (
                <div className="rh-card mt-10 rounded-3xl p-10 text-center">
                    <h2 className="rh-title text-2xl font-black">No recipes found.</h2>
                    <p className="rh-muted mt-3">
                        Add recipes from dashboard or try another category.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length > 0 && (
                <>
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {recipes.map((recipe, index) => (
                            <motion.article
                                key={recipe._id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.45, delay: index * 0.05 }}
                                className="rh-card group overflow-hidden rounded-3xl p-4"
                            >
                                <div className="overflow-hidden rounded-3xl">
                                    <Image
                                        width={260} height={260}
                                        src={recipe.recipeImage}
                                        alt={recipe.recipeName}
                                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-3 pt-5">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
                                            {recipe.category}
                                        </span>

                                        <span className="flex items-center gap-1 text-sm font-black text-rose-600">
                                            <FiHeart size={15} />
                                            {recipe.likesCount || 0}
                                        </span>
                                    </div>

                                    <h2 className="rh-title text-2xl font-black leading-tight">
                                        {recipe.recipeName}
                                    </h2>

                                    <div className="rh-muted mt-4 grid gap-2 text-sm font-bold">
                                        <p>{recipe.cuisineType}</p>
                                        <p>{recipe.difficultyLevel}</p>
                                        <p className="flex items-center gap-2">
                                            <FiClock size={15} />
                                            {recipe.preparationTime}
                                        </p>
                                        <p>By {recipe.authorName}</p>
                                    </div>

                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="btn mt-6 w-full rounded-full border-0 bg-amber-400 font-black text-stone-950 hover:bg-amber-500"
                                    >
                                        View Details
                                        <FiArrowRight size={18} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            disabled={pagination.page <= 1}
                            onClick={() => loadRecipes(pagination.page - 1)}
                            className="btn rh-outline-btn rounded-full px-6 font-black disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="rh-muted text-sm font-black">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => loadRecipes(pagination.page + 1)}
                            className="btn rh-outline-btn rounded-full px-6 font-black disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}