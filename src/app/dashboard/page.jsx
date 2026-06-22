"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FiAward,
    FiBookOpen,
    FiHeart,
    FiPlusCircle,
    FiStar,
    FiZap,
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

const getPlanLabel = (plan) => {
    if (plan === "premium") return "Premium Chef";
    if (plan === "plus") return "Plus Chef";
    if (plan === "admin") return "Admin";
    return "Free Chef";
};

const getPlanDescription = (plan, limits) => {
    if (plan === "premium") {
        return "You have unlimited recipe publishing and a Premium Chef badge.";
    }

    if (plan === "plus") {
        return `You can add up to ${limits?.plusRecipeLimit || 40} recipes as a Plus Chef.`;
    }

    if (plan === "admin") {
        return "Admin account has unlimited recipe access.";
    }

    return `Free chefs can add up to ${limits?.freeRecipeLimit || limits?.normalRecipeLimit || 2} recipes.`;
};

const getPlanIcon = (plan) => {
    if (plan === "premium") return FiZap;
    if (plan === "plus") return FiAward;
    if (plan === "admin") return FiStar;
    return FiBookOpen;
};

const getPlanCardClass = (plan) => {
    if (plan === "premium") {
        return "from-amber-50 via-yellow-50 to-emerald-50 border-amber-200/70";
    }

    if (plan === "plus") {
        return "from-sky-50 via-cyan-50 to-emerald-50 border-sky-200/70";
    }

    if (plan === "admin") {
        return "from-slate-100 via-emerald-50 to-lime-50 border-slate-300/70";
    }

    return "from-stone-50 via-orange-50 to-emerald-50 border-base-300/70";
};

export default function DashboardOverviewPage() {
    const [overview, setOverview] = useState(null);
    const [status, setStatus] = useState("loading");

    const loadOverview = async () => {
        try {
            setStatus("loading");

            const result = await apiRequest("/api/dashboard/overview");

            setOverview(result.data);
            setStatus("success");
        } catch (error) {
            setOverview(null);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadOverview();
    }, []);

    if (status === "loading") {
        return (
            <div className="grid gap-5">
                <div className="skeleton h-44 rounded-[2rem]" />

                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="skeleton h-36 rounded-[2rem]" />
                    ))}
                </div>

                <div className="skeleton h-72 rounded-[2rem]" />
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="rh-card rounded-[2rem] p-10 text-center">
                <h1 className="text-2xl font-black">Dashboard could not load.</h1>

                <p className="rh-muted mt-2">
                    Please check if the server is running.
                </p>

                <button
                    onClick={loadOverview}
                    className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const { user, stats, limits, membership, recentRecipes } = overview;

    const plan = limits?.plan || membership?.plan || user?.premiumPlan || "free";
    const planLabel = limits?.planLabel || membership?.label || getPlanLabel(plan);
    const PlanIcon = getPlanIcon(plan);

    const recipeLimit = limits?.recipeLimit || 2;
    const remainingSlots = limits?.remainingRecipeSlots ?? 0;
    const isUnlimited = recipeLimit === "Unlimited";

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Overview
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Welcome back, {user?.name || "Chef"} 👨‍🍳
                </h1>

                <p className="recipehub-muted-text mt-3 max-w-2xl">
                    Track your recipes, favorites, likes, membership plan, and publishing
                    slots from one polished dashboard.
                </p>
            </div>

            <div
                className={`overflow-hidden rounded-[2rem] border bg-linear-to-br p-6 shadow-xl shadow-emerald-950/5 ${getPlanCardClass(
                    plan
                )}`}
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <span className="grid size-16 shrink-0 place-items-center rounded-[1.3rem] bg-white/80 text-emerald-700 shadow-lg shadow-emerald-500/10">
                            <PlanIcon size={28} />
                        </span>

                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">
                                Membership
                            </p>

                            <h2 className="mt-2 text-3xl font-black">{planLabel}</h2>

                            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-base-content/65">
                                {getPlanDescription(plan, limits)}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
                        <div className="rounded-3xl bg-white/75 p-5 text-center shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-base-content/50">
                                Recipe Limit
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {isUnlimited ? "∞" : recipeLimit}
                            </p>

                            <p className="mt-1 text-sm font-bold opacity-60">
                                {isUnlimited ? "Unlimited slots" : "Total slots"}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/75 p-5 text-center shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-base-content/50">
                                Remaining
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {isUnlimited ? "∞" : remainingSlots}
                            </p>

                            <p className="mt-1 text-sm font-bold opacity-60">
                                {isUnlimited ? "No limit" : "Slots left"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    {plan === "free" && (
                        <Link
                            href="/dashboard/premium"
                            className="btn rounded-full border-0 bg-emerald-600 px-7 font-black text-white hover:bg-emerald-700"
                        >
                            Upgrade Plan
                        </Link>
                    )}

                    {plan === "plus" && (
                        <Link
                            href="/dashboard/premium"
                            className="btn rounded-full border-0 bg-slate-950 px-7 font-black text-white hover:bg-slate-800"
                        >
                            Upgrade to Premium
                        </Link>
                    )}

                    <Link href="/dashboard/add-recipe" className="btn rh-outline-btn rounded-full">
                        <FiPlusCircle />
                        Add Recipe
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div key={card.key} className="rh-card rounded-[2rem] p-6">
                            <div className="flex items-center justify-between gap-4">
                                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <Icon size={22} />
                                </span>

                                <span className="text-4xl font-black">
                                    {stats?.[card.key] || 0}
                                </span>
                            </div>

                            <h3 className="mt-5 text-lg font-black">{card.label}</h3>
                            <p className="rh-muted mt-1 text-sm">{card.helper}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="rh-card rounded-[2rem] p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">Recent Recipes</h2>
                            <p className="rh-muted text-sm">
                                Latest recipes from your kitchen.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/my-recipes"
                            className="btn rh-outline-btn rounded-full"
                        >
                            View all
                        </Link>
                    </div>

                    {recentRecipes?.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-base-300 p-8 text-center">
                            <h3 className="text-xl font-black">No recipes yet.</h3>

                            <p className="rh-muted mt-2">
                                Start your chef journey by publishing your first recipe.
                            </p>

                            <Link
                                href="/dashboard/add-recipe"
                                className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                Add First Recipe
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {recentRecipes?.map((recipe) => (
                                <Link
                                    key={recipe._id}
                                    href={`/recipes/${recipe._id}`}
                                    className="flex items-center gap-4 rounded-3xl border border-base-300/70 p-4 transition hover:border-emerald-400/60 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20"
                                >
                                    <img
                                        src={recipe.recipeImage}
                                        alt={recipe.recipeName}
                                        referrerPolicy="no-referrer"
                                        className="size-16 shrink-0 rounded-2xl object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-lg font-black">
                                            {recipe.recipeName}
                                        </h3>

                                        <p className="rh-muted mt-1 text-sm">
                                            {recipe.category} • {recipe.likesCount || 0} likes
                                        </p>
                                    </div>

                                    <span className="badge badge-outline font-bold">
                                        {recipe.status || "active"}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rh-card rounded-[2rem] p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                        Add Recipe Access
                    </p>

                    <h2 className="mt-3 text-2xl font-black">
                        {limits?.canAddRecipe ? "You can add recipes" : "Recipe limit reached"}
                    </h2>

                    <p className="rh-muted mt-3 text-sm leading-6">
                        {plan === "premium"
                            ? "Premium chefs can publish unlimited recipes."
                            : plan === "plus"
                                ? `Plus chefs can publish up to ${limits?.plusRecipeLimit || 40} recipes.`
                                : `Free chefs can publish up to ${limits?.freeRecipeLimit || limits?.normalRecipeLimit || 2
                                } recipes.`}
                    </p>

                    <div className="mt-6 rounded-3xl bg-base-200/60 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-black">Current Plan</span>
                            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                                {planLabel}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <span className="font-black">Slots Left</span>
                            <span className="text-2xl font-black">
                                {isUnlimited ? "Unlimited" : remainingSlots}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={limits?.canAddRecipe ? "/dashboard/add-recipe" : "/dashboard/premium"}
                        className={`btn mt-6 w-full rounded-full border-0 font-black ${limits?.canAddRecipe
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-slate-950 text-white hover:bg-slate-800"
                            }`}
                    >
                        {limits?.canAddRecipe ? (
                            <>
                                <FiPlusCircle />
                                Add Recipe
                            </>
                        ) : (
                            "Upgrade Plan"
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}