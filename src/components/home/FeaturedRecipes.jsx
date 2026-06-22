"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiStar } from "react-icons/fi";

import SectionHeader from "./SectionHeader";
import { fetcher } from "@/lib/api";

export default function FeaturedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [status, setStatus] = useState("loading");

    const loadFeaturedRecipes = async () => {
        try {
            setStatus("loading");

            const result = await fetcher("/api/recipes/featured?limit=6");

            setRecipes(result.data || []);
            setStatus("success");
        } catch (error) {
            setRecipes([]);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadFeaturedRecipes();
    }, []);

    return (
        <section className="rh-section py-12 lg:py-16">
            <div className="mb-8 flex w-full flex-col items-start justify-between gap-4 text-left md:flex-row md:items-end">
                <SectionHeader
                    eyebrow="Featured Recipes"
                    title="Handpicked recipes for today’s table."
                    description="Recipes featured by admin will appear here automatically."
                    align="left"
                />

                <Link
                    href="/recipes"
                    className="btn rh-outline-btn self-start rounded-full md:self-auto"
                >
                    Browse All
                    <FiArrowRight />
                </Link>
            </div>

            {status === "loading" && (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="skeleton h-80 rounded-[2rem]" />
                    ))}
                </div>
            )}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h3 className="text-2xl font-black">
                        Featured recipes could not be loaded.
                    </h3>

                    <p className="rh-muted mt-2">
                        Make sure the server is running and NEXT_PUBLIC_API_URL is correct.
                    </p>

                    <button
                        onClick={loadFeaturedRecipes}
                        className="btn mt-5 rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && recipes.length === 0 && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h3 className="text-2xl font-black">No featured recipes yet.</h3>

                    <p className="rh-muted mx-auto mt-2 max-w-xl">
                        Go to Admin Dashboard → Manage Recipes → click the star button.
                        Featured recipes will appear here automatically.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={recipe._id}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: index * 0.06 }}
                            className="rh-card group overflow-hidden rounded-[2rem]"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    width={500}
                                    height={500}
                                    src={recipe.recipeImage}
                                    alt={recipe.recipeName}
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />

                                <div className="absolute left-4 top-4 flex gap-2">
                                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase text-emerald-800">
                                        {recipe.category}
                                    </span>

                                    <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase text-amber-800">
                                        Featured
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="line-clamp-2 text-2xl font-black">
                                    {recipe.recipeName}
                                </h3>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-base-content/60">
                                    <span className="inline-flex items-center gap-1">
                                        <FiStar className="text-amber-500" />
                                        {recipe.cuisineType}
                                    </span>

                                    <span className="inline-flex items-center gap-1">
                                        <FiClock className="text-emerald-600" />
                                        {recipe.preparationTime}
                                    </span>
                                </div>

                                <Link
                                    href={`/recipes/${recipe._id}`}
                                    className="btn mt-5 w-full rounded-full border-0 bg-emerald-600 font-black text-white hover:bg-emerald-700"
                                >
                                    View Details
                                    <FiArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}