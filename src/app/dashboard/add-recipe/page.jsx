"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiImage, FiSave, FiShield } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";
import { uploadImageToImgbb } from "@/lib/uploadImage";

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

const initialForm = {
    recipeName: "",
    category: "Dinner",
    cuisineType: "Bangladeshi",
    difficultyLevel: "Easy",
    preparationTime: "",
    ingredients: "",
    instructions: "",
};
const getSlotsText = (overview) => {
    const limits = overview?.limits;
    const stats = overview?.stats;

    if (!limits || !stats) return "Loading...";

    if (limits.recipeLimit === "Unlimited") {
        return "Unlimited";
    }

    return `${stats.totalRecipes}/${limits.recipeLimit}`;
};

const getSlotsSubText = (overview) => {
    const plan = overview?.limits?.plan;

    if (plan === "premium") return "Premium Chef • Unlimited publishing";
    if (plan === "plus") return "Plus Chef • 40 recipe slots";
    if (plan === "admin") return "Admin • Unlimited publishing";

    return "Free Chef • 2 recipe slots";
};

const getLimitMessage = (overview) => {
    const plan = overview?.limits?.plan;

    if (plan === "plus") {
        return "Plus chefs can add up to 40 recipes. Upgrade to Premium for unlimited publishing.";
    }

    return "Free chefs can add up to 2 recipes. Upgrade to Plus or Premium to add more.";
};

export default function AddRecipePage() {
    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadOverview = async () => {
        const result = await apiRequest("/api/dashboard/overview");
        setOverview(result.data);
    };

    useEffect(() => {
        loadOverview().catch(() => {
            setStatus("error");
        });
    }, []);

    const limitReached = overview && !overview.limits.canAddRecipe;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (limitReached) {
            toast.error(getLimitMessage(overview));
            return;
        }

        if (!imageFile) {
            toast.error("Please upload a recipe image");
            return;
        }

        try {
            setLoading(true);

            const recipeImage = await uploadImageToImgbb(imageFile);

            const payload = {
                ...formData,
                recipeImage,
                ingredients: formData.ingredients
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            };

            await apiRequest("/api/recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            toast.success("Recipe published successfully");
            setFormData(initialForm);
            setImageFile(null);
            await loadOverview();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Could not add recipe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <Link href="/dashboard" className="btn rh-outline-btn rounded-full">
                    <FiArrowLeft />
                    Back to dashboard
                </Link>

                <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                    <div>
                        <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                            Add Recipe
                        </p>
                        <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                            Publish from your kitchen.
                        </h1>
                        <p className="recipehub-muted-text mt-3 max-w-2xl">
                            Free users can add 2 recipes. Premium users can publish unlimited
                            recipes.
                        </p>
                    </div>

                    {overview && (
                        <div className="rounded-3xl border border-emerald-400/30 bg-white/60 p-4 dark:bg-white/10">
                            <p className="text-xs font-black uppercase tracking-[0.18em] opacity-60">
                                Recipe Slots
                            </p>
                            <p className="mt-1 text-2xl font-black">
                                {getSlotsText(overview)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {limitReached && (
                <div className="rh-card rounded-[2rem] border-amber-300/40 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-4">
                            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                                <FiShield size={22} />
                            </span>
                            <div>
                                <h2 className="text-xl font-black">{getLimitMessage(overview)}</h2>
                                <p className="rh-muted mt-1">
                                    You have used your 2 free recipe slots. Premium will unlock
                                    unlimited recipe publishing and a premium profile badge.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/premium"
                            className="btn rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            View Premium
                        </Link>
                    </div>
                </div>
            )}

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
                        <span className="label-text mb-2 font-black">Preparation Time</span>
                        <input
                            name="preparationTime"
                            value={formData.preparationTime}
                            onChange={handleChange}
                            placeholder="45 minutes"
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
                        <span className="label-text mb-2 flex items-center gap-2 font-black">
                            <FiImage />
                            Recipe Image Upload
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setImageFile(event.target.files[0])}
                            className="file-input file-input-bordered w-full rounded-2xl"
                            required
                        />
                    </label>
                </div>

                <label className="form-control">
                    <span className="label-text mb-2 font-black">Ingredients</span>
                    <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="Rice, chicken, onion, garlic"
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
                        className="textarea textarea-bordered min-h-36 rounded-2xl"
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading || limitReached}
                    className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-sm" />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <FiSave size={18} />
                            Publish Recipe
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
