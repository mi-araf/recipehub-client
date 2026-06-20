"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiArrowLeft, FiImage, FiPlusCircle, FiSave } from "react-icons/fi";
import { uploadImageToImgbb } from "@/lib/uploadImage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export default function AddRecipePage() {
    const [formData, setFormData] = useState({
        recipeName: "",
        category: "Dinner",
        cuisineType: "Bangladeshi",
        difficultyLevel: "Easy",
        preparationTime: "",
        ingredients: "",
        instructions: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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

            const response = await fetch(`${API_URL}/api/recipes`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to add recipe");
            }

            toast.success("Recipe added successfully");

            setFormData({
                recipeName: "",
                category: "Dinner",
                cuisineType: "Bangladeshi",
                difficultyLevel: "Easy",
                preparationTime: "",
                ingredients: "",
                instructions: "",
            });

            setImageFile(null);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Could not add recipe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rh-section py-10 lg:py-14">
            <Link
                href="/dashboard"
                className="mb-6 inline-flex items-center gap-2 text-sm font-black text-emerald-700 transition hover:gap-3"
            >
                <FiArrowLeft size={17} />
                Back to dashboard
            </Link>

            <div className="rh-home-card rounded-3xl px-6 py-12 sm:px-10">
                <div className="mb-10 max-w-2xl">
                    <p className="rh-eyebrow mb-3 text-sm font-black uppercase tracking-widest">
                        Add recipe
                    </p>

                    <h1 className="rh-title text-5xl font-black leading-tight tracking-tight md:text-6xl">
                        Publish a recipe from your kitchen.
                    </h1>

                    <p className="rh-muted mt-5 text-lg leading-8">
                        Normal users can add up to two recipes. Premium users can publish
                        unlimited recipes.
                    </p>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rh-card rounded-3xl p-5 sm:p-7"
                >
                    <div className="grid gap-5 lg:grid-cols-2">
                        <label className="grid gap-2">
                            <span className="font-black">Recipe Name</span>
                            <input
                                type="text"
                                name="recipeName"
                                value={formData.recipeName}
                                onChange={handleChange}
                                placeholder="Golden chicken curry"
                                className="input input-bordered w-full rounded-2xl"
                                required
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="font-black">Preparation Time</span>
                            <input
                                type="text"
                                name="preparationTime"
                                value={formData.preparationTime}
                                onChange={handleChange}
                                placeholder="35 min"
                                className="input input-bordered w-full rounded-2xl"
                                required
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="font-black">Category</span>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="select select-bordered w-full rounded-2xl"
                                required
                            >
                                {categories.map((category) => (
                                    <option key={category}>{category}</option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2">
                            <span className="font-black">Cuisine Type</span>
                            <select
                                name="cuisineType"
                                value={formData.cuisineType}
                                onChange={handleChange}
                                className="select select-bordered w-full rounded-2xl"
                                required
                            >
                                {cuisines.map((cuisine) => (
                                    <option key={cuisine}>{cuisine}</option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2">
                            <span className="font-black">Difficulty Level</span>
                            <select
                                name="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={handleChange}
                                className="select select-bordered w-full rounded-2xl"
                                required
                            >
                                {difficultyLevels.map((level) => (
                                    <option key={level}>{level}</option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2">
                            <span className="font-black">Recipe Image Upload</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => setImageFile(event.target.files[0])}
                                className="file-input file-input-bordered w-full rounded-2xl"
                                required
                            />
                        </label>
                    </div>

                    <label className="mt-5 grid gap-2">
                        <span className="font-black">Ingredients</span>
                        <input
                            type="text"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            placeholder="Chicken, Onion, Garlic, Spices"
                            className="input input-bordered w-full rounded-2xl"
                            required
                        />
                        <span className="rh-muted text-sm font-semibold">
                            Separate ingredients using comma.
                        </span>
                    </label>

                    <label className="mt-5 grid gap-2">
                        <span className="font-black">Instructions</span>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="Write clear cooking steps..."
                            className="textarea textarea-bordered min-h-56 w-full rounded-2xl"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn mt-7 rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
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
                </motion.form>
            </div>
        </section>
    );
}