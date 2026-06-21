"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FiAward,
    FiBookOpen,
    FiHeart,
    FiPlusCircle,
    FiStar,
} from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

const statCards = [
    {
        key: "totalRecipes",
        label: "Total Recipes",
        icon: FiBookOpen,
        helper: "Recipes published by you",
    },
    {
        key: "totalFavorites",
        label: "Total Favorites",
        icon: FiHeart,
        helper: "Recipes saved by you",
    },
    {
        key: "totalLikesReceived",
        label: "Likes Received",
        icon: FiStar,
        helper: "Community love on your recipes",
    },
];

export default function DashboardOverviewPage() {
    const [overview, setOverview] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        apiRequest("/api/dashboard/overview")
            .then((result) => {
                setOverview(result.data);
                setStatus("success");
            })
            .catch((error) => {
                // console.error(error);
                setStatus("error");
            });
    }, []);

    if (status === "loading") {
        return (
            <div className="grid gap-4">
                <div className="skeleton h-44 rounded-[2rem]" />
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="skeleton h-36 rounded-[2rem]" />
                    ))}
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="rh-card rounded-[2rem] p-8">
                <h1 className="text-2xl font-black">Dashboard could not load.</h1>
                <p className="rh-muted mt-2">Please check if the server is running.</p>
            </div>
        );
    }

    const { user, stats, limits, recentRecipes } = overview;

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                        <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                            Overview
                        </p>
                        <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                            Welcome back, {user?.name || "Chef"} 👨‍🍳
                        </h1>
                        <p className="recipehub-muted-text mt-3 max-w-2xl">
                            Track your recipes, favorites, likes, and premium status from one
                            polished dashboard.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-400/30 bg-white/60 p-5 dark:bg-white/10">
                        <div className="flex items-center gap-3">
                            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white">
                                <FiAward size={22} />
                            </span>
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                                    Membership
                                </p>
                                <h2 className="text-xl font-black">
                                    {limits.isPremium ? "Premium Chef" : "Free Chef"}
                                </h2>
                            </div>
                        </div>

                        <p className="mt-4 text-sm opacity-75">
                            {limits.isPremium
                                ? "You can add unlimited recipes and show a premium profile badge."
                                : `Free users can add ${limits.normalRecipeLimit} recipes. Remaining slots: ${limits.remainingRecipeSlots}.`}
                        </p>

                        {!limits.isPremium && (
                            <Link
                                href="/dashboard/premium"
                                className="btn mt-4 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                See Premium Feature
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div key={card.key} className="rh-card rounded-[2rem] p-6">
                            <div className="flex items-center justify-between">
                                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                    <Icon size={22} />
                                </span>
                                <span className="text-4xl font-black">{stats[card.key] || 0}</span>
                            </div>

                            <h3 className="mt-5 text-lg font-black">{card.label}</h3>
                            <p className="rh-muted mt-1 text-sm">{card.helper}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rh-card rounded-[2rem] p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">Recent Recipes</h2>
                            <p className="rh-muted text-sm">Latest recipes from your kitchen.</p>
                        </div>

                        <Link href="/dashboard/my-recipes" className="btn rh-outline-btn rounded-full">
                            View all
                        </Link>
                    </div>

                    {recentRecipes.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-base-300 p-8 text-center">
                            <p className="font-bold">No recipes yet.</p>
                            <Link
                                href="/dashboard/add-recipe"
                                className="btn mt-4 rounded-full border-0 bg-emerald-600 text-white"
                            >
                                <FiPlusCircle />
                                Add First Recipe
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {recentRecipes.map((recipe) => (
                                <Link
                                    key={recipe._id}
                                    href={`/recipes/${recipe._id}`}
                                    className="flex items-center gap-4 rounded-3xl border border-base-300/60 p-3 transition hover:border-emerald-400/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                                >
                                    <img
                                        src={recipe.recipeImage}
                                        alt={recipe.recipeName}
                                        className="size-16 rounded-2xl object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-black">{recipe.recipeName}</h3>
                                        <p className="rh-muted text-sm">
                                            {recipe.category} • {recipe.likesCount || 0} likes
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rh-card rounded-[2rem] p-6">
                    <h2 className="text-2xl font-black">Add Recipe Access</h2>
                    <p className="rh-muted mt-2 text-sm">
                        Premium unlocks unlimited recipe publishing.
                    </p>

                    <div className="mt-5 rounded-3xl bg-emerald-50 p-5 dark:bg-emerald-950/20">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            Current Status
                        </p>
                        <h3 className="mt-2 text-xl font-black">
                            {limits.canAddRecipe ? "You can add recipes" : "Recipe limit reached"}
                        </h3>
                        <p className="mt-2 text-sm opacity-75">
                            {limits.isPremium
                                ? "Premium users can publish unlimited recipes."
                                : `Free plan allows ${limits.normalRecipeLimit} recipes total.`}
                        </p>
                    </div>

                    <Link
                        href="/dashboard/add-recipe"
                        className="btn mt-5 w-full rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        Add Recipe
                    </Link>
                </div>
            </div>
        </div>
    );
}
