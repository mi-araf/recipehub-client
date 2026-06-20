"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiHeart, FiTrendingUp } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { popularRecipes } from "@/data/homeRecipes";
import Image from "next/image";

export default function PopularRecipes() {
    return (
        <section className="rh-section py-14">
            <div className="grid items-end gap-6 lg:grid-cols-2">
                <SectionHeader
                    align="left"
                    eyebrow="Popular recipes"
                    title="Most loved by the RecipeHub community."
                    description="This section will later sort recipes by likes count from MongoDB."
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

            <div className="grid gap-6 lg:grid-cols-3">
                {popularRecipes.map((recipe, index) => (
                    <motion.article
                        key={recipe.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                        className="rh-card rounded-3xl p-4"
                    >
                        <Image
                            width={500}
                            height={500}
                            src={recipe.image}
                            alt={recipe.recipeName}
                            className="h-56 w-full rounded-3xl object-cover"
                        />

                        <div className="p-3 pt-5">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">
                                <FiHeart size={15} />
                                {recipe.likesCount.toLocaleString()} likes
                            </div>

                            <h3 className="rh-title text-2xl font-black leading-tight">
                                {recipe.recipeName}
                            </h3>

                            <p className="rh-muted mt-3 text-sm font-bold">
                                By {recipe.authorName}
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-black text-emerald-700">
                                <FiTrendingUp size={16} />
                                Trending this week
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}