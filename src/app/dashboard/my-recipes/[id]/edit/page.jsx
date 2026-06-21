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

export default function EditRecipePage() {
    const { id } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState("loading");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        apiRequest(`/api/dashboard/my-recipes/${id}`)
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
                });
                setStatus("success");
            })
            .catch((error) => {
                // console.error(error);
                setStatus("error");
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
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

            await apiRequest(`/api/dashboard/my-recipes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            toast.success("Recipe updated");
            router.push("/dashboard/my-recipes");
        } catch (error) {
            toast.error(error.message || "Could not update recipe");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading") {
        return <div className="skeleton h-[520px] rounded-[2rem]" />;
    }

    if (status === "error" || !formData) {
        return (
            <div className="rh-card rounded-[2rem] p-8">
                <h1 className="text-2xl font-black">Recipe not found.</h1>
                <Link href="/dashboard/my-recipes" className="btn mt-4 rounded-full">
                    Back
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <Link href="/dashboard/my-recipes" className="btn rh-outline-btn rounded-full">
                    <FiArrowLeft />
                    Back to My Recipes
                </Link>

                <h1 className="mt-6 text-3xl font-black lg:text-5xl">Update recipe.</h1>
                <p className="recipehub-muted-text mt-3">
                    Polish the information and keep your recipe fresh.
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
                </label>

                <label className="form-control">
                    <span className="label-text mb-2 font-black">Instructions</span>
                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        className="textarea textarea-bordered min-h-36 rounded-2xl"
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
                            Save Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
