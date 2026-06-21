"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Soup", "Dessert"];
const cuisines = [
  "Bangladeshi",
  "Indian",
  "Italian",
  "Mediterranean",
  "Middle Eastern",
  "Asian Fusion",
  "Fusion",
];
const difficultyLevels = ["Easy", "Medium", "Hard"];
const statuses = ["active", "blocked", "pending"];

export default function AdminEditRecipePage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    apiRequest(`/api/admin/recipes/${id}`)
      .then((result) => {
        const recipe = result.data;

        setFormData({
          recipeName: recipe.recipeName || "",
          recipeImage: recipe.recipeImage || "",
          category: recipe.category || "Dinner",
          cuisineType: recipe.cuisineType || "Bangladeshi",
          difficultyLevel: recipe.difficultyLevel || "Easy",
          preparationTime: recipe.preparationTime || "",
          ingredients: (recipe.ingredients || []).join(", "),
          instructions: recipe.instructions || "",
          status: recipe.status || "active",
          isFeatured: Boolean(recipe.isFeatured),
        });

        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        ingredients: formData.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await apiRequest(`/api/admin/recipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Recipe updated successfully");
      router.push("/admin-dashboard/manage-recipes");
    } catch (error) {
      toast.error(error.message || "Could not update recipe");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="skeleton h-155 rounded-[2rem]" />;
  }

  if (status === "error" || !formData) {
    return (
      <div className="rh-card rounded-[2rem] p-10 text-center">
        <h1 className="text-2xl font-black">Recipe could not load.</h1>

        <Link
          href="/admin-dashboard/manage-recipes"
          className="btn mt-5 rounded-full"
        >
          Back to Manage Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
        <Link
          href="/admin-dashboard/manage-recipes"
          className="btn rh-outline-btn rounded-full"
        >
          <FiArrowLeft />
          Back to Manage Recipes
        </Link>

        <h1 className="mt-6 text-3xl font-black lg:text-5xl">
          Edit recipe as admin.
        </h1>

        <p className="recipehub-muted-text mt-3">
          Update content, status, and featured visibility.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rh-card grid gap-5 rounded-[2rem] p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-2 font-black">Recipe Name</span>
            <input
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              className="input input-bordered rounded-2xl"
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Recipe Image URL</span>
            <input
              name="recipeImage"
              value={formData.recipeImage}
              onChange={handleChange}
              className="input input-bordered rounded-2xl"
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Preparation Time</span>
            <input
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              className="input input-bordered rounded-2xl"
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered rounded-2xl"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Cuisine Type</span>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              className="select select-bordered rounded-2xl"
            >
              {cuisines.map((cuisine) => (
                <option key={cuisine}>{cuisine}</option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Difficulty Level</span>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="select select-bordered rounded-2xl"
            >
              {difficultyLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered rounded-2xl"
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-base-300 px-4 py-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="checkbox checkbox-success"
            />
            <span className="font-black">Show in Featured Recipes</span>
          </label>
        </div>

        <label className="form-control">
          <span className="label-text mb-2 font-black">Ingredients</span>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="textarea textarea-bordered min-h-28 rounded-2xl"
            required
          />
          <span className="mt-2 text-xs opacity-60">
            Separate ingredients using commas.
          </span>
        </label>

        <label className="form-control">
          <span className="label-text mb-2 font-black">Instructions</span>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="textarea textarea-bordered min-h-40 rounded-2xl"
            required
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Saving...
            </>
          ) : (
            <>
              <FiSave />
              Save Recipe
            </>
          )}
        </button>
      </form>
    </div>
  );
}