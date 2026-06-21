"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit3, FiEye, FiPlusCircle, FiTrash2 } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("loading");

  const loadRecipes = async () => {
    try {
      setStatus("loading");
      const result = await apiRequest("/api/dashboard/my-recipes");
      setRecipes(result.data || []);
      setStatus("success");
    } catch (error) {
      // console.error(error);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this recipe permanently?");
    if (!confirmed) return;

    try {
      await apiRequest(`/api/dashboard/my-recipes/${id}`, {
        method: "DELETE",
      });
      toast.success("Recipe deleted");
      loadRecipes();
    } catch (error) {
      toast.error(error.message || "Could not delete recipe");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
              My Recipes
            </p>
            <h1 className="mt-2 text-3xl font-black lg:text-5xl">
              Manage your creations.
            </h1>
            <p className="recipehub-muted-text mt-3">
              View, update, and delete recipes you published.
            </p>
          </div>

          <Link
            href="/dashboard/add-recipe"
            className="btn rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <FiPlusCircle />
            Add Recipe
          </Link>
        </div>
      </div>

      {status === "loading" && <div className="skeleton h-80 rounded-[2rem]" />}

      {status === "error" && (
        <div className="rh-card rounded-[2rem] p-8">
          <h2 className="text-2xl font-black">Could not load recipes.</h2>
        </div>
      )}

      {status === "success" && recipes.length === 0 && (
        <div className="rh-card rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black">No recipes yet.</h2>
          <p className="rh-muted mt-2">Start by publishing your first recipe.</p>
          <Link
            href="/dashboard/add-recipe"
            className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white"
          >
            Add Recipe
          </Link>
        </div>
      )}

      {status === "success" && recipes.length > 0 && (
        <div className="grid gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="rh-card grid gap-4 rounded-[2rem] p-4 md:grid-cols-[120px_1fr_auto]"
            >
              <img
                src={recipe.recipeImage}
                alt={recipe.recipeName}
                className="h-32 w-full rounded-3xl object-cover md:h-full"
              />

              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-success badge-outline">
                    {recipe.category}
                  </span>
                  <span className="badge badge-warning badge-outline">
                    {recipe.status}
                  </span>
                  {recipe.isFeatured && (
                    <span className="badge badge-info badge-outline">Featured</span>
                  )}
                </div>

                <h2 className="mt-3 text-2xl font-black">{recipe.recipeName}</h2>
                <p className="rh-muted mt-1 text-sm">
                  {recipe.cuisineType} • {recipe.difficultyLevel} •{" "}
                  {recipe.preparationTime} • {recipe.likesCount || 0} likes
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-stretch">
                <Link
                  href={`/recipes/${recipe._id}`}
                  className="btn rh-outline-btn rounded-full"
                >
                  <FiEye />
                  View
                </Link>
                <Link
                  href={`/dashboard/my-recipes/${recipe._id}/edit`}
                  className="btn rh-outline-btn rounded-full"
                >
                  <FiEdit3 />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="btn rounded-full border-0 bg-red-500 text-white hover:bg-red-600"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
