"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiStar } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { fetcher } from "@/lib/api";
import Image from "next/image";

export default function FeaturedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const loadFeaturedRecipes = async () => {
            try {
                const result = await fetcher("/api/recipes/featured?limit=6");

                setRecipes(result.data || []);
                setStatus("success");
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };

        loadFeaturedRecipes();
    }, []);

    return (
        <section className="rh-section py-14">
            <div className="grid items-end gap-6 lg:grid-cols-2">
                <SectionHeader
                    align="left"
                    eyebrow="Featured recipes"
                    title="Handpicked recipes for today’s table."
                    description="Recipes featured by admin will appear here automatically."
                />

                <div className="mb-10 flex justify-start lg:justify-end">
                    <Link
                        href="/recipes"
                        className="btn rh-outline-btn rounded-full px-7 font-black"
                    >
                        Browse All
                        <FiArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {status === "loading" && (
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="rh-card rounded-3xl p-4">
                            <div className="skeleton h-64 rounded-3xl" />
                            <div className="mt-5 space-y-3 p-3">
                                <div className="skeleton h-5 w-24" />
                                <div className="skeleton h-7 w-full" />
                                <div className="skeleton h-5 w-40" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {status === "error" && (
                <div className="rh-card rounded-3xl p-8 text-center">
                    <p className="rh-title text-xl font-black">
                        Featured recipes could not be loaded.
                    </p>
                    <p className="rh-muted mt-2">
                        Please make sure the server is running.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length === 0 && (
                <div className="rh-card rounded-3xl p-8 text-center">
                    <p className="rh-title text-xl font-black">
                        No featured recipes yet.
                    </p>
                    <p className="rh-muted mt-2">
                        Once admin marks recipes as featured, they will appear here.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {recipes.map((recipe, index) => (
                        <motion.article
                            key={recipe._id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
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
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
                                        {recipe.category}
                                    </span>

                                    <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                                        <FiStar size={15} />
                                        Featured
                                    </span>
                                </div>

                                <h3 className="rh-title text-2xl font-black leading-tight">
                                    {recipe.recipeName}
                                </h3>

                                <div className="rh-muted mt-4 flex flex-wrap items-center gap-4 text-sm font-bold">
                                    <span>{recipe.cuisineType}</span>
                                    <span className="flex items-center gap-1">
                                        <FiClock size={15} />
                                        {recipe.preparationTime}
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}
        </section>
    );
}