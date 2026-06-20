"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiHeart, FiTrendingUp } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { fetcher } from "@/lib/api";
import Image from "next/image";

export default function PopularRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const loadPopularRecipes = async () => {
            try {
                const result = await fetcher("/api/recipes/popular?limit=6");

                setRecipes(result.data || []);
                setStatus("success");
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };

        loadPopularRecipes();
    }, []);

    return (
        <section className="rh-section py-14">
            <div className="grid items-end gap-6 lg:grid-cols-2">
                <SectionHeader
                    align="left"
                    eyebrow="Popular recipes"
                    title="Most loved by the RecipeHub community."
                    description="Recipes with the highest likes will appear here automatically."
                />

                <div className="mb-10 flex justify-start lg:justify-end">
                    <Link
                        href="/recipes"
                        className="btn rh-outline-btn rounded-full px-7 font-black"
                    >
                        View All Recipes
                        <FiArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {status === "loading" && (
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="rh-card rounded-3xl p-4">
                            <div className="skeleton h-56 rounded-3xl" />
                            <div className="mt-5 space-y-3 p-3">
                                <div className="skeleton h-5 w-28" />
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
                        Popular recipes could not be loaded.
                    </p>
                    <p className="rh-muted mt-2">
                        Please make sure the server is running.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length === 0 && (
                <div className="rh-card rounded-3xl p-8 text-center">
                    <p className="rh-title text-xl font-black">
                        No popular recipes yet.
                    </p>
                    <p className="rh-muted mt-2">
                        Recipes will appear here after users start liking them.
                    </p>
                </div>
            )}

            {status === "success" && recipes.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {recipes.map((recipe, index) => (
                        <motion.article
                            key={recipe._id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className="rh-card rounded-3xl p-4"
                        >
                            <Image
                                width={400} height={400}
                                src={recipe.recipeImage}
                                alt={recipe.recipeName}
                                className="h-56 w-full rounded-3xl object-cover"
                            />

                            <div className="p-3 pt-5">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">
                                    <FiHeart size={15} />
                                    {(recipe.likesCount || 0).toLocaleString()} likes
                                </div>

                                <h3 className="rh-title text-2xl font-black leading-tight">
                                    {recipe.recipeName}
                                </h3>

                                <p className="rh-muted mt-3 text-sm font-bold">
                                    By {recipe.authorName}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-sm font-black text-emerald-700">
                                    <FiTrendingUp size={16} />
                                    Trending by likes
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}
        </section>
    );
}