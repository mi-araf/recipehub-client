"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiBookmark,
  FiHeart,
  FiMessageSquare,
  FiStar,
  FiThumbsUp,
} from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

const statCards = [
  {
    key: "totalRecipes",
    label: "Total Recipes",
    icon: FiBarChart2,
  },
  {
    key: "totalLikesReceived",
    label: "Likes Received",
    icon: FiThumbsUp,
  },
  {
    key: "totalFavoritesOnMyRecipes",
    label: "Favorites Received",
    icon: FiHeart,
  },
  {
    key: "totalBookmarksOnMyRecipes",
    label: "Bookmarks Received",
    icon: FiBookmark,
  },
  {
    key: "totalRatings",
    label: "Total Ratings",
    icon: FiStar,
  },
  {
    key: "totalReports",
    label: "Reports",
    icon: FiMessageSquare,
  },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState("loading");

  const loadAnalytics = async () => {
    try {
      setStatus("loading");

      const result = await apiRequest("/api/dashboard/analytics");

      setAnalytics(result.data);
      setStatus("success");
    } catch {
      setAnalytics(null);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (status === "loading") {
    return (
      <div className="grid gap-4">
        <div className="skeleton h-44 rounded-[2rem]" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="skeleton h-36 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rh-card rounded-[2rem] p-10 text-center">
        <h1 className="text-2xl font-black">Analytics could not load.</h1>
        <p className="rh-muted mt-2">
          Make sure optional routes are mounted on your server.
        </p>

        <button
          onClick={loadAnalytics}
          className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summary, categoryBreakdown, monthlyRecipes, topRecipes } = analytics;

  return (
    <div className="grid gap-6">
      <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
        <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
          Recipe Analytics
        </p>

        <h1 className="mt-2 text-3xl font-black lg:text-5xl">
          Understand your recipe performance.
        </h1>

        <p className="recipehub-muted-text mt-3 max-w-2xl">
          Track likes, ratings, bookmarks, favorites, category performance, and
          your top recipes from one smooth analytics dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.key} className="rh-card rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Icon size={22} />
                </span>

                <span className="text-4xl font-black">
                  {summary[card.key] || 0}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-black">{card.label}</h3>
            </div>
          );
        })}
      </div>

      <div className="rh-card rounded-[2rem] p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black">Average Rating</h2>
            <p className="rh-muted text-sm">Overall rating across your recipes.</p>
          </div>

          <div className="rounded-full bg-amber-100 px-6 py-3 text-2xl font-black text-amber-700">
            ⭐ {summary.averageRating || 0} / 5
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rh-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Category Breakdown</h2>
          <p className="rh-muted mt-1 text-sm">
            Which recipe categories you publish most.
          </p>

          {categoryBreakdown.length === 0 ? (
            <p className="rh-muted mt-6">No category data yet.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {categoryBreakdown.map((item) => (
                <div key={item._id}>
                  <div className="mb-2 flex justify-between text-sm font-black">
                    <span>{item._id || "Uncategorized"}</span>
                    <span>{item.count} recipes</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-base-200">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{
                        width: `${Math.min(
                          100,
                          (item.count / summary.totalRecipes) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rh-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Monthly Recipe Growth</h2>
          <p className="rh-muted mt-1 text-sm">
            Recipes you added month by month.
          </p>

          {monthlyRecipes.length === 0 ? (
            <p className="rh-muted mt-6">No monthly data yet.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {monthlyRecipes.map((item) => (
                <div key={item._id}>
                  <div className="mb-2 flex justify-between text-sm font-black">
                    <span>{item._id}</span>
                    <span>{item.count} recipes</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-base-200">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{
                        width: `${Math.min(
                          100,
                          (item.count / Math.max(summary.totalRecipes, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rh-card rounded-[2rem] p-6">
        <h2 className="text-2xl font-black">Top Performing Recipes</h2>
        <p className="rh-muted mt-1 text-sm">
          Ranked by likes, favorites, bookmarks, and ratings.
        </p>

        {topRecipes.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-base-300 p-8 text-center">
            <h3 className="text-xl font-black">No analytics yet.</h3>
            <p className="rh-muted mt-2">
              Please add recipes first to see performance data.
            </p>

            <Link
              href="/dashboard/add-recipe"
              className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Add Recipe
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {topRecipes.map((recipe, index) => (
              <Link
                key={recipe._id}
                href={`/recipes/${recipe._id}`}
                className="grid gap-4 rounded-3xl border border-base-300/70 p-4 transition hover:border-emerald-400/60 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 md:grid-cols-[70px_1fr_auto]"
              >
                <img
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  className="size-20 rounded-2xl object-cover"
                />

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    #{index + 1} • {recipe.category}
                  </p>

                  <h3 className="mt-1 text-xl font-black">{recipe.recipeName}</h3>

                  <p className="rh-muted mt-1 text-sm">
                    {recipe.cuisineType || "Recipe"} • ⭐{" "}
                    {recipe.averageRating || 0} ({recipe.totalRatings} ratings)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center md:min-w-52">
                  <div className="rounded-2xl bg-base-200/70 p-3">
                    <p className="font-black">{recipe.likesCount}</p>
                    <p className="text-xs opacity-60">Likes</p>
                  </div>

                  <div className="rounded-2xl bg-base-200/70 p-3">
                    <p className="font-black">{recipe.favoritesCount}</p>
                    <p className="text-xs opacity-60">Favs</p>
                  </div>

                  <div className="rounded-2xl bg-base-200/70 p-3">
                    <p className="font-black">{recipe.bookmarksCount}</p>
                    <p className="text-xs opacity-60">Marks</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}